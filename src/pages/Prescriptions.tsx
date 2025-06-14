
import Layout from "@/components/Layout";
import SpeakButton from "@/components/SpeakButton";
import { Volume2, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Prescriptions = () => {
  const { translate } = useLanguage();

  const medications = [
    {
      name: translate("paracetamol500mg"),
      dosage: translate("tabletTwiceDaily"),
      duration: translate("sevenDays"),
      instructions: translate("takeAfterMeals"),
      description: translate("painRelieverDescription"),
      sideEffects: [translate("nausea"), translate("dizziness")],
      icon: "💊"
    },
    {
      name: translate("ibuprofen400mg"),
      dosage: translate("tabletThreeTimesDaily"),
      duration: translate("fiveDays"),
      instructions: translate("takeWithFood"),
      description: translate("antiInflammatoryDescription"),
      sideEffects: [translate("stomachIrritation"), translate("headache")],
      icon: "💊"
    }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{translate("myPrescriptions")}</h1>
            <p className="text-blue-100 mt-1">{translate("medicationsAndInstructions")}</p>
          </div>
          <SpeakButton text={`${translate("myPrescriptions")}. ${translate("medicationsAndInstructions")}`} className="text-white" />
        </div>
      </div>
      
      <div className="px-4 py-6 space-y-4">
        {medications.map((med, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{med.icon}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{med.name}</h3>
                    <SpeakButton text={med.name} className="scale-75" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600">{med.dosage}</p>
                    <SpeakButton text={med.dosage} className="scale-75" />
                  </div>
                  <p className="text-xs text-gray-500">{translate("duration")}: {med.duration}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 bg-blue-50 rounded-lg">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                </button>
                <button className="p-2 bg-green-50 rounded-lg">
                  <Eye className="w-4 h-4 text-green-600" />
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">
                  {translate("markComplete")}
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-blue-700">{translate("instructions")}:</p>
                  <SpeakButton text={`${translate("instructions")}: ${med.instructions}`} className="scale-75" />
                </div>
                <p className="text-blue-900 text-sm">{med.instructions}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-green-700">{translate("whatThisMedicineDoes")}:</p>
                  <SpeakButton text={`${translate("whatThisMedicineDoes")}: ${med.description}`} className="scale-75" />
                </div>
                <p className="text-green-900 text-sm">{med.description}</p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-yellow-700">{translate("possibleSideEffects")}:</p>
                  <SpeakButton text={`${translate("possibleSideEffects")}: ${med.sideEffects.join(", ")}`} className="scale-75" />
                </div>
                <ul className="text-yellow-900 text-sm space-y-1">
                  {med.sideEffects.map((effect, i) => (
                    <li key={i}>• {effect}</li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-yellow-800 text-xs">{translate("contactDoctor")}</p>
                  <SpeakButton text={translate("contactDoctor")} className="scale-75" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Prescriptions;
