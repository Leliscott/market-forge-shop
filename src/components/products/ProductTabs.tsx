
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGridView from './ProductGridView';
import ProductListView from './ProductListView';
import ProductEmptyState from './ProductEmptyState';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  category: string;
  sold: number;
}

interface ProductsByStatus {
  all: Product[];
  active: Product[];
  low_stock: Product[];
  out_of_stock: Product[];
}

interface ProductTabsProps {
  productsByStatus: ProductsByStatus;
  viewMode: 'grid' | 'list';
  onDeleteProduct: (id: string) => void;
  searchTerm: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ 
  productsByStatus, 
  viewMode, 
  onDeleteProduct,
  searchTerm 
}) => {
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All ({productsByStatus.all.length})</TabsTrigger>
        <TabsTrigger value="active">Active ({productsByStatus.active.length})</TabsTrigger>
        <TabsTrigger value="low_stock">Low Stock ({productsByStatus.low_stock.length})</TabsTrigger>
        <TabsTrigger value="out_of_stock">Out of Stock ({productsByStatus.out_of_stock.length})</TabsTrigger>
      </TabsList>
      
      {Object.entries(productsByStatus).map(([status, products]) => (
        <TabsContent key={status} value={status}>
          {products.length === 0 ? (
            <ProductEmptyState searchTerm={searchTerm} />
          ) : viewMode === 'grid' ? (
            <ProductGridView products={products} onDeleteProduct={onDeleteProduct} />
          ) : (
            <ProductListView products={products} onDeleteProduct={onDeleteProduct} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProductTabs;
