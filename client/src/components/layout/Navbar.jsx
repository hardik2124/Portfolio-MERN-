import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MoonIcon, SunIcon, UserIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

// Updated nav links for single page with hash navigation
const navLinks = [
  { name: 'Home', path: '#home' },
  { name: 'About', path: '#about' },
  { name: 'Projects', path: '#projects' },
  { name: 'Skills', path: '#skills' },
  { name: 'Contact', path: '#contact' },
];

const Navbar = () => {
  const { theme, toggleTheme, animationsEnabled, toggleAnimations } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Track scrolling to highlight active nav item
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY;
      
      // Update navbar background on scroll
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Find current section
      let currentSection = 'home';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle smooth scrolling
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth',
      });
      
      closeMenu();
      // Update URL hash without scrolling
      window.history.pushState(null, null, `#${targetId}`);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-secondary-900/90 backdrop-blur-sm shadow-md' 
        : 'bg-white dark:bg-secondary-900'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center"
          >
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Portfolio
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path.replace('#', ''))}
                className={`text-sm font-medium transition-colors duration-300 ease-in-out ${
                  activeSection === link.path.replace('#', '')
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {link.name}
              </a>
            ))}
            
            {/* Admin Panel Button (if authenticated) */}
            {isAuthenticated && (
              <Link
                to="/admin"
                className="inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                <UserIcon className="h-4 w-4 mr-1" />
                Admin
              </Link>
            )}
            
            {/* Animation Toggle Button */}
            <button
              onClick={toggleAnimations}
              className={`rounded-full p-2 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 ${
                !animationsEnabled ? 'opacity-50' : ''
              }`}
              aria-label="Toggle animations"
              title={animationsEnabled ? "Disable background animations" : "Enable background animations"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 3v4m0 14v-4M3 12h4m14 0h-4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2 2.8-2.8" />
              </svg>
            </button>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {/* Admin Button (if authenticated) - Mobile */}
            {isAuthenticated && (
              <Link
                to="/admin"
                className="flex items-center justify-center p-2 mr-2 rounded-md bg-primary-600 text-white hover:bg-primary-700"
                aria-label="Admin Panel"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
            )}
            
            {/* Animation Toggle Button (Mobile) */}
            <button
              onClick={toggleAnimations}
              className={`rounded-full p-2 mr-2 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 ${
                !animationsEnabled ? 'opacity-50' : ''
              }`}
              aria-label="Toggle animations"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 3v4m0 14v-4M3 12h4m14 0h-4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2 2.8-2.8" />
              </svg>
            </button>
            
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 mr-2 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="rounded-md p-2 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white dark:bg-secondary-900 shadow-md"
        >
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path.replace('#', ''))}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === link.path.replace('#', '')
                    ? 'text-primary-600 dark:text-primary-400 bg-secondary-50 dark:bg-secondary-800'
                    : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {link.name}
              </a>
            ))}
            
            {/* Admin Panel Link in Mobile Menu */}
            {isAuthenticated && (
              <Link
                to="/admin"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-primary-600 dark:text-primary-400 bg-secondary-50 dark:bg-secondary-800"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Admin Panel
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar; 