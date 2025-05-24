
import { useState } from 'react';

export const useStoreImageHandlers = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const removeLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
  };
  
  const removeBanner = () => {
    setBannerPreview(null);
    setBannerFile(null);
  };

  return {
    logoPreview,
    bannerPreview,
    logoFile,
    bannerFile,
    setLogoPreview,
    setBannerPreview,
    handleLogoChange,
    handleBannerChange,
    removeLogo,
    removeBanner
  };
};
