
interface ValidationHookProps {
  hasAcceptedTerms: boolean;
  shippingAddress: any;
  billingAddress: any;
  items: any[];
}

export const useValidation = ({
  hasAcceptedTerms,
  shippingAddress,
  billingAddress,
  items
}: ValidationHookProps) => {
  // Check if billing address is valid (including consent checkboxes)
  const isBillingValid = billingAddress && billingAddress.isValid && 
                        billingAddress.firstName && 
                        billingAddress.lastName && 
                        billingAddress.email && 
                        billingAddress.phone && 
                        billingAddress.address && 
                        billingAddress.city && 
                        billingAddress.province && 
                        billingAddress.postalCode;

  // Only require checkbox acceptance if user hasn't already accepted terms
  const needsCheckboxAcceptance = !hasAcceptedTerms && (!billingAddress?.agreeToTerms || 
                                 !billingAddress?.agreeToPrivacy || 
                                 !billingAddress?.agreeToProcessing);

  // Update billing validation to consider terms acceptance status
  const isBillingCompletelyValid = isBillingValid && (!needsCheckboxAcceptance);

  // Check if shipping address is valid
  const isShippingValid = shippingAddress && 
                         shippingAddress.firstName && 
                         shippingAddress.lastName && 
                         shippingAddress.address && 
                         shippingAddress.city && 
                         shippingAddress.province && 
                         shippingAddress.postalCode;

  const isReadyToProcess = isShippingValid && 
                          isBillingCompletelyValid && 
                          items.length > 0 && 
                          hasAcceptedTerms;

  // Get detailed validation status for better user feedback
  const getValidationIssues = () => {
    const issues = [];
    
    if (!hasAcceptedTerms) {
      issues.push("Accept Terms and Conditions in your profile (SA law requirement)");
    }
    
    if (!isShippingValid) {
      if (!shippingAddress) {
        issues.push("Complete shipping address");
      } else {
        const missingShipping = [];
        if (!shippingAddress.firstName) missingShipping.push("first name");
        if (!shippingAddress.lastName) missingShipping.push("last name");
        if (!shippingAddress.address) missingShipping.push("street address");
        if (!shippingAddress.city) missingShipping.push("city");
        if (!shippingAddress.province) missingShipping.push("province");
        if (!shippingAddress.postalCode) missingShipping.push("postal code");
        
        if (missingShipping.length > 0) {
          issues.push(`Complete shipping: ${missingShipping.join(", ")}`);
        }
      }
    }
    
    if (!isBillingCompletelyValid) {
      if (!billingAddress) {
        issues.push("Complete billing information");
      } else {
        const missingBilling = [];
        if (!billingAddress.firstName) missingBilling.push("first name");
        if (!billingAddress.lastName) missingBilling.push("last name");
        if (!billingAddress.email) missingBilling.push("email");
        if (!billingAddress.phone) missingBilling.push("phone");
        if (!billingAddress.address) missingBilling.push("street address");
        if (!billingAddress.city) missingBilling.push("city");
        if (!billingAddress.province) missingBilling.push("province");
        if (!billingAddress.postalCode) missingBilling.push("postal code");
        
        // Only show missing consent if user hasn't already accepted terms
        const missingConsent = [];
        if (needsCheckboxAcceptance) {
          if (!billingAddress.agreeToTerms) missingConsent.push("Terms & Conditions");
          if (!billingAddress.agreeToPrivacy) missingConsent.push("Privacy Policy");
          if (!billingAddress.agreeToProcessing) missingConsent.push("Electronic Transactions");
        }
        
        if (missingBilling.length > 0) {
          issues.push(`Complete billing: ${missingBilling.join(", ")}`);
        }
        if (missingConsent.length > 0) {
          issues.push(`Accept: ${missingConsent.join(", ")}`);
        }
      }
    }
    
    return issues;
  };

  return {
    isReadyToProcess,
    validationIssues: getValidationIssues()
  };
};
