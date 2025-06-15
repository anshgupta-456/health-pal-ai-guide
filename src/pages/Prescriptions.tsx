
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SpeechToText from "@/components/SpeechToText";
import SpeakButton from "@/components/SpeakButton";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  side_effects?: string[];
  prescribed_by?: string;
  prescribed_date: string;
  is_active: boolean;
}

const Prescriptions = () => {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    frequency: 'daily',
    duration: '07:00',
    instructions: '',
    side_effects: '',
    prescribed_by: '',
  });

  const frequencyOptions = [
    { value: 'once_daily', label: 'Once Daily' },
    { value: 'twice_daily', label: 'Twice Daily' },
    { value: 'three_times_daily', label: 'Three Times Daily' },
    { value: 'four_times_daily', label: 'Four Times Daily' },
    { value: 'every_other_day', label: 'Every Other Day' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'as_needed', label: 'As Needed' },
  ];

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const prescriptionData = {
        user_id: user.id,
        medication_name: formData.medication_name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        instructions: formData.instructions || null,
        side_effects: formData.side_effects ? formData.side_effects.split(',').map(s => s.trim()).filter(Boolean) : [],
        prescribed_by: formData.prescribed_by || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('prescriptions')
          .update(prescriptionData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('prescriptions')
          .insert([prescriptionData]);
        if (error) throw error;
      }

      setFormData({
        medication_name: '',
        dosage: '',
        frequency: 'daily',
        duration: '07:00',
        instructions: '',
        side_effects: '',
        prescribed_by: '',
      });
      setShowAddForm(false);
      setEditingId(null);
      fetchPrescriptions();
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Error saving prescription. Please try again.');
    }
  };

  const handleEdit = (prescription: Prescription) => {
    setFormData({
      medication_name: prescription.medication_name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructions || '',
      side_effects: prescription.side_effects?.join(', ') || '',
      prescribed_by: prescription.prescribed_by || '',
    });
    setEditingId(prescription.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;

    try {
      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPrescriptions();
    } catch (error) {
      console.error('Error deleting prescription:', error);
      alert('Error deleting prescription. Please try again.');
    }
  };

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{translate("myPrescriptions")}</h1>
              <SpeakButton text={translate("myPrescriptions")} className="text-white scale-90 flex-shrink-0" />
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-green-100 text-sm sm:text-base">{translate("medicationsAndInstructions")}</p>
              <SpeakButton text={translate("medicationsAndInstructions")} className="text-white scale-75 flex-shrink-0" />
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-white/20 hover:bg-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white transition-all duration-200 flex items-center space-x-2 shadow-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transform hover:scale-105 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm font-medium">{translate("addPrescription")}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {showAddForm && (
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border mb-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? translate('editPrescription') : translate('addNewPrescription')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate("medicationName")} *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.medication_name}
                      onChange={(e) => updateFormField('medication_name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <SpeechToText onTranscript={(text) => updateFormField('medication_name', text)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate("dosage")} *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.dosage}
                      onChange={(e) => updateFormField('dosage', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 500mg, 1 tablet"
                      required
                    />
                    <SpeechToText onTranscript={(text) => updateFormField('dosage', text)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate("frequency")} *
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => updateFormField('frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {frequencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {translate("duration")} (Time) *
                  </label>
                  <input
                    type="time"
                    value={formData.duration}
                    onChange={(e) => updateFormField('duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate("prescribedBy")}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.prescribed_by}
                      onChange={(e) => updateFormField('prescribed_by', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Doctor's name"
                    />
                    <SpeechToText onTranscript={(text) => updateFormField('prescribed_by', text)} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate("instructions")}
                </label>
                <div className="flex space-x-2">
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => updateFormField('instructions', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Take with food, before meals, etc."
                  />
                  <SpeechToText onTranscript={(text) => updateFormField('instructions', text)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate("sideEffects")} ({translate("separateWithCommas")})
                </label>
                <div className="flex space-x-2">
                  <textarea
                    value={formData.side_effects}
                    onChange={(e) => updateFormField('side_effects', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Nausea, dizziness, headache"
                  />
                  <SpeechToText onTranscript={(text) => updateFormField('side_effects', text)} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingId ? translate('update') : translate('add')} {translate('prescription')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({
                      medication_name: '',
                      dosage: '',
                      frequency: 'daily',
                      duration: '07:00',
                      instructions: '',
                      side_effects: '',
                      prescribed_by: '',
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  {translate("cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Prescription cards */}
        <div className="space-y-4">
          {prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">{translate("noPrescriptionsFound")}</p>
            </div>
          ) : (
            prescriptions.map((prescription) => (
              <div key={prescription.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💊</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{prescription.medication_name}</h3>
                        <SpeakButton text={prescription.medication_name} className="scale-75 flex-shrink-0" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-600">{prescription.dosage}</p>
                        <SpeakButton text={prescription.dosage} className="scale-75 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(prescription)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      title={translate("edit")}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prescription.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      title={translate("delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-600">{translate("frequency")}</label>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{prescription.frequency.replace('_', ' ')}</p>
                      <SpeakButton text={prescription.frequency.replace('_', ' ')} className="scale-75" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {translate("duration")}
                    </label>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{prescription.duration}</p>
                      <SpeakButton text={prescription.duration} className="scale-75" />
                    </div>
                  </div>

                  {prescription.prescribed_by && (
                    <div>
                      <label className="text-sm text-gray-600">{translate("prescribedBy")}</label>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900">{prescription.prescribed_by}</p>
                        <SpeakButton text={prescription.prescribed_by} className="scale-75" />
                      </div>
                    </div>
                  )}
                </div>

                {prescription.instructions && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-600">{translate("instructions")}</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900">{prescription.instructions}</p>
                      <SpeakButton text={prescription.instructions} className="scale-75" />
                    </div>
                  </div>
                )}

                {prescription.side_effects && prescription.side_effects.length > 0 && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-600">{translate("possibleSideEffects")}</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {prescription.side_effects.map((effect, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                            {effect}
                          </span>
                          <SpeakButton text={effect} className="scale-75" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Prescriptions;
