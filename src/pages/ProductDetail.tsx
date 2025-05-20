
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Store, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppContact from '@/components/WhatsAppContact';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  store_id: string;
  stock?: number;
  features?: string[];
  rating?: number;
}

interface Store {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  phone?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (productError) throw productError;
        if (!productData) throw new Error('Product not found');
        
        // Add some defaults for backward compatibility
        const enhancedProduct = {
          ...productData,
          stock: 10, // Default stock value
          rating: 4.5, // Default rating
          features: [
            'High quality materials',
            'Fast shipping',
            'Secure payment processing',
            'Customer satisfaction guaranteed'
          ]
        };
        
        setProduct(enhancedProduct);
        
        // Fetch store details
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', productData.store_id)
          .single();
        
        if (storeError) throw storeError;
        
        setStore(storeData);
        
        // Fetch related products (same store, different product)
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', productData.store_id)
          .neq('id', id)
          .limit(4);
        
        if (relatedError) throw relatedError;
        
        setRelatedProducts(relatedData || []);
        
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      storeId: product.store_id,
      name: product.name,
      price: product.price,
      image: product.image
    }, quantity);
  };

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
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold">Product not found</h2>
            <p className="mt-2 text-muted-foreground">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate(-1)}
            >
              Go back
            </Button>
          </div>
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
            <div className="overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                className="object-contain w-full h-auto max-h-[500px]"
              />
            </div>
            
            {/* Product info */}
            <div className="space-y-6">
              <div>
                <Link 
                  to={`/store/${store.id}`}
                  className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <Store className="w-4 h-4 mr-1" />
                  {store.name}
                </Link>
                <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
                
                <div className="flex items-center mt-2 space-x-2">
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
              </div>
              
              <div className="text-3xl font-bold text-primary">
                R{product.price.toFixed(2)}
              </div>
              
              {/* Stock status */}
              <div className="flex items-center space-x-2">
                {(product.stock || 0) > 0 ? (
                  <>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      In Stock
                    </Badge>
                    <span className="text-sm text-muted-foreground">{product.stock} available</span>
                  </>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              {/* Quantity and add to cart */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none"
                    onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none"
                    onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock || 10))}
                    disabled={quantity >= (product.stock || 10)}
                  >
                    +
                  </Button>
                </div>
                
                <Button
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={(product.stock || 0) === 0}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
              
              {/* Contact seller via WhatsApp */}
              <div className="pt-4">
                <WhatsAppContact 
                  phoneNumber={store.phone || "0610000000"} 
                  productName={product.name} 
                />
              </div>
              
              <Separator />
              
              {/* Product tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4">
                  <p className="text-muted-foreground">{product.description}</p>
                </TabsContent>
                
                <TabsContent value="features" className="mt-4">
                  <ul className="space-y-2">
                    {product.features?.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold">You may also like</h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map(product => (
                  <div key={product.id} className="border rounded-lg overflow-hidden bg-white">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={product.image || '/placeholder.svg'} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-primary">R{product.price.toFixed(2)}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/product/${product.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
