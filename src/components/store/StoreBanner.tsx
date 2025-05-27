
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
      className="w-full h-60 md:h-80 bg-gradient-to-r from-teal-500/30 via-blue-500/30 to-purple-500/30 bg-cover bg-center relative overflow-hidden"
      style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
    >
      {/* Shop4ll Watermark */}
      <div className="absolute top-4 right-4 opacity-50">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
          <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-blue-500 rounded-md flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
              <span className="text-teal-600 font-bold text-xs">S4</span>
            </div>
          </div>
          <span className="text-white text-sm font-medium">Shop4ll</span>
        </div>
      </div>

      <div className="container h-full mx-auto px-4 flex items-end pb-16">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img 
              src={logo || '/placeholder.svg'} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="text-white drop-shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
            <p className="mt-1 max-w-2xl text-lg opacity-90">{description}</p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-green-300/50">
                ✓ Verified Store
              </span>
              <span className="bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-300/50">
                Shop4ll Marketplace
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreBanner;
