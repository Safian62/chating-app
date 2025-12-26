'use client'

import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { updateProfile } from '@/store/slices/authSlice'

interface SettingsProps {
  onClose: () => void
}

export default function Settings({ onClose }: SettingsProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const [name, setName] = useState(user?.name || '')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const handleSave = async () => {
    setError(null)
    setSuccess(null)

    try {
      if (selectedFile) {
        await dispatch(updateProfile({ avatar: selectedFile })).unwrap()
        setSuccess('Profile picture updated successfully!')
        setSelectedFile(null)
      }

      if (name.trim() && name.trim() !== user?.name) {
        await dispatch(updateProfile({ name: name.trim() })).unwrap()
        setSuccess((prev) => prev ? 'Profile updated successfully!' : 'Name updated successfully!')
      }

      if (!selectedFile && name.trim() === user?.name) {
        setError('No changes to save')
      } else {
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="bg-whatsapp-dark p-3 sm:p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-white text-lg sm:text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl sm:text-3xl font-bold leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                onClick={handleAvatarClick}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-whatsapp-green flex items-center justify-center"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl sm:text-4xl font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-whatsapp-green text-white rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-green-600 transition-colors">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 text-center">Click to change profile picture</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
              {success}
            </div>
          )}

          <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-whatsapp-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

