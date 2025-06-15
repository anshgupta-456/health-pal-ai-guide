
import { useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NotificationSetup = () => {
  const { permission, requestPermission } = useNotifications();

  if (permission === 'granted') {
    return null; // Don't show if already granted
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Enable Notifications</span>
        </CardTitle>
        <CardDescription>
          Get real-time notifications for your medications and health reminders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {permission === 'denied' ? (
              <BellOff className="w-4 h-4 text-red-500" />
            ) : (
              <Bell className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm">
              {permission === 'denied' 
                ? 'Notifications blocked - please enable in browser settings'
                : 'Click to enable browser notifications'
              }
            </span>
          </div>
          {permission === 'default' && (
            <Button onClick={requestPermission} size="sm">
              Enable Notifications
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSetup;
