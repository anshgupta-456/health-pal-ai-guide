import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface LanguageContextProps {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string) => string;
  speak: (text: string) => Promise<void>;
  isSupported: boolean;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string; // For speech recognition and synthesis
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-US' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechCode: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speechCode: 'as-IN' }
];

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Copy of every key from the "en" translations for reuse in other languages as placeholders
const englishKeys = {
  welcome: "Welcome",
  dashboardDescription: "Your health at a glance",
  healthStats: "Health Stats",
  weight: "Weight",
  bloodPressure: "Blood Pressure",
  cholesterol: "Cholesterol",
  todaysTasks: "Today's Tasks",
  takeMedication: "Take Medication",
  exercise: "Exercise",
  doctorAppointment: "Doctor Appointment",
  quickActions: "Quick Actions",
  addReminder: "Add Reminder",
  viewProfile: "View Profile",
  myPrescriptions: "My Prescriptions",
  medicationsAndInstructions: "Medications and Instructions",
  paracetamol500mg: "Paracetamol 500mg",
  tabletTwiceDaily: "1 tablet twice daily",
  sevenDays: "for 7 days",
  takeAfterMeals: "Take after meals",
  painRelieverDescription: "Relieves mild to moderate pain and reduces fever.",
  ibuprofen400mg: "Ibuprofen 400mg",
  tabletThreeTimesDaily: "1 tablet three times daily",
  fiveDays: "for 5 days",
  takeWithFood: "Take with food",
  antiInflammatoryDescription: "Reduces inflammation and relieves pain.",
  nausea: "Nausea",
  dizziness: "Dizziness",
  stomachIrritation: "Stomach Irritation",
  headache: "Headache",
  duration: "Duration",
  instructions: "Instructions",
  whatThisMedicineDoes: "What this medicine does",
  possibleSideEffects: "Possible Side Effects",
  contactDoctor: "Contact your doctor if side effects persist.",
  markComplete: "Mark Complete",
  labTests: "Lab Tests",
  trackTestResults: "Track your test results",
  pending: "Pending",
  scheduled: "Scheduled",
  completed: "Completed",
  resultsReady: "Results Ready",
  completeBloodCount: "Complete Blood Count",
  bloodTest: "Blood Test",
  scheduledDate: "Scheduled Date",
  labLocation: "Lab Location",
  preparationInstructions: "Preparation Instructions",
  fastingRequired: "Fasting Required",
  avoidAlcohol: "Avoid Alcohol",
  comfortableClothing: "Wear Comfortable Clothing",
  bringId: "Bring ID",
  testResults: "Test Results",
  normalRange: "Normal Range",
  hemoglobin: "Hemoglobin",
  whiteBloodCells: "White Blood Cells",
  platelets: "Platelets",
  downloadFullReport: "Download Full Report",
  reminders: "Reminders",
  stayOnTrack: "Stay on track with your health",
  active: "Active",
  today: "Today",
  overdue: "Overdue",
  medications: "Medications",
  afterBreakfast: "after breakfast",
  daily: "Daily",
  flexionRoutine: "Flexion Routine",
  appointment: "Appointment",
  followUp: "Follow-up",
  todaysProgress: "Today's Progress",
  missed: "Missed",
  rajeshKumar: "Rajesh Kumar",
  age: "Age",
  years58: "58 years",
  male: "Male",
  female: "Female",
  hindi: "Hindi",
  name: "Name",
  gender: "Gender",
  preferredLanguage: "Preferred Language",
  currentCondition: "Current Condition",
  postOpKneeRecovery: "Post-Op Knee Recovery",
  treatingPhysician: "Treating Physician",
  drPriyaSharma: "Dr. Priya Sharma",
  lastVisit: "Last Visit",
  nextAppointment: "Next Appointment",
  signIn: "Sign In",
  signUp: "Sign Up",
  signInDescription: "Welcome back! Please sign in to your account.",
  signUpDescription: "Create your account to get started with health tracking.",
  email: "Email",
  password: "Password",
  fullName: "Full Name",
  selectGender: "Select Gender",
  other: "Other",
  emergencyContactName: "Emergency Contact Name",
  emergencyContactPhone: "Emergency Contact Phone",
  separateWithCommas: "Separate with commas",
  needAccount: "Need an account? Sign up",
  haveAccount: "Already have an account? Sign in",
  basicInformation: "Basic Information",
  medicalInformation: "Medical Information",
  medicalConditions: "Medical Conditions",
  allergies: "Allergies",
  currentMedications: "Current Medications",
  phone: "Phone",
  address: "Address",
  addTest: "Add Test",
  withReports: "With Reports",
  totalTests: "Total Tests",
  addNewLabTest: "Add New Lab Test",
  testName: "Test Name",
  testDate: "Test Date",
  labName: "Lab Name",
  uploadReport: "Upload Report",
  cancel: "Cancel",
  downloadReport: "Download Report",
  analyzeReport: "Analyze Report",
  analyze: "Analyze",
  analysisResults: "Analysis Results",
  summary: "Summary",
  recommendations: "Recommendations",
  abnormalValues: "Abnormal Values",
  normal: "Normal",
  noLabTestsYet: "No lab tests yet. Add your first test to get started.",
  symptom_headache: "Mild Headache",
  advice_headache: "Drink water, rest in a quiet place, and avoid bright screens. If the headache persists or worsens, consult a doctor.",
  symptom_cough: "Mild Cough",
  advice_cough: "Stay hydrated, try warm liquids, and rest. Seek medical attention if cough continues for more than a week.",
  symptom_tiredness: "Mild Tiredness",
  advice_tiredness: "Ensure you are well rested, eat a balanced diet, and avoid overexertion. Persistent tiredness may need a check-up.",
  symptom_runny_nose: "Runny Nose",
  advice_runny_nose: "Use soft tissues, drink warm fluids, and rest. If symptoms are severe or you have trouble breathing, seek care.",
  symptom_sore_throat: "Sore Throat",
  advice_sore_throat: "Gargle with warm salt water and drink warm fluids. If the pain is severe or lasts more than a few days, consult a doctor.",
  check_mild_symptoms: "Check Your Mild Symptoms",
  get_advice: "Get Advice",
  reset: "Reset",
  advice_label: "Advice:",
  advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional.",
  // You can add any new keys here as needed for future translations
};

// Add translations with REAL entries for a few keys in Hindi and Tamil as a DEMO
const translations: Record<string, typeof englishKeys> = {
  en: englishKeys,
  hi: {
    ...englishKeys,
    welcome: "स्वागत है",
    dashboardDescription: "आपका स्वास्थ्य एक नज़र में",
    healthStats: "स्वास्थ्य आँकड़े",
    // Add more as desired for demo
  },
  ta: {
    ...englishKeys,
    welcome: "வரவேற்பு",
    dashboardDescription: "உங்கள் உடல்நிலையை ஒரு பார்வையில்",
    healthStats: "உடல்நிலை الاحصائيات",
  },
  te: { ...englishKeys },
  bn: { ...englishKeys },
  mr: { ...englishKeys },
  gu: { ...englishKeys },
  kn: { ...englishKeys },
  ml: { ...englishKeys },
  pa: { ...englishKeys },
  or: { ...englishKeys },
  as: { ...englishKeys }
};

const defaultLanguage: Language = {
  code: 'en',
  name: 'English',
  nativeName: 'English',
  speechCode: 'en-US'
};

const getNavigatorLanguage = (): string => {
  if (typeof window === 'undefined') {
    return defaultLanguage.code;
  }

  return navigator.language.slice(0, 2) || defaultLanguage.code;
};

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }

  const storedLanguageCode = localStorage.getItem('language');
  const navigatorLanguageCode = getNavigatorLanguage();

  let initialCode = storedLanguageCode || navigatorLanguageCode;

  const supportedCodes = supportedLanguages.map(lang => lang.code);
  if (!supportedCodes.includes(initialCode)) {
    initialCode = defaultLanguage.code;
  }

  return supportedLanguages.find(lang => lang.code === initialCode) || defaultLanguage;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setLanguage] = useState<Language>(defaultLanguage);
  const [isSpeechSynthesisSupported, setIsSpeechSynthesisSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const initialLanguage = getInitialLanguage();
    setLanguage(initialLanguage);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSpeechSynthesisSupported('speechSynthesis' in window);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('language', currentLanguage.code);
      document.documentElement.lang = currentLanguage.code;
    }
  }, [currentLanguage.code, isInitialized]);

  const translate = (key: string): string => {
    // Look up in selected language
    const languageTranslations = translations[currentLanguage.code as keyof typeof translations];
    if (languageTranslations && languageTranslations[key as keyof typeof languageTranslations]) {
      return languageTranslations[key as keyof typeof languageTranslations] as string;
    }
    // Fallback to English
    if (
      translations["en"] &&
      translations["en"][key as keyof (typeof translations)["en"]]
    ) {
      return translations["en"][key as keyof (typeof translations)["en"]] as string;
    }
    // Last resort: show the key
    return key;
  };

  /**
   * Try to speak using the current language.
   * - If the browser does not have a matching voice for the current language,
   *   fall back to English, and show a toast to inform the user.
   */
  const speak = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSpeechSynthesisSupported) {
        reject(new Error("Speech synthesis is not supported in this browser."));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage.speechCode;

      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(
        (voice) =>
          voice.lang === currentLanguage.speechCode ||
          voice.lang.replace("_", "-").toLowerCase().startsWith(currentLanguage.code)
      );

      // If no matching voice, try to fallback to English
      if (!matchingVoice) {
        // Only show toast if not already English or Hindi
        if (currentLanguage.code !== "en" && currentLanguage.code !== "hi") {
          toast({
            title: "Speech not supported",
            description:
              "Text-to-speech for the selected language is not supported on your browser. Reading out in English instead.",
            variant: "destructive",
            duration: 5000,
          });
        }
        // Fallback to English voice and language
        const englishVoice =
          voices.find((voice) => voice.lang === "en-US") ||
          voices.find((voice) => voice.lang.startsWith("en"));
        utterance.lang = "en-US";
        if (englishVoice) utterance.voice = englishVoice;
      } else {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        resolve();
      };
      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const setLanguageContext = (language: Language) => {
    setLanguage(language);
  };

  const value: LanguageContextProps = {
    currentLanguage,
    setLanguage: setLanguageContext,
    translate,
    speak,
    isSupported: isSpeechSynthesisSupported,
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
