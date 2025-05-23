
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const GlobalChatButton: React.FC = () => {
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
