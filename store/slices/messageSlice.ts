import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Message {
  _id: string
  chat: string
  sender: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  content: string
  type: 'text' | 'image' | 'emoji'
  imageUrl?: string
  createdAt: string
}

interface MessageState {
  messages: { [chatId: string]: Message[] }
  loading: boolean
  error: string | null
  typingUsers: { [chatId: string]: string[] }
}

const initialState: MessageState = {
  messages: {},
  loading: false,
  error: null,
  typingUsers: {},
}

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (chatId: string) => {
    const response = await axios.get(
      `${API_URL}/api/messages/${chatId}`,
      getAuthHeaders()
    )
    return { chatId, messages: response.data }
  }
)

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const chatId = action.payload.chat
      if (!state.messages[chatId]) {
        state.messages[chatId] = []
      }
      state.messages[chatId].push(action.payload)
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      state.messages[action.payload.chatId] = action.payload.messages
    },
    setTyping: (state, action: PayloadAction<{ chatId: string; userId: string; userName: string; isTyping: boolean }>) => {
      const { chatId, userId, userName, isTyping } = action.payload
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = []
      }
      if (isTyping) {
        if (!state.typingUsers[chatId].includes(userName)) {
          state.typingUsers[chatId].push(userName)
        }
      } else {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter(
          (name) => name !== userName
        )
      }
    },
    clearTyping: (state, action: PayloadAction<string>) => {
      state.typingUsers[action.payload] = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages[action.payload.chatId] = action.payload.messages
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch messages'
      })
  },
})

export const { addMessage, setMessages, setTyping, clearTyping } = messageSlice.actions
export default messageSlice.reducer

