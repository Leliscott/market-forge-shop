
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Store, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { getProductById, getStoreById, getRelatedProducts } from '@/utils/mockData';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  
  const product = id ? getProductById(id) : null;
  const store = product ? getStoreById(product.storeId) : null;
  const relatedProducts = id ? getRelatedProducts(id) : [];
  
  if (!product || !store) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold">Product not found</h2>
            <p className="mt-2 text-muted-foreground">
              The product you're looking for doesn't exist or has been removed.
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
  
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      storeId: product.storeId,
      name: product.name,
      price: product.price,
      image: product.image
    }, quantity);
  };

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
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
              </div>
              
              <div className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </div>
              
              {/* Stock status */}
              <div className="flex items-center space-x-2">
                {product.stock > 0 ? (
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
                    onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
                
                <Button
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
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
                  <ProductCard key={product.id} product={product} />
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
