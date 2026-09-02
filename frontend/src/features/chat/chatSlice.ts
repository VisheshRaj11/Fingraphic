import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../lib/api';
import { RankTier } from '../../types';

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  roiAtSend: number;
  rankTier: RankTier;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface Connection {
  connectionId: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    rankTier: RankTier;
    roi: number;
  };
  connectedAt: string;
}

export interface PendingRequest {
  connectionId: string;
  requester: {
    id: string;
    name: string;
    avatarUrl?: string;
    rankTier: RankTier;
    roi: number;
  };
  createdAt: string;
}

interface ChatState {
  activeConversationUserId: string | null;
  messagesByUserId: Record<string, ChatMessage[]>;
  connections: Connection[];
  pendingRequests: PendingRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  activeConversationUserId: null,
  messagesByUserId: {},
  connections: [],
  pendingRequests: [],
  loading: false,
  error: null,
};

export const loadConnections = createAsyncThunk(
  'chat/loadConnections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ connections: Connection[] }>('/connections');
      return response.data.connections;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching connections.');
    }
  }
);

export const loadPendingRequests = createAsyncThunk(
  'chat/loadPendingRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ pendingRequests: PendingRequest[] }>('/connections/pending');
      return response.data.pendingRequests;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching pending requests.');
    }
  }
);

export const loadConversationHistory = createAsyncThunk(
  'chat/loadConversationHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<{ history: ChatMessage[] }>(`/chat/${userId}`);
      return { userId, history: response.data.history };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error loading chat history.');
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'chat/sendConnectionRequest',
  async (recipientId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/connections', { recipientId });
      dispatch(loadConnections());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error sending connection request.');
    }
  }
);

export const respondToConnectionRequest = createAsyncThunk(
  'chat/respondToConnectionRequest',
  async (
    { connectionId, decision }: { connectionId: string; decision: 'ACCEPTED' | 'REJECTED' },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await api.patch(`/connections/${connectionId}`, { decision });
      dispatch(loadPendingRequests());
      dispatch(loadConnections());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error responding to request.');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationUserId = action.payload;
    },
    receiveMessage(state, action: PayloadAction<{ currentUserId: string; message: ChatMessage }>) {
      const { currentUserId, message } = action.payload;
      const otherUserId = message.senderId === currentUserId ? message.recipientId : message.senderId;

      if (!state.messagesByUserId[otherUserId]) {
        state.messagesByUserId[otherUserId] = [];
      }

      // Avoid duplicates
      const exists = state.messagesByUserId[otherUserId].some((m) => m.id === message.id);
      if (!exists) {
        state.messagesByUserId[otherUserId].push(message);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadConnections.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(loadPendingRequests.fulfilled, (state, action) => {
        state.pendingRequests = action.payload;
      })
      .addCase(loadConversationHistory.fulfilled, (state, action) => {
        state.messagesByUserId[action.payload.userId] = action.payload.history;
      });
  },
});

export const { setActiveConversation, receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;
