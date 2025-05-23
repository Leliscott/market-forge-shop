
import { useState, useRef } from 'react';

export const useDoubleTap = (onDoubleTap: () => void) => {
  const [tapCount, setTapCount] = useState(0);
  const registrationTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleDoubleTap = () => {
    if (registrationTimeout.current) {
      clearTimeout(registrationTimeout.current);
    }
    
    setTapCount((prevCount) => prevCount + 1);
    
    if (tapCount === 1) {
      onDoubleTap();
      setTapCount(0);
    } else {
      registrationTimeout.current = setTimeout(() => {
        setTapCount(0);
      }, 500);
    }
  };

  return handleDoubleTap;
};
