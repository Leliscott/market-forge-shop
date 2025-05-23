
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  cellphone: z.string().min(10, 'Cellphone number must be at least 10 digits'),
  agentId: z.string().optional(),
});

type AgentLoginValues = z.infer<typeof loginSchema>;

const AgentPortal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const registrationTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const form = useForm<AgentLoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      cellphone: '',
      agentId: '',
    },
  });

  const handleDoubleTap = () => {
    // Reset tap count after 500ms
    if (registrationTimeout.current) {
      clearTimeout(registrationTimeout.current);
    }
    
    // Increment tap count
    setTapCount((prevCount) => prevCount + 1);
    
    // Check if double tap
    if (tapCount === 1) {
      setIsOpen(true);
      setTapCount(0);
    } else {
      // Set timeout to reset tap count
      registrationTimeout.current = setTimeout(() => {
        setTapCount(0);
      }, 500);
    }
  };

  const onSubmit = async (data: AgentLoginValues) => {
    setIsLoading(true);
    try {
      // Implementation for agent login would go here
      console.log('Agent login data:', data);
      
      toast({
        title: "Agent authentication successful",
        description: "Welcome to the Agent Portal",
      });
      
      setIsOpen(false);
      navigate('/agent/dashboard');
    } catch (error) {
      console.error('Agent login error:', error);
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mt-12 mb-2 py-4 border-t border-b text-center">
        <div 
          className="text-xs text-muted-foreground"
          onClick={handleDoubleTap}
        >
          © 2025 ShopMarket. All rights reserved.
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agent Portal</DialogTitle>
            <DialogDescription>
              Enter your credentials to access the agent dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
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
                    <FormLabel>Cellphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your cellphone number" {...field} />
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
                    <FormLabel>Agent ID (leave empty for new registration)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Agent ID if you have one" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Login / Register"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentPortal;
