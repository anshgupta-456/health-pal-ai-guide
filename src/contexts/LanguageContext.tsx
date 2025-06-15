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
    daily: "Daily",
    flexionRoutine: "Flexion Routine",
    appointment: "Appointment",
    followUp: "Follow-up",
    todaysProgress: "Today's Progress",
    missed: "Missed",
    rajeshKumar: "Rajesh Kumar",
    age: "Age",
    years58: "58 साल",
    male: "पुरुष",
    female: "महिला",
    hindi: "हिंदी",
    name: "Name",
    gender: "Gender",
    preferredLanguage: "पसंदीदा भाषा",
    currentCondition: "वर्तमान स्थिति",
    postOpKneeRecovery: "Post-Op Knee Recovery",
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
    needAccount: "खाता चाहिए? साइन अप करें",
    haveAccount: "पहले से खाता है? साइन इन करें",
    basicInformation: "बुनियादी जानकारी",
    medicalInformation: "चिकित्सा जानकारी",
    medicalConditions: "चिकित्सा स्थितियां",
    allergies: "एलर्जी",
    currentMedications: "वर्तमान दवाएं",
    phone: "फोन",
    address: "पता",
    addTest: "परीक्षण जोड़ें",
    withReports: "रिपोर्ट के साथ",
    totalTests: "कुल परीक्षण",
    addNewLabTest: "नया प्रयोगशाला परीक्षण जोड़ें",
    testName: "परीक्षण का नाम",
    testDate: "परीक्षण की तारीख",
    labName: "प्रयोगशाला का नाम",
    uploadReport: "रिपोर्ट अपलोड करें",
    cancel: "रद्द करें",
    downloadReport: "रिपोर्ट डाउनलोड करें",
    analyzeReport: "रिपोर्ट का विश्लेषण करें",
    analyze: "विश्लेषण करें",
    analysisResults: "विश्लेषण परिणाम",
    summary: "सारांश",
    recommendations: "सिफारिशें",
    abnormalValues: "असामान्य मान",
    normal: "सामान्य",
    noLabTestsYet: "अभी तक कोई प्रयोगशाला परीक्षण नहीं है। शुरुआत करने के लिए अपना पहला परीक्षण जोड़ें।",
  },
  ta: {
    welcome: "வரவேற்கிறோம்",
    dashboardDescription: "உங்கள் ஆரோக்கியம் ஒரு பார்வையில்",
    healthStats: "ஆரோக்கிய புள்ளிவிவரங்கள்",
    weight: "எடை",
    bloodPressure: "இரத்த அழுத்தம்",
    cholesterol: "கொலஸ்ட்ரால்",
    labTests: "ஆய்வகப் பரிசோதனைகள்",
    trackTestResults: "உங்கள் பரிசோதனை முடிவுகளை கண்காணிக்கவும்",
    addTest: "பரிசோதனை சேர்க்கவும்",
    pending: "நிலுவையில்",
    completed: "முடிந்தது",
    testName: "பரிசோதனை பெயர்",
    testDate: "பரிசோதனை தேதி",
    cancel: "ரத்து செய்யவும்",
    myPrescriptions: "என் மருத்துவ பரிந்துரைகள்",
    medicationsAndInstructions: "மருந்துகள் மற்றும் வழிமுறைகள்",
  },
  te: {
    welcome: "స్వాగతం",
    dashboardDescription: "మీ ఆరోగ్యం ఒక చూపులో",
    healthStats: "ఆరోగ్య గణాంకాలు",
    weight: "బరువు",
    bloodPressure: "రక్తపోటు",
    cholesterol: "కొలెస్ట్రాల్",
    labTests: "ల్యాబ్ పరీక్షలు",
    trackTestResults: "మీ పరీక్ష ఫలితాలను ట్రాక్ చేయండి",
    addTest: "పరీక్ష జోడించండి",
    pending: "పెండింగ్",
    completed: "పూర్తయింది",
    testName: "పరీక్ష పేరు",
    testDate: "పరీక్ష తేదీ",
    cancel: "రద్దు చేయండి",
    myPrescriptions: "నా ప్రిస్క్రిప్షన్లు",
    medicationsAndInstructions: "మందులు మరియు సూచనలు",
  },
  bn: {
    welcome: "স্বাগতম",
    dashboardDescription: "এক নজরে আপনার স্বাস্থ্য",
    healthStats: "স্বাস্থ্য পরিসংখ্যান",
    weight: "ওজন",
    bloodPressure: "রক্তচাপ",
    cholesterol: "কোলেস্টেরল",
    labTests: "ল্যাব পরীক্ষা",
    trackTestResults: "আপনার পরীক্ষার ফলাফল ট্র্যাক করুন",
    addTest: "পরীক্ষা যোগ করুন",
    pending: "বিচারাধীন",
    completed: "পূর্ণ",
    testName: "পরীক্ষার নাম",
    testDate: "পরীক্ষার তারিখ",
    cancel: "বাতিল",
    myPrescriptions: "আমার প্রেসক্রিপশন",
    medicationsAndInstructions: "ওষুধ এবং নির্দেশাবলী",
  },
  mr: {
    welcome: "स्वागत",
    dashboardDescription: "एका नजरेत तुमचे आरोग्य",
    healthStats: "आरोग्य आकडेवारी",
    weight: "वजन",
    bloodPressure: "रक्तदाब",
    cholesterol: "कोलेस्टेरॉल",
    labTests: "प्रयोगशाला चाचण्या",
    trackTestResults: "तुमचे चाचणी परिणाम ट्रॅक करा",
    addTest: "चाचणी जोडा",
    pending: "प्रलंबित",
    completed: "पूर्ण",
    testName: "चाचणीचे नाव",
    testDate: "चाचणी तारीख",
    cancel: "रद्द करा",
    myPrescriptions: "माझी औषधे",
    medicationsAndInstructions: "औषधे आणि सूचना",
  },
  gu: {
    welcome: "સ્વાગત",
    dashboardDescription: "એક નજરમાં તમારું સ્વાસ્થ્ય",
    healthStats: "સ્વાસ્થ્ય આંકડા",
    weight: "વજન",
    bloodPressure: "બ્લડ પ્રૈસશર",
    cholesterol: "કોલેસ્ટેરોલ",
    labTests: "લેબ ટેસ્ટ",
    trackTestResults: "તમારા ટેસ્ટ પરિણામો ટ્રેક કરો",
    addTest: "ટેસ્ટ ઉમેરો",
    pending: "બાકી",
    completed: "પૂર્ણ",
    testName: "ટેસ્ટનું નામ",
    testDate: "ટેસ્ટની તારીખ",
    cancel: "રદ કરો",
    myPrescriptions: "મોને પ્રિસ્ક્રિપ્શન",
    medicationsAndInstructions: "દવાઓ અને સૂચનાઓ",
  },
  kn: {
    welcome: "ಸ್ವಾಗತ",
    dashboardDescription: "ಒಂದು ನೋಟದಲ್ಲಿ ನಿಮ್ಮ ಆರೋಗ್ಯ",
    healthStats: "ಆರೋಗ್ಯ ಅಂಕಿಅಂಶಗಳು",
    weight: "ತೂಕ",
    bloodPressure: "ರಕ್ತದೊತ್ತಡ",
    cholesterol: "ಕೊಲೆಸ್ಟ್ರಾಲ್",
    labTests: "ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳು",
    trackTestResults: "ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    addTest: "ಪರೀಕ್ಷೆ ಸೇರಿಸಿ",
    pending: "ಬಾಕಿ",
    completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
    testName: "ಪರೀಕ್ಷೆಯ ಹೆಸರು",
    testDate: "ಪರೀಕ್ಷೆಯ ದಿನಾಂಕ",
    cancel: "ರದ್ದುಮಾಡಿ",
    myPrescriptions: "ನನ್ನ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು",
    medicationsAndInstructions: "ಔಷಧಿಗಳು ಮತ್ತು ಸೂಚನೆಗಳು",
  },
  ml: {
    welcome: "സ്വാഗതം",
    dashboardDescription: "ഒറ്റനോട്ടത്തിൽ നിങ്ങളുടെ ആരോഗ്യം",
    healthStats: "ആരോഗ്യ സ്ഥിതിവിവരങ്ങൾ",
    weight: "ഭാരം",
    bloodPressure: "രക്തസമ്മർദ്ദം",
    cholesterol: "കൊളസ്ട്രോൾ",
    labTests: "ലാബ് പരിശോധനകൾ",
    trackTestResults: "നിങ്ങളുടെ പരിശോധനാ ഫലങ്ങൾ ട്രാക്ക് ചെയ്യുക",
    addTest: "പരിശോധന ചേർക്കുക",
    pending: "തീർപ്പുകൽപ്പിക്കാത്തത്",
    completed: "പൂർത്തിയായി",
    testName: "പരിശോധനയുടെ പേര്",
    testDate: "പരിശോധന തീയതി",
    cancel: "റദ്ദാക്കുക",
    myPrescriptions: "എന്റെ കുറിപ്പടികൾ",
    medicationsAndInstructions: "മരുന്നുകളും നിർദ്ദേശങ്ങളും",
  },
  pa: {
    welcome: "ਸਵਾਗਤ",
    dashboardDescription: "ਇੱਕ ਨਜ਼ਰ ਵਿੱਚ ਤੁਹਾਡੀ ਸਿਹਤ",
    healthStats: "ਸਿਹਤ ਅੰਕੜੇ",
    weight: "ਭਾਰ",
    bloodPressure: "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ",
    cholesterol: "ਕੋਲੈਸਟ੍ਰੋਲ",
    labTests: "ਲੈਬ ਟੈਸਟ",
    trackTestResults: "ਆਪਣੇ ਟੈਸਟ ਨਤੀਜਿਆਂ ਨੂੰ ਟਰੈਕ ਕਰੋ",
    addTest: "ਟੈਸਟ ਯੋਗ ਕੰਕੋ",
    pending: "ਬਾਕੀ",
    completed: "ਪੂਰਾ",
    testName: "ਟੈਸਟ ਦਾ ਨਾਮ",
    testDate: "ਟੈਸਟ ਦੀ ਤਾਰੀਖ",
    cancel: "ਰੱਦ ਕਰੋ",
    myPrescriptions: "ਮੇਰੇ ਨੁਸਖੇ",
    medicationsAndInstructions: "ਦਵਾਈਆਂ ਅਤੇ ਹਿਦਾਇਤਾਂ",
  },
  or: {
    welcome: "ସ୍ୱାଗତ",
    dashboardDescription: "ଏକ ନଜରରେ ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ",
    healthStats: "ସ୍ୱାସ୍ଥ୍ୟ ପରିସଂଖ୍ୟାନ",
    weight: "ଓଜନ",
    bloodPressure: "ରକ୍ତଚାପ",
    cholesterol: "କୋଲେଷ୍ଟୋରଲ",
    labTests: "ଲ୍ୟାବ୍ ପରୀକ୍ଷା",
    trackTestResults: "ଆପଣଙ୍କ ପରୀକ୍ଷା ଫଳାଫଳ ଟ୍ରାକ୍ କରନ୍ତୁ",
    addTest: "ପରୀକ୍ଷା ଯୋଗ କରନ୍ତୁ",
    pending: "ବିଚାରାଧୀନ",
    completed: "ସମାପ୍ତ",
    testName: "ପରୀକ୍ଷାର ନାମ",
    testDate: "ପରୀକ୍ଷା ତାରିଖ",
    cancel: "ବାତିଲ୍ କରନ୍ତୁ",
    myPrescriptions: "ମୋର ପ୍ରେସକ୍ରିପସନ",
    medicationsAndInstructions: "ଔଷଧ ଏବଂ ନିର୍ଦ୍ଦେଶ",
  },
  as: {
    welcome: "স্বাগতম",
    dashboardDescription: "এক নজৰতে আপোনাৰ স্বাস্থ্য",
    healthStats: "স্বাস্থ্য পৰিসংখ্যা",
    weight: "ওজন",
    bloodPressure: "ৰক্তচাপ",
    cholesterol: "কলেষ্টেৰল",
    labTests: "লেব পৰীক্ষা",
    trackTestResults: "আপোনাৰ পৰীক্ষাৰ ফলাফল ট্ৰেক কৰক",
    addTest: "পৰীক্ষা যোগ কৰক",
    pending: "বিচাৰাধীন",
    completed: "সমাপ্ত",
    testName: "পৰীক্ষাৰ নাম",
    testDate: "পৰীক্ষাৰ তাৰিখ",
    cancel: "বাতিল কৰক",
    myPrescriptions: "মোৰ প্ৰেছক্ৰিপচন",
    medicationsAndInstructions: "ঔষধ আৰু নিৰ্দেশনা",
  }
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

  // Initialize language on mount
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
    const languageTranslations = translations[currentLanguage.code as keyof typeof translations];
    return languageTranslations?.[key as keyof typeof languageTranslations] || key;
  };

  const speak = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isSpeechSynthesisSupported) {
        reject(new Error('Speech synthesis is not supported in this browser.'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage.speechCode;
      
      // Try to find a voice that matches the language
      const voices = speechSynthesis.getVoices();
      const matchingVoice = voices.find(voice => 
        voice.lang === currentLanguage.speechCode || 
        voice.lang.startsWith(currentLanguage.code)
      );
      
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

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

  // Don't render children until initialized to prevent context errors
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
