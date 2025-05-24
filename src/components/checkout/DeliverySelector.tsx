
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/constants';

interface DeliveryService {
  id: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
}

interface DeliverySelectorProps {
  storeId: string;
  onDeliveryChange: (service: DeliveryService | null) => void;
}

const DeliverySelector: React.FC<DeliverySelectorProps> = ({ storeId, onDeliveryChange }) => {
  const [deliveryServices, setDeliveryServices] = useState<DeliveryService[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryServices();
  }, [storeId]);

  const fetchDeliveryServices = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_services')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('charge_amount', { ascending: true });

      if (error) throw error;
      setDeliveryServices(data || []);
    } catch (error) {
      console.error('Error fetching delivery services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = deliveryServices.find(s => s.id === serviceId);
    onDeliveryChange(service || null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading delivery options...</p>
        </CardContent>
      </Card>
    );
  }

  if (deliveryServices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This seller hasn't configured delivery services yet. Please contact them directly to arrange delivery.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Choose Delivery Option
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedService} onValueChange={handleServiceChange}>
          {deliveryServices.map((service) => (
            <div key={service.id} className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value={service.id} id={service.id} />
              <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{service.service_name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {service.service_type.replace('_', ' ')}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(service.charge_amount)}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default DeliverySelector;
