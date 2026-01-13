'use client'

import { useState, useEffect } from 'react'

interface Props {
  productId?: string
  onDateSelect?: (dates: string[]) => void
}

export default function AvailabilityCalendar({ productId = '1', onDateSelect }: Props) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch blocked dates from API
  useEffect(() => {
    if (productId) {
      fetchBlockedDates()
    }
  }, [productId])

  const fetchBlockedDates = async () => {
    try {
      const response = await fetch(`/api/availability/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setBlockedDates(data.blockedDates || [])
      }
    } catch (error) {
      console.error('Error fetching blocked dates:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
  
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  // Generate calendar for 2 months
  const generateMonthDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const month1Days = generateMonthDays(currentYear, currentMonth)
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
  const month2Days = generateMonthDays(nextYear, nextMonth)
  
  const currentDay = today.getDate()
  const currentMonthNum = today.getMonth()
  const currentYearNum = today.getFullYear()
  
  const isPastDate = (day: number, month: number, year: number) => {
    return year < currentYearNum || 
           (year === currentYearNum && month < currentMonthNum) ||
           (year === currentYearNum && month === currentMonthNum && day < currentDay)
  }

  const isDateBlocked = (day: number, month: number, year: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return blockedDates.includes(dateStr)
  }

  const handleDateClick = (day: number, month: number, year: number) => {
    if (isDateBlocked(day, month, year) || isPastDate(day, month, year)) return
    
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const newSelectedDates = selectedDates.includes(dateKey)
      ? selectedDates.filter(d => d !== dateKey)
      : [...selectedDates, dateKey].sort()
    
    setSelectedDates(newSelectedDates)
    onDateSelect?.(newSelectedDates)
  }

  const renderMonth = (days: (number | null)[], month: number, year: number) => (
    <div>
      <h4 className="text-lg font-bold mb-3 text-center">{monthNames[month]} {year}</h4>
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2 text-xs">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="p-2"></div>
          }
          
          const isBooked = isDateBlocked(day, month, year)
          const isPast = isPastDate(day, month, year)
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isSelected = selectedDates.includes(dateKey)
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day, month, year)}
              disabled={isBooked || isPast || loading}
              className={`text-center p-2 rounded-lg transition-all text-xs font-medium ${
                isSelected
                  ? 'bg-blue-500 text-white scale-105 shadow-md'
                  : isToday && !isPast
                  ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-500' 
                  : isBooked 
                    ? 'bg-red-100 text-red-700 cursor-not-allowed' 
                    : isPast
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : loading
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer hover:scale-105'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <p className="text-center text-gray-600">Đang tải lịch...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Lịch Trống - 2 Tháng Tới</h3>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
          <span>Còn trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Đã chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-500 rounded"></div>
          <span>Đã có người thuê</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>Quá khứ</span>
        </div>
      </div>

      {/* 2 Month Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderMonth(month1Days, currentMonth, currentYear)}
        {renderMonth(month2Days, nextMonth, nextYear)}
      </div>
      
      {selectedDates.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-900">
            Đã chọn {selectedDates.length} ngày: {selectedDates.join(', ')}
          </p>
        </div>
      )}
      
      <p className="text-sm text-gray-500 mt-4 text-center">
        Click vào ngày trống để chọn ngày thuê
      </p>
    </div>
  )
}
