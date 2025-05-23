
import React from 'react';
import { MessageCircle } from 'lucide-react';

const GlobalWhatsAppContact: React.FC = () => {
  const handleWhatsAppClick = () => {
    const supportNumber = "0610000000"; // Default support number
    const message = encodeURIComponent("Hi, I need help with the marketplace");
    window.open(`https://wa.me/${supportNumber}?text=${message}`, '_blank');
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-colors"
        aria-label="Contact support via WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default GlobalWhatsAppContact;
