
import { Volume2, Globe } from "lucide-react";

const WelcomeHeader = () => {
  return (
    <div className="relative">
      {/* Header with logo and controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">💚</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MedCare Assistant</h1>
            <p className="text-sm text-gray-600">Your health companion</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg bg-white shadow-sm border">
            <Volume2 className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg bg-white shadow-sm border">
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="ml-1 text-sm text-gray-600">EN</span>
          </button>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-green-400 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back, Rajesh Kumar! 👋</h2>
          <p className="text-blue-100 mb-4">Your health companion is here to guide you</p>
          <p className="text-sm text-blue-100">Last visit: Jan 15, 2024</p>
          
          <div className="mt-4 bg-blue-400/30 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-100">Current condition:</p>
            <p className="text-white font-semibold">Post-operative knee recovery</p>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 bg-green-400 rounded-lg p-3">
          <p className="text-xs text-white">Next appointment</p>
          <p className="text-lg font-bold text-white">Feb 15</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
