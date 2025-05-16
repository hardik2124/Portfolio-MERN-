import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import ParticlesBackground from './ParticlesBackground';
import FloatingElements from './FloatingElements';
import GradientBackground from './GradientBackground';
import NoiseOverlay from './NoiseOverlay';

const AnimatedBackground = () => {
  const { theme, animationsEnabled } = useTheme();
  
  // If animations are disabled, don't render anything
  if (!animationsEnabled) {
    return null;
  }
  
  return (
    <div className="animated-background" aria-hidden="true">
      {/* Gradient animated background */}
      <GradientBackground />
      
      {/* Floating shapes */}
      <FloatingElements />
      
      {/* Interactive particles */}
      <ParticlesBackground />
      
      {/* Noise texture overlay */}
      <NoiseOverlay />
    </div>
  );
};

export default AnimatedBackground; 