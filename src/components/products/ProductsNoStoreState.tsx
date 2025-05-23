
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductsNoStoreState: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">No Store Found</h1>
          <p className="mb-6 text-muted-foreground">You need to create a store before managing products.</p>
          <Button asChild>
            <Link to="/create-store">Create Store</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsNoStoreState;
