import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '../../types';

interface ChatState {
  activeTickerRoom: string;
  messages: ChatMessage[];
  isConnected: boolean;
  error: string | null;
}

const initialState: ChatState = {
  activeTickerRoom: 'AAPL',
  messages: [],
  isConnected: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveTickerRoom: (state, action: PayloadAction<string>) => {
      state.activeTickerRoom = action.payload.toUpperCase();
      state.messages = [];
    },
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setRoomHistory: (state, action: PayloadAction<{ ticker: string; messages: ChatMessage[] }>) => {
      if (state.activeTickerRoom === action.payload.ticker) {
        state.messages = action.payload.messages;
      }
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (action.payload.ticker === state.activeTickerRoom) {
        // Prevent duplicate messages by id
        if (!state.messages.some((m) => m.id === action.payload.id)) {
          state.messages.push(action.payload);
        }
      }
    },
    setChatError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setActiveTickerRoom, setSocketConnected, setRoomHistory, addMessage, setChatError } =
  chatSlice.actions;
export default chatSlice.reducer;
