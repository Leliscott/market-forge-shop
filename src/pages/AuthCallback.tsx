
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the query parameters from the URL
        const hash = window.location.hash;
        const query = window.location.search;
        
        // Check if there's a session to be handled
        if (hash || query) {
          // Let Supabase handle the auth callback
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data?.session) {
            // Redirect to dashboard or home page
            navigate('/');
          } else {
            // No session found, might be an error
            setError('Authentication failed. Please try again.');
          }
        } else {
          // No auth parameters found, redirect to login
          navigate('/login');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed. Please try again.');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Verifying your account...</h1>
          <p className="text-gray-700">Please wait while we complete the authentication process.</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
