
import { useLocation, Link } from "react-router-dom";
import { Home, User, FileText, Activity, FlaskConical, Bell } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/prescriptions", icon: FileText, label: "Prescriptions" },
    { path: "/exercises", icon: Activity, label: "Exercises" },
    { path: "/lab-tests", icon: FlaskConical, label: "Lab Tests" },
    { path: "/reminders", icon: Bell, label: "Reminders" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
