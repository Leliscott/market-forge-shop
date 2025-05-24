
interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId: string;
  image?: string;
}

export const useOrderCalculations = (
  totalPrice: number,
  selectedDelivery?: DeliveryService | null
) => {
  // Calculate delivery charge
  const deliveryCharge = selectedDelivery ? selectedDelivery.charge_amount : 0;

  // Calculate VAT and final total with VAT included
  const vatRate = 0.15; // 15% VAT
  const subtotalExcludingVAT = totalPrice / (1 + vatRate);
  const vatAmount = totalPrice - subtotalExcludingVAT;
  const finalTotal = totalPrice + deliveryCharge; // Add delivery charge to total

  return {
    deliveryCharge,
    vatRate,
    subtotalExcludingVAT,
    vatAmount,
    finalTotal
  };
};
