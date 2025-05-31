
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer';
import { Alert, AlertDescription } from '@/components/ui/alert';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const checkResetSession = async () => {
      try {
        // Check if we have a valid session for password reset
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          toast({
            title: "Invalid reset link",
            description: "The password reset link is invalid or has expired. Please request a new one.",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        setIsValidSession(true);
      } catch (error) {
        console.error('Error checking reset session:', error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
        navigate('/login');
      } finally {
        setCheckingSession(false);
      }
    };

    checkResetSession();
  }, [toast, navigate]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Password updated successfully",
        description: "Your password has been updated. You can now log in with your new password.",
      });

      // Sign out the user so they can log in with the new password
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Password reset error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header showSearch={false} />
        <main className="flex-1 flex items-center justify-center py-12">
          <ResponsiveContainer>
            <div className="w-full max-w-md mx-auto space-y-8">
              <div className="text-center">
                <p className="text-muted-foreground">Checking reset link...</p>
              </div>
            </div>
          </ResponsiveContainer>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isValidSession) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header showSearch={false} />
      
      <main className="flex-1 flex items-center justify-center py-4 sm:py-12">
        <ResponsiveContainer>
          <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Reset Your Password
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your new password below
              </p>
            </div>
            
            <Alert>
              <AlertDescription>
                Choose a strong password that you haven't used before.
              </AlertDescription>
            </Alert>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="Enter new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="Confirm new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </form>
            </Form>
          </div>
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
