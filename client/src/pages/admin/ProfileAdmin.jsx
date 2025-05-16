import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileData, selectProfileData, selectProfileLoading } from '../../store/slices/profileSlice';
import { UserIcon, CameraIcon } from '@heroicons/react/24/outline';
import ImageCropper from '../../components/admin/ImageCropper';

const ProfileAdmin = () => {
  const { isLoading: authLoading, refreshUserData } = useAuth();
  const dispatch = useDispatch();
  
  // Use Redux data directly
  const reduxProfileData = useSelector(selectProfileData);
  const isReduxLoading = useSelector(selectProfileLoading);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    yearsOfExperience: 0,
    bio: '',
    avatarUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  // New state for image cropping
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  
  // New state for displaying experience as "Fresher" when it's 0
  const [displayExperience, setDisplayExperience] = useState('Fresher');

  useEffect(() => {
    // Update local state from Redux data when available
    if (reduxProfileData && !isReduxLoading) {
      setProfile({
        name: reduxProfileData.name || '',
        email: reduxProfileData.email || '',
        phone: reduxProfileData.phone || '',
        location: reduxProfileData.location || '',
        yearsOfExperience: reduxProfileData.yearsOfExperience || 0,
        bio: reduxProfileData.bio || '',
        avatarUrl: reduxProfileData.profileImage || '',
      });
      
      // Update display experience
      setDisplayExperience(reduxProfileData.yearsOfExperience > 0 
        ? `${reduxProfileData.yearsOfExperience} year${reduxProfileData.yearsOfExperience > 1 ? 's' : ''}` 
        : 'Fresher');
      
      if (reduxProfileData.profileImage) {
        setPreviewImage(reduxProfileData.profileImage);
      }
      
      setIsLoading(false);
    }
  }, [reduxProfileData, isReduxLoading]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getCurrentUser();
        
        if (response.data) {
          // Map the response data to our profile state
          const userData = response.data.user || response.data;
          const yearsExp = userData.yearsOfExperience || 0;
          
          setProfile({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            location: userData.location || '',
            yearsOfExperience: yearsExp,
            bio: userData.bio || '',
            avatarUrl: userData.profileImage || '',
          });
          
          // Update experience display
          setDisplayExperience(yearsExp > 0 
            ? `${yearsExp} year${yearsExp > 1 ? 's' : ''}` 
            : 'Fresher');
          
          if (userData.profileImage) {
            setPreviewImage(userData.profileImage);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && !reduxProfileData.name) {
      fetchProfile();
    }
  }, [authLoading, reduxProfileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for years of experience
    if (name === 'yearsOfExperience') {
      const yearsValue = parseInt(value, 10) || 0;
      setProfile(prev => ({
        ...prev,
        [name]: yearsValue
      }));
      
      // Update display text
      setDisplayExperience(yearsValue > 0 
        ? `${yearsValue} year${yearsValue > 1 ? 's' : ''}` 
        : 'Fresher');
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, or GIF)');
        return;
      }
      
      // Clear any previous errors
      setError('');
      
      // Instead of setting the preview directly, we'll open the cropper
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage) => {
    // Set the cropped image as preview
    setPreviewImage(croppedImage);
    
    // Convert base64 back to a file object for upload
    fetch(croppedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "cropped-image.png", { type: "image/png" });
        
        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        
        // Replace the file in the file input
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files;
        }
      });
    
    // Close the cropper
    setShowCropper(false);
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Handle file upload if there's a new image
      if (fileInputRef.current.files.length > 0) {
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append('avatar', file);
        
        // Upload image to Cloudinary via our server endpoint
        const uploadResponse = await authService.uploadAvatar(formData);
        
        if (uploadResponse.data?.data?.profileImage) {
          profile.avatarUrl = uploadResponse.data.data.profileImage;
        } else if (uploadResponse.data?.profileImage) {
          profile.avatarUrl = uploadResponse.data.profileImage;
        } else if (uploadResponse.data?.avatarUrl) {
          profile.avatarUrl = uploadResponse.data.avatarUrl;
        }
      }
      
      // Create a copy of the profile object for the update
      const profileUpdate = { 
        ...profile,
        // Map avatarUrl to profileImage for the API
        profileImage: profile.avatarUrl
      };
      
      // Update profile data using Redux
      await dispatch(updateProfileData(profileUpdate)).unwrap();
      
      setSuccess('Profile updated successfully!');
      
      // Refresh user data in the global context
      await refreshUserData();
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        name: profileUpdate.name || prev.name,
        email: profileUpdate.email || prev.email,
        phone: profileUpdate.phone || prev.phone,
        location: profileUpdate.location || prev.location,
        yearsOfExperience: profileUpdate.yearsOfExperience || prev.yearsOfExperience,
        bio: profileUpdate.bio || prev.bio,
        avatarUrl: profileUpdate.profileImage || prev.avatarUrl,
      }));
        
      if (profileUpdate.profileImage) {
        setPreviewImage(profileUpdate.profileImage);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
      
      // Clear success message after 3 seconds
      if (success) {
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  if (isLoading) {
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Profile</h1>
            <p className="text-secondary-600 dark:text-secondary-400">Manage your personal information</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md">
            {success}
          </div>
        )}

        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="profile-image-container">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="profile-image" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=Profile";
                        }}
                      />
                    ) : (
                      <UserIcon className="h-16 w-16 text-secondary-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors shadow-md"
                    aria-label="Change profile picture"
                  >
                    <CameraIcon className="h-5 w-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
                >
                  Change Profile Photo
                </button>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                  The image will be cropped to a circle
                </p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="New York, USA"
                  />
                </div>
                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Years of Experience
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      value={profile.yearsOfExperience}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      className="input-field"
                    />
                    <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                      {displayExperience}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label htmlFor="bio" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={profile.bio}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="A short bio about yourself..."
                ></textarea>
              </div>
            </div>

            <div className="bg-secondary-50 dark:bg-secondary-800 px-6 py-4 border-t border-secondary-200 dark:border-secondary-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCropCancel={handleCropCancel}
        />
      )}
    </AdminLayout>
  );
};

export default ProfileAdmin; 