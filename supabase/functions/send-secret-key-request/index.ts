
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SecretKeyRequestEmail {
  requesterEmail: string;
  requesterName: string;
  reason: string;
  generatedSecret: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requesterEmail, requesterName, reason, generatedSecret }: SecretKeyRequestEmail = await req.json();

    const masterAgentEmail = 'tshomela23rd@gmail.com';
    
    // Log email notification
    await supabase
      .from('email_notifications')
      .insert({
        recipient_email: masterAgentEmail,
        email_type: 'secret_key_request',
        subject: `New Secret Key Request from ${requesterName}`,
        content: `
          Agent Secret Key Request Details:
          
          Requester: ${requesterName}
          Email: ${requesterEmail}
          Reason: ${reason}
          Generated Secret: ${generatedSecret}
          
          Please review and approve/reject this request in the Agent Dashboard.
        `
      });

    console.log('Secret key request notification sent to:', masterAgentEmail);
    console.log('Request details:', {
      requesterEmail,
      requesterName,
      reason,
      secretGenerated: true
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Secret key request notification sent to master agent'
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-secret-key-request function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
