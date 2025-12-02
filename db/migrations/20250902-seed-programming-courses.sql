-- Migration: Seed Programming Courses & Lessons for Beginners (Ages 6-10)
-- This migration populates the programming system with beginner-friendly courses and tutorials

-- Get the first teacher ID (for seeding purposes)
DO $$
DECLARE
  default_teacher_id uuid;
  programming_subject_id uuid;
  course1_id uuid;
  course2_id uuid;
  course3_id uuid;
  course4_id uuid;
  module1_id uuid;
  module2_id uuid;
  module3_id uuid;
  module4_id uuid;
  module5_id uuid;
  lesson1_id uuid;
  lesson2_id uuid;
  lesson3_id uuid;
  lesson4_id uuid;
  lesson5_id uuid;
  lesson6_id uuid;
  lesson7_id uuid;
  lesson8_id uuid;
BEGIN
  -- Get or create default teacher (system admin or first teacher)
  SELECT id INTO default_teacher_id FROM public.teachers LIMIT 1;
  
  IF default_teacher_id IS NULL THEN
    -- If no teacher exists, skip seeding (can't create courses without a teacher)
    RETURN;
  END IF;
  
  -- Get Programming subject
  SELECT id INTO programming_subject_id FROM public.subjects WHERE name = 'Programming' LIMIT 1;
  
  -- COURSE 1: Logic Building & Brain Sharpeners (Ages 6-10)
  INSERT INTO public.programming_courses (
    teacher_id, title, description, difficulty_level, age_group, subject_id, is_published, image_url
  ) VALUES (
    default_teacher_id,
    'Logic Building & Brain Sharpeners',
    'Fun brain-sharpening games and logic puzzles designed for young learners aged 6-10. No coding experience needed!',
    'beginner',
    '6-10',
    programming_subject_id,
    true,
    '/images/logic-brain.png'
  ) RETURNING id INTO course1_id;
  
  -- Module 1: Pattern Recognition
  INSERT INTO public.programming_modules (course_id, title, description, order_index)
  VALUES (course1_id, 'Pattern Recognition', 'Learn to identify and complete patterns', 1)
  RETURNING id INTO module1_id;
  
  -- Lesson 1: Simple Sequences
  INSERT INTO public.programming_lessons (
    module_id, title, content, order_index, learning_objectives, estimated_duration_minutes, has_assessment
  ) VALUES (
    module1_id,
    'Simple Number Sequences',
    'Learn to recognize simple patterns in numbers. Example: 2, 4, 6, 8... What comes next? 10! Each number is 2 more than the last.',
    1,
    ARRAY['Identify simple arithmetic patterns', 'Predict next numbers in sequences'],
    10,
    true
  ) RETURNING id INTO lesson1_id;
  
  -- Assessment for Lesson 1
  INSERT INTO public.programming_assessments (
    lesson_id, title, assessment_type, questions, passing_score, max_score, order_index
  ) VALUES (
    lesson1_id,
    'Pattern Quiz',
    'multiple_choice',
    '[
      {
        "id": 1,
        "question": "What comes next in this sequence? 1, 3, 5, 7, ?",
        "options": ["8", "9", "10", "11"],
        "correct_answer": "9",
        "explanation": "Each number increases by 2"
      },
      {
        "id": 2,
        "question": "What comes next? 10, 20, 30, 40, ?",
        "options": ["45", "50", "55", "60"],
        "correct_answer": "50",
        "explanation": "Each number increases by 10"
      },
      {
        "id": 3,
        "question": "What comes next? 5, 10, 15, 20, ?",
        "options": ["22", "24", "25", "26"],
        "correct_answer": "25",
        "explanation": "Each number increases by 5"
      }
    ]'::jsonb,
    70,
    100,
    1
  );
  
  -- Lesson 2: Colored Patterns
  INSERT INTO public.programming_lessons (
    module_id, title, content, order_index, learning_objectives, estimated_duration_minutes, has_assessment
  ) VALUES (
    module1_id,
    'Color & Shape Patterns',
    'Discover patterns using colors and shapes. Example: Red circle, Blue square, Red circle, Blue square... What comes next? Red circle!',
    2,
    ARRAY['Identify patterns with visual elements', 'Predict next shapes and colors'],
    10,
    true
  ) RETURNING id INTO lesson2_id;
  
  -- Assessment for Lesson 2
  INSERT INTO public.programming_assessments (
    lesson_id, title, assessment_type, questions, passing_score, max_score, order_index
  ) VALUES (
    lesson2_id,
    'Shape Pattern Quiz',
    'multiple_choice',
    '[
      {
        "id": 1,
        "question": "Pattern: Circle, Square, Circle, Square, ?",
        "options": ["Circle", "Square", "Triangle", "Pentagon"],
        "correct_answer": "Circle",
        "explanation": "The pattern repeats: Circle then Square"
      },
      {
        "id": 2,
        "question": "Pattern: Red, Blue, Red, Blue, ?",
        "options": ["Green", "Red", "Blue", "Yellow"],
        "correct_answer": "Red",
        "explanation": "The pattern repeats: Red then Blue"
      },
      {
        "id": 3,
        "question": "Pattern: Big, Small, Big, Small, ?",
        "options": ["Medium", "Big", "Small", "Tiny"],
        "correct_answer": "Big",
        "explanation": "The pattern repeats: Big then Small"
      }
    ]'::jsonb,
    70,
    100,
    1
  );
  
  -- COURSE 2: Block-Based Programming (Visual Coding)
  INSERT INTO public.programming_courses (
    teacher_id, title, description, difficulty_level, age_group, subject_id, is_published, image_url
  ) VALUES (
    default_teacher_id,
    'Block-Based Programming Adventures',
    'Learn programming using colorful blocks! No typing needed - just drag and drop blocks to create games and animations.',
    'beginner',
    '6-10',
    programming_subject_id,
    true,
    '/images/block-coding.png'
  ) RETURNING id INTO course2_id;
  
  -- Module 1: Introduction to Blocks
  INSERT INTO public.programming_modules (course_id, title, description, order_index)
  VALUES (course2_id, 'Getting Started with Blocks', 'Learn the basics of block-based programming', 1)
  RETURNING id INTO module2_id;
  
  -- Lesson 1: Moving a Character
  INSERT INTO public.programming_lessons (
    module_id, title, content, content_rich_html, code_example, code_language, order_index, learning_objectives, estimated_duration_minutes, has_assessment
  ) VALUES (
    module2_id,
    'Moving Your First Character',
    'Learn how to make a character move on the screen using simple movement blocks.',
    '<p>Block-based programming uses <strong>colored blocks</strong> that snap together like LEGO!</p><p>The blue <strong>"move forward"</strong> block makes your character take steps forward.</p>',
    'MOVE FORWARD 100 steps\nTURN RIGHT 90 degrees\nMOVE FORWARD 100 steps',
    'blockly',
    1,
    ARRAY['Use movement blocks', 'Make a character move', 'Understand coordinates'],
    15,
    true
  ) RETURNING id INTO lesson3_id;
  
  -- Assessment for Lesson 3
  INSERT INTO public.programming_assessments (
    lesson_id, title, assessment_type, questions, passing_score, max_score, order_index
  ) VALUES (
    lesson3_id,
    'Movement Challenge',
    'multiple_choice',
    '[
      {
        "id": 1,
        "question": "How many steps does this character take? MOVE 100, MOVE 50, MOVE 25?",
        "options": ["100", "150", "175", "200"],
        "correct_answer": "175",
        "explanation": "100 + 50 + 25 = 175 steps total"
      },
      {
        "id": 2,
        "question": "If a character starts facing right and turns left 90 degrees, which direction is it facing?",
        "options": ["Right", "Left", "Up", "Down"],
        "correct_answer": "Up",
        "explanation": "Turning left 90 degrees from right makes you face up"
      },
      {
        "id": 3,
        "question": "What happens when you repeat the same movement block 4 times?",
        "options": ["It moves once", "It moves four times the distance", "It rotates", "Nothing"],
        "correct_answer": "It moves four times the distance",
        "explanation": "Repeating blocks makes actions happen multiple times"
      }
    ]'::jsonb,
    70,
    100,
    1
  );
  
  -- COURSE 3: Computational Thinking Games
  INSERT INTO public.programming_courses (
    teacher_id, title, description, difficulty_level, age_group, subject_id, is_published, image_url
  ) VALUES (
    default_teacher_id,
    'Computational Thinking Games',
    'Master the thinking skills used in programming through fun games and puzzles!',
    'beginner',
    '6-10',
    programming_subject_id,
    true,
    '/images/computational-thinking.png'
  ) RETURNING id INTO course3_id;
  
  -- Module 1: Sequences & Instructions
  INSERT INTO public.programming_modules (course_id, title, description, order_index)
  VALUES (course3_id, 'Sequences & Step-by-Step Instructions', 'Learn to think in sequences and give clear instructions', 1)
  RETURNING id INTO module3_id;
  
  -- Lesson 1: Following Instructions
  INSERT INTO public.programming_lessons (
    module_id, title, content, order_index, learning_objectives, estimated_duration_minutes, has_assessment
  ) VALUES (
    module3_id,
    'Following Instructions Step by Step',
    'Just like cooking from a recipe, computers follow instructions in the exact order you give them. If you mix up the order, things go wrong!',
    1,
    ARRAY['Understand sequence order', 'Follow instructions precisely', 'Recognize when order matters'],
    12,
    true
  ) RETURNING id INTO lesson4_id;
  
  -- Assessment for Lesson 4
  INSERT INTO public.programming_assessments (
    lesson_id, title, assessment_type, questions, passing_score, max_score, order_index
  ) VALUES (
    lesson4_id,
    'Sequencing Challenge',
    'multiple_choice',
    '[
      {
        "id": 1,
        "question": "Which order is correct to make breakfast? 1. Pour milk 2. Put cereal in bowl 3. Eat",
        "options": ["1, 2, 3", "2, 1, 3", "3, 2, 1", "2, 3, 1"],
        "correct_answer": "2, 1, 3",
        "explanation": "First put cereal in bowl, then pour milk, then eat"
      },
      {
        "id": 2,
        "question": "Computers follow instructions in what order?",
        "options": ["Random order", "The order you give them", "Alphabetical order", "From easiest to hardest"],
        "correct_answer": "The order you give them",
        "explanation": "Computers follow instructions in the exact sequence provided"
      },
      {
        "id": 3,
        "question": "What happens if you put your shoes on BEFORE your socks?",
        "options": ["Nothing bad", "It still works fine", "Your feet are uncomfortable", "It''s silly and wrong order"],
        "correct_answer": "It''s silly and wrong order",
        "explanation": "Order matters! Socks should go on before shoes"
      }
    ]'::jsonb,
    70,
    100,
    1
  );
  
  -- COURSE 4: Basic JavaScript (Ages 8-10 advanced)
  INSERT INTO public.programming_courses (
    teacher_id, title, description, difficulty_level, age_group, subject_id, is_published, image_url
  ) VALUES (
    default_teacher_id,
    'Introduction to JavaScript: Fun Text Adventures',
    'Create interactive stories and games using JavaScript! For students ready to type code.',
    'beginner',
    '6-10',
    programming_subject_id,
    true,
    '/images/javascript-intro.png'
  ) RETURNING id INTO course4_id;
  
  -- Module 1: JavaScript Basics
  INSERT INTO public.programming_modules (course_id, title, description, order_index)
  VALUES (course4_id, 'JavaScript Basics', 'Learn the fundamentals of JavaScript programming', 1)
  RETURNING id INTO module4_id;
  
  -- Lesson 1: Print Your First Message
  INSERT INTO public.programming_lessons (
    module_id, title, content, content_rich_html, code_example, code_language, order_index, learning_objectives, estimated_duration_minutes, has_assessment
  ) VALUES (
    module4_id,
    'Print Your First Message',
    'Learn how to make the computer display text on the screen.',
    '<p>To print text in JavaScript, we use <code>console.log()</code></p><p>It''s like telling the computer: "Please show this message!"</p>',
    'console.log("Hello, World!");
console.log("My name is Alex");
console.log("I love programming!");',
    'javascript',
    1,
    ARRAY['Print text', 'Use console.log()', 'Understand strings'],
    15,
    true
  ) RETURNING id INTO lesson5_id;
  
  -- Assessment for Lesson 5
  INSERT INTO public.programming_assessments (
    lesson_id, title, assessment_type, questions, passing_score, max_score, order_index
  ) VALUES (
    lesson5_id,
    'JavaScript Print Quiz',
    'multiple_choice',
    '[
      {
        "id": 1,
        "question": "How do you print text in JavaScript?",
        "options": ["print()", "display()", "console.log()", "show()"],
        "correct_answer": "console.log()",
        "explanation": "console.log() is the JavaScript function to print text"
      },
      {
        "id": 2,
        "question": "What does this do? console.log(\"Hi\")",
        "options": ["Calculates", "Shows ''Hi'' on screen", "Saves to file", "Prints nothing"],
        "correct_answer": "Shows ''Hi'' on screen",
        "explanation": "console.log() displays the text in quotes"
      },
      {
        "id": 3,
        "question": "What are the quotation marks for in console.log(\"Hello\")?",
        "options": ["Decorations", "Show where text starts and ends", "Optional", "Required"],
        "correct_answer": "Show where text starts and ends",
        "explanation": "Quotes tell the computer where the text message begins and ends"
      }
    ]'::jsonb,
    70,
    100,
    1
  );
  
  -- Lesson 2: Using Variables
  INSERT INTO public.programming_lessons (
    module_id, title, content, content_rich_html, code_example, code_language, order_index, learning_objectives, estimated_duration_minutes, has_assessment
  ) VALUES (
    module4_id,
    'Using Variables to Store Information',
    'Variables are like boxes where you can store information to use later. Like a lunch box storing your sandwich!',
    '<p>Variables store values that we can use later in our code.</p><p>We use <code>let name = value;</code> to create a variable.</p>',
    'let myName = "Sara";
let myAge = 9;
let favoriteColor = "blue";

console.log("My name is " + myName);
console.log("I am " + myAge + " years old");
console.log("My favorite color is " + favoriteColor);',
    'javascript',
    2,
    ARRAY['Create variables', 'Store and use data', 'Combine text'],
    18,
    true
  ) RETURNING id INTO lesson6_id;
  
  -- Assessment for Lesson 6
  INSERT INTO public.programming_assessments (
    lesson_id, title, assessment_type, questions, passing_score, max_score, order_index
  ) VALUES (
    lesson6_id,
    'Variables Quiz',
    'multiple_choice',
    '[
      {
        "id": 1,
        "question": "What is a variable like?",
        "options": ["A box to store things", "A person", "A color", "A number"],
        "correct_answer": "A box to store things",
        "explanation": "Variables are containers that hold values we want to save"
      },
      {
        "id": 2,
        "question": "How do you create a variable with the name ''age'' and value 8?",
        "options": ["age = 8;", "let age = 8;", "create age 8;", "variable age 8;"],
        "correct_answer": "let age = 8;",
        "explanation": "Use ''let'' keyword to create a variable in JavaScript"
      },
      {
        "id": 3,
        "question": "What does this do? let color = \"red\"; console.log(color);",
        "options": ["Prints red", "Stores red in color and prints it", "Just stores it", "Does nothing"],
        "correct_answer": "Stores red in color and prints it",
        "explanation": "First line stores, second line prints the stored value"
      }
    ]'::jsonb,
    70,
    100,
    1
  );
  
  -- Lesson 3: Simple Math in JavaScript
  INSERT INTO public.programming_lessons (
    module_id, title, content, code_example, code_language, order_index, learning_objectives, estimated_duration_minutes, has_assessment
  ) VALUES (
    module4_id,
    'Math and Simple Calculations',
    'JavaScript can do math! Learn how to use +, -, *, / to solve problems.',
    'let apples = 5;
let oranges = 3;
let totalFruit = apples + oranges;
console.log("Total fruit: " + totalFruit);

let money = 20;
let spent = 8;
let remaining = money - spent;
console.log("Money left: " + remaining);',
    'javascript',
    3,
    ARRAY['Perform arithmetic', 'Use mathematical operators', 'Solve real problems'],
    15,
    true
  ) RETURNING id INTO lesson7_id;
  
  -- Assessment for Lesson 7
  INSERT INTO public.programming_assessments (
    lesson_id, title, assessment_type, questions, passing_score, max_score, order_index
  ) VALUES (
    lesson7_id,
    'Math in JavaScript Quiz',
    'multiple_choice',
    '[
      {
        "id": 1,
        "question": "What is the + symbol used for in math?",
        "options": ["Subtraction", "Addition", "Multiplication", "Division"],
        "correct_answer": "Addition",
        "explanation": "+ adds numbers together"
      },
      {
        "id": 2,
        "question": "What will this show? let x = 10 + 5; console.log(x);",
        "options": ["10 + 5", "15", "10", "105"],
        "correct_answer": "15",
        "explanation": "10 + 5 equals 15"
      },
      {
        "id": 3,
        "question": "If I have 12 cookies and eat 3, how do I write this in JavaScript?",
        "options": ["12 + 3", "12 - 3", "12 * 3", "12 / 3"],
        "correct_answer": "12 - 3",
        "explanation": "Subtraction (-) removes items"
      }
    ]'::jsonb,
    70,
    100,
    1
  );
  
  -- Lesson 4: Creating a Simple Story
  INSERT INTO public.programming_lessons (
    module_id, title, content, code_example, code_language, order_index, learning_objectives, estimated_duration_minutes, has_assessment
  ) VALUES (
    module4_id,
    'Create an Interactive Story',
    'Combine everything you learned to create a fun interactive story!',
    'let heroName = "Luna";
let enemyName = "Dragon";
let heroHealth = 100;
let enemyHealth = 50;

console.log(heroName + " meets a " + enemyName + "!");
console.log(enemyName + " attacks! " + heroName + " loses 10 health");
heroHealth = heroHealth - 10;
console.log(heroName + " now has " + heroHealth + " health");',
    'javascript',
    4,
    ARRAY['Create interactive content', 'Combine programming concepts', 'Build a story game'],
    20,
    true
  ) RETURNING id INTO lesson8_id;
  
  -- Assessment for Lesson 8
  INSERT INTO public.programming_assessments (
    lesson_id, title, assessment_type, questions, passing_score, max_score, order_index
  ) VALUES (
    lesson8_id,
    'Story Creation Challenge',
    'multiple_choice',
    '[
      {
        "id": 1,
        "question": "What should you use to combine two pieces of text in JavaScript?",
        "options": ["The + symbol", "The - symbol", "The = symbol", "Spaces"],
        "correct_answer": "The + symbol",
        "explanation": "+ is used to combine (concatenate) text strings"
      },
      {
        "id": 2,
        "question": "To change a character''s health from 100 to 90 in your story, what do you write?",
        "options": ["health = 100 to 90", "health = 90", "90 = health", "health 90"],
        "correct_answer": "health = 90",
        "explanation": "Use = to assign a new value to a variable"
      },
      {
        "id": 3,
        "question": "What makes a good interactive story in programming?",
        "options": ["Using lots of console.log()", "Using variables for characters", "Having interesting characters and actions", "All of the above"],
        "correct_answer": "All of the above",
        "explanation": "Good stories use variables, clear output, and interesting content"
      }
    ]'::jsonb,
    70,
    100,
    1
  );
  
  RAISE NOTICE 'Programming courses seeded successfully!';
END $$;

-- End seeding migration
