
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SpeakButton from './SpeakButton';
import PostureDetection from './PostureDetection';

interface Exercise {
  name: string;
  difficulty: string;
  description: string;
  duration: string;
  reps: string;
  instructions: string[];
  progress: string;
  icon: string;
}

interface ExercisePlayerProps {
  exercise: Exercise;
  onClose: () => void;
}

const ExercisePlayer = ({ exercise, onClose }: ExercisePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [postureFeedback, setPostureFeedback] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const { translate } = useLanguage();

  useEffect(() => {
    setCompletedSteps(new Array(exercise.instructions.length).fill(false));
  }, [exercise.instructions.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimer(0);
    setCurrentStep(0);
    setCompletedSteps(new Array(exercise.instructions.length).fill(false));
  };

  const handleNextStep = () => {
    if (currentStep < exercise.instructions.length - 1) {
      const newCompleted = [...completedSteps];
      newCompleted[currentStep] = true;
      setCompletedSteps(newCompleted);
      setCurrentStep(currentStep + 1);
    } else {
      // Exercise completed
      const newCompleted = [...completedSteps];
      newCompleted[currentStep] = true;
      setCompletedSteps(newCompleted);
      setIsPlaying(false);
    }
  };

  const handlePostureUpdate = (feedback: string) => {
    setPostureFeedback(feedback);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPostureFeedbackIcon = () => {
    if (postureFeedback.toLowerCase().includes('good') || postureFeedback.toLowerCase().includes('perfect')) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-4xl my-4 sm:my-8">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <span className="text-xl sm:text-2xl flex-shrink-0">{exercise.icon}</span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{exercise.name}</h2>
                <p className="text-sm sm:text-base text-gray-600 break-words">{exercise.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Timer and Controls */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{formatTime(timer)}</div>
                <p className="text-sm text-gray-600">{translate('elapsedTime')}</p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handlePlayPause}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 text-sm sm:text-base ${
                    isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? translate('pause') : translate('start')}</span>
                </button>
                
                <button
                  onClick={handleReset}
                  className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-600 text-sm sm:text-base"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">{translate('reset')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Step */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
              <h3 className="font-semibold text-blue-700 text-sm sm:text-base">
                {translate('step')} {currentStep + 1} {translate('of')} {exercise.instructions.length}
              </h3>
              <SpeakButton text={exercise.instructions[currentStep]} className="scale-75" />
            </div>
            <p className="text-blue-900 mb-3 text-sm sm:text-base break-words">{exercise.instructions[currentStep]}</p>
            
            {isPlaying && (
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {currentStep === exercise.instructions.length - 1 ? translate('complete') : translate('nextStep')}
              </button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">{translate('progress')}</h4>
            <div className="space-y-2">
              {exercise.instructions.map((instruction, index) => (
                <div key={index} className={`flex items-start space-x-3 p-2 rounded-lg ${
                  index === currentStep ? 'bg-blue-50' : completedSteps[index] ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    completedSteps[index] ? 'bg-green-500 text-white' : 
                    index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {completedSteps[index] ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm break-words ${
                    completedSteps[index] ? 'text-green-700 line-through' : 
                    index === currentStep ? 'text-blue-700 font-medium' : 'text-gray-600'
                  }`}>
                    {instruction}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Posture Detection Integration */}
          <PostureDetection 
            exerciseName={exercise.name} 
            onPostureUpdate={handlePostureUpdate}
          />

          {/* Real-time Posture Feedback */}
          {postureFeedback && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                {getPostureFeedbackIcon()}
                <p className="text-sm font-medium text-yellow-800">{translate('livePostureFeedback')}:</p>
                <SpeakButton text={postureFeedback} className="scale-75" />
              </div>
              <p className="text-yellow-900 text-sm mt-1 break-words">{postureFeedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExercisePlayer;
