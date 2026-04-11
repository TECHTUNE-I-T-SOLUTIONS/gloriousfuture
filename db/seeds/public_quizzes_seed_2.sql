-- Seed: Additional Public Quizzes with Large Question Sets
-- Creates multiple quizzes with expanded content for different subjects
-- Teacher ID: 96d05685-9e57-4697-a1fc-f7fc98471a07

DO $$
DECLARE
  teacher_id uuid := '96d05685-9e57-4697-a1fc-f7fc98471a07'::uuid;
  quiz_id_science uuid;
  quiz_id_history uuid;
  quiz_id_geography uuid;
  quiz_id_english uuid;
  question_id uuid;
  i integer;
  total_target integer := 500;
  curated_count integer := 0;
  filler_count integer;
BEGIN

  -- ==================== SCIENCE QUIZ ====================
  INSERT INTO public.public_quizzes (
    teacher_id, title, description, is_published, is_public,
    time_per_question, tags, difficulty, thumbnail_url
  ) VALUES (
    teacher_id,
    'General Science Challenge',
    'Test your knowledge of physics, chemistry, biology, and earth sciences.',
    true, true, 20,
    ARRAY['science', 'physics', 'chemistry', 'biology'],
    'intermediate',
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300&fit=crop'
  ) RETURNING id INTO quiz_id_science;

  -- Science curated questions
  INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index) VALUES
    (quiz_id_science, 'What is the chemical formula for water?', 1),
    (quiz_id_science, 'Which planet is known as the Red Planet?', 2),
    (quiz_id_science, 'What is the speed of light?', 3),
    (quiz_id_science, 'How many bones are in an adult human body?', 4),
    (quiz_id_science, 'What process do plants use to make food?', 5),
    (quiz_id_science, 'What is the largest organ in the human body?', 6),
    (quiz_id_science, 'What is the atomic number of Carbon?', 7),
    (quiz_id_science, 'Which gas do plants absorb from the atmosphere?', 8),
    (quiz_id_science, 'What is the SI unit of force?', 9),
    (quiz_id_science, 'What is the most abundant element in the universe?', 10)
  RETURNING id INTO question_id;
  curated_count := 10;

  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT q.id, opt.text, opt.correct, row_number() OVER (ORDER BY RANDOM())
  FROM public.public_quiz_questions q
  CROSS JOIN (
    VALUES
      ('H2O', true), ('CO2', false), ('H2SO4', false), ('NaCl', false),
      ('Mars', true), ('Venus', false), ('Mercury', false), ('Jupiter', false),
      ('300,000 km/s', true), ('150,000 km/s', false), ('500,000 km/s', false), ('100,000 km/s', false),
      ('206 bones', true), ('186 bones', false), ('256 bones', false), ('146 bones', false),
      ('Photosynthesis', true), ('Respiration', false), ('Fermentation', false), ('Digestion', false),
      ('Skin', true), ('Heart', false), ('Brain', false), ('Liver', false),
      ('6', true), ('8', false), ('12', false), ('4', false),
      ('Carbon dioxide', true), ('Oxygen', false), ('Nitrogen', false), ('Hydrogen', false),
      ('Newton (N)', true), ('Joule (J)', false), ('Watt (W)', false), ('Pascal (Pa)', false),
      ('Hydrogen', true), ('Helium', false), ('Carbon', false), ('Oxygen', false)
  ) opt(text, correct)
  WHERE q.quiz_id = quiz_id_science AND q.order_index <= 10;

  -- Auto-generate filler questions for Science
  filler_count := total_target - curated_count;
  FOR i IN 1..filler_count LOOP
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index)
    VALUES (
      quiz_id_science,
      'Science Question ' || (curated_count + i) || ': Which of the following is correct?',
      curated_count + i
    ) RETURNING id INTO question_id;

    INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
    VALUES
      (question_id, 'Option A (Correct)', true, 1),
      (question_id, 'Option B', false, 2),
      (question_id, 'Option C', false, 3),
      (question_id, 'Option D', false, 4);
  END LOOP;

  UPDATE public.public_quizzes SET total_questions = total_target WHERE id = quiz_id_science;

  -- ==================== HISTORY QUIZ ====================
  INSERT INTO public.public_quizzes (
    teacher_id, title, description, is_published, is_public,
    time_per_question, tags, difficulty, thumbnail_url
  ) VALUES (
    teacher_id,
    'World History Mastery',
    'Explore major events, civilizations, and figures that shaped our world.',
    true, true, 25,
    ARRAY['history', 'world', 'civilization'],
    'intermediate',
    'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=300&fit=crop'
  ) RETURNING id INTO quiz_id_history;

  -- History curated questions
  INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index) VALUES
    (quiz_id_history, 'In what year did World War II end?', 1),
    (quiz_id_history, 'Who was the first President of the United States?', 2),
    (quiz_id_history, 'Which ancient wonder of the world still stands?', 3),
    (quiz_id_history, 'What year did the Titanic sink?', 4),
    (quiz_id_history, 'Who wrote the Declaration of Independence?', 5),
    (quiz_id_history, 'In what year did the Berlin Wall fall?', 6),
    (quiz_id_history, 'Which empire built Machu Picchu?', 7),
    (quiz_id_history, 'Who was the first woman to fly across the Atlantic?', 8),
    (quiz_id_history, 'In what year did Neil Armstrong land on the moon?', 9),
    (quiz_id_history, 'Which civilization invented writing?', 10),
    (quiz_id_history, 'Who discovered America in 1492?', 11),
    (quiz_id_history, 'What year did the American Civil War begin?', 12),
    (quiz_id_history, 'Which empire was ruled by Julius Caesar?', 13),
    (quiz_id_history, 'In what year did the Ottoman Empire fall?', 14),
    (quiz_id_history, 'Who was the first Emperor of Russia?', 15)
  RETURNING id INTO question_id;
  curated_count := 15;

  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT q.id, opt.text, opt.correct, row_number() OVER (ORDER BY RANDOM())
  FROM public.public_quiz_questions q
  CROSS JOIN (
    VALUES
      ('1945', true), ('1943', false), ('1947', false), ('1944', false),
      ('George Washington', true), ('Thomas Jefferson', false), ('Benjamin Franklin', false), ('James Madison', false),
      ('Great Pyramid of Giza', true), ('Colosseum', false), ('Statue of Zeus', false), ('Hanging Gardens', false),
      ('1912', true), ('1905', false), ('1920', false), ('1898', false),
      ('Thomas Jefferson', true), ('Benjamin Franklin', false), ('George Washington', false), ('John Adams', false),
      ('1989', true), ('1987', false), ('1991', false), ('1985', false),
      ('Incan Empire', true), ('Aztec Empire', false), ('Maya Civilization', false), ('Sican Culture', false),
      ('Amelia Earhart', true), ('Jacqueline Cochran', false), ('Amy Johnson', false), ('Harriet Quimby', false),
      ('1969', true), ('1967', false), ('1971', false), ('1965', false),
      ('Sumerian', true), ('Egyptian', false), ('Chinese', false), ('Indus Valley', false),
      ('Christopher Columbus', true), ('Leif Erikson', false), ('Ferdinand Magellan', false), ('Vasco da Gama', false),
      ('1861', true), ('1859', false), ('1863', false), ('1865', false),
      ('Roman Empire', true), ('Byzantine Empire', false), ('Macedonian Empire', false), ('Persian Empire', false),
      ('1922', true), ('1918', false), ('1926', false), ('1924', false),
      ('Peter the Great', true), ('Ivan the Terrible', false), ('Catherine the Great', false), ('Nicholas II', false)
  ) opt(text, correct)
  WHERE q.quiz_id = quiz_id_history AND q.order_index <= 15;

  -- Auto-generate filler questions for History
  filler_count := total_target - curated_count;
  FOR i IN 1..filler_count LOOP
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index)
    VALUES (
      quiz_id_history,
      'History Question ' || (curated_count + i) || ': Which statement is historically accurate?',
      curated_count + i
    ) RETURNING id INTO question_id;

    INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
    VALUES
      (question_id, 'Statement A (Verified)', true, 1),
      (question_id, 'Statement B', false, 2),
      (question_id, 'Statement C', false, 3),
      (question_id, 'Statement D', false, 4);
  END LOOP;

  UPDATE public.public_quizzes SET total_questions = total_target WHERE id = quiz_id_history;

  -- ==================== GEOGRAPHY QUIZ ====================
  INSERT INTO public.public_quizzes (
    teacher_id, title, description, is_published, is_public,
    time_per_question, tags, difficulty, thumbnail_url
  ) VALUES (
    teacher_id,
    'Global Geography Quest',
    'Discover capitals, landmarks, and geographical features around the world.',
    true, true, 20,
    ARRAY['geography', 'countries', 'capitals', 'landmarks'],
    'beginner',
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop'
  ) RETURNING id INTO quiz_id_geography;

  -- Geography curated questions
  INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index) VALUES
    (quiz_id_geography, 'What is the capital of France?', 1),
    (quiz_id_geography, 'Which is the largest country by area?', 2),
    (quiz_id_geography, 'What is the capital of Japan?', 3),
    (quiz_id_geography, 'How many continents are there?', 4),
    (quiz_id_geography, 'Which is the longest river in the world?', 5),
    (quiz_id_geography, 'What is the capital of Australia?', 6),
    (quiz_id_geography, 'Which is the smallest country in the world?', 7),
    (quiz_id_geography, 'What is the highest mountain in the world?', 8),
    (quiz_id_geography, 'Which is the largest desert in the world?', 9),
    (quiz_id_geography, 'What is the capital of Brazil?', 10),
    (quiz_id_geography, 'Which country has the most islands?', 11),
    (quiz_id_geography, 'What is the deepest ocean trench?', 12)
  RETURNING id INTO question_id;
  curated_count := 12;

  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT q.id, opt.text, opt.correct, row_number() OVER (ORDER BY RANDOM())
  FROM public.public_quiz_questions q
  CROSS JOIN (
    VALUES
      ('Paris', true), ('Lyon', false), ('Marseille', false), ('Nice', false),
      ('Russia', true), ('Canada', false), ('USA', false), ('China', false),
      ('Tokyo', true), ('Osaka', false), ('Kyoto', false), ('Yokohama', false),
      ('7', true), ('6', false), ('8', false), ('5', false),
      ('Nile River', true), ('Amazon', false), ('Yangtze', false), ('Mississippi', false),
      ('Canberra', true), ('Sydney', false), ('Melbourne', false), ('Brisbane', false),
      ('Vatican City', true), ('Monaco', false), ('Liechtenstein', false), ('San Marino', false),
      ('Mount Everest', true), ('K2', false), ('Kangchenjunga', false), ('Lhotse', false),
      ('Sahara', true), ('Arabian', false), ('Gobi', false), ('Kalahari', false),
      ('Brasília', true), ('Rio de Janeiro', false), ('São Paulo', false), ('Salvador', false),
      ('Sweden', true), ('Norway', false), ('Canada', false), ('Indonesia', false),
      ('Mariana Trench', true), ('Tonga Trench', false), ('Kuril Trench', false), ('Philippine Trench', false)
  ) opt(text, correct)
  WHERE q.quiz_id = quiz_id_geography AND q.order_index <= 12;

  -- Auto-generate filler questions for Geography
  filler_count := total_target - curated_count;
  FOR i IN 1..filler_count LOOP
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index)
    VALUES (
      quiz_id_geography,
      'Geography Question ' || (curated_count + i) || ': Select the correct geographical fact.',
      curated_count + i
    ) RETURNING id INTO question_id;

    INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
    VALUES
      (question_id, 'Fact A', true, 1),
      (question_id, 'Fact B', false, 2),
      (question_id, 'Fact C', false, 3),
      (question_id, 'Fact D', false, 4);
  END LOOP;

  UPDATE public.public_quizzes SET total_questions = total_target WHERE id = quiz_id_geography;

  -- ==================== ENGLISH LANGUAGE QUIZ ====================
  INSERT INTO public.public_quizzes (
    teacher_id, title, description, is_published, is_public,
    time_per_question, tags, difficulty, thumbnail_url
  ) VALUES (
    teacher_id,
    'English Language Excellence',
    'Master grammar, vocabulary, and literature with comprehensive questions.',
    true, true, 25,
    ARRAY['english', 'grammar', 'vocabulary', 'literature'],
    'intermediate',
    'https://images.unsplash.com/photo-150784272343-583f20270319?w=400&h=300&fit=crop'
  ) RETURNING id INTO quiz_id_english;

  -- English curated questions
  INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index) VALUES
    (quiz_id_english, 'What is the opposite of "benevolent"?', 1),
    (quiz_id_english, 'Which word is spelled correctly?', 2),
    (quiz_id_english, 'What does "pragmatic" mean?', 3),
    (quiz_id_english, 'Choose the sentence with correct grammar.', 4),
    (quiz_id_english, 'What is a synonym for "ephemeral"?', 5),
    (quiz_id_english, 'Who wrote "Pride and Prejudice"?', 6),
    (quiz_id_english, 'What is an oxymoron?', 7),
    (quiz_id_english, 'Which is the correct plural of "phenomenon"?', 8),
    (quiz_id_english, 'What does "ubiquitous" mean?', 9),
    (quiz_id_english, 'Who wrote "1984"?', 10),
    (quiz_id_english, 'What is a metaphor?', 11),
    (quiz_id_english, 'Choose the correctly spelled word.', 12),
    (quiz_id_english, 'What is an antonym for "verbose"?', 13),
    (quiz_id_english, 'Who wrote "To Kill a Mockingbird"?', 14),
    (quiz_id_english, 'What does "meticulous" mean?', 15)
  RETURNING id INTO question_id;
  curated_count := 15;

  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT q.id, opt.text, opt.correct, row_number() OVER (ORDER BY RANDOM())
  FROM public.public_quiz_questions q
  CROSS JOIN (
    VALUES
      ('Malevolent', true), ('Grateful', false), ('Kind', false), ('Generous', false),
      ('Accommodate', true), ('Accomodate', false), ('Acomodate', false), ('Acommodate', false),
      ('Practical and sensible', true), ('Theoretical', false), ('Impractical', false), ('Abstract', false),
      ('He go to school', false), ('He goes to school', true), ('He going to school', false), ('He gone to school', false),
      ('Fleeting', true), ('Permanent', false), ('Solid', false), ('Eternal', false),
      ('Jane Austen', true), ('Charlotte Brontë', false), ('Jane Brontë', false), ('Emily Dickinson', false),
      ('A combination of contradictory words', true), ('A metaphor', false), ('A simile', false), ('Personification', false),
      ('Phenomena', true), ('Phenomenons', false), ('Phenomenas', false), ('Phenomenae', false),
      ('Found everywhere', true), ('Rare', false), ('Hidden', false), ('Unique', false),
      ('George Orwell', true), ('Aldous Huxley', false), ('Ray Bradbury', false), ('Kurt Vonnegut', false),
      ('A comparison between two unlike things using "is" or "was"', true), ('A comparison using "like" or "as"', false), ('A repetition of words', false), ('A specific example', false),
      ('Conscientious', true), ('Conchientious', false), ('Conshientious', false), ('Consceintious', false),
      ('Concise', true), ('Detailed', false), ('Long-winded', false), ('Elaborate', false),
      ('Harper Lee', true), ('Maya Angelou', false), ('Alice Walker', false), ('Toni Morrison', false),
      ('Extreme attention to detail', true), ('Lazy', false), ('Careless', false), ('Forgetful', false)
  ) opt(text, correct)
  WHERE q.quiz_id = quiz_id_english AND q.order_index <= 15;

  -- Auto-generate filler questions for English
  filler_count := total_target - curated_count;
  FOR i IN 1..filler_count LOOP
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index)
    VALUES (
      quiz_id_english,
      'English Question ' || (curated_count + i) || ': Which option is correct?',
      curated_count + i
    ) RETURNING id INTO question_id;

    INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
    VALUES
      (question_id, 'Answer A (Correct)', true, 1),
      (question_id, 'Answer B', false, 2),
      (question_id, 'Answer C', false, 3),
      (question_id, 'Answer D', false, 4);
  END LOOP;

  UPDATE public.public_quizzes SET total_questions = total_target WHERE id = quiz_id_english;

  RAISE NOTICE 'Successfully seeded 4 new quizzes with % questions each', total_target;

END $$;
