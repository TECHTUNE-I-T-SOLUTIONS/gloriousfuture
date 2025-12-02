import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ExecutionRequest {
  lessonId: string
  code: string
  language: string
}

// Simple code execution (in production, use a sandboxed environment like Piston API)
async function executeJavaScript(code: string): Promise<{ output: string; error?: string; time: number }> {
  const startTime = Date.now()
  
  try {
    // This is a simplified version. In production, use a proper sandboxed execution environment
    // For now, we'll use Function constructor which is safer than eval but still limited
    
    let output = ""
    const console_log = (...args: unknown[]) => {
      output += args.map(arg => JSON.stringify(arg)).join(" ") + "\n"
    }

    // Create a sandboxed function with captured console
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor as typeof Function
    const fn = new (AsyncFunction as typeof Function)("console", `
      return (async () => {
        ${code}
      })()
    `)

    await fn({
      log: console_log,
      error: console_log,
      warn: console_log,
    })

    return {
      output: output.trim(),
      time: Date.now() - startTime,
    }
  } catch (err: unknown) {
    return {
      output: "",
      error: String(err),
      time: Date.now() - startTime,
    }
  }
}

async function executePython(code: string): Promise<{ output: string; error?: string; time: number }> {
  const startTime = Date.now()
  
  try {
    // Note: Python execution requires a backend service like Piston API
    // This is a placeholder - in production use external API
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "python",
        version: "*",
        files: [{ name: "main.py", content: code }],
      }),
    })

    const data = (await response.json()) as { run?: { stdout?: string; stderr?: string } }
    
    return {
      output: (data.run?.stdout || "").trim(),
      error: (data.run?.stderr || undefined),
      time: Date.now() - startTime,
    }
  } catch (err: unknown) {
    return {
      output: "",
      error: `Execution error: ${String(err)}`,
      time: Date.now() - startTime,
    }
  }
}

export async function POST(request: Request) {
  try {
    const { lessonId, code, language } = (await request.json()) as ExecutionRequest

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      )
    }

    let result
    
    if (language === "javascript") {
      result = await executeJavaScript(code)
    } else if (language === "python") {
      result = await executePython(code)
    } else {
      return NextResponse.json(
        { error: `Language ${language} not supported` },
        { status: 400 }
      )
    }

    // Store submission if lessonId provided
    if (lessonId) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from("programming_practice_submissions")
          .insert({
            lesson_id: lessonId,
            pupil_id: user.id,
            code,
            output: result.output,
            error: result.error,
            execution_time_ms: result.time,
            is_correct: !result.error,
          })
      }
    }

    return NextResponse.json({
      success: true,
      output: result.output,
      error: result.error,
      executionTime: result.time,
    })
  } catch (err: unknown) {
    console.error("Error executing code:", err)
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    )
  }
}
