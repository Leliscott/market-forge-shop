
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface YocoPaymentRequest {
  amount: number
  paymentId: string
  successUrl: string
  cancelUrl: string
  failureUrl: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    })
  }

  try {
    console.log('=== SIMPLE YOCO PAY FUNCTION STARTED ===')
    
    const { amount, paymentId, successUrl, cancelUrl, failureUrl }: YocoPaymentRequest = await req.json()
    
    console.log('Payment request:', { amount, paymentId, successUrl, cancelUrl, failureUrl })

    // Get Yoco secret key
    const yocoSecretKey = Deno.env.get('YOCO_SECRET_KEY')
    if (!yocoSecretKey) {
      console.error('YOCO_SECRET_KEY not found in environment')
      return new Response(JSON.stringify({ error: 'Payment configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create checkout session with Yoco
    const checkoutPayload = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'ZAR',
      cancelUrl,
      successUrl,
      failureUrl,
      metadata: {
        paymentId,
        source: 'shop4ll'
      }
    }

    console.log('Creating Yoco checkout session:', checkoutPayload)

    const yocoResponse = await fetch('https://online.yoco.com/v1/checkouts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yocoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutPayload)
    })

    const yocoData = await yocoResponse.json()
    console.log('Yoco response:', yocoData)

    if (!yocoResponse.ok) {
      console.error('Yoco checkout creation failed:', yocoData)
      return new Response(JSON.stringify({ 
        error: 'Failed to create checkout session',
        details: yocoData 
      }), {
        status: yocoResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Return the checkout URL
    return new Response(JSON.stringify({
      success: true,
      checkoutUrl: yocoData.redirectUrl || yocoData.url,
      checkoutId: yocoData.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Simple Yoco pay error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
