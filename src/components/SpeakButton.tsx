
import { Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SpeakButtonProps {
  text: string;
  className?: string;
}

const SpeakButton = ({ text, className = '' }: SpeakButtonProps) => {
  const { speak, isSupported } = useLanguage();

  if (!isSupported) return null;

  return (
    <button
      onClick={() => speak(text)}
      className={`p-1 hover:bg-gray-100 rounded transition-colors ${className}`}
      title="Read aloud"
    >
      <Volume2 className="w-4 h-4 text-gray-600" />
    </button>
  );
};

export default SpeakButton;
