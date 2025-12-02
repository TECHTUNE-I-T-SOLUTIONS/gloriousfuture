# Programming Tutorial System - Quick Start Guide

## 🚀 Getting Started

### Step 1: Apply Database Migrations

Run these SQL migrations in your Supabase console or via your migration tool:

```sql
-- First, run the schema creation migration
-- File: db/migrations/20250901-create-programming-tutorials.sql

-- Then, seed the pre-built courses
-- File: db/migrations/20250902-seed-programming-courses.sql
```

**Important:** Both migrations must run in order. The second one depends on the tables created in the first.

### Step 2: Verify Database Setup

Check that tables were created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'programming_%';
```

Should return 7 tables:
- programming_courses
- programming_modules
- programming_lessons
- programming_assessments
- programming_pupil_progress
- programming_assessment_submissions
- programming_lesson_completion

### Step 3: Check Pre-Seeded Data

```sql
-- View all courses
SELECT title, difficulty_level, age_group, is_published FROM programming_courses;

-- Should show 4 courses, all published
```

---

## 👨‍🏫 For Teachers

### Access Programming Courses

1. **Login** as teacher
2. **Navigate to** Dashboard → Sidebar → "Programming Courses"
3. You'll see "Create Course" button and any existing courses

### Create a New Course

```
1. Click "Create Course"
2. Fill in:
   - Title: "My Course Name"
   - Description: "What students will learn"
   - Difficulty: beginner/intermediate/advanced
   - Age Group: 6-10/11-15/16-18/all
3. Click "Create Course"
```

### Add Modules to Course

```
1. Select a course from the list
2. Click "Add Module" in left panel
3. Enter module title and description
4. Click "Create"
```

### Add Lessons to Module

```
1. Select a module (left panel)
2. Click "Add Lesson" in right panel
3. Fill in:
   - Title: Lesson name
   - Content: Main lesson text
   - Duration: estimated minutes
   - Has Assessment: toggle if needed
4. Click "Create"
```

### Publish Course

```
1. Find course in list
2. Click eye icon to toggle publish status
3. Only published courses visible to students
```

---

## 👨‍🎓 For Students

### Browse Available Courses

1. **Login** as student
2. **Navigate to** Dashboard → Sidebar → "Programming Courses"
3. See all available courses organized by difficulty and age

### Enroll in a Course

```
1. Find a course you like
2. Click "Enroll Now" button
3. Confirmed! You're enrolled
4. Course now appears in "My Courses" section
```

### Start Learning

```
1. In "My Courses", click "Continue Learning"
2. View lesson content, code examples
3. Read learning objectives
4. Complete the assessment (if present)
```

### Take Assessments

```
1. Read the question carefully
2. Select your answer from options
3. Click submit
4. Get instant feedback:
   - Your answer
   - Correct answer
   - Explanation
   - Pass/Fail status
```

### Track Progress

- Progress bar shows completion %
- See lessons completed count
- See assessments passed count
- View estimated completion time

---

## 📊 Pre-Seeded Content

### Available Courses

#### 1. Logic Building & Brain Sharpeners
- **Difficulty:** Beginner
- **Target:** Ages 6-10
- **Content:** Pattern recognition, logic puzzles
- **Lessons:** 2
- **Assessments:** 2

#### 2. Block-Based Programming Adventures
- **Difficulty:** Beginner
- **Target:** Ages 6-10
- **Content:** Visual programming with blocks
- **Lessons:** 1
- **Assessments:** 1

#### 3. Computational Thinking Games
- **Difficulty:** Beginner
- **Target:** Ages 6-10
- **Content:** Sequences, instructions, algorithms
- **Lessons:** 1
- **Assessments:** 1

#### 4. Introduction to JavaScript
- **Difficulty:** Beginner
- **Target:** Ages 8-10 (advanced)
- **Content:** Real JavaScript code
- **Lessons:** 4
- **Assessments:** 4

---

## 🧪 Testing the System

### Test Auto-Marking

1. Enroll in any course
2. Find a lesson with assessment
3. Take the assessment
4. You should immediately see:
   - Score (e.g., "85%")
   - Pass/Fail status
   - Detailed feedback per question

### Test Progress Tracking

1. Complete 2-3 assessments
2. Return to course view
3. Progress bar should update
4. "Lessons completed" should increase

### Test Pub/Sub

1. Create a test course
2. Leave it unpublished
3. As student, you won't see it
4. Publish it as teacher
5. Now student can see and enroll

---

## 🔗 API Reference

### Teacher Endpoints

```bash
# Get all teacher's courses
GET /api/teacher/programming-courses

# Create course
POST /api/teacher/programming-courses
Body: {
  title: "Course Name",
  description: "...",
  difficulty_level: "beginner",
  age_group: "6-10"
}

# Update course
PATCH /api/teacher/programming-courses/[id]
Body: { is_published: true, ... }

# Delete course
DELETE /api/teacher/programming-courses/[id]

# Add module to course
POST /api/teacher/programming-courses/[id]/modules
Body: { title: "Module 1", description: "..." }

# Add lesson to module
POST /api/teacher/programming-modules/[id]/lessons
Body: {
  title: "Lesson 1",
  content: "...",
  estimated_duration_minutes: 15,
  has_assessment: true
}
```

### Pupil Endpoints

```bash
# Get published courses
GET /api/pupil/programming-courses

# Get my progress
GET /api/pupil/programming-progress

# Enroll in course
POST /api/pupil/programming-courses/enroll
Body: { course_id: "uuid" }

# Submit assessment
POST /api/pupil/programming-assessments/submit
Body: {
  assessment_id: "uuid",
  lesson_id: "uuid",
  course_id: "uuid",
  answers: { "q1": "option_a", "q2": "option_b" }
}

# Response includes auto-marked score and feedback
```

---

## ⚙️ Configuration

### Assessment Passing Score

Default is 70%. To change, update in database:

```sql
UPDATE programming_assessments 
SET passing_score = 80 
WHERE id = 'assessment-uuid';
```

### Course Visibility

Courses are only visible to students when:
```sql
WHERE is_published = true
```

Teachers can see all their courses regardless of publication status.

---

## 🐛 Troubleshooting

### "Unauthorized" Error
- Check session cookie is being sent
- Verify `uin` is in session data
- Check teacher/pupil exists in database

### Assessment Not Submitting
- Verify all required fields in submission
- Check assessment questions have correct_answer fields
- Look for browser console errors

### Progress Not Updating
- Assessment must have `is_passed = true`
- Check programming_pupil_progress record exists
- Verify lesson_completion insert succeeds

### Course Not Visible
- Course must have `is_published = true`
- Check course is associated with correct subject
- Verify pupil has enrolled

---

## 📈 Monitoring

### Check Enrollment Stats

```sql
SELECT 
  c.title,
  COUNT(DISTINCT ppp.pupil_id) as enrolled_students,
  AVG(ppp.course_completion_percentage) as avg_completion
FROM programming_courses c
LEFT JOIN programming_pupil_progress ppp ON c.id = ppp.course_id
GROUP BY c.id, c.title;
```

### Check Assessment Performance

```sql
SELECT 
  a.title,
  COUNT(*) as submissions,
  AVG(pas.score) as avg_score,
  COUNT(CASE WHEN pas.is_passed THEN 1 END) as passed_count
FROM programming_assessments a
LEFT JOIN programming_assessment_submissions pas ON a.id = pas.assessment_id
GROUP BY a.id, a.title;
```

---

## 🎯 Best Practices

1. **For Teachers:**
   - Start with beginner courses
   - Create clear learning objectives
   - Add diverse assessment types
   - Provide helpful explanations
   - Test courses before publishing

2. **For Students:**
   - Start with age-appropriate difficulty
   - Complete lessons in order
   - Don't skip assessments (they track progress)
   - Re-take failed assessments for mastery
   - Review explanations for wrong answers

3. **For Admins:**
   - Monitor progress regularly
   - Watch for assessment patterns
   - Support struggling students
   - Encourage course completion
   - Gather feedback for improvements

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review error logs
3. Verify database migrations ran
4. Check API responses in browser dev tools
5. Review database records directly

---

## ✅ Checklist

Before going live:

- [ ] Database migrations applied successfully
- [ ] 4 pre-seeded courses visible
- [ ] Teacher can create new course
- [ ] Student can enroll in course
- [ ] Assessment auto-marking works
- [ ] Progress updates correctly
- [ ] Publish/unpublish toggles work
- [ ] Sidebar items visible
- [ ] No console errors
- [ ] Toast notifications appear
- [ ] Responsive design looks good on mobile
- [ ] Session authentication working

---

## 🎉 Ready to Go!

Your programming tutorial system is ready to use. Happy learning! 🚀

For detailed technical documentation, see: `PROGRAMMING_TUTORIAL_SYSTEM.md`
