
import React, { useState } from 'react';
import ProductFilters from '@/components/products/ProductFilters';
import ProductTabs from '@/components/products/ProductTabs';
import ProductDeleteDialog from '@/components/products/ProductDeleteDialog';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  category: string;
  sold: number;
  stock_quantity: number;
  created_at: string;
}

interface ProductsByStatus {
  all: Product[];
  active: Product[];
  low_stock: Product[];
  out_of_stock: Product[];
}

interface ProductsContentProps {
  products: Product[];
  isLoading: boolean;
  onDeleteProduct: (id: string) => void;
}

const ProductsContent: React.FC<ProductsContentProps> = ({ 
  products, 
  isLoading, 
  onDeleteProduct 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const productsByStatus: ProductsByStatus = {
    all: filteredProducts,
    active: filteredProducts.filter(p => p.status === 'active'),
    low_stock: filteredProducts.filter(p => p.status === 'low_stock'),
    out_of_stock: filteredProducts.filter(p => p.status === 'out_of_stock'),
  };

  const handleDeleteProduct = (productId: string) => {
    setConfirmDelete(productId);
  };
  
  const confirmDeleteProduct = async () => {
    if (!confirmDelete) return;
    
    await onDeleteProduct(confirmDelete);
    setConfirmDelete(null);
  };

  return (
    <>
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <ProductTabs
        productsByStatus={productsByStatus}
        viewMode={viewMode}
        onDeleteProduct={handleDeleteProduct}
        searchTerm={searchTerm}
        isLoading={isLoading}
      />

      <ProductDeleteDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteProduct}
      />
    </>
  );
};

export default ProductsContent;
