
import React from 'react';
import { Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductDetailsProps {
  description: string;
  features?: string[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ description, features = [] }) => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="mt-4">
        <p className="text-muted-foreground">{description}</p>
      </TabsContent>
      
      <TabsContent value="features" className="mt-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
};

export default ProductDetails;
