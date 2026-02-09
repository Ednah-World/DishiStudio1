// Follow this setup guide to deploy: https://supabase.com/docs/guides/functions/deploy

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import webpush from "npm:web-push@3.6.4";

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
    try {

        // 0. Handle GET request for VAPID Key
        if (req.method === "GET") {
            const url = new URL(req.url);
            const type = url.searchParams.get("type");
            if (type === "VAPID_PUBLIC_KEY") {
                return new Response(JSON.stringify({ vapid_public_key: vapidKeys.publicKey }), {
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        // 1. Initialize Supabase Client with SERVICE ROLE KEY to bypass RLS
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 2. Fetch ALL subscriptions
        const { data: subs, error } = await supabaseAdmin
            .from("push_subscriptions")
            .select("subscription");

        if (error) throw error;

        console.log(`Found ${subs?.length || 0} subscriptions`);

        if (!subs || subs.length === 0) {
            return new Response(JSON.stringify({ message: "No subscriptions to notify" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // 3. Define the "Lunch Math" message
        const payload = JSON.stringify({
            title: "DishiStudio 🧠",
            body: "Your brain is busy, let us handle the lunch math. 🧠 Open DishiStudio to see what 150/- gets you today.",
            url: "/", // Opens the app
        });

        // 4. Send Notifications
        const results = await Promise.allSettled(
            subs.map((sub) =>
                webpush.sendNotification(sub.subscription, payload)
                    .then(() => ({ success: true, sub }))
                    .catch((err) => {
                        if (err.statusCode === 410 || err.statusCode === 404) {
                            // Subscription is gone/expired, prompt for deletion
                            return { success: false, status: 'gone', sub };
                        }
                        throw err;
                    })
            )
        );

        // 5. Cleanup invalid subscriptions
        const failed = results.filter((r) => r.status === 'fulfilled' && r.value.success === false && r.value.status === 'gone');
        if (failed.length > 0) {
            console.log(`Cleaning up ${failed.length} expired subscriptions...`);
            const subsToDelete = failed.map((f) => (f as any).value.sub.subscription);

            // We can't delete by JSON object easily in some SQL dialects, 
            // but here we can try matching the whole jsonb or just ignore for MVP 
            // and let them rot until next cleanup. 
            // For MVP, we will try to delete them one by one or just log it.
            // A better way is to store a device_id or user_id and delete by that.
            // For now, we'll just log.
        }

        return new Response(JSON.stringify({
            success: true,
            sent: results.filter(r => r.status === 'fulfilled').length
        }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
