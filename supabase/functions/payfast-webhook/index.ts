
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse webhook data
    const formData = await req.formData()
    const webhookData: Record<string, string> = {}
    
    for (const [key, value] of formData.entries()) {
      webhookData[key] = value.toString()
    }

    console.log('PayFast webhook received:', webhookData)

    // Verify webhook signature
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY')
    if (!merchantKey) {
      throw new Error('PayFast merchant key not configured')
    }

    const isValidSignature = await verifyPayFastSignature(webhookData, merchantKey)
    if (!isValidSignature) {
      console.error('Invalid PayFast webhook signature')
      return new Response('Invalid signature', { status: 400 })
    }

    // Extract payment information
    const orderId = webhookData.custom_str1
    const userId = webhookData.custom_str2
    const paymentStatus = webhookData.payment_status
    const amountGross = parseFloat(webhookData.amount_gross || '0')

    // Update order status based on payment status
    let orderStatus = 'pending'
    if (paymentStatus === 'COMPLETE') {
      orderStatus = 'paid'
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
      orderStatus = 'failed'
    }

    // Update order in database
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        paid_amount: paymentStatus === 'COMPLETE' ? amountGross : null,
        payment_date: paymentStatus === 'COMPLETE' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      throw new Error('Failed to update order')
    }

    // If payment is complete, clear user's cart
    if (paymentStatus === 'COMPLETE') {
      // Note: Cart is managed in localStorage on frontend, so we'll handle this there
      console.log(`Payment completed for order ${orderId}`)
    }

    return new Response('OK', {
      headers: corsHeaders,
    })

  } catch (error) {
    console.error('PayFast webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function verifyPayFastSignature(data: Record<string, string>, passphrase: string): Promise<boolean> {
  const signature = data.signature
  delete data.signature

  // Create parameter string
  const params = Object.keys(data)
    .filter(key => data[key] !== '')
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&')
  
  // Add passphrase
  const stringToSign = params + `&passphrase=${encodeURIComponent(passphrase)}`
  
  // Generate MD5 hash
  const encoder = new TextEncoder()
  const data_bytes = encoder.encode(stringToSign)
  const hash = await crypto.subtle.digest('MD5', data_bytes)
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex === signature
}
