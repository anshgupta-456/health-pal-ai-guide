
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
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
        // Sign up the user first
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (authError) throw authError;

        // Wait a bit for the user to be created and trigger to run
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (authData.user) {
          // Update the profile with basic data
          const profileData = {
            full_name: formData.fullName
          };

          const { error: profileError } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', authData.user.id);

          if (profileError) {
            console.error('Profile update error:', profileError);
            // Don't throw here, just log the error
          }
        }

        alert('Account created successfully! Please check your email to verify your account.');
        setIsSignIn(true); // Switch to sign in mode
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-8">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignIn ? translate("signIn") : translate("signUp")}
          </h1>
          <p className="text-gray-600">
            {isSignIn ? translate("signInDescription") : translate("signUpDescription")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {!isSignIn && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {translate("fullName")} *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormField('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
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
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
          >
            {loading && (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            )}
            {isSignIn ? translate("signIn") : translate("signUp")}
          </button>
        </form>

        <div className="pt-6 text-center border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {isSignIn ? translate("needAccount") : translate("haveAccount")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

