import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../lib/api';
import { Portfolio, WatchlistItem, HoldingSide } from '../../types';

interface PortfolioState {
  portfolio: Portfolio | null;
  watchlist: WatchlistItem[];
  isLoading: boolean;
  isTradeLoading: boolean;
  tradeMessage: string | null;
  error: string | null;
}

const initialState: PortfolioState = {
  portfolio: null,
  watchlist: [],
  isLoading: false,
  isTradeLoading: false,
  tradeMessage: null,
  error: null,
};

export const fetchPortfolio = createAsyncThunk('portfolio/fetchPortfolio', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/portfolio');
    return response.data.portfolio as Portfolio;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch portfolio');
  }
});

export const executeTrade = createAsyncThunk(
  'portfolio/executeTrade',
  async (payload: { ticker: string; quantity: number; side: HoldingSide }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/portfolio/trade', payload);
      dispatch(fetchPortfolio());
      return response.data.message as string;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Trade failed');
    }
  }
);

export const fetchWatchlist = createAsyncThunk('portfolio/fetchWatchlist', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/portfolio/watchlist');
    return response.data.watchlist as WatchlistItem[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch watchlist');
  }
});

export const addToWatchlist = createAsyncThunk(
  'portfolio/addToWatchlist',
  async (payload: { ticker: string; notes?: string }, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/portfolio/watchlist', payload);
      dispatch(fetchWatchlist());
      return payload.ticker;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'portfolio/removeFromWatchlist',
  async (ticker: string, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/portfolio/watchlist/${ticker}`);
      dispatch(fetchWatchlist());
      return ticker;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove from watchlist');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearTradeMessage: (state) => {
      state.tradeMessage = null;
    },
    clearPortfolioError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.portfolio = action.payload;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(executeTrade.pending, (state) => {
        state.isTradeLoading = true;
        state.tradeMessage = null;
        state.error = null;
      })
      .addCase(executeTrade.fulfilled, (state, action) => {
        state.isTradeLoading = false;
        state.tradeMessage = action.payload;
      })
      .addCase(executeTrade.rejected, (state, action) => {
        state.isTradeLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      });
  },
});

export const { clearTradeMessage, clearPortfolioError } = portfolioSlice.actions;
export default portfolioSlice.reducer;
