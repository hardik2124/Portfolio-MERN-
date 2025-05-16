import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../../services/api';

// Async thunk to fetch all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await projectService.getAllProjects(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch projects');
    }
  }
);

// Async thunk to fetch a single project
export const fetchProject = createAsyncThunk(
  'projects/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectService.getProject(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch project');
    }
  }
);

// Async thunk to create a new project with image upload
export const createProject = createAsyncThunk(
  'projects/create',
  async ({ projectData, imageFile }, { rejectWithValue, dispatch }) => {
    try {
      let imageUrl = '';
      
      // If an image file is provided, upload it to Cloudinary first
      if (imageFile) {
        const formData = new FormData();
        formData.append('projectImage', imageFile);
        
        const uploadResponse = await projectService.uploadProjectImage(formData);
        
        if (uploadResponse.data?.data?.imageUrl) {
          imageUrl = uploadResponse.data.data.imageUrl;
        } else if (uploadResponse.data?.imageUrl) {
          imageUrl = uploadResponse.data.imageUrl;
        }
      }
      
      // Create project with the Cloudinary image URL
      const finalProjectData = {
        ...projectData,
        image: imageUrl || projectData.image
      };
      
      const response = await projectService.createProject(finalProjectData);
      
      // Refresh the projects list
      dispatch(fetchProjects());
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create project');
    }
  }
);

// Async thunk to update a project with image upload
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, projectData, imageFile }, { rejectWithValue, dispatch }) => {
    try {
      let imageUrl = projectData.image;
      
      // If an image file is provided, upload it to Cloudinary first
      if (imageFile) {
        const formData = new FormData();
        formData.append('projectImage', imageFile);
        
        const uploadResponse = await projectService.uploadProjectImage(formData);
        
        if (uploadResponse.data?.data?.imageUrl) {
          imageUrl = uploadResponse.data.data.imageUrl;
        } else if (uploadResponse.data?.imageUrl) {
          imageUrl = uploadResponse.data.imageUrl;
        }
      }
      
      // Update project with the Cloudinary image URL
      const finalProjectData = {
        ...projectData,
        image: imageUrl
      };
      
      const response = await projectService.updateProject(id, finalProjectData);
      
      // Refresh the projects list
      dispatch(fetchProjects());
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update project');
    }
  }
);

// Async thunk to delete a project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await projectService.deleteProject(id);
      
      // Refresh the projects list
      dispatch(fetchProjects());
      
      return id;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      return rejectWithValue(error.message || 'Failed to delete project');
    }
  }
);

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null
};

// Create the projects slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    resetProjectState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Handle fetchProject
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Handle createProject
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // We'll refresh the full list via the fetchProjects call in the thunk
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Handle updateProject
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // We'll refresh the full list via the fetchProjects call in the thunk
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Handle deleteProject
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // We'll refresh the full list via the fetchProjects call in the thunk
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { clearCurrentProject, resetProjectState } = projectsSlice.actions;

// Export selectors
export const selectAllProjects = (state) => state.projects.projects;
export const selectCurrentProject = (state) => state.projects.currentProject;
export const selectProjectsLoading = (state) => state.projects.isLoading;
export const selectProjectsError = (state) => state.projects.error;

// Export reducer
export default projectsSlice.reducer; 