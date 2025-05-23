
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  ShoppingBag, DollarSign, Users, ArrowUpRight, 
  ArrowDownRight, Store, Package, Plus, Clock, Shield, CheckCircle, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewStockView from '@/components/seller/NewStockView';
import DashboardSkeleton from '@/components/seller/DashboardSkeleton';
import VerificationDialog from '@/components/seller/VerificationDialog';
import SellerAccountDashboard from '@/components/seller/SellerAccountDashboard';
import { useAuth } from '@/context/AuthContext';
import { useSellerData } from '@/hooks/useSellerData';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import { formatCurrency } from '@/utils/constants';

const SellerDashboard: React.FC = () => {
  const { userStore } = useAuth();
  const { orders, stats, newProducts, isLoading, isStatsLoading, updateOrderStatus } = useSellerData();
  const verificationStatus = useVerificationStatus(userStore?.id);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

  // Generate revenue chart data from actual orders
  const generateRevenueData = () => {
    if (orders.length === 0) return [];
    
    const last7Months = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const revenue = monthOrders.reduce((sum, order) => sum + order.total_amount, 0);
      
      last7Months.push({
        name: monthName,
        revenue: revenue
      });
    }
    
    return last7Months;
  };

  const revenueData = generateRevenueData();
  const recentOrders = orders.slice(0, 5);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationBadge = () => {
    if (verificationStatus.isLoading) {
      return <Skeleton className="h-8 w-24" />;
    }

    if (verificationStatus.isVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }

    if (verificationStatus.hasApplication) {
      const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200'
      };

      return (
        <Badge className={statusColors[verificationStatus.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
          <Clock className="w-3 h-3 mr-1" />
          {verificationStatus.status === 'pending' ? 'Under Review' : verificationStatus.status}
        </Badge>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <DashboardSkeleton />
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                {getVerificationBadge()}
              </div>
              <p className="text-muted-foreground">
                {userStore ? `Managing ${userStore.name}` : 'Manage your store, products, and orders'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {!userStore ? (
                <Button asChild>
                  <Link to="/seller/create-store">
                    <Store className="mr-2 h-4 w-4" />
                    Create Store
                  </Link>
                </Button>
              ) : (
                <>
                  {!verificationStatus.isVerified && !verificationStatus.hasApplication && !verificationStatus.isLoading && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowVerificationDialog(true)}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Get Verified
                    </Button>
                  )}
                  
                  <Button variant="outline" asChild>
                    <Link to="/seller/store-settings">
                      <Store className="mr-2 h-4 w-4" />
                      Store Settings
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/seller/products/edit/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {!userStore ? (
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
            <>
              {/* Welcome message for new stores with no products */}
              {stats.totalProducts === 0 && !isStatsLoading && (
                <Card className="mb-8 border-green-200 bg-green-50">
                  <CardContent className="pt-6 text-center">
                    <Package className="mx-auto h-12 w-12 text-green-600 mb-4" />
                    <h2 className="text-xl font-semibold mb-2 text-green-800">Welcome to Your Store Dashboard!</h2>
                    <p className="mb-6 text-green-700">
                      Congratulations! Your store "{userStore.name}" has been created successfully. 
                      Start by adding your first product to begin selling.
                    </p>
                    <Button asChild>
                      <Link to="/seller/products/edit/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Product
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Verification info card */}
              {!verificationStatus.isVerified && userStore && (
                <Card className="mb-8 border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Shield className="h-8 w-8 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          {verificationStatus.hasApplication ? 'Verification in Progress' : 'Get Verified to Build Trust'}
                        </h3>
                        {verificationStatus.hasApplication ? (
                          <p className="text-blue-700 mb-4">
                            Your verification application is {verificationStatus.status}. 
                            {verificationStatus.status === 'pending' && ' Our agents are reviewing your documents.'}
                            {verificationStatus.status === 'rejected' && ' Please submit a new application with updated documents.'}
                          </p>
                        ) : (
                          <p className="text-blue-700 mb-4">
                            Become a verified merchant to earn customer trust and get a verification badge on all your products. 
                            The process is quick and helps customers know they're buying from a legitimate seller.
                          </p>
                        )}
                        
                        {!verificationStatus.hasApplication && (
                          <Button 
                            onClick={() => setShowVerificationDialog(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Start Verification
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs defaultValue="overview">
                <TabsList className="mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="new-stock">New Stock</TabsTrigger>
                  <TabsTrigger value="account">Account & Withdrawals</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {isStatsLoading ? (
                      // Show skeleton for stats cards
                      Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <Skeleton className="h-4 w-16 mb-2" />
                                <Skeleton className="h-8 w-20" />
                              </div>
                              <Skeleton className="h-12 w-12 rounded-full" />
                            </div>
                            <div className="flex items-center mt-3">
                              <Skeleton className="h-4 w-4 mr-1" />
                              <Skeleton className="h-4 w-16 mr-2" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      // Show actual stats cards
                      <>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                              </div>
                              <div className="bg-primary/10 p-2 rounded-full">
                                <DollarSign className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <div className="flex items-center mt-3 text-sm">
                              {stats.revenueGrowth >= 0 ? (
                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className={`font-medium ${stats.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
                              </span>
                              <span className="text-muted-foreground ml-2">from last month</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Orders</p>
                                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                              </div>
                              <div className="bg-blue-500/10 p-2 rounded-full">
                                <ShoppingBag className="h-6 w-6 text-blue-500" />
                              </div>
                            </div>
                            <div className="flex items-center mt-3 text-sm">
                              {stats.ordersGrowth >= 0 ? (
                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className={`font-medium ${stats.ordersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth.toFixed(1)}%
                              </span>
                              <span className="text-muted-foreground ml-2">from last month</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Products</p>
                                <p className="text-2xl font-bold">{stats.totalProducts}</p>
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
                                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                              </div>
                              <div className="bg-purple-500/10 p-2 rounded-full">
                                <Users className="h-6 w-6 text-purple-500" />
                              </div>
                            </div>
                            <div className="flex items-center mt-3 text-sm">
                              {stats.customersGrowth >= 0 ? (
                                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className={`font-medium ${stats.customersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stats.customersGrowth >= 0 ? '+' : ''}{stats.customersGrowth.toFixed(1)}%
                              </span>
                              <span className="text-muted-foreground ml-2">from last month</span>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>
                  
                  {/* Revenue Chart */}
                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue for the last 7 months</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isStatsLoading ? (
                          <Skeleton className="h-[300px] w-full" />
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                              <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
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
                      {recentOrders.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {recentOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-mono text-sm">
                                  {order.id.slice(0, 8)}...
                                </TableCell>
                                <TableCell>
                                  {order.customer_profile?.name || order.customer_profile?.email || 'Unknown'}
                                </TableCell>
                                <TableCell>
                                  {new Date(order.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusBadgeColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No orders yet. Start selling to see your orders here!
                        </div>
                      )}
                    </CardContent>
                    {recentOrders.length > 0 && (
                      <CardFooter>
                        <Button variant="outline" asChild className="w-full">
                          <Link to="/seller/orders">
                            View All Orders
                          </Link>
                        </Button>
                      </CardFooter>
                    )}
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
                      {orders.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-mono text-sm">
                                  {order.id.slice(0, 8)}...
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {order.customer_profile?.name || 'Unknown'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {order.customer_profile?.email}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {new Date(order.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                                <TableCell>
                                  <Select
                                    value={order.status}
                                    onValueChange={(value) => updateOrderStatus(order.id, value as any)}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">View</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No orders yet. Start selling to see your orders here!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="new-stock">
                  <NewStockView products={newProducts} isLoading={false} />
                </TabsContent>

                <TabsContent value="account">
                  <SellerAccountDashboard />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Verification Dialog */}
      {userStore && (
        <VerificationDialog
          isOpen={showVerificationDialog}
          onClose={() => setShowVerificationDialog(false)}
          storeName={userStore.name}
          storeId={userStore.id}
        />
      )}
    </div>
  );
};

export default SellerDashboard;
