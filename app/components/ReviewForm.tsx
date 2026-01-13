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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-black uppercase tracking-tighter text-brand-dark mb-1">Viết Đánh Giá</h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{productName}</p>
      </div>

      {/* Rating Stars */}
      <div className="flex flex-col items-center">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transform hover:scale-110 transition-transform"
            >
              <StarIcon
                className={`w-10 h-10 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 drop-shadow-sm'
                    : 'text-gray-200'
                }`}
              />
            </button>
          ))}
        </div>
        <span className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{rating}/5 tuyệt vời</span>
      </div>

      {/* Comment */}
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand focus:border-transparent transition-all placeholder:text-gray-300 font-medium"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
        />
      </div>

      {/* Media Upload Compact */}
      <div>
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {/* Upload Button */}
          <label className="flex-shrink-0 w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand hover:bg-white transition-all group">
            <PhotoIcon className="w-6 h-6 text-gray-400 group-hover:text-brand mb-1" />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-brand">Upload</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={uploadedFiles.length >= 5}
            />
          </label>

          {/* Preview Uploaded Files */}
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex-shrink-0 relative w-20 h-20 group">
              <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 bg-white">
                {file.type === 'image' ? (
                  <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-50">
                    <VideoCameraIcon className="w-8 h-8 text-purple-400" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:scale-110 transition-transform"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 font-medium mt-1 pl-1">* Tối đa 5 ảnh/video (Max 10MB)</p>
      </div>

      <button
        type="submit"
        className="w-full bg-brand-dark text-white h-12 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        Gửi đánh giá
      </button>
    </form>
  )
}
