-- Seed file: Advanced Science Quiz (Hard, Ages 12-14) - 20 questions
BEGIN;

INSERT INTO public.public_quiz_questions (
  quiz_id,
  question_text,
  order_index,
  time_limit_seconds,
  explanation
) SELECT
  id,
  question_text,
  order_index,
  time_limit_seconds,
  explanation
FROM (
  SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') as id, 'What is the powerhouse of a cell?' as question_text, 1 as order_index, 30 as time_limit_seconds, 'The mitochondrion (plural: mitochondria) produces energy for the cell.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What are the products of photosynthesis?' as question_text, 2 as order_index, 30 as time_limit_seconds, 'Photosynthesis produces glucose and oxygen.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is DNA?' as question_text, 3 as order_index, 30 as time_limit_seconds, 'DNA (deoxyribonucleic acid) carries genetic information.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is the SI unit of force?' as question_text, 4 as order_index, 30 as time_limit_seconds, 'The Newton (N) is the SI unit of force.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is the noble gas used in light bulbs?' as question_text, 5 as order_index, 30 as time_limit_seconds, 'Argon is a noble gas commonly used in light bulbs.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is osmosis?' as question_text, 6 as order_index, 30 as time_limit_seconds, 'Osmosis is the movement of water across a semipermeable membrane.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is the pH of pure water?' as question_text, 7 as order_index, 30 as time_limit_seconds, 'Pure water has a pH of 7 (neutral).' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is the speed of sound in vacuum?' as question_text, 8 as order_index, 30 as time_limit_seconds, 'Sound cannot travel through vacuum.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is the chemical formula for sulfuric acid?' as question_text, 9 as order_index, 30 as time_limit_seconds, 'Sulfuric acid is H₂SO₄.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is an isotope?' as question_text, 10 as order_index, 30 as time_limit_seconds, 'An isotope is an atom with different numbers of neutrons.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is conductivity?' as question_text, 11 as order_index, 30 as time_limit_seconds, 'Conductivity is the ability of a material to conduct electricity.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is kinetic energy?' as question_text, 12 as order_index, 30 as time_limit_seconds, 'Kinetic energy is energy due to motion.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is the atomic number of Oxygen?' as question_text, 13 as order_index, 30 as time_limit_seconds, 'Oxygen has atomic number 8 (8 protons).' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is entropy?' as question_text, 14 as order_index, 30 as time_limit_seconds, 'Entropy is a measure of disorder in a system.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is refraction?' as question_text, 15 as order_index, 30 as time_limit_seconds, 'Refraction is the bending of light when it passes between materials.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is a catalyst?' as question_text, 16 as order_index, 30 as time_limit_seconds, 'A catalyst speeds up a chemical reaction without being consumed.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What are alleles?' as question_text, 17 as order_index, 30 as time_limit_seconds, 'Alleles are different forms of the same gene.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is the Doppler effect?' as question_text, 18 as order_index, 30 as time_limit_seconds, 'The Doppler effect is the change in frequency due to motion.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is plasma?' as question_text, 19 as order_index, 30 as time_limit_seconds, 'Plasma is a state of matter with ionized gas.' as explanation
  UNION ALL SELECT (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science'), 'What is oxidation?' as question_text, 20 as order_index, 30 as time_limit_seconds, 'Oxidation is the loss of electrons in a chemical reaction.' as explanation
) AS questions;

INSERT INTO public.public_quiz_options (question_id, option_text, is_correct, order_index) 
SELECT question_id, option_text, is_correct, order_index FROM (
  SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 1) as question_id, 'Mitochondrion' as option_text, true as is_correct, 1 as order_index
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 1), 'Nucleus', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 1), 'Ribosome', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 1), 'Lysosome', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 2), 'Glucose and oxygen', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 2), 'Carbon dioxide and water', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 2), 'Starch and nitrogen', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 2), 'Protein and lipids', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 3), 'Genetic material carrier', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 3), 'Energy molecule', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 3), 'Structural protein', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 3), 'Enzyme catalyst', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 4), 'Newton', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 4), 'Joule', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 4), 'Pascal', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 4), 'Watt', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 5), 'Argon', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 5), 'Helium', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 5), 'Neon', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 5), 'Xenon', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 6), 'Water movement across membrane', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 6), 'Diffusion of gas', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 6), 'Active transport', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 6), 'Exocytosis', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 7), '7', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 7), '6', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 7), '8', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 7), '5', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 8), 'Cannot travel through vacuum', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 8), '300,000 m/s', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 8), '343 m/s', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 8), '100 m/s', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 9), 'H₂SO₄', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 9), 'H₂CO₃', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 9), 'HCl', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 9), 'HNO₃', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 10), 'Different number of neutrons', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 10), 'Different number of protons', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 10), 'Different electrons', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 10), 'Different mass number', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 11), 'Ability to conduct electricity', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 11), 'Heat retention', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 11), 'Optical density', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 11), 'Melting point', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 12), 'Energy due to motion', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 12), 'Energy due to position', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 12), 'Heat energy', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 12), 'Chemical energy', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 13), '8', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 13), '6', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 13), '7', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 13), '9', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 14), 'Measure of disorder', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 14), 'Heat measurement', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 14), 'Energy conversion', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 14), 'Work done', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 15), 'Bending of light', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 15), 'Reflection of light', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 15), 'Diffraction', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 15), 'Interference', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 16), 'Speeds up reaction without consumption', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 16), 'Slows down reaction', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 16), 'Is always consumed', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 16), 'Changes reactants', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 17), 'Different forms of same gene', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 17), 'Chromosomes', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 17), 'DNA strands', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 17), 'Mutations', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 18), 'Change in frequency due to motion', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 18), 'Sound reflection', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 18), 'Echo effect', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 18), 'Wavelength change only', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 19), 'Ionized gas state', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 19), 'Liquid state', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 19), 'Solid state', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 19), 'Gas state', false, 4
  
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 20), 'Loss of electrons', true, 1
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 20), 'Gain of electrons', false, 2
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 20), 'Loss of protons', false, 3
  UNION ALL SELECT (SELECT id FROM public.public_quiz_questions WHERE quiz_id = (SELECT id FROM public.public_quizzes WHERE title = 'Advanced Science') AND order_index = 20), 'Gain of neutrons', false, 4
) AS options;

UPDATE public.public_quizzes SET total_questions = 20 WHERE title = 'Advanced Science';

COMMIT;
