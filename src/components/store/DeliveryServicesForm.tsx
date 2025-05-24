
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/constants';

interface DeliveryService {
  id?: string;
  service_name: string;
  service_type: string;
  charge_amount: number;
  is_active: boolean;
}

interface DeliveryServicesFormProps {
  storeId: string;
  isEditing?: boolean;
}

const DELIVERY_TYPES = [
  { value: 'courier', label: 'Courier Service' },
  { value: 'pep_parcel', label: 'PEP Parcel' },
  { value: 'postnet', label: 'PostNet' },
  { value: 'aramex', label: 'Aramex' },
  { value: 'dawn_wing', label: 'Dawn Wing' },
  { value: 'fastway', label: 'Fastway' },
  { value: 'other', label: 'Other' }
];

const DeliveryServicesForm: React.FC<DeliveryServicesFormProps> = ({ storeId, isEditing = false }) => {
  const { toast } = useToast();
  const [services, setServices] = useState<DeliveryService[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && storeId) {
      fetchDeliveryServices();
    }
  }, [isEditing, storeId]);

  const fetchDeliveryServices = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_services')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching delivery services:', error);
      toast({
        title: "Error",
        description: "Failed to load delivery services",
        variant: "destructive"
      });
    }
  };

  const addService = () => {
    setServices([...services, {
      service_name: '',
      service_type: '',
      charge_amount: 0,
      is_active: true
    }]);
  };

  const removeService = async (index: number) => {
    const service = services[index];
    
    if (service.id) {
      try {
        const { error } = await supabase
          .from('delivery_services')
          .delete()
          .eq('id', service.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Delivery service removed successfully"
        });
      } catch (error) {
        console.error('Error removing delivery service:', error);
        toast({
          title: "Error",
          description: "Failed to remove delivery service",
          variant: "destructive"
        });
        return;
      }
    }

    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof DeliveryService, value: any) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };

  const saveServices = async () => {
    if (!storeId) {
      toast({
        title: "Error",
        description: "Store ID is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      for (const service of services) {
        if (!service.service_name || !service.service_type || service.charge_amount < 0) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields with valid values",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const serviceData = {
          store_id: storeId,
          service_name: service.service_name,
          service_type: service.service_type,
          charge_amount: service.charge_amount,
          is_active: service.is_active,
          updated_at: new Date().toISOString()
        };

        if (service.id) {
          // Update existing service
          const { error } = await supabase
            .from('delivery_services')
            .update(serviceData)
            .eq('id', service.id);

          if (error) throw error;
        } else {
          // Insert new service
          const { error } = await supabase
            .from('delivery_services')
            .insert(serviceData);

          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: "Delivery services saved successfully"
      });

      if (isEditing) {
        await fetchDeliveryServices();
      }
    } catch (error) {
      console.error('Error saving delivery services:', error);
      toast({
        title: "Error",
        description: "Failed to save delivery services",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Services & Charges</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure delivery options and charges for your customers. Delivery charges are paid by the customer at checkout.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Delivery Service {index + 1}</h4>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={service.is_active}
                    onCheckedChange={(checked) => updateService(index, 'is_active', checked)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Service Type *</label>
                  <Select
                    value={service.service_type}
                    onValueChange={(value) => updateService(index, 'service_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DELIVERY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Service Name *</label>
                  <Input
                    placeholder="e.g., Standard Delivery"
                    value={service.service_name}
                    onChange={(e) => updateService(index, 'service_name', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Charge Amount (R) *</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={service.charge_amount}
                    onChange={(e) => updateService(index, 'charge_amount', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addService}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Delivery Service
          </Button>

          {services.length > 0 && (
            <Button
              onClick={saveServices}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Delivery Services"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryServicesForm;
