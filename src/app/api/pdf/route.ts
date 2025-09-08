import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // PDF generation is currently disabled
    return NextResponse.json({
      error: 'PDF generation is currently not available',
      message: 'This feature is under development'
    }, { status: 503 })
  } catch (err) {
    console.error('pdf generation error', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
