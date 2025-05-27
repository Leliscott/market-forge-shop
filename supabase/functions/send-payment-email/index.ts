
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentEmailRequest {
  orderId: string;
  customerEmail: string;
  orderDetails: {
    items: any[];
    total: number;
    storeName: string;
    deliveryCharge: number;
  };
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerEmail, orderDetails }: PaymentEmailRequest = await req.json();

    // Generate unique payment token
    const paymentToken = `pay_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    // Create email payment record
    const { data: emailPayment, error: emailError } = await supabase
      .from('email_payments')
      .insert({
        order_id: orderId,
        payment_link_token: paymentToken
      })
      .select()
      .single();

    if (emailError) {
      throw new Error(`Failed to create email payment: ${emailError.message}`);
    }

    // Update order with email payment ID
    await supabase
      .from('orders')
      .update({ 
        email_payment_id: emailPayment.id,
        payment_method: 'email'
      })
      .eq('id', orderId);

    // Send customer email using Resend
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Order Confirmation & Payment Instructions</h1>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Store:</strong> ${orderDetails.storeName}</p>
          <p><strong>Total Amount:</strong> R${orderDetails.total.toFixed(2)}</p>
          <p><strong>Payment Token:</strong> ${paymentToken}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Items Ordered:</h3>
          <ul>
            ${orderDetails.items.map(item => 
              `<li>${item.name} x ${item.quantity} = R${(item.price * item.quantity).toFixed(2)}</li>`
            ).join('')}
          </ul>
          <p><strong>Delivery Charge:</strong> R${orderDetails.deliveryCharge.toFixed(2)}</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Payment Instructions</h3>
          <p>Your order has been created and is pending payment approval. Our agents will review your order and contact you with payment instructions.</p>
          <p>You can track your order status by logging into your account.</p>
        </div>
        
        <p>Thank you for shopping with ${orderDetails.storeName}!</p>
      </div>
    `;

    await resend.emails.send({
      from: "ShopMarket <noreply@shop4ll.co.za>",
      to: [customerEmail],
      subject: `Order ${orderId} - Payment Instructions`,
      html: customerEmailHtml,
    });

    // Send master agent notifications using Resend
    const masterAgents = ['tshomela23rd@gmail.com', 'lee424066@gmail.com'];
    
    const agentEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">New Email Payment Order Received</h1>
        
        <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${customerEmail}</p>
          <p><strong>Store:</strong> ${orderDetails.storeName}</p>
          <p><strong>Total Amount:</strong> R${orderDetails.total.toFixed(2)}</p>
          <p><strong>Payment Token:</strong> ${paymentToken}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Items Ordered:</h3>
          <ul>
            ${orderDetails.items.map(item => 
              `<li>${item.name} x ${item.quantity} = R${(item.price * item.quantity).toFixed(2)}</li>`
            ).join('')}
          </ul>
          <p><strong>Delivery Charge:</strong> R${orderDetails.deliveryCharge.toFixed(2)}</p>
        </div>
        
        <div style="background-color: #ddd6fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Action Required:</strong> Please review this order in the Agent Dashboard for payment approval.</p>
          <p>Customer is waiting for payment instructions.</p>
        </div>
      </div>
    `;

    // Send to all master agents
    for (const agentEmail of masterAgents) {
      await resend.emails.send({
        from: "ShopMarket <noreply@shop4ll.co.za>",
        to: [agentEmail],
        subject: `New Email Payment Order - ${orderId}`,
        html: agentEmailHtml,
      });
    }

    console.log('Enhanced payment email notifications sent via Resend to:', [customerEmail, ...masterAgents]);
    console.log('Order details:', orderDetails);
    console.log('Payment token:', paymentToken);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Payment emails sent via Resend to customer and ${masterAgents.length} master agents`,
        paymentToken,
        recipients: [customerEmail, ...masterAgents]
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-payment-email function:', error);
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
