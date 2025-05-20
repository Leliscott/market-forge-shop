
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'No authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Create Supabase admin client
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: authHeader },
      },
    }
  );

  try {
    const { storeId } = await req.json();
    
    if (!storeId) {
      return new Response(
        JSON.stringify({ error: 'Missing storeId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get store details
    const { data: store, error: storeError } = await supabaseAdmin
      .from('stores')
      .select('name, description, logo, owner_id')
      .eq('id', storeId)
      .single();

    if (storeError) {
      return new Response(
        JSON.stringify({ error: 'Store not found', details: storeError.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get store owner details
    const { data: owner, error: ownerError } = await supabaseAdmin
      .from('profiles')
      .select('name, location')
      .eq('id', store.owner_id)
      .single();

    if (ownerError) {
      console.log('Error fetching owner profile:', ownerError);
    }

    // Generate a shareable link
    const baseUrl = req.headers.get('origin') || 'https://shopmarket.co.za';
    const shareUrl = `${baseUrl}/store/${storeId}`;

    return new Response(
      JSON.stringify({
        store: {
          ...store,
          owner: owner || null,
        },
        shareUrl,
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error sharing store:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
