
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
        // 1. Initialize Supabase Admin Client
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 2. Define dates for the last 3 days
        const today = new Date();
        const dates = [];
        for (let i = 1; i <= 3; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            dates.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
        }

        console.log("Checking consistency for dates:", dates);

        // 3. Query user_activity to find users active on ALL 3 days
        // We do this by fetching all activity for these 3 days and processing in code
        // (For MVP this is fine; for scale, do this in SQL)

        const { data: activities, error: activityError } = await supabaseAdmin
            .from("user_activity")
            .select("user_id, created_at")
            .gte("created_at", `${dates[2]}T00:00:00.000Z`) // Start of 3 days ago
            .lte("created_at", `${dates[0]}T23:59:59.999Z`); // End of yesterday

        if (activityError) throw activityError;

        if (!activities || activities.length === 0) {
            console.log("No recent activity found.");
            return new Response(JSON.stringify({ message: "No active users found" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // Group activity by user and date
        const userActivityDays: Record<string, Set<string>> = {};

        activities.forEach(act => {
            const date = new Date(act.created_at).toISOString().split('T')[0];
            if (dates.includes(date)) {
                if (!userActivityDays[act.user_id]) {
                    userActivityDays[act.user_id] = new Set();
                }
                userActivityDays[act.user_id].add(date);
            }
        });

        // Filter for users with activity on ALL 3 days
        const consistentUserIds = Object.keys(userActivityDays).filter(userId => {
            return userActivityDays[userId].size === 3;
        });

        console.log(`Found ${consistentUserIds.length} consistent users:`, consistentUserIds);

        if (consistentUserIds.length === 0) {
            return new Response(JSON.stringify({ message: "No consistent users found today" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // 4. Fetch subscriptions for these users
        const { data: subs, error: subError } = await supabaseAdmin
            .from("push_subscriptions")
            .select("subscription")
            .in("user_id", consistentUserIds);

        if (subError) throw subError;

        if (!subs || subs.length === 0) {
            return new Response(JSON.stringify({ message: "Consistent users found, but no subscriptions" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // 5. Send Consistency Notification
        const payload = JSON.stringify({
            title: "DishiStudio 🔥",
            body: "Consistency looks good on you, My Guy! 🔥 That’s 3 days of lifting the decision-making load. Let’s make it Day 4—check out today's lunch options.",
            url: "/",
        });

        const results = await Promise.allSettled(
            subs.map((sub) =>
                webpush.sendNotification(sub.subscription, payload)
                    .then(() => ({ success: true }))
                    .catch((err) => {
                        if (err.statusCode === 410) return { success: false, status: 'gone' };
                        throw err;
                    })
            )
        );

        return new Response(JSON.stringify({
            success: true,
            consistent_users: consistentUserIds.length,
            notifications_sent: results.filter(r => r.status === 'fulfilled').length
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
