"use client"

import { useState, useRef, useEffect, useCallback } from 'react'

interface Class {
  id: string
  name: string
}

interface SchoolSession {
  id: string
  session: string
  active: boolean
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface ExistingFile {
  id: string
  fileName: string
  filePath: string
  fileType: string
  extractedText: string
  uploadedAt: string
  url: string
}

export default function AITools() {
  const [files, setFiles] = useState<File[]>([])
  const [contentType, setContentType] = useState<'exam' | 'test' | 'assignment'>('exam')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [selectedSession, setSelectedSession] = useState('')
  const [numQuestions, setNumQuestions] = useState(10)
  const [duration, setDuration] = useState(60)
  const [dueDate, setDueDate] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [instructions, setInstructions] = useState('')
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [sessions, setSessions] = useState<SchoolSession[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI assistant for creating educational content. Upload your notes and I'll help you generate exams, tests, quizzes, or assignments. What would you like to create today?",
      timestamp: new Date()
    }
  ])
  const [showEfficiencyTips, setShowEfficiencyTips] = useState(false)
  const [showInputs, setShowInputs] = useState(false)
  const [useExistingFiles, setUseExistingFiles] = useState(false)
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([])
  const [selectedExistingFiles, setSelectedExistingFiles] = useState<string[]>([])
  const [loadingExistingFiles, setLoadingExistingFiles] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const addMessage = (type: 'user' | 'ai', content: string) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, newMessage])
  }

  const handleClassToggle = (classId: string) => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    )
  }

  const handleExistingFileToggle = (fileId: string) => {
    setSelectedExistingFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const fetchExistingFiles = useCallback(async () => {
    setLoadingExistingFiles(true)
    try {
      const res = await fetch('/api/teacher/ai/files', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setExistingFiles(data.files || [])
      } else {
        addMessage('ai', 'Failed to load existing files.')
      }
    } catch (error) {
      console.error('Error fetching existing files:', error)
      addMessage('ai', 'Error loading existing files.')
    } finally {
      setLoadingExistingFiles(false)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type))
    if (validFiles.length !== selectedFiles.length) {
      addMessage('ai', 'Some files were skipped. Only PDF, TXT, and DOCX files are allowed.')
    }
    setFiles(validFiles)
    if (validFiles.length > 0) {
      addMessage('user', `Uploaded ${validFiles.length} file(s): ${validFiles.map(f => f.name).join(', ')}`)
    }
  }

  const handleGenerate = async () => {
    const hasFiles = useExistingFiles ? selectedExistingFiles.length > 0 : files.length > 0

    if (!hasFiles || !title || !subject || selectedClasses.length === 0 || !selectedSession) {
      addMessage('ai', 'Please fill all required fields and select files.')
      return
    }

    addMessage('user', `Generate ${contentType} for ${selectedClasses.length} class(es) with ${numQuestions} questions`)

    setLoading(true)
    const formData = new FormData()

    if (useExistingFiles) {
      // Send existing file IDs instead of uploading new files
      selectedExistingFiles.forEach(fileId => formData.append('existingFileIds', fileId))
    } else {
      // Upload new files
      files.forEach(file => formData.append('files', file))
    }

    formData.append('contentType', contentType)
    formData.append('title', title)
    formData.append('subject', subject)
    formData.append('classIds', JSON.stringify(selectedClasses))
    formData.append('schoolSessionId', selectedSession)
    formData.append('numQuestions', numQuestions.toString())
    formData.append('difficulty', difficulty)
    if (contentType === 'exam') formData.append('duration', duration.toString())
    if (contentType === 'assignment' || contentType === 'test') formData.append('dueDate', dueDate)
    if (instructions) formData.append('instructions', instructions)

    try {
      addMessage('ai', '🔄 Processing your files and generating content...')
      const res = await fetch('/api/teacher/ai/generate', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (res.ok) {
        addMessage('ai', `✅ Content generated successfully! Created ${contentType} for ${selectedClasses.length} class(es).`)

        // Reset form
        setFiles([])
        setSelectedExistingFiles([])
        setTitle('')
        setSubject('')
        setSelectedClasses([])
        setSelectedSession('')
        setNumQuestions(10)
        setDuration(60)
        setDueDate('')
        setInstructions('')
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        const errorData = await res.json()
        addMessage('ai', `❌ Failed to generate content: ${errorData.error || 'Unknown error'}`)
      }
    } catch {
      addMessage('ai', '❌ An error occurred while generating content.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes
        const classesRes = await fetch('/api/teacher/classes', { credentials: 'include' })
        if (classesRes.ok) {
          const classesData = await classesRes.json()
          setClasses(classesData)
        }

        // Fetch sessions
        const sessionsRes = await fetch('/api/teacher/sessions', { credentials: 'include' })
        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json()
          setSessions(sessionsData)
        }

        // Fetch existing files
        await fetchExistingFiles()
      } catch (error) {
        console.error('Error fetching data:', error)
        addMessage('ai', 'Failed to load classes and sessions data.')
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [fetchExistingFiles])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${showInputs ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Content Generator</h1>
            <p className="text-gray-600">Create exams, tests, quizzes, and assignments with AI</p>

            {/* Efficiency Tips */}
            <div className="mt-3">
              <button
                onClick={() => setShowEfficiencyTips(!showEfficiencyTips)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                💡 Efficiency Tips
                <span className={`transform transition-transform ${showEfficiencyTips ? 'rotate-90' : ''}`}>▶</span>
              </button>

              {showEfficiencyTips && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">📄</span>
                      <div>
                        <strong>File Size:</strong> Keep PDFs under 5MB and text files under 2MB for best performance
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">📝</span>
                      <div>
                        <strong>Content Length:</strong> Limit to 10-20 pages per document to avoid rate limits
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">🎯</span>
                      <div>
                        <strong>Content Quality:</strong> Use well-formatted, text-based PDFs for better results
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">⚡</span>
                      <div>
                        <strong>Processing Time:</strong> Large files may take 10-30 seconds to process
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">🔄</span>
                      <div>
                        <strong>Rate Limits:</strong> If you hit limits, wait a few minutes and try with smaller content
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowInputs(!showInputs)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors md:hidden"
          >
            {showInputs ? 'Hide' : 'Show'} Settings
          </button>
          <button
            onClick={() => setShowInputs(!showInputs)}
            className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showInputs ? 'Hide' : 'Show'} Settings
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="border-t bg-white p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setContentType('exam')}
              className={`px-3 py-1 rounded-full text-sm ${
                contentType === 'exam' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              CBT Exam
            </button>
            <button
              onClick={() => setContentType('test')}
              className={`px-3 py-1 rounded-full text-sm ${
                contentType === 'test' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Test/Quiz
            </button>
            <button
              onClick={() => setContentType('assignment')}
              className={`px-3 py-1 rounded-full text-sm ${
                contentType === 'assignment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Assignment
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setUseExistingFiles(false)
                setSelectedExistingFiles([])
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                !useExistingFiles ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Upload New Files
            </button>
            <button
              onClick={() => {
                setUseExistingFiles(true)
                setFiles([])
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                useExistingFiles ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Use Existing Files
            </button>
          </div>

          {!useExistingFiles ? (
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.docx"
                onChange={handleFileChange}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Upload notes files..."
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {loadingExistingFiles ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading existing files...</p>
                </div>
              ) : existingFiles.length > 0 ? (
                <div className="max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Select files to reuse:</h4>
                  <div className="space-y-2">
                    {existingFiles.map((file) => (
                      <label key={file.id} className="flex items-start space-x-2 p-2 hover:bg-white rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedExistingFiles.includes(file.id)}
                          onChange={() => handleExistingFileToggle(file.id)}
                          className="mt-1 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {file.fileName}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              file.fileType === 'application/pdf' ? 'bg-red-100 text-red-800' :
                              file.fileType === 'text/plain' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {file.fileType === 'application/pdf' ? 'PDF' :
                               file.fileType === 'text/plain' ? 'TXT' : 'DOCX'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {file.extractedText.substring(0, 100)}...
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {selectedExistingFiles.length > 0 && (
                    <p className="text-xs text-blue-600 mt-2">
                      Selected: {selectedExistingFiles.length} file(s)
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No existing files found.</p>
                  <p className="text-sm">Upload some files first to reuse them later.</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={loading || selectedExistingFiles.length === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel - Desktop Sidebar */}
      {showInputs && (
        <div className="hidden md:block w-96 bg-white border-l shadow-lg overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Content Settings</h2>
              <button
                onClick={() => setShowInputs(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Session *</label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  disabled={loadingData}
                  aria-label="School session"
                >
                  <option value="">Select a session</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.session} {session.active ? '(Active)' : '(Inactive)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Classes Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Classes * (Select multiple)</label>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                {classes.map((cls) => (
                  <label key={cls.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls.id)}
                      onChange={() => handleClassToggle(cls.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{cls.name}</span>
                  </label>
                ))}
              </div>
              {selectedClasses.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Selected: {selectedClasses.length} class(es)
                </p>
              )}
            </div>

            {/* Content-specific fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                <input
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg"
                  min="1"
                  max="50"
                  aria-label="Number of questions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full p-2 border rounded-lg"
                  aria-label="Difficulty level"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {contentType === 'exam' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                    min="5"
                    max="300"
                    aria-label="Exam duration in minutes"
                  />
                </div>
              )}

              {(contentType === 'assignment' || contentType === 'test') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    aria-label="Due date"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Instructions (Optional)</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                  placeholder="Any specific instructions for the AI..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel - Mobile Overlay */}
      {showInputs && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="ml-auto w-full max-w-sm bg-white shadow-lg overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Content Settings</h2>
                <button
                  onClick={() => setShowInputs(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., Mathematics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Session *</label>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    disabled={loadingData}
                    aria-label="School session"
                  >
                    <option value="">Select a session</option>
                    {sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.session} {session.active ? '(Active)' : '(Inactive)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Classes Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Classes * (Select multiple)</label>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                  {classes.map((cls) => (
                    <label key={cls.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(cls.id)}
                        onChange={() => handleClassToggle(cls.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{cls.name}</span>
                    </label>
                  ))}
                </div>
                {selectedClasses.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    Selected: {selectedClasses.length} class(es)
                  </p>
                )}
              </div>

              {/* Content-specific fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                  <input
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                    min="1"
                    max="50"
                    aria-label="Number of questions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full p-2 border rounded-lg"
                    aria-label="Difficulty level"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {contentType === 'exam' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg"
                      min="5"
                      max="300"
                      aria-label="Exam duration in minutes"
                    />
                  </div>
                )}

                {(contentType === 'assignment' || contentType === 'test') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      aria-label="Due date"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Instructions (Optional)</label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    placeholder="Any specific instructions for the AI..."
                  />
                </div>
              </div>

              {/* Mobile Generate Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Content'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
