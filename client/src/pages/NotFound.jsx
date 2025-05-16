import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center min-h-[50vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">
            Page Not Found
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="btn-primary inline-block"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound; 