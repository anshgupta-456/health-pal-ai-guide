
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SpeechToText from "@/components/SpeechToText";
import SpeakButton from "@/components/SpeakButton";
import { CheckCircle, Edit, Trash2, Clock, AlertTriangle, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminder_type: string;
  reminder_time?: string;
  reminder_date?: string;
  frequency: string;
  is_active: boolean;
  is_completed: boolean;
}

const Reminders = () => {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminder_type: 'medication',
    reminder_time: '',
    reminder_date: '',
    frequency: 'daily'
  });

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const reminderData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        reminder_type: formData.reminder_type,
        reminder_time: formData.reminder_time || null,
        reminder_date: formData.reminder_date || null,
        frequency: formData.frequency,
      };

      if (editingId) {
        const { error } = await supabase
          .from('reminders')
          .update(reminderData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reminders')
          .insert([reminderData]);
        if (error) throw error;
      }

      setFormData({
        title: '',
        description: '',
        reminder_type: 'medication',
        reminder_time: '',
        reminder_date: '',
        frequency: 'daily'
      });
      setShowAddForm(false);
      setEditingId(null);
      fetchReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Error saving reminder. Please try again.');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ is_completed: true })
        .eq('id', id);

      if (error) throw error;
      fetchReminders();
    } catch (error) {
      console.error('Error completing reminder:', error);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      reminder_type: reminder.reminder_type,
      reminder_time: reminder.reminder_time || '',
      reminder_date: reminder.reminder_date || '',
      frequency: reminder.frequency
    });
    setEditingId(reminder.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return '💊';
      case 'appointment': return '👨‍⚕️';
      case 'exercise': return '🏃‍♂️';
      case 'test': return '🧪';
      default: return '📋';
    }
  };

  const getStatusColor = (reminder: Reminder) => {
    if (reminder.is_completed) return "border-gray-200 bg-gray-50";
    if (!reminder.is_active) return "border-gray-200 bg-gray-50";
    return "border-blue-200 bg-blue-50";
  };

  const stats = [
    { 
      label: translate("active"), 
      value: reminders.filter(r => r.is_active && !r.is_completed).length.toString(), 
      color: "text-green-600", 
      icon: CheckCircle 
    },
    { 
      label: translate("today"), 
      value: reminders.filter(r => {
        if (!r.reminder_date) return false;
        const today = new Date().toISOString().split('T')[0];
        return r.reminder_date === today && r.is_active && !r.is_completed;
      }).length.toString(), 
      color: "text-blue-600", 
      icon: Clock 
    },
    { 
      label: translate("completed"), 
      value: reminders.filter(r => r.is_completed).length.toString(), 
      color: "text-gray-600", 
      icon: CheckCircle 
    },
    { 
      label: translate("medications"), 
      value: reminders.filter(r => r.reminder_type === 'medication' && r.is_active).length.toString(), 
      color: "text-orange-600", 
      icon: null, 
      emoji: "💊" 
    },
  ];

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
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{translate("reminders")}</h1>
            <p className="text-orange-100 mt-1">{translate("stayOnTrack")}</p>
          </div>
          <div className="flex space-x-2">
            <SpeakButton text={`${translate("reminders")}. ${translate("stayOnTrack")}`} className="text-white" />
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-white/20 p-2 rounded-lg text-white hover:bg-white/30"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-3">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-3 text-center shadow-sm border">
                {IconComponent ? (
                  <IconComponent className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                ) : (
                  <span className="text-lg block mb-1">{stat.emoji}</span>
                )}
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center justify-center space-x-1">
                  <p className="text-xs text-gray-600">{stat.label}</p>
                  <SpeakButton text={`${stat.value} ${stat.label}`} className="scale-75" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4">
        {showAddForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Reminder' : 'Add New Reminder'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormField('title', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <SpeechToText onTranscript={(text) => updateFormField('title', text)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="flex space-x-2">
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormField('description', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <SpeechToText onTranscript={(text) => updateFormField('description', text)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.reminder_type}
                    onChange={(e) => updateFormField('reminder_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="medication">Medication</option>
                    <option value="appointment">Appointment</option>
                    <option value="exercise">Exercise</option>
                    <option value="test">Test</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => updateFormField('frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.reminder_date}
                    onChange={(e) => updateFormField('reminder_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.reminder_time}
                    onChange={(e) => updateFormField('reminder_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Update' : 'Add'} Reminder
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({
                      title: '',
                      description: '',
                      reminder_type: 'medication',
                      reminder_time: '',
                      reminder_date: '',
                      frequency: 'daily'
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No reminders found. Add your first reminder!</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className={`rounded-xl p-4 shadow-sm border ${getStatusColor(reminder)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-lg">{getTypeIcon(reminder.reminder_type)}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                        <SpeakButton text={reminder.title} className="scale-75" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-600`}>
                          {reminder.reminder_type}
                        </span>
                      </div>
                      {reminder.description && (
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-600">{reminder.description}</p>
                          <SpeakButton text={reminder.description} className="scale-75" />
                        </div>
                      )}
                      {(reminder.reminder_time || reminder.reminder_date) && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {reminder.reminder_date && <span className="text-xs text-gray-500">{reminder.reminder_date}</span>}
                          {reminder.reminder_time && <span className="text-xs text-gray-500">{reminder.reminder_time}</span>}
                          <span className="text-xs text-gray-500">{reminder.frequency}</span>
                          <span className={`text-xs font-medium ${reminder.is_completed ? 'text-gray-600' : 'text-green-600'}`}>
                            {reminder.is_completed ? 'Completed' : 'Active'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!reminder.is_completed && (
                      <button 
                        onClick={() => handleComplete(reminder.id)}
                        className="p-2 bg-white rounded-lg shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleEdit(reminder)}
                      className="p-2 bg-white rounded-lg shadow-sm"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button 
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 bg-white rounded-lg shadow-sm"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reminders;
