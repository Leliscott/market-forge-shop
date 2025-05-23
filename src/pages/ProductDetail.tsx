
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Import refactored components
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductActions from '@/components/product/ProductActions';
import ProductDetails from '@/components/product/ProductDetails';
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductError from '@/components/product/ProductError';
import { useProduct } from '@/hooks/useProduct';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, error, product, store, relatedProducts } = useProduct(id);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Show error state
  if (error || !product || !store) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <ProductError error={error} />
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
          
          {/* Product details */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Product image */}
            <ProductGallery image={product.image} name={product.name} />
            
            {/* Product info */}
            <div className="space-y-6">
              <ProductInfo 
                name={product.name}
                price={product.price}
                stock={product.stock}
                rating={product.rating}
                store={{
                  id: store.id,
                  name: store.name
                }}
              />
              
              <ProductActions product={product} store={store} />
              
              <ProductDetails 
                description={product.description}
                features={product.features}
              />
            </div>
          </div>
          
          {/* Related products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
