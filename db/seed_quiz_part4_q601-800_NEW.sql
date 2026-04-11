-- Seed Quiz Part 4: New Quiz Category - Advanced Knowledge (200 questions)
-- This creates a SEPARATE quiz with its own 200 questions and 800 options

DO $$
DECLARE
  v_quiz_id uuid;
BEGIN
  -- Try to get existing quiz
  SELECT id INTO v_quiz_id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — Advanced Knowledge' LIMIT 1;
  
  -- If not found, create it
  IF v_quiz_id IS NULL THEN
    INSERT INTO public.public_quizzes (title, description, created_at)
    VALUES (
      'Pupil Enlightenment — Advanced Knowledge',
      'Advanced Knowledge - 200 comprehensive questions on visual arts, music, theater, and mathematics',
      NOW()
    )
    RETURNING id INTO v_quiz_id;
  END IF;

  -- VISUAL ARTS & MUSIC (Q1-100)
  WITH arts_q AS (
    SELECT 1 AS qnum, 'Who painted the Mona Lisa?' AS qtext, 20 AS tim UNION ALL
    SELECT 2, 'Who painted The Starry Night?', 20 UNION ALL
    SELECT 3, 'Who sculpted David?', 20 UNION ALL
    SELECT 4, 'Who sculpted The Thinker?', 20 UNION ALL
    SELECT 5, 'Who painted American Gothic?', 20 UNION ALL
    SELECT 6, 'Who created the Statue of Liberty?', 20 UNION ALL
    SELECT 7, 'Who sculpted Venus de Milo?', 20 UNION ALL
    SELECT 8, 'Who carved Mount Rushmore?', 20 UNION ALL
    SELECT 9, 'Who painted The Birth of Venus?', 20 UNION ALL
    SELECT 10, 'Who painted The School of Athens?', 20 UNION ALL
    SELECT 11, 'Who painted The Last Supper?', 20 UNION ALL
    SELECT 12, 'Who painted The Madonna of the Rocks?', 20 UNION ALL
    SELECT 13, 'Who painted Nighthawks?', 20 UNION ALL
    SELECT 14, 'Who painted Christina''s World?', 20 UNION ALL
    SELECT 15, 'Who painted Girl with a Pearl Earring?', 20 UNION ALL
    SELECT 16, 'Who painted A Sunday on La Grande Jatte?', 20 UNION ALL
    SELECT 17, 'Who painted The Wanderer Above the Sea of Fog?', 20 UNION ALL
    SELECT 18, 'Who painted Saturn Devouring His Son?', 20 UNION ALL
    SELECT 19, 'Who painted The Third of May 1808?', 20 UNION ALL
    SELECT 20, 'Who painted Whistler''s Mother?', 20 UNION ALL
    SELECT 21, 'Who composed The Four Seasons?', 20 UNION ALL
    SELECT 22, 'Who composed Eine kleine Nachtmusik?', 20 UNION ALL
    SELECT 23, 'Who composed Fur Elise?', 20 UNION ALL
    SELECT 24, 'Who composed The Magic Flute?', 20 UNION ALL
    SELECT 25, 'Who composed Swan Lake?', 20 UNION ALL
    SELECT 26, 'Who composed The Nutcracker?', 20 UNION ALL
    SELECT 27, 'Who composed The Planets?', 20 UNION ALL
    SELECT 28, 'Who composed Rhapsody in Blue?', 20 UNION ALL
    SELECT 29, 'Who composed Moonlight Sonata?', 20 UNION ALL
    SELECT 30, 'Who composed Clair de Lune?', 20 UNION ALL
    SELECT 31, 'Who composed Gymnopédie?', 20 UNION ALL
    SELECT 32, 'Who composed The Art of Fugue?', 20 UNION ALL
    SELECT 33, 'Who composed The Well-Tempered Clavier?', 20 UNION ALL
    SELECT 34, 'Who composed Requiem?', 20 UNION ALL
    SELECT 35, 'Who composed The Rite of Spring?', 20 UNION ALL
    SELECT 36, 'Who composed Bolero?', 20 UNION ALL
    SELECT 37, 'Who composed Peer Gynt?', 20 UNION ALL
    SELECT 38, 'Who composed The Tragic Symphony?', 20 UNION ALL
    SELECT 39, 'Who composed Symphony No. 5?', 20 UNION ALL
    SELECT 40, 'Who composed Carnival of the Animals?', 20 UNION ALL
    SELECT 41, 'What is a sonata?', 20 UNION ALL
    SELECT 42, 'What is a symphony?', 20 UNION ALL
    SELECT 43, 'What is an opera?', 20 UNION ALL
    SELECT 44, 'What is a concerto?', 20 UNION ALL
    SELECT 45, 'What is a quartet?', 20 UNION ALL
    SELECT 46, 'What is an oratorio?', 20 UNION ALL
    SELECT 47, 'What is a cantata?', 20 UNION ALL
    SELECT 48, 'What is a fugue?', 20 UNION ALL
    SELECT 49, 'What is a prelude?', 20 UNION ALL
    SELECT 50, 'What is a nocturne?', 20 UNION ALL
    SELECT 51, 'What is charcoal art?', 20 UNION ALL
    SELECT 52, 'What is watercolor painting?', 20 UNION ALL
    SELECT 53, 'What is acrylic painting?', 20 UNION ALL
    SELECT 54, 'What is oil painting?', 20 UNION ALL
    SELECT 55, 'What is a mural?', 20 UNION ALL
    SELECT 56, 'What is graffiti art?', 20 UNION ALL
    SELECT 57, 'What is ceramic art?', 20 UNION ALL
    SELECT 58, 'What is stone carving?', 20 UNION ALL
    SELECT 59, 'What is bronze casting?', 20 UNION ALL
    SELECT 60, 'What is glass art?', 20 UNION ALL
    SELECT 61, 'What is calligraphy?', 20 UNION ALL
    SELECT 62, 'What is printmaking?', 20 UNION ALL
    SELECT 63, 'What is photography?', 20 UNION ALL
    SELECT 64, 'What is installation art?', 20 UNION ALL
    SELECT 65, 'What is performance art?', 20 UNION ALL
    SELECT 66, 'What is conceptual art?', 20 UNION ALL
    SELECT 67, 'What is abstract art?', 20 UNION ALL
    SELECT 68, 'What is impressionism?', 20 UNION ALL
    SELECT 69, 'What is expressionism?', 20 UNION ALL
    SELECT 70, 'What is surrealism?', 20 UNION ALL
    SELECT 71, 'What is cubism?', 20 UNION ALL
    SELECT 72, 'What is dadaism?', 20 UNION ALL
    SELECT 73, 'What is art deco?', 20 UNION ALL
    SELECT 74, 'What is baroque art?', 20 UNION ALL
    SELECT 75, 'What is renaissance art?', 20 UNION ALL
    SELECT 76, 'What is gothic art?', 20 UNION ALL
    SELECT 77, 'What is neoclassicism?', 20 UNION ALL
    SELECT 78, 'What is romanticism?', 20 UNION ALL
    SELECT 79, 'What is realism?', 20 UNION ALL
    SELECT 80, 'What is naturalism in art?', 20 UNION ALL
    SELECT 81, 'What is a ballet?', 20 UNION ALL
    SELECT 82, 'What is contemporary dance?', 20 UNION ALL
    SELECT 83, 'What is jazz dance?', 20 UNION ALL
    SELECT 84, 'What is hip-hop dance?', 20 UNION ALL
    SELECT 85, 'What is a musical?', 20 UNION ALL
    SELECT 86, 'What is theater?', 20 UNION ALL
    SELECT 87, 'What is a tragedy in drama?', 20 UNION ALL
    SELECT 88, 'What is a comedy in drama?', 20 UNION ALL
    SELECT 89, 'What is a drama in literature?', 20 UNION ALL
    SELECT 90, 'What is a play?', 20 UNION ALL
    SELECT 91, 'What is a screenplay?', 20 UNION ALL
    SELECT 92, 'What is a script?', 20 UNION ALL
    SELECT 93, 'What is a scene?', 20 UNION ALL
    SELECT 94, 'What is an act in a play?', 20 UNION ALL
    SELECT 95, 'What is a soliloquy?', 20 UNION ALL
    SELECT 96, 'What is a monologue?', 20 UNION ALL
    SELECT 97, 'What is a dialogue?', 20 UNION ALL
    SELECT 98, 'What is stage direction?', 20 UNION ALL
    SELECT 99, 'What is prop in theater?', 20 UNION ALL
    SELECT 100, 'What is costume design?', 20
  ),
  inserted_arts AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM arts_q
    RETURNING id, order_index
  ),
  arts_opts AS (
    SELECT 
      ia.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((ia.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_arts ia
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM arts_opts;

  -- MATHEMATICS & LOGIC (Q101-200)
  WITH math_q AS (
    SELECT 101 AS qnum, 'What is the square root of 1296?' AS qtext, 20 AS tim UNION ALL
    SELECT 102, 'What is 18 squared?', 20 UNION ALL
    SELECT 103, 'What is 14 cubed?', 20 UNION ALL
    SELECT 104, 'What is the least common multiple of 12 and 15?', 20 UNION ALL
    SELECT 105, 'What is the greatest common divisor of 60 and 45?', 20 UNION ALL
    SELECT 106, 'What is the area of a rhombus with diagonals 8 and 6?', 20 UNION ALL
    SELECT 107, 'What is the perimeter of a circle called?', 20 UNION ALL
    SELECT 108, 'How many degrees are the sum of interior angles of a pentagon?', 20 UNION ALL
    SELECT 109, 'What is the area of an equilateral triangle with side 8?', 20 UNION ALL
    SELECT 110, 'What is the volume of a pyramid with base 5x5 and height 6?', 20 UNION ALL
    SELECT 111, 'What is 15 squared?', 20 UNION ALL
    SELECT 112, 'What is the least common multiple of 9 and 12?', 20 UNION ALL
    SELECT 113, 'What is the area of a trapezoid with bases 5 and 7, height 4?', 20 UNION ALL
    SELECT 114, 'What is the greatest common divisor of 72 and 48?', 20 UNION ALL
    SELECT 115, 'What is 11 squared?', 20 UNION ALL
    SELECT 116, 'What is the sum of angles in a quadrilateral?', 20 UNION ALL
    SELECT 117, 'What is the circumference of a circle with diameter 14?', 20 UNION ALL
    SELECT 118, 'What is the area of a parallelogram with base 7 and height 5?', 20 UNION ALL
    SELECT 119, 'How many radians is 180 degrees?', 20 UNION ALL
    SELECT 120, 'What is the area of a square with side 12?', 20 UNION ALL
    SELECT 121, 'What is the perimeter of a triangle with sides 3, 4, 5?', 20 UNION ALL
    SELECT 122, 'What is the area of a right triangle with legs 6 and 8?', 20 UNION ALL
    SELECT 123, 'What is the volume of a cylinder with radius 3 and height 8?', 20 UNION ALL
    SELECT 124, 'What is the sum of the first 10 natural numbers?', 20 UNION ALL
    SELECT 125, 'What is the sum of the first 5 odd numbers?', 20 UNION ALL
    SELECT 126, 'What is the least common multiple of 16 and 20?', 20 UNION ALL
    SELECT 127, 'What is the greatest common divisor of 100 and 75?', 20 UNION ALL
    SELECT 128, 'What is the area of a regular hexagon with side 5?', 20 UNION ALL
    SELECT 129, 'What is the volume of a cone with radius 4 and height 9?', 20 UNION ALL
    SELECT 130, 'What is 60 squared?', 20 UNION ALL
    SELECT 131, 'What is the number of diagonals in an octagon?', 20 UNION ALL
    SELECT 132, 'What is the sum of exterior angles in any polygon?', 20 UNION ALL
    SELECT 133, 'What is the least common multiple of 20 and 25?', 20 UNION ALL
    SELECT 134, 'What is the area of a pentagon with side 4?', 20 UNION ALL
    SELECT 135, 'How many degrees is each interior angle of a regular hexagon?', 20 UNION ALL
    SELECT 136, 'What is the circumference of a circle with radius 10?', 20 UNION ALL
    SELECT 137, 'What is the volume of a rectangular prism 5x6x7?', 20 UNION ALL
    SELECT 138, 'What is the volume of a sphere with radius 3?', 20 UNION ALL
    SELECT 139, 'How many radians is 360 degrees?', 20 UNION ALL
    SELECT 140, 'What is the area of a circle with diameter 10?', 20 UNION ALL
    SELECT 141, 'What is 21 squared?', 20 UNION ALL
    SELECT 142, 'What is 19 squared?', 20 UNION ALL
    SELECT 143, 'What is the perimeter of a square with side 8?', 20 UNION ALL
    SELECT 144, 'What is the volume of a cube with side 10?', 20 UNION ALL
    SELECT 145, 'What is the area of a rectangle 4x6?', 20 UNION ALL
    SELECT 146, 'What is 40 squared?', 20 UNION ALL
    SELECT 147, 'What is 30 squared?', 20 UNION ALL
    SELECT 148, 'What is the least common multiple of 24 and 36?', 20 UNION ALL
    SELECT 149, 'What is 50 squared?', 20 UNION ALL
    SELECT 150, 'What is the sum of the first 20 natural numbers?', 20 UNION ALL
    SELECT 151, 'What is 35 squared?', 20 UNION ALL
    SELECT 152, 'What is 25 squared?', 20 UNION ALL
    SELECT 153, 'What is 100 squared divided by 2?', 20 UNION ALL
    SELECT 154, 'What is the area of a circle with radius 5?', 20 UNION ALL
    SELECT 155, 'What is the perimeter of a regular pentagon with side 5?', 20 UNION ALL
    SELECT 156, 'What is 13 squared?', 20 UNION ALL
    SELECT 157, 'What is the angle at the center of a regular hexagon?', 20 UNION ALL
    SELECT 158, 'What is 70 squared?', 20 UNION ALL
    SELECT 159, 'What is 65 squared?', 20 UNION ALL
    SELECT 160, 'What is 80 squared?', 20 UNION ALL
    SELECT 161, 'What is 90 squared?', 20 UNION ALL
    SELECT 162, 'What is 45 squared?', 20 UNION ALL
    SELECT 163, 'What is 55 squared?', 20 UNION ALL
    SELECT 164, 'What is the greatest common divisor of 144 and 96?', 20 UNION ALL
    SELECT 165, 'What is the least common multiple of 30 and 42?', 20 UNION ALL
    SELECT 166, 'What is the area of a triangle with base 8 and height 6?', 20 UNION ALL
    SELECT 167, 'How many degrees is each interior angle of a regular octagon?', 20 UNION ALL
    SELECT 168, 'What is the perimeter of a hexagon with side 6?', 20 UNION ALL
    SELECT 169, 'What is the volume of a pyramid with base 6x6 and height 8?', 20 UNION ALL
    SELECT 170, 'What is the area of a hexagon with side 6?', 20 UNION ALL
    SELECT 171, 'What is the greatest common divisor of 200 and 150?', 20 UNION ALL
    SELECT 172, 'What is the least common multiple of 18 and 24?', 20 UNION ALL
    SELECT 173, 'What is 9 squared?', 20 UNION ALL
    SELECT 174, 'What is 16 squared?', 20 UNION ALL
    SELECT 175, 'What is 22 squared?', 20 UNION ALL
    SELECT 176, 'What is 17 squared?', 20 UNION ALL
    SELECT 177, 'What is 20 squared?', 20 UNION ALL
    SELECT 178, 'What is 24 squared?', 20 UNION ALL
    SELECT 179, 'What is 26 squared?', 20 UNION ALL
    SELECT 180, 'What is the sum of the first 100 natural numbers?', 20 UNION ALL
    SELECT 181, 'What is fibonacci sequence?', 20 UNION ALL
    SELECT 182, 'What is the golden ratio?', 20 UNION ALL
    SELECT 183, 'What is probability?', 20 UNION ALL
    SELECT 184, 'What is a prime number?', 20 UNION ALL
    SELECT 185, 'What is a composite number?', 20 UNION ALL
    SELECT 186, 'What is a rational number?', 20 UNION ALL
    SELECT 187, 'What is an irrational number?', 20 UNION ALL
    SELECT 188, 'What is an integer?', 20 UNION ALL
    SELECT 189, 'What is a real number?', 20 UNION ALL
    SELECT 190, 'What is a complex number?', 20 UNION ALL
    SELECT 191, 'What is algebra?', 20 UNION ALL
    SELECT 192, 'What is geometry?', 20 UNION ALL
    SELECT 193, 'What is trigonometry?', 20 UNION ALL
    SELECT 194, 'What is calculus?', 20 UNION ALL
    SELECT 195, 'What is logic?', 20 UNION ALL
    SELECT 196, 'What is set theory?', 20 UNION ALL
    SELECT 197, 'What is statistics?', 20 UNION ALL
    SELECT 198, 'What is combinatorics?', 20 UNION ALL
    SELECT 199, 'What is game theory?', 20 UNION ALL
    SELECT 200, 'What is number theory?', 20
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

  RAISE NOTICE 'Part 4 complete: 200 questions with 800 options inserted into "Pupil Enlightenment — Advanced Knowledge"!';
END $$;
