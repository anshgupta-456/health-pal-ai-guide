
import Layout from "@/components/Layout";
import SpeakButton from "@/components/SpeakButton";
import { Clock, Calendar, CheckCircle, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LabTests = () => {
  const { translate } = useLanguage();

  return (
    <Layout>
      <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{translate("labTests")}</h1>
            <p className="text-blue-100 mt-1">{translate("trackTestResults")}</p>
          </div>
          <SpeakButton text={`${translate("labTests")}. ${translate("trackTestResults")}`} className="text-white" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">1</p>
            <div className="flex items-center justify-center space-x-1">
              <p className="text-xs text-gray-600">{translate("pending")}</p>
              <SpeakButton text={`1 ${translate("pending")}`} className="scale-75" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">1</p>
            <div className="flex items-center justify-center space-x-1">
              <p className="text-xs text-gray-600">{translate("scheduled")}</p>
              <SpeakButton text={`1 ${translate("scheduled")}`} className="scale-75" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">0</p>
            <div className="flex items-center justify-center space-x-1">
              <p className="text-xs text-gray-600">{translate("completed")}</p>
              <SpeakButton text={`0 ${translate("completed")}`} className="scale-75" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <Download className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">1</p>
            <div className="flex items-center justify-center space-x-1">
              <p className="text-xs text-gray-600">{translate("resultsReady")}</p>
              <SpeakButton text={`1 ${translate("resultsReady")}`} className="scale-75" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Test Result */}
      <div className="px-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">🧪</span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{translate("completeBloodCount")}</h3>
                  <SpeakButton text={translate("completeBloodCount")} className="scale-75" />
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {translate("resultsReady")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">{translate("bloodTest")}</p>
                  <SpeakButton text={translate("bloodTest")} className="scale-75" />
                </div>
                <div className="text-xs text-gray-500 space-y-1 mt-1">
                  <div className="flex items-center space-x-2">
                    <p>{translate("scheduledDate")}</p>
                    <SpeakButton text={translate("scheduledDate")} className="scale-75" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <p>{translate("labLocation")}</p>
                    <SpeakButton text={translate("labLocation")} className="scale-75" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">
                {translate("viewReport")}
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-700">{translate("preparationInstructions")}:</p>
              <SpeakButton text={`${translate("preparationInstructions")}: ${translate("fastingRequired")} ${translate("avoidAlcohol")} ${translate("comfortableClothing")} ${translate("bringId")}`} className="scale-75" />
            </div>
            <ul className="text-blue-900 text-sm space-y-1">
              <li>{translate("fastingRequired")}</li>
              <li>{translate("avoidAlcohol")}</li>
              <li>{translate("comfortableClothing")}</li>
              <li>{translate("bringId")}</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-700">{translate("testResults")}:</p>
              <SpeakButton text={`${translate("testResults")}: ${translate("normalRange")} ${translate("hemoglobin")} ${translate("whiteBloodCells")} ${translate("platelets")}`} className="scale-75" />
            </div>
            <p className="text-green-900 text-sm mb-2">{translate("normalRange")}</p>
            <ul className="text-green-800 text-sm space-y-1">
              <li>{translate("hemoglobin")}</li>
              <li>{translate("whiteBloodCells")}</li>
              <li>{translate("platelets")}</li>
            </ul>
            <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
              {translate("downloadFullReport")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LabTests;
