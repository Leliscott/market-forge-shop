
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  type: 'approved' | 'order_confirmation' | 'seller_notification';
  customerEmail?: string;
  sellerEmail?: string;
  orderDetails?: any;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, type, customerEmail, sellerEmail, orderDetails }: OrderNotificationRequest = await req.json();

    let notifications = [];

    if (type === 'approved' && customerEmail) {
      // Send order approved notification to customer
      notifications.push({
        recipient_email: customerEmail,
        email_type: 'order_approved',
        subject: `Order ${orderId} - Payment Approved`,
        content: `
          Great news! Your order payment has been approved.
          
          Order ID: ${orderId}
          Total: R${orderDetails?.total || 'N/A'}
          Status: Payment Approved
          
          Your order is now being processed and will be shipped soon.
          You can track your order status in your account dashboard.
        `,
        order_id: orderId
      });

      // Send notification to seller if available
      if (sellerEmail) {
        notifications.push({
          recipient_email: sellerEmail,
          email_type: 'order_seller_notification',
          subject: `New Order Approved - ${orderId}`,
          content: `
            You have received a new order with approved payment!
            
            Order ID: ${orderId}
            Customer: ${customerEmail}
            Total: R${orderDetails?.total || 'N/A'}
            
            Please prepare the order for shipping.
            Items:
            ${orderDetails?.items?.map((item: any) => `- ${item.name} (Qty: ${item.quantity})`).join('\n') || 'Items details not available'}
            
            You can view full order details in your seller dashboard.
          `,
          order_id: orderId
        });
      }
    }

    // Insert all notifications
    if (notifications.length > 0) {
      const { error } = await supabase
        .from('email_notifications')
        .insert(notifications);

      if (error) throw error;
    }

    console.log(`Sent ${notifications.length} email notifications for order ${orderId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${notifications.length} email notifications sent`,
        notificationCount: notifications.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-order-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
