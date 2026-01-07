import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

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

async function getVideos(): Promise<VideoReview[]> {
  try {
    if (!existsSync(VIDEOS_JSON_PATH)) {
      return []
    }
    const data = await readFile(VIDEOS_JSON_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveVideos(videos: VideoReview[]): Promise<void> {
  await writeFile(VIDEOS_JSON_PATH, JSON.stringify(videos, null, 2))
}

// DELETE - Remove video
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const videos = await getVideos()
    const videoIndex = videos.findIndex(v => v.id === id)

    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const video = videos[videoIndex]

    // Delete physical file
    const filename = video.videoUrl.split('/').pop()
    if (filename) {
      const filePath = path.join(UPLOAD_DIR, filename)
      if (existsSync(filePath)) {
        await unlink(filePath)
      }
    }

    // Remove from JSON
    videos.splice(videoIndex, 1)
    await saveVideos(videos)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}

// PATCH - Update video (toggle featured)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const videos = await getVideos()
    const videoIndex = videos.findIndex(v => v.id === id)

    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Check featured count if toggling to true
    if (body.featured === true) {
      const featuredCount = videos.filter(v => v.featured && v.id !== id).length
      if (featuredCount >= 4) {
        return NextResponse.json({ error: 'Maximum 4 featured videos allowed' }, { status: 400 })
      }
    }

    // Update video
    videos[videoIndex] = { ...videos[videoIndex], ...body }
    await saveVideos(videos)

    return NextResponse.json(videos[videoIndex])
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
  }
}
