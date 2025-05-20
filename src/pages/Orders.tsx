
import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Filter, ArrowDown, ArrowUp, Check, 
  Truck, Clock, AlertTriangle, PackageCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock data
const mockOrders = [
  {
    id: 'ORD001',
    customer: 'John Doe',
    email: 'john.doe@example.com',
    date: '2023-07-15',
    amount: 124.99,
    status: 'delivered',
    items: [
      { id: 'p1', name: 'Wireless Earbuds', price: 59.99, quantity: 1, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7' },
      { id: 'p2', name: 'Phone Stand', price: 24.99, quantity: 2, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07' },
      { id: 'p3', name: 'USB-C Cable', price: 15.99, quantity: 1, image: 'https://images.unsplash.com/photo-1612815292890-fd55c355d8ce' }
    ],
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    payment: 'Credit Card (**** 1234)'
  },
  {
    id: 'ORD002',
    customer: 'Alice Smith',
    email: 'alice.smith@example.com',
    date: '2023-07-14',
    amount: 75.50,
    status: 'processing',
    items: [
      { id: 'p4', name: 'Portable Power Bank', price: 49.99, quantity: 1, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5' },
      { id: 'p3', name: 'USB-C Cable', price: 15.99, quantity: 1, image: 'https://images.unsplash.com/photo-1612815292890-fd55c355d8ce' },
      { id: 'p5', name: 'Screen Protector', price: 9.99, quantity: 1, image: '/placeholder.svg' }
    ],
    address: {
      street: '456 Elm St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '67890',
      country: 'USA'
    },
    payment: 'PayPal'
  },
  {
    id: 'ORD003',
    customer: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    date: '2023-07-13',
    amount: 199.99,
    status: 'delivered',
    items: [
      { id: 'p7', name: 'Bluetooth Speaker', price: 79.99, quantity: 1, image: '/placeholder.svg' },
      { id: 'p1', name: 'Wireless Earbuds', price: 59.99, quantity: 2, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7' }
    ],
    address: {
      street: '789 Oak St',
      city: 'Riverside',
      state: 'CA',
      zipCode: '54321',
      country: 'USA'
    },
    payment: 'Credit Card (**** 5678)'
  },
  {
    id: 'ORD004',
    customer: 'Emily Brown',
    email: 'emily.brown@example.com',
    date: '2023-07-12',
    amount: 45.25,
    status: 'delivered',
    items: [
      { id: 'p2', name: 'Phone Stand', price: 24.99, quantity: 1, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07' },
      { id: 'p5', name: 'Screen Protector', price: 9.99, quantity: 2, image: '/placeholder.svg' }
    ],
    address: {
      street: '321 Pine St',
      city: 'Lakeside',
      state: 'WA',
      zipCode: '09876',
      country: 'USA'
    },
    payment: 'Apple Pay'
  },
  {
    id: 'ORD005',
    customer: 'William Davis',
    email: 'william.davis@example.com',
    date: '2023-07-11',
    amount: 129.98,
    status: 'cancelled',
    items: [
      { id: 'p7', name: 'Bluetooth Speaker', price: 79.99, quantity: 1, image: '/placeholder.svg' },
      { id: 'p8', name: 'Laptop Sleeve', price: 19.99, quantity: 2, image: '/placeholder.svg' },
      { id: 'p5', name: 'Screen Protector', price: 9.99, quantity: 1, image: '/placeholder.svg' }
    ],
    address: {
      street: '654 Cedar St',
      city: 'Mountainview',
      state: 'CO',
      zipCode: '45678',
      country: 'USA'
    },
    payment: 'Credit Card (**** 9012)'
  }
];

const statusColorMap: Record<string, { bgColor: string, textColor: string, icon: React.ReactNode }> = {
  'processing': {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: <Clock className="w-4 h-4 mr-1" />
  },
  'shipped': {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: <Truck className="w-4 h-4 mr-1" />
  },
  'delivered': {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: <Check className="w-4 h-4 mr-1" />
  },
  'cancelled': {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: <AlertTriangle className="w-4 h-4 mr-1" />
  }
};

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockOrders)[0] | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const filteredOrders = mockOrders.filter(order => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(lowerSearchTerm) ||
      order.customer.toLowerCase().includes(lowerSearchTerm) ||
      order.email.toLowerCase().includes(lowerSearchTerm);
    
    if (selectedTab === 'all') return matchesSearch;
    return matchesSearch && order.status === selectedTab;
  });
  
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let comparison = 0;
    switch (sortColumn) {
      case 'id':
        comparison = a.id.localeCompare(b.id);
        break;
      case 'customer':
        comparison = a.customer.localeCompare(b.customer);
        break;
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Count orders by status
  const orderCounts = {
    all: mockOrders.length,
    processing: mockOrders.filter(o => o.status === 'processing').length,
    shipped: mockOrders.filter(o => o.status === 'shipped').length,
    delivered: mockOrders.filter(o => o.status === 'delivered').length,
    cancelled: mockOrders.filter(o => o.status === 'cancelled').length,
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Orders</h1>
              <p className="text-muted-foreground">
                Manage and track your customer orders
              </p>
            </div>
            
            <Button variant="outline">Export Orders</Button>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders by ID, customer name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All ({orderCounts.all})</TabsTrigger>
              <TabsTrigger value="processing">Processing ({orderCounts.processing})</TabsTrigger>
              <TabsTrigger value="shipped">Shipped ({orderCounts.shipped})</TabsTrigger>
              <TabsTrigger value="delivered">Delivered ({orderCounts.delivered})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({orderCounts.cancelled})</TabsTrigger>
            </TabsList>
            
            <Card className="mt-4">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th 
                          className="text-left p-4 cursor-pointer hover:bg-muted/70"
                          onClick={() => handleSort('id')}
                        >
                          <div className="flex items-center">
                            Order ID
                            {sortColumn === 'id' && (
                              sortDirection === 'asc' 
                                ? <ArrowUp className="ml-1 w-4 h-4" />
                                : <ArrowDown className="ml-1 w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 cursor-pointer hover:bg-muted/70"
                          onClick={() => handleSort('customer')}
                        >
                          <div className="flex items-center">
                            Customer
                            {sortColumn === 'customer' && (
                              sortDirection === 'asc' 
                                ? <ArrowUp className="ml-1 w-4 h-4" />
                                : <ArrowDown className="ml-1 w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 cursor-pointer hover:bg-muted/70"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center">
                            Date
                            {sortColumn === 'date' && (
                              sortDirection === 'asc' 
                                ? <ArrowUp className="ml-1 w-4 h-4" />
                                : <ArrowDown className="ml-1 w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 cursor-pointer hover:bg-muted/70"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center">
                            Amount
                            {sortColumn === 'amount' && (
                              sortDirection === 'asc' 
                                ? <ArrowUp className="ml-1 w-4 h-4" />
                                : <ArrowDown className="ml-1 w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 cursor-pointer hover:bg-muted/70"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center">
                            Status
                            {sortColumn === 'status' && (
                              sortDirection === 'asc' 
                                ? <ArrowUp className="ml-1 w-4 h-4" />
                                : <ArrowDown className="ml-1 w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedOrders.map((order, index) => (
                        <tr key={order.id} className={index !== sortedOrders.length - 1 ? 'border-b' : ''}>
                          <td className="p-4">{order.id}</td>
                          <td className="p-4">
                            <div>
                              <div>{order.customer}</div>
                              <div className="text-xs text-muted-foreground">{order.email}</div>
                            </div>
                          </td>
                          <td className="p-4">{order.date}</td>
                          <td className="p-4">${order.amount.toFixed(2)}</td>
                          <td className="p-4">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              statusColorMap[order.status]?.bgColor || 'bg-gray-100'
                            } ${
                              statusColorMap[order.status]?.textColor || 'text-gray-800'
                            }`}>
                              {statusColorMap[order.status]?.icon}
                              <span className="capitalize">{order.status}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      
                      {sortedOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center">
                            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-lg font-medium">No orders found</p>
                            <p className="text-muted-foreground">
                              {searchTerm 
                                ? "Try adjusting your search or filters"
                                : "You don't have any orders matching this status"
                              }
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      
      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">Order Details</DialogTitle>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  statusColorMap[selectedOrder.status]?.bgColor || 'bg-gray-100'
                } ${
                  statusColorMap[selectedOrder.status]?.textColor || 'text-gray-800'
                }`}>
                  {statusColorMap[selectedOrder.status]?.icon}
                  <span className="capitalize">{selectedOrder.status}</span>
                </div>
              </div>
              <DialogDescription>
                Order ID: {selectedOrder.id} • Placed on {selectedOrder.date}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Information</h3>
                  <div className="border rounded-md p-4">
                    <p className="font-medium">{selectedOrder.customer}</p>
                    <p>{selectedOrder.address.street}</p>
                    <p>
                      {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipCode}
                    </p>
                    <p>{selectedOrder.address.country}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Payment Information</h3>
                  <div className="border rounded-md p-4">
                    <p>Payment Method: {selectedOrder.payment}</p>
                    <p>Total Paid: ${selectedOrder.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="border rounded-md divide-y">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4">
                      <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span>${selectedOrder.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-medium">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-medium">Tax</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between mt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>${selectedOrder.amount.toFixed(2)}</span>
                </div>
              </div>
              
              {selectedOrder.status === 'processing' && (
                <div className="border-t pt-4 flex justify-end gap-2">
                  <Button variant="outline">Cancel Order</Button>
                  <Button>
                    <Truck className="mr-2 h-4 w-4" />
                    Mark as Shipped
                  </Button>
                </div>
              )}
              
              {selectedOrder.status === 'shipped' && (
                <div className="border-t pt-4 flex justify-end">
                  <Button>
                    <PackageCheck className="mr-2 h-4 w-4" />
                    Mark as Delivered
                  </Button>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Orders;
