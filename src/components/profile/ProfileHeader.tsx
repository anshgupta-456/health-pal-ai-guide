
const ProfileHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 px-4 py-8">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-2xl text-white">👤</span>
        </div>
        <div className="text-white">
          <h1 className="text-xl font-bold">Rajesh Kumar</h1>
          <div className="flex items-center space-x-4 mt-1">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Age: 58</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Male</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
