
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Simple set of phrase mappings
const VOICE_ROUTES = [
  { route: "/", keywords: ["home", "dashboard", "main"] },
  { route: "/profile", keywords: ["profile", "my profile", "your profile"] },
  { route: "/prescriptions", keywords: ["prescriptions", "medicine", "my prescriptions"] },
  { route: "/exercises", keywords: ["exercises", "exercise", "workout"] },
  { route: "/lab-tests", keywords: ["lab", "lab tests", "test", "tests", "laboratory"] },
  { route: "/reminders", keywords: ["reminders", "reminder", "show reminders", "show my reminders"] },
];

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Speech Recognition API init
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // Only en-US, for now (could be dynamic)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        handleTranscript(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
    // No cleanup needed
  }, []);

  // Command parsing for navigation
  function handleTranscript(transcript: string) {
    // Try to match known navigation commands
    let routed = false;
    for (const entry of VOICE_ROUTES) {
      if (entry.keywords.some(word => transcript.includes(word))) {
        if (location.pathname !== entry.route) {
          navigate(entry.route);
        }
        routed = true;
        break;
      }
    }
    // If not routed, try a generic feedback (expand with more AI later)
    if (!routed) {
      alert(translate("Sorry, I didn't understand. You can say: lab tests, reminders, prescriptions, profile, dashboard, etc."));
    }
  }

  // Handle mic button toggle
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in your browser.");
      return;
    }
    setIsListening((prev) => {
      if (!prev) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
      return !prev;
    });
  };

  return (
    <button
      onClick={toggleListening}
      className={`fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300
        ${isListening
          ? "bg-red-500 hover:bg-red-600 animate-pulse"
          : "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
        }`}
      aria-label={isListening ? "Stop listening" : "Start voice assistant"}
      title={isListening ? "Stop listening" : "Start voice assistant"}
      type="button"
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
