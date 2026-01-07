import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const VIDEOS_JSON_PATH = path.join(process.cwd(), 'data', 'videos.json')
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'videos')

interface VideoReview {
  id: string
  productName: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  featured: boolean
  type: 'review' | 'feedback'
  createdAt: string
}

// Helper to read videos from JSON file
async function getVideos(): Promise<VideoReview[]> {
  try {
    if (!existsSync(VIDEOS_JSON_PATH)) {
      return []
    }
    const data = await readFile(VIDEOS_JSON_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading videos:', error)
    return []
  }
}

// Helper to save videos to JSON file
async function saveVideos(videos: VideoReview[]): Promise<void> {
  await writeFile(VIDEOS_JSON_PATH, JSON.stringify(videos, null, 2))
}

// GET - Fetch all videos
export async function GET() {
  try {
    const videos = await getVideos()
    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

// POST - Upload new video
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File
    const productName = formData.get('productName') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as 'review' | 'feedback'

    if (!file || !productName || !description || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only MP4, MOV, AVI allowed' }, { status: 400 })
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 50MB' }, { status: 400 })
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    const filePath = path.join(UPLOAD_DIR, uniqueFilename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create video metadata
    const newVideo: VideoReview = {
      id: uuidv4(),
      productName,
      description,
      videoUrl: `/uploads/videos/${uniqueFilename}`,
      featured: false,
      type,
      createdAt: new Date().toISOString().split('T')[0]
    }

    // Save to JSON
    const videos = await getVideos()
    videos.unshift(newVideo) // Add to beginning
    await saveVideos(videos)

    return NextResponse.json(newVideo, { status: 201 })
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 })
  }
}
