import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get teacher UIN from session
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    if (!sessionData.uin) {
      return NextResponse.json({ error: "Session missing UIN" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch all sessions (not just active ones)
    const { data: sessions, error } = await supabase
      .from('school_session')
      .select('id, session, active')
      .order('session', { ascending: false })

    if (error) {
      console.error('Error fetching sessions:', error)
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
    }

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error in sessions API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
