
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookie-consent');
    if (!hasAccepted) {
      setShowConsent(true);
    }
  }, []);
  
  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowConsent(false);
  };
  
  if (!showConsent) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-center sm:text-left">
          <p>
            We use cookies to improve your experience. By using ShopMarket, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">
              terms and conditions
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowConsent(false)}>
            Decline
          </Button>
          <Button onClick={acceptCookies}>
            Accept All Cookies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
