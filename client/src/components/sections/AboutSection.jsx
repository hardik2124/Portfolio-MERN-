import React, { useEffect } from 'react';
import { FaCode, FaLaptopCode, FaServer, FaMobileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileData, selectProfileLoading, fetchProfileData } from '../../store/slices/profileSlice';

const AboutSection = () => {
  // Use Redux instead of context
  const profileData = useSelector(selectProfileData);
  const isLoading = useSelector(selectProfileLoading);
  const dispatch = useDispatch();
  
  // Fetch profile data when the component mounts
  useEffect(() => {
    // Force a fresh data fetch by dispatching the action
    dispatch(fetchProfileData());
    
    // Setup a refresh interval (optional)
    const intervalId = setInterval(() => {
      dispatch(fetchProfileData());
    }, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [dispatch]);
  
  // Log for debugging
  useEffect(() => {
    console.log('AboutSection received profileData:', profileData);
  }, [profileData]);
  
  // Default values for when profileData is loading or null
  const aboutInfo = {
    name: profileData?.name || 'Me',
    bio: profileData?.bio || "I'm a passionate Full Stack Developer in training, focused on building modern and responsive web applications. As a self-motivated learner and Computer Science student, I've worked on several personal projects using the MERN stack and am continuously expanding my skills through hands-on development.",
    yearsOfExperience: profileData?.yearsOfExperience || 5,
    experienceLabel: profileData?.experienceLabel || 'Fresher',
    profileImage: profileData?.profileImage || ''
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-8">
          About <span className="text-primary-600 dark:text-primary-400">{aboutInfo.name}</span>
        </h1>

        <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md overflow-hidden mb-12">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {aboutInfo.profileImage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0"
                >
                  <img 
                    src={aboutInfo.profileImage} 
                    alt={aboutInfo.name}
                    className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-primary-500"
                    onError={(e) => {
                      console.error('Error loading profile image:', e);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200';
                    }}
                  />
                </motion.div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                  Who I Am
                </h2>
                <p className="text-secondary-700 dark:text-secondary-300 mb-6">
                  {aboutInfo.bio}
                </p>
                <p className="text-secondary-700 dark:text-secondary-300">
                  My journey in web development started when I was in college, and since then, I've been
                  continuously learning and adapting to new technologies. I believe in writing clean,
                  maintainable code and creating intuitive user experiences.
                </p>
                
                <div className="mt-4 bg-primary-100 dark:bg-primary-900/20 px-4 py-2 rounded-lg inline-block">
                  <span className="font-medium text-primary-700 dark:text-primary-400">
                    {profileData?.experienceLabel || (aboutInfo.yearsOfExperience > 0 
                      ? `${aboutInfo.yearsOfExperience}+ years of experience` 
                      : 'Fresher')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
          What I <span className="text-primary-600 dark:text-primary-400">Do</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaCode className="text-primary-600 dark:text-primary-400 text-2xl mr-3" />
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Frontend Development
                </h3>
              </div>
              <p className="text-secondary-700 dark:text-secondary-300">
                I create responsive, accessible, and visually appealing user interfaces using
                modern frontend technologies like React, Next.js, and Tailwind CSS.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaServer className="text-primary-600 dark:text-primary-400 text-2xl mr-3" />
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Backend Development
                </h3>
              </div>
              <p className="text-secondary-700 dark:text-secondary-300">
                I build robust and scalable server-side applications using Node.js, Express,
                MongoDB, and other modern backend technologies.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaLaptopCode className="text-primary-600 dark:text-primary-400 text-2xl mr-3" />
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Full Stack Solutions
                </h3>
              </div>
              <p className="text-secondary-700 dark:text-secondary-300">
                I develop end-to-end solutions from concept to deployment, ensuring seamless
                integration between frontend and backend components.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaMobileAlt className="text-primary-600 dark:text-primary-400 text-2xl mr-3" />
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Responsive Design
                </h3>
              </div>
              <p className="text-secondary-700 dark:text-secondary-300">
                I ensure that applications look and work perfectly on all devices, from
                desktops to tablets and mobile phones.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
          My <span className="text-primary-600 dark:text-primary-400">Journey</span>
        </h2>

        <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md overflow-hidden mb-12">
          <div className="p-6 md:p-8">
            <div className="space-y-8">
              <div className="border-l-4 border-primary-500 pl-4 pb-2">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Full-Stack Developer in Training 
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-2">
                  2024 - Present
                </p>
                <p className="text-secondary-700 dark:text-secondary-300">
                  Building full-stack web applications using React, Node.js, Express, and MongoDB. Focused on developing scalable projects and improving backend logic.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4 pb-2">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Diving into Full Stack Development
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-2">
                  2023 – 2024
                </p>
                <p className="text-secondary-700 dark:text-secondary-300">
                  Learned and applied React, JavaScript, and Tailwind CSS. Built responsive and interactive web apps like a portfolio site, weather app, and to-do list.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4 pb-2">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Web Development Beginner
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-2">
                  2022 – 2023  
                </p>
                <p className="text-secondary-700 dark:text-secondary-300">
                  Started learning HTML, CSS, and basic JavaScript. followed online tutorials, and practiced by cloning simple websites.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4 pb-2">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Computer Science Student - [Darshan University]
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-2">
                  2022 – Present
                </p>
                <p className="text-secondary-700 dark:text-secondary-300">
                  Currently pursuing a Computer Science degree. Alongside academics, self-learning web development through documentation, courses, and hands-on practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection; 