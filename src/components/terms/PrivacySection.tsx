
import React from 'react';

const PrivacySection = () => {
  return (
    <div className="prose max-w-none">
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
    </div>
  );
};

export default PrivacySection;
