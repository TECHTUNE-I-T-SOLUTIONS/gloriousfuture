-- Seed Quiz Part 5: New Quiz Category - Geography & Science (200 questions)
-- This creates a SEPARATE quiz with its own 200 questions and 800 options

DO $$
DECLARE
  v_quiz_id uuid;
BEGIN
  -- Try to get existing quiz
  SELECT id INTO v_quiz_id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — Geography & Science' LIMIT 1;
  
  -- If not found, create it
  IF v_quiz_id IS NULL THEN
    INSERT INTO public.public_quizzes (title, description, created_at)
    VALUES (
      'Pupil Enlightenment — Geography & Science',
      'Geography & Science - 200 comprehensive questions on world capitals, landmarks, technology, and modern science',
      NOW()
    )
    RETURNING id INTO v_quiz_id;
  END IF;

  -- GEOGRAPHY & CAPITALS (Q1-100)
  WITH geo_q AS (
    SELECT 1 AS qnum, 'What is the capital of Libya?' AS qtext, 20 AS tim UNION ALL
    SELECT 2, 'What is the capital of Lebanon?', 20 UNION ALL
    SELECT 3, 'What is the capital of Syria?', 20 UNION ALL
    SELECT 4, 'What is the capital of Jordan?', 20 UNION ALL
    SELECT 5, 'What is the capital of Yemen?', 20 UNION ALL
    SELECT 6, 'What is the capital of Oman?', 20 UNION ALL
    SELECT 7, 'What is the capital of Qatar?', 20 UNION ALL
    SELECT 8, 'What is the capital of Bahrain?', 20 UNION ALL
    SELECT 9, 'What is the capital of Kuwait?', 20 UNION ALL
    SELECT 10, 'What is the capital of Macedonia?', 20 UNION ALL
    SELECT 11, 'What is the capital of Montenegro?', 20 UNION ALL
    SELECT 12, 'What is the capital of Bosnia?', 20 UNION ALL
    SELECT 13, 'What is the capital of Kosovo?', 20 UNION ALL
    SELECT 14, 'What is the capital of Serbia?', 20 UNION ALL
    SELECT 15, 'What is the capital of Slovenia?', 20 UNION ALL
    SELECT 16, 'What is the capital of Croatia?', 20 UNION ALL
    SELECT 17, 'What is the capital of Albania?', 20 UNION ALL
    SELECT 18, 'What is the capital of Latvia?', 20 UNION ALL
    SELECT 19, 'What is the capital of Lithuania?', 20 UNION ALL
    SELECT 20, 'What is the capital of Estonia?', 20 UNION ALL
    SELECT 21, 'What is the capital of Belarus?', 20 UNION ALL
    SELECT 22, 'What is the capital of Ukraine?', 20 UNION ALL
    SELECT 23, 'What is the capital of Moldova?', 20 UNION ALL
    SELECT 24, 'What is the capital of Georgia?', 20 UNION ALL
    SELECT 25, 'What is the capital of Armenia?', 20 UNION ALL
    SELECT 26, 'What is the capital of Azerbaijan?', 20 UNION ALL
    SELECT 27, 'What is the capital of Kazakhstan?', 20 UNION ALL
    SELECT 28, 'What is the capital of Uzbekistan?', 20 UNION ALL
    SELECT 29, 'What is the capital of Turkmenistan?', 20 UNION ALL
    SELECT 30, 'What is the capital of Kyrgyzstan?', 20 UNION ALL
    SELECT 31, 'What is the capital of Tajikistan?', 20 UNION ALL
    SELECT 32, 'What is the capital of Mongolia?', 20 UNION ALL
    SELECT 33, 'What is the capital of Bhutan?', 20 UNION ALL
    SELECT 34, 'What is the capital of Nepal?', 20 UNION ALL
    SELECT 35, 'What is the capital of Sri Lanka?', 20 UNION ALL
    SELECT 36, 'What is the capital of Bangladesh?', 20 UNION ALL
    SELECT 37, 'What is the capital of Myanmar?', 20 UNION ALL
    SELECT 38, 'What is the capital of Laos?', 20 UNION ALL
    SELECT 39, 'What is the capital of Cambodia?', 20 UNION ALL
    SELECT 40, 'What is the capital of Vietnam?', 20 UNION ALL
    SELECT 41, 'What is the capital of East Timor?', 20 UNION ALL
    SELECT 42, 'What is the capital of Papua New Guinea?', 20 UNION ALL
    SELECT 43, 'What is the capital of Fiji?', 20 UNION ALL
    SELECT 44, 'What is the capital of Solomon Islands?', 20 UNION ALL
    SELECT 45, 'What is the capital of Samoa?', 20 UNION ALL
    SELECT 46, 'What is the capital of Vanuatu?', 20 UNION ALL
    SELECT 47, 'What is the capital of Kiribati?', 20 UNION ALL
    SELECT 48, 'What is the capital of Nauru?', 20 UNION ALL
    SELECT 49, 'What is the capital of Palau?', 20 UNION ALL
    SELECT 50, 'What is the capital of Marshall Islands?', 20 UNION ALL
    SELECT 51, 'What is the highest mountain in Africa?', 20 UNION ALL
    SELECT 52, 'What is the longest river in Africa?', 20 UNION ALL
    SELECT 53, 'What is the largest desert in Africa?', 20 UNION ALL
    SELECT 54, 'What is the deepest ocean trench?', 20 UNION ALL
    SELECT 55, 'What is the highest mountain in South America?', 20 UNION ALL
    SELECT 56, 'What is the longest river in South America?', 20 UNION ALL
    SELECT 57, 'What is the largest rainforest in the world?', 20 UNION ALL
    SELECT 58, 'What is the highest mountain in Europe?', 20 UNION ALL
    SELECT 59, 'What is the longest river in Europe?', 20 UNION ALL
    SELECT 60, 'What is the highest mountain in Asia?', 20 UNION ALL
    SELECT 61, 'What is the longest river in Asia?', 20 UNION ALL
    SELECT 62, 'What is the largest desert in Asia?', 20 UNION ALL
    SELECT 63, 'What is the largest ocean in the world?', 20 UNION ALL
    SELECT 64, 'What is the smallest ocean in the world?', 20 UNION ALL
    SELECT 65, 'What is the largest continent by population?', 20 UNION ALL
    SELECT 66, 'What is the smallest continent by land area?', 20 UNION ALL
    SELECT 67, 'How many continents are there?', 20 UNION ALL
    SELECT 68, 'How many oceans are there?', 20 UNION ALL
    SELECT 69, 'What is the equator?', 20 UNION ALL
    SELECT 70, 'What is the Prime Meridian?', 20 UNION ALL
    SELECT 71, 'What is a timezone?', 20 UNION ALL
    SELECT 72, 'What is longitude?', 20 UNION ALL
    SELECT 73, 'What is latitude?', 20 UNION ALL
    SELECT 74, 'What is a peninsula?', 20 UNION ALL
    SELECT 75, 'What is an archipelago?', 20 UNION ALL
    SELECT 76, 'What is a plateau?', 20 UNION ALL
    SELECT 77, 'What is a valley?', 20 UNION ALL
    SELECT 78, 'What is a delta?', 20 UNION ALL
    SELECT 79, 'What is a gorge?', 20 UNION ALL
    SELECT 80, 'What is a canyon?', 20 UNION ALL
    SELECT 81, 'What is a fjord?', 20 UNION ALL
    SELECT 82, 'What is a lagoon?', 20 UNION ALL
    SELECT 83, 'What is a bay?', 20 UNION ALL
    SELECT 84, 'What is a gulf?', 20 UNION ALL
    SELECT 85, 'What is a strait?', 20 UNION ALL
    SELECT 86, 'What is an isthmus?', 20 UNION ALL
    SELECT 87, 'What is the Bermuda Triangle famous for?', 20 UNION ALL
    SELECT 88, 'What is the Ring of Fire?', 20 UNION ALL
    SELECT 89, 'What are the Northern Lights?', 20 UNION ALL
    SELECT 90, 'What is the Aurora Borealis?', 20 UNION ALL
    SELECT 91, 'What is the Aurora Australis?', 20 UNION ALL
    SELECT 92, 'How many degrees does the Earth rotate daily?', 20 UNION ALL
    SELECT 93, 'What is a biome?', 20 UNION ALL
    SELECT 94, 'What is a tundra?', 20 UNION ALL
    SELECT 95, 'What is a savanna?', 20 UNION ALL
    SELECT 96, 'What is a swamp?', 20 UNION ALL
    SELECT 97, 'What is a prairie?', 20 UNION ALL
    SELECT 98, 'What is a forest?', 20 UNION ALL
    SELECT 99, 'What is grassland?', 20 UNION ALL
    SELECT 100, 'What is wetland?', 20
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

  -- TECHNOLOGY & MODERN SCIENCE (Q101-200)
  WITH tech_sci AS (
    SELECT 101 AS qnum, 'Who invented the light bulb?' AS qtext, 20 AS tim UNION ALL
    SELECT 102, 'Who invented the telephone?', 20 UNION ALL
    SELECT 103, 'Who invented the airplane?', 20 UNION ALL
    SELECT 104, 'Who invented the television?', 20 UNION ALL
    SELECT 105, 'Who invented the radio?', 20 UNION ALL
    SELECT 106, 'Who invented the camera?', 20 UNION ALL
    SELECT 107, 'Who invented the electric motor?', 20 UNION ALL
    SELECT 108, 'Who invented the transformer?', 20 UNION ALL
    SELECT 109, 'Who invented dynamite?', 20 UNION ALL
    SELECT 110, 'Who invented penicillin?', 20 UNION ALL
    SELECT 111, 'Who invented the microscope?', 20 UNION ALL
    SELECT 112, 'Who invented the telescope?', 20 UNION ALL
    SELECT 113, 'Who invented the thermometer?', 20 UNION ALL
    SELECT 114, 'Who invented the barometer?', 20 UNION ALL
    SELECT 115, 'Who invented the compass?', 20 UNION ALL
    SELECT 116, 'Who invented the printing press?', 20 UNION ALL
    SELECT 117, 'Who invented the cotton gin?', 20 UNION ALL
    SELECT 118, 'Who invented the steam engine?', 20 UNION ALL
    SELECT 119, 'Who invented the bicycle?', 20 UNION ALL
    SELECT 120, 'Who invented the automobile?', 20 UNION ALL
    SELECT 121, 'Who invented the diesel engine?', 20 UNION ALL
    SELECT 122, 'Who invented plastic?', 20 UNION ALL
    SELECT 123, 'Who invented the jet engine?', 20 UNION ALL
    SELECT 124, 'Who invented the helicopter?', 20 UNION ALL
    SELECT 125, 'Who invented the rocket?', 20 UNION ALL
    SELECT 126, 'Who invented the computer?', 20 UNION ALL
    SELECT 127, 'Who invented the transistor?', 20 UNION ALL
    SELECT 128, 'Who invented the integrated circuit?', 20 UNION ALL
    SELECT 129, 'Who invented the internet?', 20 UNION ALL
    SELECT 130, 'Who invented the World Wide Web?', 20 UNION ALL
    SELECT 131, 'What is the third planet from the sun?', 20 UNION ALL
    SELECT 132, 'What is the largest planet in our solar system?', 20 UNION ALL
    SELECT 133, 'What is the smallest planet in our solar system?', 20 UNION ALL
    SELECT 134, 'What is the closest planet to the sun?', 20 UNION ALL
    SELECT 135, 'How many planets are in our solar system?', 20 UNION ALL
    SELECT 136, 'What is the name of the sun in our solar system?', 20 UNION ALL
    SELECT 137, 'What is the red planet?', 20 UNION ALL
    SELECT 138, 'What is the ringed planet?', 20 UNION ALL
    SELECT 139, 'What gas makes up the majority of Earth atmosphere?', 20 UNION ALL
    SELECT 140, 'What is the chemical symbol for gold?', 20 UNION ALL
    SELECT 141, 'What is the chemical symbol for silver?', 20 UNION ALL
    SELECT 142, 'What is the chemical symbol for iron?', 20 UNION ALL
    SELECT 143, 'What is the chemical symbol for copper?', 20 UNION ALL
    SELECT 144, 'What is the chemical symbol for lead?', 20 UNION ALL
    SELECT 145, 'What is the chemical symbol for mercury?', 20 UNION ALL
    SELECT 146, 'What is the chemical symbol for tin?', 20 UNION ALL
    SELECT 147, 'What is the chemical symbol for zinc?', 20 UNION ALL
    SELECT 148, 'What is the chemical symbol for carbon?', 20 UNION ALL
    SELECT 149, 'What is the chemical symbol for oxygen?', 20 UNION ALL
    SELECT 150, 'What is the chemical symbol for hydrogen?', 20 UNION ALL
    SELECT 151, 'What is the chemical symbol for nitrogen?', 20 UNION ALL
    SELECT 152, 'What is the chemical symbol for sulfur?', 20 UNION ALL
    SELECT 153, 'What is the chemical symbol for phosphorus?', 20 UNION ALL
    SELECT 154, 'What is the chemical symbol for chlorine?', 20 UNION ALL
    SELECT 155, 'What is the chemical symbol for sodium?', 20 UNION ALL
    SELECT 156, 'What is the chemical symbol for potassium?', 20 UNION ALL
    SELECT 157, 'What is the chemical symbol for calcium?', 20 UNION ALL
    SELECT 158, 'What is the chemical symbol for magnesium?', 20 UNION ALL
    SELECT 159, 'What is the chemical symbol for aluminum?', 20 UNION ALL
    SELECT 160, 'What is the chemical symbol for silicon?', 20 UNION ALL
    SELECT 161, 'What is the speed of light?', 20 UNION ALL
    SELECT 162, 'What is the speed of sound?', 20 UNION ALL
    SELECT 163, 'What is the boiling point of water?', 20 UNION ALL
    SELECT 164, 'What is the freezing point of water?', 20 UNION ALL
    SELECT 165, 'What is absolute zero?', 20 UNION ALL
    SELECT 166, 'What is the atomic number of hydrogen?', 20 UNION ALL
    SELECT 167, 'What is the atomic number of carbon?', 20 UNION ALL
    SELECT 168, 'What is the atomic number of oxygen?', 20 UNION ALL
    SELECT 169, 'What is the atomic number of nitrogen?', 20 UNION ALL
    SELECT 170, 'What is the atomic number of iron?', 20 UNION ALL
    SELECT 171, 'What is the atomic number of gold?', 20 UNION ALL
    SELECT 172, 'What are the primary colors?', 20 UNION ALL
    SELECT 173, 'What is the frequency of visible light?', 20 UNION ALL
    SELECT 174, 'What is electromagnetic radiation?', 20 UNION ALL
    SELECT 175, 'What is a force?', 20 UNION ALL
    SELECT 176, 'What is velocity?', 20 UNION ALL
    SELECT 177, 'What is acceleration?', 20 UNION ALL
    SELECT 178, 'What is momentum?', 20 UNION ALL
    SELECT 179, 'What is energy?', 20 UNION ALL
    SELECT 180, 'What is power?', 20 UNION ALL
    SELECT 181, 'What is gravity?', 20 UNION ALL
    SELECT 182, 'What is friction?', 20 UNION ALL
    SELECT 183, 'What is pressure?', 20 UNION ALL
    SELECT 184, 'What is density?', 20 UNION ALL
    SELECT 185, 'What is volume?', 20 UNION ALL
    SELECT 186, 'What is mass?', 20 UNION ALL
    SELECT 187, 'What is weight?', 20 UNION ALL
    SELECT 188, 'What is temperature?', 20 UNION ALL
    SELECT 189, 'What is heat?', 20 UNION ALL
    SELECT 190, 'What is electricity?', 20 UNION ALL
    SELECT 191, 'What is magnetism?', 20 UNION ALL
    SELECT 192, 'What is a wave?', 20 UNION ALL
    SELECT 193, 'What is a particle?', 20 UNION ALL
    SELECT 194, 'What is DNA?', 20 UNION ALL
    SELECT 195, 'What is RNA?', 20 UNION ALL
    SELECT 196, 'What is a protein?', 20 UNION ALL
    SELECT 197, 'What is a cell?', 20 UNION ALL
    SELECT 198, 'What is an atom?', 20 UNION ALL
    SELECT 199, 'What is a molecule?', 20 UNION ALL
    SELECT 200, 'What is the fundamental unit of all living things?', 20
  ),
  inserted_tech_sci AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM tech_sci
    RETURNING id, order_index
  ),
  tech_sci_opts AS (
    SELECT 
      its.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((its.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_tech_sci its
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM tech_sci_opts;

  RAISE NOTICE 'Part 5 complete: 200 questions with 800 options inserted into "Pupil Enlightenment — Geography & Science"!';
END $$;
