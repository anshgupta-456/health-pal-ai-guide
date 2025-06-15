
import { useState, useEffect } from "react";
import { Activity, Heart, Weight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SpeakButton from "@/components/SpeakButton";

const HealthStats = () => {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    prescriptions: 0,
    reminders: 0,
    labTests: 0,
    completedTasks: 0
  });

  useEffect(() => {
    if (user) {
      fetchHealthStats();
    }
  }, [user]);

  const fetchHealthStats = async () => {
    try {
      // Fetch prescriptions count
      const { count: prescriptionsCount } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('is_active', true);

      // Fetch active reminders count
      const { count: remindersCount } = await supabase
        .from('reminders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('is_active', true);

      // Fetch lab tests count
      const { count: labTestsCount } = await supabase
        .from('lab_tests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Fetch completed tasks count
      const { count: completedTasksCount } = await supabase
        .from('reminders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('is_completed', true);

      setStats({
        prescriptions: prescriptionsCount || 0,
        reminders: remindersCount || 0,
        labTests: labTestsCount || 0,
        completedTasks: completedTasksCount || 0
      });
    } catch (error) {
      console.error('Error fetching health stats:', error);
    }
  };

  const healthCards = [
    {
      title: "Active Prescriptions",
      value: stats.prescriptions.toString(),
      icon: "💊",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700"
    },
    {
      title: "Active Reminders", 
      value: stats.reminders.toString(),
      icon: "⏰",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700"
    },
    {
      title: "Lab Tests",
      value: stats.labTests.toString(),
      icon: "🧪",
      color: "bg-purple-50 border-purple-200", 
      textColor: "text-purple-700"
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks.toString(),
      icon: "✅",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold text-gray-900">{translate("healthStats")}</h2>
        <SpeakButton text={translate("healthStats")} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {healthCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-xl p-4 border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${card.textColor}`}>
                  {card.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <SpeakButton text={`${card.value} ${card.title}`} className="scale-75" />
                </div>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthStats;
