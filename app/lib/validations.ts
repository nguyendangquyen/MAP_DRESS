import { z } from 'zod'

// User Schemas
export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

// Product Schemas
export const productSchema = z.object({
  name: z.string().min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  sizes: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một size'),
  colors: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một màu'),
  dailyPrice: z.number().min(1, 'Giá thuê phải lớn hơn 0'),
  stock: z.number().int().min(1, 'Số lượng phải lớn hơn 0'),
})

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  slug: z.string().min(2, 'Slug phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
})

// Rental Schema
export const rentalSchema = z.object({
  productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  startDate: z.date({ required_error: 'Vui lòng chọn ngày bắt đầu' }),
  endDate: z.date({ required_error: 'Vui lòng chọn ngày kết thúc' }),
  notes: z.string().optional(),
}).refine(data => data.endDate >= data.startDate, {
  message: 'Ngày kết thúc phải sau ngày bắt đầu',
  path: ['endDate'],
})

// Payment Schema
export const paymentSchema = z.object({
  rentalId: z.string().min(1),
  amount: z.number().min(1, 'Số tiền phải lớn hơn 0'),
  paymentType: z.enum(['DEPOSIT', 'FULL', 'REMAINING']),
  paymentMethod: z.string().min(1, 'Vui lòng chọn phương thức thanh toán'),
})

// Message Schema
export const messageSchema = z.object({
  content: z.string().min(1, 'Vui lòng nhập nội dung tin nhắn'),
})
