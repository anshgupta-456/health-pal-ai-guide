
import React, { useState } from "react";
import { askHealthAssistant } from "@/utils/aiHealthAssistant";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface SymptomCheckerProps {
  open: boolean;
  onClose: () => void;
}

const SYSTEM_SUFFIX = "The user has entered/said the following symptoms. Please help summarize what their condition might be, give simple next steps, and flag if they should see a doctor urgently. Keep it simple and kind.";

export default function SymptomChecker({ open, onClose }: SymptomCheckerProps) {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

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
      handleSubmit(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = async (symptomDesc?: string) => {
    const symptoms = (symptomDesc ?? input).trim();
    if (!symptoms) return;
    setLoading(true);
    setReply(null);

    try {
      const ans = await askHealthAssistant([
        { role: "user", content: symptoms + "\n\n" + SYSTEM_SUFFIX }
      ]);
      setReply(ans);
    } catch (e: any) {
      setReply("Sorry, I couldn't analyze your symptoms.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Symptom Checker</DialogTitle>
          <DialogDescription>
            Describe your symptoms below (type or use voice). For emergencies, call a doctor immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-3">
          <input
            className="flex-1 px-3 py-2 border rounded-md"
            placeholder="Describe your symptoms..."
            value={input}
            disabled={loading || isListening}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && input) {
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleVoiceInput}
            className={`rounded-full p-2 ${isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-200"}`}
            disabled={isListening || loading}
            aria-label="Start voice input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={() => handleSubmit()}
            className="bg-green-600 text-white rounded-md px-3 py-2 font-bold disabled:opacity-50"
            disabled={!input || loading || isListening}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
          </button>
        </div>
        <div className="mt-4 min-h-20">
          {reply && (
            <div className="bg-blue-50 px-4 py-3 rounded-lg text-gray-700">
              {reply}
            </div>
          )}
        </div>
        <DialogClose asChild>
          <button className="mt-4 w-full bg-gray-100 rounded-md py-2 font-semibold hover:bg-gray-200">
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
