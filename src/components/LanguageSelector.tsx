import { useState } from 'react';
import { Globe, ChevronDown, Volume2, AlertCircle } from 'lucide-react';
import { useLanguage, supportedLanguages } from '@/contexts/LanguageContext';

// Helper: Returns true if the selected language has nearly all values equal to English (meaning, not actually translated)
function isMostlyEnglish(currentLanguage: { code: string }, translate: (key: string) => string) {
  if (currentLanguage.code === "en") return false;
  // A small sample of keys to test for real translation
  const testKeys = ["welcome", "dashboardDescription", "healthStats"];
  const english = {
    welcome: "Welcome",
    dashboardDescription: "Your health at a glance",
    healthStats: "Health Stats"
  };
  // If all tested keys match English, warn
  return testKeys.every(
    key => translate(key) === english[key as keyof typeof english]
  );
}

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Add safety check for language context
  let languageContext;
  try {
    languageContext = useLanguage();
  } catch (error) {
    // If LanguageProvider is not available, don't render the component
    return null;
  }

  const { currentLanguage, setLanguage, translate, speak, isSupported } = languageContext;

  const handleLanguageSelect = (language: typeof supportedLanguages[0]) => {
    setLanguage(language);
    setIsOpen(false);
    if (isSupported) {
      speak(`Language changed to ${language.nativeName}`);
    }
  };

  const handleSpeak = (text: string) => {
    speak(text);
  };

  // Determine if a warning should be shown (non-English and values are not actually translated)
  const showTranslationWarning = isMostlyEnglish(currentLanguage, translate);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border z-50 min-w-48">
          <div className="py-2">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group ${
                  currentLanguage.code === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </div>
                {isSupported && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(`${language.nativeName} language`);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {showTranslationWarning && (
        <div className="absolute mt-2 right-0 z-50 w-full bg-yellow-50 border-l-4 border-yellow-400 rounded px-3 py-2 flex items-center text-yellow-900 text-xs shadow-lg space-x-2">
          <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
          <span>
            Only a few elements are translated for this language. Most content will appear in English!
          </span>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
