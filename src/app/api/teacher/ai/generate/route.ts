import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
// import pdfParse from 'pdf-parse' // Import dynamically to avoid build issues
import mammoth from 'mammoth'

// Disable pdf-parse debug mode globally
process.env.AUTO_KENT_DEBUG = 'false'
process.env.DEBUG = 'false'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
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

    if (!sessionData.id) {
      return NextResponse.json({ error: "Session missing teacher ID" }, { status: 400 });
    }

    const teacherId = sessionData.id;

    // Validate required environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set')
      return NextResponse.json({ error: 'AI service configuration error' }, { status: 500 })
    }

    // Create service role client for all database operations
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const existingFileIds = formData.getAll('existingFileIds') as string[]
    const contentType = formData.get('contentType') as string
    const title = formData.get('title') as string
    const subject = formData.get('subject') as string
    const classIds = JSON.parse(formData.get('classIds') as string) as string[]
    const schoolSessionId = formData.get('schoolSessionId') as string
    const numQuestions = parseInt(formData.get('numQuestions') as string) || 10
    const duration = formData.get('duration') ? parseInt(formData.get('duration') as string) : null
    const dueDate = formData.get('dueDate') as string
    const instructions = formData.get('instructions') as string

    if ((!files.length && !existingFileIds.length) || !title || !subject || !classIds.length || !schoolSessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Extract text from files (new uploads or existing files)
    let combinedText = ''
    let uploadedFiles: { fileName: string; originalName: string; url: string }[] = []

    if (existingFileIds.length > 0) {
      // Fetch existing files
      const { data: existingFilesData, error: fetchError } = await supabaseService
        .from('ai_file_uploads')
        .select('id, file_name, file_path, extracted_text')
        .in('id', existingFileIds)
        .eq('teacher_id', teacherId)

      if (fetchError) {
        console.error('Error fetching existing files:', fetchError)
        return NextResponse.json({ error: 'Failed to fetch existing files' }, { status: 500 })
      }

      if (!existingFilesData || existingFilesData.length === 0) {
        return NextResponse.json({ error: 'No existing files found' }, { status: 404 })
      }

      // Combine text from existing files
      existingFilesData.forEach((file: { id: string; file_name: string; file_path: string; extracted_text: string }) => {
        combinedText += file.extracted_text + '\n\n'
      })

      // Create uploadedFiles array for consistency
      uploadedFiles = existingFilesData.map((file: { id: string; file_name: string; file_path: string; extracted_text: string }) => ({
        fileName: file.file_name,
        originalName: file.file_name,
        url: file.file_path
      }))

    } else {
    combinedText = ''
    for (const file of files) {
      let text = ''
      try {
        if (file.type === 'application/pdf') {
          console.log(`Processing PDF file: ${file.name}, size: ${file.size} bytes`)

          try {
            // Use basic text extraction to avoid pdf-parse hardcoded path issues
            const buffer = Buffer.from(await file.arrayBuffer())
            const textContent = buffer.toString('utf-8')

            // Try to extract readable text from PDF content
            // Remove PDF-specific markers and extract text
            const cleanText = textContent
              .replace(/[^\w\s.,!?\-\n]/g, ' ') // Remove special characters
              .replace(/\s+/g, ' ') // Normalize whitespace
              .trim()

            if (cleanText && cleanText.length > 100) {
              text = `PDF Content (basic extraction):\n${cleanText.substring(0, 5000)}` // Limit to 5000 chars
              console.log(`Basic PDF text extraction successful, length: ${text.length} characters`)
            } else {
              text = `Warning: Could not extract readable text from PDF "${file.name}". The file may be image-based or corrupted. Please try uploading a text-based PDF file.`
            }

          } catch (pdfError) {
            console.error(`PDF processing failed for ${file.name}:`, pdfError)
            text = `Error: Could not process PDF file "${file.name}". ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}. Please try a different file.`
          }
        } else if (file.type === 'text/plain') {
          text = await file.text()
          console.log(`Text file processed: ${file.name}, length: ${text.length} characters`)
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const buffer = Buffer.from(await file.arrayBuffer())
          const result = await mammoth.extractRawText({ buffer })
          text = result.value
          console.log(`DOCX file processed: ${file.name}, length: ${text.length} characters`)
        } else {
          console.log(`Unsupported file type: ${file.type} for file: ${file.name}`)
          text = `Unsupported file type: ${file.type}`
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        text = `Error processing file ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
      combinedText += text + '\n\n'
    }

    // Upload files to Supabase storage using service role
    const uploadPromises = files.map(async (file) => {
      try {
        const fileName = `${Date.now()}-${file.name}`
        console.log(`Uploading file: ${file.name} (${file.size} bytes) as ${fileName}`)

        const { data, error } = await supabaseService.storage
          .from('ai_uploads')
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false
          })

        if (error) {
          console.error(`Storage upload error for ${file.name}:`, error)

          // If bucket doesn't exist, try to create it
          if (error.message?.includes('Bucket not found') || error.message?.includes('relation "storage.objects" does not exist')) {
            console.log('Attempting to create ai_uploads bucket...')

            try {
              const { error: createError } = await supabaseService.storage.createBucket('ai_uploads', {
                public: false,
                allowedMimeTypes: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                fileSizeLimit: 10485760 // 10MB
              })

              if (createError) {
                console.error('Failed to create bucket:', createError)
                throw new Error(`Storage setup failed: ${createError.message}`)
              }

              console.log('Bucket created successfully, retrying upload...')

              // Retry upload after creating bucket
              const { data: retryData, error: retryError } = await supabaseService.storage
                .from('ai_uploads')
                .upload(fileName, file, {
                  contentType: file.type,
                  upsert: false
                })

              if (retryError) {
                console.error(`Retry upload failed for ${file.name}:`, retryError)
                throw retryError
              }

              console.log(`Successfully uploaded ${file.name} to ${retryData.path}`)
              return { fileName, originalName: file.name, url: retryData.path }
            } catch (bucketError) {
              console.error('Bucket creation/retry failed:', bucketError)
              throw bucketError
            }
          }

          throw error
        }

        console.log(`Successfully uploaded ${file.name} to ${data.path}`)
        return { fileName, originalName: file.name, url: data.path }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
        throw error
      }
    })

    uploadedFiles = await Promise.all(uploadPromises)

    // Save to ai_file_uploads only for new uploads
    const { error: uploadError } = await supabaseService
      .from('ai_file_uploads')
      .insert({
        teacher_id: teacherId,
        file_name: uploadedFiles.map(f => f.originalName).join(', '), // Single file name or comma-separated
        file_path: uploadedFiles.map(f => f.url).join(', '), // Single file path or comma-separated
        file_type: contentType,
        extracted_text: combinedText
      })

    if (uploadError) {
      console.error('Error saving to ai_file_uploads:', uploadError)
      return NextResponse.json({
        error: 'Failed to save file upload record',
        details: uploadError.message
      }, { status: 500 })
    }

    } // End of else block for new file uploads

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    let prompt = ''
    if (contentType === 'exam') {
      prompt = `Generate a CBT exam based on the following notes. Create ${numQuestions} multiple-choice questions with 4 options each. Include the correct answer and explanation for each question.

Return ONLY valid JSON without any markdown formatting or code blocks. The response should be pure JSON that can be parsed directly.

IMPORTANT: Return the questions as a direct array, NOT wrapped in an object. Each question should have options as an object with 'a', 'b', 'c', 'd' keys, and correctAnswer should be the actual answer text, not an index.

Format: [{"question": "string", "options": {"a": "string", "b": "string", "c": "string", "d": "string"}, "correctAnswer": "string", "explanation": "string"}]

Notes:\n${combinedText}`
    } else if (contentType === 'assignment') {
      prompt = `Generate an assignment based on the following notes. Create detailed questions and tasks that students can complete. Include instructions and grading criteria.

Return ONLY valid JSON without any markdown formatting or code blocks. The response should be pure JSON that can be parsed directly.

Format: {"title": "string", "description": "string", "tasks": ["string"], "grading_criteria": ["string"]}

Notes:\n${combinedText}`
    } else if (contentType === 'test') {
      prompt = `Generate a test/quiz based on the following notes. Create ${numQuestions} multiple-choice questions with 4 options each. Include the correct answer.

Return ONLY valid JSON without any markdown formatting or code blocks. The response should be pure JSON that can be parsed directly.

Format: {"questions": [{"question": "string", "options": ["string"], "correctAnswer": number}]}

Notes:\n${combinedText}`
    }

    if (instructions) {
      prompt += `\n\nAdditional Instructions: ${instructions}`
    }

    let generatedContent = ''
    let parsedContent: Record<string, unknown> | unknown[] | null = null

    try {
      const result = await model.generateContent(prompt)
      generatedContent = result.response.text()

      // Validate generated content
      if (!generatedContent || generatedContent.trim().length === 0) {
        console.error('AI generated empty content')
        return NextResponse.json({ error: 'AI service returned empty content' }, { status: 500 })
      }

      console.log(`Generated content length: ${generatedContent.length} characters`)
      console.log(`Content preview: ${generatedContent.substring(0, 200)}...`)

      // Clean the generated content to extract JSON if wrapped in markdown
      let cleanContent = generatedContent.trim()

      // Check if content is wrapped in markdown code blocks
      if (cleanContent.startsWith('```json') && cleanContent.endsWith('```')) {
        // Extract JSON from between the code blocks
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanContent.startsWith('```') && cleanContent.endsWith('```')) {
        // Handle generic code blocks
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      // Try to parse as JSON to validate
      try {
        parsedContent = JSON.parse(cleanContent)
      } catch (jsonError) {
        console.warn('AI response is not valid JSON, using as plain text:', jsonError)
        // If it's not valid JSON, wrap it in a simple structure
        parsedContent = {
          content: cleanContent,
          type: 'text',
          note: 'AI generated content (not in expected JSON format)'
        }
      }

      // Transform the parsed content to match frontend expectations
      if (contentType === 'exam' && parsedContent && typeof parsedContent === 'object') {
        // Handle different AI response formats
        let questionsArray: Record<string, unknown>[] = []

        if (Array.isArray(parsedContent)) {
          // AI returned direct array (new format)
          questionsArray = parsedContent as Record<string, unknown>[]
        } else if (parsedContent && typeof parsedContent === 'object' && 'questions' in parsedContent && Array.isArray((parsedContent as Record<string, unknown>).questions)) {
          // AI returned {questions: [...]} format (old format)
          questionsArray = (parsedContent as Record<string, unknown>).questions as Record<string, unknown>[]
        }

        // Transform questions to match frontend format
        const transformedQuestions = questionsArray.map((q: Record<string, unknown>, index: number) => {
          let options = q.options
          let correctAnswer = q.correctAnswer

          // Transform options from array to object format if needed
          if (Array.isArray(options)) {
            const optsArray = options as string[]
            options = {
              a: optsArray[0] || '',
              b: optsArray[1] || '',
              c: optsArray[2] || '',
              d: optsArray[3] || ''
            }
            // If correctAnswer is a number (index), convert to text
            if (typeof correctAnswer === 'number' && optsArray.length >= correctAnswer + 1) {
              correctAnswer = optsArray[correctAnswer]
            }
          }

          return {
            question: typeof q.question === 'string' ? q.question : `Question ${index + 1}`,
            options: options || { a: '', b: '', c: '', d: '' },
            correctAnswer: typeof correctAnswer === 'string' ? correctAnswer : '',
            explanation: typeof q.explanation === 'string' ? q.explanation : ''
          }
        })

        parsedContent = transformedQuestions
      }

      // Use the cleaned content for database storage
      generatedContent = cleanContent

    } catch (aiError) {
      console.error('AI generation error:', aiError)

      // Handle rate limiting
      if (aiError instanceof Error && (aiError.message.includes('429') || aiError.message.includes('Too Many Requests'))) {
        return NextResponse.json({
          error: 'AI service rate limit exceeded. The uploaded content may be too large. Please try with a smaller file or fewer pages.',
          details: 'Try uploading a smaller PDF file (under 5MB) or fewer pages to avoid rate limits.'
        }, { status: 429 })
      }

      // Handle other AI errors
      return NextResponse.json({
        error: 'AI content generation failed',
        details: aiError instanceof Error ? aiError.message : 'Unknown AI service error'
      }, { status: 500 })
    }

    // Save to appropriate table based on content type for each selected class
    const insertPromises = classIds.map(async (classId) => {
      try {
        if (contentType === 'exam') {
          const examData = {
            exam_title: title,
            subject,
            class_id: classId,
            school_session_id: schoolSessionId,
            teacher_id: teacherId,
            questions: generatedContent, // Assuming JSON format
            duration
          }
          const { error } = await supabaseService.from('cbt_exams').insert(examData)
          if (error) {
            console.error(`Error inserting exam for class ${classId}:`, error)
            throw error
          }
        } else if (contentType === 'assignment') {
          const assignmentData = {
            title,
            description: generatedContent,
            due_date: dueDate,
            class_id: classId,
            teacher_id: teacherId
          }
          const { error } = await supabaseService.from('assignments').insert(assignmentData)
          if (error) {
            console.error(`Error inserting assignment for class ${classId}:`, error)
            throw error
          }
        } else if (contentType === 'test') {
          const quizData = {
            title,
            description: generatedContent,
            due_date: dueDate,
            class_id: classId,
            teacher_id: teacherId,
            school_session_id: schoolSessionId,
            questions: generatedContent // Assuming JSON format
          }
          const { error } = await supabaseService.from('tests_quizzes').insert(quizData)
          if (error) {
            console.error(`Error inserting test/quiz for class ${classId}:`, error)
            throw error
          }
        }
      } catch (error) {
        console.error(`Failed to insert ${contentType} for class ${classId}:`, error)
        throw error
      }
    })

    await Promise.all(insertPromises)

    // Save to ai_generated_content table
    const { error: contentError } = await supabaseService
      .from('ai_generated_content')
      .insert({
        teacher_id: teacherId,
        content_type: contentType,
        title,
        subject,
        class_id: classIds.length === 1 ? classIds[0] : null, // Use first class if multiple
        school_session_id: schoolSessionId,
        generated_data: parsedContent // Use the parsed/cleaned content
      })

    if (contentError) {
      console.error('Error saving to ai_generated_content:', contentError)
      // Don't fail the entire request if this fails, just log it
    }

    return NextResponse.json({ success: true, message: 'Content generated and saved successfully' })
  } catch (error) {
    console.error('Error generating AI content:', error)
    return NextResponse.json({
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
