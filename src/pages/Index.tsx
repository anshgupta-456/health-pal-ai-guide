import Layout from "@/components/Layout";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import TodaysTasks from "@/components/dashboard/TodaysTasks";
import HealthStats from "@/components/dashboard/HealthStats";
import NotificationSetup from "@/components/NotificationSetup";
import { useNotifications } from "@/hooks/useNotifications";
import { useState } from "react";
import SymptomChecker from "@/components/SymptomChecker";

const Index = () => {
  // Initialize notifications hook
  useNotifications();

  // Remove symptomOpen and SymptomChecker
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <WelcomeHeader />

        <div className="px-4 py-6 space-y-6">
          <NotificationSetup />
          <HealthStats />
          {/* <QuickActions /> -- REMOVED */}
          {/* Symptom Checker button removed */}
          <TodaysTasks />
          {/* SymptomChecker removed */}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
