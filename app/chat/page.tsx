'use client'

import { useState } from 'react'
import { PaperAirplaneIcon, UserIcon } from '@heroicons/react/24/outline'

const mockMessages = [
  {
    id: '1',
    sender: 'admin',
    message: 'Xin chào! Tôi có thể giúp gì cho bạn?',
    time: '14:30',
  },
  {
    id: '2',
    sender: 'user',
    message: 'Chào admin, tôi muốn hỏi về sản phẩm Váy Dạ Hội',
    time: '14:32',
  },
  {
    id: '3',
    sender: 'admin',
    message: 'Váy Dạ Hội hiện đang có sẵn nhiều size. Bạn cần thuê vào ngày nào ạ?',
    time: '14:33',
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const msg = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }
    
    setMessages([...messages, msg])
    setNewMessage('')

    // Simulate admin reply after 2 seconds
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'admin',
        message: 'Cảm ơn bạn đã nhắn tin! Admin sẽ phản hồi sớm nhất có thể.',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Chat với Admin</h1>
          <p className="text-white/90 text-sm">Hỗ trợ trực tuyến 24/7</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Hỗ trợ khách hàng</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Đang hoạt động
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 flex items-center gap-2"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                Gửi
              </button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="p-4 bg-purple-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Câu hỏi thường gặp:</p>
            <div className="flex flex-wrap gap-2">
              {['Chính sách thuê', 'Giá cả', 'Thời gian giao hàng', 'Đổi trả'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setNewMessage(topic)}
                  className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm text-purple-600 hover:bg-purple-100 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
