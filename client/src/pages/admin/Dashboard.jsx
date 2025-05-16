import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { projectService, skillService, contactService } from '../../services/api';
import { FolderIcon, WrenchIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    newMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Individual try/catch blocks for better error handling
        let projectsCount = 0;
        let skillsCount = 0;
        let messagesData = [];
        
        try {
          const projectsRes = await projectService.getAllProjects();
          projectsCount = Array.isArray(projectsRes.data) ? projectsRes.data.length : 0;
        } catch (err) {
          console.error('Error fetching projects:', err);
        }
        
        try {
          const skillsRes = await skillService.getAllSkills();
          skillsCount = Array.isArray(skillsRes.data) ? skillsRes.data.length : 0;
        } catch (err) {
          console.error('Error fetching skills:', err);
        }
        
        try {
          const messagesRes = await contactService.getAllContacts();
          messagesData = Array.isArray(messagesRes.data) ? messagesRes.data : [];
        } catch (err) {
          console.error('Error fetching messages:', err);
        }

        setStats({
          projects: projectsCount,
          skills: skillsCount,
          messages: messagesData.length,
          newMessages: messagesData.filter(m => !m.isRead).length,
        });
        
        setError('');
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load some dashboard statistics. Please refresh or try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const statItems = [
    {
      name: 'Projects',
      count: stats.projects,
      icon: FolderIcon,
      path: '/admin/projects',
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Skills',
      count: stats.skills,
      icon: WrenchIcon,
      path: '/admin/skills',
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      name: 'Messages',
      count: stats.messages,
      badge: stats.newMessages ? { text: `${stats.newMessages} new`, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' } : null,
      icon: EnvelopeIcon,
      path: '/admin/messages',
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Dashboard</h1>
          <p className="text-secondary-600 dark:text-secondary-400">Welcome to your admin dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {statItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className="block bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${item.color} mr-4`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                        {item.name}
                      </p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                          {item.count}
                        </p>
                        {item.badge && (
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${item.badge.color}`}>
                            {item.badge.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-secondary-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin/projects/new"
                className="btn-primary text-center py-2 px-4 rounded-md flex items-center justify-center"
              >
                Add New Project
              </Link>
              <Link
                to="/admin/skills?action=add"
                className="btn-primary text-center py-2 px-4 rounded-md flex items-center justify-center"
              >
                Add New Skill
              </Link>
              <Link
                to="/admin/messages"
                className="btn-secondary text-center py-2 px-4 rounded-md flex items-center justify-center"
              >
                View Messages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 