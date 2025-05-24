
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WithdrawalRequest {
  store_id: string;
  store_name: string;
  withdrawal_data: {
    amount: number;
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    branch_code: string;
  };
  seller_stats: {
    total_earnings: number;
    total_withdrawn: number;
    current_balance: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      store_id, 
      store_name, 
      withdrawal_data, 
      seller_stats 
    }: WithdrawalRequest = await req.json();

    const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

    const emailResponse = await resend.emails.send({
      from: "ShopMarket <noreply@shop4ll.co.za>",
      to: ["finance@shop4ll.co.za"],
      subject: `Withdrawal Request - ${store_name}`,
      html: `
        <h1>New Withdrawal Request</h1>
        
        <h2>Store Information</h2>
        <p><strong>Store Name:</strong> ${store_name}</p>
        <p><strong>Store ID:</strong> ${store_id}</p>
        
        <h2>Withdrawal Details</h2>
        <p><strong>Amount:</strong> ${formatCurrency(withdrawal_data.amount)}</p>
        <p><strong>Bank Name:</strong> ${withdrawal_data.bank_name}</p>
        <p><strong>Account Holder:</strong> ${withdrawal_data.account_holder_name}</p>
        <p><strong>Account Number:</strong> ${withdrawal_data.account_number}</p>
        <p><strong>Branch Code:</strong> ${withdrawal_data.branch_code}</p>
        
        <h2>Seller Statistics</h2>
        <p><strong>Total Earnings:</strong> ${formatCurrency(seller_stats.total_earnings)}</p>
        <p><strong>Previous Withdrawals:</strong> ${formatCurrency(seller_stats.total_withdrawn)}</p>
        <p><strong>Current Balance:</strong> ${formatCurrency(seller_stats.current_balance)}</p>
        
        <p><em>This withdrawal request was submitted on ${new Date().toLocaleString('en-ZA')}.</em></p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Please process this withdrawal within 3-5 business days. 
          Update the withdrawal status in the admin panel once processed.
        </p>
      `,
    });

    console.log("Withdrawal request email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending withdrawal request email:", error);
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
