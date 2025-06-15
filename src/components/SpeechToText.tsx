
import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SpeechToTextProps {
  onTranscript: (text: string) => void;
  className?: string;
}

const SpeechToText = ({ onTranscript, className = '' }: SpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  const { currentLanguage } = useLanguage();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = currentLanguage.code === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`p-2 rounded-lg transition-colors ${
        isListening
          ? 'bg-red-100 text-red-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${className}`}
      disabled={isListening}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
};

export default SpeechToText;
