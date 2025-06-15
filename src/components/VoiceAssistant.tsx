
import React, { useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { askHealthAssistant } from "@/utils/aiHealthAssistant";

const VoiceAssistant = () => {
  const { translate } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (content: string) => {
    setLoading(true);
    const userMsg = { role: "user" as const, content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    try {
      const reply = await askHealthAssistant(newMessages);
      setMessages([...newMessages, { role: "assistant" as const, content: reply }]);
    } catch (err: any) {
      // Try to show detailed error if possible
      let errorMessage = "Sorry, something went wrong.";
      if (err?.message) {
        errorMessage += ` (${err.message})`;
      }
      setMessages([
        ...newMessages,
        { role: "assistant" as const, content: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Use browser speech recognition for input (simple)
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in your browser.");
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
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2">
      {/* Assistant chat popover */}
      <div className="w-80 bg-white shadow-lg rounded-xl p-4 mb-2 space-y-2 max-h-96 overflow-y-auto">
        <div className="text-lg font-bold mb-2 flex gap-2 items-center"><Mic className="inline w-5 h-5" /> Health Assistant</div>
        <div className="space-y-2">
          {messages.length === 0 && (
            <div className="text-gray-500 text-sm">Ask a health question, book an appointment, or ask for advice.</div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-lg px-3 py-2 text-sm whitespace-pre-line ${msg.role === "user"
                ? "bg-blue-100 text-right ml-10"
                : "bg-green-50 mr-10"
                }`}
            >
              <span className={msg.role === "user" ? "font-semibold" : ""}>
                {msg.content}
              </span>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-1 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" /> <span>Thinking...</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 px-3 py-2 border rounded-md"
            placeholder="Type a health question..."
            value={input}
            disabled={loading || isListening}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && input) {
                handleSend(input);
                setInput("");
              }
            }}
          />
          <button
            onClick={() => { if (input) { handleSend(input); setInput(""); } }}
            className="bg-blue-600 text-white rounded-md px-3 py-2 font-bold disabled:opacity-50"
            disabled={!input || loading || isListening}
          >
            Send
          </button>
          <button
            onClick={handleVoiceInput}
            className={`rounded-full p-2 ${isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-200"}`}
            disabled={isListening || loading}
            aria-label="Start voice input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;

