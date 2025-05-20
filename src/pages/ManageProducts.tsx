
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Edit, Trash2, Search, Plus, MoreHorizontal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Earbuds',
    price: 59.99,
    stock: 42,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    category: 'Electronics',
    sold: 153,
  },
  {
    id: '2',
    name: 'Phone Stand',
    price: 24.99,
    stock: 78,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Accessories',
    sold: 87,
  },
  {
    id: '3',
    name: 'USB-C Cable Pack',
    price: 15.99,
    stock: 156,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1612815292890-fd55c355d8ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Cables',
    sold: 65,
  },
  {
    id: '4',
    name: 'Portable Power Bank',
    price: 49.99,
    stock: 32,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Power',
    sold: 45,
  },
  {
    id: '5',
    name: 'Screen Protector',
    price: 12.99,
    stock: 0,
    status: 'out_of_stock',
    image: '/placeholder.svg',
    category: 'Accessories',
    sold: 32,
  },
  {
    id: '6',
    name: 'Wireless Charger',
    price: 29.99,
    stock: 5,
    status: 'low_stock',
    image: '/placeholder.svg',
    category: 'Power',
    sold: 28,
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    price: 79.99,
    stock: 18,
    status: 'active',
    image: '/placeholder.svg',
    category: 'Audio',
    sold: 22,
  },
  {
    id: '8',
    name: 'Laptop Sleeve',
    price: 19.99,
    stock: 25,
    status: 'active',
    image: '/placeholder.svg',
    category: 'Accessories',
    sold: 17,
  },
];

const ManageProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const productsByStatus = {
    all: filteredProducts,
    active: filteredProducts.filter(p => p.status === 'active'),
    low_stock: filteredProducts.filter(p => p.status === 'low_stock'),
    out_of_stock: filteredProducts.filter(p => p.status === 'out_of_stock'),
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Your Products</h1>
              <p className="text-muted-foreground">
                Manage your product inventory
              </p>
            </div>
            
            <Button asChild>
              <Link to="/seller/products/edit/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden md:inline">Filter</span>
              </Button>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="bestselling">Best Selling</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="rounded-none h-10 w-10"
                  onClick={() => setViewMode('grid')}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2H2V6H6V2ZM2 1C1.44772 1 1 1.44772 1 2V6C1 6.55228 1.44772 7 2 7H6C6.55228 7 7 6.55228 7 6V2C7 1.44772 6.55228 1 6 1H2Z" fill="currentColor" />
                    <path d="M13 2H9V6H13V2ZM9 1C8.44772 1 8 1.44772 8 2V6C8 6.55228 8.44772 7 9 7H13C13.5523 7 14 6.55228 14 6V2C14 1.44772 13.5523 1 13 1H9Z" fill="currentColor" />
                    <path d="M6 9H2V13H6V9ZM2 8C1.44772 8 1 8.44772 1 9V13C1 13.5523 1.44772 14 2 14H6C6.55228 14 7 13.5523 7 13V9C7 8.44772 6.55228 8 6 8H2Z" fill="currentColor" />
                    <path d="M13 9H9V13H13V9ZM9 8C8.44772 8 8 8.44772 8 9V13C8 13.5523 8.44772 14 9 14H13C13.5523 14 14 13.5523 14 13V9C14 8.44772 13.5523 8 13 8H9Z" fill="currentColor" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="rounded-none h-10 w-10"
                  onClick={() => setViewMode('list')}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 5.25C1.91421 5.25 2.25 4.91421 2.25 4.5C2.25 4.08579 1.91421 3.75 1.5 3.75C1.08579 3.75 0.75 4.08579 0.75 4.5C0.75 4.91421 1.08579 5.25 1.5 5.25ZM4 4.5C4 4.22386 4.22386 4 4.5 4H13.5C13.7761 4 14 4.22386 14 4.5C14 4.77614 13.7761 5 13.5 5H4.5C4.22386 5 4 4.77614 4 4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H13.5C13.7761 11 14 10.7761 14 10.5C14 10.2239 13.7761 10 13.5 10H4.5ZM2.25 7.5C2.25 7.91421 1.91421 8.25 1.5 8.25C1.08579 8.25 0.75 7.91421 0.75 7.5C0.75 7.08579 1.08579 6.75 1.5 6.75C1.91421 6.75 2.25 7.08579 2.25 7.5ZM1.5 11.25C1.91421 11.25 2.25 10.9142 2.25 10.5C2.25 10.0858 1.91421 9.75 1.5 9.75C1.08579 9.75 0.75 10.0858 0.75 10.5C0.75 10.9142 1.08579 11.25 1.5 11.25Z" fill="currentColor" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({productsByStatus.all.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({productsByStatus.active.length})</TabsTrigger>
              <TabsTrigger value="low_stock">Low Stock ({productsByStatus.low_stock.length})</TabsTrigger>
              <TabsTrigger value="out_of_stock">Out of Stock ({productsByStatus.out_of_stock.length})</TabsTrigger>
            </TabsList>
            
            {Object.entries(productsByStatus).map(([status, products]) => (
              <TabsContent key={status} value={status}>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="relative aspect-square">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.status === 'out_of_stock' && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium">
                              Out of Stock
                            </div>
                          )}
                          {product.status === 'low_stock' && (
                            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                              Low Stock: {product.stock}
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link to={`/seller/products/edit/${product.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to={`/product/${product.id}`}>
                                    <Package className="mr-2 h-4 w-4" /> View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onSelect={() => setConfirmDelete(product.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="p-4">
                          <Link to={`/seller/products/edit/${product.id}`}>
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                              <p className="font-semibold">${product.price.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {product.sold} sold • {product.category}
                            </p>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50 border-b">
                          <th className="text-left p-3">Product</th>
                          <th className="text-left p-3">Category</th>
                          <th className="text-left p-3">Price</th>
                          <th className="text-left p-3">Stock</th>
                          <th className="text-left p-3">Sold</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => (
                          <tr key={product.id} className={index !== products.length - 1 ? 'border-b' : ''}>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="p-3">{product.category}</td>
                            <td className="p-3">${product.price.toFixed(2)}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {product.status === 'out_of_stock' ? (
                                  <span className="text-red-500">Out of stock</span>
                                ) : product.status === 'low_stock' ? (
                                  <span className="text-yellow-500">Low: {product.stock}</span>
                                ) : (
                                  <span>{product.stock}</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3">{product.sold}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/seller/products/edit/${product.id}`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setConfirmDelete(product.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setConfirmDelete(null)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProducts;
