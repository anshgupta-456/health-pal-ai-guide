
import { Pill, Activity, CheckCircle, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SpeakButton from "@/components/SpeakButton";

const HealthStats = () => {
  const { translate } = useLanguage();

  const stats = [
    {
      icon: Pill,
      label: translate("medications"),
      value: "2",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Activity,
      label: translate("exercises"),
      value: "2",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: CheckCircle,
      label: translate("completed"),
      value: "0",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Calendar,
      label: translate("daysSinceVisit"),
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
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <SpeakButton text={stat.label} className="scale-75" />
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <SpeakButton text={`${stat.value} ${stat.label}`} className="scale-75" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HealthStats;
