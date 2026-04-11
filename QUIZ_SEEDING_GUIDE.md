# Quiz Seeding Guide - Primary School Categories

## Overview
Created 7 SQL migration files to seed the public quizzes system with educational content for primary school students (ages 8-12).

## Files Created

### 1. **20250411-add-difficulty-and-age-group-to-quizzes.sql**
- **Purpose**: Adds missing columns to the `public_quizzes` table
- **Changes**:
  - Adds `difficulty_level` column (values: 'easy', 'medium', 'hard')
  - Adds `age_group` column (values: '8-10', '10-12', '8-12', 'all')
  - Creates performance indices for filtering
- **Run this FIRST** before the quiz seed files

### 2. **20250411-seed-gk-quiz.sql** - General Knowledge Challenge
- **Difficulty**: Easy
- **Age Group**: 8-12
- **Questions**: 10 diverse general knowledge questions
- **Topics**: Geography, animals, nature, basics
- **Sample Q**: "What is the capital of France?"

### 3. **20250411-seed-math-quiz.sql** - Mathematics Mastery
- **Difficulty**: Easy
- **Age Group**: 8-12
- **Questions**: 10 math problems
- **Topics**: Arithmetic, geometry, percentages, time
- **Sample Q**: "What is 12 + 18?" and "What is the perimeter of a square with side 5cm?"

### 4. **20250411-seed-science-quiz.sql** - Science Explorer
- **Difficulty**: Easy
- **Age Group**: 8-12
- **Questions**: 10 science questions
- **Topics**: Biology, physics, basic science concepts
- **Sample Q**: "What do plants need to grow?" "How many bones does a human adult have?"

### 5. **20250411-seed-english-quiz.sql** - English Language Adventure
- **Difficulty**: Easy
- **Age Group**: 8-12
- **Questions**: 10 English/language arts questions
- **Topics**: Grammar, spelling, vocabulary, punctuation
- **Sample Q**: "Which word is spelled correctly?" "What is the plural of 'child'?"

### 6. **20250411-seed-history-quiz.sql** - History Legends
- **Difficulty**: Medium
- **Age Group**: 10-12
- **Questions**: 10 history questions
- **Topics**: Ancient civilizations, historical events, famous people
- **Sample Q**: "In which year did Columbus reach the Americas?" "Who was the first President of the US?"

### 7. **20250411-seed-geography-quiz.sql** - Geography Master
- **Difficulty**: Medium
- **Age Group**: 10-12
- **Questions**: 10 geography questions
- **Topics**: Capitals, rivers, mountains, countries
- **Sample Q**: "What is the capital of Japan?" "Which is the longest river in the world?"

## Running the Migrations

### Order:
1. First, run: `20250411-add-difficulty-and-age-group-to-quizzes.sql`
2. Then run all 6 quiz seed files in any order

### In Supabase:
```sql
-- Copy and paste each entire migration file into Supabase SQL editor, one at a time
-- Execute each file completely
```

## Data Structure

Each quiz contains:
- **Quiz Metadata**: title, description, difficulty_level, age_group, time_per_question, tags
- **Questions**: question_text, explanation, time_limit_seconds
- **Options**: option_text, is_correct flag, order_index

## Why Filters Weren't Working

The public quizzes page was looking for `difficulty_level` and `age_group` columns that didn't exist in the schema. Now that:
1. The columns are added via migration
2. Data is seeded with these values

The filters will work correctly!

## Filter Options

**Difficulty Levels**: Easy, Medium, Hard
**Age Groups**: 8-10, 10-12, 8-12, All

## Database Totals After Seeding

- **6 Quizzes** created
- **60 Questions** total (10 per quiz)
- **240 Answer Options** total (4 per question)
- All with explanations and time limits

## Next Steps

1. Apply the migration to add columns
2. Seed the quiz data
3. Test the filters on the public quizzes page
4. Results will show quizzes organized by difficulty and age group
5. Users can click "Take Quiz" to play using the WWTBAM game-show interface

---

**Note**: All questions are age-appropriate for primary school students (8-12 years old) with varying difficulty levels to match the learner's progress.
