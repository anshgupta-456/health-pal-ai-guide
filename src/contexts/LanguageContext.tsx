import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define the structure for language options
interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

// Define supported languages
export const supportedLanguages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
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
  speak: (text: string) => void;
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
    daysSinceVisit: 'Days Since Last Visit',
    exerciseRoutines: 'Exercise Routines',
    prescribedExercises: 'Here are your prescribed exercises.',
    kneeFlexion: 'Knee Flexion',
    easy: 'Easy',
    slowlyBendKnee: 'Slowly bend your knee.',
    tenMin: '10 min',
    fifteenReps: '15 reps',
    positionComfortably: 'Position yourself comfortably in a chair.',
    followMovements: 'Follow the movements shown on the screen.',
    moveSlowly: 'Move slowly and deliberately.',
    listenToCoach: 'Listen to the coach for guidance.',
    stopIfPain: 'Stop if you feel any pain.',
    quadricepsStrengthening: 'Quadriceps Strengthening',
    medium: 'Medium',
    tightenThighMuscles: 'Tighten your thigh muscles.',
    fifteenMin: '15 min',
    tenReps: '10 reps',
    lieDown: 'Lie down on your back.',
    tightenThigh: 'Tighten the thigh muscles of one leg.',
    holdFiveSeconds: 'Hold for five seconds.',
    relaxRepeat: 'Relax and repeat with the other leg.',
    notStarted: 'Not Started',
    progress: 'Progress',
    instructions: 'Instructions',
    start: 'Start',

    // New posture detection translations
    postureDetection: "Posture Detection",
    startCamera: "Start Camera",
    stopCamera: "Stop Camera",
    cameraAccessError: "Camera access error. Please check permissions.",
    goodPosture: "Good posture! Keep it up.",
    adjustStraighter: "Try to keep your back straighter.",
    alignShoulders: "Align your shoulders properly.",
    perfectForm: "Perfect form! Excellent work.",
    slightAdjustment: "Small adjustment needed to the left.",
    clickToStartCamera: "Click to start camera",
    loadingCamera: "Loading camera...",
    postureFeedback: "Posture Feedback",
    elapsedTime: "Elapsed Time",
    pause: "Pause",
    reset: "Reset",
    step: "Step",
    of: "of",
    complete: "Complete",
    nextStep: "Next Step",
    livePostureFeedback: "Live Posture Feedback"
  },
  es: {
    dashboard: 'Tablero',
    profile: 'Perfil',
    prescriptions: 'Recetas',
    exercises: 'Ejercicios',
    labTests: 'Pruebas de Laboratorio',
    reminders: 'Recordatorios',
    hello: 'Hola',
    welcome: '¡Bienvenido a tu panel de salud!',
    medications: 'Medicamentos',
    completed: 'Completado',
    daysSinceVisit: 'Días Desde la Última Visita',
    exerciseRoutines: 'Rutinas de Ejercicio',
    prescribedExercises: 'Aquí están tus ejercicios prescritos.',
    kneeFlexion: 'Flexión de Rodilla',
    easy: 'Fácil',
    slowlyBendKnee: 'Dobla lentamente la rodilla.',
    tenMin: '10 min',
    fifteenReps: '15 repeticiones',
    positionComfortably: 'Colócate cómodamente en una silla.',
    followMovements: 'Sigue los movimientos que se muestran en la pantalla.',
    moveSlowly: 'Muévete lenta y deliberadamente.',
    listenToCoach: 'Escucha al entrenador para obtener orientación.',
    stopIfPain: 'Detente si sientes algún dolor.',
    quadricepsStrengthening: 'Fortalecimiento de Cuádriceps',
    medium: 'Medio',
    tightenThighMuscles: 'Aprieta los músculos del muslo.',
    fifteenMin: '15 min',
    tenReps: '10 repeticiones',
    lieDown: 'Acuéstate sobre tu espalda.',
    tightenThigh: 'Aprieta los músculos del muslo de una pierna.',
    holdFiveSeconds: 'Mantén durante cinco segundos.',
    relaxRepeat: 'Relájate y repite con la otra pierna.',
    notStarted: 'No Iniciado',
    progress: 'Progreso',
    instructions: 'Instrucciones',
    start: 'Comenzar',

    // New posture detection translations
    postureDetection: "Detección de Postura",
    startCamera: "Iniciar Cámara",
    stopCamera: "Detener Cámara",
    cameraAccessError: "Error de acceso a la cámara. Verifique los permisos.",
    goodPosture: "¡Buena postura! Sigue así.",
    adjustStraighter: "Trata de mantener la espalda más recta.",
    alignShoulders: "Alinea los hombros correctamente.",
    perfectForm: "¡Forma perfecta! Excelente trabajo.",
    slightAdjustment: "Se necesita un pequeño ajuste hacia la izquierda.",
    clickToStartCamera: "Haz clic para iniciar la cámara",
    loadingCamera: "Cargando cámara...",
    postureFeedback: "Retroalimentación de Postura",
    elapsedTime: "Tiempo Transcurrido",
    pause: "Pausar",
    reset: "Reiniciar",
    step: "Paso",
    of: "de",
    complete: "Completar",
    nextStep: "Siguiente Paso",
    livePostureFeedback: "Retroalimentación de Postura en Vivo"
  },
  fr: {
    dashboard: 'Tableau de bord',
    profile: 'Profil',
    prescriptions: 'Ordonnances',
    exercises: 'Exercices',
    labTests: 'Tests de laboratoire',
    reminders: 'Rappels',
    hello: 'Bonjour',
    welcome: 'Bienvenue sur votre tableau de bord de santé !',
    medications: 'Médicaments',
    completed: 'Terminé',
    daysSinceVisit: 'Jours depuis la dernière visite',
    exerciseRoutines: 'Routines d\'Exercice',
    prescribedExercises: 'Voici vos exercices prescrits.',
    kneeFlexion: 'Flexion du Genou',
    easy: 'Facile',
    slowlyBendKnee: 'Pliez lentement le genou.',
    tenMin: '10 min',
    fifteenReps: '15 répétitions',
    positionComfortably: 'Positionnez-vous confortablement sur une chaise.',
    followMovements: 'Suivez les mouvements indiqués à l\'écran.',
    moveSlowly: 'Bougez lentement et délibérément.',
    listenToCoach: 'Écoutez le coach pour obtenir des conseils.',
    stopIfPain: 'Arrêtez si vous ressentez de la douleur.',
    quadricepsStrengthening: 'Renforcement des Quadriceps',
    medium: 'Moyen',
    tightenThighMuscles: 'Serrez les muscles de la cuisse.',
    fifteenMin: '15 min',
    tenReps: '10 répétitions',
    lieDown: 'Allongez-vous sur le dos.',
    tightenThigh: 'Serrez les muscles de la cuisse d\'une jambe.',
    holdFiveSeconds: 'Maintenez pendant cinq secondes.',
    relaxRepeat: 'Détendez-vous et répétez avec l\'autre jambe.',
    notStarted: 'Non Commencé',
    progress: 'Progrès',
    instructions: 'Instructions',
    start: 'Démarrer',

    // New posture detection translations
    postureDetection: "Détection de Posture",
    startCamera: "Démarrer Caméra",
    stopCamera: "Arrêter Caméra",
    cameraAccessError: "Erreur d'accès à la caméra. Vérifiez les permissions.",
    goodPosture: "Bonne posture ! Continuez comme ça.",
    adjustStraighter: "Essayez de garder le dos plus droit.",
    alignShoulders: "Alignez correctement vos épaules.",
    perfectForm: "Forme parfaite ! Excellent travail.",
    slightAdjustment: "Petit ajustement nécessaire vers la gauche.",
    clickToStartCamera: "Cliquez pour démarrer la caméra",
    loadingCamera: "Chargement de la caméra...",
    postureFeedback: "Retour sur la Posture",
    elapsedTime: "Temps Écoulé",
    pause: "Pause",
    reset: "Réinitialiser",
    step: "Étape",
    of: "de",
    complete: "Terminé",
    nextStep: "Étape Suivante",
    livePostureFeedback: "Retour de Posture en Direct"
  },
  de: {
    dashboard: 'Dashboard',
    profile: 'Profil',
    prescriptions: 'Rezepte',
    exercises: 'Übungen',
    labTests: 'Labortests',
    reminders: 'Erinnerungen',
    hello: 'Hallo',
    welcome: 'Willkommen in Ihrem Gesundheits-Dashboard!',
    medications: 'Medikamente',
    completed: 'Abgeschlossen',
    daysSinceVisit: 'Tage seit dem letzten Besuch',
    exerciseRoutines: 'Übungsroutinen',
    prescribedExercises: 'Hier sind Ihre verschriebenen Übungen.',
    kneeFlexion: 'Kniebeugung',
    easy: 'Leicht',
    slowlyBendKnee: 'Beugen Sie langsam Ihr Knie.',
    tenMin: '10 min',
    fifteenReps: '15 Wiederholungen',
    positionComfortably: 'Positionieren Sie sich bequem auf einem Stuhl.',
    followMovements: 'Folgen Sie den Bewegungen auf dem Bildschirm.',
    moveSlowly: 'Bewegen Sie sich langsam und bewusst.',
    listenToCoach: 'Hören Sie auf den Trainer für Anleitungen.',
    stopIfPain: 'Hören Sie auf, wenn Sie Schmerzen verspüren.',
    quadricepsStrengthening: 'Quadrizeps-Stärkung',
    medium: 'Mittel',
    tightenThighMuscles: 'Spannen Sie Ihre Oberschenkelmuskeln an.',
    fifteenMin: '15 min',
    tenReps: '10 Wiederholungen',
    lieDown: 'Legen Sie sich auf den Rücken.',
    tightenThigh: 'Spannen Sie die Oberschenkelmuskeln eines Beins an.',
    holdFiveSeconds: 'Halten Sie fünf Sekunden lang.',
    relaxRepeat: 'Entspannen Sie sich und wiederholen Sie den Vorgang mit dem anderen Bein.',
    notStarted: 'Nicht Gestartet',
    progress: 'Fortschritt',
    instructions: 'Anweisungen',
    start: 'Starten',

    // New posture detection translations
    postureDetection: "Haltungserkennung",
    startCamera: "Kamera Starten",
    stopCamera: "Kamera Stoppen",
    cameraAccessError: "Kamerazugriffsfehler. Bitte Berechtigungen prüfen.",
    goodPosture: "Gute Haltung! Weiter so.",
    adjustStraighter: "Versuchen Sie, den Rücken gerader zu halten.",
    alignShoulders: "Richten Sie Ihre Schultern richtig aus.",
    perfectForm: "Perfekte Form! Ausgezeichnete Arbeit.",
    slightAdjustment: "Kleine Anpassung nach links nötig.",
    clickToStartCamera: "Klicken Sie, um die Kamera zu starten",
    loadingCamera: "Kamera wird geladen...",
    postureFeedback: "Haltungs-Feedback",
    elapsedTime: "Verstrichene Zeit",
    pause: "Pause",
    reset: "Zurücksetzen",
    step: "Schritt",
    of: "von",
    complete: "Abschließen",
    nextStep: "Nächster Schritt",
    livePostureFeedback: "Live-Haltungs-Feedback"
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
    holdFiveSeconds: 'पांच सेकंड के लिएHold।',
    relaxRepeat: 'आराम करें और दूसरे पैर से दोहराएं।',
    notStarted: 'शुरू नहीं हुआ',
    progress: 'प्रगति',
    instructions: 'अनुदेश',
    start: 'शुरू',

    // New posture detection translations
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
    livePostureFeedback: "लाइव मुद्रा फीडबैक"
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
        fallbackLng: 'en',
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

  const speak = (text: string) => {
    if (!isSpeechSynthesisSupported) {
      console.warn('Speech synthesis is not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage.code;
    speechSynthesis.speak(utterance);
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
