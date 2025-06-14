
import { useLanguage } from "@/contexts/LanguageContext";
import SpeakButton from "@/components/SpeakButton";

const QuickActions = () => {
  const { translate } = useLanguage();

  const actions = [
    {
      title: translate("findNearbyLab"),
      icon: "📍",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: translate("bookAppointment"),
      icon: "📅",
      color: "bg-green-50 text-green-600",
    },
    {
      title: translate("reportSideEffect"),
      icon: "⚠️",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold text-gray-900">{translate("quickActions")}</h3>
        <SpeakButton text={translate("quickActions")} />
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} p-4 rounded-xl text-left transition-transform active:scale-95`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{action.icon}</span>
              <span className="font-medium">{action.title}</span>
              <SpeakButton text={action.title} className="scale-75" />
            </div>
          </button>
        ))}
      </div>
      
      {/* Emergency Contacts */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">{translate("emergencyContacts")}</h3>
          <SpeakButton text={translate("emergencyContacts")} />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">📞</span>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-red-700">{translate("emergency108")}</p>
                  <SpeakButton text={translate("emergency108")} className="scale-75" />
                </div>
                <div className="flex items-center space-x-1">
                  <p className="text-xs text-red-600">{translate("medicalEmergency24x7")}</p>
                  <SpeakButton text={translate("medicalEmergency24x7")} className="scale-75" />
                </div>
              </div>
            </div>
          </button>
          
          <button className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">📞</span>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-blue-700">{translate("drPriyaSharma")}</p>
                  <SpeakButton text={translate("drPriyaSharma")} className="scale-75" />
                </div>
                <div className="flex items-center space-x-1">
                  <p className="text-xs text-blue-600">{translate("treatingPhysician")}</p>
                  <SpeakButton text={translate("treatingPhysician")} className="scale-75" />
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
