import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  FolderIcon, 
  WrenchIcon, 
  EnvelopeIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Close sidebar on mobile by default
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }

    // Handle window resize
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-open sidebar on desktop
      if (!mobile && !isOpen) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Use logout function from AuthContext
    logout();
    // Redirect to login page
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: HomeIcon },
    { name: 'Projects', path: '/admin/projects', icon: FolderIcon },
    { name: 'Skills', path: '/admin/skills', icon: WrenchIcon },
    { name: 'Messages', path: '/admin/messages', icon: EnvelopeIcon },
    { name: 'Profile', path: '/admin/profile', icon: UserCircleIcon },
    { name: 'View Client Site', path: '/', icon: GlobeAltIcon },
  ];

  // If sidebar is open on mobile, add overlay
  const Overlay = () => {
    if (isOpen && isMobile) {
      return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-secondary-100 dark:bg-secondary-900">
      <Overlay />
      
      {/* Sidebar */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-secondary-800 shadow-md transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
        initial={{ x: isMobile ? -260 : 0 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-5 border-b border-secondary-200 dark:border-secondary-700">
            <Link to="/admin" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Admin Panel
            </Link>
            <button 
              onClick={toggleSidebar}
              className="md:hidden text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      (location.pathname === item.path || (item.path !== '/admin' && item.path !== '/' && location.pathname.startsWith(item.path)))
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-primary-600 dark:hover:text-primary-400'
                    } ${item.path === '/' ? 'mt-8 border-t border-secondary-200 dark:border-secondary-700 pt-4' : ''}`}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-md transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Mobile sidebar button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        {!isOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-white dark:bg-secondary-800 shadow-md text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Main content */}
      <div className={`flex-1 overflow-auto pt-12 md:pt-6 px-4 md:px-6 ${isMobile ? 'pb-6' : 'pb-6'}`}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 