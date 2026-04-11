-- Seed Quiz Part 1: Questions 1-200 (General Knowledge - History & Science)
-- Run this first to initialize the quiz

DO $$
DECLARE
  v_quiz_id uuid;
  teacher_uuid uuid := '96d05685-9e57-4697-a1fc-f7fc98471a07';
BEGIN
  -- Get or create the quiz
  SELECT id INTO v_quiz_id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — General Knowledge' LIMIT 1;

  IF v_quiz_id IS NULL THEN
    INSERT INTO public.public_quizzes (teacher_id, title, description, is_published, is_public, time_per_question, total_questions, tags, thumbnail_url)
    VALUES (
      teacher_uuid,
      'Pupil Enlightenment — General Knowledge',
      'A large public collection of general-knowledge questions for pupils.',
      TRUE,
      TRUE,
      20,
      1000,
      ARRAY['general','enlightenment'],
      'https://gloriousfutureacademy.vercel.app/_next/image?url=%2Fapple-touch-icon.png&w=48&q=75'
    ) RETURNING id INTO v_quiz_id;
  END IF;

  -- Insert Questions 1-200 with options (5 categories x 40 questions)
  
  -- HISTORY (Q1-40)
  WITH history_q AS (
    SELECT 1 AS qnum, 'Which ancient wonder of the world no longer stands?' AS qtext, 20 AS tim UNION ALL
    SELECT 2, 'What year did the Titanic sink?', 20 UNION ALL
    SELECT 3, 'Who was the emperor of Rome when it was at its greatest extent?', 20 UNION ALL
    SELECT 4, 'Which civilization built Machu Picchu?', 20 UNION ALL
    SELECT 5, 'What year did World War II end in Europe?', 20 UNION ALL
    SELECT 6, 'Which dynasty built the Great Wall of China?', 20 UNION ALL
    SELECT 7, 'Who painted the Mona Lisa?', 20 UNION ALL
    SELECT 8, 'Which country did Napoleon ultimately lose to in his final defeat?', 20 UNION ALL
    SELECT 9, 'What was the capital of the Byzantine Empire?', 20 UNION ALL
    SELECT 10, 'Which ancient library held the largest collection of scrolls?', 20 UNION ALL
    SELECT 11, 'Who discovered the Americas in 1492?', 20 UNION ALL
    SELECT 12, 'What was signed at Runnymede in 1215?', 20 UNION ALL
    SELECT 13, 'Which empire was ruled by Julius Caesar?', 20 UNION ALL
    SELECT 14, 'Who invented the printing press?', 20 UNION ALL
    SELECT 15, 'What year did the Berlin Wall fall?', 20 UNION ALL
    SELECT 16, 'Which pharaoh''s tomb was discovered by Howard Carter?', 20 UNION ALL
    SELECT 17, 'What was the primary religion of the Aztec civilization?', 20 UNION ALL
    SELECT 18, 'Which historical document begins with "We the People"?', 20 UNION ALL
    SELECT 19, 'Who was the first President to be assassinated?', 20 UNION ALL
    SELECT 20, 'What was the currency of ancient Rome called?', 20 UNION ALL
    SELECT 21, 'Which empire fell in 1453 with the conquest of Constantinople?', 20 UNION ALL
    SELECT 22, 'Who wrote the Declaration of Independence?', 20 UNION ALL
    SELECT 23, 'Which ancient Greek city-state was the birthplace of democracy?', 20 UNION ALL
    SELECT 24, 'What year was the American Revolution?', 20 UNION ALL
    SELECT 25, 'Which country hosted the first modern Olympic Games in 1896?', 20 UNION ALL
    SELECT 26, 'Who was Louis XIV famous for building?', 20 UNION ALL
    SELECT 27, 'Which scientist developed the theory of gravitational force?', 20 UNION ALL
    SELECT 28, 'What year did the Suez Canal open?', 20 UNION ALL
    SELECT 29, 'Who was the first Emperor of Japan?', 20 UNION ALL
    SELECT 30, 'Which treaty ended World War I?', 20 UNION ALL
    SELECT 31, 'What was the name of Hitler''s secret police?', 20 UNION ALL
    SELECT 32, 'What year did India gain independence?', 20 UNION ALL
    SELECT 33, 'Who was the first Prime Minister of India?', 20 UNION ALL
    SELECT 34, 'Which empire controlled the Silk Road during its peak?', 20 UNION ALL
    SELECT 35, 'What year was the Renaissance?', 20 UNION ALL
    SELECT 36, 'Which Roman Emperor converted to Christianity?', 20 UNION ALL
    SELECT 37, 'Who founded Islam?', 20 UNION ALL
    SELECT 38, 'Which country did Winston Churchill lead?', 20 UNION ALL
    SELECT 39, 'What year did slavery officially end in the United States?', 20 UNION ALL
    SELECT 40, 'Which ancient civilization built the pyramids?', 20
  ),
  inserted_history AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM history_q
    RETURNING id, order_index
  ),
  history_opts AS (
    SELECT 
      ih.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((ih.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_history ih
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM history_opts;

  -- SCIENCE (Q41-80)
  WITH science_q AS (
    SELECT 41 AS qnum, 'What is the powerhouse of the cell?' AS qtext, 20 AS tim UNION ALL
    SELECT 42, 'How many bones are in an adult human body?', 20 UNION ALL
    SELECT 43, 'Which gas do plants absorb from the atmosphere?', 20 UNION ALL
    SELECT 44, 'What is the study of fungi called?', 20 UNION ALL
    SELECT 45, 'How many chromosomes does a human have?', 20 UNION ALL
    SELECT 46, 'What is the largest organ in the human body?', 20 UNION ALL
    SELECT 47, 'Which is the only mammal that can''t jump?', 20 UNION ALL
    SELECT 48, 'What percentage of Earth''s oxygen comes from the ocean?', 20 UNION ALL
    SELECT 49, 'How long is the average human gestation period?', 20 UNION ALL
    SELECT 50, 'Which blood type is the universal donor?', 20 UNION ALL
    SELECT 51, 'What is the hardest substance in the human body?', 20 UNION ALL
    SELECT 52, 'How many muscles does a human have?', 20 UNION ALL
    SELECT 53, 'Which is the smallest bone in the human body?', 20 UNION ALL
    SELECT 54, 'What is the chemical formula for glucose?', 20 UNION ALL
    SELECT 55, 'How many lobes does the brain have?', 20 UNION ALL
    SELECT 56, 'What is the speed of sound in air?', 20 UNION ALL
    SELECT 57, 'Which cells fight infections in the human body?', 20 UNION ALL
    SELECT 58, 'What is the study of animals called?', 20 UNION ALL
    SELECT 59, 'How many eyes does a bee have?', 20 UNION ALL
    SELECT 60, 'Which blood vessel carries oxygenated blood from the heart?', 20 UNION ALL
    SELECT 61, 'What percentage of human body is water?', 20 UNION ALL
    SELECT 62, 'How many teeth does an adult human have?', 20 UNION ALL
    SELECT 63, 'Which organ filters waste from the blood?', 20 UNION ALL
    SELECT 64, 'How many chambers does a human heart have?', 20 UNION ALL
    SELECT 65, 'What is the study of plants called?', 20 UNION ALL
    SELECT 66, 'Which protein carries oxygen in blood?', 20 UNION ALL
    SELECT 67, 'How many brain cells does a human have?', 20 UNION ALL
    SELECT 68, 'Which is the only mammal with continuously growing teeth?', 20 UNION ALL
    SELECT 69, 'How many taste buds does a human tongue have?', 20 UNION ALL
    SELECT 70, 'What is the chemical symbol for gold?', 20 UNION ALL
    SELECT 71, 'Who was the first person to walk on the Moon?', 20 UNION ALL
    SELECT 72, 'Which animal is the largest mammal?', 20 UNION ALL
    SELECT 73, 'What is the smallest prime number?', 20 UNION ALL
    SELECT 74, 'Which element has atomic number 1?', 20 UNION ALL
    SELECT 75, 'What is the chemical formula for water?', 20 UNION ALL
    SELECT 76, 'Which is the fastest land animal?', 20 UNION ALL
    SELECT 77, 'Which planet is the largest in our solar system?', 20 UNION ALL
    SELECT 78, 'What color are chloroplasts primarily?', 20 UNION ALL
    SELECT 79, 'What is the boiling point of water at sea level in °C?', 20 UNION ALL
    SELECT 80, 'What does DNA stand for?', 20
  ),
  inserted_science AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM science_q
    RETURNING id, order_index
  ),
  science_opts AS (
    SELECT 
      isc.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((isc.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_science isc
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM science_opts;

  -- GEOGRAPHY (Q81-120)
  WITH geo_q AS (
    SELECT 81 AS qnum, 'What is the capital of France?' AS qtext, 20 AS tim UNION ALL
    SELECT 82, 'Which country has the most time zones?', 20 UNION ALL
    SELECT 83, 'What is the capital of Australia?', 20 UNION ALL
    SELECT 84, 'What is the largest island in the world?', 20 UNION ALL
    SELECT 85, 'What is the largest ocean on Earth?', 20 UNION ALL
    SELECT 86, 'Which is the largest desert in the world?', 20 UNION ALL
    SELECT 87, 'What is the capital of Spain?', 20 UNION ALL
    SELECT 88, 'Which country is both in Europe and Asia?', 20 UNION ALL
    SELECT 89, 'What is the smallest country in the world?', 20 UNION ALL
    SELECT 90, 'Which sea is below sea level?', 20 UNION ALL
    SELECT 91, 'What is the capital of Italy?', 20 UNION ALL
    SELECT 92, 'Which country has the most islands?', 20 UNION ALL
    SELECT 93, 'What is the capital of Germany?', 20 UNION ALL
    SELECT 94, 'Which African country has the largest economy?', 20 UNION ALL
    SELECT 95, 'What is the capital of Japan?', 20 UNION ALL
    SELECT 96, 'Which country borders the most countries?', 20 UNION ALL
    SELECT 97, 'What is the longest river in Asia?', 20 UNION ALL
    SELECT 98, 'What is the capital of Brazil?', 20 UNION ALL
    SELECT 99, 'Which country produces the most coffee?', 20 UNION ALL
    SELECT 100, 'What is the capital of Canada?', 20 UNION ALL
    SELECT 101, 'Which country produces the most tea?', 20 UNION ALL
    SELECT 102, 'What is the capital of Mexico?', 20 UNION ALL
    SELECT 103, 'Which country was formerly called Rhodesia?', 20 UNION ALL
    SELECT 104, 'What is the capital of India?', 20 UNION ALL
    SELECT 105, 'Which country is the largest by area?', 20 UNION ALL
    SELECT 106, 'What is the capital of Australia?', 20 UNION ALL
    SELECT 107, 'How many countries are in the European Union?', 20 UNION ALL
    SELECT 108, 'Which country is landlocked and surrounded by South Africa?', 20 UNION ALL
    SELECT 109, 'What is the capital of Nigeria?', 20 UNION ALL
    SELECT 110, 'How many states does the USA have?', 20 UNION ALL
    SELECT 111, 'What is the capital of Egypt?', 20 UNION ALL
    SELECT 112, 'Which country has the longest coastline?', 20 UNION ALL
    SELECT 113, 'What is the capital of Thailand?', 20 UNION ALL
    SELECT 114, 'Which country is made up of 336 islands?', 20 UNION ALL
    SELECT 115, 'What is the capital of Greece?', 20 UNION ALL
    SELECT 116, 'How many continents are there?', 20 UNION ALL
    SELECT 117, 'What is the capital of Portugal?', 20 UNION ALL
    SELECT 118, 'Which South American country was named after a river?', 20 UNION ALL
    SELECT 119, 'What is the capital of Argentina?', 20 UNION ALL
    SELECT 120, 'How many provinces does Canada have?', 20
  ),
  inserted_geo AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM geo_q
    RETURNING id, order_index
  ),
  geo_opts AS (
    SELECT 
      ig.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((ig.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_geo ig
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM geo_opts;

  -- MATHEMATICS (Q121-160)
  WITH math_q AS (
    SELECT 121 AS qnum, 'How many degrees are in a circle?' AS qtext, 20 AS tim UNION ALL
    SELECT 122, 'What is the square root of 144?', 20 UNION ALL
    SELECT 123, 'What is 15% of 200?', 20 UNION ALL
    SELECT 124, 'How many sides does a hexagon have?', 20 UNION ALL
    SELECT 125, 'What is the sum of angles in a triangle?', 20 UNION ALL
    SELECT 126, 'What is the value of Pi to 2 decimal places?', 20 UNION ALL
    SELECT 127, 'What is the square root of 256?', 20 UNION ALL
    SELECT 128, 'How many degrees are in a right angle?', 20 UNION ALL
    SELECT 129, 'What is 20% of 150?', 20 UNION ALL
    SELECT 130, 'What is the cube root of 27?', 20 UNION ALL
    SELECT 131, 'How many sides does a pentagon have?', 20 UNION ALL
    SELECT 132, 'What is 10% of 500?', 20 UNION ALL
    SELECT 133, 'What is the square root of 49?', 20 UNION ALL
    SELECT 134, 'How many faces does a cube have?', 20 UNION ALL
    SELECT 135, 'What is the area of a circle with radius 5?', 20 UNION ALL
    SELECT 136, 'What is 25% of 400?', 20 UNION ALL
    SELECT 137, 'How many vertices does a square pyramid have?', 20 UNION ALL
    SELECT 138, 'What is the square root of 121?', 20 UNION ALL
    SELECT 139, 'What is 50% of 1000?', 20 UNION ALL
    SELECT 140, 'How many sides does an octagon have?', 20 UNION ALL
    SELECT 141, 'What is the square root of 169?', 20 UNION ALL
    SELECT 142, 'What is 30% of 300?', 20 UNION ALL
    SELECT 143, 'How many edges does a cube have?', 20 UNION ALL
    SELECT 144, 'What is the least common multiple of 4 and 6?', 20 UNION ALL
    SELECT 145, 'What is the greatest common divisor of 24 and 36?', 20 UNION ALL
    SELECT 146, 'What is 12 squared?', 20 UNION ALL
    SELECT 147, 'What is the square root of 225?', 20 UNION ALL
    SELECT 148, 'How many degrees are in a straight line?', 20 UNION ALL
    SELECT 149, 'What is 5 cubed?', 20 UNION ALL
    SELECT 150, 'What is the perimeter of a square with side 5?', 20 UNION ALL
    SELECT 151, 'What is the area of a rectangle 4 by 6?', 20 UNION ALL
    SELECT 152, 'What is the square root of 361?', 20 UNION ALL
    SELECT 153, 'What is 8 squared?', 20 UNION ALL
    SELECT 154, 'How many degrees is a reflex angle?', 20 UNION ALL
    SELECT 155, 'What is the square root of 100?', 20 UNION ALL
    SELECT 156, 'What is 3 cubed?', 20 UNION ALL
    SELECT 157, 'What is the volume of a cube with side 4?', 20 UNION ALL
    SELECT 158, 'What is the square root of 196?', 20 UNION ALL
    SELECT 159, 'What is 7 squared?', 20 UNION ALL
    SELECT 160, 'How many sides does a nonagon have?', 20
  ),
  inserted_math AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM math_q
    RETURNING id, order_index
  ),
  math_opts AS (
    SELECT 
      im.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((im.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_math im
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM math_opts;

  -- LITERATURE (Q161-200)
  WITH lit_q AS (
    SELECT 161 AS qnum, 'Who wrote Pride and Prejudice?' AS qtext, 20 AS tim UNION ALL
    SELECT 162, 'Which book series features Harry Potter?', 20 UNION ALL
    SELECT 163, 'Who wrote 1984?', 20 UNION ALL
    SELECT 164, 'Who wrote Great Expectations?', 20 UNION ALL
    SELECT 165, 'Who wrote Romeo and Juliet?', 20 UNION ALL
    SELECT 166, 'Which novel features Sherlock Holmes?', 20 UNION ALL
    SELECT 167, 'Who wrote Jane Eyre?', 20 UNION ALL
    SELECT 168, 'Which novel features Mr. Darcy?', 20 UNION ALL
    SELECT 169, 'Who wrote Les Misérables?', 20 UNION ALL
    SELECT 170, 'Which book features Captain Nemo?', 20 UNION ALL
    SELECT 171, 'Who wrote Alice''s Adventures in Wonderland?', 20 UNION ALL
    SELECT 172, 'Who wrote The Old Man and the Sea?', 20 UNION ALL
    SELECT 173, 'Who wrote Gone with the Wind?', 20 UNION ALL
    SELECT 174, 'Which novel features Huckleberry Finn?', 20 UNION ALL
    SELECT 175, 'Who wrote The Great Gatsby?', 20 UNION ALL
    SELECT 176, 'Which book features Jean Valjean?', 20 UNION ALL
    SELECT 177, 'Who wrote Anna Karenina?', 20 UNION ALL
    SELECT 178, 'Who wrote Moby Dick?', 20 UNION ALL
    SELECT 179, 'Who wrote The Picture of Dorian Gray?', 20 UNION ALL
    SELECT 180, 'Who wrote Persuasion?', 20 UNION ALL
    SELECT 181, 'Who wrote Emma?', 20 UNION ALL
    SELECT 182, 'Who wrote The Odyssey?', 20 UNION ALL
    SELECT 183, 'Who wrote The Divine Comedy?', 20 UNION ALL
    SELECT 184, 'Who wrote Paradise Lost?', 20 UNION ALL
    SELECT 185, 'Who wrote Robinson Crusoe?', 20 UNION ALL
    SELECT 186, 'Who wrote Ulysses?', 20 UNION ALL
    SELECT 187, 'Who wrote The Metamorphosis?', 20 UNION ALL
    SELECT 188, 'Who wrote The Brothers Karamazov?', 20 UNION ALL
    SELECT 189, 'Who wrote The Scarlet Letter?', 20 UNION ALL
    SELECT 190, 'Who wrote Crime and Punishment?', 20 UNION ALL
    SELECT 191, 'Which book features Atticus Finch?', 20 UNION ALL
    SELECT 192, 'Who wrote War and Peace?', 20 UNION ALL
    SELECT 193, 'Which novel features Lord Jim?', 20 UNION ALL
    SELECT 194, 'Who wrote Wuthering Heights?', 20 UNION ALL
    SELECT 195, 'Who wrote Frankenstein?', 20 UNION ALL
    SELECT 196, 'Who wrote The Hobbit?', 20 UNION ALL
    SELECT 197, 'Which novel features Ebenezer Scrooge?', 20 UNION ALL
    SELECT 198, 'Who wrote The Little Prince?', 20 UNION ALL
    SELECT 199, 'Who wrote Oliver Twist?', 20 UNION ALL
    SELECT 200, 'Which book features David Copperfield?', 20
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

  RAISE NOTICE 'Part 1 complete: Questions 1-200 with options inserted!';
END $$;
