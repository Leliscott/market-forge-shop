
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useTermsValidation = () => {
  const { profile } = useAuth();
  const { toast } = useToast();

  const validateTermsAcceptance = (userType: 'customer' | 'seller' = 'customer'): boolean => {
    if (!profile?.accepted_terms) {
      toast({
        title: "Terms and Conditions Required",
        description: `As a ${userType}, you must accept our Terms and Conditions before proceeding. This is required by South African law.`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateCustomerTerms = (): boolean => {
    return validateTermsAcceptance('customer');
  };

  const validateSellerTerms = (): boolean => {
    return validateTermsAcceptance('seller');
  };

  return {
    hasAcceptedTerms: !!profile?.accepted_terms,
    validateCustomerTerms,
    validateSellerTerms,
    validateTermsAcceptance
  };
};
