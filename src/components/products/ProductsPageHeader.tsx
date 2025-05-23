
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductsPageHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Your Products</h1>
        <p className="text-muted-foreground">
          Manage your product inventory
        </p>
      </div>
      
      <Button asChild>
        <Link to="/seller/products/edit/new">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </Button>
    </div>
  );
};

export default ProductsPageHeader;
