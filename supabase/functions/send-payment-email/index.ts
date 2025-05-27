
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
    console.log('=== PAYMENT EMAIL FUNCTION STARTED ===');
    const { orderId, customerEmail, orderDetails }: PaymentEmailRequest = await req.json();
    
    console.log('Request data:', { orderId, customerEmail, orderDetails });

    // Validate required fields
    if (!orderId || !customerEmail || !orderDetails) {
      throw new Error('Missing required fields: orderId, customerEmail, or orderDetails');
    }

    // Generate unique payment token
    const paymentToken = `pay_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    console.log('Generated payment token:', paymentToken);

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
      console.error('Email payment creation error:', emailError);
      throw new Error(`Failed to create email payment: ${emailError.message}`);
    }

    console.log('Email payment created:', emailPayment);

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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Shop4ll Logo Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #14b8a6;">
            <div style="background: linear-gradient(135deg, #14b8a6, #06b6d4); padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 10px;">
              <span style="color: white; font-size: 28px; font-weight: bold; letter-spacing: 1px;">Shop4ll</span>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Your Trusted Marketplace</p>
          </div>

          <h1 style="color: #2563eb; margin: 0 0 20px 0; font-size: 24px;">🛍️ Order Confirmation & Payment Instructions</h1>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin: 0 0 15px 0;">Order Details</h2>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 5px 0;"><strong>Store:</strong> ${orderDetails.storeName}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> R${orderDetails.total.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Payment Token:</strong> <code style="background: #e5e7eb; padding: 2px 8px; border-radius: 4px;">${paymentToken}</code></p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Items Ordered:</h3>
            <ul style="list-style: none; padding: 0;">
              ${orderDetails.items.map(item => 
                `<li style="background: #f9fafb; padding: 10px; margin: 5px 0; border-radius: 6px; border-left: 4px solid #14b8a6;">
                  ${item.name} x ${item.quantity} = R${(item.price * item.quantity).toFixed(2)}
                </li>`
              ).join('')}
            </ul>
            <p style="background: #fee2e2; padding: 10px; border-radius: 6px; margin: 10px 0;"><strong>Delivery Charge:</strong> R${orderDetails.deliveryCharge.toFixed(2)}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">💳 Payment Instructions</h3>
            <p style="color: #92400e; margin: 5px 0;">Your order has been created and is pending payment approval.</p>
            <p style="color: #92400e; margin: 5px 0;">Our agents will review your order and contact you with payment instructions within 24 hours.</p>
            <p style="color: #92400e; margin: 5px 0;">You can track your order status by logging into your account.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #ecfdf5; border-radius: 8px;">
            <p style="color: #065f46; margin: 0; font-size: 16px;">Thank you for shopping with <strong>${orderDetails.storeName}</strong>!</p>
            <p style="color: #065f46; margin: 10px 0 0 0; font-size: 14px;">For support, contact us at: <a href="mailto:mainshop@shop4ll.co.za" style="color: #14b8a6;">mainshop@shop4ll.co.za</a></p>
          </div>
        </div>
      </div>
    `;

    try {
      const customerEmailResult = await resend.emails.send({
        from: "Shop4ll <mainshop@shop4ll.co.za>",
        to: [customerEmail],
        subject: `🛍️ Order ${orderId} - Payment Instructions`,
        html: customerEmailHtml,
      });
      
      console.log('Customer email sent successfully:', customerEmailResult);
    } catch (emailSendError) {
      console.error('Failed to send customer email:', emailSendError);
      throw new Error(`Failed to send customer email: ${emailSendError.message}`);
    }

    // Send master agent notifications using Resend
    const masterAgents = ['tshomela23rd@gmail.com', 'lee424066@gmail.com'];
    
    const agentEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Shop4ll Logo Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #dc2626;">
            <div style="background: linear-gradient(135deg, #dc2626, #ea580c); padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 10px;">
              <span style="color: white; font-size: 28px; font-weight: bold; letter-spacing: 1px;">Shop4ll</span>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Agent Dashboard</p>
          </div>

          <h1 style="color: #dc2626;">🚨 New Email Payment Order Received</h1>
          
          <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin: 0 0 15px 0;">Order Details</h2>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${customerEmail}</p>
            <p style="margin: 5px 0;"><strong>Store:</strong> ${orderDetails.storeName}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> R${orderDetails.total.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Payment Token:</strong> <code style="background: #e5e7eb; padding: 2px 8px; border-radius: 4px;">${paymentToken}</code></p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Items Ordered:</h3>
            <ul style="list-style: none; padding: 0;">
              ${orderDetails.items.map(item => 
                `<li style="background: #f9fafb; padding: 10px; margin: 5px 0; border-radius: 6px; border-left: 4px solid #dc2626;">
                  ${item.name} x ${item.quantity} = R${(item.price * item.quantity).toFixed(2)}
                </li>`
              ).join('')}
            </ul>
            <p style="background: #fee2e2; padding: 10px; border-radius: 6px; margin: 10px 0;"><strong>Delivery Charge:</strong> R${orderDetails.deliveryCharge.toFixed(2)}</p>
          </div>
          
          <div style="background-color: #ddd6fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
            <p style="color: #5b21b6; margin: 0; font-weight: bold;">⚡ Action Required:</p>
            <p style="color: #5b21b6; margin: 10px 0 0 0;">Please review this order in the Agent Dashboard for payment approval.</p>
            <p style="color: #5b21b6; margin: 5px 0 0 0;">Customer is waiting for payment instructions.</p>
          </div>
        </div>
      </div>
    `;

    // Send to all master agents
    const agentEmailPromises = masterAgents.map(async (agentEmail) => {
      try {
        const result = await resend.emails.send({
          from: "Shop4ll <mainshop@shop4ll.co.za>",
          to: [agentEmail],
          subject: `🚨 New Email Payment Order - ${orderId}`,
          html: agentEmailHtml,
        });
        console.log(`Agent email sent to ${agentEmail}:`, result);
        return result;
      } catch (error) {
        console.error(`Failed to send email to agent ${agentEmail}:`, error);
        throw error;
      }
    });

    await Promise.all(agentEmailPromises);

    console.log('=== ALL EMAILS SENT SUCCESSFULLY ===');
    console.log('Recipients:', [customerEmail, ...masterAgents]);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Payment emails sent via Resend to customer and ${masterAgents.length} master agents`,
        paymentToken,
        recipients: [customerEmail, ...masterAgents],
        emailsSent: masterAgents.length + 1
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('=== ERROR IN PAYMENT EMAIL FUNCTION ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
