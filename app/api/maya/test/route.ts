import { testMayaAuth } from '@/lib/maya-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await testMayaAuth()
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
