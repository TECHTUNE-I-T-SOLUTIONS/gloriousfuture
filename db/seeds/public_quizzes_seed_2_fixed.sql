-- Seed: Additional Public Quizzes with Large Question Sets
-- Creates multiple quizzes with expanded content for different subjects
-- Teacher ID: 96d05685-9e57-4697-a1fc-f7fc98471a07
-- Fixed: Proper INSERT statements with correct RETURNING handling

DO $$
DECLARE
  teacher_id uuid := '96d05685-9e57-4697-a1fc-f7fc98471a07'::uuid;
  quiz_id_science uuid;
  quiz_id_history uuid;
  quiz_id_geography uuid;
  quiz_id_english uuid;
  quiz_id_math uuid;
  total_target integer := 300;
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
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300'
  ) RETURNING id INTO quiz_id_science;

  -- Science questions and options
  WITH science_questions AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index)
    VALUES
      (quiz_id_science, 'What is the chemical formula for water?', 1),
      (quiz_id_science, 'Which planet is known as the Red Planet?', 2),
      (quiz_id_science, 'What is the speed of light?', 3),
      (quiz_id_science, 'How many bones are in an adult human body?', 4),
      (quiz_id_science, 'What process do plants use to make food?', 5),
      (quiz_id_science, 'What is the largest organ in the human body?', 6),
      (quiz_id_science, 'What is the atomic number of Carbon?', 7),
      (quiz_id_science, 'Which gas do plants absorb from the atmosphere?', 8),
      (quiz_id_science, 'What is the SI unit of force?', 9),
      (quiz_id_science, 'What is the most abundant element in the universe?', 10),
      (quiz_id_science, 'How many chambers does a human heart have?', 11),
      (quiz_id_science, 'What is the process by which water turns into gas?', 12),
      (quiz_id_science, 'Which element has the symbol Au?', 13),
      (quiz_id_science, 'What is the powerhouse of the cell?', 14),
      (quiz_id_science, 'How many sides does a DNA helix have?', 15),
      (quiz_id_science, 'What is the normal body temperature in Celsius?', 16),
      (quiz_id_science, 'Which organelle is responsible for protein synthesis?', 17),
      (quiz_id_science, 'What type of animal is a dolphin?', 18),
      (quiz_id_science, 'How many legs does an insect have?', 19),
      (quiz_id_science, 'What is the SI unit of temperature?', 20)
    RETURNING id, order_index
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT 
    sq.id,
    opt.text,
    opt.correct,
    opt.opt_idx
  FROM science_questions sq
  CROSS JOIN (
    VALUES
      (1, 'H2O', true, 1), (1, 'CO2', false, 2), (1, 'H2SO4', false, 3), (1, 'NaCl', false, 4),
      (2, 'Mars', true, 1), (2, 'Venus', false, 2), (2, 'Mercury', false, 3), (2, 'Jupiter', false, 4),
      (3, '300,000 km/s', true, 1), (3, '150,000 km/s', false, 2), (3, '500,000 km/s', false, 3), (3, '100,000 km/s', false, 4),
      (4, '206 bones', true, 1), (4, '186 bones', false, 2), (4, '256 bones', false, 3), (4, '146 bones', false, 4),
      (5, 'Photosynthesis', true, 1), (5, 'Respiration', false, 2), (5, 'Fermentation', false, 3), (5, 'Digestion', false, 4),
      (6, 'Skin', true, 1), (6, 'Heart', false, 2), (6, 'Brain', false, 3), (6, 'Liver', false, 4),
      (7, '6', true, 1), (7, '8', false, 2), (7, '12', false, 3), (7, '4', false, 4),
      (8, 'Carbon dioxide', true, 1), (8, 'Oxygen', false, 2), (8, 'Nitrogen', false, 3), (8, 'Hydrogen', false, 4),
      (9, 'Newton (N)', true, 1), (9, 'Joule (J)', false, 2), (9, 'Watt (W)', false, 3), (9, 'Pascal (Pa)', false, 4),
      (10, 'Hydrogen', true, 1), (10, 'Helium', false, 2), (10, 'Carbon', false, 3), (10, 'Oxygen', false, 4),
      (11, '4', true, 1), (11, '2', false, 2), (11, '6', false, 3), (11, '8', false, 4),
      (12, 'Evaporation', true, 1), (12, 'Condensation', false, 2), (12, 'Sublimation', false, 3), (12, 'Freezing', false, 4),
      (13, 'Gold', true, 1), (13, 'Silver', false, 2), (13, 'Copper', false, 3), (13, 'Aluminum', false, 4),
      (14, 'Mitochondria', true, 1), (14, 'Nucleus', false, 2), (14, 'Ribosome', false, 3), (14, 'Vacuole', false, 4),
      (15, '2', true, 1), (15, '4', false, 2), (15, '1', false, 3), (15, '3', false, 4),
      (16, '37', true, 1), (16, '35', false, 2), (16, '40', false, 3), (16, '32', false, 4),
      (17, 'Ribosome', true, 1), (17, 'Mitochondria', false, 2), (17, 'Golgi Apparatus', false, 3), (17, 'Lysosomes', false, 4),
      (18, 'Mammal', true, 1), (18, 'Fish', false, 2), (18, 'Amphibian', false, 3), (18, 'Reptile', false, 4),
      (19, '6', true, 1), (19, '8', false, 2), (19, '4', false, 3), (19, '10', false, 4),
      (20, 'Kelvin (K)', true, 1), (20, 'Celsius (C)', false, 2), (20, 'Fahrenheit (F)', false, 3), (20, 'Rankine (R)', false, 4)
  ) opt(q_idx, text, correct, opt_idx)
  WHERE sq.order_index = opt.q_idx;

  UPDATE public.public_quizzes SET total_questions = 20 WHERE id = quiz_id_science;

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
    'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=300'
  ) RETURNING id INTO quiz_id_history;

  WITH history_questions AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index)
    VALUES
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
      (quiz_id_history, 'Who was the first Emperor of Russia?', 15),
      (quiz_id_history, 'In what year did the French Revolution begin?', 16),
      (quiz_id_history, 'Who was Napoleon Bonaparte?', 17),
      (quiz_id_history, 'What year did the Spanish Armada sail?', 18),
      (quiz_id_history, 'Who founded the Roman Empire?', 19),
      (quiz_id_history, 'In what year did the Renaissance begin?', 20)
    RETURNING id, order_index
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT 
    hq.id,
    opt.text,
    opt.correct,
    opt.opt_idx
  FROM history_questions hq
  CROSS JOIN (
    VALUES
      (1, '1945', true, 1), (1, '1943', false, 2), (1, '1947', false, 3), (1, '1944', false, 4),
      (2, 'George Washington', true, 1), (2, 'Thomas Jefferson', false, 2), (2, 'Benjamin Franklin', false, 3), (2, 'James Madison', false, 4),
      (3, 'Great Pyramid of Giza', true, 1), (3, 'Colosseum', false, 2), (3, 'Statue of Zeus', false, 3), (3, 'Hanging Gardens', false, 4),
      (4, '1912', true, 1), (4, '1905', false, 2), (4, '1920', false, 3), (4, '1898', false, 4),
      (5, 'Thomas Jefferson', true, 1), (5, 'Benjamin Franklin', false, 2), (5, 'George Washington', false, 3), (5, 'John Adams', false, 4),
      (6, '1989', true, 1), (6, '1987', false, 2), (6, '1991', false, 3), (6, '1985', false, 4),
      (7, 'Incan Empire', true, 1), (7, 'Aztec Empire', false, 2), (7, 'Maya Civilization', false, 3), (7, 'Sican Culture', false, 4),
      (8, 'Amelia Earhart', true, 1), (8, 'Jacqueline Cochran', false, 2), (8, 'Amy Johnson', false, 3), (8, 'Harriet Quimby', false, 4),
      (9, '1969', true, 1), (9, '1967', false, 2), (9, '1971', false, 3), (9, '1965', false, 4),
      (10, 'Sumerian', true, 1), (10, 'Egyptian', false, 2), (10, 'Chinese', false, 3), (10, 'Indus Valley', false, 4),
      (11, 'Christopher Columbus', true, 1), (11, 'Leif Erikson', false, 2), (11, 'Ferdinand Magellan', false, 3), (11, 'Vasco da Gama', false, 4),
      (12, '1861', true, 1), (12, '1859', false, 2), (12, '1863', false, 3), (12, '1865', false, 4),
      (13, 'Roman Empire', true, 1), (13, 'Byzantine Empire', false, 2), (13, 'Macedonian Empire', false, 3), (13, 'Persian Empire', false, 4),
      (14, '1922', true, 1), (14, '1918', false, 2), (14, '1926', false, 3), (14, '1924', false, 4),
      (15, 'Peter the Great', true, 1), (15, 'Ivan the Terrible', false, 2), (15, 'Catherine the Great', false, 3), (15, 'Nicholas II', false, 4),
      (16, '1789', true, 1), (16, '1787', false, 2), (16, '1792', false, 3), (16, '1794', false, 4),
      (17, 'French military leader', true, 1), (17, 'Russian Tsar', false, 2), (17, 'English King', false, 3), (17, 'German Chancellor', false, 4),
      (18, '1588', true, 1), (18, '1590', false, 2), (18, '1585', false, 3), (18, '1600', false, 4),
      (19, 'Augustus Caesar', true, 1), (19, 'Julius Caesar', false, 2), (19, 'Pompey', false, 3), (19, 'Nero', false, 4),
      (20, '14th century', true, 1), (20, '13th century', false, 2), (20, '15th century', false, 3), (20, '16th century', false, 4)
  ) opt(q_idx, text, correct, opt_idx)
  WHERE hq.order_index = opt.q_idx;

  UPDATE public.public_quizzes SET total_questions = 20 WHERE id = quiz_id_history;

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
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300'
  ) RETURNING id INTO quiz_id_geography;

  WITH geography_questions AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index)
    VALUES
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
      (quiz_id_geography, 'What is the deepest ocean trench?', 12),
      (quiz_id_geography, 'What is the capital of Canada?', 13),
      (quiz_id_geography, 'Which is the largest ocean?', 14),
      (quiz_id_geography, 'What is the capital of India?', 15),
      (quiz_id_geography, 'Which desert is the second largest?', 16),
      (quiz_id_geography, 'What is the capital of Egypt?', 17),
      (quiz_id_geography, 'Which country is Kilimanjaro in?', 18),
      (quiz_id_geography, 'What is the capital of South Africa?', 19),
      (quiz_id_geography, 'How many countries are in Europe?', 20)
    RETURNING id, order_index
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT 
    gq.id,
    opt.text,
    opt.correct,
    opt.opt_idx
  FROM geography_questions gq
  CROSS JOIN (
    VALUES
      (1, 'Paris', true, 1), (1, 'Lyon', false, 2), (1, 'Marseille', false, 3), (1, 'Nice', false, 4),
      (2, 'Russia', true, 1), (2, 'Canada', false, 2), (2, 'USA', false, 3), (2, 'China', false, 4),
      (3, 'Tokyo', true, 1), (3, 'Osaka', false, 2), (3, 'Kyoto', false, 3), (3, 'Yokohama', false, 4),
      (4, '7', true, 1), (4, '6', false, 2), (4, '8', false, 3), (4, '5', false, 4),
      (5, 'Nile River', true, 1), (5, 'Amazon', false, 2), (5, 'Yangtze', false, 3), (5, 'Mississippi', false, 4),
      (6, 'Canberra', true, 1), (6, 'Sydney', false, 2), (6, 'Melbourne', false, 3), (6, 'Brisbane', false, 4),
      (7, 'Vatican City', true, 1), (7, 'Monaco', false, 2), (7, 'Liechtenstein', false, 3), (7, 'San Marino', false, 4),
      (8, 'Mount Everest', true, 1), (8, 'K2', false, 2), (8, 'Kangchenjunga', false, 3), (8, 'Lhotse', false, 4),
      (9, 'Sahara', true, 1), (9, 'Arabian', false, 2), (9, 'Gobi', false, 3), (9, 'Kalahari', false, 4),
      (10, 'Brasília', true, 1), (10, 'Rio de Janeiro', false, 2), (10, 'São Paulo', false, 3), (10, 'Salvador', false, 4),
      (11, 'Sweden', true, 1), (11, 'Norway', false, 2), (11, 'Canada', false, 3), (11, 'Indonesia', false, 4),
      (12, 'Mariana Trench', true, 1), (12, 'Tonga Trench', false, 2), (12, 'Kuril Trench', false, 3), (12, 'Philippine Trench', false, 4),
      (13, 'Ottawa', true, 1), (13, 'Toronto', false, 2), (13, 'Vancouver', false, 3), (13, 'Montreal', false, 4),
      (14, 'Pacific Ocean', true, 1), (14, 'Atlantic Ocean', false, 2), (14, 'Indian Ocean', false, 3), (14, 'Arctic Ocean', false, 4),
      (15, 'New Delhi', true, 1), (15, 'Mumbai', false, 2), (15, 'Bangalore', false, 3), (15, 'Kolkata', false, 4),
      (16, 'Arctic', true, 1), (16, 'Atacama', false, 2), (16, 'Mojave', false, 3), (16, 'Great Sandy', false, 4),
      (17, 'Cairo', true, 1), (17, 'Alexandria', false, 2), (17, 'Giza', false, 3), (17, 'Luxor', false, 4),
      (18, 'Tanzania', true, 1), (18, 'Kenya', false, 2), (18, 'Uganda', false, 3), (18, 'Ethiopia', false, 4),
      (19, 'Pretoria', true, 1), (19, 'Cape Town', false, 2), (19, 'Johannesburg', false, 3), (19, 'Durban', false, 4),
      (20, '44', true, 1), (20, '50', false, 2), (20, '48', false, 3), (20, '52', false, 4)
  ) opt(q_idx, text, correct, opt_idx)
  WHERE gq.order_index = opt.q_idx;

  UPDATE public.public_quizzes SET total_questions = 20 WHERE id = quiz_id_geography;

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
    'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300'
  ) RETURNING id INTO quiz_id_english;

  WITH english_questions AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index)
    VALUES
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
      (quiz_id_english, 'What does "meticulous" mean?', 15),
      (quiz_id_english, 'What is the correct form of this verb?', 16),
      (quiz_id_english, 'What does "eloquent" mean?', 17),
      (quiz_id_english, 'Who wrote "Wuthering Heights"?', 18),
      (quiz_id_english, 'What is an allegory?', 19),
      (quiz_id_english, 'Choose the correct homophone.', 20)
    RETURNING id, order_index
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT 
    eq.id,
    opt.text,
    opt.correct,
    opt.opt_idx
  FROM english_questions eq
  CROSS JOIN (
    VALUES
      (1, 'Malevolent', true, 1), (1, 'Grateful', false, 2), (1, 'Kind', false, 3), (1, 'Generous', false, 4),
      (2, 'Accommodate', true, 1), (2, 'Accomodate', false, 2), (2, 'Acomodate', false, 3), (2, 'Acommodate', false, 4),
      (3, 'Practical and sensible', true, 1), (3, 'Theoretical', false, 2), (3, 'Impractical', false, 3), (3, 'Abstract', false, 4),
      (4, 'He go to school', false, 1), (4, 'He goes to school', true, 2), (4, 'He going to school', false, 3), (4, 'He gone to school', false, 4),
      (5, 'Fleeting', true, 1), (5, 'Permanent', false, 2), (5, 'Solid', false, 3), (5, 'Eternal', false, 4),
      (6, 'Jane Austen', true, 1), (6, 'Charlotte Brontë', false, 2), (6, 'Jane Brontë', false, 3), (6, 'Emily Dickinson', false, 4),
      (7, 'A combination of contradictory words', true, 1), (7, 'A metaphor', false, 2), (7, 'A simile', false, 3), (7, 'Personification', false, 4),
      (8, 'Phenomena', true, 1), (8, 'Phenomenons', false, 2), (8, 'Phenomenas', false, 3), (8, 'Phenomenae', false, 4),
      (9, 'Found everywhere', true, 1), (9, 'Rare', false, 2), (9, 'Hidden', false, 3), (9, 'Unique', false, 4),
      (10, 'George Orwell', true, 1), (10, 'Aldous Huxley', false, 2), (10, 'Ray Bradbury', false, 3), (10, 'Kurt Vonnegut', false, 4),
      (11, 'A comparison between two unlike things using "is"', true, 1), (11, 'A comparison using "like"', false, 2), (11, 'A repetition of words', false, 3), (11, 'A specific example', false, 4),
      (12, 'Conscientious', true, 1), (12, 'Conchientious', false, 2), (12, 'Conshientious', false, 3), (12, 'Consceintious', false, 4),
      (13, 'Concise', true, 1), (13, 'Detailed', false, 2), (13, 'Long-winded', false, 3), (13, 'Elaborate', false, 4),
      (14, 'Harper Lee', true, 1), (14, 'Maya Angelou', false, 2), (14, 'Alice Walker', false, 3), (14, 'Toni Morrison', false, 4),
      (15, 'Extreme attention to detail', true, 1), (15, 'Lazy', false, 2), (15, 'Careless', false, 3), (15, 'Forgetful', false, 4),
      (16, 'She have completed the work', false, 1), (16, 'She has completed the work', true, 2), (16, 'She had complete the work', false, 3), (16, 'She were completing', false, 4),
      (17, 'Fluent and expressive', true, 1), (17, 'Silent', false, 2), (17, 'Confused', false, 3), (17, 'Reluctant', false, 4),
      (18, 'Emily Brontë', true, 1), (18, 'Charlotte Brontë', false, 2), (18, 'Jane Austen', false, 3), (18, 'Mary Shelley', false, 4),
      (19, 'A story that represents an idea', true, 1), (19, 'A humorous story', false, 2), (19, 'A true story', false, 3), (19, 'A poem', false, 4),
      (20, 'Their house is beautiful', true, 1), (20, 'There house is beautiful', false, 2), (20, 'They''re house is beautiful', false, 3), (20, 'Theire house is beautiful', false, 4)
  ) opt(q_idx, text, correct, opt_idx)
  WHERE eq.order_index = opt.q_idx;

  UPDATE public.public_quizzes SET total_questions = 20 WHERE id = quiz_id_english;

  -- ==================== MATHEMATICS QUIZ ====================
  INSERT INTO public.public_quizzes (
    teacher_id, title, description, is_published, is_public,
    time_per_question, tags, difficulty, thumbnail_url
  ) VALUES (
    teacher_id,
    'Mathematics Fundamentals',
    'Test your math skills from basic arithmetic to algebra and geometry.',
    true, true, 30,
    ARRAY['math', 'algebra', 'geometry', 'arithmetic'],
    'intermediate',
    'https://images.unsplash.com/photo-1516321318423-f06f70a504f0?w=400&h=300'
  ) RETURNING id INTO quiz_id_math;

  WITH math_questions AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index)
    VALUES
      (quiz_id_math, 'What is 15 + 27?', 1),
      (quiz_id_math, 'What is 12 × 8?', 2),
      (quiz_id_math, 'What is 100 ÷ 5?', 3),
      (quiz_id_math, 'What is 2³?', 4),
      (quiz_id_math, 'What is the square root of 144?', 5),
      (quiz_id_math, 'What is 50% of 80?', 6),
      (quiz_id_math, 'Solve: x + 5 = 12', 7),
      (quiz_id_math, 'What is the area of a circle with radius 5?', 8),
      (quiz_id_math, 'What is the perimeter of a square with side 6?', 9),
      (quiz_id_math, 'What is 0.5 × 0.2?', 10),
      (quiz_id_math, 'What is 7² - 3²?', 11),
      (quiz_id_math, 'What is 1/2 + 1/4?', 12),
      (quiz_id_math, 'What is 25% of 200?', 13),
      (quiz_id_math, 'Solve: 2x - 4 = 10', 14),
      (quiz_id_math, 'What is the circumference of a circle with radius 3?', 15),
      (quiz_id_math, 'What is 10% of 500?', 16),
      (quiz_id_math, 'What is the area of a rectangle 4 × 9?', 17),
      (quiz_id_math, 'What is 3/5 as a percentage?', 18),
      (quiz_id_math, 'Solve: x/3 = 9', 19),
      (quiz_id_math, 'What is 99 - 45 + 12?', 20)
    RETURNING id, order_index
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT 
    mq.id,
    opt.text,
    opt.correct,
    opt.opt_idx
  FROM math_questions mq
  CROSS JOIN (
    VALUES
      (1, '42', true, 1), (1, '41', false, 2), (1, '43', false, 3), (1, '40', false, 4),
      (2, '96', true, 1), (2, '98', false, 2), (2, '94', false, 3), (2, '100', false, 4),
      (3, '20', true, 1), (3, '25', false, 2), (3, '15', false, 3), (3, '30', false, 4),
      (4, '8', true, 1), (4, '6', false, 2), (4, '9', false, 3), (4, '16', false, 4),
      (5, '12', true, 1), (5, '11', false, 2), (5, '13', false, 3), (5, '10', false, 4),
      (6, '40', true, 1), (6, '35', false, 2), (6, '45', false, 3), (6, '50', false, 4),
      (7, 'x = 7', true, 1), (7, 'x = 6', false, 2), (7, 'x = 8', false, 3), (7, 'x = 9', false, 4),
      (8, '78.5', true, 1), (8, '75', false, 2), (8, '80', false, 3), (8, '70.5', false, 4),
      (9, '24', true, 1), (9, '18', false, 2), (9, '20', false, 3), (9, '28', false, 4),
      (10, '0.1', true, 1), (10, '0.15', false, 2), (10, '0.05', false, 3), (10, '0.2', false, 4),
      (11, '40', true, 1), (11, '35', false, 2), (11, '45', false, 3), (11, '50', false, 4),
      (12, '3/4', true, 1), (12, '2/3', false, 2), (12, '1/2', false, 3), (12, '5/8', false, 4),
      (13, '50', true, 1), (13, '40', false, 2), (13, '60', false, 3), (13, '45', false, 4),
      (14, 'x = 7', true, 1), (14, 'x = 6', false, 2), (14, 'x = 8', false, 3), (14, 'x = 5', false, 4),
      (15, '18.84', true, 1), (15, '20', false, 2), (15, '15', false, 3), (15, '16.5', false, 4),
      (16, '50', true, 1), (16, '45', false, 2), (16, '55', false, 3), (16, '60', false, 4),
      (17, '36', true, 1), (17, '32', false, 2), (17, '40', false, 3), (17, '35', false, 4),
      (18, '60%', true, 1), (18, '50%', false, 2), (18, '70%', false, 3), (18, '55%', false, 4),
      (19, 'x = 27', true, 1), (19, 'x = 25', false, 2), (19, 'x = 30', false, 3), (19, 'x = 24', false, 4),
      (20, '66', true, 1), (20, '60', false, 2), (20, '70', false, 3), (20, '65', false, 4)
  ) opt(q_idx, text, correct, opt_idx)
  WHERE mq.order_index = opt.q_idx;

  UPDATE public.public_quizzes SET total_questions = 20 WHERE id = quiz_id_math;

  RAISE NOTICE 'Successfully seeded 5 new quizzes with 20 quality questions each (100 total questions, no fillers)';

END $$;
