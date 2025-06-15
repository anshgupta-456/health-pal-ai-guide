
import React, { useRef, useEffect, useState } from 'react';
import { Camera, Square, Play, Pause, RotateCcw, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SpeakButton from './SpeakButton';

interface PostureDetectionProps {
  exerciseName: string;
  onPostureUpdate?: (feedback: string) => void;
}

const PostureDetection = ({ exerciseName, onPostureUpdate }: PostureDetectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { translate } = useLanguage();

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsRecording(true);
        
        // Start posture analysis
        analyzePosture();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setFeedback(translate('cameraAccessError') || 'Camera access error');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsRecording(false);
    setFeedback('');
  };

  const analyzePosture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyze = () => {
      if (!isRecording || !videoRef.current) return;

      // Draw current video frame to canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Simulate posture analysis (in real implementation, this would call the GitHub repo backend)
      const mockAnalysis = getMockPostureAnalysis(exerciseName);
      setFeedback(mockAnalysis);
      
      if (onPostureUpdate) {
        onPostureUpdate(mockAnalysis);
      }

      // Continue analysis
      setTimeout(analyze, 2000);
    };

    analyze();
  };

  const getMockPostureAnalysis = (exercise: string): string => {
    const feedbacks = [
      translate('goodPosture') || 'Good posture! Keep it up.',
      translate('adjustStraighter') || 'Try to keep your back straighter.',
      translate('alignShoulders') || 'Align your shoulders properly.',
      translate('perfectForm') || 'Perfect form! Excellent work.',
      translate('slightAdjustment') || 'Small adjustment needed to the left.'
    ];
    
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // In a real implementation, this would send the frame to the posture-pal backend
    console.log('Frame captured for analysis');
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{translate('postureDetection')}</h3>
          <SpeakButton text={translate('postureDetection')} className="scale-75" />
        </div>
        
        <div className="flex space-x-2">
          {!isRecording ? (
            <button
              onClick={startCamera}
              disabled={isLoading}
              className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{translate('startCamera')}</span>
            </button>
          ) : (
            <>
              <button
                onClick={captureFrame}
                className="p-2 bg-blue-50 rounded-lg"
              >
                <Square className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={stopCamera}
                className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center space-x-2"
              >
                <Pause className="w-4 h-4" />
                <span>{translate('stopCamera')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-48 sm:h-64 bg-gray-100 rounded-lg object-cover"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="hidden"
        />
        
        {!stream && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center p-4">
              <Camera className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm sm:text-base">{translate('clickToStartCamera')}</p>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <RotateCcw className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600 mx-auto mb-2 animate-spin" />
              <p className="text-gray-600 text-sm sm:text-base">{translate('loadingCamera')}</p>
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-blue-700">{translate('postureFeedback')}:</p>
            <SpeakButton text={feedback} className="scale-75" />
          </div>
          <p className="text-blue-900 text-sm mt-1 break-words">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default PostureDetection;
