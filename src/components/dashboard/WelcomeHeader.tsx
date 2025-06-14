
import { useLanguage } from "@/contexts/LanguageContext";
import SpeakButton from "@/components/SpeakButton";
import LanguageSelector from "@/components/LanguageSelector";

const WelcomeHeader = () => {
  const { translate } = useLanguage();

  return (
    <div className="relative">
      {/* Header with logo and controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">💚</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">MedCare Assistant</h1>
              <SpeakButton text="MedCare Assistant" className="scale-75" />
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600">{translate("yourHealthCompanion")}</p>
              <SpeakButton text={translate("yourHealthCompanion")} className="scale-75" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <LanguageSelector />
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-green-400 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-2xl font-bold">{translate("welcomeBack")} 👋</h2>
            <SpeakButton text={translate("welcomeBack")} className="text-white" />
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <p className="text-blue-100">{translate("yourHealthCompanionGuide")}</p>
            <SpeakButton text={translate("yourHealthCompanionGuide")} className="text-white scale-75" />
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-blue-100">{translate("lastVisitJan15")}</p>
            <SpeakButton text={translate("lastVisitJan15")} className="text-white scale-75" />
          </div>
          
          <div className="mt-4 bg-blue-400/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm font-medium text-blue-100">{translate("currentCondition")}:</p>
              <SpeakButton text={translate("currentCondition")} className="text-white scale-75" />
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-white font-semibold">{translate("postOpKneeRecovery")}</p>
              <SpeakButton text={translate("postOpKneeRecovery")} className="text-white scale-75" />
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 bg-green-400 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-xs text-white">{translate("nextAppointment")}</p>
            <SpeakButton text={translate("nextAppointment")} className="text-white scale-75" />
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-lg font-bold text-white">{translate("feb15")}</p>
            <SpeakButton text={translate("feb15")} className="text-white scale-75" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
