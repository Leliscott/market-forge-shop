
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Cache for frequently used values
const ENV_CACHE = {
  supabaseUrl: Deno.env.get('SUPABASE_URL') ?? '',
  serviceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  merchantId: Deno.env.get('PAYFAST_MERCHANT_ID') ?? '',
  merchantKey: Deno.env.get('PAYFAST_MERCHANT_KEY') ?? '',
}

serve(async (req) => {
  // Handle CORS preflight requests immediately
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const startTime = Date.now()
  
  try {
    // Validate method early
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client with cached values
    if (!ENV_CACHE.supabaseUrl || !ENV_CACHE.serviceRoleKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabaseClient = createClient(ENV_CACHE.supabaseUrl, ENV_CACHE.serviceRoleKey)

    // Fast auth validation
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization header missing or invalid' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body with error handling
    let requestBody
    try {
      requestBody = await req.json()
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate required fields early
    const { amount, shipping_address, billing_address, cart_items } = requestBody
    if (!amount || !shipping_address || !billing_address || !cart_items?.length) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate amount
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > 100000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify PayFast credentials
    if (!ENV_CACHE.merchantId || !ENV_CACHE.merchantKey) {
      console.error('PayFast credentials missing')
      return new Response(
        JSON.stringify({ success: false, error: 'Payment system configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user with timeout
    const authPromise = supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Auth timeout')), 5000)
    )
    
    const { data: { user }, error: userError } = await Promise.race([authPromise, timeoutPromise]) as any

    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating PayFast payment for user:', user.id, 'amount:', numAmount, 'time:', Date.now() - startTime + 'ms')

    // Generate secure payment ID with timestamp and user validation
    const timestamp = Date.now()
    const paymentId = `${user.id.slice(-8)}_${timestamp}`
    
    // Create order with optimized data structure
    const orderData = {
      user_id: user.id,
      total_amount: numAmount,
      status: 'pending',
      payment_method: 'payfast',
      payment_id: paymentId,
      payment_status: 'pending',
      shipping_address,
      billing_address,
      items: cart_items,
      delivery_charge: requestBody.delivery_charge || 0,
      store_id: cart_items[0]?.storeId || null,
      created_at: new Date().toISOString()
    }

    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert(orderData)
      .select('id')
      .single()

    if (orderError) {
      console.error('Order creation failed:', orderError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create order items in parallel (non-blocking)
    if (cart_items?.length > 0) {
      const orderItems = cart_items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }))

      // Don't await this - let it run in background
      supabaseClient.from('order_items').insert(orderItems).catch(error => 
        console.error('Order items creation failed (non-critical):', error)
      )
    }

    // Prepare PayFast payment data with security validations
    const baseUrl = req.headers.get('origin') || ENV_CACHE.supabaseUrl.replace('/auth/v1', '')
    
    // Validate and sanitize user input
    const firstName = (billing_address?.firstName || 'Customer').replace(/[^a-zA-Z\s]/g, '').slice(0, 50)
    const lastName = (billing_address?.lastName || 'Customer').replace(/[^a-zA-Z\s]/g, '').slice(0, 50)
    const email = user.email || billing_address?.email || ''
    const phone = (billing_address?.phone || '').replace(/[^0-9+\-\s]/g, '').slice(0, 20)

    const paymentData = {
      merchant_id: ENV_CACHE.merchantId,
      merchant_key: ENV_CACHE.merchantKey,
      return_url: `${baseUrl}/orders?payment=success&order_id=${order.id}`,
      cancel_url: `${baseUrl}/checkout?payment=cancelled`,
      notify_url: `${ENV_CACHE.supabaseUrl}/functions/v1/payfast-webhook`,
      name_first: firstName,
      name_last: lastName,
      email_address: email,
      cell_number: phone,
      m_payment_id: paymentId,
      amount: numAmount.toFixed(2),
      item_name: `Order #${order.id.toString().slice(0, 8)}`,
      item_description: `${cart_items.length} items from marketplace`,
      custom_str1: order.id.toString(),
      custom_str2: user.id,
    }

    // Generate signature with enhanced security
    const signature = await generateSecurePayFastSignature(paymentData, ENV_CACHE.merchantKey)
    
    const processingTime = Date.now() - startTime
    console.log('PayFast payment prepared successfully in', processingTime + 'ms')

    const response = {
      success: true,
      payment_url: 'https://www.payfast.co.za/eng/process',
      payment_data: {
        ...paymentData,
        signature
      },
      order_id: order.id,
      processing_time: processingTime
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error('PayFast payment error:', error, 'time:', processingTime + 'ms')
    
    // Categorize errors for better user experience
    let errorMessage = 'Payment creation failed'
    let statusCode = 500
    
    if (error.message?.includes('timeout') || error.message?.includes('Auth timeout')) {
      errorMessage = 'Request timeout - please try again'
      statusCode = 408
    } else if (error.message?.includes('configuration') || error.message?.includes('credentials')) {
      errorMessage = 'Payment system temporarily unavailable'
      statusCode = 503
    } else if (error.message?.includes('Invalid') || error.message?.includes('Missing')) {
      errorMessage = error.message
      statusCode = 400
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        processing_time: processingTime
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function generateSecurePayFastSignature(data: Record<string, string>, passphrase: string): Promise<string> {
  try {
    // Validate inputs
    if (!data || typeof data !== 'object' || !passphrase) {
      throw new Error('Invalid signature parameters')
    }

    // Create parameter string with security checks
    const filteredData = { ...data }
    delete filteredData.merchant_key
    delete filteredData.signature
    
    // Filter and validate parameters
    const params = Object.keys(filteredData)
      .filter(key => {
        const value = filteredData[key]
        return value !== '' && value !== null && value !== undefined && typeof value === 'string'
      })
      .sort()
      .map(key => {
        // Encode values properly for security
        const encodedValue = encodeURIComponent(filteredData[key])
        return `${key}=${encodedValue}`
      })
      .join('&')
    
    if (!params) {
      throw new Error('No valid parameters for signature')
    }
    
    // Add passphrase securely
    const stringToSign = `${params}&passphrase=${encodeURIComponent(passphrase)}`
    
    console.log('String to sign length:', stringToSign.length)
    
    // Generate MD5 hash with error handling
    const encoder = new TextEncoder()
    const dataBytes = encoder.encode(stringToSign)
    
    if (dataBytes.length === 0) {
      throw new Error('Empty data for hashing')
    }
    
    const hashBuffer = await crypto.subtle.digest('MD5', dataBytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // Validate generated hash
    if (!hash || hash.length !== 32) {
      throw new Error('Invalid hash generated')
    }
    
    console.log('Generated secure MD5 signature:', hash.slice(0, 8) + '...')
    return hash
  } catch (error) {
    console.error('Signature generation error:', error)
    throw new Error('Failed to generate secure payment signature')
  }
}
