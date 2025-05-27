
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { secretKey } = await req.json();
    const masterKey = Deno.env.get("MASTER_KEY");

    if (!masterKey) {
      console.error('MASTER_KEY not configured in Supabase secrets');
      return new Response(
        JSON.stringify({ 
          isValid: false, 
          error: "Master key not configured" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const isValid = secretKey === masterKey;

    console.log('Master key validation attempt:', {
      provided: secretKey ? 'provided' : 'missing',
      isValid: isValid
    });

    return new Response(
      JSON.stringify({ 
        isValid: isValid,
        message: isValid ? "Valid master key" : "Invalid master key"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in validate-master-key function:', error);
    return new Response(
      JSON.stringify({ 
        isValid: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
