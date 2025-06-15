
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SpeechToText from '@/components/SpeechToText';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Extend the Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const Auth = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalConditions: '',
    allergies: '',
    currentMedications: '',
    treatingPhysician: '',
    preferredLanguage: 'en'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              preferred_language: formData.preferredLanguage,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Insert additional profile data
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              age: formData.age ? parseInt(formData.age) : null,
              gender: formData.gender || null,
              phone: formData.phone || null,
              address: formData.address || null,
              emergency_contact_name: formData.emergencyContactName || null,
              emergency_contact_phone: formData.emergencyContactPhone || null,
              medical_conditions: formData.medicalConditions.split(',').map(s => s.trim()).filter(Boolean),
              allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
              current_medications: formData.currentMedications.split(',').map(s => s.trim()).filter(Boolean),
              treating_physician: formData.treatingPhysician || null,
            })
            .eq('id', data.user.id);

          if (profileError) {
            console.error('Profile update error:', profileError);
          }
        }

        navigate('/');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignIn ? translate("signIn") : translate("signUp")}
          </h1>
          <p className="text-gray-600">
            {isSignIn ? translate("signInDescription") : translate("signUpDescription")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isSignIn && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{translate("basicInformation")}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate("fullName")} *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateFormField('fullName', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <SpeechToText
                        onTranscript={(text) => updateFormField('fullName', text)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate("age")}
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateFormField('age', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate("gender")}
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => updateFormField('gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">{translate("selectGender")}</option>
                        <option value="male">{translate("male")}</option>
                        <option value="female">Female</option>
                        <option value="other">{translate("other")}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormField('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="flex space-x-2">
                      <textarea
                        value={formData.address}
                        onChange={(e) => updateFormField('address', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                      <SpeechToText
                        onTranscript={(text) => updateFormField('address', text)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate("emergencyContactName")}
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={formData.emergencyContactName}
                          onChange={(e) => updateFormField('emergencyContactName', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <SpeechToText
                          onTranscript={(text) => updateFormField('emergencyContactName', text)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {translate("emergencyContactPhone")}
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => updateFormField('emergencyContactPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{translate("medicalInformation")}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical Conditions ({translate("separateWithCommas")})
                    </label>
                    <div className="flex space-x-2">
                      <textarea
                        value={formData.medicalConditions}
                        onChange={(e) => updateFormField('medicalConditions', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Diabetes, Hypertension, etc."
                      />
                      <SpeechToText
                        onTranscript={(text) => updateFormField('medicalConditions', text)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies ({translate("separateWithCommas")})
                    </label>
                    <div className="flex space-x-2">
                      <textarea
                        value={formData.allergies}
                        onChange={(e) => updateFormField('allergies', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Penicillin, Peanuts, etc."
                      />
                      <SpeechToText
                        onTranscript={(text) => updateFormField('allergies', text)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Medications ({translate("separateWithCommas")})
                    </label>
                    <div className="flex space-x-2">
                      <textarea
                        value={formData.currentMedications}
                        onChange={(e) => updateFormField('currentMedications', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Metformin, Lisinopril, etc."
                      />
                      <SpeechToText
                        onTranscript={(text) => updateFormField('currentMedications', text)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate("treatingPhysician")}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.treatingPhysician}
                        onChange={(e) => updateFormField('treatingPhysician', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dr. Smith"
                      />
                      <SpeechToText
                        onTranscript={(text) => updateFormField('treatingPhysician', text)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate("email")} *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormField('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate("password")} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateFormField('password', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isSignIn ? translate("signIn") : translate("signUp")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isSignIn ? translate("needAccount") : translate("haveAccount")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
