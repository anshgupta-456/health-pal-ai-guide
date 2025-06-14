
import { useState } from "react";
import { Mic, MicOff } from "lucide-react";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice functionality would be implemented here
    console.log(isListening ? "Stopped listening" : "Started listening");
  };

  return (
    <button
      onClick={toggleListening}
      className={`fixed bottom-24 right-6 p-4 rounded-full shadow-lg transition-all duration-300 ${
        isListening 
          ? "bg-red-500 hover:bg-red-600 animate-pulse" 
          : "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
      }`}
    >
      {isListening ? (
        <MicOff className="w-6 h-6 text-white" />
      ) : (
        <Mic className="w-6 h-6 text-white" />
      )}
    </button>
  );
};

export default VoiceAssistant;
