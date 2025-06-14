
import Layout from "@/components/Layout";
import { Clock, Calendar, CheckCircle, Download } from "lucide-react";

const LabTests = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 px-4 py-6">
        <h1 className="text-2xl font-bold text-white">Lab Tests</h1>
        <p className="text-blue-100 mt-1">Track your test results and appointments</p>
      </div>
      
      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">1</p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">1</p>
            <p className="text-xs text-gray-600">Scheduled</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border">
            <Download className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">1</p>
            <p className="text-xs text-gray-600">Results Ready</p>
          </div>
        </div>
      </div>
      
      {/* Test Result */}
      <div className="px-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">🧪</span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">Complete Blood Count (CBC)</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    results ready
                  </span>
                </div>
                <p className="text-sm text-gray-600">Blood Test</p>
                <div className="text-xs text-gray-500 space-y-1 mt-1">
                  <p>Scheduled: 10/1/2024</p>
                  <p>Lab: City Diagnostic Center</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">
                View Report
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-blue-700 mb-2">Preparation Instructions:</p>
            <ul className="text-blue-900 text-sm space-y-1">
              <li>• Fasting required for 8-10 hours</li>
              <li>• Avoid alcohol 24 hours before test</li>
              <li>• Wear comfortable clothing</li>
              <li>• Bring ID and prescription</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm font-medium text-green-700 mb-2">Test Results:</p>
            <p className="text-green-900 text-sm mb-2">All values are within normal range. Your blood count shows healthy levels.</p>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Hemoglobin: 14.2 g/dL (Normal)</li>
              <li>• White Blood Cells: 7,200/μL (Normal)</li>
              <li>• Platelets: 280,000/μL (Normal)</li>
            </ul>
            <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
              Download Full Report
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LabTests;
