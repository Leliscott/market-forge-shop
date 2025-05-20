
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

// Allow cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: { persistSession: false },
      }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Setup auth client
    supabaseClient.auth.setSession({
      access_token: authHeader.replace("Bearer ", ""),
      refresh_token: "",
    });

    // Get request data
    const { store_id, recipient_email, custom_message } = await req.json();

    if (!store_id || !recipient_email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get store information
    const { data: storeData, error: storeError } = await supabaseClient
      .from("stores")
      .select("name, owner_id, description")
      .eq("id", store_id)
      .single();

    if (storeError) {
      return new Response(JSON.stringify({ error: `Store error: ${storeError.message}` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get profile information of the owner
    const { data: profileData, error: profileError } = await supabaseClient
      .from("profiles")
      .select("name, email")
      .eq("id", storeData.owner_id)
      .single();

    if (profileError) {
      return new Response(JSON.stringify({ error: `Profile error: ${profileError.message}` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate store link
    const storeLink = `${req.headers.get("origin")}/store/${store_id}`;

    // Here you would normally call your email service provider
    // For demonstration, we're just returning success with the information that would be sent
    const emailDetails = {
      to: recipient_email,
      from: profileData.email,
      subject: `Visit ${storeData.name} on ShopMarket`,
      message: custom_message || `${profileData.name} has invited you to visit their store on ShopMarket.`,
      storeLink: storeLink,
    };

    console.log("Would send email with details:", emailDetails);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Store invitation link would be sent to ${recipient_email}`,
        store_link: storeLink
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
