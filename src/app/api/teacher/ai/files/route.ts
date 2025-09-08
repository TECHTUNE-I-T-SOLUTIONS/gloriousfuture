import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get teacher ID from session
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

    if (!sessionData.id) {
      return NextResponse.json({ error: "Session missing teacher ID" }, { status: 400 });
    }

    const teacherId = sessionData.id;

    // Validate required environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Create service role client for database operations
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch uploaded files for this teacher
    const { data: uploadedFiles, error } = await supabaseService
      .from('ai_file_uploads')
      .select('id, file_name, file_path, file_type, extracted_text, uploaded_at')
      .eq('teacher_id', teacherId)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error fetching uploaded files:', error)
      return NextResponse.json({
        error: 'Failed to fetch uploaded files',
        details: error.message
      }, { status: 500 })
    }

    // Transform the data to include file URLs
    const filesWithUrls = uploadedFiles?.map(file => ({
      id: file.id,
      fileName: file.file_name,
      filePath: file.file_path,
      fileType: file.file_type,
      extractedText: file.extracted_text,
      uploadedAt: file.uploaded_at,
      // Generate public URL for the file
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ai_uploads/${file.file_path}`
    })) || []

    return NextResponse.json({
      success: true,
      files: filesWithUrls
    })

  } catch (error) {
    console.error('Error fetching teacher files:', error)
    return NextResponse.json({
      error: 'Failed to fetch files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
