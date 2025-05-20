
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  bannerImage?: string;
  owner: string;
  createdAt: string;
}

interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

// Mock data - In a real app, this would come from an API
const mockStore: Store = {
  id: "store1",
  name: "Tech Haven",
  description: "Your one-stop shop for quality electronics and tech accessories at affordable prices.",
  logo: "/placeholder.svg",
  bannerImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  owner: "Jane Smith",
  createdAt: "2023-01-15",
};

const mockProducts: Product[] = [
  {
    id: "p1",
    storeId: "store1",
    name: "Wireless Earbuds",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    description: "High-quality wireless earbuds with noise cancellation",
    category: "Audio"
  },
  {
    id: "p2",
    storeId: "store1",
    name: "Smartphone Stand",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    description: "Adjustable stand for smartphones and tablets",
    category: "Accessories"
  },
  {
    id: "p3",
    storeId: "store1",
    name: "USB-C Cable Pack",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1612815292890-fd55c355d8ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Pack of 3 durable USB-C charging cables",
    category: "Cables"
  },
  {
    id: "p4",
    storeId: "store1",
    name: "Portable Power Bank",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "20000mAh fast-charging portable power bank",
    category: "Power"
  }
];

const StoreView: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch store and products from API
    // For now, use mock data with a small delay to simulate loading
    const timer = setTimeout(() => {
      setStore(mockStore);
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [storeId]);
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-xl">Loading store...</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!store) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl">Store not found</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Store Banner */}
        <div 
          className="w-full h-60 md:h-80 bg-gradient-to-r from-primary/30 to-primary-foreground/30 bg-cover bg-center"
          style={store.bannerImage ? { backgroundImage: `url(${store.bannerImage})` } : {}}
        >
          <div className="container h-full mx-auto px-4 flex items-end pb-16">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-white overflow-hidden">
                <img 
                  src={store.logo || '/placeholder.svg'} 
                  alt={store.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-white drop-shadow-md">
                <h1 className="text-3xl md:text-4xl font-bold">{store.name}</h1>
                <p className="mt-1 max-w-2xl">{store.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Store Content */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="products">
            <TabsList className="mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} storeView={true} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="about">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">About {store.name}</h2>
                <p className="mb-4">{store.description}</p>
                <p className="text-sm text-muted-foreground">
                  Store created on {new Date(store.createdAt).toLocaleDateString()}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoreView;
