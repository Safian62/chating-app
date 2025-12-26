'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { logout } from '@/store/slices/authSlice'
import { fetchChats, fetchUsers, setCurrentChat } from '@/store/slices/chatSlice'
import { fetchMessages } from '@/store/slices/messageSlice'
import ChatSidebar from '@/components/ChatSidebar'
import ChatWindow from '@/components/ChatWindow'
import { initSocket, disconnectSocket } from '@/utils/socket'

export default function ChatPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user, token } = useSelector((state: RootState) => state.auth)
  const { currentChat } = useSelector((state: RootState) => state.chat)

  useEffect(() => {
    if (!user || !token) {
      router.push('/login')
      return
    }

    dispatch(fetchChats())
    dispatch(fetchUsers())
    initSocket(token)

    return () => {
      disconnectSocket()
    }
  }, [user, token, router, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    disconnectSocket()
    router.push('/login')
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar onLogout={handleLogout} />
      <ChatWindow />
    </div>
  )
}

