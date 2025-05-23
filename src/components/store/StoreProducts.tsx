
import React from 'react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface StoreProductsProps {
  products: Product[];
}

const StoreProducts: React.FC<StoreProductsProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">This store has no products yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} storeView={true} />
      ))}
    </div>
  );
};

export default StoreProducts;
