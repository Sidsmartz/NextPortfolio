// hooks/useOrientation.ts
import { useState, useEffect } from 'react';

// This hook will only work on the client side
export default function useOrientation(): boolean {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  useEffect(() => {
    const updateOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Initialize the state when component mounts
    updateOrientation();

    // Listen for window resize events
    window.addEventListener('resize', updateOrientation);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);  // Empty dependency array to run only on mount and resize events

  return isPortrait;
}
