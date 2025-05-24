
import React from 'react';
import StoreImageUploader from './StoreImageUploader';

interface StoreImagesSectionProps {
  logoPreview: string | null;
  bannerPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeLogo: () => void;
  removeBanner: () => void;
}

const StoreImagesSection: React.FC<StoreImagesSectionProps> = ({
  logoPreview,
  bannerPreview,
  handleLogoChange,
  handleBannerChange,
  removeLogo,
  removeBanner
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Store Images</h2>
      
      <div className="space-y-6">
        <StoreImageUploader
          id="logo"
          label="Store Logo *"
          description="Upload a logo that represents your brand (recommended: 512x512px)"
          imagePreview={logoPreview}
          handleImageChange={handleLogoChange}
          removeImage={removeLogo}
        />
        
        <StoreImageUploader
          id="banner"
          label="Store Banner"
          description="Upload a banner image for your store (recommended: 1200x400px)"
          imagePreview={bannerPreview}
          handleImageChange={handleBannerChange}
          removeImage={removeBanner}
        />
      </div>
    </div>
  );
};

export default StoreImagesSection;
