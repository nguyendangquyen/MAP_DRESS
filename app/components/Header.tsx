import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBagIcon, UserIcon, HomeIcon, PhoneIcon, VideoCameraIcon, ChevronDownIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useRef, useEffect } from 'react'
import { getCurrentUser, clearUserSession } from '../lib/auth-utils'

export default function Header() {
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<{name: string; email: string; role: string} | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const navigation = [
    { name: 'Trang Chủ', href: '/', icon: HomeIcon },
    { name: 'Sản Phẩm', href: '/products', icon: ShoppingBagIcon },
    { name: 'Review & Feedback', href: '/reviews', icon: VideoCameraIcon },
    { name: 'Liên Hệ', href: '/contact', icon: PhoneIcon },
  ]

  // Check auth state on mount and listen for changes
  useEffect(() => {
    checkAuthState()
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuthState()
    }
    
    window.addEventListener('authStateChanged', handleAuthChange)
    return () => window.removeEventListener('authStateChanged', handleAuthChange)
  }, [])

  const checkAuthState = () => {
    const userData = getCurrentUser()
    if (userData) {
      setUser(userData)
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }
  }

  const handleLogout = () => {
    clearUserSession()
    setIsLoggedIn(false)
    setUser(null)
    setShowUserMenu(false)
    setIsSidebarOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isSidebarOpen) {
        // Only close if not clicking the bars button (managed by toggle)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSidebarOpen])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Menu Toggle - Mobile Only */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:text-brand-dark transition-colors"
            >
              <Bars3Icon className="w-8 h-8" />
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:relative md:left-0 md:translate-x-0 absolute left-1/2 -translate-x-1/2">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-brand-dark">
              MAP DRESS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[12px] font-bold uppercase tracking-widest transition-all ${
                    isActive ? 'text-brand-dark' : 'text-gray-500 hover:text-brand-dark'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center font-black shadow-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden lg:block font-black text-[10px] uppercase tracking-widest text-gray-700 ml-1">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 hidden lg:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[60] overflow-hidden">
                    <div className="px-5 py-4 bg-brand-light/10 text-brand-dark">
                      <p className="font-black text-sm uppercase tracking-widest">{user?.name || 'User'}</p>
                      <p className="text-[10px] font-bold opacity-60 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-brand-light/20 text-gray-700 hover:text-brand-dark transition-colors font-bold text-sm"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserIcon className="w-5 h-5" />
                        Tài khoản của tôi
                      </Link>
                      
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-5 py-3 hover:bg-brand-light/30 text-brand-dark transition-colors font-bold text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Cog6ToothIcon className="w-5 h-5" />
                          Quản lý (Admin)
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-500 transition-colors w-full font-bold text-sm"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-brand-light/30 hover:text-brand-dark transition-all"
              >
                <UserIcon className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 z-[100] ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Menu */}
      <div 
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-80 bg-white opacity-100 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)] z-[101] transform transition-transform duration-500 ease-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <span className="text-xl font-black tracking-tighter text-brand-dark">MENU</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-brand-dark text-white font-black scale-105' 
                    : 'text-gray-500 hover:bg-brand-light/10 hover:text-brand-dark font-bold'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[12px] uppercase tracking-widest">{item.name}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-8 space-y-4">
          {!isLoggedIn && (
            <>
              <Link
                href="/register"
                className="block w-full py-4 bg-brand-dark text-white text-center rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
                onClick={() => setIsSidebarOpen(false)}
              >
                Đăng Ký Thành Viên
              </Link>
              <Link
                href="/login"
                className="block w-full py-4 bg-white text-brand-dark border-2 border-brand-dark text-center rounded-2xl font-black uppercase tracking-widest transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                Đăng Nhập
              </Link>
            </>
          )}
          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
            MAP DRESS © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </header>
  )
}
