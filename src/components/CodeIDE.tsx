"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"
import { Play, Copy, RotateCcw, Download, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CodeIDEProps {
  lessonId: string
  initialCode: string
  language: string
  expectedOutput?: string
  title?: string
}

export default function CodeIDE({ lessonId, initialCode, language, expectedOutput, title }: CodeIDEProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleExecuteCode = async () => {
    setLoading(true)
    setOutput("")
    setError("")
    setIsCorrect(false)

    try {
      const res = await fetch("/api/pupil/programming-lessons/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          code,
          language,
        }),
      })

      if (res.ok) {
        const data = (await res.json()) as { output: string; error?: string; executionTime: number }
        setOutput(data.output)
        if (data.error) {
          setError(data.error)
        }
        setExecutionTime(data.executionTime)

        // Check if output matches expected output
        if (expectedOutput && data.output.trim() === expectedOutput.trim()) {
          setIsCorrect(true)
        }
      } else {
        setError("Failed to execute code")
      }
    } catch (err) {
      setError(`Execution error: ${String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setCode(initialCode)
    setOutput("")
    setError("")
    setIsCorrect(false)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
  }

  const handleDownloadCode = () => {
    const element = document.createElement("a")
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`)
    element.setAttribute("download", `code-${language}.${language === "python" ? "py" : "js"}`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-4">
      {/* Editor Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title || "Code Editor"}</CardTitle>
              <CardDescription>Write and test your {language} code</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyCode} title="Copy code">
                <Copy size={16} />
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset} title="Reset to initial code">
                <RotateCcw size={16} />
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownloadCode} title="Download code">
                <Download size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="400px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Execute Button */}
      <div className="flex gap-2">
        <Button onClick={handleExecuteCode} disabled={loading} className="gap-2 bg-green-600 hover:bg-green-700">
          <Play size={18} />
          {loading ? "Executing..." : "Run Code"}
        </Button>
      </div>

      {/* Output Section */}
      {(output || error) && (
        <Card className={error ? "border-red-200 bg-red-50" : isCorrect ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-green-900">Correct Output!</span>
                  </>
                ) : error ? (
                  <>
                    <AlertCircle className="text-red-600" size={20} />
                    <span className="text-red-900">Error</span>
                  </>
                ) : (
                  <span>Output</span>
                )}
              </CardTitle>
              <span className="text-xs text-gray-600">Execution time: {executionTime}ms</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {error && <div className="text-sm text-red-800 font-mono whitespace-pre-wrap break-words">{error}</div>}
            {output && (
              <>
                <div className="text-xs text-gray-600 font-medium">Output:</div>
                <div className="text-sm bg-black text-green-400 p-3 rounded font-mono whitespace-pre-wrap break-words max-h-40 overflow-auto">
                  {output || "(no output)"}
                </div>
              </>
            )}
            {expectedOutput && (
              <>
                <div className="text-xs text-gray-600 font-medium">Expected Output:</div>
                <div className="text-sm bg-gray-100 p-3 rounded font-mono whitespace-pre-wrap break-words text-gray-800">
                  {expectedOutput}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
