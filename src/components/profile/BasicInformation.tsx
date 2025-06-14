
import { useLanguage } from "@/contexts/LanguageContext";
import SpeakButton from "@/components/SpeakButton";

const BasicInformation = () => {
  const { translate } = useLanguage();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{translate("basicInformation")}</h2>
        <SpeakButton text={translate("basicInformation")} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">{translate("name")}</label>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900">{translate("rajeshKumar")}</p>
            <SpeakButton text={translate("rajeshKumar")} className="scale-75" />
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">{translate("age")}</label>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900">{translate("years58")}</p>
            <SpeakButton text={translate("years58")} className="scale-75" />
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">{translate("gender")}</label>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900">{translate("male")}</p>
            <SpeakButton text={translate("male")} className="scale-75" />
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">{translate("preferredLanguage")}</label>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900">{translate("hindi")}</p>
            <SpeakButton text={translate("hindi")} className="scale-75" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
