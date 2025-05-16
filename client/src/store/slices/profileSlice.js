import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api';

// Async thunk to fetch profile data
export const fetchProfileData = createAsyncThunk(
  'profile/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      console.log('⚙️ Fetching profile data from server...');
      const response = await authService.getCurrentUser();
      console.log('📋 Response from getCurrentUser:', response);
      
      // Extract user data from the response
      const userData = response.data.user || response.data;
      console.log('🧑 Extracted user data:', userData);
      
      // Calculate the experience label
      const yearsExp = userData.yearsOfExperience || 0;
      const experienceLabel = yearsExp > 0 
        ? `${yearsExp} year${yearsExp > 1 ? 's' : ''}` 
        : 'Fresher';
      
      const profileData = {
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        yearsOfExperience: yearsExp,
        bio: userData.bio || '',
        profileImage: userData.profileImage || '',
        socialLinks: userData.socialLinks || {
          github: '',
          linkedin: '',
          twitter: '',
          website: ''
        },
        experienceLabel: experienceLabel
      };
      
      console.log('✅ Extracted profile data:', profileData);
      return profileData;
    } catch (error) {
      console.error('❌ Error fetching profile data:', error);
      return rejectWithValue(error.message || 'Failed to fetch profile data');
    }
  }
);

// Async thunk to update profile data
export const updateProfileData = createAsyncThunk(
  'profile/updateData',
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      if (profileData.yearsOfExperience !== undefined) {
        profileData.yearsOfExperience = parseInt(profileData.yearsOfExperience, 10) || 0;
      }
      
      const response = await authService.updateProfile(profileData);
      
      dispatch(fetchProfileData());
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Initial state
const initialState = {
  profileData: {
    name: '',
    email: '',
    phone: '',
    location: '',
    yearsOfExperience: 0,
    experienceLabel: 'Fresher',
    bio: '',
    profileImage: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      website: ''
    }
  },
  isLoading: false,
  error: null,
  lastUpdated: null
};

// Create the profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Synchronous actions
    resetProfileState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch profile data
      .addCase(fetchProfileData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileData = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Handle update profile data
      .addCase(updateProfileData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        // Note: We don't update profileData here because we dispatch fetchProfileData after update
        // which will update the state with the latest data from the server
      })
      .addCase(updateProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { resetProfileState } = profileSlice.actions;

// Export selectors
export const selectProfileData = (state) => state.profile.profileData;
export const selectProfileLoading = (state) => state.profile.isLoading;
export const selectProfileError = (state) => state.profile.error;
export const selectLastUpdated = (state) => state.profile.lastUpdated;

// Export reducer
export default profileSlice.reducer; 