
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  type: 'approved' | 'order_confirmation' | 'seller_notification';
  customerEmail?: string;
  sellerEmail?: string;
  masterAgentEmails?: string[];
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
    const { orderId, type, customerEmail, sellerEmail, masterAgentEmails, orderDetails }: OrderNotificationRequest = await req.json();

    let emailsSent = 0;

    if (type === 'approved' && customerEmail) {
      // Send order approved notification to customer using Resend
      const customerEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">🎉 Great News! Your Payment Has Been Approved</h1>
          
          <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Store:</strong> ${orderDetails?.storeName || 'Unknown Store'}</p>
            <p><strong>Total:</strong> R${orderDetails?.total || 'N/A'}</p>
            <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Payment Approved ✅</span></p>
          </div>
          
          <div style="margin: 20px 0;">
            <p>Your order is now being processed and will be shipped soon.</p>
            <p>You can track your order status in your account dashboard.</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Your order is being prepared by the seller</li>
              <li>You'll receive shipping updates via email</li>
              <li>Track your order in your account dashboard</li>
            </ul>
          </div>
          
          <p>Thank you for shopping with us! 🛍️</p>
        </div>
      `;

      await resend.emails.send({
        from: "ShopMarket <noreply@shop4ll.co.za>",
        to: [customerEmail],
        subject: `🎉 Order ${orderId} - Payment Approved!`,
        html: customerEmailHtml,
      });
      emailsSent++;

      // Send notification to seller if available using Resend
      if (sellerEmail) {
        const sellerEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">🚀 New Order with Approved Payment!</h1>
            
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2>Order Details</h2>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Customer:</strong> ${customerEmail}</p>
              <p><strong>Total:</strong> R${orderDetails?.total || 'N/A'}</p>
              <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Ready to Process 🎯</span></p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3>Items to Prepare:</h3>
              <ul>
                ${orderDetails?.items?.map((item: any) => 
                  `<li style="margin: 5px 0;">${item.name} (Qty: ${item.quantity})</li>`
                ).join('') || '<li>Items details not available</li>'}
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Action Required:</strong></p>
              <ul>
                <li>Prepare the order for shipping</li>
                <li>Update order status in your seller dashboard</li>
                <li>Ensure prompt processing and shipping</li>
              </ul>
            </div>
            
            <p>You can view full order details in your seller dashboard.</p>
          </div>
        `;

        await resend.emails.send({
          from: "ShopMarket <noreply@shop4ll.co.za>",
          to: [sellerEmail],
          subject: `🚀 New Order Approved - ${orderId}`,
          html: sellerEmailHtml,
        });
        emailsSent++;
      }

      // Send notifications to master agents using Resend
      const defaultMasterAgents = ['tshomela23rd@gmail.com', 'lee424066@gmail.com'];
      const agentsToNotify = masterAgentEmails || defaultMasterAgents;
      
      const agentEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">📊 Order Approved & Processed</h1>
          
          <div style="background-color: #f3e8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Order Summary</h2>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Customer:</strong> ${customerEmail}</p>
            <p><strong>Store:</strong> ${orderDetails?.storeName || 'Unknown Store'}</p>
            <p><strong>Seller:</strong> ${sellerEmail || 'Not available'}</p>
            <p><strong>Total:</strong> R${orderDetails?.total || 'N/A'}</p>
            <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Processing Stage 🔄</span></p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Order Items:</h3>
            <ul>
              ${orderDetails?.items?.map((item: any) => 
                `<li style="margin: 5px 0;">${item.name} (Qty: ${item.quantity})</li>`
              ).join('') || '<li>Items details not available</li>'}
            </ul>
          </div>
          
          <div style="background-color: #e5e7eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Notifications Sent:</strong></p>
            <ul>
              <li>✅ Customer approval notification sent</li>
              <li>✅ Seller processing notification sent</li>
              <li>✅ Order now in processing stage</li>
            </ul>
          </div>
          
          <p><em>All systems functioning normally. Order tracking updated.</em></p>
        </div>
      `;

      for (const agentEmail of agentsToNotify) {
        await resend.emails.send({
          from: "ShopMarket <noreply@shop4ll.co.za>",
          to: [agentEmail],
          subject: `📊 Order Approved - ${orderId}`,
          html: agentEmailHtml,
        });
        emailsSent++;
      }
    }

    console.log(`Sent ${emailsSent} email notifications via Resend for order ${orderId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${emailsSent} email notifications sent via Resend`,
        notificationCount: emailsSent,
        recipients: [
          ...(customerEmail ? [customerEmail] : []),
          ...(sellerEmail ? [sellerEmail] : []),
          ...(masterAgentEmails || ['tshomela23rd@gmail.com', 'lee424066@gmail.com'])
        ]
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
