import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const GradientBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let gradientOffset = 0;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Colors for gradient based on theme
    const colors = isDark 
      ? ['rgba(20, 184, 166, 0.03)', 'rgba(8, 51, 68, 0.07)', 'rgba(15, 23, 42, 0)'] 
      : ['rgba(15, 118, 110, 0.02)', 'rgba(196, 241, 249, 0.05)', 'rgba(255, 255, 255, 0)'];
    
    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create animated gradient
      gradientOffset = (gradientOffset + 0.0005) % 1;
      
      // Primary radial gradient
      const gradient1 = ctx.createRadialGradient(
        canvas.width * (0.3 + 0.2 * Math.sin(gradientOffset * Math.PI * 2)), 
        canvas.height * (0.4 + 0.1 * Math.cos(gradientOffset * Math.PI * 2)),
        0,
        canvas.width * (0.3 + 0.2 * Math.sin(gradientOffset * Math.PI * 2)), 
        canvas.height * (0.4 + 0.1 * Math.cos(gradientOffset * Math.PI * 2)),
        canvas.width * 0.6
      );
      
      gradient1.addColorStop(0, colors[0]);
      gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      // Secondary radial gradient
      const gradient2 = ctx.createRadialGradient(
        canvas.width * (0.7 + 0.15 * Math.cos(gradientOffset * Math.PI * 2)),
        canvas.height * (0.7 + 0.15 * Math.sin(gradientOffset * Math.PI * 2)),
        0,
        canvas.width * (0.7 + 0.15 * Math.cos(gradientOffset * Math.PI * 2)),
        canvas.height * (0.7 + 0.15 * Math.sin(gradientOffset * Math.PI * 2)),
        canvas.width * 0.5
      );
      
      gradient2.addColorStop(0, colors[1]);
      gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      // Draw gradients
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, [theme, isDark]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
};

export default GradientBackground; 