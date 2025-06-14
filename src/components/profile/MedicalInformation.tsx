
import { Heart, Activity, Calendar, CalendarDays } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SpeakButton from "@/components/SpeakButton";

const MedicalInformation = () => {
  const { translate } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold text-gray-900">{translate("medicalInformation")}</h2>
        <SpeakButton text={translate("medicalInformation")} />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700">{translate("currentCondition")}</p>
                <p className="text-blue-900 font-semibold">{translate("postOpKneeRecovery")}</p>
              </div>
            </div>
            <SpeakButton text={`${translate("currentCondition")}: ${translate("postOpKneeRecovery")}`} />
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700">{translate("treatingPhysician")}</p>
                <p className="text-green-900 font-semibold">{translate("drPriyaSharma")}</p>
              </div>
            </div>
            <SpeakButton text={`${translate("treatingPhysician")}: ${translate("drPriyaSharma")}`} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-700">{translate("lastVisit")}</p>
                  <p className="text-purple-900 font-semibold">15/1/2024</p>
                </div>
              </div>
              <SpeakButton text={`${translate("lastVisit")}: 15/1/2024`} className="scale-75" />
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CalendarDays className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-700">{translate("nextAppointment")}</p>
                  <p className="text-orange-900 font-semibold">15/2/2024</p>
                </div>
              </div>
              <SpeakButton text={`${translate("nextAppointment")}: 15/2/2024`} className="scale-75" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalInformation;
