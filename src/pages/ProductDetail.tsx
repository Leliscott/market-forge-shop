
import React, { useEffect } from 'react';
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
import { formatCurrency } from '@/utils/constants';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, error, product, store, relatedProducts } = useProduct(id);
  
  // Update meta tags when product data is loaded
  useEffect(() => {
    if (product && store) {
      // Update page title
      document.title = `${product.name} - ${store.name} | Market Forge Shop`;
      
      // Update or create meta tags for Open Graph
      const updateMetaTag = (property: string, content: string) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      };

      const updateMetaName = (name: string, content: string) => {
        let metaTag = document.querySelector(`meta[name="${name}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', name);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
      };

      // Set Open Graph tags
      updateMetaTag('og:title', `${product.name} - ${formatCurrency(product.price)}`);
      updateMetaTag('og:description', product.description || `Check out this amazing product from ${store.name}`);
      updateMetaTag('og:image', product.image || '/placeholder.svg');
      updateMetaTag('og:url', window.location.href);
      updateMetaTag('og:type', 'product');
      updateMetaTag('og:site_name', 'Market Forge Shop');

      // Set Twitter Card tags
      updateMetaName('twitter:card', 'summary_large_image');
      updateMetaName('twitter:title', `${product.name} - ${formatCurrency(product.price)}`);
      updateMetaName('twitter:description', product.description || `Check out this amazing product from ${store.name}`);
      updateMetaName('twitter:image', product.image || '/placeholder.svg');

      // Set additional meta tags
      updateMetaName('description', product.description || `${product.name} available at ${store.name}. Price: ${formatCurrency(product.price)}`);
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Market Forge Shop';
    };
  }, [product, store]);
  
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
