
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { forgotIdSchema, ForgotIdValues } from '../schemas/agentSchemas';

interface ForgotIdFormProps {
  onSubmit: (data: ForgotIdValues) => Promise<boolean>;
  onBack: () => void;
  isLoading: boolean;
}

const ForgotIdForm: React.FC<ForgotIdFormProps> = ({
  onSubmit,
  onBack,
  isLoading
}) => {
  const form = useForm<ForgotIdValues>({
    resolver: zodResolver(forgotIdSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: ForgotIdValues) => {
    const success = await onSubmit(data);
    if (success) {
      onBack();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Agent ID"}
        </Button>
        
        <Button 
          type="button"
          variant="ghost" 
          onClick={onBack}
          className="w-full dark:text-gray-200 dark:hover:text-white"
        >
          Back to Login
        </Button>
      </form>
    </Form>
  );
};

export default ForgotIdForm;
