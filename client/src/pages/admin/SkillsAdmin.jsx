import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { skillService } from '../../services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Predefined categories for skills
const SKILL_CATEGORIES = [
  'Frontend', 
  'Backend', 
  'Database', 
  'DevOps', 
  'Design', 
  'Mobile', 
  'Cloud',
  'AI/ML', 
  'Blockchain', 
  'Security',
  'Other'
];

const SkillsAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: '', level: 80 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editSkill, setEditSkill] = useState(null);
  const [formError, setFormError] = useState('');
  const [customCategory, setCustomCategory] = useState(false);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const response = await skillService.getAllSkills();
      setSkills(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching skills:', err);
      // Check for auth errors specifically
      if (err.status === 401) {
        setError('Authentication failed. Please log out and log back in.');
      } else if (err.status === 403) {
        setError('Not authorized to access skills management. Your account needs admin privileges.');
      } else {
        setError('Failed to load skills. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await skillService.deleteSkill(deleteId);
      setSkills(skills.filter(skill => skill._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting skill:', err);
      // Check for auth errors specifically
      if (err.status === 401) {
        setError('Authentication failed. Please log out and log back in.');
      } else if (err.status === 403) {
        setError('Not authorized to delete skills. Your account needs admin privileges.');
      } else {
        setError('Failed to delete skill. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setNewSkill({ name: '', category: '', level: 80 });
    setEditSkill(null);
    setFormError('');
    setCustomCategory(false);
  };

  const handleAddClick = useCallback(() => {
    resetForm();
    setShowAddModal(true);
    
    // Remove the 'action=add' from URL to prevent reopening the modal on page refresh
    if (location.search.includes('action=add')) {
      navigate('/admin/skills', { replace: true });
    }
  }, [location.search, navigate]);
  
  // Check URL parameters on component mount and when location changes
  useEffect(() => {
    fetchSkills();
    
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      // Small delay to ensure component is fully mounted
      setTimeout(() => {
        handleAddClick();
      }, 100);
    }
  }, [location.search, handleAddClick]);

  const handleEditClick = (skill) => {
    resetForm();
    // Check if skill has a custom category that's not in our predefined list
    const isCustomCategory = !SKILL_CATEGORIES.includes(skill.category);
    setCustomCategory(isCustomCategory);
    setNewSkill({ ...skill });
    setShowAddModal(true);
    setEditSkill(skill);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category' && value === 'custom') {
      setCustomCategory(true);
      setNewSkill(prev => ({
        ...prev,
        category: ''
      }));
      return;
    }
    
    setNewSkill(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value, 10) : value
    }));
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!newSkill.name || !newSkill.category) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    // Additional validation for custom category
    if (customCategory && newSkill.category.trim().length < 2) {
      setFormError('Custom category must be at least 2 characters long');
      return;
    }
    
    // Check if category is not in predefined list - treat as custom
    const isKnownCategory = SKILL_CATEGORIES.includes(newSkill.category);
    
    // Normalize category - capitalize first letter for custom categories
    let formattedCategory = newSkill.category.trim();
    
    // Format custom categories (capitalize first letter)
    if (!isKnownCategory && formattedCategory) {
      formattedCategory = 
        formattedCategory.charAt(0).toUpperCase() + 
        formattedCategory.slice(1);
    }
    
    // Prepare skill data with formatted category
    const skillData = {
      ...newSkill,
      category: formattedCategory
    };
    
    setIsSubmitting(true);
    setFormError('');
    setError('');

    try {
      let updatedData;
      if (editSkill) {
        // Update existing skill
        const updatedSkill = await skillService.updateSkill(editSkill._id, skillData);
        updatedData = updatedSkill.data;
        setSkills(skills.map(s => s._id === editSkill._id ? updatedData : s));
      } else {
        // Add new skill
        const response = await skillService.createSkill(skillData);
        updatedData = response.data;
        setSkills([...skills, updatedData]);
      }
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving skill:', err);
      
      // Handle auth errors specifically
      if (err.status === 401) {
        setFormError('Authentication failed. Please log out and log back in.');
      } else if (err.status === 403) {
        setFormError('Not authorized to manage skills. Your account needs admin privileges.');
      }
      // Handle validation errors
      else if (err.status === 400 && err.message.includes('category')) {
        setFormError('The selected category is not valid. Please choose from the predefined categories or contact your administrator.');
      } else {
        setFormError(err.message || 'Failed to save skill. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Skills</h1>
          <p className="text-secondary-600 dark:text-secondary-400">Manage your skills and expertise</p>
        </div>
        <button
          onClick={handleAddClick}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Skill
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">No skills found</p>
          <button
            onClick={handleAddClick}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(skill)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(skill._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-300 mb-4">
                  {skill.category}
                </span>
                
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Proficiency
                    </span>
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-secondary-500 dark:bg-secondary-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-secondary-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-secondary-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white mb-4">
                    {editSkill ? 'Edit Skill' : 'Add New Skill'}
                  </h3>
                  
                  {formError && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                      {formError}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        Skill Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newSkill.name}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="e.g. React, Node.js, etc."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        Category
                      </label>
                      {!customCategory ? (
                        <select
                          id="category"
                          name="category"
                          value={newSkill.category}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                        >
                          <option value="">Select a category</option>
                          {SKILL_CATEGORIES.map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                          <option value="custom">Custom</option>
                        </select>
                      ) : (
                        <div>
                          <input
                            type="text"
                            id="category"
                            name="category"
                            value={newSkill.category}
                            onChange={handleInputChange}
                            required
                            className="input-field mb-2"
                            placeholder="Enter custom category"
                          />
                          <button
                            type="button"
                            onClick={() => setCustomCategory(false)}
                            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                          >
                            Use predefined category instead
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        Proficiency Level: {newSkill.level}%
                      </label>
                      <input
                        type="range"
                        id="level"
                        name="level"
                        min="10"
                        max="100"
                        step="5"
                        value={newSkill.level}
                        onChange={handleInputChange}
                        className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary-50 dark:bg-secondary-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : editSkill ? 'Update' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-secondary-300 dark:border-secondary-700 shadow-sm px-4 py-2 bg-white dark:bg-secondary-800 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-secondary-500 dark:bg-secondary-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-secondary-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-secondary-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                      Delete Skill
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Are you sure you want to delete this skill? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-secondary-50 dark:bg-secondary-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isDeleting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-secondary-300 dark:border-secondary-700 shadow-sm px-4 py-2 bg-white dark:bg-secondary-800 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default SkillsAdmin; 