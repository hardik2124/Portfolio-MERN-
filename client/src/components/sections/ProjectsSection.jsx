import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [filters, setFilters] = useState(['All']);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectService.getAllProjects();
      
      // Check the structure of the response to determine how to access the projects array
      const projectsData = response.data.projects || response.data;
      setProjects(projectsData);
      
      // Create a default "Web Development" category since the model doesn't have categories
      const defaultCategories = ['All', 'Web Development'];
      setFilters(defaultCategories);
      
      setError('');
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // For now, we're ignoring the filter since the model doesn't have categories
  const filteredProjects = projects;

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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-8">
          My <span className="text-primary-600 dark:text-primary-400">Projects</span>
        </h1>

        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        {/* Project Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeFilter === filter
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-secondary-600 dark:text-secondary-400">
              No projects found. Please add some projects in the admin dashboard.
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map(project => (
              <motion.div
                key={project._id}
                variants={item}
                className="card overflow-hidden group"
              >
                <div className="h-48 overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary-100 dark:bg-secondary-700">
                      <span className="text-secondary-400 dark:text-secondary-500">No image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary-100/80 dark:bg-secondary-900/80 backdrop-blur-sm text-secondary-800 dark:text-secondary-300">
                      {project.technologies ? project.technologies[0] : 'Project'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs rounded-md bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    {project.github && (
                      <a 
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        aria-label="GitHub Repository"
                      >
                        <FaGithub className="h-6 w-6" />
                      </a>
                    )}
                    
                    {project.liveDemo && (
                      <a 
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        aria-label="Live Demo"
                      >
                        <FaExternalLinkAlt className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection; 