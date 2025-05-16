import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject, createProject, updateProject, selectCurrentProject, selectProjectsLoading } from '../../store/slices/projectSlice';
import { ArrowLeftIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import AdminLayout from './AdminLayout';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;

  // Get project data from Redux
  const currentProject = useSelector(selectCurrentProject);
  const isReduxLoading = useSelector(selectProjectsLoading);

  const [project, setProject] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    image: '',
    demoUrl: '',
    repoUrl: '',
    featured: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      // Fetch project using Redux
      dispatch(fetchProject(id));
    }
  }, [dispatch, id, isEditMode]);

  // Update local state when Redux data changes
  useEffect(() => {
    if (currentProject && isEditMode) {
      // Map Redux data to local state
      setProject({
        title: currentProject.title || '',
        description: currentProject.description || '',
        category: currentProject.category || '',
        tags: currentProject.tags || [],
        image: currentProject.image || '',
        demoUrl: currentProject.demoUrl || '',
        repoUrl: currentProject.repoUrl || '',
        featured: currentProject.featured || false,
      });
      
      // Set preview image if available
      if (currentProject.image) {
        setPreviewImage(currentProject.image);
      }
      
      setIsLoading(false);
    }
  }, [currentProject, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!project.tags.includes(tagInput.trim())) {
        setProject((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare the file for upload if a new image is selected
      const imageFile = fileInputRef.current?.files?.[0] || null;
      
      if (isEditMode) {
        // Use Redux to update the project
        await dispatch(updateProject({ 
          id, 
          projectData: project, 
          imageFile 
        })).unwrap();
      } else {
        // Use Redux to create a new project
        await dispatch(createProject({ 
          projectData: project, 
          imageFile 
        })).unwrap();
      }
      
      navigate('/admin/projects');
    } catch (err) {
      setError(err.message || 'Failed to save project. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading || isReduxLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/admin/projects')}
          className="mr-4 p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800"
        >
          <ArrowLeftIcon className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
        </button>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {isEditMode ? 'Edit Project' : 'Add New Project'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={project.title}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={project.description}
                onChange={handleChange}
                required
                rows={5}
                className="input-field resize-none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={project.category}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select a category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Backend">Backend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Image Upload Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Project Image
              </label>
              <div className="mt-1 flex items-center space-x-6">
                <div className="flex-shrink-0 h-32 w-32 bg-secondary-100 dark:bg-secondary-700 rounded-md overflow-hidden">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Project preview" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-secondary-400">
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="btn-secondary flex items-center"
                  >
                    <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                    {previewImage ? 'Change Image' : 'Upload Image'}
                  </button>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Recommended: 1200×630px, JPEG or PNG
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* Manual URL option */}
              <div className="mt-3">
                <label htmlFor="image" className="block text-xs font-medium text-secondary-500 dark:text-secondary-400">
                  Or enter image URL directly (optional)
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={project.image}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="demoUrl" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Demo URL
              </label>
              <input
                type="text"
                id="demoUrl"
                name="demoUrl"
                value={project.demoUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://demo-site.com"
              />
            </div>

            <div>
              <label htmlFor="repoUrl" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Repository URL
              </label>
              <input
                type="text"
                id="repoUrl"
                name="repoUrl"
                value={project.repoUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tags" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Tags (press Enter to add)
              </label>
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                className="input-field"
                placeholder="React, Node.js, etc."
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={project.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 dark:border-secondary-700 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                  Featured project (will be highlighted on homepage)
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProjectForm; 