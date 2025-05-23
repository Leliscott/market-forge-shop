
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { formatPhoneNumber } from '@/utils/constants';

interface WhatsAppContactProps {
  phoneNumber: string;
  productName: string;
}

const WhatsAppContact: React.FC<WhatsAppContactProps> = ({ phoneNumber, productName }) => {
  const handleWhatsAppClick = () => {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const message = encodeURIComponent(`Hi, I'm interested in your product: ${productName}`);
    window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
  };
  
  return (
    <Button 
      onClick={handleWhatsAppClick} 
      className="bg-green-500 hover:bg-green-600 text-white"
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Contact via WhatsApp
    </Button>
  );
};

export default WhatsAppContact;
