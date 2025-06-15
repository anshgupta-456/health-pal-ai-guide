
-- Fix the notification scheduling function to properly handle times
CREATE OR REPLACE FUNCTION schedule_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- For prescriptions, schedule based on the duration time (treat as time of day)
  IF TG_TABLE_NAME = 'prescriptions' AND NEW.is_active = true THEN
    INSERT INTO public.notifications (user_id, type, reference_id, scheduled_time, notification_method)
    VALUES (NEW.user_id, 'prescription', NEW.id, 
           CASE 
             WHEN NEW.duration ~ '^\d{2}:\d{2}$' THEN 
               -- If duration is in HH:MM format, schedule for today at that time
               -- If that time has passed, schedule for tomorrow
               CASE 
                 WHEN (CURRENT_DATE + NEW.duration::TIME) > NOW() THEN
                   CURRENT_DATE + NEW.duration::TIME
                 ELSE
                   CURRENT_DATE + INTERVAL '1 day' + NEW.duration::TIME
               END
             ELSE 
               -- Default to 1 hour from now if duration format is invalid
               CURRENT_TIMESTAMP + INTERVAL '1 hour'
           END, 
           'both');
           
    -- Log what we scheduled for debugging
    RAISE NOTICE 'Scheduled prescription notification for % at %', NEW.medication_name, 
      CASE 
        WHEN NEW.duration ~ '^\d{2}:\d{2}$' THEN 
          CASE 
            WHEN (CURRENT_DATE + NEW.duration::TIME) > NOW() THEN
              CURRENT_DATE + NEW.duration::TIME
            ELSE
              CURRENT_DATE + INTERVAL '1 day' + NEW.duration::TIME
          END
        ELSE 
          CURRENT_TIMESTAMP + INTERVAL '1 hour'
      END;
  END IF;
  
  -- For reminders, schedule based on reminder_date and reminder_time
  IF TG_TABLE_NAME = 'reminders' AND NEW.is_active = true THEN
    INSERT INTO public.notifications (user_id, type, reference_id, scheduled_time, notification_method)
    VALUES (NEW.user_id, 'reminder', NEW.id,
           CASE 
             WHEN NEW.reminder_date IS NOT NULL AND NEW.reminder_time IS NOT NULL THEN
               (NEW.reminder_date::TEXT || ' ' || NEW.reminder_time::TEXT)::TIMESTAMP
             WHEN NEW.reminder_date IS NOT NULL THEN
               NEW.reminder_date::TIMESTAMP + INTERVAL '9 hours'
             ELSE
               CURRENT_TIMESTAMP + INTERVAL '1 hour'
           END,
           'both');
           
    -- Log what we scheduled for debugging
    RAISE NOTICE 'Scheduled reminder notification for % at %', NEW.title,
      CASE 
        WHEN NEW.reminder_date IS NOT NULL AND NEW.reminder_time IS NOT NULL THEN
          (NEW.reminder_date::TEXT || ' ' || NEW.reminder_time::TEXT)::TIMESTAMP
        WHEN NEW.reminder_date IS NOT NULL THEN
          NEW.reminder_date::TIMESTAMP + INTERVAL '9 hours'
        ELSE
          CURRENT_TIMESTAMP + INTERVAL '1 hour'
      END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
