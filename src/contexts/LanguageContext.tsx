import React, { createContext, useState, useContext, useEffect } from 'react';

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
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations = {
  en: {
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
    treatingPhysician: "Treating Physician",
    needAccount: "Need an account? Sign up",
    haveAccount: "Already have an account? Sign in",
    basicInformation: "Basic Information",
    medicalInformation: "Medical Information",
  },
  hi: {
    welcome: "स्वागत",
    dashboardDescription: "एक नज़र में आपका स्वास्थ्य",
    healthStats: "स्वास्थ्य आँकड़े",
    weight: "वज़न",
    bloodPressure: "रक्त चाप",
    cholesterol: "कोलेस्ट्रॉल",
    todaysTasks: "आज के कार्य",
    takeMedication: "दवा लें",
    exercise: "व्यायाम",
    doctorAppointment: "डॉक्टर की अपॉइंटमेंट",
    quickActions: "त्वरित क्रियाएँ",
    addReminder: "अनुस्मारक जोड़ें",
    viewProfile: "प्रोफ़ाइल देखें",
    myPrescriptions: "मेरे नुस्खे",
    medicationsAndInstructions: "दवाएं और निर्देश",
    paracetamol500mg: "पैरासिटामोल 500mg",
    tabletTwiceDaily: "1 गोली दिन में दो बार",
    sevenDays: "7 दिनों के लिए",
    takeAfterMeals: "भोजन के बाद लें",
    painRelieverDescription: "हल्के से मध्यम दर्द से राहत देता है और बुखार कम करता है।",
    ibuprofen400mg: "इबुप्रोफेन 400mg",
    tabletThreeTimesDaily: "1 गोली दिन में तीन बार",
    fiveDays: "5 दिनों के लिए",
    takeWithFood: "भोजन के साथ लें",
    antiInflammatoryDescription: "सूजन कम करता है और दर्द से राहत देता है।",
    nausea: "जी मिचलाना",
    dizziness: "चक्कर आना",
    stomachIrritation: "पेट में जलन",
    headache: "सरदर्द",
    duration: "अवधि",
    instructions: "निर्देश",
    whatThisMedicineDoes: "यह दवा क्या करती है",
    possibleSideEffects: "संभावित दुष्प्रभाव",
    contactDoctor: "यदि दुष्प्रभाव बने रहते हैं तो अपने डॉक्टर से संपर्क करें।",
    markComplete: "पूर्ण चिह्नित करें",
    labTests: "प्रयोगशाला परीक्षण",
    trackTestResults: "अपने परीक्षण परिणामों को ट्रैक करें",
    pending: "लंबित",
    scheduled: "अनुसूचित",
    completed: "पूर्ण",
    resultsReady: "परिणाम तैयार हैं",
    completeBloodCount: "पूर्ण रक्त गणना",
    bloodTest: "रक्त परीक्षण",
    scheduledDate: "निर्धारित तिथि",
    labLocation: "प्रयोगशाला स्थान",
    preparationInstructions: "तैयारी के निर्देश",
    fastingRequired: "उपवास आवश्यक",
    avoidAlcohol: "शराब से बचें",
    comfortableClothing: "आरामदायक कपड़े पहनें",
    bringId: "आईडी लाओ",
    testResults: "परीक्षा परिणाम",
    normalRange: "सामान्य सीमा",
    hemoglobin: "हीमोग्लोबिन",
    whiteBloodCells: "श्वेत रक्त कोशिकाएं",
    platelets: "प्लेटलेट्स",
    downloadFullReport: "पूर्ण रिपोर्ट डाउनलोड करें",
    reminders: "अनुस्मारक",
    stayOnTrack: "अपने स्वास्थ्य पर नज़र रखें",
    active: "सक्रिय",
    today: "आज",
    overdue: "समय सीमा समाप्त",
    medications: "दवाएं",
    afterBreakfast: "नाश्ते के बाद",
    daily: "दैनिक",
    flexionRoutine: "फ्लेक्सन रूटीन",
    appointment: "नियुक्ति",
    followUp: "अनुवर्ती",
    todaysProgress: "आज की प्रगति",
    missed: "चुका हुआ",
    rajeshKumar: "राजेश कुमार",
    age: "आयु",
    years58: "58 साल",
    male: "पुरुष",
    hindi: "हिंदी",
    name: "नाम",
    gender: "लिंग",
    preferredLanguage: "पसंदीदा भाषा",
    currentCondition: "वर्तमान स्थिति",
    postOpKneeRecovery: "ऑपरेशन के बाद घुटने की रिकवरी",
    treatingPhysician: "उपचार करने वाला चिकित्सक",
    drPriyaSharma: "डॉ. प्रिया शर्मा",
    lastVisit: "पिछली मुलाकात",
    nextAppointment: "अगली अपॉइंटमेंट",
    signIn: "साइन इन करें",
    signUp: "साइन अप करें",
    signInDescription: "वापस स्वागत है! कृपया अपने खाते में साइन इन करें।",
    signUpDescription: "स्वास्थ्य ट्रैकिंग शुरू करने के लिए अपना खाता बनाएं।",
    email: "ईमेल",
    password: "पासवर्ड",
    fullName: "पूरा नाम",
    selectGender: "लिंग चुनें",
    other: "अन्य",
    emergencyContactName: "आपातकालीन संपर्क नाम",
    emergencyContactPhone: "आपातकालीन संपर्क फोन",
    separateWithCommas: "कॉमा से अलग करें",
    treatingPhysician: "उपचारकर्ता चिकित्सक",
    needAccount: "खाता चाहिए? साइन अप करें",
    haveAccount: "पहले से खाता है? साइन इन करें",
    basicInformation: "बुनियादी जानकारी",
    medicalInformation: "चिकित्सा जानकारी",
  }
};

const defaultLanguage: Language = {
  code: 'en',
  name: 'English',
  nativeName: 'English'
};

const getNavigatorLanguage = (): string => {
  if (typeof window === 'undefined') {
    return defaultLanguage.code;
  }

  return navigator.language.slice(0, 2) || defaultLanguage.code;
};

const getInitialLanguage = (): Language => {
  const storedLanguageCode = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
  const navigatorLanguageCode = getNavigatorLanguage();

  let initialCode = storedLanguageCode || navigatorLanguageCode;

  if (!['en', 'hi'].includes(initialCode)) {
    initialCode = defaultLanguage.code;
  }

  return {
    code: initialCode,
    name: initialCode === 'en' ? 'English' : 'Hindi',
    nativeName: initialCode === 'en' ? 'English' : 'हिन्दी'
  };
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setLanguage] = useState<Language>(getInitialLanguage());
  const [isSpeechSynthesisSupported, setIsSpeechSynthesisSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSpeechSynthesisSupported('speechSynthesis' in window);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', currentLanguage.code);
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage.code]);

  const translate = (key: string): string => {
    return translations[currentLanguage.code as keyof typeof translations][key] || key;
  };

  const speak = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSpeechSynthesisSupported) {
        reject(new Error('Speech synthesis is not supported in this browser.'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage.code;
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === currentLanguage.code) || null;

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      speechSynthesis.speak(utterance);
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
