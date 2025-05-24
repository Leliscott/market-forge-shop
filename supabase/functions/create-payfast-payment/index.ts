
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

// Cache for frequently used values
const ENV_CACHE = {
  supabaseUrl: Deno.env.get('SUPABASE_URL') ?? '',
  serviceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
};

serve(async (req) => {
  // Handle CORS preflight requests immediately
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    // Validate method early
    if (req.method !== 'POST') {
      return createErrorResponse('Method not allowed', 405, startTime);
    }

    // Initialize Supabase client with cached values
    if (!ENV_CACHE.supabaseUrl || !ENV_CACHE.serviceRoleKey) {
      throw new ValidationError('Supabase configuration missing', 500);
    }

    const supabaseClient = createClient(ENV_CACHE.supabaseUrl, ENV_CACHE.serviceRoleKey);

    // Fast auth validation
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('Authorization header missing or invalid', 401, startTime);
    }

    // Parse and validate request body
    const requestBody = await parseRequestBody(req);
    const validatedRequest = validatePaymentRequest(requestBody);
    const { merchantId, merchantKey } = validateEnvironment();

    // Get user with timeout
    const { data: { user }, error: userError } = await getUser(supabaseClient, authHeader);
    if (userError || !user) {
      console.error('Auth error:', userError);
      return createErrorResponse('Authentication failed', 401, startTime);
    }

    console.log('Creating PayFast payment for user:', user.id, 'amount:', validatedRequest.amount, 'time:', Date.now() - startTime + 'ms');

    // Generate secure payment ID
    const timestamp = Date.now();
    const paymentId = `${user.id.slice(-8)}_${timestamp}`;
    
    // Create order
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

    // Create order items in background - fix the async call
    createOrderItems(supabaseClient, order.id, validatedRequest.cart_items);

    // Prepare PayFast payment data
    const baseUrl = req.headers.get('origin') || ENV_CACHE.supabaseUrl.replace('/auth/v1', '');
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
    const signature = await generateSecurePayFastSignature(paymentData, merchantKey);
    
    const processingTime = Date.now() - startTime;
    console.log('PayFast payment prepared successfully in', processingTime + 'ms');

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

async function parseRequestBody(req: Request) {
  try {
    return await req.json();
  } catch (error) {
    throw new ValidationError('Invalid JSON payload');
  }
}

async function getUser(supabaseClient: any, authHeader: string) {
  const authPromise = supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Auth timeout')), 5000)
  );
  
  return await Promise.race([authPromise, timeoutPromise]) as any;
}

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
  console.error('PayFast payment error:', error, 'time:', processingTime + 'ms');
  
  let errorMessage = 'Payment creation failed';
  let statusCode = 500;
  
  if (error instanceof ValidationError) {
    errorMessage = error.message;
    statusCode = error.statusCode;
  } else if (error.message?.includes('timeout') || error.message?.includes('Auth timeout')) {
    errorMessage = 'Request timeout - please try again';
    statusCode = 408;
  } else if (error.message?.includes('configuration') || error.message?.includes('credentials')) {
    errorMessage = 'Payment system temporarily unavailable';
    statusCode = 503;
  }
  
  return createErrorResponse(errorMessage, statusCode, startTime);
}
