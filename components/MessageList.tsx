'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export default function MessageList() {
  const { currentChat } = useSelector((state: RootState) => state.chat)
  const { messages } = useSelector((state: RootState) => state.message)
  const { user } = useSelector((state: RootState) => state.auth)
  const { typingUsers } = useSelector((state: RootState) => state.message)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatMessages = currentChat ? messages[currentChat._id] || [] : []
  const typing = currentChat ? typingUsers[currentChat._id] || [] : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, typing])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-hide">
      <div className="space-y-4">
        {chatMessages.map((message) => {
          const isOwn = message.sender._id === user?.id

          return (
            <div
              key={message._id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn
                    ? 'bg-whatsapp-green text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                {!isOwn && (
                  <div className="text-xs font-semibold mb-1 text-gray-600">
                    {message.sender.name}
                  </div>
                )}
                {message.type === 'image' && message.imageUrl ? (
                  <div className="mb-2">
                    <img
                      src={message.imageUrl}
                      alt="Shared image"
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                ) : null}
                <div className="break-words">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    isOwn ? 'text-white opacity-75' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.createdAt)}
                </div>
              </div>
            </div>
          )
        })}
        {typing.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="flex space-x-1">
                <span className="text-gray-600 text-sm">
                  {typing.join(', ')} {typing.length === 1 ? 'is' : 'are'} typing
                </span>
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}

