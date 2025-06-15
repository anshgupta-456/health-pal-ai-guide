
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SpeakButton from "@/components/SpeakButton";

const WelcomeHeader = () => {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 px-4 py-8 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">
              {translate("welcome")}, {userName}!
            </h1>
            <SpeakButton 
              text={`${translate("welcome")}, ${userName}`} 
              className="text-white" 
            />
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-blue-100">{translate("dashboardDescription")}</p>
            <SpeakButton 
              text={translate("dashboardDescription")} 
              className="text-white scale-75" 
            />
          </div>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-3xl">👋</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
