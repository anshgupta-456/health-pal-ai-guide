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

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (authData.user) {
          const profileData = {
            full_name: formData.fullName
          };

          const { error: profileError } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', authData.user.id);

          if (profileError) {
            console.error('Profile update error:', profileError);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ecf4fb] to-[#ecfbf3] px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl px-8 py-10 w-full max-w-md animate-fade-in border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{isSignIn ? translate("signIn") : translate("signUp")}</h1>
          <p className="text-gray-500 text-base">{isSignIn ? translate("signInDescription") : translate("signUpDescription")}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {!isSignIn && (
            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-800 mb-1">
                {translate("fullName")} *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormField('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm placeholder:text-gray-400"
                required
                placeholder={translate("fullName")}
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-800 mb-1">
              {translate("email")} *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormField('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm placeholder:text-gray-400"
              required
              placeholder={translate("email")}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-800 mb-1">
              {translate("password")} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateFormField('password', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-sm placeholder:text-gray-400"
                required
                minLength={6}
                placeholder={translate("password")}
                autoComplete={isSignIn ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-blue-700 focus:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-md mt-2"
          >
            {loading && (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            )}
            {isSignIn ? translate("signIn") : translate("signUp")}
          </button>
        </form>

        <div className="mt-12 border-t pt-8">
          <button
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
            className="block text-blue-600 hover:text-blue-700 font-semibold text-base mx-auto transition mt-0"
          >
            {isSignIn ? translate("needAccount") : translate("haveAccount")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
