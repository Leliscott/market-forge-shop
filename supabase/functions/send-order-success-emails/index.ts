
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';
import * as sgMail from "https://esm.sh/@sendgrid/mail@7.7.0?bundle";

const sendGridApiKey = Deno.env.get("SENDGRID_API_KEY")!;
sgMail.setApiKey(sendGridApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();
    console.log(`Processing order success emails for order: ${orderId}`);

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Send customer confirmation email
    const customerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #16a34a; text-align: center;">Payment Successful! 🎉</h1>
        <p>Hi ${order.customer_details?.name || 'Valued Customer'},</p>
        <p>Your payment has been successfully processed and your order is confirmed!</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> #${order.id.slice(0, 8)}</p>
          <p><strong>Store:</strong> ${order.store_name}</p>
          <p><strong>Total Amount:</strong> R${order.total_amount}</p>
          <p><strong>Payment Status:</strong> <span style="color: #16a34a;">Confirmed ✅</span></p>
        </div>
        <p>Your order is now being processed and will be shipped soon.</p>
        <p>Thank you for shopping with us!</p>
        <p>Best regards,<br>The ShopMarket Team</p>
      </div>
    `;

    const customerMsg = {
      to: order.customer_details?.email,
      from: "ShopMarket <noreply@shop4ll.co.za>",
      subject: `Payment Confirmed - Order #${order.id.slice(0, 8)}`,
      html: customerEmailContent,
    };

    await sgMail.send(customerMsg);
    console.log('Customer confirmation email sent successfully');

    // Send seller notification email if seller has contact email
    if (order.seller_contact) {
      const sellerEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">New Paid Order Received! 💰</h1>
          <p>Hi there,</p>
          <p>You have received a new order with confirmed payment.</p>
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> #${order.id.slice(0, 8)}</p>
            <p><strong>Customer:</strong> ${order.customer_details?.name}</p>
            <p><strong>Customer Email:</strong> ${order.customer_details?.email}</p>
            <p><strong>Total Amount:</strong> R${order.total_amount}</p>
            <p><strong>Items:</strong> ${order.items?.length || 0} item(s)</p>
            <p><strong>Shipping Address:</strong></p>
            <div style="margin-left: 20px;">
              <p>${order.shipping_address?.street || ''}</p>
              <p>${order.shipping_address?.city || ''}, ${order.shipping_address?.province || ''}</p>
              <p>${order.shipping_address?.postal_code || ''}</p>
            </div>
          </div>
          <p>Please prepare this order for shipping as soon as possible.</p>
          <p>You can view full order details in your seller dashboard.</p>
          <p>Best regards,<br>The ShopMarket Team</p>
        </div>
      `;

      const sellerMsg = {
        to: order.seller_contact,
        from: "ShopMarket <noreply@shop4ll.co.za>",
        subject: `New Paid Order - #${order.id.slice(0, 8)}`,
        html: sellerEmailContent,
      };

      await sgMail.send(sellerMsg);
      console.log('Seller notification email sent successfully');
    }

    // Log emails in database
    try {
      await supabase
        .from('email_notifications')
        .insert([
          {
            email_type: 'order_confirmation_paid',
            recipient_email: order.customer_details?.email,
            subject: `Payment Confirmed - Order #${order.id.slice(0, 8)}`,
            content: customerEmailContent,
            status: 'sent'
          },
          ...(order.seller_contact ? [{
            email_type: 'seller_order_notification_paid',
            recipient_email: order.seller_contact,
            subject: `New Paid Order - #${order.id.slice(0, 8)}`,
            content: sellerEmailContent,
            status: 'sent'
          }] : [])
        ]);
    } catch (logError) {
      console.error('Failed to log emails in database:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order success emails sent successfully'
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-order-success-emails:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
