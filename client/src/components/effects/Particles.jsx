import React, { useCallback, useMemo } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useTheme } from '../../context/ThemeContext';

const ParticlesEffect = () => {
  const { theme } = useTheme();
  
  // Initialize particles engine
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Particles configuration based on theme
  const options = useMemo(() => {
    const isDark = theme === 'dark';
    
    return {
      fullScreen: {
        enable: false, // We're positioning this manually
        zIndex: -1,
      },
      particles: {
        number: {
          value: 25,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: isDark ? '#14b8a6' : '#0f766e', // Primary color (light/dark variants)
        },
        shape: {
          type: ['circle', 'triangle', 'square'],
        },
        opacity: {
          value: isDark ? 0.15 : 0.08,
          random: true,
          anim: {
            enable: true,
            speed: 0.2,
            opacity_min: 0.05,
            sync: false,
          },
        },
        size: {
          value: 5,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: isDark ? '#14b8a6' : '#0f766e',
          opacity: isDark ? 0.1 : 0.05,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onhover: {
            enable: true,
            mode: 'grab',
          },
          onclick: {
            enable: true,
            mode: 'push',
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: isDark ? 0.3 : 0.15,
            },
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
      background: {
        color: 'transparent',
        image: '',
        position: '50% 50%',
        repeat: 'no-repeat',
        size: 'cover',
      },
    };
  }, [theme]);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Particles id="hero-particles" init={particlesInit} options={options} />
    </div>
  );
};

export default ParticlesEffect; 