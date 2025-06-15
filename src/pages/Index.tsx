
import Layout from "@/components/Layout";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import TodaysTasks from "@/components/dashboard/TodaysTasks";
import HealthStats from "@/components/dashboard/HealthStats";
import NotificationSetup from "@/components/NotificationSetup";
import { useNotifications } from "@/hooks/useNotifications";

const Index = () => {
  // Initialize notifications hook
  useNotifications();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <WelcomeHeader />

        <div className="px-4 py-6 space-y-6">
          <NotificationSetup />
          <HealthStats />
          {/* <QuickActions /> -- REMOVED */}
          <TodaysTasks />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
