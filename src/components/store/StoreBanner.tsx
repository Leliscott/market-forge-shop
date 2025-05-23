
import React from 'react';

interface StoreBannerProps {
  name: string;
  description: string;
  logo: string;
  bannerImage?: string;
}

const StoreBanner: React.FC<StoreBannerProps> = ({ 
  name, 
  description, 
  logo, 
  bannerImage 
}) => {
  return (
    <div 
      className="w-full h-60 md:h-80 bg-gradient-to-r from-primary/30 to-primary-foreground/30 bg-cover bg-center"
      style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
    >
      <div className="container h-full mx-auto px-4 flex items-end pb-16">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-white overflow-hidden">
            <img 
              src={logo || '/placeholder.svg'} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="text-white drop-shadow-md">
            <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
            <p className="mt-1 max-w-2xl">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreBanner;
