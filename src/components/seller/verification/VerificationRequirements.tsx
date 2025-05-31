
import React from 'react';

const VerificationRequirements: React.FC = () => {
  return (
    <div className="bg-blue-50 p-3 rounded-md text-sm">
      <h4 className="font-medium mb-1">Requirements:</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>Clear photo of your South African ID document</li>
        <li>Selfie showing your face clearly alongside your ID</li>
        <li>Both documents must be readable and not expired</li>
      </ul>
    </div>
  );
};

export default VerificationRequirements;
