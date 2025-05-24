
import React from 'react';

const MerchantVerification = () => {
  return (
    <div className="prose max-w-none">
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
    </div>
  );
};

export default MerchantVerification;
