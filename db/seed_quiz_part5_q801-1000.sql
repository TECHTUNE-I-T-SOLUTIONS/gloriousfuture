-- Seed Quiz Part 5: Questions 801-1000 (Final Knowledge - Geography, Technology, Modern Studies)
-- Run this fifth after Part 4 completes successfully

DO $$
DECLARE
  v_quiz_id uuid;
BEGIN
  SELECT id INTO v_quiz_id FROM public.public_quizzes 
  WHERE title = 'Pupil Enlightenment — General Knowledge' LIMIT 1;

  -- EXTENDED GEOGRAPHY & CAPITALS (Q801-900)
  WITH geo_ext AS (
    SELECT 801 AS qnum, 'What is the capital of Libya?' AS qtext, 20 AS tim UNION ALL
    SELECT 802, 'What is the capital of Lebanon?', 20 UNION ALL
    SELECT 803, 'What is the capital of Syria?', 20 UNION ALL
    SELECT 804, 'What is the capital of Jordan?', 20 UNION ALL
    SELECT 805, 'What is the capital of Yemen?', 20 UNION ALL
    SELECT 806, 'What is the capital of Oman?', 20 UNION ALL
    SELECT 807, 'What is the capital of Qatar?', 20 UNION ALL
    SELECT 808, 'What is the capital of Bahrain?', 20 UNION ALL
    SELECT 809, 'What is the capital of Kuwait?', 20 UNION ALL
    SELECT 810, 'What is the capital of Macedonia?', 20 UNION ALL
    SELECT 811, 'What is the capital of Montenegro?', 20 UNION ALL
    SELECT 812, 'What is the capital of Bosnia?', 20 UNION ALL
    SELECT 813, 'What is the capital of Kosovo?', 20 UNION ALL
    SELECT 814, 'What is the capital of Serbia?', 20 UNION ALL
    SELECT 815, 'What is the capital of Slovenia?', 20 UNION ALL
    SELECT 816, 'What is the capital of Croatia?', 20 UNION ALL
    SELECT 817, 'What is the capital of Albania?', 20 UNION ALL
    SELECT 818, 'What is the capital of Latvia?', 20 UNION ALL
    SELECT 819, 'What is the capital of Lithuania?', 20 UNION ALL
    SELECT 820, 'What is the capital of Estonia?', 20 UNION ALL
    SELECT 821, 'What is the capital of Belarus?', 20 UNION ALL
    SELECT 822, 'What is the capital of Ukraine?', 20 UNION ALL
    SELECT 823, 'What is the capital of Moldova?', 20 UNION ALL
    SELECT 824, 'What is the capital of Georgia?', 20 UNION ALL
    SELECT 825, 'What is the capital of Armenia?', 20 UNION ALL
    SELECT 826, 'What is the capital of Azerbaijan?', 20 UNION ALL
    SELECT 827, 'What is the capital of Kazakhstan?', 20 UNION ALL
    SELECT 828, 'What is the capital of Uzbekistan?', 20 UNION ALL
    SELECT 829, 'What is the capital of Turkmenistan?', 20 UNION ALL
    SELECT 830, 'What is the capital of Kyrgyzstan?', 20 UNION ALL
    SELECT 831, 'What is the capital of Tajikistan?', 20 UNION ALL
    SELECT 832, 'What is the capital of Mongolia?', 20 UNION ALL
    SELECT 833, 'What is the capital of Bhutan?', 20 UNION ALL
    SELECT 834, 'What is the capital of Nepal?', 20 UNION ALL
    SELECT 835, 'What is the capital of Sri Lanka?', 20 UNION ALL
    SELECT 836, 'What is the capital of Bangladesh?', 20 UNION ALL
    SELECT 837, 'What is the capital of Myanmar?', 20 UNION ALL
    SELECT 838, 'What is the capital of Laos?', 20 UNION ALL
    SELECT 839, 'What is the capital of Cambodia?', 20 UNION ALL
    SELECT 840, 'What is the capital of Vietnam?', 20 UNION ALL
    SELECT 841, 'What is the capital of East Timor?', 20 UNION ALL
    SELECT 842, 'What is the capital of Papua New Guinea?', 20 UNION ALL
    SELECT 843, 'What is the capital of Fiji?', 20 UNION ALL
    SELECT 844, 'What is the capital of Solomon Islands?', 20 UNION ALL
    SELECT 845, 'What is the capital of Samoa?', 20 UNION ALL
    SELECT 846, 'What is the capital of Vanuatu?', 20 UNION ALL
    SELECT 847, 'What is the capital of Kiribati?', 20 UNION ALL
    SELECT 848, 'What is the capital of Nauru?', 20 UNION ALL
    SELECT 849, 'What is the capital of Palau?', 20 UNION ALL
    SELECT 850, 'What is the capital of Marshall Islands?', 20 UNION ALL
    SELECT 851, 'What is the capital of Micronesia?', 20 UNION ALL
    SELECT 852, 'What is the capital of Tuvalu?', 20 UNION ALL
    SELECT 853, 'What is the capital of Mauritius?', 20 UNION ALL
    SELECT 854, 'What is the capital of Seychelles?', 20 UNION ALL
    SELECT 855, 'What is the capital of Djibouti?', 20 UNION ALL
    SELECT 856, 'What is the capital of Comoros?', 20 UNION ALL
    SELECT 857, 'What is the capital of Cabo Verde?', 20 UNION ALL
    SELECT 858, 'What is the capital of São Tomé and Príncipe?', 20 UNION ALL
    SELECT 859, 'What is the highest mountain in Africa?', 20 UNION ALL
    SELECT 860, 'What is the longest river in Africa?', 20 UNION ALL
    SELECT 861, 'What is the largest desert in Africa?', 20 UNION ALL
    SELECT 862, 'What is the deepest ocean trench?', 20 UNION ALL
    SELECT 863, 'What is the highest mountain in South America?', 20 UNION ALL
    SELECT 864, 'What is the longest river in South America?', 20 UNION ALL
    SELECT 865, 'What is the largest rainforest in the world?', 20 UNION ALL
    SELECT 866, 'What is the highest mountain in Europe?', 20 UNION ALL
    SELECT 867, 'What is the longest river in Europe?', 20 UNION ALL
    SELECT 868, 'What is the highest mountain in Asia?', 20 UNION ALL
    SELECT 869, 'What is the longest river in Asia?', 20 UNION ALL
    SELECT 870, 'What is the largest desert in Asia?', 20 UNION ALL
    SELECT 871, 'What is the largest ocean in the world?', 20 UNION ALL
    SELECT 872, 'What is the smallest ocean in the world?', 20 UNION ALL
    SELECT 873, 'What is the largest continent by population?', 20 UNION ALL
    SELECT 874, 'What is the smallest continent by land area?', 20 UNION ALL
    SELECT 875, 'How many continents are there?', 20 UNION ALL
    SELECT 876, 'How many oceans are there?', 20 UNION ALL
    SELECT 877, 'What is the equator?', 20 UNION ALL
    SELECT 878, 'What is the Prime Meridian?', 20 UNION ALL
    SELECT 879, 'What is a timezone?', 20 UNION ALL
    SELECT 880, 'What is longitude?', 20 UNION ALL
    SELECT 881, 'What is latitude?', 20 UNION ALL
    SELECT 882, 'What is a peninsula?', 20 UNION ALL
    SELECT 883, 'What is an archipelago?', 20 UNION ALL
    SELECT 884, 'What is a plateau?', 20 UNION ALL
    SELECT 885, 'What is a valley?', 20 UNION ALL
    SELECT 886, 'What is a delta?', 20 UNION ALL
    SELECT 887, 'What is a gorge?', 20 UNION ALL
    SELECT 888, 'What is a canyon?', 20 UNION ALL
    SELECT 889, 'What is a fjord?', 20 UNION ALL
    SELECT 890, 'What is a lagoon?', 20 UNION ALL
    SELECT 891, 'What is a bay?', 20 UNION ALL
    SELECT 892, 'What is a gulf?', 20 UNION ALL
    SELECT 893, 'What is a strait?', 20 UNION ALL
    SELECT 894, 'What is an isthmus?', 20 UNION ALL
    SELECT 895, 'What is the Bermuda Triangle famous for?', 20 UNION ALL
    SELECT 896, 'What is the Ring of Fire?', 20 UNION ALL
    SELECT 897, 'What are the Northern Lights?', 20 UNION ALL
    SELECT 898, 'What is the Aurora Borealis?', 20 UNION ALL
    SELECT 899, 'What is the Aurora Australis?', 20 UNION ALL
    SELECT 900, 'How many degrees does the Earth rotate daily?', 20
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

  -- EXTENDED TECHNOLOGY & SCIENCE (Q901-1000)
  WITH tech_sci AS (
    SELECT 901 AS qnum, 'Who invented the light bulb?' AS qtext, 20 AS tim UNION ALL
    SELECT 902, 'Who invented the telephone?', 20 UNION ALL
    SELECT 903, 'Who invented the airplane?', 20 UNION ALL
    SELECT 904, 'Who invented the television?', 20 UNION ALL
    SELECT 905, 'Who invented the radio?', 20 UNION ALL
    SELECT 906, 'Who invented the camera?', 20 UNION ALL
    SELECT 907, 'Who invented the electric motor?', 20 UNION ALL
    SELECT 908, 'Who invented the transformer?', 20 UNION ALL
    SELECT 909, 'Who invented dynamite?', 20 UNION ALL
    SELECT 910, 'Who invented penicillin?', 20 UNION ALL
    SELECT 911, 'Who invented the microscope?', 20 UNION ALL
    SELECT 912, 'Who invented the telescope?', 20 UNION ALL
    SELECT 913, 'Who invented the thermometer?', 20 UNION ALL
    SELECT 914, 'Who invented the barometer?', 20 UNION ALL
    SELECT 915, 'Who invented the compass?', 20 UNION ALL
    SELECT 916, 'Who invented the printing press?', 20 UNION ALL
    SELECT 917, 'Who invented the cotton gin?', 20 UNION ALL
    SELECT 918, 'Who invented the steam engine?', 20 UNION ALL
    SELECT 919, 'Who invented the bicycle?', 20 UNION ALL
    SELECT 920, 'Who invented the automobile?', 20 UNION ALL
    SELECT 921, 'Who invented the diesel engine?', 20 UNION ALL
    SELECT 922, 'Who invented the plastic?', 20 UNION ALL
    SELECT 923, 'Who invented the jet engine?', 20 UNION ALL
    SELECT 924, 'Who invented the helicopter?', 20 UNION ALL
    SELECT 925, 'Who invented the rocket?', 20 UNION ALL
    SELECT 926, 'Who invented the computer?', 20 UNION ALL
    SELECT 927, 'Who invented the transistor?', 20 UNION ALL
    SELECT 928, 'Who invented the integrated circuit?', 20 UNION ALL
    SELECT 929, 'Who invented the internet?', 20 UNION ALL
    SELECT 930, 'Who invented the World Wide Web?', 20 UNION ALL
    SELECT 931, 'What is the third planet from the sun?', 20 UNION ALL
    SELECT 932, 'What is the largest planet in our solar system?', 20 UNION ALL
    SELECT 933, 'What is the smallest planet in our solar system?', 20 UNION ALL
    SELECT 934, 'What is the closest planet to the sun?', 20 UNION ALL
    SELECT 935, 'How many planets are in our solar system?', 20 UNION ALL
    SELECT 936, 'What is the name of the sun in our solar system?', 20 UNION ALL
    SELECT 937, 'What is the red planet?', 20 UNION ALL
    SELECT 938, 'What is the ringed planet?', 20 UNION ALL
    SELECT 939, 'What gas makes up the majority of Earth atmosphere?', 20 UNION ALL
    SELECT 940, 'What is the chemical symbol for gold?', 20 UNION ALL
    SELECT 941, 'What is the chemical symbol for silver?', 20 UNION ALL
    SELECT 942, 'What is the chemical symbol for iron?', 20 UNION ALL
    SELECT 943, 'What is the chemical symbol for copper?', 20 UNION ALL
    SELECT 944, 'What is the chemical symbol for lead?', 20 UNION ALL
    SELECT 945, 'What is the chemical symbol for mercury?', 20 UNION ALL
    SELECT 946, 'What is the chemical symbol for tin?', 20 UNION ALL
    SELECT 947, 'What is the chemical symbol for zinc?', 20 UNION ALL
    SELECT 948, 'What is the chemical symbol for carbon?', 20 UNION ALL
    SELECT 949, 'What is the chemical symbol for oxygen?', 20 UNION ALL
    SELECT 950, 'What is the chemical symbol for hydrogen?', 20 UNION ALL
    SELECT 951, 'What is the chemical symbol for nitrogen?', 20 UNION ALL
    SELECT 952, 'What is the chemical symbol for sulfur?', 20 UNION ALL
    SELECT 953, 'What is the chemical symbol for phosphorus?', 20 UNION ALL
    SELECT 954, 'What is the chemical symbol for chlorine?', 20 UNION ALL
    SELECT 955, 'What is the chemical symbol for sodium?', 20 UNION ALL
    SELECT 956, 'What is the chemical symbol for potassium?', 20 UNION ALL
    SELECT 957, 'What is the chemical symbol for calcium?', 20 UNION ALL
    SELECT 958, 'What is the chemical symbol for magnesium?', 20 UNION ALL
    SELECT 959, 'What is the chemical symbol for aluminum?', 20 UNION ALL
    SELECT 960, 'What is the chemical symbol for silicon?', 20 UNION ALL
    SELECT 961, 'What is the speed of light?', 20 UNION ALL
    SELECT 962, 'What is the speed of sound?', 20 UNION ALL
    SELECT 963, 'What is the boiling point of water?', 20 UNION ALL
    SELECT 964, 'What is the freezing point of water?', 20 UNION ALL
    SELECT 965, 'What is absolute zero?', 20 UNION ALL
    SELECT 966, 'What is the atomic number of hydrogen?', 20 UNION ALL
    SELECT 967, 'What is the atomic number of carbon?', 20 UNION ALL
    SELECT 968, 'What is the atomic number of oxygen?', 20 UNION ALL
    SELECT 969, 'What is the atomic number of nitrogen?', 20 UNION ALL
    SELECT 970, 'What is the atomic number of iron?', 20 UNION ALL
    SELECT 971, 'What is the atomic number of gold?', 20 UNION ALL
    SELECT 972, 'What are the primary colors?', 20 UNION ALL
    SELECT 973, 'What is the frequency of visible light?', 20 UNION ALL
    SELECT 974, 'What is electromagnetic radiation?', 20 UNION ALL
    SELECT 975, 'What is a force?', 20 UNION ALL
    SELECT 976, 'What is velocity?', 20 UNION ALL
    SELECT 977, 'What is acceleration?', 20 UNION ALL
    SELECT 978, 'What is momentum?', 20 UNION ALL
    SELECT 979, 'What is energy?', 20 UNION ALL
    SELECT 980, 'What is power?', 20 UNION ALL
    SELECT 981, 'What is gravity?', 20 UNION ALL
    SELECT 982, 'What is friction?', 20 UNION ALL
    SELECT 983, 'What is pressure?', 20 UNION ALL
    SELECT 984, 'What is density?', 20 UNION ALL
    SELECT 985, 'What is volume?', 20 UNION ALL
    SELECT 986, 'What is mass?', 20 UNION ALL
    SELECT 987, 'What is weight?', 20 UNION ALL
    SELECT 988, 'What is temperature?', 20 UNION ALL
    SELECT 989, 'What is heat?', 20 UNION ALL
    SELECT 990, 'What is electricity?', 20 UNION ALL
    SELECT 991, 'What is magnetism?', 20 UNION ALL
    SELECT 992, 'What is a wave?', 20 UNION ALL
    SELECT 993, 'What is a particle?', 20 UNION ALL
    SELECT 994, 'What is DNA?', 20 UNION ALL
    SELECT 995, 'What is RNA?', 20 UNION ALL
    SELECT 996, 'What is a protein?', 20 UNION ALL
    SELECT 997, 'What is a cell?', 20 UNION ALL
    SELECT 998, 'What is an atom?', 20 UNION ALL
    SELECT 999, 'What is a molecule?', 20 UNION ALL
    SELECT 1000, 'What is the fundamental unit of all living things?', 20
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

  RAISE NOTICE 'Part 5 complete: Questions 801-1000 with options inserted!';
  RAISE NOTICE '✓ All 1000 questions successfully seeded to "Pupil Enlightenment — General Knowledge" quiz!';
END $$;
