
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Loader2, Navigation as NavigationIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Simple mapping of voice commands to routes
const commands = [
  { phrases: ["dashboard", "home", "go to dashboard"], route: "/" },
  { phrases: ["profile", "my profile"], route: "/profile" },
  { phrases: ["prescriptions", "medications"], route: "/prescriptions" },
  { phrases: ["exercises", "workouts"], route: "/exercises" },
  { phrases: ["lab tests", "lab", "labs"], route: "/lab-tests" },
  { phrases: ["reminders", "alerts"], route: "/reminders" },
];

const NavigationVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const recognitionRef = useRef<any>();

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const startListening = () => {
    setError(null);
    setTranscript("");
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Speech recognition not supported in your browser.");
      return;
    }
    setIsListening(true);
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);

      // Try to match spoken text to a known route
      const lower = spokenText.toLowerCase();
      const found = commands.find(cmd =>
        cmd.phrases.some(phrase => lower.includes(phrase))
      );
      if (found) {
        navigate(found.route);
      } else {
        setError(`Could not recognize destination: "${spokenText}"`);
      }
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      setError(event.error === "no-speech" ? "No speech detected." : event.error);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2">
      <div className="w-72 bg-white shadow-lg rounded-xl p-3 mb-2 flex flex-col items-center space-y-2">
        <div className="flex items-center gap-2 text-lg font-bold">
          <NavigationIcon className="inline w-5 h-5" /> Navigation Assistant
        </div>

        <button
          onClick={startListening}
          className={`rounded-full p-3 ${
            isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-blue-100 text-blue-600"
          } text-lg flex items-center gap-2`}
          disabled={isListening}
          aria-label="Start voice navigation"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {isListening ? "Listening..." : "Navigate by voice"}
        </button>
        {transcript && <div className="text-gray-600 text-sm">You said: {transcript}</div>}
        {error && <div className="text-red-500 text-xs">{error}</div>}
        <div className="text-xs text-gray-400 mt-1">
          Try commands: "Go to Profile", "Dashboard", "Lab Tests", "Reminders" etc.
        </div>
      </div>
    </div>
  );
};

export default NavigationVoiceAssistant;
