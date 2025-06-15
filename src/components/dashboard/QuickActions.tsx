
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SpeakButton from "@/components/SpeakButton";
import { LogOut } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  treating_physician?: string;
}

const QuickActions = () => {
  const { translate } = useLanguage();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, emergency_contact_name, emergency_contact_phone, treating_physician')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const actions = [
    {
      title: translate("findNearbyLab"),
      icon: "📍",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: translate("bookAppointment"),
      icon: "📅",
      color: "bg-green-50 text-green-600",
    },
    {
      title: translate("reportSideEffect"),
      icon: "⚠️",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">{translate("quickActions")}</h3>
          <SpeakButton text={translate("quickActions")} />
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} p-4 rounded-xl text-left transition-transform active:scale-95`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{action.icon}</span>
              <span className="font-medium">{action.title}</span>
              <SpeakButton text={action.title} className="scale-75" />
            </div>
          </button>
        ))}
      </div>
      
      {/* Emergency Contacts */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">{translate("emergencyContacts")}</h3>
          <SpeakButton text={translate("emergencyContacts")} />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">📞</span>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-red-700">{translate("emergency108")}</p>
                  <SpeakButton text={translate("emergency108")} className="scale-75" />
                </div>
                <div className="flex items-center space-x-1">
                  <p className="text-xs text-red-600">{translate("medicalEmergency24x7")}</p>
                  <SpeakButton text={translate("medicalEmergency24x7")} className="scale-75" />
                </div>
              </div>
            </div>
          </button>
          
          <button className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">📞</span>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-blue-700">
                    {profile?.treating_physician || translate("drPriyaSharma")}
                  </p>
                  <SpeakButton text={profile?.treating_physician || translate("drPriyaSharma")} className="scale-75" />
                </div>
                <div className="flex items-center space-x-1">
                  <p className="text-xs text-blue-600">{translate("treatingPhysician")}</p>
                  <SpeakButton text={translate("treatingPhysician")} className="scale-75" />
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Personal Emergency Contact - if available */}
        {profile?.emergency_contact_name && (
          <div className="mt-2">
            <button className="w-full bg-green-50 border border-green-200 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">📞</span>
                <div className="text-left">
                  <div className="flex items-center space-x-1">
                    <p className="text-sm font-medium text-green-700">
                      {profile.emergency_contact_name}
                    </p>
                    <SpeakButton text={profile.emergency_contact_name} className="scale-75" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs text-green-600">
                      {profile.emergency_contact_phone || 'No phone number provided'}
                    </p>
                    <SpeakButton text={profile.emergency_contact_phone || 'No phone number provided'} className="scale-75" />
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActions;
