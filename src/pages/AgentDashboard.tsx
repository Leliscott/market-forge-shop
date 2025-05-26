import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Home } from 'lucide-react';
import DashboardStats from '@/components/agent/DashboardStats';
import VerificationRequestsTable from '@/components/agent/VerificationRequestsTable';
import VerificationDialog from '@/components/agent/VerificationDialog';
import OrderApprovalTable from '@/components/agent/OrderApprovalTable';
import SecretKeyRequestsTable from '@/components/agent/SecretKeyRequestsTable';

interface VerificationRequest {
  id: string;
  merchant_name: string;
  store_id: string;
  owner_name: string;
  submission_date: string;
  status: string;
  id_document_url: string;
  selfie_url: string;
  owner_id: string;
}

interface Order {
  id: string;
  user_id: string;
  store_name: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  status: string;
  email_payments?: {
    payment_confirmed: boolean;
    email_sent_at: string;
  };
}

interface SecretKeyRequest {
  id: string;
  requester_email: string;
  requester_name: string;
  generated_secret: string;
  status: string;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
  notes?: string;
}

const AgentDashboard = () => {
  const { toast } = useToast();
  const [viewingRequest, setViewingRequest] = useState<VerificationRequest | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [secretKeyRequests, setSecretKeyRequests] = useState<SecretKeyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [secretKeysLoading, setSecretKeysLoading] = useState(true);
  const [currentAgent, setCurrentAgent] = useState<any>(null);

  useEffect(() => {
    // Check agent session
    const agentSession = localStorage.getItem('agentSession');
    if (!agentSession) {
      window.location.href = '/';
      return;
    }

    const session = JSON.parse(agentSession);
    setCurrentAgent(session);
    
    fetchVerificationRequests();
    fetchEmailOrders();
    fetchSecretKeyRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('merchant_verifications')
        .select('*')
        .order('submission_date', { ascending: false });

      if (error) {
        console.error('Error fetching verification requests:', error);
        toast({
          title: "Error",
          description: "Failed to load verification requests",
          variant: "destructive"
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          email_payments (
            payment_confirmed,
            email_sent_at
          )
        `)
        .eq('payment_method', 'email')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive"
        });
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchSecretKeyRequests = async () => {
    setSecretKeysLoading(true);
    try {
      const { data, error } = await supabase
        .from('secret_key_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('Error fetching secret key requests:', error);
        toast({
          title: "Error",
          description: "Failed to load secret key requests",
          variant: "destructive"
        });
      } else {
        setSecretKeyRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSecretKeysLoading(false);
    }
  };

  const handleApproveSecretKey = async (requestId: string, email: string, secret: string) => {
    try {
      // Update request status
      await supabase
        .from('secret_key_requests')
        .update({
          status: 'approved',
          processed_at: new Date().toISOString(),
          processed_by: currentAgent?.email
        })
        .eq('id', requestId);

      // Add secret to agent_secrets table
      await supabase
        .from('agent_secrets')
        .insert({
          agent_email: email,
          secret_key: secret,
          created_by: currentAgent?.email
        });

      toast({
        title: "Secret Key Approved",
        description: `Agent access granted for ${email}`,
      });
      
      fetchSecretKeyRequests();
    } catch (error: any) {
      console.error('Error approving secret key:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve secret key",
        variant: "destructive"
      });
    }
  };

  const handleRejectSecretKey = async (requestId: string) => {
    try {
      await supabase
        .from('secret_key_requests')
        .update({
          status: 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: currentAgent?.email
        })
        .eq('id', requestId);

      toast({
        title: "Secret Key Rejected",
        description: "Request has been rejected",
      });
      
      fetchSecretKeyRequests();
    } catch (error: any) {
      console.error('Error rejecting secret key:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject secret key",
        variant: "destructive"
      });
    }
  };

  const handleApprovePayment = async (orderId: string) => {
    try {
      // Get order details for notifications
      const { data: orderData } = await supabase
        .from('orders')
        .select('*, profiles!orders_user_id_fkey(email)')
        .eq('id', orderId)
        .single();

      // Update email payment as confirmed
      const { error } = await supabase
        .from('email_payments')
        .update({
          payment_confirmed: true,
          confirmed_at: new Date().toISOString(),
          confirmed_by: currentAgent?.agentId
        })
        .eq('order_id', orderId);

      if (error) throw error;

      // Update order status
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      // Send notifications to customer and seller
      await supabase.functions.invoke('send-order-notifications', {
        body: {
          orderId: orderId,
          type: 'approved',
          customerEmail: orderData?.profiles?.email,
          sellerEmail: orderData?.seller_contact,
          orderDetails: {
            total: orderData?.total_amount,
            items: orderData?.items
          }
        }
      });

      toast({
        title: "Payment Approved",
        description: "Order payment confirmed and notifications sent",
      });
      
      fetchEmailOrders();
    } catch (error: any) {
      console.error('Error approving payment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve payment",
        variant: "destructive"
      });
    }
  };

  const handleRejectPayment = async (orderId: string) => {
    try {
      // Update order status to failed
      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', orderId);

      toast({
        title: "Payment Rejected",
        description: "Order has been marked as failed",
      });
      
      fetchEmailOrders();
    } catch (error: any) {
      console.error('Error rejecting payment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject payment",
        variant: "destructive"
      });
    }
  };

  const handleApprove = async (requestId: string) => {
    if (!currentAgent) {
      toast({
        title: "Error",
        description: "Agent information not found",
        variant: "destructive"
      });
      return;
    }

    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      // Update verification request
      const { error: verificationError } = await supabase
        .from('merchant_verifications')
        .update({
          status: 'approved',
          processed_by: currentAgent.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (verificationError) {
        throw verificationError;
      }

      // Update store verification status
      const { error: storeError } = await supabase
        .from('stores')
        .update({ verified: true })
        .eq('id', request.store_id);

      if (storeError) {
        throw storeError;
      }

      toast({
        title: "Merchant verified",
        description: "The merchant has been successfully verified",
      });
      
      setViewingRequest(null);
      fetchVerificationRequests();
    } catch (error: any) {
      console.error('Error approving merchant:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve merchant",
        variant: "destructive"
      });
    }
  };
  
  const handleReject = async (requestId: string) => {
    if (!currentAgent) {
      toast({
        title: "Error",
        description: "Agent information not found",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('merchant_verifications')
        .update({
          status: 'rejected',
          processed_by: currentAgent.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        throw error;
      }

      toast({
        title: "Merchant rejected",
        description: "The verification request has been rejected",
      });
      
      setViewingRequest(null);
      fetchVerificationRequests();
    } catch (error: any) {
      console.error('Error rejecting merchant:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject merchant",
        variant: "destructive"
      });
    }
  };

  const filteredRequests = (status: string) => {
    return requests.filter(req => status === 'all' || req.status === status);
  };

  const pendingOrders = orders.filter(order => 
    order.payment_method === 'email' && !order.email_payments?.payment_confirmed
  );

  if (loading && ordersLoading && secretKeysLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="bg-white dark:bg-gray-900 border-b px-4 py-2">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
            <Home className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
            <Home className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-sm text-gray-600">
            Agent: {currentAgent?.email} {currentAgent?.isMaster && '(Master)'}
          </div>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <DashboardStats agentId={currentAgent?.agentId} />
        
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Email Orders ({pendingOrders.length})</TabsTrigger>
            <TabsTrigger value="secret-keys">Secret Key Requests ({secretKeyRequests.filter(r => r.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="verifications">Merchant Verifications ({requests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Payment Orders</CardTitle>
                <CardDescription>
                  Approve or reject orders with email payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrderApprovalTable 
                  orders={orders}
                  onApprove={handleApprovePayment}
                  onReject={handleRejectPayment}
                  onViewDetails={setSelectedOrder}
                  loading={ordersLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="secret-keys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Secret Key Requests</CardTitle>
                <CardDescription>
                  Manage agent access requests and approve/reject secret keys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SecretKeyRequestsTable 
                  requests={secretKeyRequests}
                  onApprove={handleApproveSecretKey}
                  onReject={handleRejectSecretKey}
                  loading={secretKeysLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verifications" className="space-y-4">
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <Card key={status}>
                <CardHeader>
                  <CardTitle>
                    {status.charAt(0).toUpperCase() + status.slice(1)} Merchant Verifications
                  </CardTitle>
                  <CardDescription>
                    Review and manage verification documents from merchants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VerificationRequestsTable 
                    requests={filteredRequests(status)}
                    onViewRequest={setViewingRequest}
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
      
      <VerificationDialog 
        request={viewingRequest}
        onClose={() => setViewingRequest(null)}
        onApprove={() => {}}
        onReject={() => {}}
      />
    </div>
  );
};

export default AgentDashboard;
