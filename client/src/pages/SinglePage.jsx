import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import AboutSection from '../components/sections/AboutSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import SkillsSection from '../components/sections/SkillsSection';
import ContactSection from '../components/sections/ContactSection';

const SinglePage = () => {
  // Refs for each section
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  
  // Main scroll progress
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    // Smooth scroll to section when URL hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const section = document.querySelector(hash);
        if (section) {
          window.scrollTo({
            top: section.offsetTop - 80, // Offset for header height
            behavior: 'smooth'
          });
        }
      }
    };

    // Handle initial hash if present
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    }
  };

  // Enhanced section-specific animations
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 1,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Parallax effects based on scroll position
  const aboutParallax = useTransform(scrollYProgress, [0.1, 0.3], [0, -30]);
  const projectsParallax = useTransform(scrollYProgress, [0.3, 0.5], [0, -25]);
  const skillsParallax = useTransform(scrollYProgress, [0.5, 0.7], [0, -35]);
  const contactParallax = useTransform(scrollYProgress, [0.7, 0.9], [0, -20]);

  return (
    <Layout>
      <div className="scroll-smooth">
        <section id="home" className="relative mb-0">
          <Hero />
        </section>
        
        <motion.section 
          id="about"
          ref={aboutRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInVariants}
          className="relative overflow-hidden"
        >
          <motion.div
            className="relative z-10"
            style={{ y: aboutParallax }}
          >
            <AboutSection />
          </motion.div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-50 dark:to-primary-900/10 -z-0 opacity-40" 
            variants={itemVariants}
          />
        </motion.section>
        
        <motion.section 
          id="projects"
          ref={projectsRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="relative overflow-hidden"
        >
          <motion.div
            className="relative z-10"
            style={{ y: projectsParallax }}
          >
            <ProjectsSection />
          </motion.div>
        </motion.section>
        
        <motion.section 
          id="skills"
          ref={skillsRef}
          initial="hidden"
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInVariants}
          className="relative overflow-hidden"
        >
          <motion.div
            className="relative z-10"
            style={{ y: skillsParallax }}
          >
            <SkillsSection />
          </motion.div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary-50 dark:to-secondary-900/10 -z-0 opacity-30" 
            variants={itemVariants}
          />
        </motion.section>
        
        <motion.section 
          id="contact"
          ref={contactRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="relative overflow-hidden"
        >
          <motion.div
            className="relative z-10"
            style={{ y: contactParallax }}
          >
            <ContactSection />
          </motion.div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default SinglePage; 