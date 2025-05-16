import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const NoiseOverlay = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Create noise pattern
    const createNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Noise intensity based on theme
        const intensity = theme === 'dark' ? 10 : 8;
        const noise = Math.random() * intensity;
        
        // Set RGB values (gray noise)
        data[i] = 128 + noise;     // R
        data[i + 1] = 128 + noise; // G
        data[i + 2] = 128 + noise; // B
        data[i + 3] = 8;           // Alpha (very transparent)
      }
      
      ctx.putImageData(imageData, 0, 0);
    };
    
    createNoise();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, [theme]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-20"
      style={{ 
        opacity: 0.2,
        mixBlendMode: 'overlay'
      }}
    />
  );
};

export default NoiseOverlay; 