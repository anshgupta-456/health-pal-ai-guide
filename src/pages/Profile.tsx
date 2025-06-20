import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import SpeechToText from "@/components/SpeechToText";
import { Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_conditions?: string[];
  allergies?: string[];
  current_medications?: string[];
  treating_physician?: string;
  preferred_language?: string;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { translate } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    if (!authLoading && user) {
      console.log('Current user:', user);
      fetchOrCreateProfile();
    } else if (!authLoading && !user) {
      console.log('No authenticated user found');
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchOrCreateProfile = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching profile for user ID:', user.id);
      
      // First try to fetch existing profile
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      console.log('Profile fetch result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (!data) {
        console.log('No profile found, creating new one');
        // Profile doesn't exist, create one with user metadata if available
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          age: user.user_metadata?.age ? parseInt(user.user_metadata.age) : null,
          gender: user.user_metadata?.gender || null,
          phone: user.user_metadata?.phone || null,
          address: user.user_metadata?.address || null,
          emergency_contact_name: user.user_metadata?.emergencyContactName || null,
          emergency_contact_phone: user.user_metadata?.emergencyContactPhone || null,
          medical_conditions: user.user_metadata?.medicalConditions ? 
            (Array.isArray(user.user_metadata.medicalConditions) ? 
              user.user_metadata.medicalConditions : 
              user.user_metadata.medicalConditions.split(',').map((s: string) => s.trim()).filter(Boolean)
            ) : null,
          allergies: user.user_metadata?.allergies ? 
            (Array.isArray(user.user_metadata.allergies) ? 
              user.user_metadata.allergies : 
              user.user_metadata.allergies.split(',').map((s: string) => s.trim()).filter(Boolean)
            ) : null,
          current_medications: user.user_metadata?.currentMedications ? 
            (Array.isArray(user.user_metadata.currentMedications) ? 
              user.user_metadata.currentMedications : 
              user.user_metadata.currentMedications.split(',').map((s: string) => s.trim()).filter(Boolean)
            ) : null,
          treating_physician: user.user_metadata?.treatingPhysician || null,
          preferred_language: user.user_metadata?.preferredLanguage || 'en'
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }
        
        console.log('Profile created:', createdProfile);
        data = createdProfile;
      }

      setProfile(data);
      setFormData(data);
      console.log('Profile set:', data);
    } catch (error) {
      console.error('Error in fetchOrCreateProfile:', error);
      // Set a default profile for display purposes
      const defaultProfile = {
        id: user?.id || '',
        full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
        preferred_language: 'en'
      };
      setProfile(defaultProfile as Profile);
      setFormData(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      console.error('No user ID available for save');
      return;
    }

    try {
      console.log('Saving profile data:', formData);
      
      const updateData = {
        id: user.id,
        full_name: formData.full_name || profile?.full_name || 'User',
        age: formData.age || null,
        gender: formData.gender || null,
        phone: formData.phone || null,
        address: formData.address || null,
        emergency_contact_name: formData.emergency_contact_name || null,
        emergency_contact_phone: formData.emergency_contact_phone || null,
        medical_conditions: formData.medical_conditions || null,
        allergies: formData.allergies || null,
        current_medications: formData.current_medications || null,
        treating_physician: formData.treating_physician || null,
        preferred_language: formData.preferred_language || 'en',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(updateData)
        .select()
        .single();

      if (error) {
        console.error('Error saving profile:', error);
        throw error;
      }
      
      console.log('Profile saved successfully:', data);
      setProfile(data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSpeechInput = (field: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: text
    }));
  };

  // Show loading while auth is loading or profile is loading
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  // Show message if no user is authenticated
  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-gray-600">Please log in to view your profile.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">👤</span>
              </div>
              <div className="text-white flex-1">
                <h1 className="text-xl font-bold">{profile?.full_name || 'User'}</h1>
                <div className="flex flex-wrap items-center space-x-2 md:space-x-4 mt-1">
                  {profile?.age && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {translate('age')}: {profile.age}
                    </span>
                  )}
                  {profile?.gender && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {translate(profile.gender)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-4 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900">{translate('basicInformation')}</h2>
              {editing && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData(profile || {});
                    }}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">{translate('fullName')}</label>
                {editing ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.full_name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="flex-1 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <SpeechToText
                      onTranscript={(text) => handleSpeechInput('full_name', text)}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <p className="font-medium text-gray-900 mt-1">{profile?.full_name || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">{translate('age')}</label>
                {editing ? (
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 mt-1">{profile?.age || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">{translate('phone')}</label>
                {editing ? (
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="flex-1 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <SpeechToText
                      onTranscript={(text) => handleSpeechInput('phone', text)}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <p className="font-medium text-gray-900 mt-1">{profile?.phone || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">{translate('gender')}</label>
                {editing ? (
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{translate('selectGender')}</option>
                    <option value="male">{translate('male')}</option>
                    <option value="female">{translate('female')}</option>
                    <option value="other">{translate('other')}</option>
                  </select>
                ) : (
                  <p className="font-medium text-gray-900 mt-1">{profile?.gender ? translate(profile.gender) : 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-600">{translate('address')}</label>
              {editing ? (
                <div className="flex space-x-2">
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="flex-1 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <SpeechToText
                    onTranscript={(text) => handleSpeechInput('address', text)}
                    className="mt-1"
                  />
                </div>
              ) : (
                <p className="font-medium text-gray-900 mt-1">{profile?.address || 'Not set'}</p>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{translate('emergencyContact')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">{translate('emergencyContactName')}</label>
                {editing ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.emergency_contact_name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                      className="flex-1 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <SpeechToText
                      onTranscript={(text) => handleSpeechInput('emergency_contact_name', text)}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <p className="font-medium text-gray-900 mt-1">{profile?.emergency_contact_name || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">{translate('emergencyContactPhone')}</label>
                {editing ? (
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      value={formData.emergency_contact_phone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                      className="flex-1 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <SpeechToText
                      onTranscript={(text) => handleSpeechInput('emergency_contact_phone', text)}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <p className="font-medium text-gray-900 mt-1">{profile?.emergency_contact_phone || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{translate('medicalInformation')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">{translate('treatingPhysician')}</label>
                {editing ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.treating_physician || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, treating_physician: e.target.value }))}
                      className="flex-1 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <SpeechToText
                      onTranscript={(text) => handleSpeechInput('treating_physician', text)}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <p className="font-medium text-gray-900 mt-1">{profile?.treating_physician || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">{translate('medicalConditions')}</label>
                {editing ? (
                  <div className="flex space-x-2">
                    <textarea
                      value={formData.medical_conditions?.join(', ') || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        medical_conditions: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }))}
                      className="flex-1 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder={translate('separateWithCommas')}
                    />
                    <SpeechToText
                      onTranscript={(text) => setFormData(prev => ({ 
                        ...prev, 
                        medical_conditions: text.split(',').map(s => s.trim()).filter(s => s)
                      }))}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <div className="mt-1">
                    {profile?.medical_conditions?.length ? (
                      profile.medical_conditions.map((condition, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2 mb-1">
                          {condition}
                        </span>
                      ))
                    ) : (
                      <p className="font-medium text-gray-900">Not set</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">{translate('allergies')}</label>
                {editing ? (
                  <div className="flex space-x-2">
                    <textarea
                      value={formData.allergies?.join(', ') || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        allergies: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }))}
                      className="flex-1 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder={translate('separateWithCommas')}
                    />
                    <SpeechToText
                      onTranscript={(text) => setFormData(prev => ({ 
                        ...prev, 
                        allergies: text.split(',').map(s => s.trim()).filter(s => s)
                      }))}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <div className="mt-1">
                    {profile?.allergies?.length ? (
                      profile.allergies.map((allergy, index) => (
                        <span key={index} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm mr-2 mb-1">
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <p className="font-medium text-gray-900">Not set</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">{translate('currentMedications')}</label>
                {editing ? (
                  <div className="flex space-x-2">
                    <textarea
                      value={formData.current_medications?.join(', ') || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        current_medications: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }))}
                      className="flex-1 mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder={translate('separateWithCommas')}
                    />
                    <SpeechToText
                      onTranscript={(text) => setFormData(prev => ({ 
                        ...prev, 
                        current_medications: text.split(',').map(s => s.trim()).filter(s => s)
                      }))}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <div className="mt-1">
                    {profile?.current_medications?.length ? (
                      profile.current_medications.map((medication, index) => (
                        <span key={index} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm mr-2 mb-1">
                          {medication}
                        </span>
                      ))
                    ) : (
                      <p className="font-medium text-gray-900">Not set</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Button at the bottom of the Profile page */}
        <div className="px-4">
          <SignOutButton />
        </div>
      </div>
    </Layout>
  );
};

// Helper: SignOut button component for Profile
function SignOutButton() {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="mt-8 flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-100 transition-colors"
      style={{ width: "100%" }}
    >
      <LogOut size={18} />
      <span>Sign Out</span>
    </button>
  );
}

export default Profile;
