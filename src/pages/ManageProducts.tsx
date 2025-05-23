
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsPageHeader from '@/components/products/ProductsPageHeader';
import ProductsContent from '@/components/products/ProductsContent';
import ProductsLoadingState from '@/components/products/ProductsLoadingState';
import ProductsNoStoreState from '@/components/products/ProductsNoStoreState';
import { useProductManagement } from '@/hooks/useProductManagement';
import { useAuth } from '@/context/AuthContext';

const ManageProducts: React.FC = () => {
  const { userStore } = useAuth();
  const { products, isLoading, error, deleteProduct } = useProductManagement();
  
  if (isLoading) {
    return <ProductsLoadingState />;
  }
  
  if (error && !userStore) {
    return <ProductsNoStoreState />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <ProductsPageHeader />
          <ProductsContent
            products={products}
            isLoading={isLoading}
            onDeleteProduct={deleteProduct}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManageProducts;
