
import Layout from "@/components/Layout";
import { CheckCircle, Edit, Trash2, Clock, AlertTriangle } from "lucide-react";

const Reminders = () => {
  const stats = [
    { label: "Active", value: "3", color: "text-green-600", icon: CheckCircle },
    { label: "Today", value: "2", color: "text-blue-600", icon: Clock },
    { label: "Overdue", value: "3", color: "text-red-600", icon: AlertTriangle },
    { label: "Medications", value: "1", color: "text-orange-600", icon: null, emoji: "💊" },
  ];

  const reminders = [
    {
      type: "medication",
      title: "Take Medication",
      subtitle: "500mg after breakfast",
      time: "09:00",
      frequency: "Daily",
      status: "overdue",
      icon: "💊"
    },
    {
      type: "exercise",
      title: "Do Exercises",
      subtitle: "Flexion and strengthening routine",
      time: "10:30",
      frequency: "Daily",
      status: "overdue",
      icon: "🏃‍♂️"
    },
    {
      type: "appointment",
      title: "Doctor Appointment",
      subtitle: "Follow-up with Dr. Priya Sharma",
      time: "",
      frequency: "Appointment",
      status: "active",
      icon: "👨‍⚕️"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue": return "border-red-200 bg-red-50";
      case "active": return "border-green-200 bg-green-50";
      case "completed": return "border-gray-200 bg-gray-50";
      default: return "border-gray-200 bg-white";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "overdue": return "Overdue";
      case "active": return "Active";
      case "completed": return "Completed";
      default: return "Pending";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "overdue": return "text-red-600";
      case "active": return "text-green-600";
      case "completed": return "text-gray-600";
      default: return "text-blue-600";
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 px-4 py-6">
        <h1 className="text-2xl font-bold text-white">Reminders</h1>
        <p className="text-orange-100 mt-1">Stay on track with your care plan</p>
      </div>
      
      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-3">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-3 text-center shadow-sm border">
                {IconComponent ? (
                  <IconComponent className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                ) : (
                  <span className="text-lg block mb-1">{stat.emoji}</span>
                )}
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Reminders List */}
      <div className="px-4 space-y-4">
        {reminders.map((reminder, index) => (
          <div key={index} className={`rounded-xl p-4 shadow-sm border ${getStatusColor(reminder.status)}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-lg">{reminder.icon}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white ${getStatusTextColor(reminder.status)}`}>
                      {reminder.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{reminder.subtitle}</p>
                  {reminder.time && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{reminder.time}</span>
                      <span className="text-xs text-gray-500">{reminder.frequency}</span>
                      <span className={`text-xs font-medium ${getStatusTextColor(reminder.status)}`}>
                        {getStatusText(reminder.status)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </button>
                <button className="p-2 bg-white rounded-lg shadow-sm">
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button className="p-2 bg-white rounded-lg shadow-sm">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            
            {/* Progress bar for overdue items */}
            {reminder.status === "overdue" && (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Today's progress</span>
                  <span>Missed</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-1">
                  <div className="bg-red-500 h-1 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Reminders;
