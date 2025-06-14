
import { useLanguage } from "@/contexts/LanguageContext";
import SpeakButton from "@/components/SpeakButton";

const ProfileHeader = () => {
  const { translate } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 px-4 py-8">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-2xl text-white">👤</span>
        </div>
        <div className="text-white flex-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">{translate("rajeshKumar")}</h1>
            <SpeakButton text={translate("rajeshKumar")} className="text-white" />
          </div>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{translate("age")}: {translate("years58")}</span>
              <SpeakButton text={`${translate("age")}: ${translate("years58")}`} className="text-white scale-75" />
            </div>
            <div className="flex items-center space-x-1">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{translate("male")}</span>
              <SpeakButton text={translate("male")} className="text-white scale-75" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
