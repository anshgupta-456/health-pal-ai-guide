
import Layout from "@/components/Layout";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import HealthStats from "@/components/dashboard/HealthStats";
import TodaysTasks from "@/components/dashboard/TodaysTasks";
import QuickActions from "@/components/dashboard/QuickActions";

const Index = () => {
  return (
    <Layout>
      <div className="p-4 space-y-6">
        <WelcomeHeader />
        <HealthStats />
        <TodaysTasks />
        <QuickActions />
      </div>
    </Layout>
  );
};

export default Index;
