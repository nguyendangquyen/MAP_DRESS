// Final correction
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json({ error: 'Thiếu file hoặc userId' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Chỉ cho phép upload ảnh (jpg, png, webp)' }, { status: 400 })
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Kích thước ảnh tối đa là 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      // Ignore if directory already exists
    }

    const fileExtension = file.name.split('.').pop()
    const fileName = `${userId}-${uuidv4()}.${fileExtension}`
    const filePath = join(uploadDir, fileName)
    const dbPath = `/uploads/avatars/${fileName}`

    await writeFile(filePath, buffer)

    // Update user in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        image: dbPath,
      },
    })

    return NextResponse.json({ imageUrl: dbPath })
  } catch (error) {
    console.error('Upload avatar error:', error)
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 })
  }
}
