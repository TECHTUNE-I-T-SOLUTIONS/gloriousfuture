-- Seed Quiz Part 2: New Quiz Category - Sports, Technology & Politics (200 questions)
-- This creates a SEPARATE quiz with its own 200 questions and 800 options

DO $$
DECLARE
  v_quiz_id uuid;
BEGIN
  -- Try to get existing quiz
  SELECT id INTO v_quiz_id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — Sports, Technology & Politics' LIMIT 1;
  
  -- If not found, create it
  IF v_quiz_id IS NULL THEN
    INSERT INTO public.public_quizzes (title, description, created_at)
    VALUES (
      'Pupil Enlightenment — Sports, Technology & Politics',
      'Sports, Technology & Politics - 200 comprehensive questions on sports, tech companies, and world governance',
      NOW()
    )
    RETURNING id INTO v_quiz_id;
  END IF;

  -- SPORTS & ENTERTAINMENT (Q1-80)
  WITH sports_q AS (
    SELECT 1 AS qnum, 'How many players are on a basketball team on court?' AS qtext, 20 AS tim UNION ALL
    SELECT 2, 'Which country won the most FIFA World Cups?', 20 UNION ALL
    SELECT 3, 'How many strikes is an out in baseball?', 20 UNION ALL
    SELECT 4, 'What is the maximum score in a single frame in bowling?', 20 UNION ALL
    SELECT 5, 'How many points is a touchdown worth in football?', 20 UNION ALL
    SELECT 6, 'What is the standard height of a basketball hoop?', 20 UNION ALL
    SELECT 7, 'How many players are on an ice hockey team on ice?', 20 UNION ALL
    SELECT 8, 'What is the length of a tennis court?', 20 UNION ALL
    SELECT 9, 'How many rounds in a professional boxing match?', 20 UNION ALL
    SELECT 10, 'What sport is played at Wimbledon?', 20 UNION ALL
    SELECT 11, 'How many sets does a tennis match typically require?', 20 UNION ALL
    SELECT 12, 'How long is a standard Olympic swimming pool?', 20 UNION ALL
    SELECT 13, 'How many times has India won the Cricket World Cup?', 20 UNION ALL
    SELECT 14, 'What is the maximum break in snooker?', 20 UNION ALL
    SELECT 15, 'How many holes are in a standard golf course?', 20 UNION ALL
    SELECT 16, 'What sport is played at the Australian Open?', 20 UNION ALL
    SELECT 17, 'How many players are on a volleyball team on court?', 20 UNION ALL
    SELECT 18, 'How many innings in a baseball game?', 20 UNION ALL
    SELECT 19, 'How many players are on an American football team on field?', 20 UNION ALL
    SELECT 20, 'What sport is played at the Masters Tournament?', 20 UNION ALL
    SELECT 21, 'How many pins in ten-pin bowling?', 20 UNION ALL
    SELECT 22, 'What sport is played at Daytona?', 20 UNION ALL
    SELECT 23, 'What is a birdie in golf?', 20 UNION ALL
    SELECT 24, 'What sport uses a net and a shuttlecock?', 20 UNION ALL
    SELECT 25, 'How many points for a field goal in basketball?', 20 UNION ALL
    SELECT 26, 'How many quarters in an NFL football game?', 20 UNION ALL
    SELECT 27, 'What sport is played at Roland Garros?', 20 UNION ALL
    SELECT 28, 'How many players in a cricket team batting?', 20 UNION ALL
    SELECT 29, 'How many overs in a one-day cricket match?', 20 UNION ALL
    SELECT 30, 'What sport is played at the US Open?', 20 UNION ALL
    SELECT 31, 'How many teams in the NBA?', 20 UNION ALL
    SELECT 32, 'How many teams in the NFL?', 20 UNION ALL
    SELECT 33, 'How many players are in a water polo team on water?', 20 UNION ALL
    SELECT 34, 'What sport uses a puck?', 20 UNION ALL
    SELECT 35, 'What is a par in golf?', 20 UNION ALL
    SELECT 36, 'What sport is most watched worldwide?', 20 UNION ALL
    SELECT 37, 'Which actor played Batman in Christopher Nolan''s trilogy?', 20 UNION ALL
    SELECT 38, 'What is the highest-grossing film of all time?', 20 UNION ALL
    SELECT 39, 'How many Academy Awards did Titanic win?', 20 UNION ALL
    SELECT 40, 'Which film won Best Picture at the 2009 Oscars?', 20 UNION ALL
    SELECT 41, 'What is the Marvel Cinematic Universe''s first film?', 20 UNION ALL
    SELECT 42, 'Which actor played Iron Man in the MCU?', 20 UNION ALL
    SELECT 43, 'How many Harry Potter films are there?', 20 UNION ALL
    SELECT 44, 'Which film franchise has the most movies?', 20 UNION ALL
    SELECT 45, 'What year was the first Avengers film released?', 20 UNION ALL
    SELECT 46, 'Who directed Inception?', 20 UNION ALL
    SELECT 47, 'How many Star Wars trilogies are there?', 20 UNION ALL
    SELECT 48, 'What was the first animated feature film?', 20 UNION ALL
    SELECT 49, 'Which country produces the most films annually?', 20 UNION ALL
    SELECT 50, 'How many James Bond films are there?', 20 UNION ALL
    SELECT 51, 'What was the first James Bond film called?', 20 UNION ALL
    SELECT 52, 'Which actor appeared in the most James Bond films?', 20 UNION ALL
    SELECT 53, 'How many Marvel films are there in total?', 20 UNION ALL
    SELECT 54, 'Which director has won the most Academy Awards?', 20 UNION ALL
    SELECT 55, 'What year was the Academy Awards first held?', 20 UNION ALL
    SELECT 56, 'How many acting categories are there at the Oscars?', 20 UNION ALL
    SELECT 57, 'Which superhero film has the highest box office?', 20 UNION ALL
    SELECT 58, 'How many Pixar films have been released?', 20 UNION ALL
    SELECT 59, 'Which Disney animated film is highest-grossing?', 20 UNION ALL
    SELECT 60, 'What year was the first Disney film released?', 20 UNION ALL
    SELECT 61, 'How many live-action Disney remakes have been made?', 20 UNION ALL
    SELECT 62, 'Which TV show won the most Emmy Awards?', 20 UNION ALL
    SELECT 63, 'How many seasons of Game of Thrones are there?', 20 UNION ALL
    SELECT 64, 'What is the longest-running TV series?', 20 UNION ALL
    SELECT 65, 'How many episodes of Friends are there?', 20 UNION ALL
    SELECT 66, 'Which actor has won the most Golden Globes?', 20 UNION ALL
    SELECT 67, 'What is the most-watched Super Bowl?', 20 UNION ALL
    SELECT 68, 'How many Grammy Awards are given annually?', 20 UNION ALL
    SELECT 69, 'Which artist has won the most Grammys?', 20 UNION ALL
    SELECT 70, 'What is the Billboard Hot 100?', 20 UNION ALL
    SELECT 71, 'How many Beatles albums are there?', 20 UNION ALL
    SELECT 72, 'Which band has the most platinum certifications?', 20 UNION ALL
    SELECT 73, 'What year was the first MTV Video Music Award?', 20 UNION ALL
    SELECT 74, 'What is the most-streamed song on Spotify?', 20 UNION ALL
    SELECT 75, 'What is the largest music festival by attendance?', 20 UNION ALL
    SELECT 76, 'Which album is the best-selling of all time?', 20 UNION ALL
    SELECT 77, 'Which artist has sold the most albums?', 20 UNION ALL
    SELECT 78, 'How many musicians are in an orchestra?', 20 UNION ALL
    SELECT 79, 'How many keys does a piano have?', 20 UNION ALL
    SELECT 80, 'Which instrument is played with a bow?', 20
  ),
  inserted_sports AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM sports_q
    RETURNING id, order_index
  ),
  sports_opts AS (
    SELECT 
      isp.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((isp.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_sports isp
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM sports_opts;

  -- TECHNOLOGY (Q81-140)
  WITH tech_q AS (
    SELECT 81 AS qnum, 'Who invented the World Wide Web?' AS qtext, 20 AS tim UNION ALL
    SELECT 82, 'What year was the internet first publicly available?', 20 UNION ALL
    SELECT 83, 'Which company created Android?', 20 UNION ALL
    SELECT 84, 'What does AI stand for?', 20 UNION ALL
    SELECT 85, 'Who is the founder of Microsoft?', 20 UNION ALL
    SELECT 86, 'Which company owns Instagram?', 20 UNION ALL
    SELECT 87, 'What does GPU stand for?', 20 UNION ALL
    SELECT 88, 'Who founded Python programming?', 20 UNION ALL
    SELECT 89, 'What year was Facebook founded?', 20 UNION ALL
    SELECT 90, 'Which tech company has the largest market cap?', 20 UNION ALL
    SELECT 91, 'What does HTML stand for?', 20 UNION ALL
    SELECT 92, 'Who founded Apple Computer?', 20 UNION ALL
    SELECT 93, 'What does SQL stand for?', 20 UNION ALL
    SELECT 94, 'Which company invented the smartphone?', 20 UNION ALL
    SELECT 95, 'What year was YouTube founded?', 20 UNION ALL
    SELECT 96, 'Who is the current CEO of Tesla?', 20 UNION ALL
    SELECT 97, 'What does API stand for?', 20 UNION ALL
    SELECT 98, 'Which programming language is most popular?', 20 UNION ALL
    SELECT 99, 'What year was Amazon founded?', 20 UNION ALL
    SELECT 100, 'Who founded Google?', 20 UNION ALL
    SELECT 101, 'What does URL stand for?', 20 UNION ALL
    SELECT 102, 'Which company owns WhatsApp?', 20 UNION ALL
    SELECT 103, 'What does JSON stand for?', 20 UNION ALL
    SELECT 104, 'What year was Twitter founded?', 20 UNION ALL
    SELECT 105, 'Which company is known as the search engine?', 20 UNION ALL
    SELECT 106, 'What does VPN stand for?', 20 UNION ALL
    SELECT 107, 'Who is the founder of Oracle?', 20 UNION ALL
    SELECT 108, 'What does HTTPS stand for?', 20 UNION ALL
    SELECT 109, 'Which company owns GitHub?', 20 UNION ALL
    SELECT 110, 'What does IPv4 stand for?', 20 UNION ALL
    SELECT 111, 'Who created Java programming language?', 20 UNION ALL
    SELECT 112, 'What does IoT stand for?', 20 UNION ALL
    SELECT 113, 'Which company is famous for cloud computing?', 20 UNION ALL
    SELECT 114, 'What does JavaScript stand for?', 20 UNION ALL
    SELECT 115, 'Who founded Netflix?', 20 UNION ALL
    SELECT 116, 'What does CSS stand for?', 20 UNION ALL
    SELECT 117, 'Which company operates LinkedIn?', 20 UNION ALL
    SELECT 118, 'What does XML stand for?', 20 UNION ALL
    SELECT 119, 'Who founded Airbnb?', 20 UNION ALL
    SELECT 120, 'What does USB stand for?', 20 UNION ALL
    SELECT 121, 'How many bits are in a byte?', 20 UNION ALL
    SELECT 122, 'What does RAM stand for?', 20 UNION ALL
    SELECT 123, 'What does ROM stand for?', 20 UNION ALL
    SELECT 124, 'What is the smallest unit of data?', 20 UNION ALL
    SELECT 125, 'What does GB stand for?', 20 UNION ALL
    SELECT 126, 'Which has more storage: 1GB or 1MB?', 20 UNION ALL
    SELECT 127, 'What does WiFi stand for?', 20 UNION ALL
    SELECT 128, 'What does SSD stand for?', 20 UNION ALL
    SELECT 129, 'What does CPU stand for?', 20 UNION ALL
    SELECT 130, 'What does GPU stand for in computing?', 20 UNION ALL
    SELECT 131, 'How many gigabytes are in a terabyte?', 20 UNION ALL
    SELECT 132, 'What does HDD stand for?', 20 UNION ALL
    SELECT 133, 'What does ISP stand for?', 20 UNION ALL
    SELECT 134, 'What does LAN stand for?', 20 UNION ALL
    SELECT 135, 'What does WAN stand for?', 20 UNION ALL
    SELECT 136, 'What does FTP stand for?', 20 UNION ALL
    SELECT 137, 'What does HTTP stand for?', 20 UNION ALL
    SELECT 138, 'What does SMTP stand for?', 20 UNION ALL
    SELECT 139, 'What does DNS stand for?', 20 UNION ALL
    SELECT 140, 'What does DHCP stand for?', 20
  ),
  inserted_tech AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM tech_q
    RETURNING id, order_index
  ),
  tech_opts AS (
    SELECT 
      it.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((it.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_tech it
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM tech_opts;

  -- POLITICS & GOVERNMENT (Q141-200)
  WITH pol_q AS (
    SELECT 141 AS qnum, 'Who is the first US President?' AS qtext, 20 AS tim UNION ALL
    SELECT 142, 'How many members does the US Senate have?', 20 UNION ALL
    SELECT 143, 'What is the executive branch headed by?', 20 UNION ALL
    SELECT 144, 'How many states are in the USA?', 20 UNION ALL
    SELECT 145, 'Who is the current US President?', 20 UNION ALL
    SELECT 146, 'What is the highest court in the USA?', 20 UNION ALL
    SELECT 147, 'How many judges are on the Supreme Court?', 20 UNION ALL
    SELECT 148, 'What is the term length of a US President?', 20 UNION ALL
    SELECT 149, 'When was the US Constitution ratified?', 20 UNION ALL
    SELECT 150, 'How many amendments are in the US Constitution?', 20 UNION ALL
    SELECT 151, 'What is the UN Security Council?', 20 UNION ALL
    SELECT 152, 'How many permanent members in UN Security Council?', 20 UNION ALL
    SELECT 153, 'What is NATO''s primary purpose?', 20 UNION ALL
    SELECT 154, 'How many countries are in NATO?', 20 UNION ALL
    SELECT 155, 'Who is the Secretary General of the UN?', 20 UNION ALL
    SELECT 156, 'What is the primary language of the UN?', 20 UNION ALL
    SELECT 157, 'What is the headquarters of the UN?', 20 UNION ALL
    SELECT 158, 'Which country has the largest GDP?', 20 UNION ALL
    SELECT 159, 'What is the International Monetary Fund responsible for?', 20 UNION ALL
    SELECT 160, 'How many countries are in the European Union?', 20 UNION ALL
    SELECT 161, 'What is the headquarters of NATO?', 20 UNION ALL
    SELECT 162, 'What is the purpose of the World Health Organization?', 20 UNION ALL
    SELECT 163, 'How many countries are in ASEAN?', 20 UNION ALL
    SELECT 164, 'What is the headquarters of the African Union?', 20 UNION ALL
    SELECT 165, 'Which organization oversees international trade?', 20 UNION ALL
    SELECT 166, 'What is the primary language of the African Union?', 20 UNION ALL
    SELECT 167, 'Which country has the highest military spending?', 20 UNION ALL
    SELECT 168, 'What is the Organization of American States?', 20 UNION ALL
    SELECT 169, 'What does UNESCO stand for?', 20 UNION ALL
    SELECT 170, 'What is the primary mission of UNICEF?', 20 UNION ALL
    SELECT 171, 'What is the International Criminal Court located?', 20 UNION ALL
    SELECT 172, 'How many countries have nuclear weapons?', 20 UNION ALL
    SELECT 173, 'What is the peace prize awarded by the UN?', 20 UNION ALL
    SELECT 174, 'How many Nobel Prizes are awarded annually?', 20 UNION ALL
    SELECT 175, 'Which country has the most Nobel Prizes?', 20 UNION ALL
    SELECT 176, 'What categories are Nobel Prizes awarded in?', 20 UNION ALL
    SELECT 177, 'In which country are Nobel Prizes awarded?', 20 UNION ALL
    SELECT 178, 'What is the Pulitzer Prize?', 20 UNION ALL
    SELECT 179, 'Which country awards the Fields Medal?', 20 UNION ALL
    SELECT 180, 'What is the Turing Award in computing?', 20 UNION ALL
    SELECT 181, 'How many member states does the UN have?', 20 UNION ALL
    SELECT 182, 'What is the title of the UK head of state?', 20 UNION ALL
    SELECT 183, 'How many members in the European Parliament?', 20 UNION ALL
    SELECT 184, 'What is the capital of the UN?', 20 UNION ALL
    SELECT 185, 'How many permanent UN Security Council members are there?', 20 UNION ALL
    SELECT 186, 'What does OPEC stand for?', 20 UNION ALL
    SELECT 187, 'How many countries are in OPEC?', 20 UNION ALL
    SELECT 188, 'What is the Group of Seven (G7)?', 20 UNION ALL
    SELECT 189, 'How many countries are in the G20?', 20 UNION ALL
    SELECT 190, 'What is the BRICS?', 20 UNION ALL
    SELECT 191, 'How many countries are in the BRICS?', 20 UNION ALL
    SELECT 192, 'What does IMF stand for?', 20 UNION ALL
    SELECT 193, 'What does WTO stand for?', 20 UNION ALL
    SELECT 194, 'What does GATT stand for?', 20 UNION ALL
    SELECT 195, 'How many articles does the UN Charter have?', 20 UNION ALL
    SELECT 196, 'What year was the United Nations founded?', 20 UNION ALL
    SELECT 197, 'What year was NATO founded?', 20 UNION ALL
    SELECT 198, 'What year was the EU founded?', 20 UNION ALL
    SELECT 199, 'What year did the Cold War begin?', 20 UNION ALL
    SELECT 200, 'What year did the Cold War end?', 20
  ),
  inserted_pol AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM pol_q
    RETURNING id, order_index
  ),
  pol_opts AS (
    SELECT 
      ip.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((ip.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_pol ip
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM pol_opts;

  RAISE NOTICE 'Part 2 complete: 200 questions with 800 options inserted into "Pupil Enlightenment — Sports, Technology & Politics"!';
END $$;
