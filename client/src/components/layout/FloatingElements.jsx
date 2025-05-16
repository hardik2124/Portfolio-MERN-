import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const FloatingElements = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Generate random positions for elements
  const elements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 95}%`, 
    y: `${Math.random() * 95}%`,
    size: Math.random() * 40 + 10,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 5,
    type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)],
    opacity: Math.random() * 0.12 + 0.03,
  }));

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full"
          style={{
            left: el.x,
            top: el.y,
            width: el.size,
            height: el.size,
            opacity: el.opacity,
            backgroundColor: isDark ? '#14b8a6' : '#0f766e',
            borderRadius: el.type === 'circle' ? '50%' : el.type === 'square' ? '0%' : '50% 50% 0 50%',
            transform: el.type === 'triangle' ? 'rotate(45deg)' : 'none',
          }}
          animate={{
            y: ['-20px', '20px', '-20px'],
            x: ['10px', '-10px', '10px'],
            rotate: el.type === 'triangle' ? [45, 90, 45] : [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.delay,
          }}
        />
      ))}
      
      {/* Larger decorative elements */}
      <motion.div 
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-5"
        style={{
          background: `radial-gradient(circle, ${isDark ? '#14b8a6' : '#0f766e'} 0%, transparent 70%)`,
          top: '20%',
          right: '10%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.07, 0.05],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-5"
        style={{
          background: `radial-gradient(circle, ${isDark ? '#14b8a6' : '#0f766e'} 0%, transparent 70%)`,
          bottom: '15%',
          left: '5%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default FloatingElements; 