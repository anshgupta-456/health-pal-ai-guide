
import { Volume2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

interface EnhancedSpeakButtonProps {
  text: string;
  className?: string;
}

const EnhancedSpeakButton = ({ text, className = '' }: EnhancedSpeakButtonProps) => {
  const { speak, isSupported, currentLanguage } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isSupported) return null;

  const handleSpeak = async () => {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      await speak(text);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={isPlaying}
      className={`p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 ${className}`}
      title={`Read aloud in ${currentLanguage.nativeName}`}
    >
      {isPlaying ? (
        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
      ) : (
        <Volume2 className="w-4 h-4 text-gray-600" />
      )}
    </button>
  );
};

export default EnhancedSpeakButton;
