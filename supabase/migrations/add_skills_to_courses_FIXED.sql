-- Migration: Add skills mapping to courses (CORRECTED VERSION)
-- This updates the unlocks_skills array with INTEGER skill IDs
--
-- Skill ID Reference:
-- Frontend: 1-10 (HTML/CSS, JavaScript, TypeScript, React, Vue, Angular, Next.js, Tailwind, Sass, Webpack)
-- Backend: 11-25 (Node.js, Express, Python, Django, Flask, Java, Spring Boot, C#, .NET, PHP, C, C++, Rust, R, Prolog)
-- Database: 26-31 (SQL, PostgreSQL, MongoDB, MySQL, Redis, Firebase)
-- DevOps: 32-37 (Git, Docker, Kubernetes, CI/CD, AWS, Azure)
-- Mobile: 38-40 (React Native, Flutter, Swift)
-- Security: 41-43 (Cryptography, Decryption, Assembly)
-- Other: 44-46 (REST APIs, GraphQL, Testing)

-- C++ Skills (ID: 22) - Object-Oriented Programming courses
UPDATE public.courses
SET unlocks_skills = ARRAY[22]::INTEGER[]
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

-- C Skills (ID: 21) - Systems Programming, Compilers, OS
UPDATE public.courses
SET unlocks_skills = ARRAY[21]::INTEGER[]
WHERE id IN (
  'ju-cs-1901473'  -- Operating Systems
);

-- R Skills (ID: 24) - Statistics courses
UPDATE public.courses
SET unlocks_skills = ARRAY[24]::INTEGER[]
WHERE code IN ('MATH003') OR id IN (
  'ju-ds-1914351',
  'hu-cs-0110108103',
  'hu-dsai-0110108103'
);

-- Prolog Skills (ID: 25) - Programming Languages courses
UPDATE public.courses
SET unlocks_skills = ARRAY[25]::INTEGER[]
WHERE id IN (
  'ju-cs-1901471',
  'hu-cs-1910011416'
);

-- Cryptography & Decryption Skills (IDs: 41, 42)
UPDATE public.courses
SET unlocks_skills = ARRAY[41, 42]::INTEGER[]
WHERE name ILIKE '%cryptography%' OR id IN (
  'ju-cys-1911251',
  'hu-cys-2010043251',
  'ju-cys-1911131'
);

-- Assembly Skills (ID: 43) - Computer Organization
UPDATE public.courses
SET unlocks_skills = ARRAY[43]::INTEGER[]
WHERE id IN (
  'ju-cs-1901322',
  'hu-swe-2010031272'
) OR name ILIKE '%computer organization%';

-- C + Assembly (IDs: 21, 43) - Systems Programming and Compilers
UPDATE public.courses
SET unlocks_skills = ARRAY[21, 43]::INTEGER[]
WHERE id IN (
  'ju-cs-1901476'
);

-- Python Skills (ID: 13) - Programming courses
UPDATE public.courses
SET unlocks_skills = ARRAY[13]::INTEGER[]
WHERE id IN (
  'ju-cs-1941102',
  'ju-ai-1941102',
  'ju-ds-1941102',
  'ju-bit-1941102',
  'hu-cs-1910011121',
  'hu-dsai-1910011121',
  'hu-swe-1910011121'
) OR name ILIKE '%introduction to programming%' OR name ILIKE '%ai programming%';

-- Java Skills (ID: 16) - OOP and Java courses
UPDATE public.courses
SET unlocks_skills = ARRAY[16]::INTEGER[]
WHERE name ILIKE '%java%' AND name NOT ILIKE '%javascript%';

-- Java + C++ (IDs: 16, 22) - Object-Oriented Programming
UPDATE public.courses
SET unlocks_skills = ARRAY[16, 22]::INTEGER[]
WHERE name ILIKE '%object-oriented%' AND unlocks_skills IS NULL;

-- JavaScript + HTML/CSS (IDs: 2, 1) - Web Development
UPDATE public.courses
SET unlocks_skills = ARRAY[2, 1]::INTEGER[]
WHERE name ILIKE '%web applications development%' OR id IN (
  'ju-cs-1904120',
  'ju-ai-1904120',
  'ju-ds-1902120',
  'ju-bit-1904120'
);

-- SQL + MySQL (IDs: 26, 29) - Basic Database courses
UPDATE public.courses
SET unlocks_skills = ARRAY[26, 29]::INTEGER[]
WHERE name ILIKE '%database%' AND year <= 2;

-- SQL + PostgreSQL + MongoDB (IDs: 26, 27, 28) - Advanced Database
UPDATE public.courses
SET unlocks_skills = ARRAY[26, 27, 28]::INTEGER[]
WHERE name ILIKE '%database%' AND year >= 3;

-- Git (ID: 32) - Software Engineering
UPDATE public.courses
SET unlocks_skills = ARRAY[32]::INTEGER[]
WHERE name ILIKE '%software engineering%';

-- Node.js + Express + REST APIs (IDs: 11, 12, 44) - Backend/Web Server
UPDATE public.courses
SET unlocks_skills = ARRAY[11, 12, 44]::INTEGER[]
WHERE name ILIKE '%web server%' OR name ILIKE '%backend%';

-- React + TypeScript + Tailwind (IDs: 4, 3, 8) - Frontend Development
UPDATE public.courses
SET unlocks_skills = ARRAY[4, 3, 8]::INTEGER[]
WHERE name ILIKE '%frontend%' OR name ILIKE '%modern web%';

-- Machine Learning (Python implied) - Note: "Machine Learning" not in base skills, use Python (13)
UPDATE public.courses
SET unlocks_skills = ARRAY[13]::INTEGER[]
WHERE (name ILIKE '%machine learning%' OR name ILIKE '%deep learning%' OR name ILIKE '%neural networks%')
  AND unlocks_skills IS NULL;

-- AI courses (Python: 13)
UPDATE public.courses
SET unlocks_skills = ARRAY[13]::INTEGER[]
WHERE name ILIKE '%artificial intelligence%' AND name NOT ILIKE '%ethics%' AND unlocks_skills IS NULL;

-- Docker + CI/CD (IDs: 33, 35) - DevOps and Cloud
UPDATE public.courses
SET unlocks_skills = ARRAY[33, 35]::INTEGER[]
WHERE name ILIKE '%devops%' OR name ILIKE '%cloud computing%';

-- C# (ID: 18) - .NET courses
UPDATE public.courses
SET unlocks_skills = ARRAY[18]::INTEGER[]
WHERE name ILIKE '%.net%' OR name ILIKE '%c#%';

-- NoSQL Database - MongoDB (ID: 28)
UPDATE public.courses
SET unlocks_skills = ARRAY[28]::INTEGER[]
WHERE name ILIKE '%nosql%';

-- Computer Networks - Add networking skill if you want, or leave as is
-- UPDATE public.courses
-- SET unlocks_skills = ARRAY[]::INTEGER[]
-- WHERE name ILIKE '%network%';
