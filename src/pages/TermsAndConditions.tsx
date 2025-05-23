import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import AgentPortal from '@/components/agent/AgentPortal';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [accepted, setAccepted] = React.useState(profile?.accepted_terms || false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAccept = async () => {
    if (!accepted) {
      toast({
        title: "Error",
        description: "You must accept the terms and conditions to continue",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await updateProfile({ accepted_terms: true });
      if (success) {
        toast({
          title: "Success",
          description: "You have successfully accepted our terms and conditions"
        });
        
        // Redirect based on user role
        if (profile?.role === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to update your profile. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      console.error("Error accepting terms:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="prose max-w-none mb-8">
          <h2>1. Introduction</h2>
          <p>
            Welcome to ShopMarket. These terms and conditions outline the rules and regulations
            for the use of our platform in South Africa.
          </p>
          
          <h2>2. Definitions</h2>
          <p>
            "Platform" refers to our website and services.
            "User," "You" and "Your" refers to you, the person accessing this platform.
            "Company," "Ourselves," "We," "Our" and "Us" refers to ShopMarket.
            "Party," "Parties," or "Us" refers to both the User and ourselves.
          </p>
          
          <h2>3. Acceptance of Terms</h2>
          <p>
            By accessing and using our platform, you accept and agree to be bound by these Terms and Conditions
            and comply with all applicable laws and regulations of the Republic of South Africa. If you do not agree with any of these terms,
            you are prohibited from using or accessing this platform.
          </p>
          
          <h2>4. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current
            at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination
            of your account on our platform.
          </p>
          
          <h2>5. User Content</h2>
          <p>
            Our platform allows you to post, link, store, share and otherwise make available certain information, text,
            graphics, videos, or other material. You are responsible for the content that you post, including its legality,
            reliability, and appropriateness.
          </p>
          
          <h2>6. Marketplace Sellers</h2>
          <p>
            If you register as a seller on our marketplace, you agree to:
          </p>
          <ul>
            <li>Provide accurate and complete information about your products</li>
            <li>Ship products in a timely manner after purchase</li>
            <li>Respond promptly to customer inquiries</li>
            <li>Maintain inventory information that is up to date</li>
            <li>Comply with all applicable South African laws and regulations, including the Consumer Protection Act and Electronic Communications and Transactions Act</li>
            <li>Properly disclose all pricing in South African Rand (ZAR), inclusive of VAT where applicable</li>
          </ul>
          
          <h2 className="text-primary">7. Merchant Verification</h2>
          <p>
            As part of our commitment to a safe and trusted marketplace, all sellers must undergo a verification process to become Verified Merchants.
          </p>
          <ul>
            <li><strong>Verification Requirements:</strong> Sellers must submit a valid South African ID document and a current selfie photograph clearly showing their face alongside the ID document for verification purposes.</li>
            <li><strong>Verification Process:</strong> All submitted documents will be reviewed by authorized ShopMarket agents who will verify the authenticity of documents and confirm the identity of the merchant.</li>
            <li><strong>Verification Status:</strong> Products from verified merchants will be marked with a verification badge, visible to customers.</li>
            <li><strong>Data Protection:</strong> All personal identification documents submitted for verification will be stored securely in accordance with South African data protection laws.</li>
            <li><strong>Revocation:</strong> ShopMarket reserves the right to revoke verified status at any time if fraud or misrepresentation is detected.</li>
            <li><strong>Mandatory Verification:</strong> Beginning January 1, 2026, all merchants must complete the verification process to continue selling on our platform.</li>
          </ul>
          
          <h2>8. Intellectual Property</h2>
          <p>
            The platform and its original content, features, and functionality are and will remain the exclusive
            property of ShopMarket and its licensors. The platform is protected by copyright, trademark, and other
            laws of the Republic of South Africa and foreign countries.
          </p>
          
          <h2>9. Privacy Policy and Cookies</h2>
          <p>
            Your use of our platform is also subject to our Privacy Policy, which outlines how we collect,
            use, disclose, and safeguard your information. By using our platform, you consent to the collection 
            and use of cookies in accordance with our Cookie Policy.
          </p>
          
          <h2>10. Limitation of Liability</h2>
          <p>
            In no event shall ShopMarket, nor its directors, employees, partners, agents, suppliers,
            or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
            resulting from your access to or use of or inability to access or use the platform.
          </p>
          
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the Republic of South Africa,
            without regard to its conflict of law provisions.
          </p>
          
          <h2>12. VAT and Taxation</h2>
          <p>
            All prices displayed on the platform are in South African Rand (ZAR) and include Value Added Tax (VAT) 
            where applicable. Sellers are responsible for ensuring compliance with all South African Revenue Service 
            (SARS) requirements regarding taxation.
          </p>
          
          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material,
            we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>
          
          <h2>14. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@shopmarket.co.za.
          </p>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-6">
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(!!checked)}
            />
            <label 
              htmlFor="terms" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agree to the terms and conditions
            </label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button onClick={handleAccept} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Accept and Continue"}
            </Button>
          </div>
        </div>
      </main>
      
      <AgentPortal />
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
