# Programming Learning Management System - Implementation Guide

## Overview

This guide covers the complete programming learning management system implementation for both teachers and pupils, including course creation, lesson management with video support, assessments, and an integrated coding IDE.

---

## Table of Contents

1. [Teacher Dashboard Features](#teacher-dashboard-features)
2. [Pupil Learning Interface](#pupil-learning-interface)
3. [Video Support](#video-support)
4. [Assessment System](#assessment-system)
5. [IDE Integration](#ide-integration)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [File Structure](#file-structure)

---

## Teacher Dashboard Features

### Location
`/src/app/teacher/teacher-dashboard/ProgrammingCourses/page.tsx`

### 1. Course Management

#### Creating a Course
- Click **"Create Course"** button
- Fill in:
  - **Course Title**: Name of the programming course
  - **Description**: Course overview and objectives
  - **Difficulty Level**: Beginner, Intermediate, or Advanced
  - **Age Group**: 6-10, 11-15, 16-18, or All Ages
- Click **"Create Course"**

#### Publishing/Unpublishing Courses
- Click the **eye icon** to toggle course visibility
- Published courses are available to pupils
- Draft courses are only visible to the teacher

#### Editing Courses
- Click the **pencil icon** to edit course details
- Click the **trash icon** to delete (with confirmation)
- Courses can only be deleted if there are no student enrollments

### 2. Module Management

Within a selected course:

#### Creating Modules
- Click **"Add Module"** in the Modules section
- Enter:
  - **Module Title**: Name of the module (e.g., "Introduction", "Advanced Concepts")
  - **Description**: What students will learn
- Modules organize lessons into logical groups

#### Module Features
- Modules are ordered sequentially
- Each module can contain multiple lessons
- Delete modules with the **trash icon**

### 3. Lesson Creation with Enhanced Features

#### Basic Lesson Information
- **Lesson Title**: Name of the lesson (required)
- **Lesson Content**: Main teaching content in markdown format (required)
- **Duration**: Estimated time to complete (in minutes)

#### Video Integration
- **Video URL Support**:
  - **YouTube Links**: Paste any YouTube URL (automatically embedded)
  - **Direct Video Files**: Upload or link to MP4, WebM files
  - **File Size Limit**: Up to 50MB
  - Formats: MP4, WebM, OGG

#### Code Examples
- **Code Example**: Template code shown to students
- **Code Language**: Select from:
  - JavaScript
  - Python
  - HTML
  - CSS
  - Java
  - C#

#### Assessment Toggle
- Check **"Has Assessment"** if this lesson includes a quiz or assignment
- Only lessons with this enabled can have assessments

### 4. Assessment Creation

#### Creating Assessments

New components added:
- **AssessmentEditor** (`/src/components/teacher/AssessmentEditor.tsx`)

#### Assessment Types

1. **Multiple Choice**
   - Add up to 4 options
   - Select the correct answer with radio button
   - Include explanation for correct answer

2. **True/False**
   - Simple boolean questions
   - Auto-populated with True/False options

3. **Code Completion**
   - Provide code template with blanks
   - Students complete the code

4. **Free Coding**
   - Open-ended coding challenge
   - Provide expected output description

#### Building Questions
- **Question Text**: The actual question (required)
- **Question Type**: Choose assessment type
- **Options**: For multiple choice/true-false
- **Correct Answer**: Mark the correct option
- **Explanation**: Why this answer is correct
- **Code Template**: For code-based questions

#### Assessment Settings
- **Passing Score**: Percentage needed to pass (default: 70%)
- **Max Score**: Total points available (default: 100)
- **Assessment Type**: Overall format of the assessment

### 5. Student Submission Review

New component:
- **StudentSubmissionReview** (`/src/components/teacher/StudentSubmissionReview.tsx`)

#### Features
- **View Submissions**: See all student submissions for a lesson's assessment
- **Review Details**: See student's answers and code submissions
- **Provide Feedback**: 
  - Enter custom score (0-100%)
  - Write detailed feedback for improvement
- **Track Status**: 
  - Submitted
  - Auto-marked
  - Pending Review
  - Feedback Provided

---

## Pupil Learning Interface

### Location
`/src/app/pupils/pupil-dashboard/ProgrammingLessons/page.tsx`

### Components

#### Main Lesson Viewer
- **PupilLessonViewer** (`/src/components/PupilLessonViewer.tsx`)

### Features Available to Pupils

#### 1. Video Playback
- **YouTube Videos**: Embedded with full controls
  - Play, pause, volume control
  - Fullscreen mode
  - Timestamp seeking
- **File-based Videos**: HTML5 video player
  - Supports MP4, WebM
  - Playback controls
  - Adaptive streaming

#### 2. Learning Content
- **Formatted Lesson Text**: 
  - Markdown support
  - Code blocks with syntax highlighting
  - Ordered and bulleted lists
- **Learning Objectives**:
  - Clear outcomes for the lesson
  - Checkmarks to track completion
- **Code Examples**:
  - Highlighted code snippets
  - Language indication
  - Copy-to-IDE button

#### 3. Practice IDE

New component:
- **CodeIDE** (already exists: `/src/components/CodeIDE.tsx`)

**Features:**
- **Multiple Languages**: JavaScript, Python, HTML/CSS, Java, C#
- **Code Execution**: Run code and see output
- **Live Editor**: Syntax highlighting, auto-completion
- **Toggle View**: 
  - Click **"Open IDE"** to show sidebar IDE
  - Click **"Close IDE"** to hide
  - Fullscreen mode available
- **Persistent Code**: Code remains while switching between lesson sections
- **Code Examples**: Pre-loaded from lesson
- **Output Display**: See execution results in real-time

#### IDE Controls

```
┌─────────────────────────────────────┐
│ [Language Selector]  [Run] [Clear]  │
├─────────────────────────────────────┤
│                                     │
│     Code Editor Area                │
│     (with syntax highlighting)      │
│                                     │
├─────────────────────────────────────┤
│ Output:                             │
│ [execution results]                 │
└─────────────────────────────────────┘
```

#### 4. Progress Tracking
- **Time Spent**: Track total time on lesson
- **Duration Goal**: Visual progress toward recommended time
- **Completion Status**: Mark lesson as complete
- **Assessment Access**: Button to take lesson assessment

#### 5. Assessment Taking
- **Quiz Interface**: 
  - Question display
  - Answer selection/input
  - Progress indicator
- **Submission**: 
  - Submit answers
  - Receive instant feedback
  - View score and explanations

---

## Video Support

### Teacher Upload & Integration

#### YouTube Videos
1. Copy YouTube URL from share button
2. Paste in "Video URL" field when creating lesson
3. Supported formats:
   - `https://youtube.com/watch?v=VIDEO_ID`
   - `https://youtu.be/VIDEO_ID`
   - Short links with parameters

#### File-Based Videos
1. **Upload Location**: Use your hosting service:
   - Cloudinary
   - AWS S3
   - Vercel Blob
   - Your own server

2. **File Requirements**:
   - Format: MP4 (recommended), WebM
   - Max Size: 50MB
   - Bitrate: 1-5 Mbps (for smooth playback)

3. **Paste URL**: In "Video URL" field

#### Embedding in Lessons
```tsx
{lesson.video_url && (
  isYoutubeUrl ? (
    // YouTube iframe
  ) : (
    // HTML5 video player
  )
)}
```

---

## Assessment System

### Question Types

#### 1. Multiple Choice
```json
{
  "type": "multiple_choice",
  "text": "What is a variable?",
  "options": [
    "A container for storing data",
    "A function definition",
    "A loop structure",
    "A conditional statement"
  ],
  "correct_answer": 0,
  "explanation": "Variables store data values that can be used and modified throughout a program."
}
```

#### 2. True/False
```json
{
  "type": "true_false",
  "text": "JavaScript is case-sensitive",
  "correct_answer": true,
  "explanation": "Yes, JavaScript distinguishes between uppercase and lowercase letters."
}
```

#### 3. Code Completion
```json
{
  "type": "code_completion",
  "text": "Complete the function to add two numbers",
  "code_template": "function add(a, b) {\n  // Write code here\n}",
  "expected_output": "Returns the sum of a and b",
  "correct_answer": "return a + b;"
}
```

#### 4. Free Coding
```json
{
  "type": "free_coding",
  "text": "Write a function that reverses a string",
  "starter_code": "function reverseString(str) {\n  // Your code here\n}",
  "expected_output": "Function successfully reverses input strings"
}
```

### Scoring
- **Automatic Scoring**: Multiple choice and true/false auto-scored
- **Manual Review**: Code submissions require teacher review
- **Feedback**: Teachers provide detailed feedback on code quality
- **Attempt Tracking**: Track number of submission attempts

---

## IDE Integration

### Features

#### Code Execution
```tsx
<CodeIDE
  language="javascript"
  initialCode={lesson.code_example || ""}
/>
```

#### Supported Languages
- **JavaScript** (Node.js environment)
- **Python** (Python 3)
- **HTML/CSS** (Browser environment)
- **Java** (JVM)
- **C#** (.NET environment)

#### IDE Features
- **Syntax Highlighting**: Language-specific
- **Auto-indentation**: Automatic code formatting
- **Line Numbers**: Code line tracking
- **Theme Support**: Dark/Light modes
- **Code Execution**: Run and see output
- **Error Display**: Clear error messages
- **Input Handling**: For interactive programs

#### Embedding in Lessons
```tsx
// Sidebar IDE (toggleable)
{showIDE && <CodeIDE language={lesson.code_language} />}

// Fullscreen IDE (modal)
{isIDEFullscreen && <CodeIDE fullscreen {...props} />}
```

### Student Workflow
1. **Read lesson content** with code examples
2. **Click "Open IDE"** to show practice editor
3. **Edit and modify** the provided code
4. **Click "Run"** to execute
5. **See output** in results panel
6. **Experiment freely** with different approaches
7. **Close IDE** when done and **Mark Complete**
8. **Take Assessment** to test understanding

---

## Database Schema

### Core Tables

#### `programming_courses`
```sql
- id: UUID
- teacher_id: UUID (foreign key)
- title: TEXT
- description: TEXT
- difficulty_level: ENUM('beginner', 'intermediate', 'advanced')
- age_group: ENUM('6-10', '11-15', '16-18', 'all')
- is_published: BOOLEAN
- created_at, updated_at: TIMESTAMP
```

#### `programming_modules`
```sql
- id: UUID
- course_id: UUID (foreign key)
- title: TEXT
- description: TEXT
- order_index: INTEGER
- created_at, updated_at: TIMESTAMP
```

#### `programming_lessons`
```sql
- id: UUID
- module_id: UUID (foreign key)
- title: TEXT
- content: TEXT
- video_url: TEXT (optional)
- video_size_mb: NUMERIC
- video_duration_seconds: INTEGER
- code_example: TEXT
- code_language: VARCHAR(50)
- estimated_duration_minutes: INTEGER
- has_assessment: BOOLEAN
- learning_objectives: TEXT[]
- created_at, updated_at: TIMESTAMP
```

#### `programming_assessments`
```sql
- id: UUID
- lesson_id: UUID (foreign key)
- title: TEXT
- description: TEXT
- assessment_type: ENUM(...)
- questions: JSONB
- passing_score: NUMERIC
- max_score: NUMERIC
- created_at, updated_at: TIMESTAMP
```

#### `programming_assessment_submissions`
```sql
- id: UUID
- assessment_id: UUID
- pupil_id: UUID
- lesson_id: UUID
- answers: JSONB
- code_submission: TEXT
- score: NUMERIC
- is_passed: BOOLEAN
- feedback: JSONB
- submitted_at: TIMESTAMP
- reviewed_by_teacher: UUID
```

#### `programming_lesson_completion`
```sql
- id: UUID
- pupil_id: UUID
- lesson_id: UUID
- course_id: UUID
- completed_at: TIMESTAMP
- time_spent_seconds: INTEGER
```

---

## API Endpoints

### Course Management
```
POST   /api/teacher/programming-courses
GET    /api/teacher/programming-courses
GET    /api/teacher/programming-courses/:id
PATCH  /api/teacher/programming-courses/:id
DELETE /api/teacher/programming-courses/:id
```

### Module Management
```
POST   /api/teacher/programming-courses/:courseId/modules
GET    /api/teacher/programming-courses/:courseId/modules
DELETE /api/teacher/programming-modules/:id
PATCH  /api/teacher/programming-modules/:id
```

### Lesson Management
```
POST   /api/teacher/programming-modules/:moduleId/lessons
GET    /api/teacher/programming-modules/:moduleId/lessons
DELETE /api/teacher/programming-lessons/:id
PATCH  /api/teacher/programming-lessons/:id
POST   /api/teacher/programming-lessons/:id/upload-video
```

### Assessment Management
```
POST   /api/teacher/programming-lessons/:lessonId/assessments
GET    /api/teacher/programming-lessons/:lessonId/assessments
PATCH  /api/teacher/programming-assessments/:id
DELETE /api/teacher/programming-assessments/:id
```

### Submission Review
```
GET    /api/teacher/submissions?lessonId=:id
GET    /api/teacher/submissions/:id
PATCH  /api/teacher/submissions/:id
POST   /api/teacher/submissions/:id/provide-feedback
```

### Pupil Endpoints
```
GET    /api/pupil/programming-courses
GET    /api/pupil/programming-courses/:courseId
GET    /api/pupil/programming-modules/:moduleId/lessons
GET    /api/pupil/programming-lessons/:lessonId
POST   /api/pupil/programming-lessons/:lessonId/complete
GET    /api/pupil/programming-assessments/:assessmentId
POST   /api/pupil/programming-assessments/:assessmentId/submit
POST   /api/pupil/programming-practice/execute
```

---

## File Structure

### New Components Created

```
/src/components/
├── teacher/
│   ├── LessonEditorPanel.tsx          (NEW: Enhanced lesson creation)
│   ├── AssessmentEditor.tsx           (NEW: Assessment builder)
│   └── StudentSubmissionReview.tsx    (NEW: Submission review interface)
├── PupilLessonViewer.tsx              (NEW: Full lesson viewer for pupils)
└── CodeIDE.tsx                        (EXISTS: Code execution IDE)

/src/app/
├── teacher/
│   ├── teacher-dashboard/
│   │   └── ProgrammingCourses/
│   │       └── page.tsx               (ENHANCED: Added video & assessment support)
│   └── programming-courses/
│       └── [id]/lessons/page.tsx      (EXISTING: Lesson management)
└── pupils/
    └── pupil-dashboard/
        ├── ProgrammingCourses/
        │   └── page.tsx               (EXISTING: Course browsing)
        └── ProgrammingLessons/
            └── page.tsx               (Uses PupilLessonViewer component)
```

---

## Implementation Checklist

### For Teachers
- [x] Create programming courses
- [x] Add modules to courses
- [x] Create lessons with video support
- [x] Add code examples to lessons
- [x] Set learning objectives
- [x] Create assessments with multiple question types
- [x] Review student submissions
- [x] Provide feedback on code
- [x] Track student progress
- [x] Publish/unpublish courses

### For Pupils
- [x] Browse available programming courses
- [x] View course structure (modules and lessons)
- [x] Watch lesson videos (YouTube & files)
- [x] Read lesson content with code examples
- [x] Open and use the practice IDE
- [x] Execute code and see output
- [x] Toggle IDE visibility
- [x] Use fullscreen IDE mode
- [x] Track time spent on lessons
- [x] Mark lessons as complete
- [x] Take assessments
- [x] See feedback on submissions

---

## Configuration & Setup

### Environment Variables Needed
```env
# Video Hosting (choose one)
NEXT_PUBLIC_VIDEO_STORAGE_URL=https://your-video-storage.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Code Execution Service (optional)
NEXT_PUBLIC_CODE_EXECUTOR_URL=https://your-executor-service.com
CODE_EXECUTOR_API_KEY=your_api_key
```

### Database Migrations
All tables are already defined in the SQL schema provided in the attachment.

Run migrations using:
```bash
# Using Supabase CLI
supabase migration up

# Or execute SQL directly in Supabase dashboard
```

---

## Best Practices

### For Teachers

1. **Video Optimization**
   - Use YouTube for most content (better performance)
   - Keep videos under 50MB for file uploads
   - Include clear title and description

2. **Assessment Design**
   - Mix question types for engagement
   - Provide detailed explanations
   - Set realistic passing scores
   - Include code comments in examples

3. **Lesson Structure**
   - One lesson = one concept
   - Include 1-2 code examples per lesson
   - 15-20 minutes is ideal length
   - Always provide practice IDE code

### For Pupils

1. **Learning Effectiveness**
   - Watch videos completely before coding
   - Take notes on key concepts
   - Modify code examples to understand
   - Complete all assessments

2. **IDE Usage**
   - Experiment with variations
   - Read error messages carefully
   - Reference code examples while coding
   - Test edge cases

---

## Troubleshooting

### Video Not Playing
- Check video URL format
- Verify YouTube URL is public
- Ensure video file exists if using file upload
- Check browser video codec support

### Code Execution Issues
- Verify language selection matches code
- Check syntax for language rules
- Ensure input format matches expectations
- Review console for error messages

### Assessment Not Showing
- Enable "Has Assessment" on lesson
- Verify assessment is created
- Check publication status of course
- Clear browser cache

---

## Future Enhancements

- Real-time code collaboration
- AI-powered code review
- Video progress bookmarking
- Certificate generation
- Plagiarism detection for code
- Interactive coding challenges
- Code repository integration
- Live coding sessions
- Peer code review system
- Automated test creation
