
export const submitPayFastSimpleForm = (finalTotal: number) => {
  console.log('=== SUBMITTING PAYFAST SIMPLE FORM ===');
  console.log('Amount:', finalTotal);
  
  // Get the hidden form
  const form = document.getElementById('payfast-form') as HTMLFormElement;
  
  if (!form) {
    console.error('PayFast form not found');
    return;
  }

  // Update the amount in the form
  const amountInput = form.querySelector('input[name="amount"]') as HTMLInputElement;
  if (amountInput) {
    amountInput.value = finalTotal.toFixed(2);
  }

  // Submit the form
  form.submit();
};
