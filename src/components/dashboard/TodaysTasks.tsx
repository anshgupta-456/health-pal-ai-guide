
import { Clock } from "lucide-react";

const TodaysTasks = () => {
  const tasks = [
    {
      id: 1,
      type: "medication",
      icon: "💊",
      title: "Take Medication",
      subtitle: "Paracetamol 500mg",
      time: "9:00 AM",
      completed: false,
    },
    {
      id: 2,
      type: "exercise",
      icon: "🏃‍♂️",
      title: "Do Exercises",
      subtitle: "Knee flexion routine",
      time: "10:30 AM",
      completed: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{task.icon}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.subtitle}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{task.time}</span>
                    <span className="text-xs text-red-500 font-medium">Overdue</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">
                Start
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Today's progress</span>
                <span>Missed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-red-500 h-1 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysTasks;
