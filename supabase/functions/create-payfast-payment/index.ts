
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
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the current user from the Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header missing')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      console.error('Auth error:', userError)
      throw new Error('Unauthorized - invalid token')
    }

    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const requestBody = await req.json()
    const { 
      amount, 
      shipping_address, 
      billing_address, 
      cart_items,
      delivery_service,
      delivery_charge,
      legal_compliance
    } = requestBody

    console.log('Creating PayFast payment for user:', user.id, 'amount:', amount)

    // Get PayFast credentials from environment
    const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID')
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY')
    
    if (!merchantId || !merchantKey) {
      console.error('PayFast credentials missing:', { merchantId: !!merchantId, merchantKey: !!merchantKey })
      throw new Error('PayFast credentials not configured')
    }

    // Generate unique payment ID
    const paymentId = `${user.id}_${Date.now()}`
    
    // Create order record in database with all required fields
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: amount,
        status: 'pending',
        payment_method: 'payfast',
        payment_id: paymentId,
        payment_status: 'pending',
        shipping_address: shipping_address,
        billing_address: billing_address,
        items: cart_items,
        delivery_charge: delivery_charge || 0,
        store_id: cart_items && cart_items.length > 0 ? cart_items[0]?.storeId : null
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    console.log('Order created successfully:', order.id)

    // Create order items if cart_items exist
    if (cart_items && cart_items.length > 0) {
      const orderItems = cart_items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }))

      const { error: itemsError } = await supabaseClient
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Error creating order items:', itemsError)
        // Don't throw here, order items are not critical for payment
      }
    }

    // Prepare PayFast payment data for LIVE mode
    const baseUrl = req.headers.get('origin') || 'https://xmacsqjdknfpfxzmwjrk.supabase.co'
    
    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${baseUrl}/orders?payment=success&order_id=${order.id}`,
      cancel_url: `${baseUrl}/checkout?payment=cancelled`,
      notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payfast-webhook`,
      name_first: billing_address?.firstName || 'Customer',
      name_last: billing_address?.lastName || 'Customer',
      email_address: user.email || billing_address?.email || '',
      cell_number: billing_address?.phone || '',
      m_payment_id: paymentId,
      amount: amount.toFixed(2),
      item_name: `Order #${order.id.toString().slice(0, 8)}`,
      item_description: `${cart_items?.length || 0} items from marketplace`,
      custom_str1: order.id.toString(),
      custom_str2: user.id,
    }

    console.log('PayFast payment data:', paymentData)

    // Generate signature for PayFast using proper MD5 implementation
    const signature = await generatePayFastSignature(paymentData, merchantKey)
    
    const response = {
      success: true,
      payment_url: 'https://www.payfast.co.za/eng/process', // Live PayFast URL
      payment_data: {
        ...paymentData,
        signature
      },
      order_id: order.id
    }

    console.log('PayFast payment data prepared successfully, signature:', signature)

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
  // Create parameter string - exclude merchant_key and signature from the string
  const filteredData = { ...data }
  delete filteredData.merchant_key
  delete filteredData.signature
  
  const params = Object.keys(filteredData)
    .filter(key => filteredData[key] !== '' && filteredData[key] !== null && filteredData[key] !== undefined)
    .sort()
    .map(key => `${key}=${encodeURIComponent(filteredData[key])}`)
    .join('&')
  
  // Add passphrase if provided
  const stringToSign = passphrase ? params + `&passphrase=${encodeURIComponent(passphrase)}` : params
  
  console.log('String to sign for PayFast:', stringToSign)
  
  // Generate MD5 hash using crypto-js
  try {
    const { MD5 } = await import('https://deno.land/x/crypto_js@4.1.1/mod.ts')
    const hash = MD5(stringToSign).toString()
    console.log('Generated MD5 signature:', hash)
    return hash
  } catch (error) {
    console.error('Error generating MD5 hash:', error)
    throw new Error('Failed to generate payment signature')
  }
}
