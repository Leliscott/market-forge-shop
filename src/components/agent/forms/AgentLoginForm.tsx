
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  secretKey: z.string().min(1, 'Secret key is required'),
});

type AgentLoginValues = z.infer<typeof loginSchema>;

interface AgentLoginFormProps {
  onSubmit: (data: AgentLoginValues) => void;
  isLoading: boolean;
}

const AgentLoginForm: React.FC<AgentLoginFormProps> = ({
  onSubmit,
  isLoading
}) => {
  const form = useForm<AgentLoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      secretKey: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Agent Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your agent email" 
                  {...field} 
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="secretKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Secret Key</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Enter your secret key" 
                  {...field} 
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Authenticating..." : "Login as Agent"}
        </Button>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Only authorized agents can access this portal
        </div>
      </form>
    </Form>
  );
};

export default AgentLoginForm;
