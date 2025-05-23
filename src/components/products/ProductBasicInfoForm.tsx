
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

interface ProductBasicInfoFormProps {
  formData: ProductFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  categories: string[];
}

const ProductBasicInfoForm: React.FC<ProductBasicInfoFormProps> = ({
  formData,
  onInputChange,
  categories
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Enter product name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Describe your product"
          required
          className="min-h-[150px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (R) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={onInputChange}
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={formData.stock}
            onChange={onInputChange}
            placeholder="0"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="category">Category *</Label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductBasicInfoForm;
