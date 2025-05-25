
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  store_id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

interface NewProductsSectionProps {
  products: Product[];
  loading: boolean;
}

const NewProductsSection: React.FC<NewProductsSectionProps> = ({ products, loading }) => {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">New Products</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/marketplace" className="flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id,
                  storeId: product.store_id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  description: product.description
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Products Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to add products to our marketplace!
              </p>
              <Button asChild>
                <Link to="/seller/dashboard">
                  Start Selling
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewProductsSection;
