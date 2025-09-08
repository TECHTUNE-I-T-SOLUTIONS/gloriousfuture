import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // PDF receipt generation is currently disabled
    return NextResponse.json({
      error: 'PDF receipt generation is currently not available',
      message: 'This feature is under development'
    }, { status: 503 })
  } catch (err) {
    console.error('receipt pdf error', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
