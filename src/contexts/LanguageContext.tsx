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
      // Common
      dashboard: 'Dashboard',
      profile: 'Profile',
      prescriptions: 'Prescriptions',
      exercises: 'Exercises',
      labTests: 'Lab Tests',
      reminders: 'Reminders',
      welcome: 'Welcome back',
      
      // Dashboard specific
      yourHealthCompanion: 'Your health companion',
      welcomeBack: 'Welcome back, Rajesh Kumar!',
      yourHealthCompanionGuide: 'Your health companion is here to guide you',
      lastVisitJan15: 'Last visit: Jan 15, 2024',
      feb15: 'Feb 15',
      daysSinceVisit: 'Days since visit',
      todaysTasks: "Today's Tasks",
      kneeFlexionRoutine: 'Knee flexion routine',
      quickActions: 'Quick Actions',
      findNearbyLab: 'Find nearby lab',
      bookAppointment: 'Book appointment',
      reportSideEffect: 'Report side effect',
      emergencyContacts: 'Emergency Contacts',
      emergency108: 'Emergency: 108',
      medicalEmergency24x7: '24/7 Medical Emergency',
      
      // Profile Page
      basicInformation: 'Basic Information',
      medicalInformation: 'Medical Information',
      name: 'Name',
      age: 'Age',
      gender: 'Gender',
      preferredLanguage: 'Preferred Language',
      currentCondition: 'Current condition',
      treatingPhysician: 'Your treating physician',
      lastVisit: 'Last visit',
      nextAppointment: 'Next appointment',
      rajeshKumar: 'Rajesh Kumar',
      years58: '58 years',
      male: 'Male',
      hindi: 'Hindi',
      postOpKneeRecovery: 'Post-operative knee recovery',
      drPriyaSharma: 'Dr. Priya Sharma',
      
      // Reminders Page
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
      todaysProgress: "Today's progress",
      
      // Prescriptions Page
      myPrescriptions: 'My Prescriptions',
      medicationsAndInstructions: 'Medications and instructions',
      paracetamol500mg: 'Paracetamol 500mg',
      ibuprofen400mg: 'Ibuprofen 400mg',
      tabletTwiceDaily: '1 tablet • Twice daily',
      tabletThreeTimesDaily: '1 tablet • Three times daily',
      sevenDays: '7 days',
      fiveDays: '5 days',
      takeAfterMeals: 'Take after meals to avoid stomach upset',
      takeWithFood: 'Take with food',
      painRelieverDescription: 'This is a pain reliever and fever reducer. It helps reduce pain and bring down fever. It\'s safe when taken as directed.',
      antiInflammatoryDescription: 'Anti-inflammatory medication that helps reduce swelling and pain.',
      instructions: 'Instructions:',
      whatThisMedicineDoes: 'What this medicine does:',
      possibleSideEffects: '⚠️ Possible side effects:',
      nausea: 'Nausea',
      dizziness: 'Dizziness',
      stomachIrritation: 'Stomach irritation',
      headache: 'Headache',
      contactDoctor: 'Contact your doctor if you experience any of these symptoms.',
      markComplete: 'Mark Complete',
      duration: 'Duration',
      
      // Lab Tests Page
      trackTestResults: 'Track your test results and appointments',
      pending: 'Pending',
      scheduled: 'Scheduled',
      completed: 'Completed',
      resultsReady: 'Results Ready',
      completeBloodCount: 'Complete Blood Count (CBC)',
      bloodTest: 'Blood Test',
      scheduledDate: 'Scheduled: 10/1/2024',
      labLocation: 'Lab: City Diagnostic Center',
      viewReport: 'View Report',
      preparationInstructions: 'Preparation Instructions:',
      fastingRequired: '• Fasting required for 8-10 hours',
      avoidAlcohol: '• Avoid alcohol 24 hours before test',
      comfortableClothing: '• Wear comfortable clothing',
      bringId: '• Bring ID and prescription',
      testResults: 'Test Results:',
      normalRange: 'All values are within normal range. Your blood count shows healthy levels.',
      hemoglobin: '• Hemoglobin: 14.2 g/dL (Normal)',
      whiteBloodCells: '• White Blood Cells: 7,200/μL (Normal)',
      platelets: '• Platelets: 280,000/μL (Normal)',
      downloadFullReport: 'Download Full Report',
      
      // Exercises Page
      exerciseRoutines: 'Exercise Routines',
      prescribedExercises: 'Prescribed exercises for recovery',
      kneeFlexion: 'Knee Flexion',
      quadricepsStrengthening: 'Quadriceps Strengthening',
      easy: 'easy',
      medium: 'medium',
      hard: 'hard',
      slowlyBendKnee: 'Slowly bend and straighten your knee while sitting',
      tightenThighMuscles: 'Tighten thigh muscles and hold for 5 seconds',
      tenMin: '10 min',
      fifteenMin: '15 min',
      fifteenReps: '15 reps',
      tenReps: '10 reps',
      positionComfortably: 'Position yourself comfortably',
      followMovements: 'Follow the movements shown in the camera preview',
      moveSlowly: 'Move slowly and controlled',
      listenToCoach: 'Listen to the AI coach feedback',
      stopIfPain: 'Stop if you feel pain',
      lieDown: 'Lie down comfortably',
      tightenThigh: 'Tighten your thigh muscles',
      holdFiveSeconds: 'Hold for 5 seconds',
      relaxRepeat: 'Relax and repeat',
      progress: 'Progress',
      notStarted: 'Not started',
      start: 'Start'
    },
    hi: {
      // Common
      dashboard: 'डैशबोर्ड',
      profile: 'प्रोफाइल',
      prescriptions: 'नुस्खे',
      exercises: 'व्यायाम',
      labTests: 'लैब टेस्ट',
      reminders: 'अनुस्मारक',
      welcome: 'वापस स्वागत है',
      
      // Dashboard specific
      yourHealthCompanion: 'आपका स्वास्थ्य साथी',
      welcomeBack: 'वापस स्वागत है, राजेश कुमार!',
      yourHealthCompanionGuide: 'आपका स्वास्थ्य साथी आपका मार्गदर्शन करने के लिए यहां है',
      lastVisitJan15: 'अंतिम मुलाकात: 15 जनवरी, 2024',
      feb15: '15 फरवरी',
      daysSinceVisit: 'मुलाकात के बाद से दिन',
      todaysTasks: 'आज के कार्य',
      kneeFlexionRoutine: 'घुटने का फ्लेक्सन रूटीन',
      quickActions: 'त्वरित कार्य',
      findNearbyLab: 'नजदीकी लैब खोजें',
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      reportSideEffect: 'साइड इффेक्ट की रिपोर्ट करें',
      emergencyContacts: 'आपातकालीन संपर्क',
      emergency108: 'आपातकाल: 108',
      medicalEmergency24x7: '24/7 चिकित्सा आपातकाल',
      
      // Profile Page
      basicInformation: 'बुनियादी जानकारी',
      medicalInformation: 'चिकित्सा जानकारी',
      name: 'नाम',
      age: 'आयु',
      gender: 'लिंग',
      preferredLanguage: 'पसंदीदा भाषा',
      currentCondition: 'वर्तमान स्थिति',
      treatingPhysician: 'आपके डॉक्टर',
      lastVisit: 'अंतिम मुलाकात',
      nextAppointment: 'अगली अपॉइंटमेंट',
      rajeshKumar: 'राजेश कुमार',
      years58: '58 वर्ष',
      male: 'पुरुष',
      hindi: 'हिंदी',
      postOpKneeRecovery: 'घुटने की सर्जरी के बाद रिकवरी',
      drPriyaSharma: 'डॉ. प्रिया शर्मा',
      
      // Reminders Page
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
      todaysProgress: 'आज की प्रगति',
      
      // Prescriptions Page
      myPrescriptions: 'मेरी दवाएं',
      medicationsAndInstructions: 'दवाएं और निर्देश',
      paracetamol500mg: 'पैरासिटामोल 500mg',
      ibuprofen400mg: 'इबुप्रोफेन 400mg',
      tabletTwiceDaily: '1 गोली • दिन में दो बार',
      tabletThreeTimesDaily: '1 गोली • दिन में तीन बार',
      sevenDays: '7 दिन',
      fiveDays: '5 दिन',
      takeAfterMeals: 'पेट खराब न हो इसलिए खाने के बाद लें',
      takeWithFood: 'खाने के साथ लें',
      painRelieverDescription: 'यह दर्द निवारक और बुखार कम करने वाली दवा है। यह दर्द कम करने और बुखार उतारने में मदद करती है। निर्देशों के अनुसार लेने पर सुरक्षित है।',
      antiInflammatoryDescription: 'सूजन कम करने वाली दवा जो सूजन और दर्द कम करने में मदद करती है।',
      instructions: 'निर्देश:',
      whatThisMedicineDoes: 'यह दवा क्या करती है:',
      possibleSideEffects: '⚠️ संभावित साइड इффेक्ट्स:',
      nausea: 'मतली',
      dizziness: 'चक्कर आना',
      stomachIrritation: 'पेट में जलन',
      headache: 'सिरदर्द',
      contactDoctor: 'यदि आप इनमें से कोई भी लक्षण महसूस करते हैं तो अपने डॉक्टर से संपर्क करें।',
      markComplete: 'पूरा करने का निशान लगाएं',
      duration: 'अवधि',
      
      // Lab Tests Page
      trackTestResults: 'अपने टेस्ट परिणामों और अपॉइंटमेंट्स को ट्रैक करें',
      pending: 'लंबित',
      scheduled: 'निर्धारित',
      completed: 'पूर्ण',
      resultsReady: 'परिणाम तैयार',
      completeBloodCount: 'संपूर्ण रक्त गणना (CBC)',
      bloodTest: 'रक्त परीक्षण',
      scheduledDate: 'निर्धारित: 10/1/2024',
      labLocation: 'लैब: सिटी डायग्नोस्टिक सेंटर',
      viewReport: 'रिपोर्ट देखें',
      preparationInstructions: 'तैयारी के निर्देश:',
      fastingRequired: '• 8-10 घंटे उपवास आवश्यक',
      avoidAlcohol: '• टेस्ट से 24 घंटे पहले शराब से बचें',
      comfortableClothing: '• आरामदायक कपड़े पहनें',
      bringId: '• ID और प्रिस्क्रिप्शन लाएं',
      testResults: 'टेस्ट परिणाम:',
      normalRange: 'सभी मान सामान्य सीमा में हैं। आपकी रक्त गणना स्वस्थ स्तर दिखाती है।',
      hemoglobin: '• हीमोग्लोबिन: 14.2 g/dL (सामान्य)',
      whiteBloodCells: '• श्वेत रक्त कोशिकाएं: 7,200/μL (सामान्य)',
      platelets: '• प्लेटलेट्स: 280,000/μL (सामान्य)',
      downloadFullReport: 'पूरी रिपोर्ट डाउनलोड करें',
      
      // Exercises Page
      exerciseRoutines: 'व्यायाम दिनचर्या',
      prescribedExercises: 'रिकवरी के लिए निर्धारित व्यायाम',
      kneeFlexion: 'घुटने का फ्लेक्सन',
      quadricepsStrengthening: 'क्वाड्रिसेप्स मजबूती',
      easy: 'आसान',
      medium: 'मध्यम',
      hard: 'कठिन',
      slowlyBendKnee: 'बैठकर धीरे-धीरे अपने घुटने को मोड़ें और सीधा करें',
      tightenThighMuscles: 'जांघ की मांसपेशियों को कसें और 5 सेकंड तक रोकें',
      tenMin: '10 मिनट',
      fifteenMin: '15 मिनट',
      fifteenReps: '15 बार',
      tenReps: '10 बार',
      positionComfortably: 'आराम से स्थिति में आएं',
      followMovements: 'कैमरा प्रीव्यू में दिखाई गई गतिविधियों का पालन करें',
      moveSlowly: 'धीरे और नियंत्रित तरीके से चलें',
      listenToCoach: 'AI कोच की फीडबैक सुनें',
      stopIfPain: 'दर्द महसूस हो तो रुकें',
      lieDown: 'आराम से लेट जाएं',
      tightenThigh: 'अपनी जांघ की मांसपेशियों को कसें',
      holdFiveSeconds: '5 सेकंड तक रोकें',
      relaxRepeat: 'आराम करें और दोहराएं',
      progress: 'प्रगति',
      notStarted: 'शुरू नहीं हुआ',
      start: 'शुरू करें'
    },
    // Adding Bengali translations
    bn: {
      dashboard: 'ড্যাশবোর্ড',
      profile: 'প্রোফাইল',
      prescriptions: 'প্রেসক্রিপশন',
      exercises: 'ব্যায়াম',
      labTests: 'ল্যাব টেস্ট্‌লు',
      reminders: 'রিমైন্ডার্লు',
      welcome: 'স্বাগতম',
      basicInformation: 'মৌলিক তথ্য',
      medicalInformation: 'চিকিৎসা সংক্রান্ত তথ্য',
      name: 'নাম',
      age: 'বয়স',
      gender: 'লিঙ্গ',
      preferredLanguage: 'পছন্দের ভাষা',
      currentCondition: 'বর্তমান অবস্থা',
      treatingPhysician: 'আপনার চিকিৎসক',
      lastVisit: 'শেষ দেখা',
      nextAppointment: 'পরবর্তী অ্যাপয়েন্টমেন্ট',
      rajeshKumar: 'রাজেশ কুমার',
      years58: '৫৮ বছর',
      male: 'পুরুষ',
      hindi: 'হিন্দি',
      postOpKneeRecovery: 'হাঁটুর অপারেশনের পর পুনরুদ্ধার',
      drPriyaSharma: 'ডাঃ প্রিয়া শর্মা',
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
      todaysProgress: 'আজকের অগ্রগতি',
      myPrescriptions: 'আমার প্রেসক্রিপশন',
      medicationsAndInstructions: 'ওষুধ এবং নির্দেশাবলী'
    },
    // Adding Telugu translations
    te: {
      dashboard: 'డాష్‌బోర్డ్',
      profile: 'ప్రోఫైల్',
      prescriptions: 'ప్రিস্క్రिप্షన্লు',
      exercises: 'వ్యాయామాలు',
      labTests: 'ల্যাব্ টెস্ট্‌లు',
      reminders: 'రিমైన্ডర্লు',
      welcome: 'తిరిగి స్వాగతం',
      basicInformation: 'ప్రథమిక సమాచారం',
      medicalInformation: 'వైద్య సమాచారం',
      name: 'పేరు',
      age: 'వయస్సు',
      gender: 'లింగం',
      preferredLanguage: 'ఇష్టపడే భాష',
      currentCondition: 'ప্রবর্তমান స্থితि',
      treatingPhysician: 'మీ చికిత్సక',
      lastVisit: 'చివరి దర్శన',
      nextAppointment: 'తదుపరి అపాయింట్‌మెంట్',
      rajeshKumar: 'రాజేశ్ కుమార్',
      years58: '৫৮ বছর',
      male: 'పురుষుడు',
      hindi: 'हिన্দি',
      postOpKneeRecovery: 'మోకాలి శస్త్రচికিৎస తర్వాత পুনরুদ্ধার',
      drPriyaSharma: 'డాక্టర్ প্রিয়া শর্মা',
      stayOnTrack: 'అపోయ్యానికి తాను చేయండి',
      active: 'సక్రియ',
      today: 'ఆజ',
      overdue: 'బిల్మోచించబడింది',
      medications: 'వైద్యాలు',
      takeMedication: 'వైద్యాలు నిచ్చుండి',
      doExercises: 'వైద్యాలు చేయండి',
      doctorAppointment: 'డాక్తార్ అపాయింట్‌మెంట్',
      afterBreakfast: 'నస్తార్ ప్రామాణికం',
      flexionRoutine: 'ఫ్లెక్షన్ ఏమిట్‌లు మరియు శక్తిశాలీకరణ రూటీన్',
      followUp: 'డాక్తార్ ప్రియా శర్మా సాథే ఫలో-అప్పు',
      daily: 'దినం',
      appointment: 'అపాయింట్‌మెంట్',
      missed: 'మిస్తే',
      todaysProgress: 'నేటి పనులు',
      myPrescriptions: 'మీ ప్రైస్క్రిప్షన్లు',
      medicationsAndInstructions: 'వైద్యాలు ఏమిట్‌లు మరియు నిర్దేశాలు'
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
