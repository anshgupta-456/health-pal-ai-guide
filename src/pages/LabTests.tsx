
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import SpeechToText from "@/components/SpeechToText";
import { Clock, Calendar, CheckCircle, Download, Upload, Loader2, Plus, X } from "lucide-react";

interface LabTest {
  id: string;
  test_name: string;
  test_date?: string;
  lab_name?: string;
  report_file_url?: string;
  analysis_result?: any;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

const LabTests = () => {
  const { user } = useAuth();
  const { translate } = useLanguage();
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    test_name: '',
    test_date: '',
    lab_name: '',
    report_file: null as File | null
  });

  useEffect(() => {
    if (user) {
      fetchLabTests();
    }
  }, [user]);

  const fetchLabTests = async () => {
    try {
      const { data, error } = await supabase
        .from('lab_tests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLabTests(data || []);
    } catch (error) {
      console.error('Error fetching lab tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, testId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${testId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('lab-reports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Update the test record with file URL
      const { error: updateError } = await supabase
        .from('lab_tests')
        .update({ report_file_url: fileName })
        .eq('id', testId);

      if (updateError) throw updateError;

      return fileName;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const analyzeReport = async (testId: string, fileUrl: string) => {
    try {
      setAnalyzing(testId);
      
      const { data, error } = await supabase.functions.invoke('analyze-blood-report', {
        body: { fileUrl, testId }
      });

      if (error) throw error;

      // Refresh the lab tests to get updated analysis
      await fetchLabTests();
    } catch (error) {
      console.error('Error analyzing report:', error);
      alert('Failed to analyze report. Please try again.');
    } finally {
      setAnalyzing(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Insert lab test record
      const { data: testData, error: insertError } = await supabase
        .from('lab_tests')
        .insert({
          user_id: user?.id,
          test_name: formData.test_name,
          test_date: formData.test_date || null,
          lab_name: formData.lab_name || null,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Upload file if provided
      if (formData.report_file) {
        const fileUrl = await handleFileUpload(formData.report_file, testData.id);
        
        // Start analysis
        await analyzeReport(testData.id, fileUrl);
      }

      // Reset form and refresh data
      setFormData({
        test_name: '',
        test_date: '',
        lab_name: '',
        report_file: null
      });
      setShowAddForm(false);
      await fetchLabTests();
    } catch (error) {
      console.error('Error adding lab test:', error);
      alert('Failed to add lab test. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const downloadReport = async (fileUrl: string, testName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('lab-reports')
        .download(fileUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${testName}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const getStats = () => {
    const pending = labTests.filter(test => test.status === 'pending').length;
    const completed = labTests.filter(test => test.status === 'completed').length;
    const withReports = labTests.filter(test => test.report_file_url).length;
    
    return { pending, completed, withReports, total: labTests.length };
  };

  const stats = getStats();

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
      <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{translate("labTests")}</h1>
            <p className="text-blue-100 mt-1">{translate("trackTestResults")}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Test</span>
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
            <p className="text-xs text-gray-600">{translate("pending")}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{stats.completed}</p>
            <p className="text-xs text-gray-600">{translate("completed")}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <Download className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{stats.withReports}</p>
            <p className="text-xs text-gray-600">With Reports</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-600">Total Tests</p>
          </div>
        </div>
      </div>

      {/* Add Test Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Lab Test</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Name *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.test_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, test_name: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <SpeechToText
                    onTranscript={(text) => setFormData(prev => ({ ...prev, test_name: text }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Date
                </label>
                <input
                  type="date"
                  value={formData.test_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, test_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lab Name
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.lab_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, lab_name: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <SpeechToText
                    onTranscript={(text) => setFormData(prev => ({ ...prev, lab_name: text }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Report (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData(prev => ({ ...prev, report_file: e.target.files?.[0] || null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Add Test'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Lab Tests List */}
      <div className="px-4 space-y-4">
        {labTests.map((test) => (
          <div key={test.id} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🧪</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{test.test_name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      test.status === 'completed' ? 'bg-green-100 text-green-800' :
                      test.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {test.status}
                    </span>
                    {test.test_date && (
                      <span className="text-sm text-gray-600">{test.test_date}</span>
                    )}
                  </div>
                  {test.lab_name && (
                    <p className="text-sm text-gray-600">{test.lab_name}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {test.report_file_url && (
                  <>
                    <button
                      onClick={() => downloadReport(test.report_file_url!, test.test_name)}
                      className="p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {!test.analysis_result && (
                      <button
                        onClick={() => analyzeReport(test.id, test.report_file_url!)}
                        disabled={analyzing === test.id}
                        className="p-2 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 disabled:opacity-50"
                      >
                        {analyzing === test.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <span className="text-sm">Analyze</span>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {test.analysis_result && (
              <div className="bg-green-50 rounded-lg p-3">
                <h4 className="font-medium text-green-700 mb-2">Analysis Results:</h4>
                <div className="text-green-900 text-sm space-y-1">
                  {test.analysis_result.summary && (
                    <p><strong>Summary:</strong> {test.analysis_result.summary}</p>
                  )}
                  {test.analysis_result.recommendations && (
                    <div>
                      <strong>Recommendations:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {test.analysis_result.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {test.analysis_result.abnormal_values && test.analysis_result.abnormal_values.length > 0 && (
                    <div>
                      <strong>Abnormal Values:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {test.analysis_result.abnormal_values.map((value: any, index: number) => (
                          <li key={index}>{value.parameter}: {value.value} (Normal: {value.normal_range})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {labTests.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧪</span>
            </div>
            <p className="text-gray-600">No lab tests yet. Add your first test to get started.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LabTests;
