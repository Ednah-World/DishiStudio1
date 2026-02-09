-- Enable the pg_cron extension
create extension if not exists pg_cron;

-- Create the schedule
-- Cron format: min hour day month day_of_week
-- "0 12 */3 * *" means: At minute 0, hour 12, every 3rd day of the month.
-- Wait, */3 means every 3 days.
-- 12 is 12:00 PM (Lunch time).

select
  cron.schedule(
    'lunch-math-reminder', -- name of the cron job
    '0 12 */3 * *',        -- every 3 days at 12:00 PM
    $$
    select
      net.http_post(
          url:='https://ltrdgyraevtxwroukxkt.supabase.co/functions/v1/scheduled-reminder',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
    $$
  );

-- Note: The URL is hardcoded based on the existing supabaseUrl in App.js.
-- Also, passing the service role key securely is tricky in pure SQL without vault.
-- Ideally, we use the `anon` key if the function handles its own auth, but we designed it to bypass RLS.
-- HOWEVER, inside pg_cron, we can't easily access `app.settings.service_role_key` unless we set it.
-- A SAFER and EASIER way for Supabase is to just rely on the anon key if the function
-- is public or checks for a specific secret header.
-- But our function uses `createClient` with Env vars, so the caller just needs to Trigger it.
-- We can use the ANON key here, and inside the function we use the SERVICE_ROLE which is in the ENV.
-- So the caller doesn't need special privs, just needs to reach the endpoint.
-- Let's check `App.js` for the anon key to put in the header.
-- Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0cmRneXJhZXZ0eHdyb3VreGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODA5MDEsImV4cCI6MjA4MTg1NjkwMX0.hERWWr2FjKX9zJJVU3j8JjE2y1ZKJeQCsHyrm1yueEI

-- UPDATED SQL with Anon Key
select
  cron.schedule(
    'lunch-math-reminder',
    '0 12 */3 * *',
    $$
    select
      net.http_post(
          url:='https://ltrdgyraevtxwroukxkt.supabase.co/functions/v1/scheduled-reminder',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0cmRneXJhZXZ0eHdyb3VreGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODA5MDEsImV4cCI6MjA4MTg1NjkwMX0.hERWWr2FjKX9zJJVU3j8JjE2y1ZKJeQCsHyrm1yueEI"}'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
    $$
  );
