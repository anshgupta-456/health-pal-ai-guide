
import Layout from "@/components/Layout";
import SpeakButton from "@/components/SpeakButton";
import ExercisePlayer from "@/components/ExercisePlayer";
import { Play, Volume2, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const Exercises = () => {
  const { translate } = useLanguage();
  const [selectedExercise, setSelectedExercise] = useState(null);

  const exercises = [
    {
      name: translate("kneeFlexion"),
      difficulty: translate("easy"),
      description: translate("slowlyBendKnee"),
      duration: translate("tenMin"),
      reps: translate("fifteenReps"),
      instructions: [
        translate("positionComfortably"),
        translate("followMovements"),
        translate("moveSlowly"),
        translate("listenToCoach"),
        translate("stopIfPain")
      ],
      progress: translate("notStarted"),
      icon: "🦵"
    },
    {
      name: translate("quadricepsStrengthening"),
      difficulty: translate("medium"),
      description: translate("tightenThighMuscles"),
      duration: translate("fifteenMin"),
      reps: translate("tenReps"),
      instructions: [
        translate("lieDown"),
        translate("tightenThigh"),
        translate("holdFiveSeconds"),
        translate("relaxRepeat")
      ],
      progress: translate("notStarted"),
      icon: "🦵"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === translate("easy")) return "bg-green-100 text-green-800";
    if (difficulty === translate("medium")) return "bg-yellow-100 text-yellow-800";
    if (difficulty === translate("hard")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const handleStartExercise = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleCloseExercise = () => {
    setSelectedExercise(null);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{translate("exerciseRoutines")}</h1>
            <p className="text-blue-100 mt-1">{translate("prescribedExercises")}</p>
          </div>
          <SpeakButton text={`${translate("exerciseRoutines")}. ${translate("prescribedExercises")}`} className="text-white" />
        </div>
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
                    <SpeakButton text={exercise.name} className="scale-75" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600">{exercise.description}</p>
                    <SpeakButton text={exercise.description} className="scale-75" />
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{exercise.duration}</span>
                    </div>
                    <span className="text-xs text-gray-500">{exercise.reps}</span>
                    <SpeakButton text={`${exercise.duration} ${exercise.reps}`} className="scale-75" />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 bg-blue-50 rounded-lg">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                </button>
                <button 
                  onClick={() => handleStartExercise(exercise)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-green-600 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>{translate("start")}</span>
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-700">{translate("instructions")}:</p>
                <SpeakButton text={`${translate("instructions")}: ${exercise.instructions.join(", ")}`} className="scale-75" />
              </div>
              <ol className="text-blue-900 text-sm space-y-1">
                {exercise.instructions.map((instruction, i) => (
                  <li key={i}>{i + 1}. {instruction}</li>
                ))}
              </ol>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">{translate("progress")}</p>
                  <SpeakButton text={`${translate("progress")}: ${exercise.progress}`} className="scale-75" />
                </div>
                <p className="text-sm font-medium text-gray-900">{exercise.progress}</p>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-gray-300 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedExercise && (
        <ExercisePlayer 
          exercise={selectedExercise} 
          onClose={handleCloseExercise}
        />
      )}
    </Layout>
  );
};

export default Exercises;
