// Follow this setup guide to deploy: https://supabase.com/docs/guides/functions/deploy

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import webpush from "npm:web-push@3.6.4";

// You must set these in your Supabase Dashboard -> Edge Functions -> Secrets
// VAPID_PUBLIC_KEY
// VAPID_PRIVATE_KEY
// VAPID_SUBJECT (mailto:your-email@example.com)

const vapidKeys = {
    publicKey: Deno.env.get("VAPID_PUBLIC_KEY")!,
    privateKey: Deno.env.get("VAPID_PRIVATE_KEY")!,
    subject: Deno.env.get("VAPID_SUBJECT")!,
};

webpush.setVapidDetails(
    vapidKeys.subject,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

serve(async (req) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { record, type } = await req.json();

        // 1. Determine who to notify and what the message is
        let receiverId;
        let title = "DishiStudio";
        let body = "New activity!";
        let url = "/";

        if (type === "INSERT" && record.sender_id && record.receiver_id) {
            // Friend Request or Activity
            if (record.status === 'pending') {
                // Friend Request
                receiverId = record.receiver_id;
                title = "New Friend Request";
                body = "You have a new friend request!";
            } else if (record.action_type === 'share_meal') {
                // Shared Meal
                receiverId = record.receiver_id;
                title = "New Meal Shared";
                body = `A friend shared ${record.action_details?.meal_name || 'a meal'} with you!`;
            }
        } else if (type === "UPDATE" && record.status === 'accepted') {
            // Friend Request Accepted
            receiverId = record.sender_id; // Notify the original sender
            title = "Friend Request Accepted";
            body = "Your friend request was accepted!";
        }

        if (!receiverId) {
            return new Response(JSON.stringify({ message: "No notification needed" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // 2. Fetch Subscription from Database
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
        );

        // NOTE: You need to create a table 'push_subscriptions' with columns: user_id, subscription (jsonb)
        const { data: subs, error } = await supabaseClient
            .from("push_subscriptions")
            .select("subscription")
            .eq("user_id", receiverId);

        if (error || !subs || subs.length === 0) {
            return new Response(JSON.stringify({ message: "No subscriptions found" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // 3. Send Notifications
        const promises = subs.map((sub) => {
            return webpush.sendNotification(
                sub.subscription,
                JSON.stringify({ title, body, url })
            ).catch(err => {
                if (err.statusCode === 410) {
                    // Delete expired subscription
                    supabaseClient
                        .from("push_subscriptions")
                        .delete()
                        .eq("subscription", sub.subscription);
                }
            });
        });

        await Promise.all(promises);

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
