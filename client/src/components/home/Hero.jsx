import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileData, fetchProfileData } from '../../store/slices/profileSlice';
import { FaArrowDown } from 'react-icons/fa';
import ParticlesEffect from '../effects/Particles';

const Hero = () => {
  // Get profile data from Redux
  const profileData = useSelector(selectProfileData);
  const dispatch = useDispatch();
  
  // Fetch profile data if not already loaded
  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);
  
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[90vh] bg-white dark:bg-secondary-900 overflow-hidden -mt-6">
      {/* Particles background */}
      <div className="absolute inset-0 z-0">
        <ParticlesEffect />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center min-h-[90vh]">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto">
          <div className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 dark:text-white mb-6 leading-tight">
                Hi, I&rsquo;m <span className="text-primary-600 dark:text-primary-400">{profileData?.name || 'Developer'}</span>
                <br />
                Full Stack Developer
              </h1>
              
              <p className="text-lg text-secondary-700 dark:text-secondary-300 mb-8 max-w-lg">
                {profileData?.bio?.substring(0, 150) || 'I build modern web applications with React, Node.js, and MongoDB. Let\'s create something amazing together.'}
                {profileData?.bio?.length > 150 ? '...' : ''}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={scrollToContact}
                  className="btn-primary"
                >
                  Contact Me
                </button>
                
                <button 
                  onClick={scrollToProjects}
                  className="btn-secondary"
                >
                  View My Work
                </button>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            className="w-full md:w-1/2 flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center overflow-hidden shadow-lg">
              {/* Use profile image from Redux store */}
              <img
                src={profileData?.profileImage || "https://placehold.co/400x400/14b8a6/ffffff?text=Portrait"}
                alt={`${profileData?.name || 'Developer'} portrait`}
                className="w-56 h-56 sm:w-72 sm:h-72 rounded-full object-cover"
                onError={(e) => {
                  console.error('Error loading profile image:', e);
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x400/14b8a6/ffffff?text=Portrait";
                }}
              />
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
        >
          <button 
            onClick={scrollToProjects}
            aria-label="Scroll down"
            className="text-primary-600 dark:text-primary-400 focus:outline-none hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <FaArrowDown className="h-6 w-6" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 