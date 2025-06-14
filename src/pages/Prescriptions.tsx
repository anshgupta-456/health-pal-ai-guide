
import Layout from "@/components/Layout";
import { Volume2, Eye } from "lucide-react";

const Prescriptions = () => {
  const medications = [
    {
      name: "Paracetamol 500mg",
      dosage: "1 tablet • Twice daily",
      duration: "7 days",
      instructions: "Take after meals to avoid stomach upset",
      description: "This is a pain reliever and fever reducer. It helps reduce pain and bring down fever. It's safe when taken as directed.",
      sideEffects: ["Nausea", "Dizziness"],
      icon: "💊"
    },
    {
      name: "Ibuprofen 400mg",
      dosage: "1 tablet • Three times daily",
      duration: "5 days",
      instructions: "Take with food",
      description: "Anti-inflammatory medication that helps reduce swelling and pain.",
      sideEffects: ["Stomach irritation", "Headache"],
      icon: "💊"
    }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 px-4 py-6">
        <h1 className="text-2xl font-bold text-white">My Prescriptions</h1>
        <p className="text-blue-100 mt-1">Medications and instructions</p>
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
                  <h3 className="font-semibold text-gray-900">{med.name}</h3>
                  <p className="text-sm text-gray-600">{med.dosage}</p>
                  <p className="text-xs text-gray-500">Duration: {med.duration}</p>
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
                  Mark Complete
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-700 mb-1">Instructions:</p>
                <p className="text-blue-900 text-sm">{med.instructions}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm font-medium text-green-700 mb-1">What this medicine does:</p>
                <p className="text-green-900 text-sm">{med.description}</p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-sm font-medium text-yellow-700 mb-2">⚠️ Possible side effects:</p>
                <ul className="text-yellow-900 text-sm space-y-1">
                  {med.sideEffects.map((effect, i) => (
                    <li key={i}>• {effect}</li>
                  ))}
                </ul>
                <p className="text-yellow-800 text-xs mt-2">Contact your doctor if you experience any of these symptoms.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Prescriptions;
