
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number
  item_name: string
  item_description: string
  email_address: string
  name_first: string
  name_last: string
  cell_number?: string
  m_payment_id: string
  return_url: string
  cancel_url: string
  notify_url: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const { 
      amount, 
      shipping_address, 
      billing_address, 
      cart_items 
    }: {
      amount: number
      shipping_address: any
      billing_address: any
      cart_items: any[]
    } = await req.json()

    console.log('Creating PayFast payment for user:', user.id, 'amount:', amount)

    // Get PayFast credentials from environment
    const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID')
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY')
    
    if (!merchantId || !merchantKey) {
      throw new Error('PayFast credentials not configured')
    }

    // Generate unique payment ID
    const paymentId = `${user.id}_${Date.now()}`
    
    // Create order record in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: amount,
        status: 'pending',
        payment_method: 'payfast',
        payment_id: paymentId,
        shipping_address: shipping_address,
        billing_address: billing_address,
        items: cart_items
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      throw new Error('Failed to create order')
    }

    // Prepare PayFast payment data
    const baseUrl = req.headers.get('origin') || 'https://yoursite.lovable.app'
    
    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${baseUrl}/orders?payment=success&order_id=${order.id}`,
      cancel_url: `${baseUrl}/checkout?payment=cancelled`,
      notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payfast-webhook`,
      name_first: billing_address.firstName,
      name_last: billing_address.lastName,
      email_address: user.email,
      cell_number: billing_address.phone || '',
      m_payment_id: paymentId,
      amount: amount.toFixed(2),
      item_name: `Order #${order.id}`,
      item_description: `${cart_items.length} items from marketplace`,
      custom_str1: order.id.toString(),
      custom_str2: user.id,
    }

    // Generate signature for PayFast
    const signature = await generatePayFastSignature(paymentData, merchantKey)
    
    const response = {
      success: true,
      payment_url: 'https://www.payfast.co.za/eng/process',
      payment_data: {
        ...paymentData,
        signature
      },
      order_id: order.id
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('PayFast payment creation error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Payment creation failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function generatePayFastSignature(data: Record<string, string>, passphrase: string): Promise<string> {
  // Create parameter string
  const params = Object.keys(data)
    .filter(key => key !== 'signature' && data[key] !== '')
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
  
  return hashHex
}
