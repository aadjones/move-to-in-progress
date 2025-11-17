import { useState, useEffect } from 'react';

export const useGlitch = (scrollPosition: number, maxScroll: number) => {
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    // Calculate glitch intensity based on scroll position (0 to 1)
    const normalizedScroll = Math.min(scrollPosition / maxScroll, 1);
    setIntensity(normalizedScroll);
  }, [scrollPosition, maxScroll]);

  // Calculate hue rotation for color shift effect
  const hueRotation = Math.floor(intensity * 180); // 0deg to 180deg (purple -> red)

  return {
    intensity,
    hueRotation,
    scanlineOpacity: intensity * 0.5,
  };
};
