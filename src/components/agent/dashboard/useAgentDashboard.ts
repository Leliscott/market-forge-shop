
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

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
  payment_status: string;
  customer_details: any;
  shipping_address: any;
  billing_address: any;
  items: any; // Changed from any[] to any to match Database Json type
  seller_contact: string;
  yoco_checkout_id?: string;
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

export const useAgentDashboard = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [secretKeyRequests, setSecretKeyRequests] = useState<SecretKeyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [secretKeysLoading, setSecretKeysLoading] = useState(true);
  const [currentAgent, setCurrentAgent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      console.log('Fetching all orders...');
      
      const { data: allOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      console.log('Orders found:', allOrders?.length || 0);
      
      // Convert the database types to our Order interface
      const typedOrders: Order[] = (allOrders || []).map(order => ({
        id: order.id,
        user_id: order.user_id,
        store_name: order.store_name || '',
        total_amount: order.total_amount,
        created_at: order.created_at,
        payment_method: order.payment_method || '',
        status: order.status,
        payment_status: order.payment_status || '',
        customer_details: order.customer_details,
        shipping_address: order.shipping_address,
        billing_address: order.billing_address,
        items: order.items,
        seller_contact: order.seller_contact || '',
        yoco_checkout_id: order.yoco_checkout_id || undefined
      }));

      setOrders(typedOrders);

    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
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

  const handleMarkOrderDelivered = async (orderId: string) => {
    try {
      console.log('Marking order as delivered:', orderId);
      
      // Update order status and payment status
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'delivered',
          payment_status: 'completed'
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Updated",
        description: "Order marked as delivered and seller account updated",
      });
      
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order",
        variant: "destructive"
      });
    }
  };

  const handleApproveSecretKey = async (requestId: string, email: string, secret: string) => {
    try {
      await supabase
        .from('secret_key_requests')
        .update({
          status: 'approved',
          processed_at: new Date().toISOString(),
          processed_by: currentAgent?.email
        })
        .eq('id', requestId);

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

  // Filter data based on search term
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_details?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_details?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter(request =>
    request.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    requests: filteredRequests,
    orders: filteredOrders,
    secretKeyRequests,
    loading,
    ordersLoading,
    secretKeysLoading,
    currentAgent,
    searchTerm,
    setSearchTerm,
    setCurrentAgent,
    fetchVerificationRequests,
    fetchOrders,
    fetchSecretKeyRequests,
    handleMarkOrderDelivered,
    handleApproveSecretKey,
    handleRejectSecretKey
  };
};
