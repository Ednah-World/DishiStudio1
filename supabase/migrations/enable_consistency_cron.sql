-- Schedule the "Consistency Alert" notification for daily at 12:00 PM
select
  cron.schedule(
    'consistency-check-daily', 
    '0 12 * * *',        -- Daily at 12:00 PM
    $$
    select
      net.http_post(
          url:='https://ltrdgyraevtxwroukxkt.supabase.co/functions/v1/consistency-check',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
    $$
  );
