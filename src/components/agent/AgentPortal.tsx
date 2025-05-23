
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  cellphone: z.string().min(10, 'Cellphone number must be at least 10 digits'),
  agentId: z.string().optional(),
});

const forgotIdSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type AgentLoginValues = z.infer<typeof loginSchema>;
type ForgotIdValues = z.infer<typeof forgotIdSchema>;

const AgentPortal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [forgotIdMode, setForgotIdMode] = useState(false);
  const [idSent, setIdSent] = useState(false);
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

  const forgotForm = useForm<ForgotIdValues>({
    resolver: zodResolver(forgotIdSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleDoubleTap = () => {
    if (registrationTimeout.current) {
      clearTimeout(registrationTimeout.current);
    }
    
    setTapCount((prevCount) => prevCount + 1);
    
    if (tapCount === 1) {
      setIsOpen(true);
      setTapCount(0);
    } else {
      registrationTimeout.current = setTimeout(() => {
        setTapCount(0);
      }, 500);
    }
  };

  const generateAgentId = () => {
    return `AG-${Math.floor(10000 + Math.random() * 90000)}`;
  };

  const onSubmit = async (data: AgentLoginValues) => {
    setIsLoading(true);
    try {
      // Check if this is a registration (no agent ID provided)
      if (!data.agentId) {
        // Register new agent
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (authError) {
          toast({
            title: "Registration failed",
            description: authError.message,
            variant: "destructive"
          });
          return;
        }

        if (authData.user) {
          const agentId = generateAgentId();
          
          // Create agent record
          const { error: agentError } = await supabase
            .from('agents')
            .insert({
              user_id: authData.user.id,
              agent_id: agentId,
              email: data.email,
              cellphone: data.cellphone,
            });

          if (agentError) {
            toast({
              title: "Agent registration failed",
              description: agentError.message,
              variant: "destructive"
            });
            return;
          }

          toast({
            title: "Agent registration successful",
            description: `Your Agent ID is ${agentId}. Please save this for future logins.`,
          });
        }
      } else {
        // Login existing agent
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (authError) {
          toast({
            title: "Login failed",
            description: authError.message,
            variant: "destructive"
          });
          return;
        }

        // Verify agent ID
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('agent_id', data.agentId)
          .eq('user_id', authData.user?.id)
          .single();

        if (agentError || !agentData) {
          toast({
            title: "Invalid Agent ID",
            description: "The provided Agent ID does not match your account",
            variant: "destructive"
          });
          return;
        }

        // Update last login
        await supabase
          .from('agents')
          .update({ last_login: new Date().toISOString() })
          .eq('id', agentData.id);

        toast({
          title: "Agent authentication successful",
          description: "Welcome to the Agent Portal",
        });
      }
      
      setIsOpen(false);
      navigate('/agent/dashboard');
    } catch (error) {
      console.error('Agent authentication error:', error);
      toast({
        title: "Authentication failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotIdSubmit = async (data: ForgotIdValues) => {
    setIsLoading(true);
    try {
      // Find agent by email
      const { data: agentData, error } = await supabase
        .from('agents')
        .select('agent_id')
        .eq('email', data.email)
        .single();

      if (error || !agentData) {
        toast({
          title: "Email not found",
          description: "No agent account found with this email address",
          variant: "destructive"
        });
        return;
      }

      // In a real implementation, you would send an email with the agent ID
      // For now, we'll just show it in a toast
      toast({
        title: "Agent ID Found",
        description: `Your Agent ID is: ${agentData.agent_id}`,
      });
      
      setIdSent(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mt-12 mb-2 py-4 border-t border-b text-center dark:border-gray-700">
        <div 
          className="text-xs text-muted-foreground cursor-pointer"
          onClick={handleDoubleTap}
        >
          © 2025 ShopMarket. All rights reserved.
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Agent Portal</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              {forgotIdMode 
                ? 'Enter your email to retrieve your Agent ID' 
                : 'Enter your credentials to access the agent dashboard.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {idSent ? (
            <div className="space-y-4">
              <p className="text-sm text-green-600 dark:text-green-400">Agent ID has been sent to your email address.</p>
              <Button 
                onClick={() => {
                  setIdSent(false);
                  setForgotIdMode(false);
                }}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          ) : forgotIdMode ? (
            <Form {...forgotForm}>
              <form onSubmit={forgotForm.handleSubmit(onForgotIdSubmit)} className="space-y-4">
                <FormField
                  control={forgotForm.control}
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
                  onClick={() => setForgotIdMode(false)}
                  className="w-full dark:text-gray-200 dark:hover:text-white"
                >
                  Back to Login
                </Button>
              </form>
            </Form>
          ) : (
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
                  onClick={() => setForgotIdMode(true)}
                  className="w-full text-sm dark:text-gray-200 dark:hover:text-white"
                >
                  Forgot Agent ID?
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentPortal;
