
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  token: string
  amountInCents: number
  currency: string
  metadata: {
    orderId: string
    userId: string
    items: any[]
  }
}

// Helper function to retry API calls
async function retryApiCall(fn: () => Promise<Response>, maxRetries = 2, delay = 1000): Promise<Response> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fn()
      
      // If it's not a server error (5xx), return immediately
      if (response.status < 500) {
        return response
      }
      
      // If it's the last attempt, return the response
      if (attempt === maxRetries) {
        return response
      }
      
      console.log(`Attempt ${attempt + 1} failed with status ${response.status}, retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
      
    } catch (error) {
      lastError = error as Error
      if (attempt === maxRetries) {
        throw lastError
      }
      
      console.log(`Attempt ${attempt + 1} failed with error: ${error.message}, retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2
    }
  }
  
  throw lastError || new Error('All retry attempts failed')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('=== CREATE YOCO PAYMENT FUNCTION STARTED ===')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    console.log('Auth header present:', !!authHeader)
    
    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (!user) {
      console.error('User not authenticated')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('User authenticated:', user.id)

    const requestBody = await req.json()
    console.log('Request body received:', requestBody)
    
    const { token, amountInCents, currency, metadata }: PaymentRequest = requestBody

    // Validate payment data
    if (!token || !amountInCents || !currency || !metadata) {
      console.error('Missing required payment data')
      return new Response(JSON.stringify({ error: 'Missing required payment data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (amountInCents < 100) { // Minimum 1 ZAR
      console.error('Amount too small:', amountInCents)
      return new Response(JSON.stringify({ error: 'Amount must be at least 1 ZAR' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Processing Yoco payment:', { 
      amountInCents, 
      currency, 
      orderId: metadata.orderId,
      token: token.substring(0, 10) + '...' // Log partial token for security
    })

    // Get Yoco secret key
    const yocoSecretKey = Deno.env.get('YOCO_SECRET_KEY')
    if (!yocoSecretKey) {
      console.error('YOCO_SECRET_KEY not found in environment')
      return new Response(JSON.stringify({ error: 'Payment configuration error - secret key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Yoco secret key configured:', !!yocoSecretKey)
    console.log('Yoco secret key length:', yocoSecretKey.length)
    console.log('Yoco secret key starts with sk_live_:', yocoSecretKey.startsWith('sk_live_'))

    // Prepare Yoco payload - use exact format from Yoco docs
    const yocoPayload = {
      token,
      amountInCents,
      currency,
      metadata: {
        orderId: metadata.orderId,
        userId: metadata.userId,
        itemCount: metadata.items.length
      }
    }

    console.log('Yoco payload prepared:', JSON.stringify(yocoPayload, null, 2))

    // Create payment with Yoco API - improved headers and error handling
    console.log('Making Yoco API call...')
    const yocoResponse = await retryApiCall(async () => {
      console.log('Calling Yoco API with optimized headers...')
      
      // Ensure proper authorization header format
      const authorizationHeader = `Bearer ${yocoSecretKey.trim()}`
      console.log('Authorization header format verified:', authorizationHeader.substring(0, 20) + '...')
      
      return fetch('https://online.yoco.com/v1/charges/', {
        method: 'POST',
        headers: {
          'Authorization': authorizationHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Marketplace-App/1.0'
        },
        body: JSON.stringify(yocoPayload)
      })
    })

    console.log('Yoco API response status:', yocoResponse.status)
    console.log('Yoco API response ok:', yocoResponse.ok)

    const yocoData = await yocoResponse.json()
    console.log('Yoco API response data:', JSON.stringify(yocoData, null, 2))

    if (!yocoResponse.ok) {
      console.error('Yoco payment failed:', {
        status: yocoResponse.status,
        statusText: yocoResponse.statusText,
        data: yocoData
      })
      
      // Enhanced error handling for different error types
      let errorMessage = 'Payment processing failed'
      let userFriendlyMessage = 'Payment could not be processed. Please try again.'
      
      // Handle specific 401 authorization errors
      if (yocoResponse.status === 401 || yocoData.code === 401) {
        console.error('CRITICAL: 401 Authorization Error - Check YOCO_SECRET_KEY')
        userFriendlyMessage = 'Payment service authorization failed. Please contact support.'
        errorMessage = 'Authorization failed - invalid or missing secret key'
      } else if (yocoData.displayMessage) {
        errorMessage = yocoData.displayMessage
        userFriendlyMessage = yocoData.displayMessage
      } else if (yocoData.errorMessage) {
        errorMessage = yocoData.errorMessage
        userFriendlyMessage = yocoData.errorMessage
      } else if (yocoData.message) {
        errorMessage = yocoData.message
        userFriendlyMessage = yocoData.message
      }

      return new Response(JSON.stringify({ 
        error: 'Payment failed', 
        details: userFriendlyMessage,
        yocoError: yocoData,
        statusCode: yocoResponse.status,
        retryable: yocoResponse.status >= 500 && yocoResponse.status !== 502
      }), {
        status: yocoResponse.status === 401 ? 401 : (yocoResponse.status >= 500 ? 502 : 400),
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Yoco payment successful! Payment ID:', yocoData.id)

    // Determine store_id from items (use first item's store)
    const storeId = metadata.items[0]?.storeId || null
    console.log('Store ID for order:', storeId)

    if (!storeId) {
      console.error('No store ID found in items')
      return new Response(JSON.stringify({ 
        error: 'Invalid order data - no store found' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create order in database
    const orderData = {
      user_id: user.id,
      store_id: storeId,
      total_amount: amountInCents / 100,
      payment_id: yocoData.id,
      payment_method: 'yoco',
      payment_status: 'completed',
      status: 'confirmed',
      items: metadata.items,
      payment_date: new Date().toISOString()
    }

    console.log('Creating order with data:', JSON.stringify(orderData, null, 2))

    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('Failed to create order:', orderError)
      return new Response(JSON.stringify({ 
        error: 'Failed to create order',
        details: orderError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Order created successfully:', order.id)

    const successResponse = {
      success: true,
      payment: yocoData,
      order: order
    }

    console.log('=== YOCO PAYMENT COMPLETED SUCCESSFULLY ===')

    return new Response(JSON.stringify(successResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('=== PAYMENT FUNCTION CRITICAL ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', error.stack)
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
