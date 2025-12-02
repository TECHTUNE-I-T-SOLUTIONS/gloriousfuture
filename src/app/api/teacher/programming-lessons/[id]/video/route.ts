import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB in bytes

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const videoFile = formData.get("video") as File

    if (!videoFile) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      )
    }

    // Validate file size
    if (videoFile.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: `Video size must be less than 50MB (current: ${(videoFile.size / 1024 / 1024).toFixed(2)}MB)` },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]
    if (!validTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { error: "Invalid video format. Supported: MP4, WebM, OGG, MOV" },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `lesson-${id}-${timestamp}.${videoFile.type.split("/")[1]}`
    const filepath = `videos/${filename}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("programming-videos")
      .upload(filepath, videoFile, {
        contentType: videoFile.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("programming-videos")
      .getPublicUrl(filepath)

    // Update lesson with video metadata
    const { data: updatedLesson, error: updateError } = await supabase
      .from("programming_lessons")
      .update({
        video_url: urlData.publicUrl,
        video_size_mb: videoFile.size / 1024 / 1024,
      })
      .eq("id", id)
      .select()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      videoUrl: urlData.publicUrl,
      videoSizeMb: (videoFile.size / 1024 / 1024).toFixed(2),
      lesson: updatedLesson[0],
    })
  } catch (err: unknown) {
    console.error("Error uploading video:", err)
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    )
  }
}

// Delete video endpoint
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { videoPath } = await request.json()

    if (!videoPath) {
      return NextResponse.json(
        { error: "Video path is required" },
        { status: 400 }
      )
    }

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from("programming-videos")
      .remove([videoPath])

    if (deleteError) throw deleteError

    // Update lesson to remove video reference
    const { data: updatedLesson, error: updateError } = await supabase
      .from("programming_lessons")
      .update({
        video_url: null,
        video_size_mb: null,
        video_duration_seconds: null,
      })
      .eq("id", id)
      .select()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      lesson: updatedLesson[0],
    })
  } catch (err: unknown) {
    console.error("Error deleting video:", err)
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    )
  }
}
