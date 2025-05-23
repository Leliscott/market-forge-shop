
import React from 'react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

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
  isOwnStore?: boolean;
  storeId?: string;
}

const StoreProducts: React.FC<StoreProductsProps> = ({ products, isOwnStore = false, storeId }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isOwnStore ? 'No Products Added Yet' : 'This store has no products yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {isOwnStore 
              ? 'Start by adding your first product to begin selling.'
              : 'Check back later for new products from this store.'
            }
          </p>
          {isOwnStore && (
            <Button asChild>
              <Link to="/seller/products/edit/new">
                Add First Product
              </Link>
            </Button>
          )}
        </div>
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
