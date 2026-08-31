import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../lib/api';
import { AnalysisResult } from '../../types';

interface AnalysisState {
  searchTicker: string;
  currentAnalysis: AnalysisResult | null;
  isLoading: boolean;
  activeStepNode: number;
  error: string | null;
}

const initialState: AnalysisState = {
  searchTicker: 'AAPL',
  currentAnalysis: null,
  isLoading: false,
  activeStepNode: 0,
  error: null,
};

export const fetchStockAnalysis = createAsyncThunk(
  'analysis/fetchStockAnalysis',
  async (ticker: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/analyze/${ticker}`);
      return response.data.data as AnalysisResult;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch analysis');
    }
  }
);

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setSearchTicker: (state, action: PayloadAction<string>) => {
      state.searchTicker = action.payload.toUpperCase();
    },
    setActiveStepNode: (state, action: PayloadAction<number>) => {
      state.activeStepNode = action.payload;
    },
    clearAnalysisError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.activeStepNode = 1;
      })
      .addCase(fetchStockAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAnalysis = action.payload;
        state.activeStepNode = 6;
      })
      .addCase(fetchStockAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.activeStepNode = 0;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTicker, setActiveStepNode, clearAnalysisError } = analysisSlice.actions;
export default analysisSlice.reducer;
