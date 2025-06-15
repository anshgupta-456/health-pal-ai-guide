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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
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
    symptom_headache: "हल्का सिरदर्द",
    advice_headache: "पानी पिएं, शांत जगह पर आराम करें, और तेज़ रोशनी से बचें। यदि सिरदर्द बना रहे या बढ़ जाए तो डॉक्टर से सलाह लें।",
    symptom_cough: "हल्की खाँसी",
    advice_cough: "हाइड्रेट रहें, गर्म तरल पदार्थ लें और आराम करें। यदि खाँसी एक सप्ताह से अधिक जारी रहे तो चिकित्सा सलाह लें।",
    symptom_tiredness: "हल्की थकान",
    advice_tiredness: "अच्छी तरह से आराम करें, संतुलित आहार लें और अत्यधिक श्रम से बचें। लगातार थकान के लिए जांच कराएँ।",
    symptom_runny_nose: "बहती नाक",
    advice_runny_nose: "मुलायम टिश्यू का उपयोग करें, गर्म तरल पदार्थ पिएं और आराम करें। यदि लक्षण गंभीर हो जाएँ या सांस लेने में परेशानी हो तो डॉक्टर से मिलें।",
    symptom_sore_throat: "गला ख़राब",
    advice_sore_throat: "गरारे करें और गर्म तरल पदार्थ लें। यदि दर्द गंभीर है या कई दिनों तक रहता है तो डॉक्टर से सलाह लें।",
    check_mild_symptoms: "अपने हल्के लक्षण जांचें",
    get_advice: "सलाह लें",
    reset: "रीसेट",
    advice_label: "Advice:",
    advice_disclaimer: "यदि लक्षण गंभीर हैं या आप अस्वस्थ महसूस कर रहे हैं, तो कृपया स्वास्थ्य विशेषज्ञ से परामर्श करें।"
  },
  ta: {
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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
  },
  te: {
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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
  },
  bn: {
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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
  },
  mr: {
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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
  },
  gu: {
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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
  },
  kn: {
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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
  },
  ml: {
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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
  },
  pa: {
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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
  },
  or: {
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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
  },
  as: {
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
    advice_disclaimer: "If symptoms are severe or you feel unwell, please consult a healthcare professional."
  },
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
