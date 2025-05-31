
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface PaymentFlowRequest {
  amount: number
  paymentId: string
  successUrl: string
  cancelUrl: string
  failureUrl: string
  customerEmail?: string
  customerName?: string
  storeName?: string
  sellerEmail?: string
  itemsCount?: number
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const waitForYocoSuccess = async (paymentData: PaymentFlowRequest) => {
  console.log('=== STARTING YOCO PAYMENT FLOW ===')
  
  try {
    // Call simple-yoco-pay function
    const { data: yocoResponse, error: yocoError } = await supabase.functions.invoke('simple-yoco-pay', {
      body: {
        amount: paymentData.amount,
        paymentId: paymentData.paymentId,
        successUrl: paymentData.successUrl,
        cancelUrl: paymentData.cancelUrl,
        failureUrl: paymentData.failureUrl
      }
    })

    console.log('Yoco response received:', yocoResponse)

    if (yocoError || !yocoResponse?.success) {
      console.error('Yoco payment failed:', yocoError || yocoResponse)
      throw new Error('Failed to create Yoco payment session')
    }

    console.log('=== YOCO PAYMENT SUCCESS - TRIGGERING EMAILS ===')

    // Trigger email notifications on success
    const emailPromises = []

    // Send customer confirmation email
    if (paymentData.customerEmail && paymentData.customerName) {
      console.log('Sending customer confirmation email...')
      const customerEmailPromise = supabase.functions.invoke('dyn-email-handler', {
        body: {
          type: 'order_confirmation',
          to: paymentData.customerEmail,
          data: {
            orderId: paymentData.paymentId.slice(0, 8),
            customerName: paymentData.customerName,
            storeName: paymentData.storeName || 'Unknown Store',
            total: paymentData.amount
          }
        }
      })
      emailPromises.push(customerEmailPromise)
    }

    // Send seller notification email
    if (paymentData.sellerEmail) {
      console.log('Sending seller notification email...')
      const sellerEmailPromise = supabase.functions.invoke('dyn-email-handler', {
        body: {
          type: 'order_seller_notification',
          to: paymentData.sellerEmail,
          data: {
            orderId: paymentData.paymentId.slice(0, 8),
            customerName: paymentData.customerName || 'Customer',
            total: paymentData.amount,
            itemsCount: paymentData.itemsCount || 1
          }
        }
      })
      emailPromises.push(sellerEmailPromise)
    }

    // Wait for all emails to be sent
    const emailResults = await Promise.allSettled(emailPromises)
    
    emailResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Email ${index + 1} sent successfully`)
      } else {
        console.error(`Email ${index + 1} failed:`, result.reason)
      }
    })

    return {
      success: true,
      checkoutUrl: yocoResponse.checkoutUrl,
      checkoutId: yocoResponse.checkoutId,
      emailsSent: emailResults.filter(r => r.status === 'fulfilled').length,
      totalEmails: emailResults.length
    }

  } catch (error) {
    console.error('Payment flow error:', error)
    throw error
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

  try {
    const paymentData: PaymentFlowRequest = await req.json()
    console.log('Received payment flow request:', paymentData)

    const result = await waitForYocoSuccess(paymentData)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error: any) {
    console.error('Handle Yoco payment error:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Payment flow failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
