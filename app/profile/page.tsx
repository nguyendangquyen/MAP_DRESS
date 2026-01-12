'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon, 
  CreditCardIcon, 
  CheckIcon,
  CameraIcon,
  KeyIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { getCurrentUserId, clearUserSession, saveUserSession, AuthUser } from '../lib/auth-utils'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  image: string | null
  role: string
  createdAt: string
}

interface RentalWithProduct {
  id: string
  startDate: string
  endDate: string
  totalPrice: number
  status: string
  product: {
    name: string
    images: { url: string }[]
    category: { name: string }
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'password'>('info')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [rentals, setRentals] = useState<RentalWithProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form states
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  })
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const userId = getCurrentUserId()

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      router.push('/login')
      return
    }
    
    try {
      const response = await fetch(`/api/profile?userId=${userId}`)
      if (!response.ok) throw new Error('Không thể tải thông tin profile')
      const data = await response.json()
      setUser(data)
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
      })
    } catch (err: any) {
      setError(err.message)
    }
  }, [userId, router])

  const fetchRentals = useCallback(async () => {
    if (!userId) return
    
    try {
      const response = await fetch(`/api/profile/rentals?userId=${userId}`)
      if (!response.ok) throw new Error('Không thể tải lịch sử thuê')
      const data = await response.json()
      setRentals(data)
    } catch (err: any) {
      console.error(err)
    }
  }, [userId])

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await Promise.all([fetchProfile(), fetchRentals()])
      setIsLoading(false)
    }
    init()
  }, [fetchProfile, fetchRentals])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...formData }),
      })
      
      if (!response.ok) throw new Error('Cập nhật thông tin thất bại')
      
      const updatedUser = await response.json()
      setUser(updatedUser)
      
      // Sync session
      saveUserSession({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        image: updatedUser.image
      } as AuthUser)

      setIsEditing(false)
      setSuccess('Cập nhật thông tin thành công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    
    setIsSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          oldPassword: passwordData.oldPassword, 
          newPassword: passwordData.newPassword 
        }),
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Đổi mật khẩu thất bại')
      
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setSuccess('Đổi mật khẩu thành công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('userId', userId)
    
    setIsSaving(true)
    setError('')
    
    try {
      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        body: uploadFormData,
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Upload ảnh thất bại')
      
      if (user) {
        const updatedProfile = { ...user, image: data.imageUrl }
        setUser(updatedProfile)
        
        // Sync session
        saveUserSession({
          id: updatedProfile.id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          role: updatedProfile.role,
          image: updatedProfile.image
        } as AuthUser)
      }
      setSuccess('Cập nhật ảnh đại diện thành công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    clearUserSession()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffafa]">
        <ArrowPathIcon className="w-12 h-12 text-brand-dark animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffafa]">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-dark to-brand text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold mb-4">Tài Khoản Của Tôi</h1>
              <Link href="/" className="text-white/80 hover:text-white flex items-center gap-1">
                ← Về trang chủ
              </Link>
            </div>
            <div className="text-right text-white/80 text-sm">
              Thành viên từ: {user ? formatDate(user.createdAt) : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg flex items-center gap-3">
            <ExclamationCircleIcon className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg flex items-center gap-3 animate-bounce">
            <CheckIcon className="w-5 h-5" />
            <p>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="relative inline-block group">
                  <div className="w-40 h-40 bg-gradient-to-br from-brand-dark to-brand rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500">
                    {user?.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <label className="absolute bottom-4 right-0 bg-brand-dark text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-purple-700 transition-colors">
                    <CameraIcon className="w-5 h-5" />
                    <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                  </label>
                  {isSaving && (
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                      <ArrowPathIcon className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-gray-500 font-medium">{user?.email}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-brand-light/30 text-brand-dark text-xs font-bold rounded-full uppercase">
                  {user?.role === 'ADMIN' ? 'Hệ thống' : 'Khách hàng'}
                </div>
              </div>
              
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all ${
                    activeTab === 'info' ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  Thông tin cá nhân
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all ${
                    activeTab === 'history' ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ClockIcon className="w-5 h-5" />
                  Lịch sử thuê đồ
                </button>
                <button 
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all ${
                    activeTab === 'password' ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <KeyIcon className="w-5 h-5" />
                  Đổi mật khẩu
                </button>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'info' && (
              <div className="bg-white rounded-2xl shadow-md p-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Thông Tin Cá Nhân</h3>
                    <p className="text-gray-500">Quản lý thông tin liên hệ của bạn</p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-brand-dark text-white rounded-xl font-bold hover:bg-purple-700 hover:shadow-lg transition-all"
                    >
                      Chỉnh sửa
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Hủy
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Họ và tên</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          placeholder="Nguyễn Văn A"
                          className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Địa chỉ Email</label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 bg-gray-50 text-gray-400 font-medium cursor-not-allowed"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 ml-1">* Email không thể thay đổi</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Số điện thoại</label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          placeholder="Chưa cập nhật"
                          className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Địa chỉ nhận hàng</label>
                      <div className="relative">
                        <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          placeholder="Chưa cập nhật địa chỉ"
                          className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isSaving ? (
                          <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckIcon className="w-5 h-5" />
                        )}
                        Lưu thông tin
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-2xl shadow-md p-8 animate-fadeIn">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800">Lịch Sử Thuê Đồ</h3>
                  <p className="text-gray-500">Xem lại các món đồ bạn đã và đang thuê</p>
                </div>

                <div className="space-y-6">
                  {rentals.map((rental) => (
                    <div key={rental.id} className="border border-gray-100 rounded-2xl p-5 hover:border-purple-200 hover:shadow-md transition-all group overflow-hidden bg-gray-50/50">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-32 h-32 bg-gray-200 rounded-xl overflow-hidden shadow-sm">
                          {rental.product.images?.[0] ? (
                            <img 
                              src={rental.product.images[0].url} 
                              alt={rental.product.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-brand-dark uppercase tracking-wider bg-purple-100 px-2 py-0.5 rounded-md mb-2 inline-block">
                                {rental.product.category.name}
                              </span>
                              <h4 className="font-bold text-xl text-gray-800 leading-tight">{rental.product.name}</h4>
                              <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-2">
                                <span className="flex items-center gap-1">
                                  <ClockIcon className="w-3.5 h-3.5" />
                                  {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <CreditCardIcon className="w-3.5 h-3.5" />
                                  ID: #{rental.id.slice(-6).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight shadow-sm ${
                              rental.status === 'COMPLETED' || rental.status === 'RETURNED'
                                ? 'bg-green-500 text-white' 
                                : rental.status === 'ACTIVE'
                                ? 'bg-blue-500 text-white'
                                : rental.status === 'PENDING'
                                ? 'bg-orange-400 text-white'
                                : 'bg-gray-400 text-white'
                            }`}>
                              {rental.status === 'COMPLETED' ? 'Đã hoàn thành' : 
                               rental.status === 'RETURNED' ? 'Đã trả đồ' :
                               rental.status === 'ACTIVE' ? 'Đang thuê' :
                               rental.status === 'PENDING' ? 'Chờ xác nhận' : rental.status}
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                            <div className="text-sm font-bold">
                              <span className="text-gray-400 mr-2">Tổng thanh toán:</span>
                              <span className="text-xl text-brand-dark">
                                {formatCurrency(rental.totalPrice)}
                              </span>
                            </div>
                            <button className="text-brand-dark hover:text-pink-600 font-bold text-sm flex items-center gap-1 transition-colors">
                              Chi tiết đơn thuê <span className="text-lg">›</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {rentals.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCardIcon className="w-10 h-10 text-gray-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có đơn thuê nào</h3>
                      <p className="text-gray-500 max-w-xs mx-auto mb-8">Hãy bắt đầu hành trình phong cách của bạn bằng cách khám phá bộ sưu tập của chúng tôi.</p>
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-brand-dark text-white rounded-xl font-bold hover:shadow-xl transition-all"
                      >
                        Khám phá ngay
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-white rounded-2xl shadow-md p-8 animate-fadeIn">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800">Đổi Mật Khẩu</h3>
                  <p className="text-gray-500">Đảm bảo an toàn cho tài khoản của bạn</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        required
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        {showOldPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Mật khẩu mới</label>
                    <div className="relative">
                      <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none transition-all font-medium"
                        placeholder="Tối thiểu 6 ký tự"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 focus:ring-2 focus:ring-brand-dark focus:border-transparent outline-none transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-900 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSaving ? (
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckIcon className="w-5 h-5" />
                      )}
                      Cập nhật mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

