
import Layout from "@/components/Layout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BasicInformation from "@/components/profile/BasicInformation";
import MedicalInformation from "@/components/profile/MedicalInformation";

const Profile = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <ProfileHeader />
        <div className="px-4 space-y-6">
          <BasicInformation />
          <MedicalInformation />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
