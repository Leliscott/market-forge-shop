
import React from 'react';
import { Check } from 'lucide-react';

interface TermsAcceptanceStatusProps {
  hasAcceptedTerms: boolean;
}

const TermsAcceptanceStatus: React.FC<TermsAcceptanceStatusProps> = ({ hasAcceptedTerms }) => {
  if (!hasAcceptedTerms) return null;

  return (
    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-green-800">
        <Check className="h-4 w-4" />
        <span className="text-sm font-medium">
          ✓ Terms and Conditions Already Accepted
        </span>
      </div>
      <p className="text-xs text-green-700 mt-1">
        You have previously accepted our Terms and Conditions including POPIA compliance.
        No need to accept again for this order.
      </p>
    </div>
  );
};

export default TermsAcceptanceStatus;
