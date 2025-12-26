'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import MessageInput from './MessageInput'
import MessageList from './MessageList'

export default function ChatWindow() {
  const { currentChat } = useSelector((state: RootState) => state.chat)
  const { user } = useSelector((state: RootState) => state.auth)

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Select a chat to start messaging
          </h2>
          <p className="text-gray-500">
            Choose a conversation from the sidebar or start a new one
          </p>
        </div>
      </div>
    )
  }

  const otherParticipant = currentChat.participants.find(
    (p) => p._id !== user?.id
  )

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="bg-whatsapp-dark p-4 flex items-center space-x-3 border-b border-gray-200">
        <div className="relative">
          <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold">
            {otherParticipant?.name.charAt(0).toUpperCase()}
          </div>
          {otherParticipant?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-white font-semibold">{otherParticipant?.name}</div>
          <div className="text-sm text-gray-300">
            {otherParticipant?.isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <MessageInput />
    </div>
  )
}

