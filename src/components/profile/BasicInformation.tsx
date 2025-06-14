
const BasicInformation = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <p className="font-medium text-gray-900">Rajesh Kumar</p>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Age</label>
          <p className="font-medium text-gray-900">58 years</p>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Gender</label>
          <p className="font-medium text-gray-900">Male</p>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Preferred Language</label>
          <p className="font-medium text-gray-900">Hindi</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
