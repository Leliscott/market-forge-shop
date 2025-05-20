
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import StoreCard from '@/components/StoreCard';

interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  bannerImage?: string;
  productCount: number;
}

// Mock data - In a real app, this would come from an API
const mockProducts: Product[] = [
  {
    id: 'p1',
    storeId: 'store1',
    name: 'Wireless Earbuds',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    description: 'High-quality wireless earbuds with noise cancellation',
    category: 'Audio'
  },
  {
    id: 'p2',
    storeId: 'store1',
    name: 'Smartphone Stand',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Adjustable stand for smartphones and tablets',
    category: 'Accessories'
  },
  {
    id: 'p3',
    storeId: 'store2',
    name: 'USB-C Cable Pack',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1612815292890-fd55c355d8ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    description: 'Pack of 3 durable USB-C charging cables',
    category: 'Cables'
  },
  {
    id: 'p4',
    storeId: 'store3',
    name: 'Portable Power Bank',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    description: '20000mAh fast-charging portable power bank',
    category: 'Power'
  },
  {
    id: 'p5',
    storeId: 'store1',
    name: 'Screen Protector',
    price: 12.99,
    image: '/placeholder.svg',
    description: 'Tempered glass screen protector for smartphones',
    category: 'Accessories'
  },
  {
    id: 'p6',
    storeId: 'store2',
    name: 'Wireless Charger',
    price: 29.99,
    image: '/placeholder.svg',
    description: 'Fast wireless charging pad compatible with all devices',
    category: 'Power'
  },
  {
    id: 'p7',
    storeId: 'store3',
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: '/placeholder.svg',
    description: 'Portable Bluetooth speaker with amazing sound quality',
    category: 'Audio'
  },
  {
    id: 'p8',
    storeId: 'store1',
    name: 'Laptop Sleeve',
    price: 19.99,
    image: '/placeholder.svg',
    description: 'Protective sleeve for laptops up to 15 inches',
    category: 'Accessories'
  }
];

const mockStores: Store[] = [
  {
    id: 'store1',
    name: 'Tech Haven',
    description: 'Your one-stop shop for quality electronics and tech accessories at affordable prices.',
    logo: '/placeholder.svg',
    bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    productCount: 12
  },
  {
    id: 'store2',
    name: 'Gadget Galaxy',
    description: 'Discover the latest gadgets and tech innovations for your modern lifestyle.',
    logo: '/placeholder.svg',
    productCount: 8
  },
  {
    id: 'store3',
    name: 'Digital Dreams',
    description: 'Premium digital products and accessories with exceptional customer service.',
    logo: '/placeholder.svg',
    bannerImage: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80',
    productCount: 15
  },
  {
    id: 'store4',
    name: 'Smart Solutions',
    description: 'Smart home devices and solutions to make your life easier and more connected.',
    logo: '/placeholder.svg',
    productCount: 6
  }
];

const categories = [
  'Audio',
  'Accessories',
  'Cables',
  'Power',
  'Smartphones',
  'Computers'
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'products' | 'stores'>('products');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  const clearFilters = () => {
    setPriceRange([0, 100]);
    setSelectedCategories([]);
  };
  
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(product.category);
      
    const matchesPrice = 
      product.price >= priceRange[0] && 
      product.price <= priceRange[1];
      
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  const filteredStores = mockStores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    store.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Marketplace</h1>
              <p className="text-muted-foreground">
                Discover amazing products from our sellers
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={view === 'products' ? 'default' : 'outline'}
                onClick={() => setView('products')}
              >
                Products
              </Button>
              <Button
                variant={view === 'stores' ? 'default' : 'outline'}
                onClick={() => setView('stores')}
              >
                Stores
              </Button>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={view === 'products' ? "Search products..." : "Search stores..."}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {view === 'products' && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="sm:w-auto">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Narrow down products by category and price
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 py-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Categories</h3>
                        {selectedCategories.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCategories([])}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryToggle(category)}
                            />
                            <label
                              htmlFor={`category-${category}`}
                              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Price Range</h3>
                        <span className="text-sm text-muted-foreground">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[0, 100]}
                        max={100}
                        step={1}
                        value={[priceRange[0], priceRange[1]]}
                        onValueChange={handlePriceChange}
                        className="py-4"
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={clearFilters}>
                        Reset Filters
                      </Button>
                      <Button>Apply</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
          
          {/* Active Filters */}
          {view === 'products' && (selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 100) && (
            <div className="mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                
                {priceRange[0] > 0 || priceRange[1] < 100 ? (
                  <div className="inline-flex items-center bg-muted text-sm px-2 py-1 rounded-md">
                    ${priceRange[0]} - ${priceRange[1]}
                    <button
                      className="ml-1"
                      onClick={() => setPriceRange([0, 100])}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : null}
                
                {selectedCategories.map(category => (
                  <div
                    key={category}
                    className="inline-flex items-center bg-muted text-sm px-2 py-1 rounded-md"
                  >
                    {category}
                    <button
                      className="ml-1"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-7 px-2"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
          
          {/* Results */}
          {view === 'products' ? (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-xl font-medium mb-2">No products found</h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <>
                  <p className="mb-6 text-muted-foreground">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {filteredStores.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-xl font-medium mb-2">No stores found</h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search criteria
                  </p>
                  <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
                </div>
              ) : (
                <>
                  <p className="mb-6 text-muted-foreground">
                    Showing {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {filteredStores.map(store => (
                      <StoreCard key={store.id} store={store} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
