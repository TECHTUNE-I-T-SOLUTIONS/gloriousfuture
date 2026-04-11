-- Seed Quiz Part 3: New Quiz Category - Culture & Arts (200 questions)
-- This creates a SEPARATE quiz with its own 200 questions and 800 options

DO $$
DECLARE
  v_quiz_id uuid;
BEGIN
  -- Try to get existing quiz
  SELECT id INTO v_quiz_id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — Culture & Arts' LIMIT 1;
  
  -- If not found, create it
  IF v_quiz_id IS NULL THEN
    INSERT INTO public.public_quizzes (title, description, created_at)
    VALUES (
      'Pupil Enlightenment — Culture & Arts',
      'Culture & Arts - 200 comprehensive questions on history, mythology, literature, music, and visual arts',
      NOW()
    )
    RETURNING id INTO v_quiz_id;
  END IF;

  -- EXTENDED HISTORY & CULTURE (Q1-100)
  WITH hist_cult AS (
    SELECT 1 AS qnum, 'What year did the Hundred Years War end?' AS qtext, 20 AS tim UNION ALL
    SELECT 2, 'Which religion was founded by Zoroaster?', 20 UNION ALL
    SELECT 3, 'What year was the printing revolution initiated?', 20 UNION ALL
    SELECT 4, 'Who was the founder of the Mongol Empire?', 20 UNION ALL
    SELECT 5, 'What year did the American Civil War end?', 20 UNION ALL
    SELECT 6, 'What year was the Declaration of Independence signed?', 20 UNION ALL
    SELECT 7, 'Who was the first female ruler of England?', 20 UNION ALL
    SELECT 8, 'Who founded the Ottoman Empire?', 20 UNION ALL
    SELECT 9, 'What year was the Peace of Westphalia?', 20 UNION ALL
    SELECT 10, 'What year was the Treaty of Versailles?', 20 UNION ALL
    SELECT 11, 'Who was Napoleon''s second wife?', 20 UNION ALL
    SELECT 12, 'What year was the Congress of Vienna?', 20 UNION ALL
    SELECT 13, 'What year did apartheid end in South Africa?', 20 UNION ALL
    SELECT 14, 'Who led the Russian October Revolution?', 20 UNION ALL
    SELECT 15, 'What year was the assassination of Archduke Franz Ferdinand?', 20 UNION ALL
    SELECT 16, 'What year was the launch of Sputnik?', 20 UNION ALL
    SELECT 17, 'What year was the Cuban Missile Crisis?', 20 UNION ALL
    SELECT 18, 'What year was the Moon landing?', 20 UNION ALL
    SELECT 19, 'What year did the Berlin Wall fall?', 20 UNION ALL
    SELECT 20, 'Who was the longest-reigning British monarch?', 20 UNION ALL
    SELECT 21, 'What year was the Glorious Revolution in England?', 20 UNION ALL
    SELECT 22, 'Who was the founder of Methodism?', 20 UNION ALL
    SELECT 23, 'Who founded Singapore?', 20 UNION ALL
    SELECT 24, 'What year was the Opium War?', 20 UNION ALL
    SELECT 25, 'Who was the founder of the Red Cross?', 20 UNION ALL
    SELECT 26, 'What year was the Boxer Rebellion?', 20 UNION ALL
    SELECT 27, 'Who was the founder of modern Turkey?', 20 UNION ALL
    SELECT 28, 'What year was the Indian Rebellion?', 20 UNION ALL
    SELECT 29, 'Who was Alfred the Great?', 20 UNION ALL
    SELECT 30, 'What year was the fall of Constantinople?', 20 UNION ALL
    SELECT 31, 'Who was the founder of Islam?', 20 UNION ALL
    SELECT 32, 'What year was the signing of Magna Carta?', 20 UNION ALL
    SELECT 33, 'Who was a famous Greek philosopher?', 20 UNION ALL
    SELECT 34, 'What is the oldest religion still practiced?', 20 UNION ALL
    SELECT 35, 'Who was a famous Roman orator?', 20 UNION ALL
    SELECT 36, 'What year did Renaissance begin?', 20 UNION ALL
    SELECT 37, 'Who was a famous medieval knight?', 20 UNION ALL
    SELECT 38, 'What year was the Stock Market Crash?', 20 UNION ALL
    SELECT 39, 'Who was a famous Viking explorer?', 20 UNION ALL
    SELECT 40, 'What year was Stonehenge built?', 20 UNION ALL
    SELECT 41, 'Who was an Egyptian pharaoh?', 20 UNION ALL
    SELECT 42, 'What year was the Spanish Inquisition?', 20 UNION ALL
    SELECT 43, 'Who was a famous Aztec ruler?', 20 UNION ALL
    SELECT 44, 'What year was the Salem Witch Hunt?', 20 UNION ALL
    SELECT 45, 'Who was a famous medieval king?', 20 UNION ALL
    SELECT 46, 'What year was the French Revolution?', 20 UNION ALL
    SELECT 47, 'Who spread Buddhism throughout Asia?', 20 UNION ALL
    SELECT 48, 'What year did slavery end in America?', 20 UNION ALL
    SELECT 49, 'Who was an early Christian martyr?', 20 UNION ALL
    SELECT 50, 'What year was the signing of Declaration of Human Rights?', 20 UNION ALL
    SELECT 51, 'What is mythology?', 20 UNION ALL
    SELECT 52, 'Who was the king of the Greek gods?', 20 UNION ALL
    SELECT 53, 'Who was the goddess of love in Greek mythology?', 20 UNION ALL
    SELECT 54, 'What is the home of the Greek gods?', 20 UNION ALL
    SELECT 55, 'Who was the god of war in Greek mythology?', 20 UNION ALL
    SELECT 56, 'Who was the god of the sea in Greek mythology?', 20 UNION ALL
    SELECT 57, 'What is the Roman name for the Greek god Zeus?', 20 UNION ALL
    SELECT 58, 'Who was the goddess of wisdom in Greek mythology?', 20 UNION ALL
    SELECT 59, 'Who were the Titans?', 20 UNION ALL
    SELECT 60, 'What is Ragnarok in Norse mythology?', 20 UNION ALL
    SELECT 61, 'Who is Odin in Norse mythology?', 20 UNION ALL
    SELECT 62, 'What is Valhalla?', 20 UNION ALL
    SELECT 63, 'Who killed Odin in Norse mythology?', 20 UNION ALL
    SELECT 64, 'What is the World Tree in Norse mythology?', 20 UNION ALL
    SELECT 65, 'Who is Loki in Norse mythology?', 20 UNION ALL
    SELECT 66, 'What is the underworld called in Greek mythology?', 20 UNION ALL
    SELECT 67, 'Who is the judge of the underworld?', 20 UNION ALL
    SELECT 68, 'Who was the most famous hero in Greek mythology?', 20 UNION ALL
    SELECT 69, 'What is the Trojan War?', 20 UNION ALL
    SELECT 70, 'Who was Achilles?', 20 UNION ALL
    SELECT 71, 'What is a labyrinth?', 20 UNION ALL
    SELECT 72, 'Who killed the Minotaur?', 20 UNION ALL
    SELECT 73, 'What is the story of Pandora''s Box?', 20 UNION ALL
    SELECT 74, 'Who was Prometheus?', 20 UNION ALL
    SELECT 75, 'What is the Golden Fleece?', 20 UNION ALL
    SELECT 76, 'Who went to find the Golden Fleece?', 20 UNION ALL
    SELECT 77, 'What is a siren in mythology?', 20 UNION ALL
    SELECT 78, 'Who were the Furies in Greek mythology?', 20 UNION ALL
    SELECT 79, 'What is a chimera?', 20 UNION ALL
    SELECT 80, 'What is a basilisk?', 20 UNION ALL
    SELECT 81, 'Who was the phoenix in mythology?', 20 UNION ALL
    SELECT 82, 'What is a dragon in mythology?', 20 UNION ALL
    SELECT 83, 'What is a hydra in Greek mythology?', 20 UNION ALL
    SELECT 84, 'Who was Medusa in Greek mythology?', 20 UNION ALL
    SELECT 85, 'What is Excalibur?', 20 UNION ALL
    SELECT 86, 'Who is King Arthur?', 20 UNION ALL
    SELECT 87, 'Who is Merlin?', 20 UNION ALL
    SELECT 88, 'What is Camelot?', 20 UNION ALL
    SELECT 89, 'Who is Lancelot?', 20 UNION ALL
    SELECT 90, 'Who is Guinevere?', 20 UNION ALL
    SELECT 91, 'What is the Holy Grail?', 20 UNION ALL
    SELECT 92, 'Who was Robin Hood?', 20 UNION ALL
    SELECT 93, 'What is Avalon in Arthurian legend?', 20 UNION ALL
    SELECT 94, 'Who was Beowulf?', 20 UNION ALL
    SELECT 95, 'Who was Grendel?', 20 UNION ALL
    SELECT 96, 'What is the Nibelungenlied?', 20 UNION ALL
    SELECT 97, 'Who was Sigurd in Norse mythology?', 20 UNION ALL
    SELECT 98, 'What is the Ring Cycle?', 20 UNION ALL
    SELECT 99, 'Who was Isolde?', 20 UNION ALL
    SELECT 100, 'What is the legend of Tristan and Isolde?', 20
  ),
  inserted_hist_cult AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM hist_cult
    RETURNING id, order_index
  ),
  hist_cult_opts AS (
    SELECT 
      ihc.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((ihc.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_hist_cult ihc
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM hist_cult_opts;

  -- LITERATURE & WRITERS (Q101-200)
  WITH lit_q AS (
    SELECT 101 AS qnum, 'Who wrote Pride and Prejudice?' AS qtext, 20 AS tim UNION ALL
    SELECT 102, 'Who wrote Wuthering Heights?', 20 UNION ALL
    SELECT 103, 'Who wrote Jane Eyre?', 20 UNION ALL
    SELECT 104, 'Who wrote The Great Gatsby?', 20 UNION ALL
    SELECT 105, 'Who wrote To Kill a Mockingbird?', 20 UNION ALL
    SELECT 106, 'Who wrote 1984?', 20 UNION ALL
    SELECT 107, 'Who wrote Animal Farm?', 20 UNION ALL
    SELECT 108, 'Who wrote Lord of the Flies?', 20 UNION ALL
    SELECT 109, 'Who wrote The Catcher in the Rye?', 20 UNION ALL
    SELECT 110, 'Who wrote Moby Dick?', 20 UNION ALL
    SELECT 111, 'Who wrote Jane Austen''s novels?', 20 UNION ALL
    SELECT 112, 'Who wrote Frankenstein?', 20 UNION ALL
    SELECT 113, 'Who wrote The Picture of Dorian Gray?', 20 UNION ALL
    SELECT 114, 'Who wrote The Scarlet Letter?', 20 UNION ALL
    SELECT 115, 'Who wrote Adventures of Huckleberry Finn?', 20 UNION ALL
    SELECT 116, 'Who wrote The Odyssey?', 20 UNION ALL
    SELECT 117, 'Who wrote The Iliad?', 20 UNION ALL
    SELECT 118, 'Who wrote Hamlet?', 20 UNION ALL
    SELECT 119, 'Who wrote Romeo and Juliet?', 20 UNION ALL
    SELECT 120, 'Who wrote Macbeth?', 20 UNION ALL
    SELECT 121, 'Who wrote The Brothers Karamazov?', 20 UNION ALL
    SELECT 122, 'Who wrote Crime and Punishment?', 20 UNION ALL
    SELECT 123, 'Who wrote War and Peace?', 20 UNION ALL
    SELECT 124, 'Who wrote Anna Karenina?', 20 UNION ALL
    SELECT 125, 'Who wrote The Idiot?', 20 UNION ALL
    SELECT 126, 'Who wrote Bleak House?', 20 UNION ALL
    SELECT 127, 'Who wrote David Copperfield?', 20 UNION ALL
    SELECT 128, 'Who wrote Oliver Twist?', 20 UNION ALL
    SELECT 129, 'Who wrote Great Expectations?', 20 UNION ALL
    SELECT 130, 'Who wrote Nicholas Nickleby?', 20 UNION ALL
    SELECT 131, 'Who wrote Les Misérables?', 20 UNION ALL
    SELECT 132, 'Who wrote The Hunchback of Notre-Dame?', 20 UNION ALL
    SELECT 133, 'Who wrote The Three Musketeers?', 20 UNION ALL
    SELECT 134, 'Who wrote The Count of Monte Cristo?', 20 UNION ALL
    SELECT 135, 'Who wrote The Man in the Iron Mask?', 20 UNION ALL
    SELECT 136, 'Who wrote Treasure Island?', 20 UNION ALL
    SELECT 137, 'Who wrote Kidnapped?', 20 UNION ALL
    SELECT 138, 'Who wrote The Strange Case of Dr. Jekyll and Mr. Hyde?', 20 UNION ALL
    SELECT 139, 'Who wrote A Tale of Two Cities?', 20 UNION ALL
    SELECT 140, 'Who wrote Vanity Fair?', 20 UNION ALL
    SELECT 141, 'Who wrote Jane Eyre?', 20 UNION ALL
    SELECT 142, 'Who wrote Middlemarch?', 20 UNION ALL
    SELECT 143, 'Who wrote Silas Marner?', 20 UNION ALL
    SELECT 144, 'Who wrote The Mill on the Floss?', 20 UNION ALL
    SELECT 145, 'Who wrote Tess of the d''Urbervilles?', 20 UNION ALL
    SELECT 146, 'Who wrote Jude the Obscure?', 20 UNION ALL
    SELECT 147, 'Who wrote Far from the Madding Crowd?', 20 UNION ALL
    SELECT 148, 'Who wrote The Mayor of Casterbridge?', 20 UNION ALL
    SELECT 149, 'Who wrote Don Quixote?', 20 UNION ALL
    SELECT 150, 'Who wrote Gulliver''s Travels?', 20 UNION ALL
    SELECT 151, 'Who wrote Robinson Crusoe?', 20 UNION ALL
    SELECT 152, 'Who wrote Pamela?', 20 UNION ALL
    SELECT 153, 'Who wrote Clarissa?', 20 UNION ALL
    SELECT 154, 'Who wrote Tom Jones?', 20 UNION ALL
    SELECT 155, 'Who wrote Tristram Shandy?', 20 UNION ALL
    SELECT 156, 'Who wrote The Vicar of Wakefield?', 20 UNION ALL
    SELECT 157, 'Who wrote Evelina?', 20 UNION ALL
    SELECT 158, 'Who wrote Cecilia?', 20 UNION ALL
    SELECT 159, 'Who wrote Camilla?', 20 UNION ALL
    SELECT 160, 'Who wrote The Mysteries of Udolpho?', 20 UNION ALL
    SELECT 161, 'Who wrote The Italian?', 20 UNION ALL
    SELECT 162, 'Who wrote Northanger Abbey?', 20 UNION ALL
    SELECT 163, 'Who wrote Sense and Sensibility?', 20 UNION ALL
    SELECT 164, 'Who wrote Emma?', 20 UNION ALL
    SELECT 165, 'Who wrote The Tenant of Wildfell Hall?', 20 UNION ALL
    SELECT 166, 'Who wrote The Shadow of the Wind?', 20 UNION ALL
    SELECT 167, 'Who wrote One Hundred Years of Solitude?', 20 UNION ALL
    SELECT 168, 'Who wrote Love in the Time of Cholera?', 20 UNION ALL
    SELECT 169, 'Who wrote The Autumn of the Patriarch?', 20 UNION ALL
    SELECT 170, 'Who wrote Chronicle of a Death Foretold?', 20 UNION ALL
    SELECT 171, 'Who wrote Things Fall Apart?', 20 UNION ALL
    SELECT 172, 'Who wrote No Longer at Ease?', 20 UNION ALL
    SELECT 173, 'Who wrote Arrow of God?', 20 UNION ALL
    SELECT 174, 'Who wrote A Man of the People?', 20 UNION ALL
    SELECT 175, 'Who wrote Half of a Yellow Sun?', 20 UNION ALL
    SELECT 176, 'Who wrote Americanah?', 20 UNION ALL
    SELECT 177, 'Who wrote Beloved?', 20 UNION ALL
    SELECT 178, 'Who wrote The Bluest Eye?', 20 UNION ALL
    SELECT 179, 'Who wrote Song of Solomon?', 20 UNION ALL
    SELECT 180, 'Who wrote Sula?', 20 UNION ALL
    SELECT 181, 'Who wrote Purple Hibiscus?', 20 UNION ALL
    SELECT 182, 'Who wrote The Poisonwood Bible?', 20 UNION ALL
    SELECT 183, 'Who wrote The Kite Runner?', 20 UNION ALL
    SELECT 184, 'Who wrote Persepolis?', 20 UNION ALL
    SELECT 185, 'Who wrote In The Time of the Butterflies?', 20 UNION ALL
    SELECT 186, 'Who wrote The Handmaid''s Tale?', 20 UNION ALL
    SELECT 187, 'Who wrote Oryx and Crake?', 20 UNION ALL
    SELECT 188, 'Who wrote The Remains of the Day?', 20 UNION ALL
    SELECT 189, 'Who wrote Never Let Me Go?', 20 UNION ALL
    SELECT 190, 'Who wrote A Pale View of the Hills?', 20 UNION ALL
    SELECT 191, 'Who wrote The Buried Giant?', 20 UNION ALL
    SELECT 192, 'Who wrote Sputnik Sweetheart?', 20 UNION ALL
    SELECT 193, 'Who wrote Norwegian Wood?', 20 UNION ALL
    SELECT 194, 'Who wrote Kafka on the Shore?', 20 UNION ALL
    SELECT 195, 'Who wrote 1Q84?', 20 UNION ALL
    SELECT 196, 'Who wrote The Wind-Up Bird Chronicle?', 20 UNION ALL
    SELECT 197, 'Who wrote Dance Dance Dance?', 20 UNION ALL
    SELECT 198, 'Who wrote Hard-Boiled Wonderland and the End of the World?', 20 UNION ALL
    SELECT 199, 'Who is considered the greatest playwright of all time?', 20 UNION ALL
    SELECT 200, 'Who wrote the first novel?', 20
  ),
  inserted_lit AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM lit_q
    RETURNING id, order_index
  ),
  lit_opts AS (
    SELECT 
      il.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((il.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_lit il
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM lit_opts;

  RAISE NOTICE 'Part 3 complete: 200 questions with 800 options inserted into "Pupil Enlightenment — Culture & Arts"!';
END $$;
