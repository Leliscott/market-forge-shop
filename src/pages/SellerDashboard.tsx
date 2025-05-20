
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ShoppingBag, PackageCheck, DollarSign, Users, ArrowUpRight, 
  ArrowDownRight, Store, Package, Plus, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock data
const salesData = [
  { name: 'Jan', revenue: 1200 },
  { name: 'Feb', revenue: 1900 },
  { name: 'Mar', revenue: 1500 },
  { name: 'Apr', revenue: 2400 },
  { name: 'May', revenue: 1800 },
  { name: 'Jun', revenue: 2800 },
  { name: 'Jul', revenue: 3200 },
];

const productPerformanceData = [
  { name: 'Wireless Earbuds', sales: 153 },
  { name: 'Phone Stand', sales: 87 },
  { name: 'USB-C Cable', sales: 65 },
  { name: 'Power Bank', sales: 45 },
  { name: 'Screen Protector', sales: 32 },
];

const orderStatusData = [
  { name: 'Delivered', value: 85 },
  { name: 'Processing', value: 10 },
  { name: 'Cancelled', value: 5 },
];

const COLORS = ['#34D399', '#60A5FA', '#F87171'];

const mockStore = {
  id: 'store1',
  name: 'Tech Haven',
  logo: '/placeholder.svg',
  productCount: 12
};

const recentOrders = [
  { id: 'ORD001', customer: 'John Doe', date: '2023-07-15', amount: 124.99, status: 'delivered' },
  { id: 'ORD002', customer: 'Alice Smith', date: '2023-07-14', amount: 75.50, status: 'processing' },
  { id: 'ORD003', customer: 'Robert Johnson', date: '2023-07-13', amount: 199.99, status: 'delivered' },
  { id: 'ORD004', customer: 'Emily Brown', date: '2023-07-12', amount: 45.25, status: 'delivered' },
];

const SellerDashboard: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Seller Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your store, products, and orders
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/seller/create-store">
                  <Store className="mr-2 h-4 w-4" />
                  {mockStore ? 'Manage Store' : 'Create Store'}
                </Link>
              </Button>
              
              {mockStore && (
                <Button asChild>
                  <Link to="/seller/products/edit/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Link>
                </Button>
              )}
            </div>
          </div>
          
          {!mockStore ? (
            <Card className="mb-8">
              <CardContent className="pt-6 text-center">
                <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Create Your Store</h2>
                <p className="mb-6 text-muted-foreground">
                  Set up your store to start selling products on our marketplace.
                </p>
                <Button asChild>
                  <Link to="/seller/create-store">
                    <Store className="mr-2 h-4 w-4" />
                    Create Store
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="overview">
              <TabsList className="mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                          <p className="text-2xl font-bold">$12,560</p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex items-center mt-3 text-sm">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">+12.5%</span>
                        <span className="text-muted-foreground ml-2">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Orders</p>
                          <p className="text-2xl font-bold">154</p>
                        </div>
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <ShoppingBag className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                      <div className="flex items-center mt-3 text-sm">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">+8.2%</span>
                        <span className="text-muted-foreground ml-2">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Products</p>
                          <p className="text-2xl font-bold">{mockStore.productCount}</p>
                        </div>
                        <div className="bg-yellow-500/10 p-2 rounded-full">
                          <Package className="h-6 w-6 text-yellow-500" />
                        </div>
                      </div>
                      <div className="flex items-center mt-3 text-sm">
                        <Button variant="outline" size="sm" asChild className="h-7">
                          <Link to="/seller/products">
                            View All
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Customers</p>
                          <p className="text-2xl font-bold">1,254</p>
                        </div>
                        <div className="bg-purple-500/10 p-2 rounded-full">
                          <Users className="h-6 w-6 text-purple-500" />
                        </div>
                      </div>
                      <div className="flex items-center mt-3 text-sm">
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-500 font-medium">-2.3%</span>
                        <span className="text-muted-foreground ml-2">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Overview</CardTitle>
                      <CardDescription>Monthly revenue for the current year</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Performance</CardTitle>
                      <CardDescription>Top-selling products by units sold</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={productPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="sales" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest orders and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-muted-foreground">
                            <th className="p-3 font-medium">Order ID</th>
                            <th className="p-3 font-medium">Customer</th>
                            <th className="p-3 font-medium">Date</th>
                            <th className="p-3 font-medium">Amount</th>
                            <th className="p-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-t">
                              <td className="p-3">{order.id}</td>
                              <td className="p-3">{order.customer}</td>
                              <td className="p-3">{order.date}</td>
                              <td className="p-3">${order.amount.toFixed(2)}</td>
                              <td className="p-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : order.status === 'processing' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/seller/orders">
                        View All Orders
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Orders</h2>
                  <div className="flex gap-2">
                    <Button variant="outline">Filter</Button>
                    <Button variant="outline">Export</Button>
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-muted-foreground border-b">
                            <th className="p-4 font-medium">Order ID</th>
                            <th className="p-4 font-medium">Customer</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Amount</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.concat(recentOrders).map((order, index) => (
                            <tr key={`${order.id}-${index}`} className="border-t">
                              <td className="p-4">{order.id}</td>
                              <td className="p-4">{order.customer}</td>
                              <td className="p-4">{order.date}</td>
                              <td className="p-4">${order.amount.toFixed(2)}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : order.status === 'processing' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <Button variant="ghost" size="sm">View</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="products">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Products</h2>
                  <Button asChild>
                    <Link to="/seller/products/edit/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <Link to="/seller/products/edit/1">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                          alt="Wireless Earbuds" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">Wireless Earbuds</h3>
                        <p className="text-primary font-semibold mt-1">$59.99</p>
                        <p className="text-sm text-muted-foreground mt-1">153 sold</p>
                      </CardContent>
                    </Link>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <Link to="/seller/products/edit/2">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                          alt="Phone Stand" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">Phone Stand</h3>
                        <p className="text-primary font-semibold mt-1">$24.99</p>
                        <p className="text-sm text-muted-foreground mt-1">87 sold</p>
                      </CardContent>
                    </Link>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <Link to="/seller/products/edit/3">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1612815292890-fd55c355d8ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                          alt="USB-C Cable" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">USB-C Cable Pack</h3>
                        <p className="text-primary font-semibold mt-1">$15.99</p>
                        <p className="text-sm text-muted-foreground mt-1">65 sold</p>
                      </CardContent>
                    </Link>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <Link to="/seller/products/edit/4">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                          alt="Power Bank" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">Portable Power Bank</h3>
                        <p className="text-primary font-semibold mt-1">$49.99</p>
                        <p className="text-sm text-muted-foreground mt-1">45 sold</p>
                      </CardContent>
                    </Link>
                  </Card>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/seller/products">View All Products</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerDashboard;
