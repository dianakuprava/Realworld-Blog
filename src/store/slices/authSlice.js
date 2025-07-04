import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, getCurrentUser, updateUser } from '@/Api/Api.js';

/**
 * Handle authentication errors consistently
 */
const handleAuthError = (error) => {
  if (error.response && error.response.data) {
    return error.response.data;
  }
  return error.message || 'Authentication error';
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.user.token);
      return response.user;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await registerUser({ username, email, password });
      localStorage.setItem('token', response.user.token);
      return response.user;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No authentication token found');
    }

    try {
      const response = await getCurrentUser(token);
      return response.user;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No authentication token found');
    }

    try {
      const response = await updateUser(userData, token);
      return response.user;
    } catch (error) {
      return rejectWithValue(handleAuthError(error));
    }
  }
);

export const logout = createAsyncThunk('auth/logout', () => {
  localStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const authCase = (action, successHandler) => {
      builder
        .addCase(action.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(action.fulfilled, (state, action) => {
          successHandler(state, action);
          state.loading = false;
        })
        .addCase(action.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        });
    };

    authCase(login, (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });

    authCase(register, (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });

    authCase(fetchCurrentUser, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    authCase(updateProfile, (state, action) => {
      state.user = action.payload;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
  },
});

export default authSlice.reducer;
