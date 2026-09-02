import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';
import { RankTier } from '../../types';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  rankTier: RankTier;
  roi: number;
  connectionStatus: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'CONNECTED';
}

interface UsersState {
  searchResults: UserSummary[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  searchResults: [],
  searchQuery: '',
  loading: false,
  error: null,
};

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api.get<{ users: UserSummary[] }>(`/users?query=${encodeURIComponent(query)}`);
      return { query, users: response.data.users };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error searching user directory.');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    updateUserConnectionStatus(state, action: { payload: { userId: string; status: UserSummary['connectionStatus'] } }) {
      const u = state.searchResults.find((x) => x.id === action.payload.userId);
      if (u) {
        u.connectionStatus = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchQuery = action.payload.query;
        state.searchResults = action.payload.users;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, updateUserConnectionStatus } = usersSlice.actions;
export default usersSlice.reducer;
