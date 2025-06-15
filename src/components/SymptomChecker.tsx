
import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

// Pre-defined mild symptoms and basic advice
const SYMPTOMS = [
  { 
    key: "headache", 
    label: "Mild Headache", 
    advice: "Drink water, rest in a quiet place, and avoid bright screens. If the headache persists or worsens, consult a doctor.", 
  },
  { 
    key: "cough", 
    label: "Mild Cough", 
    advice: "Stay hydrated, try warm liquids, and rest. Seek medical attention if cough continues for more than a week.", 
  },
  { 
    key: "tiredness", 
    label: "Mild Tiredness", 
    advice: "Ensure you are well rested, eat a balanced diet, and avoid overexertion. Persistent tiredness may need a check-up.", 
  },
  { 
    key: "runny_nose", 
    label: "Runny Nose", 
    advice: "Use soft tissues, drink warm fluids, and rest. If symptoms are severe or you have trouble breathing, seek care.", 
  },
  { 
    key: "sore_throat", 
    label: "Sore Throat", 
    advice: "Gargle with warm salt water and drink warm fluids. If the pain is severe or lasts more than a few days, consult a doctor.", 
  }
];

const SymptomChecker = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [showAdvice, setShowAdvice] = useState(false);

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
        <h2 className="text-lg font-semibold text-gray-900">Check Your Mild Symptoms</h2>
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
              {symptom.label}
            </label>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={selected.length === 0}
          >
            Get Advice
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            disabled={selected.length === 0}
          >
            Reset
          </button>
        </div>
      </form>
      {showAdvice && selected.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Advice:</span>
          </div>
          <ul className="list-disc ml-6 space-y-1 text-gray-800">
            {selected.map(key => {
              const symptom = SYMPTOMS.find(s => s.key === key);
              return (
                <li key={key}>
                  <span className="font-semibold">{symptom?.label}:</span>{" "}
                  {symptom?.advice}
                </li>
              );
            })}
          </ul>
          <div className="text-xs text-gray-400 mt-3">
            If symptoms are severe or you feel unwell, please consult a healthcare professional.
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
