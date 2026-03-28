-- CORRECTED Skill Mappings Based on Actual Curriculum
-- This fixes the course-skill mapping bugs

-- Clear all existing skills first
UPDATE public.courses SET unlocks_skills = ARRAY[]::INTEGER[];

-- ============================================
-- YEAR 1 COURSES (Theoretical - Few Skills)
-- ============================================

-- Introduction to Programming → C++ (Year 1, Semester 1)
-- Based on curriculum: "Sci. Computing Skills (C++)"
UPDATE public.courses
SET unlocks_skills = ARRAY[22]::INTEGER[]  -- C++
WHERE name ILIKE '%introduction to programming%'
  AND year = 1 AND semester = 1;

-- Web Applications Development → HTML/CSS + JavaScript (Year 1, Semester 2)
UPDATE public.courses
SET unlocks_skills = ARRAY[1, 2]::INTEGER[]  -- HTML/CSS, JavaScript
WHERE name ILIKE '%web applications development%'
  AND year = 1;

-- Object-Oriented Programming → Java (Year 1, Semester 2)
UPDATE public.courses
SET unlocks_skills = ARRAY[16]::INTEGER[]  -- Java
WHERE name ILIKE '%object-oriented programming%'
  AND year = 1;

-- ============================================
-- YEAR 2 COURSES (Project-Based - More Skills)
-- ============================================

-- AI Programming → Python (Year 2)
UPDATE public.courses
SET unlocks_skills = ARRAY[13]::INTEGER[]  -- Python
WHERE name ILIKE '%ai programming%'
  AND year = 2;

-- Data Structures → C++ (Year 2)
UPDATE public.courses
SET unlocks_skills = ARRAY[22]::INTEGER[]  -- C++ only
WHERE name ILIKE '%data structures%'
  AND year = 2;

-- Database Management Systems → SQL + MySQL (Year 2)
UPDATE public.courses
SET unlocks_skills = ARRAY[26, 29]::INTEGER[]  -- SQL, MySQL
WHERE name ILIKE '%database%'
  AND name NOT ILIKE '%nosql%'
  AND year = 2;

-- Applied Statistics → R (Year 2)
UPDATE public.courses
SET unlocks_skills = ARRAY[24]::INTEGER[]  -- R
WHERE (name ILIKE '%statistics%' OR code = 'MATH003')
  AND year >= 2;

-- ============================================
-- YEAR 3 COURSES (Advanced Skills)
-- ============================================

-- Software Engineering → Git + Testing (Year 3)
UPDATE public.courses
SET unlocks_skills = ARRAY[32, 46]::INTEGER[]  -- Git, Testing
WHERE name ILIKE '%software engineering%'
  AND year = 3;

-- Web Server Programming → Node.js + Express + REST APIs (Year 3)
UPDATE public.courses
SET unlocks_skills = ARRAY[11, 12, 44]::INTEGER[]  -- Node.js, Express, REST APIs
WHERE (name ILIKE '%web server%' OR name ILIKE '%backend%')
  AND year >= 3;

-- NoSQL Databases → MongoDB (Year 3)
UPDATE public.courses
SET unlocks_skills = ARRAY[28]::INTEGER[]  -- MongoDB
WHERE name ILIKE '%nosql%';

-- Advanced Database → PostgreSQL + MongoDB (Year 3)
UPDATE public.courses
SET unlocks_skills = ARRAY[26, 27, 28]::INTEGER[]  -- SQL, PostgreSQL, MongoDB
WHERE name ILIKE '%database%'
  AND year >= 3
  AND name NOT ILIKE '%nosql%';

-- Computer Organization → Assembly (Year 3)
UPDATE public.courses
SET unlocks_skills = ARRAY[43]::INTEGER[]  -- Assembly
WHERE name ILIKE '%computer organization%';

-- Operating Systems → C (Year 4)
UPDATE public.courses
SET unlocks_skills = ARRAY[21]::INTEGER[]  -- C
WHERE name ILIKE '%operating system%';

-- Systems Programming and Compilers → C + Assembly (Year 4)
UPDATE public.courses
SET unlocks_skills = ARRAY[21, 43]::INTEGER[]  -- C, Assembly
WHERE name ILIKE '%systems programming%' OR name ILIKE '%compilers%';

-- Cryptography Courses → Cryptography + Decryption (Year 3)
UPDATE public.courses
SET unlocks_skills = ARRAY[41, 42]::INTEGER[]  -- Cryptography, Decryption
WHERE name ILIKE '%cryptography%';

-- Programming Languages Design → Prolog (Year 4)
UPDATE public.courses
SET unlocks_skills = ARRAY[25]::INTEGER[]  -- Prolog
WHERE name ILIKE '%programming language%' AND name ILIKE '%design%';

-- ============================================
-- YEAR 3-4: WEB DEVELOPMENT ADVANCED
-- ============================================

-- Frontend Development / Modern Web → React + TypeScript + Tailwind
UPDATE public.courses
SET unlocks_skills = ARRAY[3, 4, 8]::INTEGER[]  -- TypeScript, React, Tailwind
WHERE (name ILIKE '%frontend%' OR name ILIKE '%modern web%' OR name ILIKE '%web applications programming%')
  AND year >= 3;

-- .NET Development → C# + .NET
UPDATE public.courses
SET unlocks_skills = ARRAY[18, 19]::INTEGER[]  -- C#, .NET
WHERE name ILIKE '%.net%';

-- ============================================
-- YEAR 3-4: DEVOPS & CLOUD
-- ============================================

-- DevOps Fundamentals → Docker + CI/CD (Year 3-4)
UPDATE public.courses
SET unlocks_skills = ARRAY[33, 35]::INTEGER[]  -- Docker, CI/CD
WHERE name ILIKE '%devops%';

-- Cloud Computing → Docker + CI/CD + AWS (Year 4)
UPDATE public.courses
SET unlocks_skills = ARRAY[33, 35, 36]::INTEGER[]  -- Docker, CI/CD, AWS
WHERE name ILIKE '%cloud computing%';

-- ============================================
-- YEAR 3-4: AI/ML COURSES
-- ============================================

-- Machine Learning → Python (prerequisite: already has Python from Y2)
UPDATE public.courses
SET unlocks_skills = ARRAY[13]::INTEGER[]  -- Python (reinforced)
WHERE name ILIKE '%machine learning%' OR name ILIKE '%deep learning%';

-- Artificial Intelligence → Python
UPDATE public.courses
SET unlocks_skills = ARRAY[13]::INTEGER[]  -- Python
WHERE name ILIKE '%artificial intelligence%'
  AND name NOT ILIKE '%ethics%'
  AND name NOT ILIKE '%intro%';

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to check the mappings:
-- SELECT year, semester, code, name, unlocks_skills
-- FROM courses
-- WHERE unlocks_skills IS NOT NULL AND unlocks_skills != ARRAY[]::INTEGER[]
-- ORDER BY year, semester, code;
