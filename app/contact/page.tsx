import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-dark to-brand text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter uppercase">Liên Hệ</h1>
          <p className="text-white/90 text-xs md:text-sm font-black uppercase tracking-[0.3em] opacity-80">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Gửi Tin Nhắn</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Họ tên</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                  placeholder="0901234567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Nội dung</label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                  placeholder="Nhập nội dung cần hỗ trợ..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-dark text-white px-6 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl"
              >
                Gửi tin nhắn
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-light/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-6 h-6 text-brand-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Hotline</h3>
                  <p className="text-gray-600">1900 xxxx (8:00 - 22:00)</p>
                  <p className="text-gray-600">0901 234 567</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-light/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-6 h-6 text-brand-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-gray-600">support@thuevay.vn</p>
                  <p className="text-gray-600">contact@thuevay.vn</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-light/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-6 h-6 text-brand-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Địa chỉ</h3>
                  <p className="text-gray-600">123 Đường ABC, Quận 1</p>
                  <p className="text-gray-600">TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-light/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-6 h-6 text-brand-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Giờ làm việc</h3>
                  <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 20:00</p>
                  <p className="text-gray-600">Thứ 7 - CN: 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
