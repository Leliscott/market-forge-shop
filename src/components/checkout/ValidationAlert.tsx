
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationAlertProps {
  validationIssues: string[];
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({ validationIssues }) => {
  if (validationIssues.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="font-medium mb-2">Please complete the following to proceed with payment:</div>
        <ul className="list-disc list-inside space-y-1">
          {validationIssues.map((issue, index) => (
            <li key={index} className="text-sm">{issue}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default ValidationAlert;
