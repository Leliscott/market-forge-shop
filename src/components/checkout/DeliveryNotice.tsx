
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, Phone, AlertTriangle } from 'lucide-react';

const DeliveryNotice = () => {
  return (
    <div className="space-y-4">
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="space-y-2">
            <p className="font-semibold">Important Delivery Information:</p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>ShopMarket does NOT handle deliveries - this is the seller's responsibility</li>
              <li>You will receive seller contact details after payment to arrange delivery</li>
              <li>You must complete a delivery form after payment</li>
              <li>All delivery arrangements are made directly with the seller</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">After Payment</h3>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Receive seller contact details</li>
            <li>• Complete delivery information form</li>
            <li>• Coordinate delivery directly with seller</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4 bg-green-50">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Seller Contact</h3>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Direct communication with seller</li>
            <li>• Arrange delivery time & location</li>
            <li>• Discuss delivery preferences</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeliveryNotice;
