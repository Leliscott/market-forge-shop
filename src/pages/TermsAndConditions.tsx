
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import AgentPortal from '@/components/agent/AgentPortal';
import TermsIntroduction from '@/components/terms/TermsIntroduction';
import PaymentTerms from '@/components/terms/PaymentTerms';
import PrivacySection from '@/components/terms/PrivacySection';
import MerchantVerification from '@/components/terms/MerchantVerification';
import LegalCompliance from '@/components/terms/LegalCompliance';
import TermsAcceptance from '@/components/terms/TermsAcceptance';

const TermsAndConditions = () => {
  const { profile } = useAuth();
  const [accepted, setAccepted] = React.useState(profile?.accepted_terms || false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="mb-8">
          <TermsIntroduction />
          <PaymentTerms />
          <PrivacySection />
          <MerchantVerification />
          <LegalCompliance />
          
          <p className="text-sm text-muted-foreground mt-8">
            Last updated: {new Date().toLocaleDateString('en-ZA')}
          </p>
        </div>
        
        <TermsAcceptance accepted={accepted} setAccepted={setAccepted} />
      </main>
      
      <AgentPortal />
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
