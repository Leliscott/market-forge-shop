
import React from 'react';

const PaymentTerms = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Terms</h3>
      
      <div className="space-y-3 text-sm">
        <p>
          <strong>Payment Processing:</strong> All payments are processed securely through PayFast, 
          our authorized payment gateway partner. We accept major credit cards, debit cards, and EFT payments.
        </p>
        
        <p>
          <strong>Pricing and VAT:</strong> All product prices displayed on our platform include VAT (Value Added Tax) 
          at the current rate of 15%. VAT is calculated on the product price excluding delivery charges.
        </p>
        
        <p>
          <strong>Delivery Charges:</strong> Delivery charges are set by individual sellers and are separate from product prices. 
          These charges are clearly displayed during checkout and are paid by the customer. Delivery charges are not subject to VAT 
          as they represent the actual cost of the delivery service.
        </p>
        
        <p>
          <strong>Marketplace Fees:</strong> ShopMarket charges sellers a marketplace fee of 9% on the net product value 
          (excluding VAT and delivery charges). This fee is deducted from seller payments and is not charged to customers.
        </p>
        
        <p>
          <strong>Payment Confirmation:</strong> You will receive a payment confirmation via email once your payment 
          has been successfully processed. This confirmation includes your order details and delivery information.
        </p>
        
        <p>
          <strong>Refunds and Disputes:</strong> Refund policies are determined by individual sellers. 
          In case of payment disputes, customers should first contact the seller directly. 
          ShopMarket may facilitate dispute resolution when necessary.
        </p>
        
        <p>
          <strong>Delivery Arrangements:</strong> Delivery is handled entirely by the seller using their selected delivery services. 
          Customers are responsible for providing accurate delivery information and coordinating with sellers for successful delivery. 
          ShopMarket is not responsible for delivery delays, damages, or failed deliveries.
        </p>
        
        <p>
          <strong>Security:</strong> We employ industry-standard security measures to protect your payment information. 
          Your credit card details are never stored on our servers and are processed securely by PayFast.
        </p>
      </div>
    </div>
  );
};

export default PaymentTerms;
