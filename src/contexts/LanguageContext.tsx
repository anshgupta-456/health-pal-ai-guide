import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define the structure for language options
interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  voiceId?: string; // For ElevenLabs voice mapping
}

// Define supported languages (English + Indian local languages)
export const supportedLanguages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', voiceId: 'en' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', voiceId: 'hi' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', voiceId: 'bn' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', voiceId: 'te' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', voiceId: 'mr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', voiceId: 'ta' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', voiceId: 'gu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', voiceId: 'kn' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', voiceId: 'ml' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', voiceId: 'pa' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', voiceId: 'or' },
];

// Translation resources type
interface TranslationResources {
  [key: string]: {
    [key: string]: string;
  };
}

// Define the shape of the context
interface LanguageContextProps {
  currentLanguage: LanguageOption;
  setLanguage: (language: LanguageOption) => void;
  translate: (key: string) => string;
  isInitialized: boolean;
  speak: (text: string) => Promise<void>;
  isSupported: boolean;
}

// Create the context
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: TranslationResources = {
  en: {
    dashboard: 'Dashboard',
    profile: 'Profile',
    prescriptions: 'Prescriptions',
    exercises: 'Exercises',
    labTests: 'Lab Tests',
    reminders: 'Reminders',
    hello: 'Hello',
    welcome: 'Welcome to your health dashboard!',
    medications: 'Medications',
    completed: 'Completed',
    daysSinceVisit: 'Days since last visit',
    exerciseRoutines: 'Exercise Routines',
    prescribedExercises: 'Here are your prescribed exercises.',
    kneeFlexion: 'Knee Flexion',
    easy: 'Easy',
    slowlyBendKnee: 'Slowly bend your knee.',
    tenMin: '10 minutes',
    fifteenReps: '15 reps',
    positionComfortably: 'Position yourself comfortably in a chair.',
    followMovements: 'Follow the movements shown on screen.',
    moveSlowly: 'Move slowly and deliberately.',
    listenToCoach: 'Listen to the coach for guidance.',
    stopIfPain: 'Stop if you feel any pain.',
    quadricepsStrengthening: 'Quadriceps Strengthening',
    medium: 'Medium',
    tightenThighMuscles: 'Tighten your thigh muscles.',
    fifteenMin: '15 minutes',
    tenReps: '10 reps',
    lieDown: 'Lie down on your back.',
    tightenThigh: 'Tighten the thigh muscles of one leg.',
    holdFiveSeconds: 'Hold for five seconds.',
    relaxRepeat: 'Relax and repeat with the other leg.',
    notStarted: 'Not started',
    progress: 'Progress',
    instructions: 'Instructions',
    start: 'Start',
    postureDetection: 'Posture Detection',
    startCamera: 'Start Camera',
    stopCamera: 'Stop Camera',
    cameraAccessError: 'Camera access error. Please check permissions.',
    goodPosture: 'Good posture! Keep it up.',
    adjustStraighter: 'Try to keep your back straighter.',
    alignShoulders: 'Align your shoulders properly.',
    perfectForm: 'Perfect form! Excellent work.',
    slightAdjustment: 'Slight adjustment needed on the left side.',
    clickToStartCamera: 'Click to start camera',
    loadingCamera: 'Loading camera...',
    postureFeedback: 'Posture Feedback',
    elapsedTime: 'Elapsed Time',
    pause: 'Pause',
    reset: 'Reset',
    step: 'Step',
    of: 'of',
    complete: 'Complete',
    nextStep: 'Next Step',
    livePostureFeedback: 'Live Posture Feedback',
    hard: 'Hard'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफ़ाइल',
    prescriptions: 'पर्चे',
    exercises: 'व्यायाम',
    labTests: 'प्रयोगशाला परीक्षण',
    reminders: 'अनुस्मारक',
    hello: 'नमस्ते',
    welcome: 'आपके स्वास्थ्य डैशबोर्ड में स्वागत है!',
    medications: 'दवाएं',
    completed: 'पूर्ण',
    daysSinceVisit: 'अंतिम मुलाकात के बाद दिन',
    exerciseRoutines: 'व्यायाम दिनचर्या',
    prescribedExercises: 'यहां आपके निर्धारित व्यायाम हैं।',
    kneeFlexion: 'घुटने का मोड़',
    easy: 'आसान',
    slowlyBendKnee: 'धीरे-धीरे अपना घुटना मोड़ें।',
    tenMin: '10 मिनट',
    fifteenReps: '15 प्रतिनिधि',
    positionComfortably: 'कुर्सी पर आराम से बैठें।',
    followMovements: 'स्क्रीन पर दिखाए गए आंदोलनों का पालन करें।',
    moveSlowly: 'धीरे-धीरे और जानबूझकर चलें।',
    listenToCoach: 'मार्गदर्शन के लिए कोच को सुनें।',
    stopIfPain: 'अगर आपको कोई दर्द महसूस होता है तो रुक जाएं।',
    quadricepsStrengthening: 'क्वाड्रिसेप्स को मजबूत करना',
    medium: 'मध्यम',
    tightenThighMuscles: 'अपनी जांघ की मांसपेशियों को कस लें।',
    fifteenMin: '15 मिनट',
    tenReps: '10 प्रतिनिधि',
    lieDown: 'अपनी पीठ के बल लेट जाएं।',
    tightenThigh: 'एक पैर की जांघ की मांसपेशियों को कस लें।',
    holdFiveSeconds: 'पांच सेकंड के लिए रोकें।',
    relaxRepeat: 'आराम करें और दूसरे पैर से दोहराएं।',
    notStarted: 'शुरू नहीं हुआ',
    progress: 'प्रगति',
    instructions: 'अनुदेश',
    start: 'शुरू',
    postureDetection: "मुद्रा पहचान",
    startCamera: "कैमरा शुरू करें",
    stopCamera: "कैमरा बंद करें",
    cameraAccessError: "कैमरा एक्सेस त्रुटि। कृपया अनुमतियां जांचें।",
    goodPosture: "अच्छी मुद्रा! ऐसे ही जारी रखें।",
    adjustStraighter: "अपनी पीठ को और सीधा रखने की कोशिश करें।",
    alignShoulders: "अपने कंधों को सही तरीके से संरेखित करें।",
    perfectForm: "परफेक्ट फॉर्म! बेहतरीन काम।",
    slightAdjustment: "बाईं ओर थोड़ा समायोजन आवश्यक है।",
    clickToStartCamera: "कैमरा शुरू करने के लिए क्लिक करें",
    loadingCamera: "कैमरा लोड हो रहा है...",
    postureFeedback: "मुद्रा फीडबैक",
    elapsedTime: "बीता हुआ समय",
    pause: "रोकें",
    reset: "रीसेट करें",
    step: "चरण",
    of: "का",
    complete: "पूर्ण करें",
    nextStep: "अगला चरण",
    livePostureFeedback: "लाइव मुद्रा फीडबैक",
    hard: "कठिन"
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    profile: 'প্রোফাইল',
    prescriptions: 'প্রেসক্রিপশন',
    exercises: 'ব্যায়াম',
    labTests: 'ল্যাব পরীক্ষা',
    reminders: 'অনুস্মারক',
    hello: 'নমস্কার',
    welcome: 'আপনার স্বাস্থ্য ড্যাশবোর্ডে স্বাগতম!',
    medications: 'ওষুধ',
    completed: 'সম্পন্ন',
    daysSinceVisit: 'শেষ দেখার পর দিন',
    exerciseRoutines: 'ব্যায়াম রুটিন',
    prescribedExercises: 'এখানে আপনার নির্ধারিত ব্যায়াম রয়েছে।',
    kneeFlexion: 'হাঁটুর বাঁক',
    easy: 'সহজ',
    slowlyBendKnee: 'আস্তে আস্তে আপনার হাঁটু বাঁকুন।',
    tenMin: '১০ মিনিট',
    fifteenReps: '১৫ বার',
    positionComfortably: 'চেয়ারে আরামদায়কভাবে বসুন।',
    followMovements: 'স্ক্রিনে দেখানো নড়াচড়া অনুসরণ করুন।',
    moveSlowly: 'ধীরে ধীরে এবং ইচ্ছাকৃতভাবে নড়ুন।',
    listenToCoach: 'গাইডেন্সের জন্য কোচের কথা শুনুন।',
    stopIfPain: 'যদি কোনো ব্যথা অনুভব করেন তাহলে থামুন।',
    quadricepsStrengthening: 'কোয়াড্রিসেপ্স শক্তিশালীকরণ',
    medium: 'মাঝারি',
    tightenThighMuscles: 'আপনার উরুর পেশী শক্ত করুন।',
    fifteenMin: '১৫ মিনিট',
    tenReps: '১০ বার',
    lieDown: 'আপনার পিঠের উপর শুয়ে পড়ুন।',
    tightenThigh: 'একটি পায়ের উরুর পেশী শক্ত করুন।',
    holdFiveSeconds: 'পাঁচ সেকেন্ড ধরে রাখুন।',
    relaxRepeat: 'শিথিল করুন এবং অন্য পা দিয়ে পুনরাবৃত্তি করুন।',
    notStarted: 'শুরু হয়নি',
    progress: 'অগ্রগতি',
    instructions: 'নির্দেশাবলী',
    start: 'শুরু',
    postureDetection: "ভঙ্গি শনাক্তকরণ",
    startCamera: "ক্যামেরা চালু করুন",
    stopCamera: "ক্যামেরা বন্ধ করুন",
    cameraAccessError: "ক্যামেরা অ্যাক্সেস ত্রুটি। অনুমতিগুলি পরীক্ষা করুন।",
    goodPosture: "ভাল ভঙ্গি! এভাবেই চালিয়ে যান।",
    adjustStraighter: "আপনার পিঠ আরো সোজা রাখার চেষ্টা করুন।",
    alignShoulders: "আপনার কাঁধ সঠিকভাবে সারিবদ্ধ করুন।",
    perfectForm: "নিখুঁত ফর্ম! দুর্দান্ত কাজ।",
    slightAdjustment: "বামদিকে সামান্য সমন্বয় প্রয়োজন।",
    clickToStartCamera: "ক্যামেরা শুরু করতে ক্লিক করুন",
    loadingCamera: "ক্যামেরা লোড হচ্ছে...",
    postureFeedback: "ভঙ্গি প্রতিক্রিয়া",
    elapsedTime: "অতিবাহিত সময়",
    pause: "বিরতি",
    reset: "রিসেট",
    step: "ধাপ",
    of: "এর",
    complete: "সম্পন্ন",
    nextStep: "পরবর্তী ধাপ",
    livePostureFeedback: "লাইভ ভঙ্গি প্রতিক্রিয়া",
    hard: "কঠিন"
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్',
    profile: 'ప్రొఫైల్',
    prescriptions: 'ప్రిస్క్రిప్షన్లు',
    exercises: 'వ్యాయామాలు',
    labTests: 'ల్యాబ్ టెస్ట్‌లు',
    reminders: 'రిమైండర్లు',
    hello: 'నమస్కారం',
    welcome: 'మీ ఆరోగ్య డాష్‌బోర్డ్‌కు స్వాగతం!',
    medications: 'మందులు',
    completed: 'పూర్తయింది',
    daysSinceVisit: 'చివరి సందర్శన నుండి రోజులు',
    exerciseRoutines: 'వ్యాయామ రొటీన్లు',
    prescribedExercises: 'ఇక్కడ మీ నిర్దేశించిన వ్యాయామాలు ఉన్నాయి.',
    kneeFlexion: 'మోకాలి వంపు',
    easy: 'సులభం',
    slowlyBendKnee: 'మీ మోకాలిని నెమ్మదిగా వంచండి.',
    tenMin: '10 నిమిషాలు',
    fifteenReps: '15 పునరావృతాలు',
    positionComfortably: 'కుర్చీలో హాయిగా కూర్చోండి.',
    followMovements: 'స్క్రీన్‌పై చూపించిన కదలికలను అనుసరించండి.',
    moveSlowly: 'నెమ్మదిగా మరియు ఉద్దేశపూర్వకంగా కదలండి.',
    listenToCoach: 'మార్గదర్శనం కోసం కోచ్ మాట వినండి.',
    stopIfPain: 'ఏదైనా నొప్పి అనిపిస్తే ఆపివేయండి.',
    quadricepsStrengthening: 'క్వాడ్రిసెప్స్ బలపరచడం',
    medium: 'మధ్యమ',
    tightenThighMuscles: 'మీ తొడ కండరాలను బిగించండి.',
    fifteenMin: '15 నిమిషాలు',
    tenReps: '10 పునరావృతాలు',
    lieDown: 'మీ వెనుకవైపు పడుకోండి.',
    tightenThigh: 'ఒక కాలి తొడ కండరాలను బిగించండి.',
    holdFiveSeconds: 'ఐదు సెకన్లు పట్టుకోండి.',
    relaxRepeat: 'విశ్రాంతి తీసుకుని మరో కాలితో పునరావృతం చేయండి.',
    notStarted: 'ప్రారంభించలేదు',
    progress: 'పురోగతి',
    instructions: 'సూచనలు',
    start: 'ప్రారంభం',
    postureDetection: "భంగిమ గుర్తింపు",
    startCamera: "కెమెరా ప్రారంభించండి",
    stopCamera: "కెమెరా ఆపండి",
    cameraAccessError: "కెమెరా యాక్సెస్ లోపం. అనుమతులను తనిఖీ చేయండి.",
    goodPosture: "మంచి భంగిమ! ఇలానే కొనసాగించండి.",
    adjustStraighter: "మీ వెన్నును మరింత నిటారుగా ఉంచే ప్రయత్నం చేయండి.",
    alignShoulders: "మీ భుజాలను సరిగ్గా సమలేఖనం చేయండి.",
    perfectForm: "పర్ఫెక్ట్ ఫారమ్! అద్భుతమైన పని.",
    slightAdjustment: "ఎడమవైపు కొంచెం సర్దుబాటు అవసరం.",
    clickToStartCamera: "కెమెరా ప్రారంభించడానికి క్లిక్ చేయండి",
    loadingCamera: "కెమెరా లోడ్ అవుతోంది...",
    postureFeedback: "భంగిమ అభిప్రాయం",
    elapsedTime: "గడిచిన సమయం",
    pause: "పాజ్",
    reset: "రీసెట్",
    step: "దశ",
    of: "యొక్క",
    complete: "పూర్తి",
    nextStep: "తదుపరి దశ",
    livePostureFeedback: "లైవ్ భంగిమ అభిప్రాయం",
    hard: "కష్టం"
  },
  mr: {
    dashboard: 'डॅशबोर्ड',
    profile: 'प्रोफाईल',
    prescriptions: 'प्रिस्क्रिप्शन',
    exercises: 'व्यायाम',
    labTests: 'लॅब चाचण्या',
    reminders: 'स्मरणपत्रे',
    hello: 'नमस्कार',
    welcome: 'तुमच्या आरोग्य डॅशबोर्डवर स्वागत आहे!',
    medications: 'औषधे',
    completed: 'पूर्ण',
    daysSinceVisit: 'शेवटच्या भेटीपासून दिवस',
    exerciseRoutines: 'व्यायाम दिनचर्या',
    prescribedExercises: 'येथे तुमचे निर्धारित व्यायाम आहेत.',
    kneeFlexion: 'गुडघा वाकणे',
    easy: 'सोपे',
    slowlyBendKnee: 'तुमचा गुडघा हळू हळू वाकवा.',
    tenMin: '10 मिनिटे',
    fifteenReps: '15 पुनरावृत्ती',
    positionComfortably: 'खुर्चीवर आरामात बसा.',
    followMovements: 'स्क्रीनवर दाखवलेल्या हालचालींचे अनुसरण करा.',
    moveSlowly: 'हळू हळू आणि जाणीवपूर्वक हलवा.',
    listenToCoach: 'मार्गदर्शनासाठी प्रशिक्षकाचे ऐका.',
    stopIfPain: 'जर कोणत्याही प्रकारची वेदना जाणवत असेल तर थांबा.',
    quadricepsStrengthening: 'क्वाड्रिसेप्स मजबूतीकरण',
    medium: 'मध्यम',
    tightenThighMuscles: 'तुमच्या मांडीचे स्नायू घट्ट करा.',
    fifteenMin: '15 मिनिटे',
    tenReps: '10 पुनरावृत्ती',
    lieDown: 'तुमच्या पाठीवर झोपा.',
    tightenThigh: 'एका पायाच्या मांडीचे स्नायू घट्ट करा.',
    holdFiveSeconds: 'पाच सेकंद धरा.',
    relaxRepeat: 'आराम करा आणि दुसऱ्या पायाने पुनरावृत्ती करा.',
    notStarted: 'सुरू झाले नाही',
    progress: 'प्रगती',
    instructions: 'सूचना',
    start: 'सुरुवात',
    postureDetection: "पवित्रा ओळख",
    startCamera: "कॅमेरा सुरू करा",
    stopCamera: "कॅमेरा बंद करा",
    cameraAccessError: "कॅमेरा प्रवेश त्रुटी. परवानग्या तपासा.",
    goodPosture: "चांगली मुद्रा! असेच चालू ठेवा.",
    adjustStraighter: "तुमची पाठ अधिक सरळ ठेवण्याचा प्रयत्न करा.",
    alignShoulders: "तुमचे खांदे योग्यरित्या संरेखित करा.",
    perfectForm: "परफेक्ट फॉर्म! उत्कृष्ट काम.",
    slightAdjustment: "डावीकडे थोडे समायोजन आवश्यक आहे.",
    clickToStartCamera: "कॅमेरा सुरू करण्यासाठी क्लिक करा",
    loadingCamera: "कॅमेरा लोड होत आहे...",
    postureFeedback: "मुद्रा अभिप्राय",
    elapsedTime: "गेलेला वेळ",
    pause: "थांबा",
    reset: "रीसेट",
    step: "पायरी",
    of: "चा",
    complete: "पूर्ण",
    nextStep: "पुढील पायरी",
    livePostureFeedback: "लाइव्ह मुद्रा अभिप्राय",
    hard: "कठीण"
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    profile: 'சுயவிவரம்',
    prescriptions: 'மருந்து சீட்டுகள்',
    exercises: 'உடற்பயிற்சிகள்',
    labTests: 'ஆய்வக சோதனைகள்',
    reminders: 'நினைவூட்டல்கள்',
    hello: 'வணக்கம்',
    welcome: 'உங்கள் சுகாதார டாஷ்போர்டுக்கு வரவேற்கிறோம்!',
    medications: 'மருந்துகள்',
    completed: 'முடிந்தது',
    daysSinceVisit: 'கடைசி விஜயத்திலிருந்து நாட்கள்',
    exerciseRoutines: 'உடற்பயிற்சி நடைமுறைகள்',
    prescribedExercises: 'உங்கள் பரிந்துரைக்கப்பட்ட உடற்பயிற்சிகள் இங்கே உள்ளன.',
    kneeFlexion: 'முழங்கால் நெகிழ்வு',
    easy: 'எளிதான',
    slowlyBendKnee: 'உங்கள் முழங்காலை மெதுவாக வளைக்கவும்.',
    tenMin: '10 நிமிடங்கள்',
    fifteenReps: '15 முறை',
    positionComfortably: 'நாற்காலியில் வசதியாக அமரவும்.',
    followMovements: 'திரையில் காட்டப்படும் அசைவுகளைப் பின்பற்றவும்.',
    moveSlowly: 'மெதுவாகவும் வேண்டுமென்றே நகரவும்.',
    listenToCoach: 'வழிகாட்டுதலுக்காக பயிற்சியாளரைக் கேளுங்கள்.',
    stopIfPain: 'ஏதேனும் வலி ஏற்பட்டால் நிறுத்தவும்.',
    quadricepsStrengthening: 'குவாட்ரிசெப்ஸ் வலுப்படுத்தல்',
    medium: 'நடுத்தர',
    tightenThighMuscles: 'உங்கள் தொடை தசைகளை இறுக்கவும்.',
    fifteenMin: '15 நிமிடங்கள்',
    tenReps: '10 முறை',
    lieDown: 'உங்கள் முதுகில் படுத்துக் கொள்ளுங்கள்.',
    tightenThigh: 'ஒரு காலின் தொடை தசைகளை இறுக்கவும்.',
    holdFiveSeconds: 'ஐந்து வினாடிகள் பிடிக்கவும்.',
    relaxRepeat: 'ஓய்வெடுத்து மற்ற காலுடன் மீண்டும் செய்யவும்.',
    notStarted: 'தொடங்கவில்லை',
    progress: 'முன்னேற்றம்',
    instructions: 'வழிமுறைகள்',
    start: 'தொடங்கு',
    postureDetection: "தோரணை கண்டறிதல்",
    startCamera: "கேமராவைத் தொடங்கவும்",
    stopCamera: "கேமராவை நிறுத்தவும்",
    cameraAccessError: "கேமரா அணுகல் பிழை. அனுமதிகளைச் சரிபார்க்கவும்.",
    goodPosture: "நல்ல தோரணை! இதைத் தொடருங்கள்.",
    adjustStraighter: "உங்கள் முதுகை மேலும் நேராக வைக்க முயற்சி செய்யுங்கள்.",
    alignShoulders: "உங்கள் தோள்களை சரியாக சீரமைக்கவும்.",
    perfectForm: "சரியான வடிவம்! சிறந்த வேலை.",
    slightAdjustment: "இடதுபுறத்தில் சிறிய சரிசெய்தல் தேவை.",
    clickToStartCamera: "கேமராவைத் தொடங்க கிளிக் செய்யவும்",
    loadingCamera: "கேமரா ஏற்றப்படுகிறது...",
    postureFeedback: "தோரணை பின்னூட்டம்",
    elapsedTime: "கழிந்த நேரம்",
    pause: "இடைநிறுத்தம்",
    reset: "மீட்டமை",
    step: "படி",
    of: "இன்",
    complete: "முடிவு",
    nextStep: "அடுத்த படி",
    livePostureFeedback: "லைவ் தோரணை பின்னூட்டம்",
    hard: "கடினமான"
  },
  gu: {
    dashboard: 'ડેશબોર્ડ',
    profile: 'પ્રોફાઇલ',
    prescriptions: 'પ્રિસ્ક્રિપ્શન',
    exercises: 'કસરત',
    labTests: 'લેબ ટેસ્ટ',
    reminders: 'રિમાઇન્ડર',
    hello: 'નમસ્તે',
    welcome: 'તમારા આરોગ્ય ડેશબોર્ડમાં આપનું સ્વાગત છે!',
    medications: 'દવાઓ',
    completed: 'પૂર્ણ',
    daysSinceVisit: 'છેલ્લી મુલાકાતથી દિવસો',
    exerciseRoutines: 'કસરત દિનચર્યા',
    prescribedExercises: 'અહીં તમારી નિર્ધારિત કસરતો છે.',
    kneeFlexion: 'ઘૂંટણ વાળવું',
    easy: 'સરળ',
    slowlyBendKnee: 'તમારા ઘૂંટણને ધીમે ધીમે વાળો.',
    tenMin: '10 મિનિટ',
    fifteenReps: '15 પુનરાવર્તન',
    positionComfortably: 'ખુરશીમાં આરામથી બેસો.',
    followMovements: 'સ્ક્રીન પર બતાવેલી હલચલોને અનુસરો.',
    moveSlowly: 'ધીમે ધીમે અને ઇરાદાપૂર્વક ફરો.',
    listenToCoach: 'માર્ગદર્શન માટે કોચની વાત સાંભળો.',
    stopIfPain: 'જો કોઈ પીડા લાગે તો બંધ કરો.',
    quadricepsStrengthening: 'ક્વાડ્રિસેપ્સ મજબૂતીકરણ',
    medium: 'મધ્યમ',
    tightenThighMuscles: 'તમારા જાંઘના સ્નાયુઓને કડક કરો.',
    fifteenMin: '15 મિનિટ',
    tenReps: '10 પુનરાવર્તન',
    lieDown: 'તમારી પીઠ પર સૂઈ જાઓ.',
    tightenThigh: 'એક પગના જાંઘના સ્નાયુઓને કડક કરો.',
    holdFiveSeconds: 'પાંચ સેકન્ડ પકડી રાખો.',
    relaxRepeat: 'આરામ કરો અને બીજા પગ સાથે પુનરાવર્તન કરો.',
    notStarted: 'શરૂ થયું નથી',
    progress: 'પ્રગતિ',
    instructions: 'સૂચનાઓ',
    start: 'શરૂ કરો',
    postureDetection: "મુદ્રા શોધ",
    startCamera: "કેમેરા શરૂ કરો",
    stopCamera: "કેમેરા બંધ કરો",
    cameraAccessError: "કેમેરા ઍક્સેસ ભૂલ. પરમિશન ચેક કરો.",
    goodPosture: "સારી મુદ્રા! આ જ રીતે ચાલુ રાખો.",
    adjustStraighter: "તમારી પીઠને વધુ સીધી રાખવાનો પ્રયાસ કરો.",
    alignShoulders: "તમારા ખભાને યોગ્ય રીતે સંરેખિત કરો.",
    perfectForm: "સંપૂર્ણ ફોર્મ! ઉત્કૃષ્ટ કામ.",
    slightAdjustment: "ડાબી બાજુએ થોડો ગોઠવણ જરૂરી છે.",
    clickToStartCamera: "કેમેરા શરૂ કરવા માટે ક્લિક કરો",
    loadingCamera: "કેમેરા લોડ થઈ રહ્યો છે...",
    postureFeedback: "મુદ્રા પ્રતિક્રિયા",
    elapsedTime: "વીતેલો સમય",
    pause: "વિરામ",
    reset: "રીસેટ",
    step: "પગલું",
    of: "નું",
    complete: "પૂર્ણ",
    nextStep: "આગળનું પગલું",
    livePostureFeedback: "લાઇવ મુદ્રા પ્રતિક્રિયા",
    hard: "કઠિન"
  },
  kn: {
    dashboard: 'ಡ್ಯಾಷ್‌ಬೋರ್ಡ್',
    profile: 'ಪ್ರೊಫೈಲ್',
    prescriptions: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು',
    exercises: 'ವ್ಯಾಯಾಮಗಳು',
    labTests: 'ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳು',
    reminders: 'ಜ್ಞಾಪನೆಗಳು',
    hello: 'ನಮಸ್ಕಾರ',
    welcome: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಡ್ಯಾಷ್‌ಬೋರ್ಡ್‌ಗೆ ಸ್ವಾಗತ!',
    medications: 'ಔಷಧಿಗಳು',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    daysSinceVisit: 'ಕೊನೆಯ ಭೇಟಿಯಿಂದ ದಿನಗಳು',
    exerciseRoutines: 'ವ್ಯಾಯಾಮ ದಿನಚರಿಗಳು',
    prescribedExercises: 'ಇಲ್ಲಿ ನಿಮ್ಮ ನಿಗದಿತ ವ್ಯಾಯಾಮಗಳಿವೆ.',
    kneeFlexion: 'ಮೊಣಕಾಲು ಬಾಗಿಸುವಿಕೆ',
    easy: 'ಸುಲಭ',
    slowlyBendKnee: 'ನಿಮ್ಮ ಮೊಣಕಾಲನ್ನು ನಿಧಾನವಾಗಿ ಬಾಗಿಸಿ.',
    tenMin: '10 ನಿಮಿಷಗಳು',
    fifteenReps: '15 ಪುನರಾವರ್ತನೆಗಳು',
    positionComfortably: 'ಕುರ್ಚಿಯಲ್ಲಿ ಆರಾಮವಾಗಿ ಕುಳಿತುಕೊಳ್ಳಿ.',
    followMovements: 'ಪರದೆಯಲ್ಲಿ ತೋರಿಸಿದ ಚಲನೆಗಳನ್ನು ಅನುಸರಿಸಿ.',
    moveSlowly: 'ನಿಧಾನವಾಗಿ ಮತ್ತು ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಚಲಿಸಿ.',
    listenToCoach: 'ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ತರಬೇತುದಾರರನ್ನು ಕೇಳಿ.',
    stopIfPain: 'ಯಾವುದೇ ನೋವು ಅನಿಸಿದರೆ ನಿಲ್ಲಿಸಿ.',
    quadricepsStrengthening: 'ಕ್ವಾಡ್ರಿಸೆಪ್ಸ್ ಬಲಪಡಿಸುವಿಕೆ',
    medium: 'ಮಧ್ಯಮ',
    tightenThighMuscles: 'ನಿಮ್ಮ ತೊಡೆಯ ಸ್ನಾಯುಗಳನ್ನು ಬಿಗಿಗೊಳಿಸಿ.',
    fifteenMin: '15 ನಿಮಿಷಗಳು',
    tenReps: '10 ಪುನರಾವರ್ತನೆಗಳು',
    lieDown: 'ನಿಮ್ಮ ಬೆನ್ನಿನ ಮೇಲೆ ಮಲಗಿ.',
    tightenThigh: 'ಒಂದು ಕಾಲಿನ ತೊಡೆಯ ಸ್ನಾಯುಗಳನ್ನು ಬಿಗಿಗೊಳಿಸಿ.',
    holdFiveSeconds: 'ಐದು ಸೆಕೆಂಡುಗಳ ಕಾಲ ಹಿಡಿದುಕೊಳ್ಳಿ.',
    relaxRepeat: 'ವಿಶ್ರಾಂತಿ ಪಡೆದು ಇನ್ನೊಂದು ಕಾಲಿನೊಂದಿಗೆ ಪುನರಾವರ್ತಿಸಿ.',
    notStarted: 'ಪ್ರಾರಂಭಿಸಿಲ್ಲ',
    progress: 'ಪ್ರಗತಿ',
    instructions: 'ಸೂಚನೆಗಳು',
    start: 'ಪ್ರಾರಂಭಿಸಿ',
    postureDetection: "ಭಂಗಿ ಪತ್ತೆ",
    startCamera: "ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಿ",
    stopCamera: "ಕ್ಯಾಮೆರಾ ನಿಲ್ಲಿಸಿ",
    cameraAccessError: "ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ ದೋಷ. ಅನುಮತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    goodPosture: "ಉತ್ತಮ ಭಂಗಿ! ಇದನ್ನು ಮುಂದುವರೆಸಿ.",
    adjustStraighter: "ನಿಮ್ಮ ಬೆನ್ನನ್ನು ಹೆಚ್ಚು ನೇರವಾಗಿ ಇಡಲು ಪ್ರಯತ್ನಿಸಿ.",
    alignShoulders: "ನಿಮ್ಮ ಭುಜಗಳನ್ನು ಸರಿಯಾಗಿ ಜೋಡಿಸಿ.",
    perfectForm: "ಪರಿಪೂರ್ಣ ರೂಪ! ಅತ್ಯುತ್ತಮ ಕೆಲಸ.",
    slightAdjustment: "ಎಡಭಾಗದಲ್ಲಿ ಸ್ವಲ್ಪ ಹೊಂದಾಣಿಕೆ ಅಗತ್ಯ.",
    clickToStartCamera: "ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    loadingCamera: "ಕ್ಯಾಮೆರಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    postureFeedback: "ಭಂಗಿ ಪ್ರತಿಕ್ರಿಯೆ",
    elapsedTime: "ಕಳೆದ ಸಮಯ",
    pause: "ವಿರಾಮ",
    reset: "ಮರುಹೊಂದಿಸಿ",
    step: "ಹಂತ",
    of: "ರ",
    complete: "ಪೂರ್ಣಗೊಳಿಸಿ",
    nextStep: "ಮುಂದಿನ ಹಂತ",
    livePostureFeedback: "ಲೈವ್ ಭಂಗಿ ಪ್ರತಿಕ್ರಿಯೆ",
    hard: "ಕಠಿಣ"
  },
  ml: {
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    profile: 'പ്രൊഫൈൽ',
    prescriptions: 'കുറിപ്പുകൾ',
    exercises: 'വ്യായാമങ്ങൾ',
    labTests: 'ലാബ് ടെസ്റ്റുകൾ',
    reminders: 'ഓർമ്മപ്പെടുത്തലുകൾ',
    hello: 'നമസ്കാരം',
    welcome: 'നിങ്ങളുടെ ആരോഗ്യ ഡാഷ്‌ബോർഡിലേക്ക് സ്വാഗതം!',
    medications: 'മരുന്നുകൾ',
    completed: 'പൂർത്തിയായി',
    daysSinceVisit: 'അവസാന സന്ദർശനത്തിന് ശേഷമുള്ള ദിവസങ്ങൾ',
    exerciseRoutines: 'വ്യായാമ ദിനചര്യകൾ',
    prescribedExercises: 'നിങ്ങളുടെ നിർദ്ദേശിത വ്യായാമങ്ങൾ ഇവിടെയുണ്ട്.',
    kneeFlexion: 'കാൽമുട്ട് വളയ്ക്കൽ',
    easy: 'എളുപ്പം',
    slowlyBendKnee: 'നിങ്ങളുടെ കാൽമുട്ട് പതുക്കെ വളയ്ക്കുക.',
    tenMin: '10 മിനിറ്റ്',
    fifteenReps: '15 തവണ',
    positionComfortably: 'കസേരയിൽ സുഖമായി ഇരിക്കുക.',
    followMovements: 'സ്ക്രീനിൽ കാണിക്കുന്ന ചലനങ്ങൾ പിന്തുടരുക.',
    moveSlowly: 'പതുക്കെയും ബോധപൂർവവും ചലിക്കുക.',
    listenToCoach: 'മാർഗ്ഗനിർദ്ദേശത്തിനായി പരിശീലകനെ കേൾക്കുക.',
    stopIfPain: 'എന്തെങ്കിലും വേദന അനുഭവപ്പെട്ടാൽ നിർത്തുക.',
    quadricepsStrengthening: 'ക്വാഡ്രിസെപ്സ് ശക്തിപ്പെടുത്തൽ',
    medium: 'ഇടത്തരം',
    tightenThighMuscles: 'നിങ്ങളുടെ തുടയിലെ പേശികൾ മുറുക്കുക.',
    fifteenMin: '15 മിനിറ്റ്',
    tenReps: '10 തവണ',
    lieDown: 'നിങ്ങളുടെ പുറകിൽ കിടക്കുക.',
    tightenThigh: 'ഒരു കാലിന്റെ തുടയിലെ പേശികൾ മുറുക്കുക.',
    holdFiveSeconds: 'അഞ്ച് സെക്കൻഡ് പിടിക്കുക.',
    relaxRepeat: 'വിശ്രമിച്ച് മറ്റൊരു കാലുകൊണ്ട് ആവർത്തിക്കുക.',
    notStarted: 'തുടങ്ങിയിട്ടില്ല',
    progress: 'പുരോഗതി',
    instructions: 'നിർദ്ദേശങ്ങൾ',
    start: 'ആരംഭിക്കുക',
    postureDetection: "ഭാവനിലയുടെ കണ്ടെത്തൽ",
    startCamera: "ക്യാമറ ആരംഭിക്കുക",
    stopCamera: "ക്യാമറ നിർത്തുക",
    cameraAccessError: "ക്യാമറ ആക്‌സസ് പിശക്. അനുമതികൾ പരിശോധിക്കുക.",
    goodPosture: "നല്ല ഭാവനില! ഇത് തുടരുക.",
    adjustStraighter: "നിങ്ങളുടെ പുറം കൂടുതൽ നേരെ സൂക്ഷിക്കാൻ ശ്രമിക്കുക.",
    alignShoulders: "നിങ്ങളുടെ തോളുകൾ ശരിയായി വരിക്കുക.",
    perfectForm: "പൂർണ്ണമായ രൂപം! മികച്ച ജോലി.",
    slightAdjustment: "ഇടതുവശത്ത് ചെറിയ ക്രമീകരണം ആവശ്യം.",
    clickToStartCamera: "ക്യാമറ ആരംഭിക്കാൻ ക്ലിക്ക് ചെയ്യുക",
    loadingCamera: "ക്യാമറ ലോഡ് ചെയ്യുന്നു...",
    postureFeedback: "ഭാവനില ഫീഡ്ബാക്ക്",
    elapsedTime: "കഴിഞ്ഞ സമയം",
    pause: "തല്ക്കാലം നിർത്തുക",
    reset: "റീസെറ്റ്",
    step: "ഘട്ടം",
    of: "യുടെ",
    complete: "പൂർത്തിയാക്കുക",
    nextStep: "അടുത്ത ഘട്ടം",
    livePostureFeedback: "ലൈവ് ഭാവനില ഫീഡ്ബാക്ക്",
    hard: "കഠിനം"
  },
  pa: {
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    prescriptions: 'ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ',
    exercises: 'ਅਭਿਆਸ',
    labTests: 'ਲੈਬ ਟੈਸਟ',
    reminders: 'ਯਾਦਦਾਸ਼ਤ',
    hello: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
    welcome: 'ਤੁਹਾਡੇ ਸਿਹਤ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ!',
    medications: 'ਦਵਾਈਆਂ',
    completed: 'ਮੁਕੰਮਲ',
    daysSinceVisit: 'ਆਖਰੀ ਮੁਲਾਕਾਤ ਤੋਂ ਦਿਨ',
    exerciseRoutines: 'ਅਭਿਆਸ ਰੁਟੀਨ',
    prescribedExercises: 'ਇੱਥੇ ਤੁਹਾਡੇ ਨਿਰਧਾਰਿਤ ਅਭਿਆਸ ਹਨ।',
    kneeFlexion: 'ਗੋਡੇ ਮੋੜਨਾ',
    easy: 'ਆਸਾਨ',
    slowlyBendKnee: 'ਆਪਣੇ ਗੋਡੇ ਨੂੰ ਹੌਲੀ ਹੌਲੀ ਮੋੜੋ।',
    tenMin: '10 ਮਿੰਟ',
    fifteenReps: '15 ਵਾਰ',
    positionComfortably: 'ਕੁਰਸੀ ਵਿੱਚ ਆਰਾਮ ਨਾਲ ਬੈਠੋ।',
    followMovements: 'ਸਕ੍ਰੀਨ ਉੱਤੇ ਦਿਖਾਈਆਂ ਹਰਕਤਾਂ ਦਾ ਪਾਲਣ ਕਰੋ।',
    moveSlowly: 'ਹੌਲੀ ਹੌਲੀ ਅਤੇ ਜਾਣ ਬੁੱਝ ਕੇ ਹਿਲਾਓ।',
    listenToCoach: 'ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਕੋਚ ਦੀ ਸੁਣੋ।',
    stopIfPain: 'ਜੇ ਕੋਈ ਦਰਦ ਮਹਿਸੂਸ ਹੋਵੇ ਤਾਂ ਰੁਕ ਜਾਓ।',
    quadricepsStrengthening: 'ਕਵਾਡਰਿਸੈਪਸ ਮਜ਼ਬੂਤੀ',
    medium: 'ਦਰਮਿਆਨਾ',
    tightenThighMuscles: 'ਆਪਣੀਆਂ ਪੱਟ ਦੀਆਂ ਮਾਸਪੇਸ਼ੀਆਂ ਨੂੰ ਕੱਸੋ।',
    fifteenMin: '15 ਮਿੰਟ',
    tenReps: '10 ਵਾਰ',
    lieDown: 'ਆਪਣੀ ਪਿੱਠ ਉੱਤੇ ਲੇਟ ਜਾਓ।',
    tightenThigh: 'ਇੱਕ ਲੱਤ ਦੀ ਪੱਟ ਦੀਆਂ ਮਾਸਪੇਸ਼ੀਆਂ ਨੂੰ ਕੱਸੋ।',
    holdFiveSeconds: 'ਪੰਜ ਸਕਿੰਟ ਤੱਕ ਰੱਖੋ।',
    relaxRepeat: 'ਆਰਾਮ ਕਰੋ ਅਤੇ ਦੂਜੀ ਲੱਤ ਨਾਲ ਦੁਹਰਾਓ।',
    notStarted: 'ਸ਼ੁਰੂ ਨਹੀਂ ਹੋਇਆ',
    progress: 'ਤਰੱਕੀ',
    instructions: 'ਹਦਾਇਤਾਂ',
    start: 'ਸ਼ੁਰੂ ਕਰੋ',
    postureDetection: "ਮੁਦਰਾ ਖੋਜ",
    startCamera: "ਕੈਮਰਾ ਸ਼ੁਰੂ ਕਰੋ",
    stopCamera: "ਕੈਮਰਾ ਬੰਦ ਕਰੋ",
    cameraAccessError: "ਕੈਮਰਾ ਐਕਸੈਸ ਗਲਤੀ। ਇਜਾਜ਼ਤਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।",
    goodPosture: "ਚੰਗਾ ਮੁਦਰਾ! ਇਸ ਨੂੰ ਜਾਰੀ ਰੱਖੋ।",
    adjustStraighter: "ਆਪਣੀ ਪਿੱਠ ਨੂੰ ਹੋਰ ਸਿੱਧਾ ਰੱਖਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    alignShoulders: "ਆਪਣੇ ਮੋਢਿਆਂ ਨੂੰ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਮਿਲਾਓ।",
    perfectForm: "ਸੰਪੂਰਨ ਫਾਰਮ! ਸ਼ਾਨਦਾਰ ਕੰਮ।",
    slightAdjustment: "ਖੱਬੇ ਪਾਸੇ ਥੋੜ੍ਹਾ ਸਮਾਇੋਜਨ ਲੋੜੀਂਦਾ ਹੈ।",
    clickToStartCamera: "ਕੈਮਰਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ",
    loadingCamera: "ਕੈਮਰਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    postureFeedback: "ਮੁਦਰਾ ਫੀਡਬੈਕ",
    elapsedTime: "ਲੰਘਿਆ ਸਮਾਂ",
    pause: "ਰੋਕੋ",
    reset: "ਰੀਸੈਟ",
    step: "ਕਦਮ",
    of: "ਦਾ",
    complete: "ਮੁਕੰਮਲ",
    nextStep: "ਅਗਲਾ ਕਦਮ",
    livePostureFeedback: "ਲਾਈਵ ਮੁਦਰਾ ਫੀਡਬੈਕ",
    hard: "ਔਖਾ"
  },
  or: {
    dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    profile: 'ପ୍ରୋଫାଇଲ',
    prescriptions: 'ପ୍ରେସକ୍ରିପସନ',
    exercises: 'ବ୍ୟାୟାମ',
    labTests: 'ଲ୍ୟାବ ପରୀକ୍ଷା',
    reminders: 'ସ୍ମାରକ',
    hello: 'ନମସ୍କାର',
    welcome: 'ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ଡ୍ୟାସବୋର୍ଡକୁ ସ୍ୱାଗତ!',
    medications: 'ଔଷଧ',
    completed: 'ସମ୍ପୂର୍ଣ୍ଣ',
    daysSinceVisit: 'ଶେଷ ଭେଟ ପରଠାରୁ ଦିନ',
    exerciseRoutines: 'ବ୍ୟାୟାମ ନିତ୍ୟକର୍ମ',
    prescribedExercises: 'ଏଠାରେ ଆପଣଙ୍କର ନିର୍ଦେଶିତ ବ୍ୟାୟାମ ଅଛି।',
    kneeFlexion: 'ଆଣ୍ଠୁ ବଙ୍କା',
    easy: 'ସହଜ',
    slowlyBendKnee: 'ଆପଣଙ୍କର ଆଣ୍ଠୁକୁ ଧୀରେ ଧୀରେ ବଙ୍କା କରନ୍ତୁ।',
    tenMin: '10 ମିନିଟ',
    fifteenReps: '15 ପୁନରାବୃତ୍ତି',
    positionComfortably: 'ଚେୟାରରେ ଆରାମରେ ବସନ୍ତୁ।',
    followMovements: 'ପରଦାରେ ଦେଖାଯାଇଥିବା ଗତିଗୁଡିକୁ ଅନୁସରଣ କରନ୍ତୁ।',
    moveSlowly: 'ଧୀରେ ଧୀରେ ଏବଂ ଉଦ୍ଦେଶ୍ୟମୂଳକ ଭାବରେ ଗତି କରନ୍ତୁ।',
    listenToCoach: 'ମାର୍ଗଦର୍ଶନ ପାଇଁ କୋଚ୍‌ଙ୍କୁ ଶୁଣନ୍ତୁ।',
    stopIfPain: 'ଯଦି କୌଣସି ଯନ୍ତ୍ରଣା ଅନୁଭବ କରନ୍ତି ତେବେ ବନ୍ଦ କରନ୍ତୁ।',
    quadricepsStrengthening: 'କ୍ୱାଡ୍ରିସେପ୍ସ ଶକ୍ତିଶାଳୀକରଣ',
    medium: 'ମଧ୍ୟମ',
    tightenThighMuscles: 'ଆପଣଙ୍କର ଜଙ୍ଘ ମାଂସପେଶୀକୁ କଠିନ କରନ୍ତୁ।',
    fifteenMin: '15 ମିନିଟ',
    tenReps: '10 ପୁନରାବୃତ୍ତି',
    lieDown: 'ଆପଣଙ୍କର ପିଠିରେ ଶୋଇ ପଡନ୍ତୁ।',
    tightenThigh: 'ଗୋଟିଏ ଗୋଡର ଜଙ୍ଘ ମାଂସପେଶୀକୁ କଠିନ କରନ୍ତୁ।',
    holdFiveSeconds: 'ପାଞ୍ଚ ସେକେଣ୍ଡ ଧରନ୍ତୁ।',
    relaxRepeat: 'ଆରାମ କରନ୍ତୁ ଏବଂ ଅନ୍ୟ ଗୋଡ ସହିତ ପୁନରାବୃତ୍ତି କରନ୍ତୁ।',
    notStarted: 'ଆରମ୍ଭ ହୋଇନାହିଁ',
    progress: 'ପ୍ରଗତି',
    instructions: 'ନିର୍ଦ୍ଦେଶ',
    start: 'ଆରମ୍ଭ',
    postureDetection: "ଭଙ୍ଗିମା ଚିହ୍ନଟ",
    startCamera: "କ୍ୟାମେରା ଆରମ୍ଭ କରନ୍ତୁ",
    stopCamera: "କ୍ୟାମେରା ବନ୍ଦ କରନ୍ତୁ",
    cameraAccessError: "କ୍ୟାମେରା ଆକ୍ସେସ ତ୍ରୁଟି। ଅନୁମତିଗୁଡିକ ଯାଞ୍ଚ କରନ୍ତୁ।",
    goodPosture: "ଭଲ ଭଙ୍ଗିମା! ଏହାକୁ ଜାରି ରଖନ୍ତୁ।",
    adjustStraighter: "ଆପଣଙ୍କର ପିଠିକୁ ଅଧିକ ସିଧା ରଖିବାକୁ ଚେଷ୍ଟା କରନ୍ତୁ।",
    alignShoulders: "ଆପଣଙ୍କର କାନ୍ଧଗୁଡିକୁ ଠିକ୍ ଭାବରେ ସମାନ୍ତରାଳ କରନ୍ତୁ।",
    perfectForm: "ନିପୁଣ ରୂପ! ଉତ୍କୃଷ୍ଟ କାମ।",
    slightAdjustment: "ବାମ ପାର୍ଶ୍ୱରେ ସାମାନ୍ୟ ସମାଯୋଜନ ଦରକାର।",
    clickToStartCamera: "କ୍ୟାମେରା ଆରମ୍ଭ କରିବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ",
    loadingCamera: "କ୍ୟାମେରା ଲୋଡ୍ ହେଉଛି...",
    postureFeedback: "ଭଙ୍ଗିମା ମତାମତ",
    elapsedTime: "ଅତିବାହିତ ସମୟ",
    pause: "ବିରତି",
    reset: "ପୁନଃସେଟ୍",
    step: "ପଦକ୍ଷେପ",
    of: "ର",
    complete: "ସମ୍ପୂର୍ଣ୍ଣ",
    nextStep: "ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ",
    livePostureFeedback: "ଲାଇଭ୍ ଭଙ୍ଗିମା ମତାମତ",
    hard: "କଠିନ"
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(supportedLanguages[0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSpeechSynthesisSupported, setIsSpeechSynthesisSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSpeechSynthesisSupported(true);
    }
  }, []);

  useEffect(() => {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: Object.keys(translations).reduce((acc, lang) => {
          acc[lang] = { translation: translations[lang] };
          return acc;
        }, {}),
        lng: currentLanguage.code,
        fallbackLng: 'en', // Default to English
        interpolation: {
          escapeValue: false,
        },
      })
      .then(() => {
        setIsInitialized(true);
      });
  }, [currentLanguage.code]);

  const setLanguage = useCallback((language: LanguageOption) => {
    setCurrentLanguage(language);
    i18n.changeLanguage(language.code);
  }, []);

  const translate = useCallback((key: string) => {
    return i18n.t(key);
  }, []);

  // Enhanced speech synthesis with better language support
  const speak = async (text: string): Promise<void> => {
    if (!isSpeechSynthesisSupported) {
      console.warn('Speech synthesis is not supported in this browser.');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage.code;
        utterance.rate = 0.8; // Slightly slower for better comprehension
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find the best voice for the current language
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith(currentLanguage.code) || 
          voice.lang.includes(currentLanguage.code)
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error);
          reject(error);
        };

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Speech synthesis failed:', error);
        reject(error);
      }
    });
  };

  const contextValue: LanguageContextProps = {
    currentLanguage,
    setLanguage,
    translate,
    isInitialized,
    speak,
    isSupported: isSpeechSynthesisSupported,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
