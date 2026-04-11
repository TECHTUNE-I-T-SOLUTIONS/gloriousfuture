# Code Changes Summary - Programming LMS Implementation

## Modified Files Overview

### 1. ProgrammingCourses Page (Main Dashboard)
**File:** `src/app/teacher/teacher-dashboard/ProgrammingCourses/page.tsx`

#### State Addition
```typescript
// Added new state for lesson selection
const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
```

#### UI Transformation
**Before:** Single lessons section with inline creation form
**After:** Tabbed interface with three sections:

```tsx
<Tabs defaultValue="lessons" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="lessons">📝 Lessons</TabsTrigger>
    <TabsTrigger value="assessments">📊 Assessments</TabsTrigger>
    <TabsTrigger value="submissions">✓ Submissions</TabsTrigger>
  </TabsList>

  {/* Lessons Tab - Show/hide lesson creation and listing */}
  <TabsContent value="lessons">
    {/* Lesson creation form */}
    {/* Lesson list with clickable selection */}
  </TabsContent>

  {/* Assessments Tab - Assessment editor */}
  <TabsContent value="assessments">
    <AssessmentEditor {...props} />
  </TabsContent>

  {/* Submissions Tab - Submission review */}
  <TabsContent value="submissions">
    <StudentSubmissionReview {...props} />
  </TabsContent>
</Tabs>
```

#### Lesson Selection Feature
```typescript
{/* Make lessons clickable for selection */}
<div 
  className={selectedLesson?.id === lesson.id ? 'border-blue-500 bg-blue-50 shadow-sm' : ''}
  onClick={() => setSelectedLesson(lesson)}
>
  {/* Lesson content */}
</div>
```

---

### 2. StudentSubmissionReview Component
**File:** `src/components/teacher/StudentSubmissionReview.tsx`

#### Fetch Submissions Implementation
```typescript
useEffect(() => {
  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/teacher/submissions?lessonId=${selectedLesson?.id}`)
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data)
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching submissions:", error)
      setLoading(false)
    }
  }

  if (selectedLesson?.has_assessment && selectedLesson?.id) {
    fetchSubmissions()
  }
}, [selectedLesson])
```

#### Save Review Implementation
```typescript
const handleSaveReview = async () => {
  if (!selectedSubmission) return

  try {
    const res = await fetch(`/api/teacher/submissions/${selectedSubmission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacher_feedback: feedback,
        teacher_score: score,
        status: "marked",
        marked_at: new Date().toISOString(),
      }),
    })

    if (res.ok) {
      alert("Review saved successfully")
      setFeedback("")
      setScore(0)
      setSelectedSubmission(null)
      
      // Refresh submissions list
      const updatedRes = await fetch(`/api/teacher/submissions?lessonId=${selectedLesson?.id}`)
      if (updatedRes.ok) {
        const data = await updatedRes.json()
        setSubmissions(data)
      }
    }
  } catch (error) {
    console.error("Error saving review:", error)
  }
}
```

---

### 3. PupilLessonViewer Component
**File:** `src/components/PupilLessonViewer.tsx`

#### Enhanced Lesson Completion Handler
```typescript
const handleLessonComplete = async () => {
  try {
    const res = await fetch(`/api/pupil/programming-lessons/${lesson.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        time_spent_minutes: Math.floor(timeSpent / 60),
        completed_at: new Date().toISOString(),
      }),
    })

    if (res.ok) {
      setLessonCompleted(true)
      if (onLessonComplete) {
        onLessonComplete(lesson.id)
      }
    }
  } catch (error) {
    console.error("Error marking lesson complete:", error)
  }
}
```

---

## New API Routes

### 1. Assessment Creation Endpoint
**Path:** `src/app/api/teacher/programming-lessons/[id]/assessments/route.ts`

```typescript
export async function POST(request, { params }) {
  const { id: lessonId } = await params
  const body = await request.json()
  
  const {
    title,
    description,
    assessment_type,
    passing_score,
    max_score,
    questions,
  } = body

  // Validation
  if (!title || !assessment_type) {
    return NextResponse.json(
      { error: "Title and assessment type are required" },
      { status: 400 }
    )
  }

  if (!questions || questions.length === 0) {
    return NextResponse.json(
      { error: "At least one question is required" },
      { status: 400 }
    )
  }

  // Database insert
  const { data: assessment, error } = await supabase
    .from('programming_assessments')
    .insert({
      lesson_id: lessonId,
      title,
      description: description || null,
      assessment_type,
      passing_score: passing_score || 70,
      max_score: max_score || 100,
      questions: questions || [],
      is_published: false,
    })
    .select()
    .single()

  return NextResponse.json(assessment, { status: 201 })
}
```

### 2. Submissions Fetch Endpoint
**Path:** `src/app/api/teacher/submissions/route.ts`

```typescript
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const assessmentId = searchParams.get('assessmentId')
  const lessonId = searchParams.get('lessonId')
  const moduleId = searchParams.get('moduleId')

  let query = supabase
    .from('programming_assessment_submissions')
    .select('*')

  if (assessmentId) query = query.eq('assessment_id', assessmentId)
  if (lessonId) query = query.eq('lesson_id', lessonId)
  if (moduleId) query = query.eq('module_id', moduleId)

  const { data: submissions } = await query.order('submitted_at', { ascending: false })

  return NextResponse.json(submissions || [])
}
```

### 3. Submission Review Endpoint
**Path:** `src/app/api/teacher/submissions/[id]/route.ts`

```typescript
export async function PATCH(request, { params }) {
  const { id: submissionId } = await params
  const body = await request.json()

  const {
    teacher_feedback,
    teacher_score,
    status,
    marked_at,
  } = body

  const updateData = {}
  
  if (teacher_feedback !== undefined) updateData.teacher_feedback = teacher_feedback
  if (teacher_score !== undefined) updateData.teacher_score = teacher_score
  if (status !== undefined) updateData.status = status
  if (marked_at !== undefined) updateData.marked_at = marked_at

  const { data: submission, error } = await supabase
    .from('programming_assessment_submissions')
    .update(updateData)
    .eq('id', submissionId)
    .select()
    .single()

  return NextResponse.json(submission)
}
```

### 4. Lesson Completion Endpoint
**Path:** `src/app/api/pupil/programming-lessons/[id]/route.ts`

```typescript
export async function POST(request, { params }) {
  const sessionCookie = request.cookies.get('session')?.value
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = JSON.parse(decodeURIComponent(sessionCookie))
  const pupilUin = session.uin
  const { id: lessonId } = await params
  const body = await request.json()
  const { time_spent_minutes, completed_at } = body

  // Check if progress exists
  const { data: existingProgress } = await supabase
    .from('programming_lesson_progress')
    .select('id')
    .eq('lesson_id', lessonId)
    .eq('pupil_uin', pupilUin)
    .single()

  if (existingProgress) {
    // Update existing
    const { data: updatedProgress } = await supabase
      .from('programming_lesson_progress')
      .update({
        is_completed: true,
        completed_at: completed_at || new Date().toISOString(),
        time_spent_minutes: time_spent_minutes || 0,
      })
      .eq('id', existingProgress.id)
      .select()
      .single()

    return NextResponse.json(updatedProgress)
  } else {
    // Create new
    const { data: newProgress } = await supabase
      .from('programming_lesson_progress')
      .insert({
        lesson_id: lessonId,
        pupil_uin: pupilUin,
        is_completed: true,
        completed_at: completed_at || new Date().toISOString(),
        time_spent_minutes: time_spent_minutes || 0,
      })
      .select()
      .single()

    return NextResponse.json(newProgress, { status: 201 })
  }
}
```

---

## Data Flow Diagrams

### Teacher Creating Assessment
```
Teacher Page
  ↓
Select Lesson (sets selectedLesson)
  ↓
Click Assessments Tab
  ↓
AssessmentEditor Component Renders
  ↓
Create Assessment with Questions
  ↓
handleCreateAssessment() Called
  ↓
POST /api/teacher/programming-lessons/{id}/assessments
  ↓
Database: Insert to programming_assessments
  ↓
Success Toast Notification
```

### Teacher Reviewing Submission
```
Submissions Tab Loads
  ↓
useEffect Triggers
  ↓
GET /api/teacher/submissions?lessonId={id}
  ↓
Display Submissions List
  ↓
Click Submission
  ↓
View Answers & Code
  ↓
Add Feedback & Score
  ↓
Click Save Review
  ↓
PATCH /api/teacher/submissions/{id}
  ↓
Database: Update programming_assessment_submissions
  ↓
Refresh Submissions List
  ↓
Success Toast
```

### Pupil Completing Lesson
```
View Lesson Page
  ↓
Watch Video
  ↓
Read Content
  ↓
Practice with IDE (optional)
  ↓
Click "Mark as Complete"
  ↓
handleLessonComplete() Called
  ↓
POST /api/pupil/programming-lessons/{id}
  ↓
Database: Create/Update programming_lesson_progress
  ↓
UI: Button Changes to "Completed"
```

---

## Summary of Changes

| Component/File | Type | Changes | Lines Added |
|---|---|---|---|
| ProgrammingCourses/page.tsx | Modified | Added selectedLesson state, Tabs UI, lesson selection | ~200 |
| StudentSubmissionReview.tsx | Modified | API integration for fetching and saving reviews | ~30 |
| PupilLessonViewer.tsx | Modified | API integration for marking lesson complete | ~20 |
| assessments/route.ts | Created | Assessment CRUD endpoint | 85 |
| submissions/route.ts | Created | Submission listing endpoint | 48 |
| submissions/[id]/route.ts | Created | Submission review endpoint | 65 |
| pupil/.../[id]/route.ts | Created | Lesson completion endpoint | 95 |

**Total Lines of Code Added:** ~543 lines

---

**End of Code Changes Summary**
