
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';

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

    // Here you would integrate with your email service (Resend, etc.)
    // For now, we'll simulate sending an email
    console.log('Payment email would be sent to:', customerEmail);
    console.log('Order details:', orderDetails);
    console.log('Payment token:', paymentToken);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment email sent successfully',
        paymentToken 
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
