
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ProductBasicInfoForm from './ProductBasicInfoForm';
import ProductMediaForm from './ProductMediaForm';
import ProductDetailsForm from './ProductDetailsForm';

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

interface ProductFormTabsProps {
  formData: ProductFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  images: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  categories: string[];
}

const ProductFormTabs: React.FC<ProductFormTabsProps> = ({
  formData,
  onInputChange,
  images,
  onImageUpload,
  onRemoveImage,
  categories
}) => {
  return (
    <Tabs defaultValue="basic" className="mb-8">
      <TabsList>
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      
      <Card className="mt-4 border-t-0 rounded-tl-none">
        <CardContent className="p-6">
          <TabsContent value="basic">
            <ProductBasicInfoForm
              formData={formData}
              onInputChange={onInputChange}
              categories={categories}
            />
          </TabsContent>
          
          <TabsContent value="media">
            <ProductMediaForm
              images={images}
              onImageUpload={onImageUpload}
              onRemoveImage={onRemoveImage}
            />
          </TabsContent>
          
          <TabsContent value="details">
            <ProductDetailsForm
              formData={formData}
              onInputChange={onInputChange}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default ProductFormTabs;
