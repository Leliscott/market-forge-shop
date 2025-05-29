
import { useState, useEffect } from 'react';

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

interface CartItem {
  id: string;
  productId: string;
  storeId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export const useOrderCalculations = (
  items: CartItem[],
  selectedDelivery: DeliveryService | null
) => {
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newDeliveryCharge = selectedDelivery?.charge_amount || 0;
    const newFinalTotal = newSubtotal + newDeliveryCharge;

    setSubtotal(newSubtotal);
    setDeliveryCharge(newDeliveryCharge);
    setFinalTotal(newFinalTotal);
  }, [items, selectedDelivery]);

  return {
    subtotal,
    deliveryCharge,
    finalTotal
  };
};
