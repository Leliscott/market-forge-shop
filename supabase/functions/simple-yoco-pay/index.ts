
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

export interface YocoPaymentResponse {
  success: boolean
  checkoutUrl?: string
  checkoutId?: string
  error?: string
  details?: any
}

const createYocoPayment = async (req: Request): Promise<YocoPaymentResponse> => {
  try {
    console.log('=== SIMPLE YOCO PAY FUNCTION STARTED ===')
    
    const { amount, paymentId, successUrl, cancelUrl, failureUrl }: YocoPaymentRequest = await req.json()
    
    console.log('Payment request:', { amount, paymentId, successUrl, cancelUrl, failureUrl })

    // Get Yoco secret key
    const yocoSecretKey = Deno.env.get('YOCO_SECRET_KEY')
    if (!yocoSecretKey) {
      console.error('YOCO_SECRET_KEY not found in environment')
      return {
        success: false,
        error: 'Payment configuration error'
      }
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

    const yocoResponse = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yocoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutPayload)
    })

    console.log('Yoco response status:', yocoResponse.status)
    console.log('Yoco response headers:', Object.fromEntries(yocoResponse.headers.entries()))

    const responseText = await yocoResponse.text()
    console.log('Yoco raw response:', responseText)

    if (!yocoResponse.ok) {
      console.error('Yoco checkout creation failed with status:', yocoResponse.status)
      console.error('Response body:', responseText)
      
      return {
        success: false,
        error: 'Failed to create checkout session',
        details: responseText.substring(0, 500)
      }
    }

    let yocoData
    try {
      yocoData = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse Yoco response as JSON:', parseError)
      console.error('Response was:', responseText.substring(0, 200))
      
      return {
        success: false,
        error: 'Invalid response from payment provider',
        details: 'Response was not valid JSON'
      }
    }

    console.log('Parsed Yoco data:', yocoData)

    // Return the checkout URL
    const checkoutUrl = yocoData.redirectUrl || yocoData.url
    if (!checkoutUrl) {
      console.error('No checkout URL found in response:', yocoData)
      return {
        success: false,
        error: 'No checkout URL received from payment provider',
        details: yocoData
      }
    }

    return {
      success: true,
      checkoutUrl: checkoutUrl,
      checkoutId: yocoData.id
    }

  } catch (error) {
    console.error('Simple Yoco pay error:', error)
    return {
      success: false,
      error: 'Internal server error',
      details: error.message
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    })
  }

  const result = await createYocoPayment(req)
  
  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: result.success ? 200 : 500
  })
})

export { createYocoPayment }
