
import Layout from "@/components/Layout";
import { Play, Volume2, Clock } from "lucide-react";

const Exercises = () => {
  const exercises = [
    {
      name: "Knee Flexion",
      difficulty: "easy",
      description: "Slowly bend and straighten your knee while sitting",
      duration: "10 min",
      reps: "15 reps",
      instructions: [
        "Position yourself comfortably",
        "Follow the movements shown in the camera preview",
        "Move slowly and controlled",
        "Listen to the AI coach feedback",
        "Stop if you feel pain"
      ],
      progress: "Not started",
      icon: "🦵"
    },
    {
      name: "Quadriceps Strengthening",
      difficulty: "medium",
      description: "Tighten thigh muscles and hold for 5 seconds",
      duration: "15 min",
      reps: "10 reps",
      instructions: [
        "Lie down comfortably",
        "Tighten your thigh muscles",
        "Hold for 5 seconds",
        "Relax and repeat"
      ],
      progress: "Not started",
      icon: "🦵"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 px-4 py-6">
        <h1 className="text-2xl font-bold text-white">Exercise Routines</h1>
        <p className="text-blue-100 mt-1">Prescribed exercises for recovery</p>
      </div>
      
      <div className="px-4 py-6 space-y-4">
        {exercises.map((exercise, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{exercise.icon}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{exercise.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{exercise.duration}</span>
                    </div>
                    <span className="text-xs text-gray-500">{exercise.reps}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 bg-blue-50 rounded-lg">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-blue-700 mb-2">Instructions:</p>
              <ol className="text-blue-900 text-sm space-y-1">
                {exercise.instructions.map((instruction, i) => (
                  <li key={i}>{i + 1}. {instruction}</li>
                ))}
              </ol>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-sm font-medium text-gray-900">{exercise.progress}</p>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-gray-300 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Exercises;
