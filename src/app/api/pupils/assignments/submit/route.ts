import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'
import { parse } from "cookie";

type UploadedFile = {
  name?: string
  type?: string
  arrayBuffer?: () => Promise<ArrayBuffer>
  stream?: () => unknown
}

// Accept multipart/form-data from the client. In the edge runtime formData file objects
// might be Blobs; in Node they are File-like with arrayBuffer(). Convert to Buffer
// before passing to supabase.storage.upload which expects a Buffer/Blob/Readable.
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const assignment_id = String(formData.get("assignment_id"))
    const submission_text = String(formData.get("submission_text") || "")
  const file = formData.get("file") as unknown | null

  // Use a server-side Supabase client with the service role key for writes/storage
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceRole || !supabaseUrl) return NextResponse.json({ error: "Supabase service role not configured" }, { status: 500 })
  const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } })

    // resolve pupil from session cookie (mandatory for tracking who submitted)
    const cookieHeader = req.headers.get("cookie") || ""
    const cookies = parse(cookieHeader)
    let pupilId: string | null = null
    let pupilMeta: Record<string, unknown> | null = null
    if (cookies.session) {
      try {
        const session = JSON.parse(cookies.session)
        // prefer explicit DB id if present
        if (session?.id) {
          pupilId = String(session.id)
        } else {
          // try to resolve by uin or email
          const maybeUin = session?.uin
          const maybeEmail = session?.email
          if (maybeUin) {
            const { data: p, error: perr } = await admin.from('pupils').select('id, full_name, uin, email').eq('uin', String(maybeUin)).maybeSingle()
            if (!perr && p?.id) { pupilId = String(p.id); pupilMeta = p }
          }
          if (!pupilId && maybeEmail) {
            const { data: p, error: perr } = await admin.from('pupils').select('id, full_name, uin, email').eq('email', String(maybeEmail)).maybeSingle()
            if (!perr && p?.id) { pupilId = String(p.id); pupilMeta = p }
          }
        }
      } catch {}
    }

    // If file present, convert to Buffer and upload to storage
    let publicUrl: string | null = null
    if (file) {
      // file can be a File/Blob or a Next.js File object; try arrayBuffer()
      let buffer: Buffer | null = null
  const f = file as UploadedFile
  const filename = f?.name || `upload-${Date.now()}`
  const contentType = f?.type || "application/octet-stream"
      try {
        // Prefer arrayBuffer() when available (works in edge & node runtimes)
        if (typeof f?.arrayBuffer === "function") {
          const ab = await f.arrayBuffer!()
          buffer = Buffer.from(ab)
        } else if (file instanceof Blob) {
          const ab = await file.arrayBuffer()
          buffer = Buffer.from(ab)
        } else if (f?.stream && typeof f.stream === "function") {
          // Node Readable stream style
          const maybeStream = f.stream()
          type ReaderLike = { getReader?: () => { read: () => Promise<{ done: boolean; value?: Uint8Array }> } }
          const reader = (maybeStream as ReaderLike)?.getReader?.()
          if (reader && typeof reader.read === "function") {
            const chunks: Uint8Array[] = []
            try {
              while (true) {
                const { done, value } = await reader.read()
                if (done) break
                if (value) chunks.push(value)
              }
              buffer = Buffer.concat(chunks.map((c) => Buffer.from(c)))
            } catch {
              const ab = await f.arrayBuffer!()
              buffer = Buffer.from(ab)
            }
          } else {
            const ab = await f.arrayBuffer!()
            buffer = Buffer.from(ab)
          }
        } else {
          const ab = await f.arrayBuffer!()
          buffer = Buffer.from(ab)
        }
      } catch (err) {
        console.error("Error reading uploaded file:", err)
        return NextResponse.json({ error: "Failed to read uploaded file" }, { status: 500 })
      }

      if (buffer) {
        const path = `assignments/${Date.now()}-${filename}`
        const uploadResult = await admin.storage.from("submissions").upload(path, buffer, { contentType, upsert: true })
        if (uploadResult.error) {
          console.error("Supabase storage upload error:", uploadResult.error)
          return NextResponse.json({ error: String(uploadResult.error.message || uploadResult.error) }, { status: 500 })
        }
        // Get public URL for the uploaded file
        const { data: pub } = admin.storage.from("submissions").getPublicUrl(path)
        publicUrl = (pub && (pub as unknown as { publicUrl?: string }).publicUrl) || null
      }
    }

    // Insert submission record including pupil_id when available
    const insertPayload: Record<string, unknown> = {
      assignment_id,
      text_submission: submission_text || null,
      file_url: publicUrl,
      submitted_at: new Date().toISOString(),
    }
    if (pupilId) insertPayload.pupil_id = pupilId

  const { data: inserted, error: insertErr } = await admin.from("submissions").insert([insertPayload]).select().limit(1).single()
  if (insertErr) {
      console.error("Error inserting submission:", insertErr)
      return NextResponse.json({ error: String(insertErr.message || insertErr) }, { status: 500 })
    }

  // attach pupil meta when available in response
    type SubmissionResponse = {
      success: boolean
      submission: unknown
      pupil?: Record<string, unknown> | null
    }

    const result: SubmissionResponse = { success: true, submission: inserted }
    if (pupilMeta) result.pupil = pupilMeta as Record<string, unknown>

    return NextResponse.json(result)
  } catch (err) {
    console.error("Submit assignment error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
