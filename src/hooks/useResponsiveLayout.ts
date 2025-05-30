
import { useState, useEffect } from 'react';

export const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [containerClass, setContainerClass] = useState('');

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Set responsive container classes
      if (mobile) {
        setContainerClass('px-2 py-4 max-w-full');
      } else if (tablet) {
        setContainerClass('px-4 py-6 max-w-4xl mx-auto');
      } else {
        setContainerClass('px-6 py-8 max-w-6xl mx-auto');
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  return {
    isMobile,
    isTablet,
    containerClass,
    isDesktop: !isMobile && !isTablet
  };
};
