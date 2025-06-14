
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = supportedLanguages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

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
      
      // Common terms for all pages
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
      reportSideEffect: 'साइड इफेक्ट की रिपोर्ट करें',
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
      
      // Common terms
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
      // Common
      dashboard: 'ড্যাশবোর্ড',
      profile: 'প্রোফাইল',
      prescriptions: 'প্রেসক্রিপশন',
      exercises: 'ব্যায়াম',
      labTests: 'ল্যাব টেস্ট',
      reminders: 'রিমাইন্ডার',
      welcome: 'স্বাগতম',
      
      // Dashboard specific
      yourHealthCompanion: 'আপনার স্বাস্থ্য সঙ্গী',
      welcomeBack: 'স্বাগতম, রাজেশ কুমার!',
      yourHealthCompanionGuide: 'আপনার স্বাস্থ্য সঙ্গী আপনাকে গাইড করতে এখানে আছে',
      lastVisitJan15: 'শেষ দেখা: ১৫ জানুয়ারি, ২০২৪',
      feb15: '১৫ ফেব্রুয়ারি',
      daysSinceVisit: 'দেখার পর থেকে দিন',
      todaysTasks: 'আজকের কাজ',
      kneeFlexionRoutine: 'হাঁটু ফ্লেক্সন রুটিন',
      quickActions: 'দ্রুত কাজ',
      findNearbyLab: 'কাছাকাছি ল্যাব খুঁজুন',
      bookAppointment: 'অ্যাপয়েন্টমেন্ট বুক করুন',
      reportSideEffect: 'পার্শ্ব প্রতিক্রিয়া রিপোর্ট করুন',
      emergencyContacts: 'জরুরি যোগাযোগ',
      emergency108: 'জরুরি: ১০৮',
      medicalEmergency24x7: '২৪/৭ মেডিক্যাল জরুরি',
      
      // Profile Page
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
      
      // Common terms
      stayOnTrack: 'আপনার যত্ন পরিকল্পনায় থাকুন',
      active: 'সক্রিয়',
      today: 'আজ',
      overdue: 'বিলম্বিত',
      medications: 'ওষুধ',
      takeMedication: 'ওষুধ নিন',
      doExercises: 'ব্যায়াম করুন',
      doctorAppointment: 'ডাক্তারের অ্যাপয়েন্টমেন্ট',
      afterBreakfast: 'নাস্তার পরে',
      flexionRoutine: 'ফ্লেক্সন এবং শক্তিশালীকরণ রুটিন',
      followUp: 'ডাঃ প্রিয়া শর্মার সাথে ফলো-আপ',
      daily: 'দৈনিক',
      appointment: 'অ্যাপয়েন্টমেন্ট',
      missed: 'মিস করেছেন',
      todaysProgress: 'আজকের অগ্রগতি'
    },
    te: {
      // Common
      dashboard: 'డాష్‌బోర్డ్',
      profile: 'ప్రొఫైల్',
      prescriptions: 'ప్రిస్క్రిప్షన్లు',
      exercises: 'వ్యాయామాలు',
      labTests: 'ల్యాబ్ టెస్టులు',
      reminders: 'రిమైండర్లు',
      welcome: 'తిరిగి స్వాగతం',
      
      // Dashboard specific
      yourHealthCompanion: 'మీ ఆరోగ్య సహచరుడు',
      welcomeBack: 'తిరిగి స్వాగతం, రాజేష్ కుమార్!',
      yourHealthCompanionGuide: 'మీ ఆరోగ్య సహచరుడు మీకు మార్గదర్శనం చేయడానికి ఇక్కడ ఉన్నాడు',
      lastVisitJan15: 'చివరి సందర్శన: జనవరి 15, 2024',
      feb15: 'ఫిబ్రవరి 15',
      daysSinceVisit: 'సందర్శన తర్వాత రోజులు',
      todaysTasks: 'నేటి పనులు',
      kneeFlexionRoutine: 'మోకాలి ఫ్లెక్షన్ రొటీన్',
      quickActions: 'త్వరిత చర్యలు',
      findNearbyLab: 'సమీప ల్యాబ్ కనుగొనండి',
      bookAppointment: 'అపాయింట్మెంట్ బుక్ చేయండి',
      reportSideEffect: 'సైడ్ ఎఫెక్ట్ నివేదించండి',
      emergencyContacts: 'అత్యవసర పరిచయాలు',
      emergency108: 'అత్యవసరం: 108',
      medicalEmergency24x7: '24/7 వైద్య అత్యవసరం',
      
      // Profile Page
      basicInformation: 'ప్రాథమిక సమాచారం',
      medicalInformation: 'వైద్య సమాచారం',
      name: 'పేరు',
      age: 'వయస్సు',
      gender: 'లింగం',
      preferredLanguage: 'ఇష్టపడే భాష',
      currentCondition: 'ప్రస్తుత స్థితి',
      treatingPhysician: 'మీ చికిత్సా వైద్యుడు',
      lastVisit: 'చివరి సందర్శన',
      nextAppointment: 'తదుపరి అపాయింట్మెంట్',
      rajeshKumar: 'రాజేష్ కుమార్',
      years58: '58 సంవత్సరాలు',
      male: 'పురుషుడు',
      hindi: 'హిందీ',
      postOpKneeRecovery: 'మోకాలి శస్త్రచికిత్స తర్వాత కోలుకోవడం',
      drPriyaSharma: 'డాక్టర్ ప్రియా శర్మ',
      
      // Common terms
      stayOnTrack: 'మీ సంరక్షణ ప్రణాళికలో ఉండండి',
      active: 'చురుకైన',
      today: 'ఈ రోజు',
      overdue: 'ఆలస్యం',
      medications: 'మందులు',
      takeMedication: 'మందు తీసుకోండి',
      doExercises: 'వ్యాయామాలు చేయండి',
      doctorAppointment: 'డాక్టర్ అపాయింట్మెంట్',
      afterBreakfast: 'అల్పాహారం తర్వాత',
      flexionRoutine: 'ఫ్లెక్షన్ మరియు బలపరిచే రొటీన్',
      followUp: 'డాక్టర్ ప్రియా శర్మతో ఫాలో-అప్',
      daily: 'రోజువారీ',
      appointment: 'అపాయింట్మెంట్',
      missed: 'మిస్ అయింది',
      todaysProgress: 'నేటి పురోగతి'
    },
    mr: {
      // Common
      dashboard: 'डॅशबोर्ड',
      profile: 'प्रोफाइल',
      prescriptions: 'प्रिस्क्रिप्शन',
      exercises: 'व्यायाम',
      labTests: 'लॅब टेस्ट',
      reminders: 'रिमाइंडर',
      welcome: 'पुन्हा स्वागत',
      
      // Dashboard specific
      yourHealthCompanion: 'तुमचा आरोग्य साथी',
      welcomeBack: 'पुन्हा स्वागत, राजेश कुमार!',
      yourHealthCompanionGuide: 'तुमचा आरोग्य साथी तुम्हाला मार्गदर्शन करण्यासाठी येथे आहे',
      lastVisitJan15: 'शेवटची भेट: 15 जानेवारी, 2024',
      feb15: '15 फेब्रुवारी',
      daysSinceVisit: 'भेटीनंतरचे दिवस',
      todaysTasks: 'आजची कामे',
      kneeFlexionRoutine: 'गुडघ्याची फ्लेक्शन रूटीन',
      quickActions: 'द्रुत कृती',
      findNearbyLab: 'जवळची लॅब शोधा',
      bookAppointment: 'अपॉइंटमेंट बुक करा',
      reportSideEffect: 'साइड इफेक्टची तक्रार करा',
      emergencyContacts: 'आपत्कालीन संपर्क',
      emergency108: 'आपत्काल: 108',
      medicalEmergency24x7: '24/7 वैद्यकीय आपत्काल',
      
      // Profile Page
      basicInformation: 'मूलभूत माहिती',
      medicalInformation: 'वैद्यकीय माहिती',
      name: 'नाव',
      age: 'वय',
      gender: 'लिंग',
      preferredLanguage: 'पसंतीची भाषा',
      currentCondition: 'सध्याची स्थिती',
      treatingPhysician: 'तुमचे उपचार करणारे डॉक्टर',
      lastVisit: 'शेवटची भेट',
      nextAppointment: 'पुढची अपॉइंटमेंट',
      rajeshKumar: 'राजेश कुमार',
      years58: '58 वर्षे',
      male: 'पुरुष',
      hindi: 'हिंदी',
      postOpKneeRecovery: 'गुडघ्याच्या शस्त्रक्रियेनंतरची पुनर्प्राप्ती',
      drPriyaSharma: 'डॉ. प्रिया शर्मा',
      
      // Common terms
      stayOnTrack: 'तुमच्या काळजी योजनेवर राहा',
      active: 'सक्रिय',
      today: 'आज',
      overdue: 'उशीर',
      medications: 'औषधे',
      takeMedication: 'औषध घ्या',
      doExercises: 'व्यायाम करा',
      doctorAppointment: 'डॉक्टर अपॉइंटमेंट',
      afterBreakfast: 'नाश्ट्यानंतर',
      flexionRoutine: 'फ्लेक्शन आणि मजबूत करणारी रूटीन',
      followUp: 'डॉ. प्रिया शर्मा यांच्यासोबत फॉलो-अप',
      daily: 'दैनंदिन',
      appointment: 'अपॉइंटमेंट',
      missed: 'चुकले',
      todaysProgress: 'आजची प्रगती'
    },
    ta: {
      // Common
      dashboard: 'டாஷ்போர்டு',
      profile: 'சுயவிவரம்',
      prescriptions: 'மருந்து பரிந்துரைகள்',
      exercises: 'உடற்பயிற்சிகள்',
      labTests: 'ஆய்வக சோதனைகள்',
      reminders: 'நினைவூட்டல்கள்',
      welcome: 'மீண்டும் வரவேற்கிறோம்',
      
      // Dashboard specific
      yourHealthCompanion: 'உங்கள் ஆரோக்கிய துணை',
      welcomeBack: 'மீண்டும் வரவேற்கிறோம், ராஜேஷ் குமார்!',
      yourHealthCompanionGuide: 'உங்கள் ஆரோக்கிய துணை உங்களுக்கு வழிகாட்ட இங்கே உள்ளது',
      lastVisitJan15: 'கடைசி வருகை: ஜனவரி 15, 2024',
      feb15: 'பிப்ரவரி 15',
      daysSinceVisit: 'வருகைக்குப் பிறகான நாட்கள்',
      todaysTasks: 'இன்றைய பணிகள்',
      kneeFlexionRoutine: 'முழங்கால் நெகிழ்வு வழக்கம்',
      quickActions: 'விரைவு செயல்கள்',
      findNearbyLab: 'அருகிலுள்ள ஆய்வகத்தைக் கண்டறியவும்',
      bookAppointment: 'சந்திப்பு முன்பதிவு செய்யவும்',
      reportSideEffect: 'பக்க விளைவுகளைப் புகாரளிக்கவும்',
      emergencyContacts: 'அவசரகால தொடர்புகள்',
      emergency108: 'அவசரம்: 108',
      medicalEmergency24x7: '24/7 மருத்துவ அவசரம்',
      
      // Profile Page
      basicInformation: 'அடிப்படை தகவல்',
      medicalInformation: 'மருத்துவ தகவல்',
      name: 'பெயர்',
      age: 'வயது',
      gender: 'பாலினம்',
      preferredLanguage: 'விருப்பமான மொழி',
      currentCondition: 'தற்போதைய நிலை',
      treatingPhysician: 'உங்கள் சிகிச்சை மருத்துவர்',
      lastVisit: 'கடைசி வருகை',
      nextAppointment: 'அடுத்த சந்திப்பு',
      rajeshKumar: 'ராஜேஷ் குமார்',
      years58: '58 ஆண்டுகள்',
      male: 'ஆண்',
      hindi: 'இந்தி',
      postOpKneeRecovery: 'முழங்கால் அறுவை சிகிச்சைக்குப் பிந்தைய மீட்டல்',
      drPriyaSharma: 'டாக்டர் பிரியா சர்மா',
      
      // Common terms
      stayOnTrack: 'உங்கள் கவனிப்பு திட்டத்தில் இருங்கள்',
      active: 'செயலில்',
      today: 'இன்று',
      overdue: 'தாமதம்',
      medications: 'மருந்துகள்',
      takeMedication: 'மருந்து எடுத்துக்கொள்ளவும்',
      doExercises: 'உடற்பயிற்சி செய்யவும்',
      doctorAppointment: 'மருத்துவர் சந்திப்பு',
      afterBreakfast: 'காலை உணவுக்குப் பிறகு',
      flexionRoutine: 'நெகிழ்வு மற்றும் வலுப்படுத்தும் வழக்கம்',
      followUp: 'டாக்டர் பிரியா சர்மாவுடன் பின்தொடர்தல்',
      daily: 'தினசரி',
      appointment: 'சந்திப்பு',
      missed: 'தவறவிட்டது',
      todaysProgress: 'இன்றைய முன்னேற்றம்'
    },
    gu: {
      // Common
      dashboard: 'ડેશબોર્ડ',
      profile: 'પ્રોફાઇલ',
      prescriptions: 'પ્રિસ્ક્રિપ્શન',
      exercises: 'કસરત',
      labTests: 'લેબ ટેસ્ટ',
      reminders: 'રિમાઇન્ડર',
      welcome: 'પાછા સ્વાગત છે',
      
      // Dashboard specific
      yourHealthCompanion: 'તમારો આરોગ્ય સાથી',
      welcomeBack: 'પાછા સ્વાગત છે, રાજેશ કુમાર!',
      yourHealthCompanionGuide: 'તમારો આરોગ્ય સાથી તમને માર્ગદર્શન આપવા માટે અહીં છે',
      lastVisitJan15: 'છેલ્લી મુલાકાત: 15 જાન્યુઆરી, 2024',
      feb15: '15 ફેબ્રુઆરી',
      daysSinceVisit: 'મુલાકાત પછીના દિવસો',
      todaysTasks: 'આજના કાર્યો',
      kneeFlexionRoutine: 'ઘૂંટણની ફ્લેક્શન રૂટિન',
      quickActions: 'ઝડપી ક્રિયાઓ',
      findNearbyLab: 'નજીકની લેબ શોધો',
      bookAppointment: 'એપોઇન્ટમેન્ટ બુક કરો',
      reportSideEffect: 'સાઇડ ઇફેક્ટની જાણ કરો',
      emergencyContacts: 'કટોકટી સંપર્કો',
      emergency108: 'કટોકટી: 108',
      medicalEmergency24x7: '24/7 મેડિકલ કટોકટી',
      
      // Profile Page
      basicInformation: 'મૂળભૂત માહિતી',
      medicalInformation: 'મેડિકલ માહિતી',
      name: 'નામ',
      age: 'ઉંમર',
      gender: 'લિંગ',
      preferredLanguage: 'પસંદગીની ભાષા',
      currentCondition: 'વર્તમાન સ્થિતિ',
      treatingPhysician: 'તમારા સારવાર કરનાર ડૉક્ટર',
      lastVisit: 'છેલ્લી મુલાકાત',
      nextAppointment: 'આગલી એપોઇન્ટમેન્ટ',
      rajeshKumar: 'રાજેશ કુમાર',
      years58: '58 વર્ષ',
      male: 'પુરુષ',
      hindi: 'હિન્દી',
      postOpKneeRecovery: 'ઘૂંટણની સર્જરી પછીની રિકવરી',
      drPriyaSharma: 'ડૉ. પ્રિયા શર્મા',
      
      // Common terms
      stayOnTrack: 'તમારી સંભાળ યોજનામાં રહો',
      active: 'સક્રિય',
      today: 'આજે',
      overdue: 'મુદત વીતી ગઈ',
      medications: 'દવાઓ',
      takeMedication: 'દવા લો',
      doExercises: 'કસરત કરો',
      doctorAppointment: 'ડૉક્ટર એપોઇન્ટમેન્ટ',
      afterBreakfast: 'નાસ્તા પછી',
      flexionRoutine: 'ફ્લેક્શન અને મજબૂતીકરણ રૂટિન',
      followUp: 'ડૉ. પ્રિયા શર્મા સાથે ફોલો-અપ',
      daily: 'દૈનિક',
      appointment: 'એપોઇન્ટમેન્ટ',
      missed: 'ચૂકી ગયું',
      todaysProgress: 'આજની પ્રગતિ'
    },
    kn: {
      // Common
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      profile: 'ಪ್ರೊಫೈಲ್',
      prescriptions: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು',
      exercises: 'ವ್ಯಾಯಾಮಗಳು',
      labTests: 'ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳು',
      reminders: 'ಜ್ಞಾಪನೆಗಳು',
      welcome: 'ಮತ್ತೆ ಸ್ವಾಗತ',
      
      // Dashboard specific
      yourHealthCompanion: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಚರ',
      welcomeBack: 'ಮತ್ತೆ ಸ್ವಾಗತ, ರಾಜೇಶ್ ಕುಮಾರ್!',
      yourHealthCompanionGuide: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಚರ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ಇಲ್ಲಿದೆ',
      lastVisitJan15: 'ಕೊನೆಯ ಭೇಟಿ: ಜನವರಿ 15, 2024',
      feb15: 'ಫೆಬ್ರವರಿ 15',
      daysSinceVisit: 'ಭೇಟಿಯ ನಂತರದ ದಿನಗಳು',
      todaysTasks: 'ಇಂದಿನ ಕಾರ್ಯಗಳು',
      kneeFlexionRoutine: 'ಮೊಣಕಾಲು ಫ್ಲೆಕ್ಷನ್ ದಿನಚರಿ',
      quickActions: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
      findNearbyLab: 'ಹತ್ತಿರದ ಲ್ಯಾಬ್ ಹುಡುಕಿ',
      bookAppointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',
      reportSideEffect: 'ಅಡ್ಡ ಪರಿಣಾಮವನ್ನು ವರದಿ ಮಾಡಿ',
      emergencyContacts: 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
      emergency108: 'ತುರ್ತು: 108',
      medicalEmergency24x7: '24/7 ವೈದ್ಯಕೀಯ ತುರ್ತು',
      
      // Profile Page
      basicInformation: 'ಮೂಲಭೂತ ಮಾಹಿತಿ',
      medicalInformation: 'ವೈದ್ಯಕೀಯ ಮಾಹಿತಿ',
      name: 'ಹೆಸರು',
      age: 'ವಯಸ್ಸು',
      gender: 'ಲಿಂಗ',
      preferredLanguage: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
      currentCondition: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
      treatingPhysician: 'ನಿಮ್ಮ ಚಿಕಿತ್ಸಾ ವೈದ್ಯರು',
      lastVisit: 'ಕೊನೆಯ ಭೇಟಿ',
      nextAppointment: 'ಮುಂದಿನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
      rajeshKumar: 'ರಾಜೇಶ್ ಕುಮಾರ್',
      years58: '58 ವರ್ಷಗಳು',
      male: 'ಪುರುಷ',
      hindi: 'ಹಿಂದಿ',
      postOpKneeRecovery: 'ಮೊಣಕಾಲು ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯ ನಂತರದ ಚೇತರಿಕೆ',
      drPriyaSharma: 'ಡಾ. ಪ್ರಿಯಾ ಶರ್ಮಾ',
      
      // Common terms
      stayOnTrack: 'ನಿಮ್ಮ ಆರೈಕೆ ಯೋಜನೆಯಲ್ಲಿ ಇರಿ',
      active: 'ಸಕ್ರಿಯ',
      today: 'ಇಂದು',
      overdue: 'ವಿಳಂಬ',
      medications: 'ಔಷಧಿಗಳು',
      takeMedication: 'ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳಿ',
      doExercises: 'ವ್ಯಾಯಾಮ ಮಾಡಿ',
      doctorAppointment: 'ವೈದ್ಯರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
      afterBreakfast: 'ಬೆಳಗಿನ ಉಪಾಹಾರದ ನಂತರ',
      flexionRoutine: 'ಫ್ಲೆಕ್ಷನ್ ಮತ್ತು ಬಲಪಡಿಸುವ ದಿನಚರಿ',
      followUp: 'ಡಾ. ಪ್ರಿಯಾ ಶರ್ಮಾ ಅವರೊಂದಿಗೆ ಫಾಲೋ-ಅಪ್',
      daily: 'ದೈನಂದಿನ',
      appointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
      missed: 'ತಪ್ಪಿಸಿಕೊಂಡಿದೆ',
      todaysProgress: 'ಇಂದಿನ ಪ್ರಗತಿ'
    },
    ml: {
      // Common
      dashboard: 'ഡാഷ്‌ബോർഡ്',
      profile: 'പ്രൊഫൈൽ',
      prescriptions: 'കുറിപ്പടികൾ',
      exercises: 'വ്യായാമങ്ങൾ',
      labTests: 'ലാബ് ടെസ്റ്റുകൾ',
      reminders: 'ഓർമ്മപ്പെടുത്തലുകൾ',
      welcome: 'തിരികെ സ്വാഗതം',
      
      // Dashboard specific
      yourHealthCompanion: 'നിങ്ങളുടെ ആരോഗ്യ സഹായി',
      welcomeBack: 'തിരികെ സ്വാഗതം, രാജേഷ് കുമാർ!',
      yourHealthCompanionGuide: 'നിങ്ങളുടെ ആരോഗ്യ സഹായി നിങ്ങളെ വഴികാട്ടാൻ ഇവിടെയുണ്ട്',
      lastVisitJan15: 'അവസാന സന്ദർശനം: ജനുവരി 15, 2024',
      feb15: 'ഫെബ്രുവരി 15',
      daysSinceVisit: 'സന്ദർശനത്തിന് ശേഷമുള്ള ദിവസങ്ങൾ',
      todaysTasks: 'ഇന്നത്തെ ജോലികൾ',
      kneeFlexionRoutine: 'കാൽമുട്ട് ഫ്ലെക്ഷൻ പ്രക്രിയ',
      quickActions: 'വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ',
      findNearbyLab: 'അടുത്തുള്ള ലാബ് കണ്ടെത്തുക',
      bookAppointment: 'അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക',
      reportSideEffect: 'പാർശ്വഫലം റിപ്പോർട്ട് ചെയ്യുക',
      emergencyContacts: 'അടിയന്തര കോൺടാക്റ്റുകൾ',
      emergency108: 'അടിയന്തരം: 108',
      medicalEmergency24x7: '24/7 മെഡിക്കൽ അടിയന്തരാവസ്ഥ',
      
      // Profile Page
      basicInformation: 'അടിസ്ഥാന വിവരങ്ങൾ',
      medicalInformation: 'മെഡിക്കൽ വിവരങ്ങൾ',
      name: 'പേര്',
      age: 'പ്രായം',
      gender: 'ലിംഗം',
      preferredLanguage: 'ഇഷ്ടപ്പെട്ട ഭാഷ',
      currentCondition: 'നിലവിലെ അവസ്ഥ',
      treatingPhysician: 'നിങ്ങളുടെ ചികിത്സാ ഡോക്ടർ',
      lastVisit: 'അവസാന സന്ദർശനം',
      nextAppointment: 'അടുത്ത അപ്പോയിന്റ്മെന്റ്',
      rajeshKumar: 'രാജേഷ് കുമാർ',
      years58: '58 വർഷം',
      male: 'പുരുഷൻ',
      hindi: 'ഹിന്ദി',
      postOpKneeRecovery: 'കാൽമുട്ട് ശസ്ത്രക്രിയയ്ക്ക് ശേഷമുള്ള വീണ്ടെടുപ്പ്',
      drPriyaSharma: 'ഡോ. പ്രിയ ശർമ്മ',
      
      // Common terms
      stayOnTrack: 'നിങ്ങളുടെ പരിചരണ പദ്ധതിയിൽ തുടരുക',
      active: 'സജീവം',
      today: 'ഇന്ന്',
      overdue: 'കാലതാമസം',
      medications: 'മരുന്നുകൾ',
      takeMedication: 'മരുന്ന് കഴിക്കുക',
      doExercises: 'വ്യായാമം ചെയ്യുക',
      doctorAppointment: 'ഡോക്ടർ അപ്പോയിന്റ്മെന്റ്',
      afterBreakfast: 'പ്രാതലിന് ശേഷം',
      flexionRoutine: 'ഫ്ലെക്ഷൻ, ശക്തിപ്പെടുത്തൽ പ്രക്രിയ',
      followUp: 'ഡോ. പ്രിയ ശർമ്മയുമായി ഫോളോ-അപ്',
      daily: 'ദൈനംദിനം',
      appointment: 'അപ്പോയിന്റ്മെന്റ്',
      missed: 'നഷ്ടമായി',
      todaysProgress: 'ഇന്നത്തെ പുരോഗതി'
    },
    pa: {
      // Common
      dashboard: 'ਡੈਸ਼ਬੋਰਡ',
      profile: 'ਪ੍ਰੋਫਾਈਲ',
      prescriptions: 'ਨੁਸਖੇ',
      exercises: 'ਕਸਰਤਾਂ',
      labTests: 'ਲੈਬ ਟੈਸਟ',
      reminders: 'ਰਿਮਾਈਂਡਰ',
      welcome: 'ਵਾਪਸ ਜੀ ਆਇਆਂ ਨੂੰ',
      
      // Dashboard specific
      yourHealthCompanion: 'ਤੁਹਾਡਾ ਸਿਹਤ ਸਾਥੀ',
      welcomeBack: 'ਵਾਪਸ ਜੀ ਆਇਆਂ ਨੂੰ, ਰਾਜੇਸ਼ ਕੁਮਾਰ!',
      yourHealthCompanionGuide: 'ਤੁਹਾਡਾ ਸਿਹਤ ਸਾਥੀ ਤੁਹਾਨੂੰ ਗਾਈਡ ਕਰਨ ਲਈ ਇੱਥੇ ਹੈ',
      lastVisitJan15: 'ਆਖਰੀ ਮੁਲਾਕਾਤ: 15 ਜਨਵਰੀ, 2024',
      feb15: '15 ਫਰਵਰੀ',
      daysSinceVisit: 'ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਦੇ ਦਿਨ',
      todaysTasks: 'ਅੱਜ ਦੇ ਕੰਮ',
      kneeFlexionRoutine: 'ਗੋਡੇ ਦੀ ਫਲੈਕਸ਼ਨ ਰੂਟੀਨ',
      quickActions: 'ਤੇਜ਼ ਕਾਰਵਾਈਆਂ',
      findNearbyLab: 'ਨੇੜਲੀ ਲੈਬ ਲੱਭੋ',
      bookAppointment: 'ਅਪਾਇਨਟਮੈਂਟ ਬੁੱਕ ਕਰੋ',
      reportSideEffect: 'ਸਾਈਡ ਇਫੈਕਟ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
      emergencyContacts: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ',
      emergency108: 'ਐਮਰਜੈਂਸੀ: 108',
      medicalEmergency24x7: '24/7 ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ',
      
      // Profile Page
      basicInformation: 'ਬੁਨਿਆਦੀ ਜਾਣਕਾਰੀ',
      medicalInformation: 'ਮੈਡੀਕਲ ਜਾਣਕਾਰੀ',
      name: 'ਨਾਮ',
      age: 'ਉਮਰ',
      gender: 'ਲਿੰਗ',
      preferredLanguage: 'ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ',
      currentCondition: 'ਮੌਜੂਦਾ ਸਥਿਤੀ',
      treatingPhysician: 'ਤੁਹਾਡੇ ਇਲਾਜ ਕਰਨ ਵਾਲੇ ਡਾਕਟਰ',
      lastVisit: 'ਆਖਰੀ ਮੁਲਾਕਾਤ',
      nextAppointment: 'ਅਗਲੀ ਅਪਾਇਨਟਮੈਂਟ',
      rajeshKumar: 'ਰਾਜੇਸ਼ ਕੁਮਾਰ',
      years58: '58 ਸਾਲ',
      male: 'ਮਰਦ',
      hindi: 'ਹਿੰਦੀ',
      postOpKneeRecovery: 'ਗੋਡੇ ਦੀ ਸਰਜਰੀ ਤੋਂ ਬਾਅਦ ਰਿਕਵਰੀ',
      drPriyaSharma: 'ਡਾ. ਪ੍ਰਿਯਾ ਸ਼ਰਮਾ',
      
      // Common terms
      stayOnTrack: 'ਆਪਣੀ ਦੇਖਭਾਲ ਯੋਜਨਾ ਤੇ ਬਣੇ ਰਹੋ',
      active: 'ਸਰਗਰਮ',
      today: 'ਅੱਜ',
      overdue: 'ਦੇਰ',
      medications: 'ਦਵਾਈਆਂ',
      takeMedication: 'ਦਵਾਈ ਲਓ',
      doExercises: 'ਕਸਰਤ ਕਰੋ',
      doctorAppointment: 'ਡਾਕਟਰ ਦੀ ਅਪਾਇਨਟਮੈਂਟ',
      afterBreakfast: 'ਨਾਸ਼ਤੇ ਤੋਂ ਬਾਅਦ',
      flexionRoutine: 'ਫਲੈਕਸ਼ਨ ਅਤੇ ਮਜ਼ਬੂਤੀ ਰੂਟੀਨ',
      followUp: 'ਡਾ. ਪ੍ਰਿਯਾ ਸ਼ਰਮਾ ਨਾਲ ਫਾਲੋ-ਅਪ',
      daily: 'ਰੋਜ਼ਾਨਾ',
      appointment: 'ਅਪਾਇਨਟਮੈਂਟ',
      missed: 'ਗੁਆਚਿਆ',
      todaysProgress: 'ਅੱਜ ਦੀ ਤਰੱਕੀ'
    }
  };

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language.code);
    console.log('Language changed to:', language.nativeName, 'Code:', language.code);
  };

  const translate = (key: string): string => {
    const translated = translations[currentLanguage.code]?.[key] || translations.en[key] || key;
    console.log('Translating:', key, 'to', currentLanguage.code, '=', translated);
    return translated;
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      console.log('Speaking in', currentLanguage.code, ':', text);
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage.code === 'hi' ? 'hi-IN' : 
                       currentLanguage.code === 'bn' ? 'bn-IN' :
                       currentLanguage.code === 'te' ? 'te-IN' :
                       currentLanguage.code === 'mr' ? 'mr-IN' :
                       currentLanguage.code === 'ta' ? 'ta-IN' :
                       currentLanguage.code === 'gu' ? 'gu-IN' :
                       currentLanguage.code === 'kn' ? 'kn-IN' :
                       currentLanguage.code === 'ml' ? 'ml-IN' :
                       currentLanguage.code === 'pa' ? 'pa-IN' :
                       'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onerror = (event) => {
        console.log('Speech synthesis error:', event.error);
      };
      
      utterance.onstart = () => {
        console.log('Speech started for language:', utterance.lang);
      };
      
      speechSynthesis.speak(utterance);
    } else {
      console.log('Speech synthesis not supported');
    }
  };

  const isSupported = 'speechSynthesis' in window;

  console.log('Current language in context:', currentLanguage);

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
