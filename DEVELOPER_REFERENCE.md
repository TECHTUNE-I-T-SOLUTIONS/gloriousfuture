# Programming LMS - Developer Reference Guide

## Quick Navigation

### 📖 Documentation Files
- **PROGRAMMING_LMS_QUICKSTART.md** - Start here! Quick start guide for teachers and pupils
- **PROGRAMMING_LMS_INTEGRATION_GUIDE.md** - Complete technical documentation
- **CODE_CHANGES_SUMMARY.md** - Detailed code change log
- **SESSION_COMPLETION_SUMMARY.md** - What was accomplished in this session

### 🔧 Key Files to Modify/Extend

#### Teacher Dashboard
- `src/app/teacher/teacher-dashboard/ProgrammingCourses/page.tsx` - Main page
- `src/components/teacher/AssessmentEditor.tsx` - Assessment builder
- `src/components/teacher/StudentSubmissionReview.tsx` - Submission grading

#### Pupil Experience
- `src/components/PupilLessonViewer.tsx` - Lesson viewing interface
- `src/components/CodeIDE.tsx` - Code editor component
- `src/app/pupils/programming-lessons/page.tsx` - Lesson listing page

#### API Routes
- `src/app/api/teacher/programming-lessons/[id]/assessments/` - Assessment endpoints
- `src/app/api/teacher/submissions/` - Submission endpoints
- `src/app/api/pupil/programming-lessons/` - Pupil lesson endpoints

---

## 🎯 Common Tasks & How To

### Task 1: Add a New Question Type to Assessments

**Files to Modify:**
- `src/components/teacher/AssessmentEditor.tsx`
- (Optional) API route for validation

**Steps:**
1. Add new type to `Question` interface
2. Add case in question type selector
3. Add conditional rendering for new type fields
4. Add validation in `addQuestion()`
5. Update assessment submission handler to process new type

**Example:**
```typescript
// Add to Question interface
type QuestionType = "multiple_choice" | "true_false" | "code_completion" | "free_coding" | "your_new_type"

// Add to question type selector
<SelectItem value="your_new_type">Your New Type</SelectItem>

// Add conditional fields
{currentQuestion.type === "your_new_type" && (
  <Input placeholder="Your field here" />
)}
```

### Task 2: Create a New API Endpoint

**Pattern:**
```
src/app/api/[section]/[resource]/[id]/[action]/route.ts
```

**Template:**
```typescript
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(request: NextRequest) {
  try {
    // Your GET logic
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error message' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Your POST logic
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error message' }, { status: 400 })
  }
}
```

### Task 3: Add a New Feature to Teacher Dashboard

**Steps:**
1. Add state management to main page
2. Create component if complex logic
3. Add API endpoint if needs database access
4. Integrate component into appropriate tab
5. Test with sample data

**Example Structure:**
```typescript
// 1. Add state
const [newFeature, setNewFeature] = useState({...})
const [features, setFeatures] = useState([])

// 2. Create handler
const handleCreateFeature = async (data) => {
  const res = await fetch('/api/teacher/features', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (res.ok) addToast('Success', 'success')
}

// 3. Add to appropriate tab
<TabsContent value="features">
  <YourFeatureComponent onSave={handleCreateFeature} />
</TabsContent>
```

### Task 4: Fix Video/IDE Display Issues

**Video Not Playing:**
1. Check URL format - should be YouTube URL or direct file URL
2. Verify `isYoutubeUrl()` logic correctly identifies platform
3. Check `getYoutubeEmbedUrl()` correctly extracts video ID
4. Verify iframe sandbox permissions

**IDE Not Showing:**
1. Ensure lesson has `code_example` property
2. Verify `showIDE` state is toggling correctly
3. Check CodeIDE component receives `lessonId` prop
4. Verify language is valid (javascript, python, html, css)

---

## 🗄️ Database Tables Reference

### programming_assessments
```sql
id: UUID PRIMARY KEY
lesson_id: UUID FOREIGN KEY → programming_lessons
title: VARCHAR
description: TEXT
assessment_type: ENUM ('multiple_choice', 'code_completion', 'free_coding', 'true_false', 'matching')
passing_score: INTEGER (default: 70)
max_score: INTEGER (default: 100)
questions: JSONB
is_published: BOOLEAN
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### programming_assessment_submissions
```sql
id: UUID PRIMARY KEY
assessment_id: UUID FOREIGN KEY → programming_assessments
lesson_id: UUID FOREIGN KEY → programming_lessons
module_id: UUID FOREIGN KEY → programming_modules
pupil_uin: VARCHAR
answers: JSONB
code_submission: TEXT
score: DECIMAL(5, 2)
is_passed: BOOLEAN
teacher_feedback: TEXT
teacher_score: INTEGER
status: ENUM ('submitted', 'marked', 'pending_review')
submitted_at: TIMESTAMP
auto_marked_at: TIMESTAMP
marked_at: TIMESTAMP
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### programming_lesson_progress
```sql
id: UUID PRIMARY KEY
lesson_id: UUID FOREIGN KEY → programming_lessons
pupil_uin: VARCHAR
is_completed: BOOLEAN
completed_at: TIMESTAMP
time_spent_minutes: INTEGER
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

---

## 🔐 Authentication & Security

### Session-Based Auth Pattern
```typescript
// In API routes
const sessionCookie = request.cookies.get('session')?.value
if (!sessionCookie) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const session = JSON.parse(decodeURIComponent(sessionCookie))
const pupilUin = session.uin // or teacher ID as needed
```

### Data Validation Best Practices
```typescript
// Always validate input
if (!title || !title.trim()) {
  return NextResponse.json(
    { error: 'Title is required' },
    { status: 400 }
  )
}

// Check required relationships
if (!lessonId) {
  return NextResponse.json(
    { error: 'Lesson ID is required' },
    { status: 400 }
  )
}
```

---

## 🎨 Component Patterns

### Tab Navigation Pattern
```tsx
<Tabs defaultValue="section1" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="section1">Section 1</TabsTrigger>
    <TabsTrigger value="section2">Section 2</TabsTrigger>
    <TabsTrigger value="section3">Section 3</TabsTrigger>
  </TabsList>

  <TabsContent value="section1">Content 1</TabsContent>
  <TabsContent value="section2">Content 2</TabsContent>
  <TabsContent value="section3">Content 3</TabsContent>
</Tabs>
```

### Loading State Pattern
```tsx
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true)
      // Fetch data
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  fetch()
}, [dependency])

if (loading) {
  return <LoadingSpinner />
}
```

### Toast Notification Pattern
```tsx
const addToast = (message: string, type: 'success' | 'error' | 'warning') => {
  const id = `${Date.now()}`
  setToasts(t => [...t, { id, message, type }])
  setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
}

// Usage
addToast('Operation successful!', 'success')
addToast('Something went wrong', 'error')
```

---

## 📊 State Management Patterns

### Form State Pattern
```typescript
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
  field3: 0,
})

// Update single field
const handleChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}

// Or explicit
const handleChange = (field) => (value) => {
  setFormData({ ...formData, [field]: value })
}
```

### Conditional Rendering Pattern
```typescript
{/* Show when condition true */}
{selectedItem && (
  <DetailView item={selectedItem} />
)}

{/* Toggle visibility */}
{showForm && (
  <Form onSubmit={handleSubmit} />
)}

{/* Multiple conditions */}
{!selectedLesson ? (
  <p>Select a lesson</p>
) : !selectedLesson.has_assessment ? (
  <p>Enable assessment</p>
) : (
  <AssessmentEditor />
)}
```

---

## 🚀 Deployment Checklist

- [ ] All environment variables set
- [ ] Database tables created and indexed
- [ ] API endpoints tested
- [ ] Frontend components tested in browser
- [ ] Error handling verified
- [ ] Logging configured
- [ ] Session management tested
- [ ] File uploads working (if applicable)
- [ ] Performance tested
- [ ] Security audit completed
- [ ] Documentation reviewed
- [ ] Deployment scripts ready

---

## 🐛 Debugging Tips

### Common Issues & Solutions

**"lesson_id is not found"**
- Check selectedLesson is set before calling API
- Verify lesson.id exists in selectedLesson object
- Check API URL includes correct lessonId parameter

**"Unauthorized" error**
- Verify session cookie exists and is valid
- Check session.uin or session.id is correctly parsed
- Ensure authentication middleware is working

**API returns 400 Bad Request**
- Check request body JSON is valid
- Verify all required fields are present
- Check Content-Type header is 'application/json'

**Database insert fails**
- Verify all required columns have values
- Check foreign key constraints are satisfied
- Ensure enum values match database definitions
- Check for column name typos

**UI doesn't update after API call**
- Verify state update happens after fetch
- Check component re-renders with new state
- Look for missing dependencies in useEffect
- Verify no conditional rendering blocking display

---

## 📞 Support & Resources

### Need Help?
1. Check PROGRAMMING_LMS_INTEGRATION_GUIDE.md first
2. Review CODE_CHANGES_SUMMARY.md for implementation details
3. Check DATABASE_SCHEMA.md for table structures
4. Review existing similar components for patterns

### Common Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🎯 Next Developer Tasks

Priority order for next developer:

1. **Add Database Indexes**
   - Index on programming_lessons.module_id
   - Index on programming_assessment_submissions.lesson_id
   - Index on programming_lesson_progress.pupil_uin

2. **Implement Pagination**
   - Submissions list pagination
   - Assessment results pagination

3. **Add Real-time Updates**
   - WebSocket for submission notifications
   - Live grade updates

4. **Performance Optimization**
   - Cache assessment questions
   - Optimize submission queries
   - Add request debouncing

5. **Enhanced Features**
   - Bulk grade submissions
   - Export results as CSV
   - Student performance analytics
   - Certificate generation

---

**Version:** 1.0
**Last Updated:** December 2024
**Status:** Production Ready ✅
