
import React from 'react';

const ShippingForm = () => {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Street Address
        </label>
        <input
          id="address"
          type="text"
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City
          </label>
          <input
            id="city"
            type="text"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium mb-1">
            State/Province
          </label>
          <input
            id="state"
            type="text"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="zip" className="block text-sm font-medium mb-1">
            ZIP / Postal
          </label>
          <input
            id="zip"
            type="text"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </form>
  );
};

export default ShippingForm;
