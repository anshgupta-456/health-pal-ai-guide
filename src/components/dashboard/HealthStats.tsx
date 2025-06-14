
import { Pill, Activity, CheckCircle, Calendar } from "lucide-react";

const HealthStats = () => {
  const stats = [
    {
      icon: Pill,
      label: "Medications",
      value: "2",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Activity,
      label: "Exercises",
      value: "2",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: "0",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Calendar,
      label: "Days since visit",
      value: "516",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default HealthStats;
