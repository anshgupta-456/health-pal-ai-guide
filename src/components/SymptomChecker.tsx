
import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Pre-defined mild symptoms with translation keys
const SYMPTOMS = [
  { 
    key: "headache", 
    labelKey: "symptom_headache", 
    adviceKey: "advice_headache", 
  },
  { 
    key: "cough", 
    labelKey: "symptom_cough", 
    adviceKey: "advice_cough", 
  },
  { 
    key: "tiredness", 
    labelKey: "symptom_tiredness", 
    adviceKey: "advice_tiredness", 
  },
  { 
    key: "runny_nose", 
    labelKey: "symptom_runny_nose", 
    adviceKey: "advice_runny_nose", 
  },
  { 
    key: "sore_throat", 
    labelKey: "symptom_sore_throat", 
    adviceKey: "advice_sore_throat", 
  }
];

const SymptomChecker = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [showAdvice, setShowAdvice] = useState(false);
  const { translate } = useLanguage();

  const toggleSymptom = (key: string) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAdvice(true);
  };

  const handleReset = () => {
    setSelected([]);
    setShowAdvice(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-yellow-500 w-5 h-5" />
        <h2 className="text-lg font-semibold text-gray-900">
          {translate("check_mild_symptoms")}
        </h2>
      </div>
      <form onSubmit={handleCheck} className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {SYMPTOMS.map(symptom => (
            <label
              key={symptom.key}
              className={`flex items-center px-3 py-2 rounded-md border cursor-pointer 
                ${selected.includes(symptom.key) ? "bg-blue-100 border-blue-400" : "bg-gray-50 border-gray-200"}`}
            >
              <input
                type="checkbox"
                checked={selected.includes(symptom.key)}
                onChange={() => toggleSymptom(symptom.key)}
                className="mr-2 accent-blue-500"
              />
              {translate(symptom.labelKey)}
            </label>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={selected.length === 0}
          >
            {translate("get_advice")}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            disabled={selected.length === 0}
          >
            {translate("reset")}
          </button>
        </div>
      </form>
      {showAdvice && selected.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">{translate("advice_label")}</span>
          </div>
          <ul className="list-disc ml-6 space-y-1 text-gray-800">
            {selected.map(key => {
              const symptom = SYMPTOMS.find(s => s.key === key);
              if (!symptom) return null;
              return (
                <li key={key}>
                  <span className="font-semibold">{translate(symptom.labelKey)}:</span>{" "}
                  {translate(symptom.adviceKey)}
                </li>
              );
            })}
          </ul>
          <div className="text-xs text-gray-400 mt-3">
            {translate("advice_disclaimer")}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
