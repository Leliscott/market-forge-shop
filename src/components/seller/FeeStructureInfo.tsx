
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/constants';

const MINIMUM_WITHDRAWAL = 15;

const FeeStructureInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Structure Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">VAT (15%)</h3>
            <p className="text-blue-700">Automatically included in product prices. VAT is deducted from gross sales.</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-medium text-orange-800 mb-2">Marketplace Fee (9%)</h3>
            <p className="text-orange-700">Applied to net amount (after VAT). This covers platform services.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Your Profit</h3>
            <p className="text-green-700">Net amount minus marketplace fee. Available for withdrawal (min {formatCurrency(MINIMUM_WITHDRAWAL)}).</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeStructureInfo;
