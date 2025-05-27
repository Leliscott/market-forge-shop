
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

export const useAgentDashboard = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [secretKeyRequests, setSecretKeyRequests] = useState<SecretKeyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [secretKeysLoading, setSecretKeysLoading] = useState(true);
  const [currentAgent, setCurrentAgent] = useState<any>(null);

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

  const handleApprovePayment = async (orderId: string) => {
    try {
      // Get order details first
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Get customer profile separately using user_id from order
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', orderData.user_id)
        .single();

      if (profileError) {
        console.error('Profile not found:', profileError);
        // Fallback: proceed without customer email
      }

      const customerEmail = profileData?.email;

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

      // Send approval notifications using Resend SMTP
      await supabase.functions.invoke('send-order-notifications', {
        body: {
          orderId: orderId,
          type: 'approved',
          customerEmail: customerEmail,
          sellerEmail: orderData?.seller_contact,
          masterAgentEmails: ['tshomela23rd@gmail.com', 'lee424066@gmail.com'],
          orderDetails: {
            total: orderData?.total_amount,
            items: orderData?.items,
            storeName: orderData?.store_name
          }
        }
      });

      toast({
        title: "Payment Approved",
        description: "Order payment confirmed and notifications sent via Resend SMTP",
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

  return {
    requests,
    orders,
    secretKeyRequests,
    loading,
    ordersLoading,
    secretKeysLoading,
    currentAgent,
    setCurrentAgent,
    fetchVerificationRequests,
    fetchEmailOrders,
    fetchSecretKeyRequests,
    handleApprovePayment,
    handleRejectPayment,
    handleApproveSecretKey,
    handleRejectSecretKey
  };
};
