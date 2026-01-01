import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadedUrls = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Tạo tên file duy nhất
      const extension = file.name.split('.').pop()
      const fileName = `${randomUUID()}.${extension}`
      const path = join(process.cwd(), 'public/uploads', fileName)

      await writeFile(path, buffer)
      uploadedUrls.push(`/uploads/${fileName}`)
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

