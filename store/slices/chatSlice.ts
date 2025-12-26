import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Chat {
  _id: string
  participants: Array<{
    _id: string
    name: string
    email: string
    avatar?: string
    isOnline?: boolean
  }>
  lastMessage?: any
  updatedAt: string
}

interface ChatState {
  chats: Chat[]
  currentChat: Chat | null
  users: Array<{
    _id: string
    name: string
    email: string
    avatar?: string
    isOnline?: boolean
  }>
  loading: boolean
  error: string | null
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  users: [],
  loading: false,
  error: null,
}

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
  const response = await axios.get(`${API_URL}/api/chats`, getAuthHeaders())
  return response.data
})

export const fetchUsers = createAsyncThunk('chat/fetchUsers', async () => {
  const response = await axios.get(`${API_URL}/api/users`, getAuthHeaders())
  return response.data
})

export const createOrGetChat = createAsyncThunk(
  'chat/createOrGetChat',
  async (userId: string) => {
    const response = await axios.post(
      `${API_URL}/api/chats`,
      { userId },
      getAuthHeaders()
    )
    return response.data
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      const existingIndex = state.chats.findIndex(
        (chat) => chat._id === action.payload._id
      )
      if (existingIndex >= 0) {
        state.chats[existingIndex] = action.payload
      } else {
        state.chats.unshift(action.payload)
      }
    },
    updateChat: (state, action: PayloadAction<Chat>) => {
      const index = state.chats.findIndex(
        (chat) => chat._id === action.payload._id
      )
      if (index >= 0) {
        state.chats[index] = action.payload
      }
      if (state.currentChat?._id === action.payload._id) {
        state.currentChat = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false
        state.chats = action.payload
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch chats'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload
      })
      .addCase(createOrGetChat.fulfilled, (state, action) => {
        const existingIndex = state.chats.findIndex(
          (chat) => chat._id === action.payload._id
        )
        if (existingIndex >= 0) {
          state.chats[existingIndex] = action.payload
        } else {
          state.chats.unshift(action.payload)
        }
        state.currentChat = action.payload
      })
  },
})

export const { setCurrentChat, addChat, updateChat } = chatSlice.actions
export default chatSlice.reducer

