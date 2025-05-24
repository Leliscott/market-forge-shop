
import React from 'react';
import { Shield, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const SellerTermsEnforcement: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  if (profile?.accepted_terms) {
    return (
      <Alert className="border-green-200 bg-green-50 mb-6">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <span className="font-medium">Legal Compliance Confirmed:</span> You have accepted our terms and conditions and are compliant with South African e-commerce regulations.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-red-200 bg-red-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          Legal Compliance Required
        </CardTitle>
        <CardDescription className="text-red-700">
          South African law requires all marketplace sellers to accept comprehensive terms and conditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-red-800">
          <p className="mb-3 font-medium">As a seller, you must comply with:</p>
          <ul className="space-y-2 ml-4 list-disc">
            <li><strong>POPIA (Protection of Personal Information Act):</strong> Customer data protection and privacy rights</li>
            <li><strong>Consumer Protection Act:</strong> Fair trading practices and consumer rights</li>
            <li><strong>ECT Act:</strong> Electronic commerce and transaction regulations</li>
            <li><strong>SARS Compliance:</strong> VAT registration and tax obligations</li>
            <li><strong>Merchant Verification:</strong> Identity verification for marketplace trust</li>
          </ul>
        </div>
        
        <Alert className="border-amber-200 bg-amber-50">
          <Shield className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Mandatory Compliance:</strong> Beginning January 1, 2026, all merchants must complete 
            verification and accept updated terms to continue selling on our platform.
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-2 pt-2">
          <Button onClick={() => navigate('/terms')} className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Accept Terms & Conditions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerTermsEnforcement;
