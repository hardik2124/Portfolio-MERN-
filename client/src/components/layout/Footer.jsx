import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaUserCog, FaHome, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileData, selectProfileLoading, selectProfileError, fetchProfileData } from '../../store/slices/profileSlice';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, isAdmin } = useAuth();
  const profileData = useSelector(selectProfileData);
  const isLoading = useSelector(selectProfileLoading);
  const profileError = useSelector(selectProfileError);
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Fetch profile data on component mount if not already loaded
  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);
  
  // Default values when profileData is loading or null
  const footerInfo = {
    name: profileData?.name || 'Portfolio Owner',
    email: profileData?.email || 'hello@example.com',
    location: profileData?.location || 'Location not specified',
    profileImage: profileData?.profileImage || '',
    socialLinks: profileData?.socialLinks || {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: ''
    }
  };
  
  // Check if we're in the admin panel or client side
  const isAdminPanel = location.pathname.startsWith('/admin');

  // Helper function to ensure all social links have http/https prefix
  const formatSocialLink = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and short description */}
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center">
                {footerInfo.profileImage && (
                  <img 
                    src={footerInfo.profileImage}
                    alt={footerInfo.name}
                    className="h-10 w-10 rounded-full mr-3 object-cover border-2 border-primary-500"
                    onError={(e) => {
                      console.error('Error loading profile image:', e);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/40';
                    }}
                  />
                )}
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {footerInfo.name}
                </span>
              </Link>
              <p className="mt-4 text-sm text-secondary-600 dark:text-secondary-400 max-w-md">
                A professional portfolio showcasing my skills, projects, and experiences in web development.
              </p>
              
              {/* Admin/Client Panel Navigation Buttons */}
              {isAuthenticated && (
                <div className="mt-4">
                  {isAdminPanel ? (
                    <Link 
                      to="/"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                    >
                      <FaHome className="mr-2" />
                      View Client Site
                    </Link>
                  ) : (
                    <Link 
                      to="/admin"
                      className="inline-flex items-center px-4 py-2 bg-secondary-800 text-white text-sm font-medium rounded-md hover:bg-secondary-900 transition-colors"
                    >
                      <FaUserCog className="mr-2" />
                      Go to Admin Panel
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    to="/skills"
                    className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Skills
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Contact
                  </Link>
                </li>
                {isAuthenticated && !isAdminPanel && (
                  <li>
                    <Link
                      to="/admin"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white uppercase tracking-wider">
                Contact
              </h3>
              {isLoading ? (
                <div className="mt-4 text-sm text-secondary-600 dark:text-secondary-400">
                  Loading contact information...
                </div>
              ) : profileError ? (
                <div className="mt-4 text-sm text-red-500 dark:text-red-400">
                  Unable to load contact information
                </div>
              ) : (
                <ul className="mt-4 space-y-2">
                  {footerInfo.email && (
                    <li className="text-sm text-secondary-600 dark:text-secondary-400">
                      Email: <a href={`mailto:${footerInfo.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">{footerInfo.email}</a>
                    </li>
                  )}
                  {footerInfo.location && (
                    <li className="text-sm text-secondary-600 dark:text-secondary-400">
                      Location: {footerInfo.location}
                    </li>
                  )}
                  <li className="mt-4">
                    <div className="flex space-x-4">
                      {footerInfo.socialLinks?.github && (
                        <a
                          href={formatSocialLink(footerInfo.socialLinks.github)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <FaGithub className="h-5 w-5" />
                        </a>
                      )}
                      {footerInfo.socialLinks?.linkedin && (
                        <a
                          href={formatSocialLink(footerInfo.socialLinks.linkedin)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <FaLinkedin className="h-5 w-5" />
                        </a>
                      )}
                      {footerInfo.socialLinks?.twitter && (
                        <a
                          href={formatSocialLink(footerInfo.socialLinks.twitter)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <FaTwitter className="h-5 w-5" />
                        </a>
                      )}
                      {footerInfo.socialLinks?.website && (
                        <a
                          href={formatSocialLink(footerInfo.socialLinks.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <FaGlobe className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-secondary-200 dark:border-secondary-800">
            <p className="text-sm text-center text-secondary-600 dark:text-secondary-400">
              &copy; {currentYear} {footerInfo.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 