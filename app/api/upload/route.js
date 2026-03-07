import { NextResponse } from 'next/server'

const MAX_FILE_SIZE = 10 * 1024 * 1024  // 10MB
const MAX_TEXT_CHARS = 12000

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.` },
        { status: 413 }
      )
    }

    const fileName = file.name.toLowerCase()
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let text = ''

    if (fileName.endsWith('.txt')) {
      text = buffer.toString('utf-8')
    } else if (fileName.endsWith('.pdf')) {
      try {
        const pdfParse = (await import('pdf-parse')).default
        const data = await pdfParse(buffer)
        text = data.text
      } catch {
        return NextResponse.json({ error: 'Could not read PDF. Try copy-pasting the text instead.' }, { status: 400 })
      }
    } else if (fileName.endsWith('.docx')) {
      try {
        const mammoth = await import('mammoth')
        const result = await mammoth.extractRawText({ buffer })
        text = result.value
      } catch {
        return NextResponse.json({ error: 'Could not read DOCX. Try copy-pasting the text instead.' }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Use PDF, DOCX, or TXT.' }, { status: 400 })
    }

    text = text.trim()
    if (!text) {
      return NextResponse.json({ error: 'No text found in file. Try copy-pasting instead.' }, { status: 400 })
    }

    // Truncate if too long
    if (text.length > MAX_TEXT_CHARS) {
      text = text.slice(0, MAX_TEXT_CHARS)
    }

    return NextResponse.json({ text, charCount: text.length })
  } catch (error) {
    console.error('Upload error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to process file. Please try again.' }, { status: 500 })
  }
}
