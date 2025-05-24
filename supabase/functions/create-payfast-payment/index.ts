
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validatePaymentRequest, validateEnvironment, ValidationError } from './validation.ts';
import { createPayFastData, generateSecurePayFastSignature } from './payfast.ts';
import { createOrder, createOrderItems } from './orders.ts';
import { ErrorResponse, SuccessResponse } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    if (req.method !== 'POST') {
      return createErrorResponse('Method not allowed', 405, startTime);
    }

    console.log('=== PAYFAST PAYMENT REQUEST STARTED ===');

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new ValidationError('Server configuration error', 500);
    }

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // Fast auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createErrorResponse('Invalid authorization', 401, startTime);
    }

    // Parse request
    const requestBody = await req.json().catch(() => {
      throw new ValidationError('Invalid request body');
    });

    console.log('Validating request...');
    const validatedRequest = validatePaymentRequest(requestBody);
    const { merchantId, merchantKey } = validateEnvironment();

    // Get user
    console.log('Getting user...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return createErrorResponse('Authentication failed', 401, startTime);
    }

    console.log(`Processing payment for user: ${user.id}, amount: ${validatedRequest.amount}`);

    // Generate payment ID
    const paymentId = `${user.id.slice(-8)}_${Date.now()}`;
    
    // Create order (fast operation)
    console.log('Creating order...');
    const order = await createOrder(
      supabaseClient,
      user,
      validatedRequest.amount,
      validatedRequest.shipping_address,
      validatedRequest.billing_address,
      validatedRequest.cart_items,
      paymentId,
      validatedRequest.delivery_charge || 0
    );

    // Create order items asynchronously (don't wait)
    createOrderItems(supabaseClient, order.id, validatedRequest.cart_items)
      .catch(error => console.error('Order items creation failed:', error));

    // Prepare PayFast data
    console.log('Preparing PayFast data...');
    const baseUrl = req.headers.get('origin') || supabaseUrl.replace('/auth/v1', '');
    const paymentData = createPayFastData(
      merchantId,
      merchantKey,
      validatedRequest.amount,
      validatedRequest.billing_address,
      user,
      paymentId,
      order.id,
      validatedRequest.cart_items,
      baseUrl
    );

    // Generate signature
    console.log('Generating signature...');
    const signature = await generateSecurePayFastSignature(paymentData, merchantKey);
    
    const processingTime = Date.now() - startTime;
    console.log(`PayFast payment prepared successfully in ${processingTime}ms`);

    const response: SuccessResponse = {
      success: true,
      payment_url: 'https://www.payfast.co.za/eng/process',
      payment_data: {
        ...paymentData,
        signature
      },
      order_id: order.id,
      processing_time: processingTime
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return handleError(error, startTime);
  }
});

function createErrorResponse(message: string, status: number, startTime: number): Response {
  const response: ErrorResponse = {
    success: false,
    error: message,
    processing_time: Date.now() - startTime
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function handleError(error: any, startTime: number): Response {
  const processingTime = Date.now() - startTime;
  console.error('PayFast payment error:', error, `Processing time: ${processingTime}ms`);
  
  let errorMessage = 'Payment creation failed';
  let statusCode = 500;
  
  if (error instanceof ValidationError) {
    errorMessage = error.message;
    statusCode = error.statusCode;
  } else if (error.message?.includes('timeout')) {
    errorMessage = 'Request timeout - please try again';
    statusCode = 408;
  } else if (error.message?.includes('configuration')) {
    errorMessage = 'Payment system temporarily unavailable';
    statusCode = 503;
  }
  
  return createErrorResponse(errorMessage, statusCode, startTime);
}
