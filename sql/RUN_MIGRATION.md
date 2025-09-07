# RUN_MIGRATION: add_pupils_class_id_and_backfill.sql

Recommended steps

1. Open the Supabase SQL Editor (or connect with psql / supabase CLI) and run the SQL file `sql/add_pupils_class_id_and_backfill.sql`.

   - If using psql locally, replace the placeholders with your connection values and run:

     psql "postgresql://username:password@host:5432/database" -f sql/add_pupils_class_id_and_backfill.sql

   - If using the Supabase SQL editor, copy-and-paste the file contents and execute.

2. Verify backfill results

   - Count pupils without class_id (should be 0 if all matched, otherwise review):
     SELECT COUNT(*) FROM pupils WHERE class_id IS NULL;

   - Inspect unmatched pupils to decide manual fixes:
     SELECT id, email, class FROM pupils WHERE class_id IS NULL LIMIT 100;

3. Verify FK constraint is in place

   - Check foreign key exists (Postgres):
     SELECT conname, conrelid::regclass AS table_from, confrelid::regclass AS table_to
     FROM pg_constraint
     WHERE contype = 'f' AND conrelid = 'pupils'::regclass;

4. Test trigger behaviour

   - Update a pupil's class_id and confirm the `class` text is synced by the trigger:
     UPDATE pupils SET class_id = (SELECT id FROM classes LIMIT 1) WHERE id = 'SOME_PUPIL_ID' RETURNING id, class_id, class;

5. Rollback plan (if needed)

   - If you need to revert quickly, you can drop the FK and column (be careful):
     ALTER TABLE pupils DROP CONSTRAINT IF EXISTS pupils_class_id_fkey;
     ALTER TABLE pupils DROP COLUMN IF EXISTS class_id;

Notes

- The migration script is designed to be additive and safe. It performs a backfill by matching `lower(pupils.class)` to `lower(classes.name)`.
- For any pupils that don't match, you'll need to either fix the `classes` data or update the pupils manually.
- Run these commands during low-traffic times if your app writes to the `pupils` table frequently.

If you want, I can also prepare a SQL-only migration file that is split into staged steps (add column, backfill, check, add FK) for safer manual rollout.
