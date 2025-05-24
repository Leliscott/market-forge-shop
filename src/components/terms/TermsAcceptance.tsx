
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface TermsAcceptanceProps {
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
}

const TermsAcceptance: React.FC<TermsAcceptanceProps> = ({ accepted, setAccepted }) => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
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
  );
};

export default TermsAcceptance;
