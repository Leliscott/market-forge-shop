
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema, AgentLoginValues } from '../schemas/agentSchemas';

interface AgentLoginFormProps {
  onSubmit: (data: AgentLoginValues) => void;
  onForgotId: () => void;
  isLoading: boolean;
}

const AgentLoginForm: React.FC<AgentLoginFormProps> = ({
  onSubmit,
  onForgotId,
  isLoading
}) => {
  const form = useForm<AgentLoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      cellphone: '',
      agentId: '',
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
              <FormLabel className="dark:text-gray-200">Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cellphone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Cellphone</FormLabel>
              <FormControl>
                <Input placeholder="Enter your cellphone number" {...field} className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="agentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Agent ID (leave empty for new registration)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Agent ID if you have one" {...field} className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Authenticating..." : "Login / Register"}
        </Button>
        
        <Button 
          type="button"
          variant="ghost" 
          onClick={onForgotId}
          className="w-full text-sm dark:text-gray-200 dark:hover:text-white"
        >
          Forgot Agent ID?
        </Button>
      </form>
    </Form>
  );
};

export default AgentLoginForm;
