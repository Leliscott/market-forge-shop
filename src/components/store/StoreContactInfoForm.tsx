
import React from 'react';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { StoreFormValues } from './StoreFormSchema';

interface StoreContactInfoFormProps {
  form: UseFormReturn<StoreFormValues>;
}

const StoreContactInfoForm: React.FC<StoreContactInfoFormProps> = ({ form }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="Enter your business email" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  type="tel"
                  placeholder="Enter your business phone" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input 
                  type="url"
                  placeholder="https://www.example.com" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StoreContactInfoForm;
