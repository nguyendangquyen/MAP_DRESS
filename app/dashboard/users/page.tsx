'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline'
import AdminSidebar from '../../components/AdminSidebar'
import Image from 'next/image'
import NotificationModal from '../../components/NotificationModal'
import ConfirmModal from '../../components/ConfirmModal'

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  image: string | null
  role: string
  createdAt: string
  _count: {
    rentals: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'USER' })

  // Notification state
  const [notification, setNotification] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'info'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  })

  // Confirmation state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    id: string | null
    name: string
  }>({
    isOpen: false,
    id: null,
    name: '',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API calls for create/update
    setNotification({
      isOpen: true,
      type: 'info',
      title: 'Thông báo',
      message: 'Chức năng Thêm/Sửa đang được phát triển',
    })
    setIsAdding(false)
  }

  const handleEdit = (user: User) => {
    setNotification({
      isOpen: true,
      type: 'info',
      title: 'Thông báo',
      message: 'Chức năng chỉnh sửa đang được phát triển',
    })
  }

  const handleDeleteClick = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      id,
      name,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!confirmModal.id) return

    // Close confirm modal
    setConfirmModal(prev => ({ ...prev, isOpen: false }))

    try {
      const response = await fetch(`/api/admin/users/${confirmModal.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Thành công',
          message: 'Đã xóa người dùng thành công',
        })
        fetchUsers() // Refresh list
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Xóa thất bại')
      }
    } catch (error: any) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Lỗi',
        message: error.message || 'Không thể xóa người dùng',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <NotificationModal 
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa người dùng "${confirmModal.name}"? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.`}
        isDanger={true}
        confirmText="Xóa bỏ"
      />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản Lý Người Dùng</h1>
            <p className="text-gray-600">Tổng số: {users.length} người dùng</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true)
              setEditingId(null)
              setFormData({ name: '', email: '', phone: '', role: 'USER' })
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            Thêm Người Dùng
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Chỉnh Sửa' : 'Thêm'} Người Dùng</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Họ tên *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Vai trò *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                  {editingId ? 'Cập nhật' : 'Thêm'}
                </button>
                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null) }} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-600">
              <p>Đang tải danh sách người dùng...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Người dùng</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SĐT</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Vai trò</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Đơn thuê</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Ngày tạo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                                <Image 
                                    src={user.image} 
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 break-all">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">{user.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'ADMIN' ? 'Admin' : 'Người dùng'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user._count.rentals}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteClick(user.id, user.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-600">
              <p>Chưa có người dùng nào trong hệ thống</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
