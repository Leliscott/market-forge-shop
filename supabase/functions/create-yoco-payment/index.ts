
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { token, amountInCents, currency, metadata }: PaymentRequest = await req.json()

    console.log('Processing Yoco payment:', { amountInCents, currency, orderId: metadata.orderId })

    // Create payment with Yoco API
    const yocoResponse = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('YOCO_SECRET_KEY')}`,
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

    if (!yocoResponse.ok) {
      console.error('Yoco payment failed:', yocoData)
      return new Response(JSON.stringify({ 
        error: 'Payment failed', 
        details: yocoData.displayMessage || 'Payment processing error' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Yoco payment successful:', yocoData.id)

    // Create order in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        store_id: metadata.items[0]?.storeId,
        total_amount: amountInCents / 100,
        payment_id: yocoData.id,
        payment_method: 'yoco',
        payment_status: 'completed',
        status: 'confirmed',
        items: metadata.items,
        payment_date: new Date().toISOString()
      })
      .select()
      .single()

    if (orderError) {
      console.error('Failed to create order:', orderError)
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      payment: yocoData,
      order: order
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error processing payment:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
