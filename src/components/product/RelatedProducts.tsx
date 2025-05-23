
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (products.length === 0) return null;
  
  return (
    <div className="mt-16">
      <h2 className="mb-6 text-2xl font-bold">You may also like</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden bg-white">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={product.image || '/placeholder.svg'} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-medium truncate">{product.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-primary">R{product.price.toFixed(2)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link to={`/product/${product.id}`}>View</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
