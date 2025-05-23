
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductsLoadingState: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsLoadingState;
