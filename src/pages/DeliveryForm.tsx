
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DeliveryForm from '@/components/checkout/DeliveryForm';
import { Loader2 } from 'lucide-react';

const DeliveryFormPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [sellerContact, setSellerContact] = useState<any>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return;

      try {
        // Fetch order details
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            profiles:user_id (
              full_name,
              phone,
              email
            )
          `)
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        // Get seller information from the first item
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (
              store_id,
              stores (
                name,
                contact_phone,
                contact_email,
                profiles:user_id (
                  full_name,
                  phone,
                  email
                )
              )
            )
          `)
          .eq('order_id', orderId)
          .limit(1);

        if (itemsError) throw itemsError;

        if (orderItems && orderItems.length > 0) {
          const store = orderItems[0].products.stores;
          const storeOwner = store.profiles;
          
          setSellerContact({
            name: store.name,
            phone: store.contact_phone || storeOwner.phone,
            email: store.contact_email || storeOwner.email,
          });
        }

        setOrderData(order);
      } catch (error: any) {
        console.error('Error fetching order data:', error);
        toast({
          title: "Error",
          description: "Failed to load order information.",
          variant: "destructive"
        });
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, navigate, toast]);

  const handleDeliveryFormSubmit = async (formData: any) => {
    setSubmitting(true);

    try {
      // Update order with delivery information
      const { error } = await supabase
        .from('orders')
        .update({
          delivery_info: formData,
          status: 'confirmed'
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Delivery information submitted",
        description: "Your delivery details have been sent to the seller. They will contact you to arrange delivery.",
      });

      navigate('/orders');
    } catch (error: any) {
      console.error('Error submitting delivery form:', error);
      toast({
        title: "Error",
        description: "Failed to submit delivery information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!orderData || !sellerContact) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Order not found or invalid.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Delivery Information</h1>
        <DeliveryForm
          orderId={orderData.id}
          sellerContact={sellerContact}
          onSubmit={handleDeliveryFormSubmit}
          isSubmitting={submitting}
        />
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryFormPage;
