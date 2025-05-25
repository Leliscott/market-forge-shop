
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
      return new Response(JSON.stringify({ error: 'Payment configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Yoco secret key configured:', !!yocoSecretKey)

    // Create payment with Yoco API
    console.log('Calling Yoco API...')
    const yocoResponse = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yocoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        amountInCents,
        currency,
        metadata: {
          orderId: metadata.orderId,
          userId: metadata.userId,
          itemCount: metadata.items.length
        }
      })
    })

    const yocoData = await yocoResponse.json()
    console.log('Yoco API response status:', yocoResponse.status)
    console.log('Yoco API response:', yocoData)

    if (!yocoResponse.ok) {
      console.error('Yoco payment failed:', yocoData)
      return new Response(JSON.stringify({ 
        error: 'Payment failed', 
        details: yocoData.displayMessage || yocoData.errorMessage || 'Payment processing error' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Yoco payment successful, creating order in database...')

    // Determine store_id from items (use first item's store)
    const storeId = metadata.items[0]?.storeId || null
    console.log('Store ID:', storeId)

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

    console.log('Creating order with data:', orderData)

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

    console.log('=== CREATE YOCO PAYMENT FUNCTION COMPLETED SUCCESSFULLY ===')

    return new Response(JSON.stringify(successResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('=== CREATE YOCO PAYMENT FUNCTION ERROR ===')
    console.error('Error processing payment:', error)
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
