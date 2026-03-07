import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = file.name.toLowerCase()

    let text = ''

    if (fileName.endsWith('.txt')) {
      text = buffer.toString('utf-8')
    } else if (fileName.endsWith('.pdf')) {
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(buffer)
      text = data.text
    } else if (fileName.endsWith('.docx')) {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Use PDF, DOCX, or TXT.' }, { status: 400 })
    }

    if (!text.trim()) {
      return NextResponse.json({ error: 'Could not extract text from file.' }, { status: 400 })
    }

    return NextResponse.json({ text: text.trim() })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to process file.' }, { status: 500 })
  }
}
