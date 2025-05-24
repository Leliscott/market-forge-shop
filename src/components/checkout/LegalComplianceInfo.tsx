
import React from 'react';

const LegalComplianceInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm space-y-2">
      <p className="text-blue-800 font-medium mb-2">South African Legal Compliance</p>
      <div className="text-blue-700 space-y-1">
        <p>• VAT (15%) is included in product prices as required by SARS</p>
        <p>• Delivery charges are paid separately to seller's delivery service</p>
        <p>• Consumer Protection Act rights apply to all purchases</p>
        <p>• Electronic transaction records maintained per ECT Act</p>
        <p>• Personal data processed according to POPIA requirements</p>
      </div>
    </div>
  );
};

export default LegalComplianceInfo;
