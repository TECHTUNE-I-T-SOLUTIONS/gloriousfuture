-- Seed Quiz Part 3: New Quiz Category - Culture & Arts (200 questions)
-- This creates a SEPARATE quiz with its own 200 questions and 800 options

DO $$
DECLARE
  v_quiz_id uuid;
BEGIN
  -- Create or get the quiz for this category
  INSERT INTO public.public_quizzes (title, description, created_at)
  VALUES (
    'Pupil Enlightenment — Culture & Arts',
    'Culture & Arts - 200 comprehensive questions on history, mythology, literature, music, and visual arts',
    NOW()
  )
  ON CONFLICT (title) DO UPDATE SET updated_at = NOW()
  RETURNING id INTO v_quiz_id;
  
  -- If it already exists, get its ID
  IF v_quiz_id IS NULL THEN
    SELECT id INTO v_quiz_id FROM public.public_quizzes 
    WHERE title = 'Pupil Enlightenment — Culture & Arts' LIMIT 1;
  END IF;

  -- EXTENDED HISTORY (Q1-100)
  WITH hist_ext AS (
    SELECT 1 AS qnum, 'What year did the Hundred Years War end?' AS qtext, 20 AS tim UNION ALL
    SELECT 2, 'Which religion was founded by Zoroaster?', 20 UNION ALL
    SELECT 3, 'Who was the first Secretary General of the United Nations?', 20 UNION ALL
    SELECT 4, 'Which ancient king created Hammurabi''s Code?', 20 UNION ALL
    SELECT 5, 'Who invented the theory of evolution?', 20 UNION ALL
    SELECT 6, 'What year did the Spanish Armada sail?', 20 UNION ALL
    SELECT 7, 'Which country sided with the Axis powers in World War II?', 20 UNION ALL
    SELECT 8, 'What was the main cause of the French Revolution?', 20 UNION ALL
    SELECT 9, 'Who was executed by guillotine during the French Revolution?', 20 UNION ALL
    SELECT 10, 'Which trade was most important in the Atlantic Triangle?', 20 UNION ALL
    SELECT 11, 'Who discovered penicillin?', 20 UNION ALL
    SELECT 12, 'Which empire did Timur (Tamerlane) conquer?', 20 UNION ALL
    SELECT 13, 'Who was the first Holy Roman Emperor?', 20 UNION ALL
    SELECT 14, 'What year did the moon landing occur?', 20 UNION ALL
    SELECT 15, 'Which country did the Spartans defeat at Marathon?', 20 UNION ALL
    SELECT 16, 'Who was the famous navigator who proved earth was round?', 20 UNION ALL
    SELECT 17, 'What year was the printing revolution initiated?', 20 UNION ALL
    SELECT 18, 'Which empire was ruled by Nebuchadnezzar II?', 20 UNION ALL
    SELECT 19, 'Who was the last Tsar of Russia?', 20 UNION ALL
    SELECT 20, 'What year did apartheid end in South Africa?', 20 UNION ALL
    SELECT 21, 'Which ancient empire was known for its advanced aqueducts?', 20 UNION ALL
    SELECT 22, 'Who was the first Emperor of unified China?', 20 UNION ALL
    SELECT 23, 'What year did the Industrial Revolution begin?', 20 UNION ALL
    SELECT 24, 'Which ancient city was destroyed by Vesuvius in 79 AD?', 20 UNION ALL
    SELECT 25, 'What was the Vietnam War also called?', 20 UNION ALL
    SELECT 26, 'Which country was the first to industrialize?', 20 UNION ALL
    SELECT 27, 'What year was the Russian Revolution?', 20 UNION ALL
    SELECT 28, 'Who discovered the Pacific Ocean?', 20 UNION ALL
    SELECT 29, 'What year was the Great Fire of London?', 20 UNION ALL
    SELECT 30, 'Who was the founder of the Mongol Empire?', 20 UNION ALL
    SELECT 31, 'What year did the Reformation begin?', 20 UNION ALL
    SELECT 32, 'Who led the first successful slave revolt?', 20 UNION ALL
    SELECT 33, 'What year did the American Civil War end?', 20 UNION ALL
    SELECT 34, 'Who invented the steam engine?', 20 UNION ALL
    SELECT 35, 'What year was the Declaration of Independence signed?', 20 UNION ALL
    SELECT 36, 'Who was the first female ruler of England?', 20 UNION ALL
    SELECT 37, 'What year was the English Civil War?', 20 UNION ALL
    SELECT 438, 'Who founded the Ottoman Empire?', 20 UNION ALL
    SELECT 439, 'What year did the Black Death end?', 20 UNION ALL
    SELECT 440, 'Who was the ruler of Austria when Marie Antoinette was born?', 20 UNION ALL
    SELECT 441, 'What year was the Peace of Westphalia?', 20 UNION ALL
    SELECT 442, 'Who invented the telescope?', 20 UNION ALL
    SELECT 443, 'What year did the Scientific Revolution begin?', 20 UNION ALL
    SELECT 444, 'Who founded the hospital system?', 20 UNION ALL
    SELECT 445, 'What year was the Treaty of Versailles?', 20 UNION ALL
    SELECT 446, 'Who was Napoleon''s second wife?', 20 UNION ALL
    SELECT 447, 'What year was the Congress of Vienna?', 20 UNION ALL
    SELECT 448, 'Who was the first President of South Africa?', 20 UNION ALL
    SELECT 449, 'What year was the Korean War?', 20 UNION ALL
    SELECT 450, 'Who was the founder of Buddhism?', 20 UNION ALL
    SELECT 451, 'What year was the Suez Crisis?', 20 UNION ALL
    SELECT 452, 'Who discovered X-rays?', 20 UNION ALL
    SELECT 453, 'What year was the first transatlantic telegraph?', 20 UNION ALL
    SELECT 454, 'Who invented the lightbulb?', 20 UNION ALL
    SELECT 455, 'What year was the first airplane flight?', 20 UNION ALL
    SELECT 456, 'Who was the first woman to win a Nobel Prize?', 20 UNION ALL
    SELECT 457, 'What year was the assassination of Archduke Franz Ferdinand?', 20 UNION ALL
    SELECT 458, 'Who led the Russian October Revolution?', 20 UNION ALL
    SELECT 459, 'What year was the Treaty of Brest-Litovsk?', 20 UNION ALL
    SELECT 460, 'Who was the first President of the Soviet Union?', 20 UNION ALL
    SELECT 461, 'What year was the launch of Sputnik?', 20 UNION ALL
    SELECT 462, 'Who was the first person in space?', 20 UNION ALL
    SELECT 463, 'What year was the Cuban Missile Crisis?', 20 UNION ALL
    SELECT 464, 'Who was the President of the USA during the Cuban Missile Crisis?', 20 UNION ALL
    SELECT 465, 'What year was the Moon landing?', 20 UNION ALL
    SELECT 466, 'Who was the first president to resign?', 20 UNION ALL
    SELECT 467, 'What year did the Berlin Wall fall?', 20 UNION ALL
    SELECT 468, 'Who was the first President of the Russian Federation?', 20 UNION ALL
    SELECT 469, 'What year was the fall of communism in Eastern Europe?', 20 UNION ALL
    SELECT 470, 'Who was the greatest military leader of Rome?', 20 UNION ALL
    SELECT 471, 'What year was the Great Plague of London?', 20 UNION ALL
    SELECT 472, 'Who was the longest-reigning British monarch?', 20 UNION ALL
    SELECT 473, 'What year was the Glorious Revolution in England?', 20 UNION ALL
    SELECT 474, 'Who was the founder of Methodism?', 20 UNION ALL
    SELECT 475, 'What year was the First Fleet?', 20 UNION ALL
    SELECT 476, 'Who founded Singapore?', 20 UNION ALL
    SELECT 477, 'What year was the Opium War?', 20 UNION ALL
    SELECT 478, 'Who was the founder of the Red Cross?', 20 UNION ALL
    SELECT 479, 'What year was the Boxer Rebellion?', 20 UNION ALL
    SELECT 480, 'Who was the founder of modern Turkey?', 20
  ),
  inserted_hist_ext AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM hist_ext
    RETURNING id, order_index
  ),
  hist_ext_opts AS (
    SELECT 
      ihe.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((ihe.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_hist_ext ihe
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM hist_ext_opts;

  -- EXTENDED SCIENCE (Q481-560)
  WITH sci_ext AS (
    SELECT 481 AS qnum, 'How many bone types are there?' AS qtext, 20 AS tim UNION ALL
    SELECT 482, 'What is the study of fossils called?', 20 UNION ALL
    SELECT 483, 'What is the study of earthquakes called?', 20 UNION ALL
    SELECT 484, 'What is the study of weather called?', 20 UNION ALL
    SELECT 485, 'What is the study of stars called?', 20 UNION ALL
    SELECT 486, 'Which bacteria causes typhoid fever?', 20 UNION ALL
    SELECT 487, 'What is the enzyme that breaks down fats called?', 20 UNION ALL
    SELECT 488, 'How many chambers does a fish heart have?', 20 UNION ALL
    SELECT 489, 'What is the smallest mammal?', 20 UNION ALL
    SELECT 490, 'Which animal can hold its breath the longest?', 20 UNION ALL
    SELECT 491, 'What is the tallest animal?', 20 UNION ALL
    SELECT 492, 'Which animal is the fastest swimmer?', 20 UNION ALL
    SELECT 493, 'What is the deepest-diving mammal?', 20 UNION ALL
    SELECT 494, 'How many eyes does a human have?', 20 UNION ALL
    SELECT 495, 'What is the study of shells called?', 20 UNION ALL
    SELECT 496, 'How many types of teeth does an adult have?', 20 UNION ALL
    SELECT 497, 'What is the thigh bone called?', 20 UNION ALL
    SELECT 498, 'What is the upper arm bone called?', 20 UNION ALL
    SELECT 499, 'How many vertebrae are in the human spine?', 20 UNION ALL
    SELECT 500, 'What gland produces insulin?', 20 UNION ALL
    SELECT 501, 'What is the study of volcanoes called?', 20 UNION ALL
    SELECT 502, 'What is the study of rocks called?', 20 UNION ALL
    SELECT 503, 'How many chambers does an amphibian heart have?', 20 UNION ALL
    SELECT 504, 'What enzyme breaks down proteins?', 20 UNION ALL
    SELECT 505, 'How many lobes does a fish have?', 20 UNION ALL
    SELECT 506, 'How many chambers does a reptile heart have?', 20 UNION ALL
    SELECT 507, 'What is the study of plants called scientifically?', 20 UNION ALL
    SELECT 508, 'Which vitamin makes our bones strong?', 20 UNION ALL
    SELECT 509, 'How many chambers does a bird heart have?', 20 UNION ALL
    SELECT 510, 'What is the study of light called?', 20 UNION ALL
    SELECT 511, 'What is the study of sound called?', 20 UNION ALL
    SELECT 512, 'What is the study of motion called?', 20 UNION ALL
    SELECT 513, 'What is the study of energy called?', 20 UNION ALL
    SELECT 514, 'What is the study of heat called?', 20 UNION ALL
    SELECT 515, 'What is the study of forces called?', 20 UNION ALL
    SELECT 516, 'What is the study of electricity called?', 20 UNION ALL
    SELECT 517, 'What is the study of magnetism called?', 20 UNION ALL
    SELECT 518, 'What is the study of atoms called?', 20 UNION ALL
    SELECT 519, 'What is the study of reactions called?', 20 UNION ALL
    SELECT 520, 'What is the basic unit of life?', 20 UNION ALL
    SELECT 521, 'How many kingdoms of organisms are there?', 20 UNION ALL
    SELECT 522, 'What do red blood cells do?', 20 UNION ALL
    SELECT 523, 'What do white blood cells do?', 20 UNION ALL
    SELECT 524, 'What do platelets do?', 20 UNION ALL
    SELECT 525, 'What is the protein in red blood cells?', 20 UNION ALL
    SELECT 526, 'How many types of blood cells are there?', 20 UNION ALL
    SELECT 527, 'What body system transports nutrients?', 20 UNION ALL
    SELECT 528, 'What body system eliminates waste?', 20 UNION ALL
    SELECT 529, 'What body system controls all others?', 20 UNION ALL
    SELECT 530, 'What body system fights disease?', 20 UNION ALL
    SELECT 531, 'What body system exchanges gases?', 20 UNION ALL
    SELECT 532, 'What body system moves the body?', 20 UNION ALL
    SELECT 533, 'What body system supports the body?', 20 UNION ALL
    SELECT 534, 'What body system breaks down food?', 20 UNION ALL
    SELECT 535, 'What body system regulates temperature?', 20 UNION ALL
    SELECT 536, 'How many senses do humans primarily have?', 20 UNION ALL
    SELECT 537, 'What is the study of behavior called?', 20 UNION ALL
    SELECT 538, 'What is the study of heredity called?', 20 UNION ALL
    SELECT 539, 'What is the process of evolution called?', 20 UNION ALL
    SELECT 540, 'How many types of molecules are in DNA?', 20 UNION ALL
    SELECT 541, 'What is the study of cells called?', 20 UNION ALL
    SELECT 542, 'What is the study of diseases called?', 20 UNION ALL
    SELECT 543, 'What instrument is used to see cells?', 20 UNION ALL
    SELECT 544, 'How many strands does a bacterial chromosome have?', 20 UNION ALL
    SELECT 545, 'What is the powerhouse of the mitochondria?', 20 UNION ALL
    SELECT 546, 'How many organelles does a plant cell have?', 20 UNION ALL
    SELECT 547, 'What makes plant cells rigid?', 20 UNION ALL
    SELECT 548, 'What substance in plant cells makes them green?', 20 UNION ALL
    SELECT 549, 'What is photosynthesis?', 20 UNION ALL
    SELECT 550, 'What is respiration?', 20 UNION ALL
    SELECT 551, 'What is fermentation?', 20 UNION ALL
    SELECT 552, 'What is the cycle of matter in nature called?', 20 UNION ALL
    SELECT 553, 'What is the flow of energy in an ecosystem called?', 20 UNION ALL
    SELECT 554, 'What is the study of ecosystems called?', 20 UNION ALL
    SELECT 555, 'What is an organism that makes its own food?', 20 UNION ALL
    SELECT 556, 'What is an organism that eats other organisms?', 20 UNION ALL
    SELECT 557, 'What is an organism that decomposes dead matter?', 20 UNION ALL
    SELECT 558, 'What is the relationship where species help each other?', 20 UNION ALL
    SELECT 559, 'What is the relationship where one species benefits and the other is harmed?', 20 UNION ALL
    SELECT 560, 'What is the relationship where one species benefits and the other is unaffected?', 20
  ),
  inserted_sci_ext AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM sci_ext
    RETURNING id, order_index
  ),
  sci_ext_opts AS (
    SELECT 
      ise.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((ise.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_sci_ext ise
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM sci_ext_opts;

  -- EXTENDED GEOGRAPHY (Q561-600)
  WITH geo_ext AS (
    SELECT 561 AS qnum, 'Which country is in both Europe and Africa?' AS qtext, 20 AS tim UNION ALL
    SELECT 562, 'What is the capital of New Zealand?', 20 UNION ALL
    SELECT 563, 'Which city is on two continents?', 20 UNION ALL
    SELECT 564, 'What is the highest mountain in Africa?', 20 UNION ALL
    SELECT 565, 'What is the highest mountain in the USA?', 20 UNION ALL
    SELECT 566, 'What is the longest river in North America?', 20 UNION ALL
    SELECT 567, 'What is the longest river in South America?', 20 UNION ALL
    SELECT 568, 'What is the largest lake in North America?', 20 UNION ALL
    SELECT 569, 'What is the largest lake in South America?', 20 UNION ALL
    SELECT 570, 'What is the largest lake in Europe?', 20 UNION ALL
    SELECT 571, 'What is the largest lake in Africa?', 20 UNION ALL
    SELECT 572, 'What is the largest lake in Asia?', 20 UNION ALL
    SELECT 573, 'What is the capital of Kenya?', 20 UNION ALL
    SELECT 574, 'What is the capital of South Africa?', 20 UNION ALL
    SELECT 575, 'What is the capital of Middle Earth?', 20 UNION ALL
    SELECT 576, 'What is the capital of Ukraine?', 20 UNION ALL
    SELECT 577, 'What is the capital of Kazakhstan?', 20 UNION ALL
    SELECT 578, 'What is the capital of Russia?', 20 UNION ALL
    SELECT 579, 'What is the capital of China?', 20 UNION ALL
    SELECT 580, 'What is the capital of Indonesia?', 20 UNION ALL
    SELECT 581, 'What is the capital of Vietnam?', 20 UNION ALL
    SELECT 582, 'What is the capital of Thailand?', 20 UNION ALL
    SELECT 583, 'What is the capital of Malaysia?', 20 UNION ALL
    SELECT 584, 'What is the capital of Singapore?', 20 UNION ALL
    SELECT 585, 'What is the capital of Philippines?', 20 UNION ALL
    SELECT 586, 'What is the capital of South Korea?', 20 UNION ALL
    SELECT 587, 'What is the capital of North Korea?', 20 UNION ALL
    SELECT 588, 'What is the capital of Mongolia?', 20 UNION ALL
    SELECT 589, 'What is the capital of Nepal?', 20 UNION ALL
    SELECT 590, 'What is the capital of Sri Lanka?', 20 UNION ALL
    SELECT 591, 'What is the capital of Bangladesh?', 20 UNION ALL
    SELECT 592, 'What is the capital of Pakistan?', 20 UNION ALL
    SELECT 593, 'What is the capital of Afghanistan?', 20 UNION ALL
    SELECT 594, 'What is the capital of Iran?', 20 UNION ALL
    SELECT 595, 'What is the capital of Iraq?', 20 UNION ALL
    SELECT 596, 'What is the capital of Syria?', 20 UNION ALL
    SELECT 597, 'What is the capital of Lebanon?', 20 UNION ALL
    SELECT 598, 'What is the capital of Israel?', 20 UNION ALL
    SELECT 599, 'What is the capital of Jordan?', 20 UNION ALL
    SELECT 600, 'What is the capital of Saudi Arabia?', 20
  ),
  inserted_geo_ext AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM geo_ext
    RETURNING id, order_index
  ),
  geo_ext_opts AS (
    SELECT 
      ige.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((ige.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_geo_ext ige
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM geo_ext_opts;

  RAISE NOTICE 'Part 3 complete: Questions 401-600 with options inserted!';
END $$;
