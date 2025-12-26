'use client'

import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { addMessage } from '@/store/slices/messageSlice'
import { updateChat } from '@/store/slices/chatSlice'
import EmojiPicker from 'emoji-picker-react'
import { sendMessage, sendTyping, stopTyping } from '@/utils/socket'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function MessageInput() {
  const dispatch = useDispatch<AppDispatch>()
  const { currentChat } = useSelector((state: RootState) => state.chat)
  const { user } = useSelector((state: RootState) => state.auth)
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleSend = async () => {
    if (!message.trim() || !currentChat || !user) return

    const messageData = {
      chatId: currentChat._id,
      senderId: user.id,
      content: message.trim(),
      type: 'text' as const,
    }

    sendMessage(messageData)
    stopTyping(currentChat._id, user.id, user.name || '')
    setMessage('')
    setShowEmojiPicker(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTyping = () => {
    if (!currentChat || !user) return

    sendTyping(currentChat._id, user.id, user.name || '', true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(currentChat._id, user.id, user.name || '')
    }, 3000)
  }

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentChat || !user) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/api/messages/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const messageData = {
        chatId: currentChat._id,
        senderId: user.id,
        content: '📷 Image',
        type: 'image' as const,
        imageUrl: response.data.imageUrl,
      }

      sendMessage(messageData)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!currentChat) return null

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-center space-x-2">
        {/* Emoji Picker */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-600 hover:text-whatsapp-green transition-colors"
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        {/* Image Upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 text-gray-600 hover:text-whatsapp-green transition-colors disabled:opacity-50"
        >
          {uploading ? '⏳' : '📷'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            handleTyping()
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="bg-whatsapp-green text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  )
}

