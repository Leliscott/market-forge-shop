
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  items: any;
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

export const useAgentData = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [secretKeyRequests, setSecretKeyRequests] = useState<SecretKeyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [secretKeysLoading, setSecretKeysLoading] = useState(true);

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

  return {
    requests,
    orders,
    secretKeyRequests,
    loading,
    ordersLoading,
    secretKeysLoading,
    fetchVerificationRequests,
    fetchOrders,
    fetchSecretKeyRequests,
    setRequests,
    setOrders,
    setSecretKeyRequests
  };
};
