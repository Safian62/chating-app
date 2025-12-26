import { io, Socket } from 'socket.io-client'
import { store } from '@/store/store'
import { addMessage } from '@/store/slices/messageSlice'
import { updateChat } from '@/store/slices/chatSlice'
import { setTyping, clearTyping } from '@/store/slices/messageSlice'

let socket: Socket | null = null

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

export const initSocket = (token: string) => {
  if (socket?.connected) return

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  })

  socket.on('connect', () => {
    console.log('Socket connected')
  })

  socket.on('receive-message', (message: any) => {
    store.dispatch(addMessage(message))
    
    // Update chat with last message
    const state = store.getState()
    const chat = state.chat.chats.find((c) => c._id === message.chat)
    if (chat) {
      store.dispatch(updateChat({ ...chat, lastMessage: message }))
    }
  })

  socket.on('user-typing', (data: { userId: string; userName: string; isTyping: boolean }) => {
    const state = store.getState()
    const currentChat = state.chat.currentChat
    if (currentChat) {
      store.dispatch(
        setTyping({
          chatId: currentChat._id,
          userId: data.userId,
          userName: data.userName,
          isTyping: data.isTyping,
        })
      )
    }
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('error', (error: any) => {
    console.error('Socket error:', error)
  })
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const joinRoom = (chatId: string) => {
  if (socket) {
    socket.emit('join-room', chatId)
  }
}

export const leaveRoom = (chatId: string) => {
  if (socket) {
    socket.emit('leave-room', chatId)
  }
}

export const sendMessage = (data: {
  chatId: string
  senderId: string
  content: string
  type: 'text' | 'image' | 'emoji'
  imageUrl?: string
}) => {
  if (socket) {
    socket.emit('send-message', data)
  }
}

export const sendTyping = (chatId: string, userId: string, userName: string, isTyping: boolean) => {
  if (socket) {
    socket.emit('typing', { chatId, userId, userName, isTyping })
  }
}

export const stopTyping = (chatId: string, userId: string, userName: string) => {
  sendTyping(chatId, userId, userName, false)
}

