
import React from 'react';

const PaymentTerms = () => {
  return (
    <div className="prose max-w-none">
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
    </div>
  );
};

export default PaymentTerms;
