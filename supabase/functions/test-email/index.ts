
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== TEST EMAIL FUNCTION STARTED ===');
    
    const testEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Shop4ll Logo -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #14b8a6;">
            <div style="background: linear-gradient(135deg, #14b8a6, #06b6d4); padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 10px;">
              <span style="color: white; font-size: 28px; font-weight: bold; letter-spacing: 1px;">Shop4ll</span>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Your Trusted Marketplace</p>
          </div>

          <h1 style="color: #14b8a6; margin: 0 0 20px 0;">✅ Email System Test Successful!</h1>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h2 style="color: #065f46; margin: 0 0 15px 0;">Test Results</h2>
            <p style="color: #065f46; margin: 5px 0;">✅ Resend integration is working</p>
            <p style="color: #065f46; margin: 5px 0;">✅ Email templates are rendering correctly</p>
            <p style="color: #065f46; margin: 5px 0;">✅ SMTP configuration is active</p>
            <p style="color: #065f46; margin: 5px 0;">✅ Shop4ll branding is applied</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-weight: bold;">📧 Support Information</p>
            <p style="color: #92400e; margin: 10px 0 0 0;">For any assistance, contact our support team:</p>
            <p style="color: #92400e; margin: 5px 0 0 0;">Email: <a href="mailto:mainshop@shop4ll.co.za" style="color: #14b8a6;">mainshop@shop4ll.co.za</a></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Test sent at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    `;

    const emailResult = await resend.emails.send({
      from: "Shop4ll <mainshop@shop4ll.co.za>",
      to: ["tshomela23rd@gmail.com"],
      subject: "✅ Shop4ll Email System Test",
      html: testEmailHtml,
    });

    console.log('Test email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully via Resend',
        emailId: emailResult.data?.id,
        recipient: "tshomela23rd@gmail.com",
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('=== ERROR IN TEST EMAIL FUNCTION ===');
    console.error('Error details:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
