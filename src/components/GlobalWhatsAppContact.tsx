
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const GlobalChatButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Listen for chat window open/close events
    const handleChatOpen = () => setIsVisible(false);
    const handleChatClose = () => setIsVisible(true);

    window.addEventListener('chatWindowOpen', handleChatOpen);
    window.addEventListener('chatWindowClose', handleChatClose);

    return () => {
      window.removeEventListener('chatWindowOpen', handleChatOpen);
      window.removeEventListener('chatWindowClose', handleChatClose);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <Link 
      to="/chats"
      className="fixed bottom-4 right-4 z-50"
    >
      <button
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg transition-colors"
        aria-label="View your chats"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </Link>
  );
};

export default GlobalChatButton;
