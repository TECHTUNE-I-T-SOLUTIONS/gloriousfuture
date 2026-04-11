# Quiz Seed Files - Rewritten for Separate Quiz Categories

## Summary of Changes

All 5 seed files have been rewritten to create **separate quizzes** instead of inserting into a single "Pupil Enlightenment — General Knowledge" quiz. Each file now:
- Creates its own unique quiz category
- Has 200 questions (Q1-200)
- Generates 800 multiple-choice options (4 per question)
- Works independently from the other parts

---

## New Quiz Structure

| File | Quiz Title | Questions | Options |
|------|-----------|-----------|---------|
| **Part 1** | Pupil Enlightenment — General Knowledge | 200 (Q1-200) | 800 |
| **Part 2** | Pupil Enlightenment — Sports, Technology & Politics | 200 (Q1-200) | 800 |
| **Part 3** | Pupil Enlightenment — Culture & Arts | 200 (Q1-200) | 800 |
| **Part 4** | Pupil Enlightenment — Advanced Knowledge | 200 (Q1-200) | 800 |
| **Part 5** | Pupil Enlightenment — Geography & Science | 200 (Q1-200) | 800 |

**Total:** 5 separate quizzes of 200 questions each = **1000 total questions** across all categories

---

## File Names

### Updated Files (Modified)
- ✓ `seed_quiz_part1_q1-200.sql` - Already exists, working fine
- ✓ `seed_quiz_part2_q201-400.sql` - **UPDATED** to create new "Sports, Technology & Politics" quiz

### New Files (Created)
- ✓ `seed_quiz_part3_q401-600_NEW.sql` - Creates "Culture & Arts" quiz  
- ✓ `seed_quiz_part4_q601-800_NEW.sql` - Creates "Advanced Knowledge" quiz
- ✓ `seed_quiz_part5_q801-1000_NEW.sql` - Creates "Geography & Science" quiz

---

## How to Use

### Step 1: Replace Part 3
```bash
# Remove old file
rm seed_quiz_part3_q401-600.sql

# Rename new file
mv seed_quiz_part3_q401-600_NEW.sql seed_quiz_part3_q401-600.sql
```

### Step 2: Replace Part 4
```bash
# Remove old file
rm seed_quiz_part4_q601-800.sql

# Rename new file
mv seed_quiz_part4_q601-800_NEW.sql seed_quiz_part4_q601-800.sql
```

### Step 3: Replace Part 5
```bash
# Remove old file
rm seed_quiz_part5_q801-1000.sql

# Rename new file
mv seed_quiz_part5_q801-1000_NEW.sql seed_quiz_part5_q801-1000.sql
```

### Step 4: Run All Parts in Order

In Supabase SQL Editor, run each file sequentially:

1. **Part 1** → Creates "Pupil Enlightenment — General Knowledge" (200 Q)
   ```
   ✓ Already completed successfully
   ```

2. **Part 2** → Creates "Pupil Enlightenment — Sports, Technology & Politics" (200 Q)
   ```
   Copy & paste seed_quiz_part2_q201-400.sql
   Wait for: "Part 2 complete..."
   ```

3. **Part 3** → Creates "Pupil Enlightenment — Culture & Arts" (200 Q)
   ```
   Copy & paste seed_quiz_part3_q401-600.sql
   Wait for: "Part 3 complete..."
   ```

4. **Part 4** → Creates "Pupil Enlightenment — Advanced Knowledge" (200 Q)
   ```
   Copy & paste seed_quiz_part4_q601-800.sql
   Wait for: "Part 4 complete..."
   ```

5. **Part 5** → Creates "Pupil Enlightenment — Geography & Science" (200 Q)
   ```
   Copy & paste seed_quiz_part5_q801-1000.sql
   Wait for: "Part 5 complete..."
   ```

---

## Content by Category

### Part 1: General Knowledge (Already Done ✓)
- World History & Civilization
- Basic Geography & Countries
- Basic Science & Nature
- Animals & Wildlife

### Part 2: Sports, Technology & Politics (NEW)
- **Q1-80:** Sports & Entertainment
- **Q81-140:** Technology & Tech Companies
- **Q141-200:** Politics & Government

### Part 3: Culture & Arts (NEW)
- **Q1-100:** Extended History & Mythology
- **Q101-200:** Literature & Writers

### Part 4: Advanced Knowledge (NEW)
- **Q1-100:** Visual Arts & Music
- **Q101-200:** Mathematics & Logic

### Part 5: Geography & Science (NEW)
- **Q1-100:** Geography & World Capitals
- **Q101-200:** Technology & Modern Science

---

## Verification

After running all 5 parts, you should have:

```sql
-- Should return 5 quiz entries
SELECT title, COUNT(id) as question_count 
FROM public.public_quizzes
LEFT JOIN public.public_quiz_questions USING (id)
GROUP BY title;
```

Expected output:
```
Pupil Enlightenment — General Knowledge           | 200
Pupil Enlightenment — Sports, Technology & Politics | 200
Pupil Enlightenment — Culture & Arts              | 200
Pupil Enlightenment — Advanced Knowledge          | 200
Pupil Enlightenment — Geography & Science         | 200
```

---

## Why Separate Quizzes?

✓ Each quiz can be used independently  
✓ No duplicate insertions into same quiz  
✓ Options display correctly for each quiz  
✓ Better organization by topic  
✓ Easier to manage and update  
✓ Each quiz appears as separate option in application  

---

## Next Steps

1. Delete the old Part 3, 4, 5 files
2. Rename the NEW files to remove "_NEW" suffix
3. Delete the cleanup script (no longer needed)
4. Run all 5 parts in order
5. Verify all 5 quizzes appear with 200 questions each

---

**Status:** ✅ Ready to Deploy  
**Total Quizzes:** 5  
**Total Questions:** 1000  
**Total Options:** 4000  

