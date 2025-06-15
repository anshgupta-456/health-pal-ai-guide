
-- Enable required extensions for HTTP requests and cron jobs
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Drop the existing cron job if it exists
SELECT cron.unschedule('send-scheduled-notifications') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'send-scheduled-notifications'
);

-- Create a new cron job to check and send notifications every minute
SELECT cron.schedule(
  'send-scheduled-notifications',
  '* * * * *', -- every minute
  $$
  SELECT
    net.http_post(
        url:='https://nknhollhzgdxmdytcwny.supabase.co/functions/v1/send-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rbmhvbGxoemdkeG1keXRjd255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjE1NDcsImV4cCI6MjA2NTQ5NzU0N30.31Xs3B9BiHMOI9LV_kT88GfNiQ84C_NoHSEIQtgLaBI"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);
