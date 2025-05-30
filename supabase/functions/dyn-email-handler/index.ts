
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'welcome' | 'order_confirmation' | 'password_reset' | 'order_seller_notification';
  to: string;
  data?: any;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();
    console.log(`Sending ${type} email to ${to}`);

    let emailContent = '';
    let subject = '';

    switch (type) {
      case 'welcome':
        subject = 'Welcome to ShopMarket!';
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to ShopMarket! 🎉</h1>
            <p>Hi ${data?.name || 'there'},</p>
            <p>Thank you for joining our marketplace! You can now start ${data?.role === 'seller' ? 'selling your products' : 'shopping amazing products'} on our platform.</p>
            <p>Get started by exploring our features and connecting with the community.</p>
            <p>Happy ${data?.role === 'seller' ? 'selling' : 'shopping'}!</p>
            <p>Best regards,<br>The ShopMarket Team</p>
          </div>
        `;
        break;

      case 'order_confirmation':
        subject = `Order Confirmation - ${data?.orderId}`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Order Confirmed! 🛍️</h1>
            <p>Hi ${data?.customerName},</p>
            <p>Your order has been successfully placed and payment confirmed.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> ${data?.orderId}</p>
              <p><strong>Store:</strong> ${data?.storeName}</p>
              <p><strong>Total Amount:</strong> R${data?.total}</p>
              <p><strong>Payment Status:</strong> <span style="color: #16a34a;">Confirmed ✅</span></p>
            </div>
            <p>Your order is now being processed and will be shipped soon.</p>
            <p>Thank you for shopping with us!</p>
          </div>
        `;
        break;

      case 'order_seller_notification':
        subject = `New Order Received - ${data?.orderId}`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">New Order Alert! 📦</h1>
            <p>Hi there,</p>
            <p>You have received a new order with confirmed payment.</p>
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> ${data?.orderId}</p>
              <p><strong>Customer:</strong> ${data?.customerName}</p>
              <p><strong>Total Amount:</strong> R${data?.total}</p>
              <p><strong>Items:</strong> ${data?.itemsCount} item(s)</p>
            </div>
            <p>Please prepare this order for shipping as soon as possible.</p>
            <p>You can view full order details in your seller dashboard.</p>
          </div>
        `;
        break;

      case 'password_reset':
        subject = 'Password Reset Request';
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">Password Reset Request 🔐</h1>
            <p>Hi there,</p>
            <p>We received a request to reset your password for your ShopMarket account.</p>
            <p>If you requested this change, please check your email for the password reset link from our system.</p>
            <p>If you didn't request this change, please ignore this email - your account is secure.</p>
            <p>Best regards,<br>The ShopMarket Team</p>
          </div>
        `;
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "ShopMarket <noreply@shop4ll.co.za>",
      to: [to],
      subject: subject,
      html: emailContent,
    });

    console.log(`${type} email sent successfully to ${to}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${type} email sent successfully`,
        emailId: emailResponse.data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in dyn-email-handler:', error);
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
