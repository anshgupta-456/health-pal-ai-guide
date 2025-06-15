import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import SpeechToText from "@/components/SpeechToText";
import SpeakButton from "@/components/SpeakButton";
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
  const { translate, currentLanguage } = useLanguage();
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [refreshingAnalysis, setRefreshingAnalysis] = useState<string | null>(null);
  
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
      
      // Transform the data to match our interface
      const transformedData: LabTest[] = (data || []).map(item => ({
        id: item.id,
        test_name: item.test_name,
        test_date: item.test_date,
        lab_name: item.lab_name,
        report_file_url: item.report_file_url,
        analysis_result: item.analysis_result,
        status: item.status as 'pending' | 'completed' | 'cancelled',
        created_at: item.created_at
      }));
      
      setLabTests(transformedData);
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

  // Update analyzeReport to always send the correct current language!
  const analyzeReport = async (testId: string, fileUrl: string, forceLang?: string) => {
    try {
      setAnalyzing(testId);
      const languageCode = forceLang || currentLanguage.code;

      // Always send currentLanguage.code to backend
      const { data, error } = await supabase.functions.invoke('analyze-blood-report', {
        body: {
          fileUrl,
          testId,
          language: languageCode
        }
      });
      if (error) throw error;

      await fetchLabTests();
    } catch (error) {
      console.error('Error analyzing report:', error);
      alert('Failed to analyze report. Please try again.');
    } finally {
      setAnalyzing(null);
    }
  };

  // NEW: Listen to currentLanguage.code changes and re-analyze all completed tests in the new language!
  useEffect(() => {
    // Only re-analyze if analysis_result.language doesn't match current language
    const testsToReAnalyze = labTests.filter(
      (test) =>
        test.status === 'completed' &&
        test.analysis_result &&
        test.analysis_result.language !== currentLanguage.code &&
        test.report_file_url
    );
    if (testsToReAnalyze.length > 0) {
      testsToReAnalyze.forEach((test) => {
        analyzeReport(test.id, test.report_file_url!, currentLanguage.code);
      });
    }
    // eslint-disable-next-line
  }, [currentLanguage.code]);

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
      {/* Improved Header with better spacing and responsive design */}
      <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{translate("labTests")}</h1>
              <SpeakButton text={translate("labTests")} className="text-white scale-90 flex-shrink-0" />
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-teal-100 text-sm sm:text-base">{translate("trackTestResults")}</p>
              <SpeakButton text={translate("trackTestResults")} className="text-white scale-75 flex-shrink-0" />
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-white/20 hover:bg-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white transition-all duration-200 flex items-center space-x-2 shadow-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transform hover:scale-105 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm font-medium">{translate("addTest")}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats - Made responsive */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            <p className="text-xs text-gray-600">{translate("withReports")}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-600">{translate("totalTests")}</p>
          </div>
        </div>
      </div>

      {/* Add Test Form - Made responsive */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{translate("addNewLabTest")}</h3>
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
                  {translate("testName")} *
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
                  {translate("testDate")}
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
                  {translate("labName")}
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
                  {translate("uploadReport")} (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData(prev => ({ ...prev, report_file: e.target.files?.[0] || null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    translate("addTest")
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {translate("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Lab Tests List - Made responsive */}
      <div className="px-4 space-y-4">
        {labTests.map((test) => {
          // Always true if language mismatch for completed
          const needsRefresh =
            test.analysis_result &&
            test.analysis_result.language !== currentLanguage.code &&
            test.status === "completed" &&
            test.report_file_url;
          return (
            <div key={test.id} className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🧪</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{test.test_name}</h3>
                      <SpeakButton text={test.test_name} className="scale-75 flex-shrink-0" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.status === 'completed' ? 'bg-green-100 text-green-800' :
                        test.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {translate(test.status)}
                      </span>
                      {test.test_date && (
                        <span className="text-sm text-gray-600">{test.test_date}</span>
                      )}
                    </div>
                    {test.lab_name && (
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-600 truncate">{test.lab_name}</p>
                        <SpeakButton text={test.lab_name} className="scale-75 flex-shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 flex-shrink-0">
                  {test.report_file_url && (
                    <>
                      <button
                        onClick={() => downloadReport(test.report_file_url!, test.test_name)}
                        className="p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100"
                        title={translate("downloadReport")}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {!test.analysis_result && (
                        <button
                          onClick={() => analyzeReport(test.id, test.report_file_url!)}
                          disabled={analyzing === test.id}
                          className="p-2 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 disabled:opacity-50"
                          title={translate("analyzeReport")}
                        >
                          {analyzing === test.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <span className="text-xs">{translate("analyze")}</span>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {needsRefresh && (
                <div className="mb-2">
                  <button
                    onClick={() =>
                      analyzeReport(test.id, test.report_file_url!, currentLanguage.code)
                    }
                    disabled={analyzing === test.id || refreshingAnalysis === test.id}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition text-xs font-medium"
                  >
                    {analyzing === test.id || refreshingAnalysis === test.id
                      ? translate("analyze") + "..."
                      : `${translate("analyze")} (${currentLanguage.nativeName})`}
                  </button>
                  <span className="text-xs text-gray-500 ml-2">
                    {translate('analysisResults')} not available in {currentLanguage.nativeName}. Refresh to view.
                  </span>
                </div>
              )}

              {test.analysis_result && (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-green-700">{translate("analysisResults")}:</h4>
                    <SpeakButton text={translate("analysisResults")} className="scale-75" />
                  </div>
                  <div className="text-green-900 text-sm space-y-1">
                    {/* Ensure always displays available content in the current language */}
                    {test.analysis_result.summary && (
                      <div className="flex items-start space-x-2">
                        <p>
                          <strong>{translate("summary")}:</strong> {test.analysis_result.summary}
                        </p>
                        <SpeakButton text={test.analysis_result.summary} className="scale-75 flex-shrink-0" />
                      </div>
                    )}
                    {test.analysis_result.recommendations && (
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong>{translate("recommendations")}:</strong>
                          <SpeakButton text={translate("recommendations")} className="scale-75" />
                        </div>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {test.analysis_result.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="flex-1">{rec}</span>
                              <SpeakButton text={rec} className="scale-75 flex-shrink-0" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {test.analysis_result.abnormal_values && test.analysis_result.abnormal_values.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong>{translate("abnormalValues")}:</strong>
                          <SpeakButton text={translate("abnormalValues")} className="scale-75" />
                        </div>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {test.analysis_result.abnormal_values.map((value: any, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="flex-1">{value.parameter}: {value.value} ({translate("normal")}: {value.normal_range})</span>
                              <SpeakButton text={`${value.parameter}: ${value.value} Normal: ${value.normal_range}`} className="scale-75 flex-shrink-0" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {labTests.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧪</span>
            </div>
            <p className="text-gray-600">{translate("noLabTestsYet")}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LabTests;
