import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import analysisReducer from '../features/analysis/analysisSlice';
import portfolioReducer from '../features/portfolio/portfolioSlice';
import chatReducer from '../features/chat/chatSlice';
import leaderboardReducer from '../features/leaderboard/leaderboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    analysis: analysisReducer,
    portfolio: portfolioReducer,
    chat: chatReducer,
    leaderboard: leaderboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
