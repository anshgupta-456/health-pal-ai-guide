
const QuickActions = () => {
  const actions = [
    {
      title: "Find nearby lab",
      icon: "📍",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Book appointment",
      icon: "📅",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Report side effect",
      icon: "⚠️",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} p-4 rounded-xl text-left transition-transform active:scale-95`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{action.icon}</span>
              <span className="font-medium">{action.title}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Emergency Contacts */}
      <div className="mt-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">📞</span>
              <div className="text-left">
                <p className="text-sm font-medium text-red-700">Emergency: 108</p>
                <p className="text-xs text-red-600">24/7 Medical Emergency</p>
              </div>
            </div>
          </button>
          
          <button className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">📞</span>
              <div className="text-left">
                <p className="text-sm font-medium text-blue-700">Dr. Priya Sharma</p>
                <p className="text-xs text-blue-600">Your treating physician</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
