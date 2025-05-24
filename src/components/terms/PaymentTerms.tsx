
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

      <h2>5.1. Delivery and Shipping Responsibility</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
        <p className="font-semibold text-amber-800 mb-2">IMPORTANT DELIVERY NOTICE:</p>
        <p className="text-amber-700">
          ShopMarket does NOT handle deliveries or shipping. All delivery arrangements are the exclusive 
          responsibility of individual sellers. Customers must coordinate directly with sellers for all 
          delivery matters including timing, location, and method of delivery.
        </p>
      </div>
      <ul>
        <li>Sellers are solely responsible for product delivery and fulfillment</li>
        <li>Customers must complete a delivery information form after payment</li>
        <li>Delivery arrangements are made directly between customer and seller</li>
        <li>ShopMarket is not liable for delivery delays, damages, or non-delivery</li>
        <li>Sellers must provide their contact details to customers after payment confirmation</li>
        <li>Customers should verify delivery terms with sellers before purchase</li>
        <li>All delivery disputes must be resolved directly between customer and seller</li>
      </ul>
      
      <h2>6. Order Processing and Fulfillment</h2>
      <p>
        Upon successful payment confirmation through PayFast:
      </p>
      <ul>
        <li>Your order will be confirmed and you will receive an email notification</li>
        <li>You will receive seller contact details for delivery coordination</li>
        <li>You must complete a delivery information form within 24 hours</li>
        <li>The relevant seller will be notified to prepare your order for dispatch</li>
        <li>You must coordinate delivery directly with the seller using provided contact details</li>
        <li>Order tracking information will be provided where available from the seller</li>
        <li>Delivery timeframes are estimates provided by sellers and may vary</li>
        <li>You can view all your orders and their status in your account dashboard</li>
      </ul>

      <h2>7. VAT and Pricing Structure</h2>
      <p>
        All product prices on ShopMarket include VAT (Value Added Tax) at the current South African rate of 15%. 
        The pricing structure works as follows:
      </p>
      <ul>
        <li>Product prices displayed include 15% VAT</li>
        <li>VAT is automatically calculated and deducted from seller earnings</li>
        <li>Sellers are responsible for VAT compliance and registration where required</li>
        <li>VAT certificates can be requested for business purchases</li>
      </ul>

      <h2>8. Seller Financial Terms</h2>
      <p>
        For sellers using the ShopMarket platform:
      </p>
      <ul>
        <li>All product prices automatically include 15% VAT (Value Added Tax)</li>
        <li>VAT is automatically deducted from gross sales revenue</li>
        <li>A marketplace service fee of 9% is charged on the net amount (after VAT deduction)</li>
        <li>Seller profit = Gross Sale Price - VAT (15%) - Marketplace Fee (9% of net amount)</li>
        <li>Earnings are available for withdrawal once orders are marked as "delivered"</li>
        <li>Minimum withdrawal amount is R15.00</li>
        <li>Withdrawal requests are processed within 3-5 business days</li>
        <li>Sellers must provide valid South African banking details for withdrawals</li>
        <li>All financial records and transaction details are maintained for auditing purposes</li>
        <li>Sellers acknowledge that marketplace fees cover payment processing, platform maintenance, customer support, and marketing services</li>
        <li>New sellers without completed orders will show zero balances until their first order is delivered</li>
      </ul>

      <h2>9. Withdrawal and Banking</h2>
      <p>
        Withdrawal of seller earnings is subject to the following terms:
      </p>
      <ul>
        <li>Minimum withdrawal amount is R15.00</li>
        <li>Banking details must be verified and belong to the registered seller</li>
        <li>Withdrawal requests are reviewed and processed by our finance team</li>
        <li>Fraudulent or suspicious activity may result in withdrawal delays or account suspension</li>
        <li>Bank charges for transfers may apply and will be deducted from the withdrawal amount</li>
        <li>Sellers are responsible for declaring earnings for tax purposes</li>
        <li>Sellers with insufficient balance (below R15.00) cannot request withdrawals</li>
        <li>All withdrawal requests include seller verification and account summary for security purposes</li>
      </ul>

      <h2>10. Customer Delivery Responsibilities</h2>
      <p>
        As a customer purchasing from ShopMarket, you acknowledge and agree that:
      </p>
      <ul>
        <li>You must provide accurate delivery information in the required delivery form</li>
        <li>You are responsible for being available for delivery as arranged with the seller</li>
        <li>You must communicate directly with sellers regarding delivery preferences</li>
        <li>You accept that delivery costs and methods are determined by individual sellers</li>
        <li>You understand that ShopMarket does not provide delivery services</li>
        <li>You must resolve any delivery issues directly with the seller</li>
        <li>You accept the risk of loss or damage during delivery arranged with sellers</li>
      </ul>
    </div>
  );
};

export default PaymentTerms;
