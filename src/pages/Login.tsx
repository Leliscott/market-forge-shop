import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    if (resetPasswordMode) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) {
          form.setError('email', { 
            type: 'manual', 
            message: error.message 
          });
        } else {
          setResetEmailSent(true);
        }
      } catch (error: any) {
        form.setError('email', { 
          type: 'manual', 
          message: error.message || "An error occurred" 
        });
      }
      setIsLoading(false);
    } else {
      const success = await login(data.email, data.password);
      setIsLoading(false);
      
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header showSearch={false} />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {resetPasswordMode ? 'Reset Password' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {resetPasswordMode 
                ? 'Enter your email to receive a password reset link' 
                : 'Sign in to your account to continue'
              }
            </p>
          </div>
          
          {resetEmailSent && (
            <Alert>
              <AlertDescription>
                We've sent password reset instructions to your email address.
                Please check your inbox.
              </AlertDescription>
            </Alert>
          )}
          
          {!resetEmailSent && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                
                {!resetPasswordMode && (
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
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading 
                    ? resetPasswordMode ? 'Sending...' : 'Signing in...' 
                    : resetPasswordMode ? 'Send Reset Link' : 'Sign In'
                  }
                </Button>
                
                <div className="text-center text-sm">
                  {resetPasswordMode ? (
                    <button 
                      type="button"
                      onClick={() => setResetPasswordMode(false)} 
                      className="text-primary hover:underline"
                    >
                      Back to Login
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setResetPasswordMode(true)} 
                      className="text-primary hover:underline"
                    >
                      Forgot your password?
                    </button>
                  )}
                </div>
              </form>
            </Form>
          )}
          
          {!resetPasswordMode && !resetEmailSent && (
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          )}

          {/* Demo accounts info - keep for testing */}
          <div className="pt-6 border-t mt-6">
            <p className="text-sm text-center font-medium text-muted-foreground mb-3">
              Demo Accounts
            </p>
            <div className="space-y-3">
              <div className="rounded-md bg-muted p-3 text-sm">
                <p><strong>Seller:</strong> seller@example.com</p>
                <p><strong>Password:</strong> password</p>
              </div>
              <div className="rounded-md bg-muted p-3 text-sm">
                <p><strong>Buyer:</strong> buyer@example.com</p>
                <p><strong>Password:</strong> password</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
