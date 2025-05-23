
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductFormData {
  name: string;
  price: string;
  stock: string;
  description: string;
  category: string;
  sku: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
}

interface ProductDetailsFormProps {
  formData: ProductFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
        <Input
          id="sku"
          name="sku"
          value={formData.sku}
          onChange={onInputChange}
          placeholder="e.g. PROD-001"
        />
      </div>
      
      <div>
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          step="0.01"
          min="0"
          value={formData.weight}
          onChange={onInputChange}
          placeholder="0.00"
        />
      </div>
      
      <div>
        <Label>Dimensions (cm)</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div>
            <Label htmlFor="dimensions.length" className="text-sm">Length</Label>
            <Input
              id="dimensions.length"
              name="dimensions.length"
              type="number"
              min="0"
              step="0.1"
              value={formData.dimensions.length}
              onChange={onInputChange}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="dimensions.width" className="text-sm">Width</Label>
            <Input
              id="dimensions.width"
              name="dimensions.width"
              type="number"
              min="0"
              step="0.1"
              value={formData.dimensions.width}
              onChange={onInputChange}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="dimensions.height" className="text-sm">Height</Label>
            <Input
              id="dimensions.height"
              name="dimensions.height"
              type="number"
              min="0"
              step="0.1"
              value={formData.dimensions.height}
              onChange={onInputChange}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsForm;
