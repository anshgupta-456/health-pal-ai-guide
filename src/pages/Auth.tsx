
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [treatingPhysician, setTreatingPhysician] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { currentLanguage, translate } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const startListening = (fieldName: string) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = currentLanguage.code === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    setActiveField(fieldName);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      
      switch (fieldName) {
        case 'fullName':
          setFullName(transcript);
          break;
        case 'phone':
          setPhone(transcript);
          break;
        case 'address':
          setAddress(transcript);
          break;
        case 'emergencyContactName':
          setEmergencyContactName(transcript);
          break;
        case 'emergencyContactPhone':
          setEmergencyContactPhone(transcript);
          break;
        case 'medicalConditions':
          setMedicalConditions(transcript);
          break;
        case 'allergies':
          setAllergies(transcript);
          break;
        case 'currentMedications':
          setCurrentMedications(transcript);
          break;
        case 'treatingPhysician':
          setTreatingPhysician(transcript);
          break;
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError('Speech recognition failed. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveField(null);
    };

    recognition.start();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            preferred_language: currentLanguage.code
          }
        }
      });

      if (signUpError) throw signUpError;

      // Update profile with additional information
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            age: age ? parseInt(age) : null,
            gender,
            phone,
            address,
            emergency_contact_name: emergencyContactName,
            emergency_contact_phone: emergencyContactPhone,
            medical_conditions: medicalConditions ? medicalConditions.split(',').map(s => s.trim()) : [],
            allergies: allergies ? allergies.split(',').map(s => s.trim()) : [],
            current_medications: currentMedications ? currentMedications.split(',').map(s => s.trim()) : [],
            treating_physician: treatingPhysician,
            preferred_language: currentLanguage.code
          })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const SpeechButton = ({ fieldName }: { fieldName: string }) => (
    <button
      type="button"
      onClick={() => startListening(fieldName)}
      className={`p-2 rounded-lg transition-colors ${
        isListening && activeField === fieldName
          ? 'bg-red-100 text-red-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      disabled={isListening && activeField !== fieldName}
    >
      {isListening && activeField === fieldName ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? translate('signIn') : translate('signUp')}
          </h1>
          <p className="text-gray-600">
            {isLogin ? translate('signInDescription') : translate('signUpDescription')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translate('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('fullName')}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <SpeechButton fieldName="fullName" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('age')}
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('gender')}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{translate('selectGender')}</option>
                    <option value="male">{translate('male')}</option>
                    <option value="female">{translate('female')}</option>
                    <option value="other">{translate('other')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('phone')}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <SpeechButton fieldName="phone" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('address')}
                </label>
                <div className="flex space-x-2">
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                  <SpeechButton fieldName="address" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('emergencyContactName')}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <SpeechButton fieldName="emergencyContactName" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('emergencyContactPhone')}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <SpeechButton fieldName="emergencyContactPhone" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('medicalConditions')}
                </label>
                <div className="flex space-x-2">
                  <textarea
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder={translate('separateWithCommas')}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                  <SpeechButton fieldName="medicalConditions" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('allergies')}
                </label>
                <div className="flex space-x-2">
                  <textarea
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder={translate('separateWithCommas')}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                  <SpeechButton fieldName="allergies" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('currentMedications')}
                </label>
                <div className="flex space-x-2">
                  <textarea
                    value={currentMedications}
                    onChange={(e) => setCurrentMedications(e.target.value)}
                    placeholder={translate('separateWithCommas')}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                  <SpeechButton fieldName="currentMedications" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('treatingPhysician')}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={treatingPhysician}
                    onChange={(e) => setTreatingPhysician(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <SpeechButton fieldName="treatingPhysician" />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isLogin ? translate('signIn') : translate('signUp')
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isLogin ? translate('needAccount') : translate('haveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
