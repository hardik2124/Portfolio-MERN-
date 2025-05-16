import React, { useState, useEffect } from 'react';
import { skillService } from '../../services/api';
import { motion } from 'framer-motion';

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const response = await skillService.getAllSkills();
      
      // Check response structure
      const skillsData = response.data.skills || response.data;
      setSkills(skillsData);
      
      // Group skills by category
      const uniqueCategories = [...new Set(skillsData.map(skill => skill.category))];
      setCategories(uniqueCategories);
      
      setError('');
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-6">
          My <span className="text-primary-600 dark:text-primary-400">Skills</span>
        </h1>
        
        <p className="text-secondary-700 dark:text-secondary-300 mb-12">
          Here are the technologies and tools I'm proficient in, organized by category.
        </p>

        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-secondary-600 dark:text-secondary-400">
              No skills found. Please add skills in the admin dashboard.
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-12"
          >
            {categories.map(category => {
              const categorySkills = skills.filter(skill => skill.category === category);
              
              return (
                <motion.div key={category} variants={item} className="space-y-6">
                  <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                    {category}
                  </h2>
                  
                  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 space-y-6">
                      {categorySkills.map(skill => (
                        <div key={skill._id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                              {skill.name}
                            </h3>
                            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                              {skill.level}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
                            <motion.div
                              className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            ></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection; 