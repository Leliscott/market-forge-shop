
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, MapPin, Clock } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const deliveryFormSchema = z.object({
  preferredDeliveryTime: z.string().min(1, 'Please select a preferred delivery time'),
  deliveryAddress: z.string().min(10, 'Please provide a complete delivery address'),
  deliveryInstructions: z.string().optional(),
  contactNumber: z.string().min(10, 'Please provide a valid contact number'),
  alternativeContact: z.string().optional(),
  deliveryNotes: z.string().optional(),
});

type DeliveryFormData = z.infer<typeof deliveryFormSchema>;

interface DeliveryFormProps {
  orderId: string;
  sellerContact: {
    name: string;
    phone: string;
    email: string;
  };
  onSubmit: (data: DeliveryFormData) => void;
  isSubmitting?: boolean;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ 
  orderId, 
  sellerContact, 
  onSubmit, 
  isSubmitting = false 
}) => {
  const form = useForm<DeliveryFormData>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      preferredDeliveryTime: '',
      deliveryAddress: '',
      deliveryInstructions: '',
      contactNumber: '',
      alternativeContact: '',
      deliveryNotes: '',
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Information Form
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Order #{orderId.slice(0, 8)} - Please complete this form so your seller can arrange delivery
          </p>
        </CardHeader>
        <CardContent>
          {/* Seller Contact Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Your Seller Contact Details:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Name:</strong> {sellerContact.name}</p>
              <p><strong>Phone:</strong> {sellerContact.phone}</p>
              <p><strong>Email:</strong> {sellerContact.email}</p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Contact your seller directly to arrange delivery details
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="preferredDeliveryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Preferred Delivery Time
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred delivery time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                        <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                        <SelectItem value="weekend">Weekend</SelectItem>
                        <SelectItem value="flexible">Flexible - Seller can choose</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your complete delivery address including any landmarks"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 082 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternativeContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternative Contact Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 082 765 4321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any specific instructions for the delivery (gate codes, building access, etc.)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any other information that might help with delivery"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Delivery Information'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryForm;
