-- Migration: Add skills mapping to courses
-- This updates the unlocks_skills array for relevant courses

-- C++ Skills (Object-Oriented Programming courses)
UPDATE public.courses
SET unlocks_skills = ARRAY['C++']::TEXT[]
WHERE id IN (
  'ju-cs-1902110',
  'ju-ai-1932110',
  'ju-ds-1902110',
  'ju-bit-1902110',
  'hu-cs-1910011214',
  'hu-dsai-1910011214',
  'hu-swe-1910011214',
  'hu-bit-1910011214',
  'hu-cis-1910011214'
);

-- C Skills (Systems Programming, Compilers, OS)
UPDATE public.courses
SET unlocks_skills = ARRAY['C']::TEXT[]
WHERE id IN (
  'ju-cs-1901476', -- Systems Programming and Compilers Construction
  'ju-cs-1901473'  -- Operating Systems
);

-- R Skills (Statistics courses)
UPDATE public.courses
SET unlocks_skills = ARRAY['R']::TEXT[]
WHERE code IN ('MATH003') OR id IN (
  'ju-ds-1914351',
  'hu-cs-0110108103',
  'hu-dsai-0110108103'
);

-- Prolog Skills (Programming Languages courses)
UPDATE public.courses
SET unlocks_skills = ARRAY['Prolog']::TEXT[]
WHERE id IN (
  'ju-cs-1901471',
  'hu-cs-1910011416'
);

-- Cryptography & Decryption Skills
UPDATE public.courses
SET unlocks_skills = ARRAY['Cryptography', 'Decryption']::TEXT[]
WHERE name ILIKE '%cryptography%' OR id IN (
  'ju-cys-1911251',
  'hu-cys-2010043251',
  'ju-cys-1911131'
);

-- Assembly Skills (Computer Organization, Systems Programming)
UPDATE public.courses
SET unlocks_skills = ARRAY['Assembly']::TEXT[]
WHERE id IN (
  'ju-cs-1901322',
  'hu-swe-2010031272'
) OR name ILIKE '%computer organization%';

-- Add Assembly to Systems Programming courses (combine with C)
UPDATE public.courses
SET unlocks_skills = ARRAY['C', 'Assembly']::TEXT[]
WHERE id IN (
  'ju-cs-1901476'
);

-- Python Skills (for various programming courses)
UPDATE public.courses
SET unlocks_skills = ARRAY['Python']::TEXT[]
WHERE id IN (
  'ju-cs-1941102',
  'ju-ai-1941102',
  'ju-ds-1941102',
  'ju-bit-1941102',
  'hu-cs-1910011121',
  'hu-dsai-1910011121',
  'hu-swe-1910011121'
) OR name ILIKE '%introduction to programming%' OR name ILIKE '%ai programming%';

-- Java Skills
UPDATE public.courses
SET unlocks_skills = ARRAY['Java']::TEXT[]
WHERE name ILIKE '%object-oriented%' OR name ILIKE '%java%';

-- JavaScript/TypeScript Skills (Web Development)
UPDATE public.courses
SET unlocks_skills = ARRAY['JavaScript', 'HTML/CSS']::TEXT[]
WHERE name ILIKE '%web applications development%' OR id IN (
  'ju-cs-1904120',
  'ju-ai-1904120',
  'ju-ds-1902120',
  'ju-bit-1904120'
);

-- SQL Skills (Database courses)
UPDATE public.courses
SET unlocks_skills = ARRAY['SQL', 'MySQL']::TEXT[]
WHERE name ILIKE '%database%' AND year <= 2;

-- Advanced Database Skills
UPDATE public.courses
SET unlocks_skills = ARRAY['SQL', 'PostgreSQL', 'MongoDB']::TEXT[]
WHERE name ILIKE '%database%' AND year >= 3;

-- Git Skills
UPDATE public.courses
SET unlocks_skills = ARRAY['Git']::TEXT[]
WHERE name ILIKE '%software engineering%';

-- Node.js/Express Skills
UPDATE public.courses
SET unlocks_skills = ARRAY['Node.js', 'Express', 'REST APIs']::TEXT[]
WHERE name ILIKE '%web server%' OR name ILIKE '%backend%';

-- React/Frontend Skills
UPDATE public.courses
SET unlocks_skills = ARRAY['React', 'TypeScript', 'Tailwind']::TEXT[]
WHERE name ILIKE '%frontend%' OR name ILIKE '%modern web%';

-- Machine Learning Skills (Python, TensorFlow, PyTorch)
UPDATE public.courses
SET unlocks_skills = ARRAY['Python', 'Machine Learning']::TEXT[]
WHERE name ILIKE '%machine learning%' OR name ILIKE '%deep learning%' OR name ILIKE '%neural networks%';

-- AI Skills
UPDATE public.courses
SET unlocks_skills = ARRAY['Python', 'AI']::TEXT[]
WHERE name ILIKE '%artificial intelligence%' AND name NOT ILIKE '%ethics%';

-- Docker/Kubernetes Skills
UPDATE public.courses
SET unlocks_skills = ARRAY['Docker', 'CI/CD']::TEXT[]
WHERE name ILIKE '%devops%' OR name ILIKE '%cloud computing%';

-- Security Skills (various security courses)
UPDATE public.courses
SET unlocks_skills = array_append(COALESCE(unlocks_skills, ARRAY[]::TEXT[]), 'Security')
WHERE name ILIKE '%security%' AND 'Security' != ALL(COALESCE(unlocks_skills, ARRAY[]::TEXT[]));

-- C# Skills
UPDATE public.courses
SET unlocks_skills = ARRAY['C#']::TEXT[]
WHERE name ILIKE '%.net%' OR name ILIKE '%c#%';
