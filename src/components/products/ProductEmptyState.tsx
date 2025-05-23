
import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductEmptyStateProps {
  searchTerm?: string;
}

const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({ searchTerm }) => {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchTerm ? 'No Products Found' : 'No Products Added Yet'}
        </h3>
        <p className="text-gray-600 mb-4">
          {searchTerm 
            ? `No products match "${searchTerm}". Try adjusting your search.`
            : 'Start by adding your first product to begin selling.'
          }
        </p>
        {!searchTerm && (
          <Button asChild>
            <Link to="/seller/products/edit/new">
              <Plus className="mr-2 h-4 w-4" />
              Add First Product
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductEmptyState;
