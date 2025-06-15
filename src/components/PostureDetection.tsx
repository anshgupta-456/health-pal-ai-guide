
import React, { useRef, useEffect, useState } from 'react';
import { Camera, Square, Play, Pause, RotateCcw, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SpeakButton from './SpeakButton';
import { supabase } from '@/integrations/supabase/client';

interface PostureDetectionProps {
  exerciseName: string;
  onPostureUpdate?: (feedback: string) => void;
}

interface PostureResult {
  feedback: string;
  score: number;
  issues: string[];
  recommendations: string[];
}

const PostureDetection = ({ exerciseName, onPostureUpdate }: PostureDetectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [postureResult, setPostureResult] = useState<PostureResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisInterval, setAnalysisInterval] = useState<NodeJS.Timeout | null>(null);
  const { translate } = useLanguage();

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (analysisInterval) {
        clearInterval(analysisInterval);
      }
    };
  }, [stream, analysisInterval]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsRecording(true);
        
        // Start automatic analysis every 3 seconds
        const interval = setInterval(() => {
          if (!isAnalyzing) {
            analyzePosture();
          }
        }, 3000);
        setAnalysisInterval(interval);
        
        // Initial analysis after 2 seconds
        setTimeout(() => analyzePosture(), 2000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPostureResult({
        feedback: translate('cameraAccessError') || 'Camera access error',
        score: 0,
        issues: ['Camera access denied'],
        recommendations: ['Please check camera permissions']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
    setIsRecording(false);
    setPostureResult(null);
  };

  const analyzePosture = async () => {
    if (!videoRef.current || !canvasRef.current || !isRecording) return;

    try {
      setIsAnalyzing(true);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Capture current frame from video
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      console.log('Sending frame for posture analysis...', {
        exerciseName,
        imageSize: imageData.length
      });
      
      // Send frame to backend for analysis
      const { data, error } = await supabase.functions.invoke('posture-analysis', {
        body: {
          imageData,
          exerciseType: exerciseName
        }
      });

      if (error) {
        console.error('Posture analysis error:', error);
        setPostureResult({
          feedback: 'Analysis temporarily unavailable',
          score: 0,
          issues: ['Connection error'],
          recommendations: ['Please try again']
        });
      } else {
        console.log('Analysis result received:', data);
        setPostureResult(data);
        
        if (onPostureUpdate) {
          onPostureUpdate(data.feedback);
        }
      }
    } catch (error) {
      console.error('Error during posture analysis:', error);
      setPostureResult({
        feedback: 'Analysis error occurred',
        score: 0,
        issues: ['Processing error'],
        recommendations: ['Please try again']
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const captureFrame = () => {
    if (!isAnalyzing) {
      analyzePosture();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <AlertCircle className="w-4 h-4 text-yellow-600" />;
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 80) return 'bg-blue-100 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
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
              className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium flex items-center space-x-2 disabled:opacity-50 hover:bg-green-600 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>{translate('startCamera')}</span>
            </button>
          ) : (
            <>
              <button
                onClick={captureFrame}
                disabled={isAnalyzing}
                className="p-2 bg-blue-50 rounded-lg disabled:opacity-50 hover:bg-blue-100 transition-colors"
                title="Analyze Current Frame"
              >
                <Square className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={stopCamera}
                className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-red-600 transition-colors"
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
          className="hidden"
        />
        
        {/* Analysis indicator */}
        {isAnalyzing && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <RotateCcw className="w-3 h-3 animate-spin" />
            <span>Analyzing...</span>
          </div>
        )}
        
        {/* Recording indicator */}
        {isRecording && !isAnalyzing && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        )}
        
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

      {/* Real-time analysis results */}
      {postureResult && (
        <div className="mt-4 space-y-3">
          {/* Main feedback with score */}
          <div className={`p-3 rounded-lg border-2 ${getScoreBadgeColor(postureResult.score)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-700">{translate('postureFeedback')}:</p>
                {getScoreIcon(postureResult.score)}
                <span className={`text-sm font-bold ${getScoreColor(postureResult.score)}`}>
                  {postureResult.score}/100
                </span>
                <SpeakButton text={postureResult.feedback} className="scale-75" />
              </div>
            </div>
            <p className="text-gray-800 text-sm break-words font-medium">{postureResult.feedback}</p>
          </div>

          {/* Issues detected */}
          {postureResult.issues.length > 0 && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>Issues Detected:</span>
              </h4>
              <ul className="text-yellow-900 text-xs space-y-1">
                {postureResult.issues.map((issue, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-yellow-600">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {postureResult.recommendations.length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Recommendations:</span>
              </h4>
              <ul className="text-green-900 text-xs space-y-1">
                {postureResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-green-600">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostureDetection;
