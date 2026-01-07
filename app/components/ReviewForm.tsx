'use client'

import { useState } from 'react'
import { StarIcon, PhotoIcon, XMarkIcon, VideoCameraIcon } from '@heroicons/react/24/solid'

interface Props {
  productId: string
  productName: string
}

interface UploadedFile {
  file: File
  preview: string
  type: 'image' | 'video'
}

export default function ReviewForm({ productId, productName }: Props) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles: UploadedFile[] = []
    
    Array.from(files).forEach((file) => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn. Kích thước tối đa là 10MB.`)
        return
      }

      // Check file type
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      
      if (!isImage && !isVideo) {
        alert(`File ${file.name} không được hỗ trợ. Chỉ chấp nhận ảnh và video.`)
        return
      }

      // Check total files limit
      if (uploadedFiles.length + newFiles.length >= 5) {
        alert('Bạn chỉ có thể tải lên tối đa 5 file.')
        return
      }

      const preview = URL.createObjectURL(file)
      newFiles.push({
        file,
        preview,
        type: isImage ? 'image' : 'video'
      })
    })

    setUploadedFiles([...uploadedFiles, ...newFiles])
  }

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    URL.revokeObjectURL(newFiles[index].preview) // Clean up memory
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would submit to API with files
    console.log('Submitting review:', { rating, comment, files: uploadedFiles })
    setSubmitted(true)
    
    // Clean up file previews
    uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview))
    
    setTimeout(() => {
      setSubmitted(false)
      setComment('')
      setRating(5)
      setUploadedFiles([])
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 rounded-xl p-6 text-center">
        <p className="font-bold text-lg mb-2">✅ Cảm ơn bạn đã đánh giá!</p>
        <p>Đánh giá của bạn đã được gửi và đang chờ duyệt.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Viết Đánh Giá</h3>
      <p className="text-gray-600 mb-4">Sản phẩm: <span className="font-semibold">{productName}</span></p>

      {/* Rating Stars */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Đánh giá của bạn</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <StarIcon
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-gray-600">{rating}/5 sao</span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Nhận xét của bạn</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
        />
      </div>

      {/* Media Upload */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Thêm ảnh/video (Tùy chọn)</label>
        
        {/* Upload Button */}
        <div className="relative">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="media-upload"
            disabled={uploadedFiles.length >= 5}
          />
          <label
            htmlFor="media-upload"
            className={`block border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              uploadedFiles.length >= 5
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
            }`}
          >
            <PhotoIcon className="w-10 h-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 font-medium">
              {uploadedFiles.length >= 5 ? 'Đã đạt giới hạn 5 file' : 'Click để tải ảnh/video lên'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, MP4, MOV - Tối đa 10MB/file - Tối đa 5 files
            </p>
          </label>
        </div>

        {/* Preview Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {file.type === 'image' ? (
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                      <VideoCameraIcon className="w-12 h-12 text-purple-600" />
                    </div>
                  )}
                </div>
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                  title="Xóa file"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>

                {/* File info */}
                <div className="mt-1 text-xs text-gray-600 truncate" title={file.file.name}>
                  {file.file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
      >
        Gửi đánh giá
      </button>
    </form>
  )
}
