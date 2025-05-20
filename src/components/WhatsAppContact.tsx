
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppContactProps {
  phoneNumber: string;
  productName: string;
}

const WhatsAppContact: React.FC<WhatsAppContactProps> = ({ phoneNumber, productName }) => {
  // Format phone number to remove any special characters and ensure it has the correct South African format
  const formatPhoneNumber = (phone: string) => {
    // Remove any non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If the number starts with '0', replace it with '27' (South Africa country code)
    if (cleaned.startsWith('0')) {
      cleaned = '27' + cleaned.substring(1);
    } 
    
    // If the number doesn't have any country code, add '27'
    else if (!cleaned.startsWith('27')) {
      cleaned = '27' + cleaned;
    }
    
    return cleaned;
  };
  
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
