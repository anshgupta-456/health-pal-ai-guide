
import { useState, useEffect } from "react";
import { Clock, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SpeakButton from "@/components/SpeakButton";

interface Task {
  id: string;
  title: string;
  type: string;
  time?: string;
  completed: boolean;
}

const TodaysTasks = () => {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTodaysTasks();
    }
  }, [user]);

  const fetchTodaysTasks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's reminders
      const { data: reminders, error: remindersError } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user?.id)
        .eq('reminder_date', today)
        .eq('is_active', true);

      if (remindersError) throw remindersError;

      // Fetch active prescriptions for medication reminders
      const { data: prescriptions, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (prescriptionsError) throw prescriptionsError;

      const todaysTasks: Task[] = [];

      // Add reminders as tasks
      reminders?.forEach(reminder => {
        todaysTasks.push({
          id: reminder.id,
          title: reminder.title,
          type: reminder.reminder_type,
          time: reminder.reminder_time,
          completed: reminder.is_completed
        });
      });

      // Add medication tasks from prescriptions if no specific reminders
      prescriptions?.forEach(prescription => {
        const hasReminderForMedication = reminders?.some(r => 
          r.reminder_type === 'medication' && 
          r.title.toLowerCase().includes(prescription.medication_name.toLowerCase())
        );
        
        if (!hasReminderForMedication) {
          todaysTasks.push({
            id: `med-${prescription.id}`,
            title: `Take ${prescription.medication_name}`,
            type: 'medication',
            time: undefined,
            completed: false
          });
        }
      });

      setTasks(todaysTasks);
    } catch (error) {
      console.error('Error fetching today\'s tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'medication': return '💊';
      case 'appointment': return '👨‍⚕️';
      case 'exercise': return '🏃‍♂️';
      case 'test': return '🧪';
      default: return '📋';
    }
  };

  const markTaskComplete = async (taskId: string) => {
    try {
      if (taskId.startsWith('med-')) {
        // This is a prescription-based task, create a completion record
        // For now, just update local state
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        ));
      } else {
        // This is a reminder task
        const { error } = await supabase
          .from('reminders')
          .update({ is_completed: true })
          .eq('id', taskId);

        if (error) throw error;
        fetchTodaysTasks();
      }
    } catch (error) {
      console.error('Error marking task complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{translate("todaysTasks")}</h2>
        <SpeakButton text={translate("todaysTasks")} />
      </div>
      
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tasks for today!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                task.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getTaskIcon(task.type)}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className={`font-medium ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <SpeakButton text={task.title} className="scale-75" />
                  </div>
                  {task.time && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{task.time}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {!task.completed && (
                <button
                  onClick={() => markTaskComplete(task.id)}
                  className="p-1 text-blue-600 hover:bg-blue-200 rounded"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodaysTasks;
