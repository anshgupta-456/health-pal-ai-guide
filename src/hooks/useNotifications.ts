
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((perm) => {
          setPermission(perm);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    // Listen for real-time notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const notification = payload.new;
          
          // Get the details based on type
          let title = '';
          let body = '';
          
          if (notification.type === 'prescription') {
            const { data: prescription } = await supabase
              .from('prescriptions')
              .select('medication_name, dosage')
              .eq('id', notification.reference_id)
              .single();
              
            if (prescription) {
              title = `Medication Reminder`;
              body = `Time to take ${prescription.medication_name} (${prescription.dosage})`;
            }
          } else if (notification.type === 'reminder') {
            const { data: reminder } = await supabase
              .from('reminders')
              .select('title, description')
              .eq('id', notification.reference_id)
              .single();
              
            if (reminder) {
              title = `Reminder: ${reminder.title}`;
              body = reminder.description || 'You have a health reminder';
            }
          }

          // Show browser notification
          if (permission === 'granted' && title) {
            new Notification(title, {
              body,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
            });
          }

          // Show toast notification
          toast({
            title,
            description: body,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, permission]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      return perm;
    }
    return 'denied';
  };

  return {
    permission,
    requestPermission,
  };
};
