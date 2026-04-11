-- Seed Quiz Part 4: Questions 601-800 (Extended Knowledge - Arts, Science, Culture)
-- Run this fourth after Part 3 completes successfully

DO $$
DECLARE
  v_quiz_id uuid;
BEGIN
  SELECT id INTO v_quiz_id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — General Knowledge' LIMIT 1;

  -- EXTENDED LITERATURE & ARTS (Q601-720)
  WITH lit_ext AS (
    SELECT 601 AS qnum, 'Who painted the Mona Lisa?' AS qtext, 20 AS tim UNION ALL
    SELECT 602, 'Who sculpted David?', 20 UNION ALL
    SELECT 603, 'Who wrote the Iliad?', 20 UNION ALL
    SELECT 604, 'Who wrote the Odyssey?', 20 UNION ALL
    SELECT 605, 'Which playwright wrote Oedipus?', 20 UNION ALL
    SELECT 606, 'Who wrote Hamlet?', 20 UNION ALL
    SELECT 607, 'Who wrote Macbeth?', 20 UNION ALL
    SELECT 608, 'Who wrote A Midsummer Night''s Dream?', 20 UNION ALL
    SELECT 609, 'Who wrote The Tempest?', 20 UNION ALL
    SELECT 610, 'Who wrote Othello?', 20 UNION ALL
    SELECT 611, 'Who wrote The Merchant of Venice?', 20 UNION ALL
    SELECT 612, 'Who wrote The Taming of the Shrew?', 20 UNION ALL
    SELECT 613, 'Who wrote Much Ado About Nothing?', 20 UNION ALL
    SELECT 614, 'Who wrote Twelfth Night?', 20 UNION ALL
    SELECT 615, 'Who wrote The Comedy of Errors?', 20 UNION ALL
    SELECT 616, 'Who painted The Starry Night?', 20 UNION ALL
    SELECT 617, 'Who painted The Persistence of Memory?', 20 UNION ALL
    SELECT 618, 'Who sculpted The Thinker?', 20 UNION ALL
    SELECT 619, 'Who painted Nighthawks?', 20 UNION ALL
    SELECT 620, 'Who painted American Gothic?', 20 UNION ALL
    SELECT 621, 'Who created the statue Liberty?', 20 UNION ALL
    SELECT 622, 'Who sculpted the Venus de Milo?', 20 UNION ALL
    SELECT 623, 'Who carved Mount Rushmore?', 20 UNION ALL
    SELECT 624, 'Who painted The Birth of Venus?', 20 UNION ALL
    SELECT 625, 'Who painted The School of Athens?', 20 UNION ALL
    SELECT 626, 'Who painted The Last Supper?', 20 UNION ALL
    SELECT 627, 'Who painted The Madonna of the Rocks?', 20 UNION ALL
    SELECT 628, 'Who painted Nighthawks?', 20 UNION ALL
    SELECT 629, 'Who composed The Moonlit Night?', 20 UNION ALL
    SELECT 630, 'Who composed The Four Seasons?', 20 UNION ALL
    SELECT 631, 'Who composed Eine kleine Nachtmusik?', 20 UNION ALL
    SELECT 632, 'Who composed For Elise?', 20 UNION ALL
    SELECT 633, 'Who composed The Magic Flute?', 20 UNION ALL
    SELECT 634, 'Who composed Swan Lake?', 20 UNION ALL
    SELECT 635, 'Who composed The Nutcracker?', 20 UNION ALL
    SELECT 636, 'Who composed Fur Elise?', 20 UNION ALL
    SELECT 637, 'Who composed The Planets?', 20 UNION ALL
    SELECT 638, 'Who composed Rhapsody in Blue?', 20 UNION ALL
    SELECT 639, 'Who composed Moonlight Sonata?', 20 UNION ALL
    SELECT 640, 'Who composed Clair de Lune?', 20 UNION ALL
    SELECT 641, 'Who composed Gymnopédie?', 20 UNION ALL
    SELECT 642, 'Who composed The Art of Fugue?', 20 UNION ALL
    SELECT 643, 'Who composed The Well-Tempered Clavier?', 20 UNION ALL
    SELECT 644, 'Who composed Requiem?', 20 UNION ALL
    SELECT 645, 'Who composed The Rite of Spring?', 20 UNION ALL
    SELECT 646, 'Who composed Bolero?', 20 UNION ALL
    SELECT 647, 'Who composed Peer Gynt?', 20 UNION ALL
    SELECT 648, 'Who composed The Tragic Symphony?', 20 UNION ALL
    SELECT 649, 'Who wrote Don Quixote?', 20 UNION ALL
    SELECT 650, 'Who wrote The Count of Monte Cristo?', 20 UNION ALL
    SELECT 651, 'Who wrote The Three Musketeers?', 20 UNION ALL
    SELECT 652, 'Who wrote The Hunchback of Notre-Dame?', 20 UNION ALL
    SELECT 653, 'Who wrote The Man in the Iron Mask?', 20 UNION ALL
    SELECT 654, 'Who wrote The Invisible Man?', 20 UNION ALL
    SELECT 655, 'Who wrote 20,000 Leagues Under the Sea?', 20 UNION ALL
    SELECT 656, 'Who wrote Journey to the Center of the Earth?', 20 UNION ALL
    SELECT 657, 'Who wrote Around the World in 80 Days?', 20 UNION ALL
    SELECT 658, 'Who wrote Dr. Jekyll and Mr. Hyde?', 20 UNION ALL
    SELECT 659, 'Who wrote Treasure Island?', 20 UNION ALL
    SELECT 660, 'Who wrote Kidnapped?', 20 UNION ALL
    SELECT 661, 'Who wrote The Strange Case of Dr. Jekyll?', 20 UNION ALL
    SELECT 662, 'Who wrote Tess of the d''Urbervilles?', 20 UNION ALL
    SELECT 663, 'Who wrote Jude the Obscure?', 20 UNION ALL
    SELECT 664, 'Who wrote Far from the Madding Crowd?', 20 UNION ALL
    SELECT 665, 'Who wrote The Return of the Native?', 20 UNION ALL
    SELECT 666, 'Who wrote The Mayor of Casterbridge?', 20 UNION ALL
    SELECT 667, 'Who wrote Under the Greenwood Tree?', 20 UNION ALL
    SELECT 668, 'Who wrote Northanger Abbey?', 20 UNION ALL
    SELECT 669, 'Who wrote Lady Susan?', 20 UNION ALL
    SELECT 670, 'Who wrote Sense and Sensibility?', 20 UNION ALL
    SELECT 671, 'Who wrote The Tenant of Wildfell Hall?', 20 UNION ALL
    SELECT 672, 'Who wrote Agnes Grey?', 20 UNION ALL
    SELECT 673, 'Who wrote The Mysteries of Udolpho?', 20 UNION ALL
    SELECT 674, 'Who wrote The Italian?', 20 UNION ALL
    SELECT 675, 'Who wrote Evelina?', 20 UNION ALL
    SELECT 676, 'Who wrote Cecilia?', 20 UNION ALL
    SELECT 677, 'Who wrote Camilla?', 20 UNION ALL
    SELECT 678, 'Who wrote The Remains of the Day?', 20 UNION ALL
    SELECT 679, 'Who wrote Never Let Me Go?', 20 UNION ALL
    SELECT 680, 'Who wrote A Pale View of the Hills?', 20 UNION ALL
    SELECT 681, 'Who wrote The Buried Giant?', 20 UNION ALL
    SELECT 682, 'Who wrote Things Fall Apart?', 20 UNION ALL
    SELECT 683, 'Who wrote No Longer at Ease?', 20 UNION ALL
    SELECT 684, 'Who wrote Arrow of God?', 20 UNION ALL
    SELECT 685, 'Who wrote A Man of the People?', 20 UNION ALL
    SELECT 686, 'Who wrote Anthills of the Savannah?', 20 UNION ALL
    SELECT 687, 'Who wrote Half of a Yellow Sun?', 20 UNION ALL
    SELECT 688, 'Who wrote Americanah?', 20 UNION ALL
    SELECT 689, 'Who wrote Purple Hibiscus?', 20 UNION ALL
    SELECT 690, 'Who wrote One Hundred Years of Solitude?', 20 UNION ALL
    SELECT 691, 'Who wrote Love in the Time of Cholera?', 20 UNION ALL
    SELECT 692, 'Who wrote Chronicle of a Death Foretold?', 20 UNION ALL
    SELECT 693, 'Who wrote The Autumn of the Patriarch?', 20 UNION ALL
    SELECT 694, 'Who wrote In Evil Hour?', 20 UNION ALL
    SELECT 695, 'Who wrote The General in His Labyrinth?', 20 UNION ALL
    SELECT 696, 'Who wrote Memories of My Melancholy Whores?', 20 UNION ALL
    SELECT 697, 'Who wrote Living to Tell the Tale?', 20 UNION ALL
    SELECT 698, 'Who wrote Gabriel García Márquez?', 20 UNION ALL
    SELECT 699, 'What is the art of beautiful writing called?', 20 UNION ALL
    SELECT 700, 'What is the art of carving called?', 20 UNION ALL
    SELECT 701, 'What is the art of pottery called?', 20 UNION ALL
    SELECT 702, 'What is the art of glass blowing called?', 20 UNION ALL
    SELECT 703, 'What is the art of metalwork called?', 20 UNION ALL
    SELECT 704, 'What is the art of engraving called?', 20 UNION ALL
    SELECT 705, 'What is the art of weaving called?', 20 UNION ALL
    SELECT 706, 'What is the art of embroidery called?', 20 UNION ALL
    SELECT 707, 'What is the art of tapestry called?', 20 UNION ALL
    SELECT 708, 'What is the art of quilting called?', 20 UNION ALL
    SELECT 709, 'What is the art of calligraphy called?', 20 UNION ALL
    SELECT 710, 'What is the art of printmaking called?', 20 UNION ALL
    SELECT 711, 'What is the art of photography called?', 20 UNION ALL
    SELECT 712, 'What is the art of film-making called?', 20 UNION ALL
    SELECT 713, 'What is the art of dancing called?', 20 UNION ALL
    SELECT 714, 'What is the art of acting called?', 20 UNION ALL
    SELECT 715, 'What is the art of singing called?', 20 UNION ALL
    SELECT 716, 'What is the art of conducting called?', 20 UNION ALL
    SELECT 717, 'What is the art of composition called?', 20 UNION ALL
    SELECT 718, 'What is the art of performance called?', 20 UNION ALL
    SELECT 719, 'What is the art of storytelling called?', 20 UNION ALL
    SELECT 720, 'What is the art of rhetoric called?', 20
  ),
  inserted_lit_ext AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM lit_ext
    RETURNING id, order_index
  ),
  lit_ext_opts AS (
    SELECT 
      ile.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((ile.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_lit_ext ile
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM lit_ext_opts;

  -- EXTENDED MATHEMATICS & LOGIC (Q721-800)
  WITH math_ext AS (
    SELECT 721 AS qnum, 'What is the square root of 1296?' AS qtext, 20 AS tim UNION ALL
    SELECT 722, 'What is 18 squared?', 20 UNION ALL
    SELECT 723, 'What is 14 cubed?', 20 UNION ALL
    SELECT 724, 'What is the least common multiple of 12 and 15?', 20 UNION ALL
    SELECT 725, 'What is the greatest common divisor of 60 and 45?', 20 UNION ALL
    SELECT 726, 'What is the area of a rhombus with diagonals 8 and 6?', 20 UNION ALL
    SELECT 727, 'What is the perimeter of a circle called?', 20 UNION ALL
    SELECT 728, 'How many degrees are the sum of interior angles of a pentagon?', 20 UNION ALL
    SELECT 729, 'What is the area of an equilateral triangle with side 8?', 20 UNION ALL
    SELECT 730, 'What is the volume of a pyramid with base 5x5 and height 6?', 20 UNION ALL
    SELECT 731, 'What is 15 squared?', 20 UNION ALL
    SELECT 732, 'What is the least common multiple of 9 and 12?', 20 UNION ALL
    SELECT 733, 'What is the area of a trapezoid with bases 5 and 7, height 4?', 20 UNION ALL
    SELECT 734, 'What is the greatest common divisor of 72 and 48?', 20 UNION ALL
    SELECT 735, 'What is 11 squared?', 20 UNION ALL
    SELECT 736, 'What is the sum of angles in a quadrilateral?', 20 UNION ALL
    SELECT 737, 'What is the circumference of a circle with diameter 14?', 20 UNION ALL
    SELECT 738, 'What is the area of a parallelogram with base 7 and height 5?', 20 UNION ALL
    SELECT 739, 'How many radians is 180 degrees?', 20 UNION ALL
    SELECT 740, 'What is the area of a square with side 12?', 20 UNION ALL
    SELECT 741, 'What is the perimeter of a triangle with sides 3, 4, 5?', 20 UNION ALL
    SELECT 742, 'What is the area of a right triangle with legs 6 and 8?', 20 UNION ALL
    SELECT 743, 'What is the volume of a cylinder with radius 3 and height 8?', 20 UNION ALL
    SELECT 744, 'What is the sum of the first 10 natural numbers?', 20 UNION ALL
    SELECT 745, 'What is the sum of the first 5 odd numbers?', 20 UNION ALL
    SELECT 746, 'What is the least common multiple of 16 and 20?', 20 UNION ALL
    SELECT 747, 'What is the greatest common divisor of 100 and 75?', 20 UNION ALL
    SELECT 748, 'What is the area of a regular hexagon with side 5?', 20 UNION ALL
    SELECT 749, 'What is the volume of a cone with radius 4 and height 9?', 20 UNION ALL
    SELECT 750, 'What is 60 squared?', 20 UNION ALL
    SELECT 751, 'What is the number of diagonals in an octagon?', 20 UNION ALL
    SELECT 752, 'What is the sum of exterior angles in any polygon?', 20 UNION ALL
    SELECT 753, 'What is the least common multiple of 20 and 25?', 20 UNION ALL
    SELECT 754, 'What is the area of a pentagon with side 4?', 20 UNION ALL
    SELECT 755, 'How many degrees is each interior angle of a regular hexagon?', 20 UNION ALL
    SELECT 756, 'What is the circumference of a circle with radius 10?', 20 UNION ALL
    SELECT 757, 'What is the volume of a rectangular prism 5x6x7?', 20 UNION ALL
    SELECT 758, 'What is the volume of a sphere with radius 3?', 20 UNION ALL
    SELECT 759, 'How many radians is 360 degrees?', 20 UNION ALL
    SELECT 760, 'What is the area of a circle with diameter 10?', 20 UNION ALL
    SELECT 761, 'What is 21 squared?', 20 UNION ALL
    SELECT 762, 'What is 19 squared?', 20 UNION ALL
    SELECT 763, 'What is the perimeter of a square with side 8?', 20 UNION ALL
    SELECT 764, 'What is the volume of a cube with side 10?', 20 UNION ALL
    SELECT 765, 'What is the area of a rectangle 4x6?', 20 UNION ALL
    SELECT 766, 'What is 40 squared?', 20 UNION ALL
    SELECT 767, 'What is 30 squared?', 20 UNION ALL
    SELECT 768, 'What is the least common multiple of 24 and 36?', 20 UNION ALL
    SELECT 769, 'What is 50 squared?', 20 UNION ALL
    SELECT 770, 'What is the sum of the first 20 natural numbers?', 20 UNION ALL
    SELECT 771, 'What is 35 squared?', 20 UNION ALL
    SELECT 772, 'What is 25 squared?', 20 UNION ALL
    SELECT 773, 'What is 100 squared divided by 2?', 20 UNION ALL
    SELECT 774, 'What is the area of a circle with radius 5?', 20 UNION ALL
    SELECT 775, 'What is the perimeter of a regular pentagon with side 5?', 20 UNION ALL
    SELECT 776, 'What is 13 squared?', 20 UNION ALL
    SELECT 777, 'What is the angle at the center of a regular hexagon?', 20 UNION ALL
    SELECT 778, 'What is 70 squared?', 20 UNION ALL
    SELECT 779, 'What is 65 squared?', 20 UNION ALL
    SELECT 780, 'What is 80 squared?', 20 UNION ALL
    SELECT 781, 'What is 90 squared?', 20 UNION ALL
    SELECT 782, 'What is 45 squared?', 20 UNION ALL
    SELECT 783, 'What is 55 squared?', 20 UNION ALL
    SELECT 784, 'What is the greatest common divisor of 144 and 96?', 20 UNION ALL
    SELECT 785, 'What is the least common multiple of 30 and 42?', 20 UNION ALL
    SELECT 786, 'What is the area of a triangle with base 8 and height 6?', 20 UNION ALL
    SELECT 787, 'How many degrees is each interior angle of a regular octagon?', 20 UNION ALL
    SELECT 788, 'What is the perimeter of a hexagon with side 6?', 20 UNION ALL
    SELECT 789, 'What is the volume of a pyramid with base 6x6 and height 8?', 20 UNION ALL
    SELECT 790, 'What is the area of a hexagon with side 6?', 20 UNION ALL
    SELECT 791, 'What is the greatest common divisor of 200 and 150?', 20 UNION ALL
    SELECT 792, 'What is the least common multiple of 18 and 24?', 20 UNION ALL
    SELECT 793, 'What is 9 squared?', 20 UNION ALL
    SELECT 794, 'What is 16 squared?', 20 UNION ALL
    SELECT 795, 'What is 22 squared?', 20 UNION ALL
    SELECT 796, 'What is 17 squared?', 20 UNION ALL
    SELECT 797, 'What is 20 squared?', 20 UNION ALL
    SELECT 798, 'What is 24 squared?', 20 UNION ALL
    SELECT 799, 'What is 26 squared?', 20 UNION ALL
    SELECT 800, 'What is the sum of the first 100 natural numbers?', 20
  ),
  inserted_math_ext AS (
    INSERT INTO public.public_quiz_questions (quiz_id, question_text, order_index, time_limit_seconds)
    SELECT v_quiz_id, qtext, qnum, tim FROM math_ext
    RETURNING id, order_index
  ),
  math_ext_opts AS (
    SELECT 
      ime.id,
      opt_num,
      format('Option %s', CASE WHEN opt_num = 1 THEN 'A' WHEN opt_num = 2 THEN 'B' WHEN opt_num = 3 THEN 'C' ELSE 'D' END) AS opt_text,
      ((ime.order_index % 4) + 1) = opt_num AS is_correct
    FROM inserted_math_ext ime
    CROSS JOIN generate_series(1, 4) AS opt_num
  )
  INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index)
  SELECT id, opt_text, is_correct, opt_num FROM math_ext_opts;

  RAISE NOTICE 'Part 4 complete: Questions 601-800 with options inserted!';
END $$;
