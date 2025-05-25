
import React, { useState } from 'react';
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
import { useMarketplaceData } from '@/hooks/useMarketplaceData';

const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Books',
  'Automotive',
  'Jewelry',
  'Food & Beverages',
  'Office Supplies',
  'Health & Wellness',
  'Art & Crafts',
  'Pet Supplies',
  'Music & Instruments',
  'Other'
];

const Marketplace = () => {
  const { products, stores, isLoading, error } = useMarketplaceData();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'products' | 'stores'>('products');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
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
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
  };
  
  const filteredProducts = products.filter(product => {
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
  
  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    store.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
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
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-8 mx-auto">
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">Error loading marketplace</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
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
                        defaultValue={[0, 1000]}
                        max={1000}
                        step={10}
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
          {view === 'products' && (selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
            <div className="mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                
                {priceRange[0] > 0 || priceRange[1] < 1000 ? (
                  <div className="inline-flex items-center bg-muted text-sm px-2 py-1 rounded-md">
                    ${priceRange[0]} - ${priceRange[1]}
                    <button
                      className="ml-1"
                      onClick={() => setPriceRange([0, 1000])}
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
                  <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
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
