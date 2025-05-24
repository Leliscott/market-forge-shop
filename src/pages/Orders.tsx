
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, Search, Filter, ArrowDown, ArrowUp, Check, 
  Truck, Clock, AlertTriangle, PackageCheck, Home, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_status?: string;
  created_at: string;
  shipping_address?: string;
  billing_address?: string;
  items?: any[];
  payment_date?: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: {
    name: string;
    image?: string;
  };
}

const statusColorMap: Record<string, { bgColor: string, textColor: string, icon: React.ReactNode }> = {
  'pending': {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: <Clock className="w-4 h-4 mr-1" />
  },
  'paid': {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: <Clock className="w-4 h-4 mr-1" />
  },
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
  'failed': {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: <AlertTriangle className="w-4 h-4 mr-1" />
  },
  'cancelled': {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: <AlertTriangle className="w-4 h-4 mr-1" />
  }
};

const Orders: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  // Check for payment success
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const orderId = searchParams.get('order_id');
    
    if (paymentStatus === 'success' && orderId) {
      toast({
        title: "Payment Successful!",
        description: `Your order has been placed successfully. Order ID: ${orderId.slice(0, 8)}`,
        duration: 5000,
      });
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again anytime.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [searchParams, toast]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);

      // Fetch order items for each order
      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map(order => order.id);
        
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (
              name,
              image
            )
          `)
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        // Group items by order_id
        const itemsByOrder: Record<string, OrderItem[]> = {};
        itemsData?.forEach(item => {
          if (!itemsByOrder[item.order_id]) {
            itemsByOrder[item.order_id] = [];
          }
          itemsByOrder[item.order_id].push(item);
        });

        setOrderItems(itemsByOrder);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredOrders = orders.filter(order => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(lowerSearchTerm) ||
      order.status.toLowerCase().includes(lowerSearchTerm);
    
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
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'total_amount':
        comparison = a.total_amount - b.total_amount;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    failed: orders.filter(o => o.status === 'failed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your orders...</p>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/" className="flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back Home
                  </Link>
                </Button>
              </div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-muted-foreground">
                Track and manage your order history
              </p>
            </div>
          </div>

          {/* Payment Success Alert */}
          {searchParams.get('payment') === 'success' && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Payment completed successfully! Your order is being processed.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders by ID or status..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All ({orderCounts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({orderCounts.pending})</TabsTrigger>
              <TabsTrigger value="paid">Paid ({orderCounts.paid})</TabsTrigger>
              <TabsTrigger value="processing">Processing ({orderCounts.processing})</TabsTrigger>
              <TabsTrigger value="shipped">Shipped ({orderCounts.shipped})</TabsTrigger>
              <TabsTrigger value="delivered">Delivered ({orderCounts.delivered})</TabsTrigger>
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
                          onClick={() => handleSort('created_at')}
                        >
                          <div className="flex items-center">
                            Date
                            {sortColumn === 'created_at' && (
                              sortDirection === 'asc' 
                                ? <ArrowUp className="ml-1 w-4 h-4" />
                                : <ArrowDown className="ml-1 w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 cursor-pointer hover:bg-muted/70"
                          onClick={() => handleSort('total_amount')}
                        >
                          <div className="flex items-center">
                            Amount
                            {sortColumn === 'total_amount' && (
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
                          <td className="p-4">#{order.id.slice(0, 8)}</td>
                          <td className="p-4">
                            {new Date(order.created_at).toLocaleDateString('en-ZA')}
                          </td>
                          <td className="p-4">R{order.total_amount.toFixed(2)}</td>
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
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                      
                      {sortedOrders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center">
                            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-lg font-medium">No orders found</p>
                            <p className="text-muted-foreground mb-4">
                              {searchTerm 
                                ? "Try adjusting your search"
                                : "You haven't placed any orders yet"
                              }
                            </p>
                            <Button asChild>
                              <Link to="/marketplace">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Start Shopping
                              </Link>
                            </Button>
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
                Order #{selectedOrder.id.slice(0, 8)} • Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-ZA')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Information</h3>
                  <div className="border rounded-md p-4">
                    {selectedOrder.shipping_address ? (
                      (() => {
                        try {
                          const address = JSON.parse(selectedOrder.shipping_address);
                          return (
                            <>
                              <p className="font-medium">{address.firstName} {address.lastName}</p>
                              <p>{address.address}</p>
                              <p>{address.city}, {address.province} {address.postalCode}</p>
                            </>
                          );
                        } catch {
                          return <p>Address information available</p>;
                        }
                      })()
                    ) : (
                      <p className="text-muted-foreground">No shipping address</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Payment Information</h3>
                  <div className="border rounded-md p-4">
                    <p>Payment Method: PayFast</p>
                    <p>Total Amount: R{selectedOrder.total_amount.toFixed(2)}</p>
                    {selectedOrder.payment_date && (
                      <p>Paid on: {new Date(selectedOrder.payment_date).toLocaleDateString('en-ZA')}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      Merchant: SecureMarket (Pty) Ltd
                    </p>
                  </div>
                </div>
              </div>
              
              {orderItems[selectedOrder.id] && (
                <div>
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="border rounded-md divide-y">
                    {orderItems[selectedOrder.id].map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4">
                        <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                          {item.products?.image ? (
                            <img
                              src={item.products.image}
                              alt={item.products?.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.products?.name || 'Product'}</p>
                          <p className="text-sm text-muted-foreground">
                            R{item.unit_price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="text-right font-medium">
                          R{item.total_price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span>R{(selectedOrder.total_amount / 1.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-medium">VAT (15%)</span>
                  <span>R{(selectedOrder.total_amount - (selectedOrder.total_amount / 1.15)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-medium">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between mt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>R{selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
              <Button asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back Home
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Orders;
