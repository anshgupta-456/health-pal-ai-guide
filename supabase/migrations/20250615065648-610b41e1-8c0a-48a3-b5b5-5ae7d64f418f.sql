
-- Create notifications table to track sent notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('prescription', 'reminder')),
  reference_id UUID NOT NULL, -- prescription or reminder ID
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending',
  notification_method TEXT NOT NULL CHECK (notification_method IN ('email', 'push', 'both')) DEFAULT 'both',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to schedule notifications when prescriptions/reminders are created
CREATE OR REPLACE FUNCTION schedule_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- For prescriptions, schedule based on frequency and duration time
  IF TG_TABLE_NAME = 'prescriptions' AND NEW.is_active = true THEN
    INSERT INTO public.notifications (user_id, type, reference_id, scheduled_time, notification_method)
    VALUES (NEW.user_id, 'prescription', NEW.id, 
           CASE 
             WHEN NEW.duration ~ '^\d{2}:\d{2}$' THEN 
               CURRENT_DATE + NEW.duration::TIME
             ELSE 
               CURRENT_TIMESTAMP + INTERVAL '1 hour'
           END, 
           'both');
  END IF;
  
  -- For reminders, schedule based on reminder_date and reminder_time
  IF TG_TABLE_NAME = 'reminders' AND NEW.is_active = true THEN
    INSERT INTO public.notifications (user_id, type, reference_id, scheduled_time, notification_method)
    VALUES (NEW.user_id, 'reminder', NEW.id,
           CASE 
             WHEN NEW.reminder_date IS NOT NULL AND NEW.reminder_time IS NOT NULL THEN
               (NEW.reminder_date || ' ' || NEW.reminder_time)::TIMESTAMP
             WHEN NEW.reminder_date IS NOT NULL THEN
               NEW.reminder_date::TIMESTAMP + INTERVAL '9 hours'
             ELSE
               CURRENT_TIMESTAMP + INTERVAL '1 hour'
           END,
           'both');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_schedule_prescription_notifications
  AFTER INSERT OR UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION schedule_notifications();

CREATE TRIGGER trigger_schedule_reminder_notifications
  AFTER INSERT OR UPDATE ON public.reminders
  FOR EACH ROW EXECUTE FUNCTION schedule_notifications();

-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job to check and send notifications every minute
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
