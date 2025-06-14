
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string) => string;
  speak: (text: string) => void;
  isSupported: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(supportedLanguages[0]);

  const translations: Record<string, Record<string, string>> = {
    en: {
      dashboard: 'Dashboard',
      profile: 'Profile',
      prescriptions: 'Prescriptions',
      exercises: 'Exercises',
      labTests: 'Lab Tests',
      reminders: 'Reminders',
      welcome: 'Welcome back',
      todaysTasks: "Today's Tasks",
      quickActions: 'Quick Actions',
      takePhoto: 'Take Photo of Prescription',
      findNearby: 'Find Nearby Labs',
      bookAppointment: 'Book Appointment',
      emergencyCall: 'Emergency Call',
      stayOnTrack: 'Stay on track with your care plan',
      active: 'Active',
      today: 'Today',
      overdue: 'Overdue',
      medications: 'Medications',
      takeMedication: 'Take Medication',
      doExercises: 'Do Exercises',
      doctorAppointment: 'Doctor Appointment',
      afterBreakfast: 'after breakfast',
      flexionRoutine: 'Flexion and strengthening routine',
      followUp: 'Follow-up with Dr. Priya Sharma',
      daily: 'Daily',
      appointment: 'Appointment',
      missed: 'Missed',
      todaysProgress: "Today's progress"
    },
    hi: {
      dashboard: 'डैशबोर्ड',
      profile: 'प्रोफाइल',
      prescriptions: 'नुस्खे',
      exercises: 'व्यायाम',
      labTests: 'लैब टेस्ट',
      reminders: 'अनुस्मारक',
      welcome: 'वापस स्वागत है',
      todaysTasks: 'आज के कार्य',
      quickActions: 'त्वरित क्रियाएं',
      takePhoto: 'नुस्खे की फोटो लें',
      findNearby: 'नजदीकी लैब खोजें',
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      emergencyCall: 'आपातकालीन कॉल',
      stayOnTrack: 'अपनी देखभाल योजना पर बने रहें',
      active: 'सक्रिय',
      today: 'आज',
      overdue: 'देर से',
      medications: 'दवाइयां',
      takeMedication: 'दवा लें',
      doExercises: 'व्यायाम करें',
      doctorAppointment: 'डॉक्टर अपॉइंटमेंट',
      afterBreakfast: 'नाश्ते के बाद',
      flexionRoutine: 'फ्लेक्सन और मजबूती रूटीन',
      followUp: 'डॉ. प्रिया शर्मा के साथ फॉलो-अप',
      daily: 'दैनिक',
      appointment: 'अपॉइंटमेंट',
      missed: 'छूट गया',
      todaysProgress: 'आज की प्रगति'
    },
    bn: {
      dashboard: 'ড্যাশবোর্ড',
      profile: 'প্রোফাইল',
      prescriptions: 'প্রেসক্রিপশন',
      exercises: 'ব্যায়াম',
      labTests: 'ল্যাব টেস্ট',
      reminders: 'রিমাইন্ডার',
      welcome: 'স্বাগতম',
      todaysTasks: 'আজকের কাজ',
      quickActions: 'দ্রুত কাজ',
      takePhoto: 'প্রেসক্রিপশনের ছবি তুলুন',
      findNearby: 'কাছাকাছি ল্যাব খুঁজুন',
      bookAppointment: 'অ্যাপয়েন্টমেন্ট বুক করুন',
      emergencyCall: 'জরুরি কল',
      stayOnTrack: 'আপনার যত্ন পরিকল্পনায় থাকুন',
      active: 'সক্রিয়',
      today: 'আজ',
      overdue: 'বিলম্বিত',
      medications: 'ওষুধ',
      takeMedication: 'ওষুধ নিন',
      doExercises: 'ব্যায়াম করুন',
      doctorAppointment: 'ডাক্তার অ্যাপয়েন্টমেন্ট',
      afterBreakfast: 'নাস্তার পরে',
      flexionRoutine: 'ফ্লেক্সন এবং শক্তিশালীকরণ রুটিন',
      followUp: 'ডাঃ প্রিয়া শর্মার সাথে ফলো-আপ',
      daily: 'দৈনিক',
      appointment: 'অ্যাপয়েন্টমেন্ট',
      missed: 'মিস',
      todaysProgress: 'আজকের অগ্রগতি'
    },
    te: {
      dashboard: 'డాష్‌బోర్డ్',
      profile: 'ప్రొఫైల్',
      prescriptions: 'ప్రిస్క్రిప్షన్లు',
      exercises: 'వ్యాయామాలు',
      labTests: 'ల్యాబ్ టెస్ట్‌లు',
      reminders: 'రిమైండర్లు',
      welcome: 'తిరిగి స్వాగతం',
      todaysTasks: 'నేటి పనులు',
      quickActions: 'త్వరిత చర్యలు',
      takePhoto: 'ప్రిస్క్రిప్షన్ ఫోటో తీయండి',
      findNearby: 'సమీపంలోని ల్యాబ్‌లను కనుగొనండి',
      bookAppointment: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
      emergencyCall: 'అత్యవసర కాల్',
      stayOnTrack: 'మీ సంరక్షణ ప్రణాళికలో ఉండండి',
      active: 'క్రియాశీల',
      today: 'ఈరోజు',
      overdue: 'ఆలస్యం',
      medications: 'మందులు',
      takeMedication: 'మందు తీసుకోండి',
      doExercises: 'వ్యాయామాలు చేయండి',
      doctorAppointment: 'డాక్టర్ అపాయింట్‌మెంట్',
      afterBreakfast: 'అల్పాహారం తర్వాత',
      flexionRoutine: 'ఫ్లెక్షన్ మరియు బలపరిచే దినచర్య',
      followUp: 'డాక్టర్ ప్రియా శర్మతో ఫాలో-అప్',
      daily: 'రోజువారీ',
      appointment: 'అపాయింట్‌మెంట్',
      missed: 'మిస్ అయింది',
      todaysProgress: 'నేటి పురోగతి'
    }
  };

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language.code);
  };

  const translate = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage.code;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const isSupported = 'speechSynthesis' in window;

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      translate,
      speak,
      isSupported
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
