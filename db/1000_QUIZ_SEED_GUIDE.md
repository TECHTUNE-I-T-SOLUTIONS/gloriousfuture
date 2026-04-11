# 1000-Question Quiz Seeding Guide

## Overview
This guide helps you seed the complete **"Pupil Enlightenment — General Knowledge"** quiz with 1000 questions organized into **5 SQL parts**.

**Total Questions:** 1,000  
**Total Options:** 4,000 (each question has 4 multiple-choice options)  
**Estimated Execution Time:** 2-3 minutes total (30-45 seconds per part)

---

## File Structure

| Part | File | Questions | Categories |
|------|------|-----------|-----------|
| 1 | `seed_quiz_part1_q1-200.sql` | 1-200 | History, Geography, Science (Basics) |
| 2 | `seed_quiz_part2_q201-400.sql` | 201-400 | Biology, Chemistry, Physics |
| 3 | `seed_quiz_part3_q401-600.sql` | 401-600 | Literature, Mythology, Culture |
| 4 | `seed_quiz_part4_q601-800.sql` | 601-800 | Extended Arts, Mathematics |
| 5 | `seed_quiz_part5_q801-1000.sql` | 801-1000 | Geography, Technology, Science |

---

## Prerequisites

1. **Supabase Database Setup**
   - Ensure `public_quizzes` table exists
   - Ensure `public_quiz_questions` table exists
   - Ensure `public_quiz_options` table exists

2. **Verify Quiz Exists**
   ```sql
   SELECT id, title, created_at FROM public.public_quizzes 
   WHERE title = 'Pupil Enlightenment — General Knowledge';
   ```
   If this returns no results, create it first:
   ```sql
   INSERT INTO public.public_quizzes (title, description, created_by)
   VALUES (
     'Pupil Enlightenment — General Knowledge',
     '1000 comprehensive general knowledge questions for student learning',
     'admin'
   );
   ```

---

## Execution Instructions

### Option 1: Sequential Execution (Recommended)

Run each part **in order**, waiting for completion before starting the next:

```bash
# In Supabase SQL Editor, run each file one by one:

1. Run: seed_quiz_part1_q1-200.sql
   Wait for: "Part 1 complete: Questions 1-200 with options inserted!"

2. Run: seed_quiz_part2_q201-400.sql
   Wait for: "Part 2 complete: Questions 201-400 with options inserted!"

3. Run: seed_quiz_part3_q401-600.sql
   Wait for: "Part 3 complete: Questions 401-600 with options inserted!"

4. Run: seed_quiz_part4_q601-800.sql
   Wait for: "Part 4 complete: Questions 601-800 with options inserted!"

5. Run: seed_quiz_part5_q801-1000.sql
   Wait for: "Part 5 complete: Questions 801-1000 with options inserted!"
   
   Final message: "✓ All 1000 questions successfully seeded!"
```

### Option 2: Combined Script (All Parts)

Create `seed_quiz_all_1000_questions.sql` and run everything at once:

```sql
-- Combined 1000-Question Quiz Seed
-- Executes all 5 parts sequentially

\echo '====== PUPIL ENLIGHTENMENT - 1000 QUESTION SEED ======'
\echo 'Starting complete seed process...'

\echo ''
\echo '--- Part 1: Questions 1-200 ---'
\i seed_quiz_part1_q1-200.sql

\echo ''
\echo '--- Part 2: Questions 201-400 ---'
\i seed_quiz_part2_q201-400.sql

\echo ''
\echo '--- Part 3: Questions 401-600 ---'
\i seed_quiz_part3_q401-600.sql

\echo ''
\echo '--- Part 4: Questions 601-800 ---'
\i seed_quiz_part4_q601-800.sql

\echo ''
\echo '--- Part 5: Questions 801-1000 ---'
\i seed_quiz_part5_q801-1000.sql

\echo ''
\echo '====== SEEDING COMPLETE ======'
\echo 'All 1000 questions and 4000 options have been seeded!'
```

---

## Verification

### Verify Total Questions
```sql
SELECT COUNT(*) as total_questions 
FROM public.public_quiz_questions 
WHERE quiz_id = (
  SELECT id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — General Knowledge'
);
-- Expected result: 1000
```

### Verify Total Options
```sql
SELECT COUNT(*) as total_options 
FROM public.public_quiz_options 
WHERE question_id IN (
  SELECT id FROM public.public_quiz_questions 
  WHERE quiz_id = (
    SELECT id FROM public.public_quizzes 
    WHERE title = 'Pupil Enlightenment — General Knowledge'
  )
);
-- Expected result: 4000
```

### Verify Question Distribution
```sql
SELECT 
  MIN(order_index) as first_question,
  MAX(order_index) as last_question,
  COUNT(*) as total_questions
FROM public.public_quiz_questions 
WHERE quiz_id = (
  SELECT id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — General Knowledge'
);
-- Expected: first=1, last=1000, total=1000
```

### Verify Each Part
```sql
SELECT 
  CASE 
    WHEN order_index BETWEEN 1 AND 200 THEN 'Part 1 (Q1-200)'
    WHEN order_index BETWEEN 201 AND 400 THEN 'Part 2 (Q201-400)'
    WHEN order_index BETWEEN 401 AND 600 THEN 'Part 3 (Q401-600)'
    WHEN order_index BETWEEN 601 AND 800 THEN 'Part 4 (Q601-800)'
    WHEN order_index BETWEEN 801 AND 1000 THEN 'Part 5 (Q801-1000)'
  END as part,
  COUNT(*) as question_count
FROM public.public_quiz_questions 
WHERE quiz_id = (
  SELECT id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — General Knowledge'
)
GROUP BY part
ORDER BY part;
-- Expected: 5 rows, each with 200 questions
```

---

## Question Categories

### Part 1: Basic Knowledge (Q1-200)
- **Q1-50:** World History & Civilization
- **Q51-100:** Geography Basics & Countries
- **Q101-150:** Basic Science & Nature
- **Q151-200:** Animals & Wildlife

### Part 2: STEM Foundations (Q201-400)
- **Q201-250:** Biology Basics
- **Q251-300:** Chemistry Fundamentals
- **Q301-350:** Physics Principles
- **Q351-400:** Astronomy & Space

### Part 3: Culture & Arts (Q401-600)
- **Q401-500:** Mythology & Folklore
- **Q501-600:** Literature & Writers

### Part 4: Advanced Knowledge (Q601-800)
- **Q601-720:** Extended Literature & Arts
- **Q721-800:** Extended Mathematics & Logic

### Part 5: Modern Studies (Q801-1000)
- **Q801-900:** Extended Geography & Capitals
- **Q901-1000:** Technology & Advanced Science

---

## Performance Tips

1. **Network Connection:** Ensure stable internet connection to Supabase
2. **Browser Tab:** Keep the SQL editor tab active during execution
3. **Timeout Settings:** Each part typically completes in 30-45 seconds
4. **Error Handling:** If a part fails, check the error message and re-run just that part
5. **Progress Verification:** After each part, check the notification message

---

## Troubleshooting

### Error: "quiz_id is NULL"
**Solution:** The quiz "Pupil Enlightenment — General Knowledge" doesn't exist
```sql
-- Create it first:
INSERT INTO public.public_quizzes (title, description)
VALUES (
  'Pupil Enlightenment — General Knowledge',
  '1000 comprehensive general knowledge questions'
);
```

### Error: "Duplicate key value"
**Solution:** Questions already exist in this quiz
```sql
-- Delete existing questions first:
DELETE FROM public.public_quiz_options 
WHERE question_id IN (
  SELECT id FROM public.public_quiz_questions 
  WHERE quiz_id = (
    SELECT id FROM public.public_quizzes 
    WHERE title = 'Pupil Enlightenment — General Knowledge'
  )
);

DELETE FROM public.public_quiz_questions 
WHERE quiz_id = (
  SELECT id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — General Knowledge'
);
```

### Part Hangs/Times Out
**Solution:**
1. Check database status in Supabase dashboard
2. Refresh the SQL editor
3. Re-run the part from the beginning

---

## Success Checklist

- [ ] All 5 parts executed successfully
- [ ] Quiz shows "1000 total questions" in verification
- [ ] All 4000 options are present
- [ ] Questions distributed across 5 parts (200 each)
- [ ] Quiz is visible in the application
- [ ] Questions load properly in quiz interface

---

## Notes

- Each question has exactly 4 multiple-choice options
- Options are automatically marked with correct answer distribution
- Time limit is set to 20 seconds per question
- All questions are in English
- Questions are categorized by difficulty and subject area

For support, refer to the main [QUICK_START.md](../QUICK_START.md) or database documentation.
