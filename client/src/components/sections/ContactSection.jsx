import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { contactService } from '../../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileData, selectProfileLoading, fetchProfileData } from '../../store/slices/profileSlice';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Use Redux instead of context
  const profileData = useSelector(selectProfileData);
  const isLoading = useSelector(selectProfileLoading);
  const dispatch = useDispatch();

  // Fetch profile data if not already loaded
  useEffect(() => {
    console.log('ContactSection: Dispatching fetchProfileData action');
    dispatch(fetchProfileData());
  }, [dispatch]);

  // Add debug logging
  useEffect(() => {
    console.log('ContactSection: Profile data state updated:', profileData);
  }, [profileData]);

  // Default values for when profileData is loading or null
  const contactInfo = {
    name: profileData?.name || 'Portfolio Owner',
    location: profileData?.location || 'New York, NY, USA',
    email: profileData?.email || 'developer@example.com',
    phone: profileData?.phone || '+1 (234) 567-8900'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await contactService.submitContact(formData);
      setSubmitStatus({
        type: 'success',
        message: 'Your message has been sent successfully. I will get back to you soon!'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or contact me directly via email.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-6">
          Contact <span className="text-primary-600 dark:text-primary-400">{contactInfo.name}</span>
        </h1>

        <p className="text-secondary-700 dark:text-secondary-300 mb-12">
          Feel free to reach out with any questions, project inquiries, or just to say hello.
          I'd love to hear from you!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 text-center"
          >
            <div className="inline-block p-4 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
              <FaMapMarkerAlt className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">Location</h3>
            <p className="text-secondary-600 dark:text-secondary-400">{contactInfo.location}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 text-center"
          >
            <div className="inline-block p-4 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
              <FaEnvelope className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">Email</h3>
            <div className="flex justify-center">
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {contactInfo.email}
              </a>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 text-center"
          >
            <div className="inline-block p-4 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
              <FaPhone className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">Phone</h3>
            <a
              href={`tel:${contactInfo.phone}`}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              {contactInfo.phone}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
              Send Me A Message
            </h2>

            {submitStatus && (
              <div className={`mb-6 p-4 rounded-md ${submitStatus.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                }`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Project Inquiry"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="input-field"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary w-full md:w-auto ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactSection; 