
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SecretKeyRequest {
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
    const { requesterEmail, requesterName, reason, generatedSecret }: SecretKeyRequest = await req.json();

    const masterAgentEmail = 'tshomela23rd@gmail.com';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">🔐 New Secret Key Request</h1>
        
        <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Request Details</h2>
          <p><strong>Requester Name:</strong> ${requesterName}</p>
          <p><strong>Requester Email:</strong> ${requesterEmail}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p><strong>Request Time:</strong> ${new Date().toLocaleString('en-ZA')}</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Generated Secret Key</h3>
          <p style="font-family: monospace; background-color: #1f2937; color: #f9fafb; padding: 15px; border-radius: 5px; word-break: break-all;">
            ${generatedSecret}
          </p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Action Required:</strong></p>
          <ul>
            <li>Review the request details</li>
            <li>Verify the requester's identity</li>
            <li>Approve or reject the request in the Agent Dashboard</li>
            <li>If approved, provide the secret key to the requester</li>
          </ul>
        </div>
        
        <p><em>This request was automatically generated from the agent portal.</em></p>
      </div>
    `;

    await resend.emails.send({
      from: "ShopMarket <noreply@shop4ll.co.za>",
      to: [masterAgentEmail],
      subject: `🔐 Secret Key Request from ${requesterName}`,
      html: emailHtml,
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
        message: 'Secret key request notification sent via Resend',
        recipient: masterAgentEmail
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
