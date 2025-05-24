
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/constants';
import DeliveryNotice from './DeliveryNotice';
import OrderItems from './OrderItems';
import PricingBreakdown from './PricingBreakdown';
import TermsValidation from './TermsValidation';
import { useOrderCalculations } from './hooks/useOrderCalculations';
import { useOrderSubmit } from './hooks/useOrderSubmit';
import { useTermsValidation } from '@/hooks/useTermsValidation';

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

interface OrderSummaryProps {
  shippingAddress?: any;
  billingAddress?: any;
  selectedDelivery?: DeliveryService | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  shippingAddress, 
  billingAddress, 
  selectedDelivery 
}) => {
  const { items, totalPrice } = useCart();
  const { profile } = useAuth();
  const { isProcessing, handleCompleteOrder } = useOrderSubmit();
  const { hasAcceptedTerms, validateCustomerTerms } = useTermsValidation();
  
  const {
    deliveryCharge,
    subtotalExcludingVAT,
    vatAmount,
    finalTotal
  } = useOrderCalculations(totalPrice, selectedDelivery);

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

  const validationIssues = getValidationIssues();

  const onCompleteOrder = () => {
    if (!validateCustomerTerms()) {
      return;
    }
    
    handleCompleteOrder(
      finalTotal,
      shippingAddress,
      billingAddress,
      selectedDelivery || null,
      deliveryCharge
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      
      {/* Delivery Notice */}
      <DeliveryNotice />
      
      <div className="space-y-4">
        {/* Items */}
        <OrderItems items={items} />
        
        {/* Pricing Breakdown */}
        <PricingBreakdown
          subtotalExcludingVAT={subtotalExcludingVAT}
          vatAmount={vatAmount}
          deliveryCharge={deliveryCharge}
          finalTotal={finalTotal}
          selectedDelivery={selectedDelivery}
        />
        
        {/* Enhanced Terms Acceptance Check - Only show if user hasn't accepted terms */}
        {!hasAcceptedTerms && (
          <TermsValidation 
            hasAcceptedTerms={hasAcceptedTerms} 
            userType="customer"
            showNavigateButton={true}
          />
        )}

        {/* Terms Already Accepted Confirmation */}
        {hasAcceptedTerms && (
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
        )}
        
        {/* Validation Issues Alert */}
        {!isReadyToProcess && validationIssues.length > 0 && (
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
        )}
        
        {/* Enhanced Legal Information */}
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
        
        <Button 
          className="w-full" 
          size="lg"
          onClick={onCompleteOrder}
          disabled={!isReadyToProcess || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              {isReadyToProcess ? (
                `Pay with PayFast - ${formatCurrency(finalTotal)}`
              ) : (
                `Complete Required Fields to Pay - ${formatCurrency(finalTotal)}`
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
