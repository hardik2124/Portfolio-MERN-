import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <AnimatedBackground />
      
      <Navbar />
      <motion.main 
        className="flex-grow relative z-10 pt-16" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout; 