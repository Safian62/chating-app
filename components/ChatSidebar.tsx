'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { setCurrentChat, createOrGetChat } from '@/store/slices/chatSlice'
import { fetchMessages } from '@/store/slices/messageSlice'
import { joinRoom } from '@/utils/socket'

interface ChatSidebarProps {
  onLogout: () => void
}

export default function ChatSidebar({ onLogout }: ChatSidebarProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { chats, users, currentChat } = useSelector((state: RootState) => state.chat)
  const [searchTerm, setSearchTerm] = useState('')

  const handleChatClick = async (chat: any) => {
    dispatch(setCurrentChat(chat))
    dispatch(fetchMessages(chat._id))
    joinRoom(chat._id)
  }

  const handleUserClick = async (userId: string) => {
    const result = await dispatch(createOrGetChat(userId))
    if (createOrGetChat.fulfilled.match(result)) {
      const chat = result.payload
      dispatch(fetchMessages(chat._id))
      joinRoom(chat._id)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredChats = chats.filter((chat) => {
    const otherParticipant = chat.participants.find((p) => p._id !== user?.id)
    return (
      otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      otherParticipant?.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-whatsapp-dark p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-white font-semibold">{user?.name}</span>
        </div>
        <button
          onClick={onLogout}
          className="text-white hover:text-gray-300 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search or start new chat"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-100 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-whatsapp-green"
        />
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {searchTerm ? (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Users
            </div>
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => handleUserClick(u._id)}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 border-b border-gray-100"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  {u.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{u.name}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherParticipant = chat.participants.find(
              (p) => p._id !== user?.id
            )
            const isActive = currentChat?._id === chat._id

            return (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 border-b border-gray-100 ${
                  isActive ? 'bg-whatsapp-light' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-semibold">
                    {otherParticipant?.name.charAt(0).toUpperCase()}
                  </div>
                  {otherParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {otherParticipant?.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {chat.lastMessage
                      ? chat.lastMessage.type === 'image'
                        ? '📷 Image'
                        : chat.lastMessage.content
                      : 'No messages yet'}
                  </div>
                </div>
                {chat.lastMessage && (
                  <div className="text-xs text-gray-400">
                    {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

