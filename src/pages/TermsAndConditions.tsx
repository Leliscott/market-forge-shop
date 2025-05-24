
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
            for the use of our platform in South Africa. By using our platform, you agree to comply
            with all applicable South African laws including the Protection of Personal Information Act (POPIA),
            Electronic Communications and Transactions Act (ECT Act), and Consumer Protection Act (CPA).
          </p>
          
          <h2>2. Definitions</h2>
          <p>
            "Platform" refers to our website and services.
            "User," "You" and "Your" refers to you, the person accessing this platform.
            "Company," "Ourselves," "We," "Our" and "Us" refers to ShopMarket.
            "Party," "Parties," or "Us" refers to both the User and ourselves.
            "Personal Information" has the meaning assigned to it in POPIA.
            "Processing" has the meaning assigned to it in POPIA.
          </p>
          
          <h2>3. Acceptance of Terms</h2>
          <p>
            By accessing and using our platform, you accept and agree to be bound by these Terms and Conditions
            and comply with all applicable laws and regulations of the Republic of South Africa. If you do not agree with any of these terms,
            you are prohibited from using or accessing this platform.
          </p>
          
          <h2>4. User Accounts and Registration</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current
            at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination
            of your account on our platform. You are responsible for safeguarding your account credentials and for all activities
            that occur under your account.
          </p>
          
          <h2>5. Payment Processing and PayFast Integration</h2>
          <p>
            ShopMarket uses PayFast as our secure payment gateway for processing all transactions. By making a purchase, you agree to:
          </p>
          <ul>
            <li>Provide accurate and complete payment information</li>
            <li>Authorize PayFast to process your payment on behalf of ShopMarket</li>
            <li>Accept that all payments are processed in South African Rand (ZAR)</li>
            <li>Understand that PayFast's terms and conditions also apply to your transaction</li>
            <li>Accept that payment confirmation may take up to 24 hours for certain payment methods</li>
            <li>Acknowledge that failed payments may result in order cancellation</li>
          </ul>
          <p>
            For payment disputes or issues, you may contact PayFast directly or reach out to our support team.
            We do not store your credit card or banking details on our servers - all payment information is processed
            securely by PayFast in compliance with PCI DSS standards.
          </p>
          
          <h2>6. Order Processing and Fulfillment</h2>
          <p>
            Upon successful payment confirmation through PayFast:
          </p>
          <ul>
            <li>Your order will be confirmed and you will receive an email notification</li>
            <li>The relevant seller will be notified to prepare your order for dispatch</li>
            <li>Order tracking information will be provided where available</li>
            <li>Delivery timeframes are estimates and may vary based on location and seller</li>
            <li>You can view all your orders and their status in your account dashboard</li>
          </ul>
          
          <h2>7. Protection of Personal Information (POPIA Compliance)</h2>
          <p>
            In accordance with the Protection of Personal Information Act (POPIA), we are committed to protecting your personal information:
          </p>
          <h3>7.1 Information We Collect</h3>
          <ul>
            <li>Account information (name, email address, phone number)</li>
            <li>Billing and shipping addresses</li>
            <li>Transaction history and payment information (processed by PayFast)</li>
            <li>Communication records with sellers and customer support</li>
            <li>Device and usage information for platform improvement</li>
          </ul>
          
          <h3>7.2 How We Use Your Information</h3>
          <ul>
            <li>To process orders and facilitate transactions</li>
            <li>To communicate with you about your orders and account</li>
            <li>To provide customer support and resolve disputes</li>
            <li>To improve our platform and services</li>
            <li>To comply with legal obligations</li>
            <li>For merchant verification processes where applicable</li>
          </ul>
          
          <h3>7.3 Information Sharing</h3>
          <p>
            We only share your personal information with:
          </p>
          <ul>
            <li>Sellers to fulfill your orders (limited to necessary delivery information)</li>
            <li>PayFast for payment processing</li>
            <li>Service providers who assist in platform operations (under strict confidentiality)</li>
            <li>Law enforcement when legally required</li>
          </ul>
          
          <h3>7.4 Your Rights Under POPIA</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information we hold</li>
            <li>Correct or update inaccurate information</li>
            <li>Delete your personal information (subject to legal requirements)</li>
            <li>Object to processing of your personal information</li>
            <li>Lodge a complaint with the Information Regulator</li>
          </ul>
          
          <h2>8. Data Security and Retention</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction. Personal information is retained
            only for as long as necessary to fulfill the purposes for which it was collected, or as required by law.
            Payment information is processed and stored securely by PayFast according to industry standards.
          </p>
          
          <h2>9. Marketplace Sellers</h2>
          <p>
            If you register as a seller on our marketplace, you agree to:
          </p>
          <ul>
            <li>Provide accurate and complete information about your products</li>
            <li>Ship products in a timely manner after purchase confirmation</li>
            <li>Respond promptly to customer inquiries</li>
            <li>Maintain inventory information that is up to date</li>
            <li>Comply with all applicable South African laws and regulations</li>
            <li>Properly disclose all pricing in South African Rand (ZAR), inclusive of VAT where applicable</li>
            <li>Handle customer data in accordance with POPIA requirements</li>
            <li>Participate in dispute resolution processes when required</li>
          </ul>
          
          <h2>10. Merchant Verification</h2>
          <p>
            As part of our commitment to a safe and trusted marketplace, all sellers must undergo a verification process:
          </p>
          <ul>
            <li><strong>Verification Requirements:</strong> Sellers must submit a valid South African ID document and a current selfie photograph clearly showing their face alongside the ID document</li>
            <li><strong>Verification Process:</strong> All submitted documents will be reviewed by authorized ShopMarket agents who will verify authenticity and confirm identity</li>
            <li><strong>Data Protection:</strong> All identification documents are processed and stored in accordance with POPIA and are only accessible to authorized verification agents</li>
            <li><strong>Verification Status:</strong> Verified merchants receive a verification badge visible to customers</li>
            <li><strong>Document Retention:</strong> Verification documents are retained for legal compliance and may be shared with law enforcement if required</li>
            <li><strong>Revocation:</strong> Verification status may be revoked if fraud or misrepresentation is detected</li>
            <li><strong>Mandatory Compliance:</strong> Beginning January 1, 2026, all merchants must complete verification to continue selling</li>
          </ul>
          
          <h2>11. Consumer Protection Act Compliance</h2>
          <p>
            In accordance with the Consumer Protection Act, you have the right to:
          </p>
          <ul>
            <li>Receive goods that match their description and are of acceptable quality</li>
            <li>Return goods within the cooling-off period where applicable</li>
            <li>Receive clear pricing information including all fees and taxes</li>
            <li>Fair and responsible marketing practices</li>
            <li>Protection against unfair business practices</li>
          </ul>
          
          <h2>12. Electronic Communications and Transactions</h2>
          <p>
            Our platform operates in compliance with the Electronic Communications and Transactions Act (ECT Act):
          </p>
          <ul>
            <li>Electronic transactions are legally binding</li>
            <li>Digital signatures and records are valid</li>
            <li>Platform security measures meet required standards</li>
            <li>Transaction records are maintained for audit purposes</li>
          </ul>
          
          <h2>13. Intellectual Property</h2>
          <p>
            The platform and its original content, features, and functionality are and will remain the exclusive
            property of ShopMarket and its licensors. The platform is protected by copyright, trademark, and other
            laws of the Republic of South Africa and foreign countries.
          </p>
          
          <h2>14. Limitation of Liability</h2>
          <p>
            In no event shall ShopMarket, nor its directors, employees, partners, agents, suppliers,
            or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
            resulting from your access to or use of or inability to access or use the platform, subject to
            applicable consumer protection laws.
          </p>
          
          <h2>15. Dispute Resolution</h2>
          <p>
            Any disputes arising from the use of our platform will be resolved through:
          </p>
          <ul>
            <li>Initial mediation through our customer support team</li>
            <li>Escalation to formal mediation if required</li>
            <li>Arbitration or legal proceedings in South African courts as a last resort</li>
          </ul>
          
          <h2>16. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the Republic of South Africa,
            without regard to its conflict of law provisions. Any legal proceedings will be conducted in South African courts.
          </p>
          
          <h2>17. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to improve your experience on our platform. By using our services,
            you consent to our use of cookies as described in our Cookie Policy. You can manage your cookie preferences
            through your browser settings.
          </p>
          
          <h2>18. VAT and Taxation</h2>
          <p>
            All prices displayed on the platform are in South African Rand (ZAR) and include Value Added Tax (VAT) 
            where applicable. Sellers are responsible for ensuring compliance with all South African Revenue Service 
            (SARS) requirements regarding taxation. VAT-registered sellers must display their VAT registration numbers.
          </p>
          
          <h2>19. Platform Availability and Maintenance</h2>
          <p>
            While we strive to maintain continuous platform availability, we reserve the right to:
          </p>
          <ul>
            <li>Perform scheduled maintenance with advance notice</li>
            <li>Temporarily suspend services for technical reasons</li>
            <li>Update or modify platform features</li>
            <li>Implement security measures as needed</li>
          </ul>
          
          <h2>20. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. Material changes will be communicated
            with at least 30 days' notice. Continued use of the platform after changes constitute acceptance of new terms.
          </p>
          
          <h2>21. Contact Information</h2>
          <p>
            For questions about these Terms, privacy concerns, or to exercise your POPIA rights, contact us at:
          </p>
          <ul>
            <li>Email: support@shopmarket.co.za</li>
            <li>Privacy Officer: privacy@shopmarket.co.za</li>
            <li>POPIA Inquiries: popia@shopmarket.co.za</li>
          </ul>
          
          <p className="text-sm text-muted-foreground mt-8">
            Last updated: {new Date().toLocaleDateString('en-ZA')}
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
              I have read and agree to the terms and conditions, including POPIA privacy provisions
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
