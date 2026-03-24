-- Complete Course Seed Data for Team-Finder
-- INCLUDING Math/Science Foundation Courses
-- Universities: JU (University of Jordan), HU (Hashemite University)
-- Total: 458 courses, 1282 credits across 12 majors
--
-- Math/Science courses added:
-- - Calculus (1), Linear Algebra
-- - Principles of Statistics
-- - General Physics (1), General Physics (2), Physics Laboratory
-- - Numerical Methods
--
-- JU Majors (6): CS, AI, DS, BIT, CIS, CYS
-- HU Majors (6): CS, DS_AI, SWE, BIT, CIS, CYS
--
-- Generated: 2026-03-25


-- ========================================
-- JU (University of Jordan) Courses
-- ========================================


-- JU CS: 31 courses, 87 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901101', '1901101', 'Discrete Mathematics', 'JU', 'CS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1941102', '1941102', 'Introduction to Programming', 'JU', 'CS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1904101', '1904101', 'Fundamentals of Information Technology', 'JU', 'CS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1904120', '1904120', 'Web Applications Development', 'JU', 'CS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1902110', '1902110', 'Object-Oriented Programming', 'JU', 'CS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-math1', 'MATH001', 'Calculus (1)', 'JU', 'CS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-math4', 'MATH004', 'General Physics (1)', 'JU', 'CS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1902242', '1902242', 'Data Structures', 'JU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1902243', '1902243', 'Data Structures Lab', 'JU', 'CS', 2, 1, 2, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1902224', '1902224', 'Database Management Systems', 'JU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901204', '1901204', 'Logic Design', 'JU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-math2', 'MATH002', 'Linear Algebra', 'JU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-math3', 'MATH003', 'Principles of Statistics', 'JU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901351', '1901351', 'Numerical Analysis', 'JU', 'CS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901241', '1901241', 'Theory of Computation', 'JU', 'CS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901341', '1901341', 'Theory of Algorithms', 'JU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901353', '1901353', 'Modeling and Simulation', 'JU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901301', '1901301', 'Computer Ethics', 'JU', 'CS', 3, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901322', '1901322', 'Computer Organization', 'JU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901363', '1901363', 'Computer Networks', 'JU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-math5', 'MATH005', 'Numerical Methods', 'JU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901359', '1901359', 'Computer Graphics', 'JU', 'CS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1905320', '1905320', 'Artificial Intelligence', 'JU', 'CS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1902372', '1902372', 'Software Engineering', 'JU', 'CS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1902390', '1902390', 'Seminar-Road to Software Industry', 'JU', 'CS', 3, 2, 0, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901444', '1901444', 'Computational Problems and Techniques', 'JU', 'CS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901471', '1901471', 'Design And Implementation of Programming Languages', 'JU', 'CS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901473', '1901473', 'Operating Systems', 'JU', 'CS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901476', '1901476', 'Systems Programming and Compilers Construction', 'JU', 'CS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901494', '1901494', 'Special topics', 'JU', 'CS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1911322', '1911322', 'Information Security and Privacy', 'JU', 'CS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- JU AI: 32 courses, 96 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1901101', '1901101', 'Discrete Mathematics', 'JU', 'AI', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1941102', '1941102', 'Introduction to Programming', 'JU', 'AI', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1904101', '1904101', 'Fundamentals of Information Technology', 'JU', 'AI', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1932110', '1932110', 'Object Oriented Programming', 'JU', 'AI', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1904120', '1904120', 'Web Applications Development', 'JU', 'AI', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1932120', '1932120', 'Introduction to Artificial Intelligence', 'JU', 'AI', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-math1', 'MATH001', 'Calculus (1)', 'JU', 'AI', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-math4', 'MATH004', 'General Physics (1)', 'JU', 'AI', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1932111', '1932111', 'AI Programming', 'JU', 'AI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1902242', '1902242', 'Data Structures', 'JU', 'AI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-math2', 'MATH002', 'Linear Algebra', 'JU', 'AI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-math3', 'MATH003', 'Principles of Statistics', 'JU', 'AI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1905341', '1905341', 'Theory of Algorithms', 'JU', 'AI', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1902222', '1902222', 'Data Mining', 'JU', 'AI', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1902221', '1902221', 'Knowledge Representation and Reasoning', 'JU', 'AI', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1902220', '1902220', 'Ethics of Artificial Intelligence and Data Sciences', 'JU', 'AI', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1902322', '1902322', 'Software Engineering', 'JU', 'AI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1911322', '1911322', 'Information Security', 'JU', 'AI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1932310', '1932310', 'Machine Learning and Neural Networks', 'JU', 'AI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-math5', 'MATH005', 'Numerical Methods', 'JU', 'AI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1901502', '1901502', 'Computer Networks', 'JU', 'AI', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1905323', '1905323', 'Ontologies and Knowledge', 'JU', 'AI', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1902322v', '1902322', 'Computer Vision', 'JU', 'AI', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1904320', '1904320', 'Internet of Things', 'JU', 'AI', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1905360', '1905360', 'Natural Language Processing', 'JU', 'AI', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1912421', '1912421', 'Deep Learning', 'JU', 'AI', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1905353', '1905353', 'Intelligent Robotics', 'JU', 'AI', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1901421', '1901421', 'Cloud Computing', 'JU', 'AI', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1904691', '1904691', 'Special Topics in Artificial Intelligence', 'JU', 'AI', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1904122', '1904122', 'Project Management', 'JU', 'AI', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1905380', '1905380', 'Arabic Language Engineering', 'JU', 'AI', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1911483', '1911483', 'Security Intelligence', 'JU', 'AI', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- JU DS: 32 courses, 93 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1904101', '1904101', 'Fundamentals of Information Technology', 'JU', 'DS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1941102', '1941102', 'Introduction to Programming', 'JU', 'DS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902110', '1902110', 'Object-Oriented Programming', 'JU', 'DS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902120', '1902120', 'Web Applications Development', 'JU', 'DS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1932521', '1932521', 'Principles of Data Science', 'JU', 'DS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-math1', 'MATH001', 'Calculus (1)', 'JU', 'DS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-math4', 'MATH004', 'General Physics (1)', 'JU', 'DS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1932111', '1932111', 'AI Programming', 'JU', 'DS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902242', '1902242', 'Database Systems', 'JU', 'DS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1901242', '1901242', 'Data Structures', 'JU', 'DS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-math2', 'MATH002', 'Linear Algebra', 'JU', 'DS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-math3', 'MATH003', 'Principles of Statistics', 'JU', 'DS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1901341', '1901341', 'Theory of Algorithms', 'JU', 'DS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902222', '1902222', 'Data Mining', 'JU', 'DS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1932331', '1932331', 'Web Engineering and Cloud Computing', 'JU', 'DS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1914351', '1914351', 'Applied Statistics', 'JU', 'DS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902322', '1902322', 'Software Engineering', 'JU', 'DS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1911322', '1911322', 'Intelligence Security', 'JU', 'DS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1932320', '1932320', 'Artificial Intelligence', 'JU', 'DS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-math5', 'MATH005', 'Numerical Methods', 'JU', 'DS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1901502', '1901502', 'Computer Networks', 'JU', 'DS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1933321', '1933321', 'NoSQL Databases', 'JU', 'DS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902390', '1902390', 'Seminar-Road to Software Industry', 'JU', 'DS', 3, 2, 0, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1932331v', '1932331', 'Machine Learning', 'JU', 'DS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1934341', '1934341', 'Big Data', 'JU', 'DS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1912421', '1912421', 'Deep Learning', 'JU', 'DS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1904122', '1904122', 'IT Project Management', 'JU', 'DS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1934691', '1934691', 'Special Topics in Data Science', 'JU', 'DS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902253', '1902253', 'Web Server Programming', 'JU', 'DS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1905353', '1905353', 'Intelligent Robotics', 'JU', 'DS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1904321', '1904321', 'Virtual Reality', 'JU', 'DS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902324', '1902324', 'Database Languages and Tools', 'JU', 'DS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- JU BIT: 31 courses, 93 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1901101', '1901101', 'Discrete Mathematics', 'JU', 'BIT', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1941102', '1941102', 'Introduction to Programming', 'JU', 'BIT', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1904101', '1904101', 'Fundamentals of Information Technology', 'JU', 'BIT', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1904120', '1904120', 'Web Applications Development', 'JU', 'BIT', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1902110', '1902110', 'Object-Oriented Programming', 'JU', 'BIT', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-math1', 'MATH001', 'Calculus (1)', 'JU', 'BIT', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-math4', 'MATH004', 'General Physics (1)', 'JU', 'BIT', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1902242', '1902242', 'Data Structures', 'JU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1902224', '1902224', 'Database Management Systems', 'JU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1902235', '1902235', 'Statistical Packages', 'JU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-math2', 'MATH002', 'Linear Algebra', 'JU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-math3', 'MATH003', 'Principles of Statistics', 'JU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1905341', '1905341', 'Theory of Algorithms', 'JU', 'BIT', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1904371', '1904371', 'Business Intelligence', 'JU', 'BIT', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1901363', '1901363', 'Computer Networks', 'JU', 'BIT', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1902321', '1902321', 'Web Server Programming', 'JU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1901301', '1901301', 'Computer Ethics', 'JU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1905353', '1905353', 'e-Business', 'JU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1902322', '1902322', 'Software Engineering', 'JU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1905211', '1905211', 'Mobile Programming', 'JU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-math5', 'MATH005', 'Numerical Methods', 'JU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1901102', '1901102', 'Artificial Intelligence', 'JU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1905331', '1905331', 'Learning Resource Management', 'JU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1905321', '1905321', 'Knowledge Management Systems', 'JU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1905355', '1905355', 'E-Learning', 'JU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1906383', '1906383', 'Document Analysis', 'JU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1905384', '1905384', 'Advanced Computer Networks', 'JU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1902336', '1902336', 'System Analysis and Design', 'JU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1905322', '1905322', 'Data Mining', 'JU', 'BIT', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1906434', '1906434', 'Payment Systems', 'JU', 'BIT', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1905494', '1905494', 'Special Topics in BIT', 'JU', 'BIT', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- JU CIS: 30 courses, 90 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1901101', '1901101', 'Discrete Mathematics', 'JU', 'CIS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1941102', '1941102', 'Introduction to Programming', 'JU', 'CIS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1904101', '1904101', 'Fundamentals of Information Technology', 'JU', 'CIS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1904120', '1904120', 'Web Applications Development', 'JU', 'CIS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902110', '1902110', 'Object-Oriented Programming', 'JU', 'CIS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-math1', 'MATH001', 'Calculus (1)', 'JU', 'CIS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-math4', 'MATH004', 'General Physics (1)', 'JU', 'CIS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902242', '1902242', 'Data Structures', 'JU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902224', '1902224', 'Database Management Systems', 'JU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902235', '1902235', 'Information Systems and Organizations', 'JU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1905201', '1905201', 'Computer Networks', 'JU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-math2', 'MATH002', 'Linear Algebra', 'JU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-math3', 'MATH003', 'Principles of Statistics', 'JU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902321', '1902321', 'Advanced Java Programming', 'JU', 'CIS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1905221', '1905221', 'Web Server Programming', 'JU', 'CIS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1905341', '1905341', 'Theory of Algorithms', 'JU', 'CIS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1901363', '1901363', 'Computer Networks', 'JU', 'CIS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1905310', '1905310', 'Mobile Development Frameworks', 'JU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902322', '1902322', 'Software Engineering', 'JU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902331', '1902331', 'Human Computer Interaction', 'JU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902312', '1902312', 'Database Technologies', 'JU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-math5', 'MATH005', 'Numerical Methods', 'JU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1905320', '1905320', 'Artificial Intelligence', 'JU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902316', '1902316', 'HCI User Interface', 'JU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902345', '1902345', 'Information Security and Privacy', 'JU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1905354', '1905354', 'Cloud Image Processing', 'JU', 'CIS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1905373', '1905373', 'Advanced Software Engineering', 'JU', 'CIS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902336', '1902336', 'System Analysis and Design', 'JU', 'CIS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902494', '1902494', 'Special Topics in CIS', 'JU', 'CIS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1905378', '1905378', 'Project Management', 'JU', 'CIS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- JU CYS: 31 courses, 90 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1901101', '1901101', 'Discrete Mathematics', 'JU', 'CYS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1941102', '1941102', 'Introduction to Programming', 'JU', 'CYS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1904101', '1904101', 'Fundamentals of Information Technology', 'JU', 'CYS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1904120', '1904120', 'Web Applications Development', 'JU', 'CYS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1902110', '1902110', 'Object-Oriented Programming', 'JU', 'CYS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911161', '1911161', 'Principles of Security', 'JU', 'CYS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-math1', 'MATH001', 'Calculus (1)', 'JU', 'CYS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-math4', 'MATH004', 'General Physics (1)', 'JU', 'CYS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911251', '1911251', 'Cryptography', 'JU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911252', '1911252', 'Security Risk Assessment and Ethics', 'JU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1902242', '1902242', 'Data Structures', 'JU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1902324', '1902324', 'Database Techniques', 'JU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-math2', 'MATH002', 'Linear Algebra', 'JU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-math3', 'MATH003', 'Principles of Statistics', 'JU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1902224', '1902224', 'Database Management Systems', 'JU', 'CYS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911262', '1911262', 'Computer Architecture and Organization', 'JU', 'CYS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1902372', '1902372', 'Software Engineering', 'JU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911351', '1911351', 'Security of Web Applications', 'JU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1902341', '1902341', 'Theory of Algorithms', 'JU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911361', '1911361', 'Computer Networks', 'JU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-math5', 'MATH005', 'Numerical Methods', 'JU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911131', '1911131', 'Cryptography and Coding Theory', 'JU', 'CYS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1904320', '1904320', 'Artificial Intelligence', 'JU', 'CYS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911367', '1911367', 'Network Security', 'JU', 'CYS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911381', '1911381', 'Penetration Testing and Forensics', 'JU', 'CYS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1902390', '1902390', 'Seminar-Road to Software Industry', 'JU', 'CYS', 3, 2, 0, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911441', '1911441', 'Authentication and Authorization', 'JU', 'CYS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911451', '1911451', 'Cyber Physical System Security', 'JU', 'CYS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1902310', '1902310', 'Advanced Programming', 'JU', 'CYS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911481', '1911481', 'Reverse Engineering and Malware Analysis', 'JU', 'CYS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911491', '1911491', 'Digital Forensics for Cybersecurity', 'JU', 'CYS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);


-- ========================================
-- HU (Hashemite University) Courses
-- ========================================


-- HU CS: 43 courses, 116 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011100', '1910011100', 'Introduction to Programming', 'HU', 'CS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011101', '1910011101', 'Introduction to Programming Lab', 'HU', 'CS', 1, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0110101152', '0110101152', 'Discrete Mathematics', 'HU', 'CS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011123', '1910011123', 'Digital Logic Design', 'HU', 'CS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011110', '1910011110', 'Object Oriented (1)', 'HU', 'CS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011111', '1910011111', 'Object Oriented Lab (1)', 'HU', 'CS', 1, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0151003260', '0151003260', 'Fundamentals of Software Engineering', 'HU', 'CS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0110108101', '0110108101', 'Calculus (1)', 'HU', 'CS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011250', '1910011250', 'Data Structures', 'HU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011112', '1910011112', 'Object Oriented (2)', 'HU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011213', '1910011213', 'Object Oriented Lab (2)', 'HU', 'CS', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011214', '1910011214', 'Visual Programming', 'HU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011215', '1910011215', 'Visual Programming Lab', 'HU', 'CS', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0110108103', '0110108103', 'Principles of Statistics', 'HU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0110408240', '0110408240', 'Computer Design and Organization', 'HU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011246', '1910011246', 'Theory of Computation', 'HU', 'CS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011320', '1910011320', 'Computer Networks', 'HU', 'CS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0151002240', '0151002240', 'Introduction to Database Systems', 'HU', 'CS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0151002310', '0151002310', 'Programming of Internet', 'HU', 'CS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0110102102', '0110102102', 'General Physics (2)', 'HU', 'CS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0110102103', '0110102103', 'General Physics Laboratory (1)', 'HU', 'CS', 2, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011251', '1910011251', 'Algorithms', 'HU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011431', '1910011431', 'Artificial Intelligence', 'HU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011320-os', '1910011320', 'Parallel and Distributed Operating Systems', 'HU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0110408343', '0110408343', 'Fundamentals of Computer Architecture', 'HU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0151000470', '0151000470', 'System Analysis & Design', 'HU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0110101408', '0110101408', 'Numerical Methods', 'HU', 'CS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0151002471', '0151002471', 'Information Systems Security', 'HU', 'CS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0151002351', '0151002351', 'Data Mining', 'HU', 'CS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-0151003437', '0151003437', 'User Interface Design & Implementation', 'HU', 'CS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011321', '1910011321', 'Internet Protocols', 'HU', 'CS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011322', '1910011322', 'Mobile Application Development', 'HU', 'CS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011330', '1910011330', 'Multimedia Programming', 'HU', 'CS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011341', '1910011341', 'Operation Research', 'HU', 'CS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011373', '1910011373', 'Simulation', 'HU', 'CS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011416', '1910011416', 'Programming Languages Design', 'HU', 'CS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011421', '1910011421', 'Wireless Networking', 'HU', 'CS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011422', '1910011422', 'Network Security', 'HU', 'CS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011474', '1910011474', 'Computer Graphics', 'HU', 'CS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011440', '1910011440', 'Practical Training', 'HU', 'CS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011440-1', '1910011440', 'Applied Project (1)', 'HU', 'CS', 4, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011491', '1910011491', 'Applied Project (2)', 'HU', 'CS', 4, 2, 2, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cs-1910011492', '1910011492', 'Special Topics In Computer Science', 'HU', 'CS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- HU DS_AI: 44 courses, 121 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-1910011100', '1910011100', 'Introduction to Programming', 'HU', 'DSAI', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-1910011101', '1910011101', 'Introduction to Programming Lab', 'HU', 'DSAI', 1, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-1910011123', '1910011123', 'Digital Logic Design', 'HU', 'DSAI', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0110101152', '0110101152', 'Discrete Mathematics', 'HU', 'DSAI', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-1910011250', '1910011250', 'Data Structures', 'HU', 'DSAI', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-1910011110', '1910011110', 'Object Oriented (1)', 'HU', 'DSAI', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-1910011111', '1910011111', 'Object Oriented Lab (1)', 'HU', 'DSAI', 1, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0110108101', '0110108101', 'Calculus (1)', 'HU', 'DSAI', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010031260', '2010031260', 'Fundamentals of Software Engineering', 'HU', 'DSAI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0151002240', '0151002240', 'Introduction to Database Systems', 'HU', 'DSAI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0151002241', '0151002241', 'Introduction to Database Systems Lab', 'HU', 'DSAI', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042220', '2010042220', 'Introduction to Artificial Intelligence', 'HU', 'DSAI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042260', '2010042260', 'Introduction to Data Science and Artificial Intelligence', 'HU', 'DSAI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042210', '2010042210', 'Information Retrieval', 'HU', 'DSAI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0110108103', '0110108103', 'Principles of Statistics', 'HU', 'DSAI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042211', '2010042211', 'Data Engineering', 'HU', 'DSAI', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042300', '2010042300', 'Algorithms Analysis and Design', 'HU', 'DSAI', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0151002310', '0151002310', 'Programming of Internet Applications', 'HU', 'DSAI', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010041250', '2010041250', 'Business Data Analytics', 'HU', 'DSAI', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0110102102', '0110102102', 'General Physics (2)', 'HU', 'DSAI', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0110102103', '0110102103', 'General Physics Laboratory (1)', 'HU', 'DSAI', 2, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010043212', '2010043212', 'Data Visualization', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010043321', '2010043321', 'Machine Learning', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010043322', '2010043322', 'Digital Image Processing', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010043323', '2010043323', 'Neural Networks & Deep Learning', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042362', '2010042362', 'cloud-computing', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0151002342', '0151002342', 'Advanced Database Systems', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0151002350', '0151002350', 'Data Warehousing Technologies', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042313', '2010042313', 'Time Series analysis', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042314', '2010042314', 'Data Security', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042352', '2010042352', 'Data Science Tools', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-0110101408', '0110101408', 'Numerical Methods', 'HU', 'DSAI', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042340', '2010042340', 'Robotic Programming', 'HU', 'DSAI', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042341', '2010042341', 'Introduction to Mobile Robots', 'HU', 'DSAI', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042391', '2010042391', 'Advanced Programming for Data Science and Artificial Intelligence (Big Data)', 'HU', 'DSAI', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042424', '2010042424', 'Computer Vision & AND 2010042351', 'HU', 'DSAI', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042403', '2010042403', 'High-Performance Computing', 'HU', 'DSAI', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042470', '2010042470', 'Natural Language Processing and Text Mining', 'HU', 'DSAI', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042490', '2010042490', 'Practical Training', 'HU', 'DSAI', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042491', '2010042491', 'Project in data science and artificial intelligence(1)', 'HU', 'DSAI', 4, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010041494', '2010041494', 'Research Methods in Information Technology', 'HU', 'DSAI', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042480', '2010042480', 'Smart Cities', 'HU', 'DSAI', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042492', '2010042492', 'Project in data science and artificial intelligence(2)', 'HU', 'DSAI', 4, 2, 2, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-dsai-2010042493', '2010042493', 'Special Topics', 'HU', 'DSAI', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- HU SWE: 42 courses, 118 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-1910011100', '1910011100', 'Introduction to Programming', 'HU', 'SWE', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-1910011101', '1910011101', 'Introduction to Programming Lab', 'HU', 'SWE', 1, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-1910011123', '1910011123', 'Digital Logic Design', 'HU', 'SWE', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-0110101152', '0110101152', 'Discrete Mathematics', 'HU', 'SWE', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-1910011250', '1910011250', 'Data Structures', 'HU', 'SWE', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-1910011110', '1910011110', 'Object Oriented (1)', 'HU', 'SWE', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-1910011111', '1910011111', 'Object Oriented Lab (1)', 'HU', 'SWE', 1, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-0110108101', '0110108101', 'Calculus (1)', 'HU', 'SWE', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031260', '2010031260', 'Fundamentals of Software Engineering', 'HU', 'SWE', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-0151002240', '0151002240', 'Introduction to Database Systems', 'HU', 'SWE', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-0151002241', '0151002241', 'Introduction to Database Systems Lab', 'HU', 'SWE', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-1910011351', '1910011351', 'Algorithms', 'HU', 'SWE', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-1510011431', '1510011431', 'Operating Systems', 'HU', 'SWE', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031272', '2010031272', 'Computer Organization', 'HU', 'SWE', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031220', '2010031220', 'Computer Programming for Software Engineering', 'HU', 'SWE', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-0110108103', '0110108103', 'Principles of Statistics', 'HU', 'SWE', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031221', '2010031221', 'Object Oriented Development', 'HU', 'SWE', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031273', '2010031273', 'Advanced Object Oriented Programming', 'HU', 'SWE', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-0110101408', '0110101408', 'Numerical Methods', 'HU', 'SWE', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-0110102102', '0110102102', 'General Physics (2)', 'HU', 'SWE', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-0110102103', '0110102103', 'General Physics Laboratory (1)', 'HU', 'SWE', 2, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031320', '2010031320', 'Software Architecture', 'HU', 'SWE', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031323', '2010031323', 'Software Requirements Engineering', 'HU', 'SWE', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031332', '2010031332', 'Software Design', 'HU', 'SWE', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-1510031352', '1510031352', 'Software Systems Analysis and Design', 'HU', 'SWE', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031353', '2010031353', 'Software Ethics and Security', 'HU', 'SWE', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-0110101408', '0110101408', 'Numerical Methods', 'HU', 'SWE', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031375', '2010031375', 'Web Applications Programming and Engineering', 'HU', 'SWE', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031410', '2010031410', 'Software Testing', 'HU', 'SWE', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031436', '2010031436', 'Software Project Management', 'HU', 'SWE', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031325', '2010031325', 'Software Maintenance', 'HU', 'SWE', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031334', '2010031334', 'Cloud Computing Applications', 'HU', 'SWE', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031354', '2010031354', 'Internet of Things and its Security', 'HU', 'SWE', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031355', '2010031355', 'Mobile Devices Applications Development', 'HU', 'SWE', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031356', '2010031356', 'Data Science and Artificial Intelligence', 'HU', 'SWE', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031437', '2010031437', 'User Interface Design & Implementation', 'HU', 'SWE', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031440', '2010031440', 'Software Quality Assurance', 'HU', 'SWE', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031498', '2010031498', 'Graduation Project (1)', 'HU', 'SWE', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031490', '2010031490', 'Practical Training', 'HU', 'SWE', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031441', '2010031441', 'Software Measurements', 'HU', 'SWE', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031499', '2010031499', 'Graduation Project (2)', 'HU', 'SWE', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-swe-2010031495', '2010031495', 'Selected Topics In Software Engineering', 'HU', 'SWE', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- HU BIT: 45 courses, 124 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011100', '1910011100', 'Introduction to Programming', 'HU', 'BIT', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011101', '1910011101', 'Introduction to Programming Lab', 'HU', 'BIT', 1, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011123', '1910011123', 'Digital Logic Design', 'HU', 'BIT', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0110101152', '0110101152', 'Discrete Mathematics', 'HU', 'BIT', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011250', '1910011250', 'Data Structures', 'HU', 'BIT', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011110', '1910011110', 'Object Oriented (1)', 'HU', 'BIT', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011111', '1910011111', 'Object Oriented Lab (1)', 'HU', 'BIT', 1, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0110108101', '0110108101', 'Calculus (1)', 'HU', 'BIT', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010031260', '2010031260', 'Fundamentals of Software Engineering', 'HU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0151002240', '0151002240', 'Introduction to Database Systems', 'HU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0151002241', '0151002241', 'Introduction to Database Systems Lab', 'HU', 'BIT', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011214', '1910011214', 'Visual Programming', 'HU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011212', '1910011212', 'Object Oriented (2)', 'HU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0110108103', '0110108103', 'Principles of Statistics', 'HU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0151002310', '0151002310', 'Programming of Internet Applications', 'HU', 'BIT', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011130', '1910011130', 'Simulation', 'HU', 'BIT', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011320', '1910011320', 'Computer Networks', 'HU', 'BIT', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0110102102', '0110102102', 'General Physics (2)', 'HU', 'BIT', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0110102103', '0110102103', 'General Physics Laboratory (1)', 'HU', 'BIT', 2, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0151002470', '0151002470', 'System Analysis & Design', 'HU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041260', '2010041260', 'Information Systems for Small and Medium Enterprises', 'HU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041330', '2010041330', 'Managing and Developing Information Systems', 'HU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0151002342', '0151002342', 'Advanced Database Systems', 'HU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011421', '1910011421', 'Wireless Networking', 'HU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-1910011422', '1910011422', 'Network Security', 'HU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0110101408', '0110101408', 'Numerical Methods', 'HU', 'BIT', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010031436', '2010031436', 'Software Project Management', 'HU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041280', '2010041280', 'Enterprise Architecture', 'HU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041360', '2010041360', 'E-Marketing', 'HU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041361', '2010041361', 'E-Services', 'HU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010043312', '2010043312', 'Data Mining', 'HU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010042362', '2010042362', 'cloud-computing', 'HU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0151002374', '0151002374', 'Information Systems Management', 'HU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-0151002410', '0151002410', 'Advanced Internet - Applications Programming', 'HU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041351', '2010041351', 'AI Applications in Business', 'HU', 'BIT', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041431', '2010041431', 'Electronic Business Security', 'HU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041441', '2010041441', 'Decision Support Systems', 'HU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041442', '2010041442', 'Knowledge Management', 'HU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041452', '2010041452', 'Business Intelligence', 'HU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041470', '2010041470', 'Enterprise Resource Planning Systems', 'HU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041490', '2010041490', 'Practical Training', 'HU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041491', '2010041491', 'Project in Business Information Technology (1)', 'HU', 'BIT', 4, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041494', '2010041494', 'Research Methods in Information Technology', 'HU', 'BIT', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041492', '2010041492', 'Project in Business Information Technology (2)', 'HU', 'BIT', 4, 2, 2, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-bit-2010041493', '2010041493', 'Special Topics In Business Information', 'HU', 'BIT', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- HU CIS: 47 courses, 124 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001100', '0151001100', 'Introduction to Programming', 'HU', 'CIS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001101', '0151001101', 'Introduction to Programming Lab', 'HU', 'CIS', 1, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001123', '0151001123', 'Digital Logic Design', 'HU', 'CIS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0110101152', '0110101152', 'Discrete Mathematics', 'HU', 'CIS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001250', '0151001250', 'Data Structures', 'HU', 'CIS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001110', '0151001110', 'Object Oriented (1)', 'HU', 'CIS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001111', '0151001111', 'Object Oriented Lab (1)', 'HU', 'CIS', 1, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0110108101', '0110108101', 'Calculus (1)', 'HU', 'CIS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151003260', '0151003260', 'Fundamentals of Software Engineering', 'HU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001212', '0151001212', 'Object Oriented (2)', 'HU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001213', '0151001213', 'Object Oriented Lab (2)', 'HU', 'CIS', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001214', '0151001214', 'Visual Programming', 'HU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001215', '0151001215', 'Visual Programming Lab', 'HU', 'CIS', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002240', '0151002240', 'Introduction to Database Systems', 'HU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002241', '0151002241', 'Introduction to Database Systems Lab', 'HU', 'CIS', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0110108103', '0110108103', 'Principles of Statistics', 'HU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001320', '0151001320', 'Computer Networks', 'HU', 'CIS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001351', '0151001351', 'Algorithms', 'HU', 'CIS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002310', '0151002310', 'Programming of Internet Applications', 'HU', 'CIS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002311', '0151002311', 'Programming of Internet Applications Lab', 'HU', 'CIS', 2, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001431', '0151001431', 'Operating Systems', 'HU', 'CIS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0110408240', '0110408240', 'Computer Design and Organization', 'HU', 'CIS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0110102102', '0110102102', 'General Physics (2)', 'HU', 'CIS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0110102103', '0110102103', 'General Physics Laboratory (1)', 'HU', 'CIS', 2, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001431', '0151001431', 'Wireless Networking & Mobile Applications', 'HU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002324', '0151002324', 'Advanced Database Systems', 'HU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002350', '0151002350', 'Data Warehousing Technologies', 'HU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002376', '0151002376', 'System Analysis & Design', 'HU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001321', '0151001321', 'Internet Protocols', 'HU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001330', '0151001330', 'Multimedia Programming', 'HU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001460', '0151001460', 'Artificial Intelligence', 'HU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151003221', '0151003221', 'Object Oriented Software Development', 'HU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0110101408', '0110101408', 'Numerical Methods', 'HU', 'CIS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002361', '0151002361', 'Data Mining', 'HU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002372', '0151002372', 'Information Retrieval Systems', 'HU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002374', '0151002374', 'Information Systems Management', 'HU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002375', '0151002375', 'E-commerce', 'HU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151001422', '0151001422', 'Network Security', 'HU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002377', '0151002377', 'Information Technology Systems', 'HU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002410', '0151002410', 'Advanced Internet - Applications Programming', 'HU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151003436', '0151003436', 'Software Project Mangement', 'HU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151003437', '0151003437', 'User Interface Design & Implementation', 'HU', 'CIS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002471', '0151002471', 'Information Systems Security', 'HU', 'CIS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002490', '0151002490', 'Practical Training', 'HU', 'CIS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002492', '0151002492', 'Applied Project (1)', 'HU', 'CIS', 4, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002493', '0151002493', 'Applied Project (2)', 'HU', 'CIS', 4, 2, 2, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cis-0151002491', '0151002491', 'Selected Topics In Computer Information Systems', 'HU', 'CIS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- HU CYS: 50 courses, 130 credits
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011100', '1910011100', 'Introduction to Programming', 'HU', 'CYS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011101', '1910011101', 'Introduction to Programming Lab', 'HU', 'CYS', 1, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011123', '1910011123', 'Digital Logic Design', 'HU', 'CYS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0110101152', '0110101152', 'Discrete Mathematics', 'HU', 'CYS', 1, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011250', '1910011250', 'Data Structures', 'HU', 'CYS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011110', '1910011110', 'Object Oriented (1)', 'HU', 'CYS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011111', '1910011111', 'Object Oriented Lab (1)', 'HU', 'CYS', 1, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0110108101', '0110108101', 'Calculus (1)', 'HU', 'CYS', 1, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010031260', '2010031260', 'Fundamentals of Software Engineering', 'HU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0151002240', '0151002240', 'Introduction to Database Systems', 'HU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0151002241', '0151002241', 'Introduction to Database Systems Lab', 'HU', 'CYS', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011212', '1910011212', 'Object Oriented (2)', 'HU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011213', '1910011213', 'Object Oriented Lab (2)', 'HU', 'CYS', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011214', '1910011214', 'Visual Programming', 'HU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011215', '1910011215', 'Visual Programming Lab', 'HU', 'CYS', 2, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0110108103', '0110108103', 'Principles of Statistics', 'HU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0151002310', '0151002310', 'Programming of Internet Applications', 'HU', 'CYS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0151002311', '0151002311', 'Programming of Internet Applications Lab', 'HU', 'CYS', 2, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011320', '1910011320', 'Computer Networks', 'HU', 'CYS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011351', '1910011351', 'Algorithms', 'HU', 'CYS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043250', '2010043250', 'Introduction to cybersecurity', 'HU', 'CYS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011431', '1910011431', 'Operating Systems', 'HU', 'CYS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043316', '2010043316', 'Python Programming', 'HU', 'CYS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0110408240', '0110408240', 'Computer Design and Organization', 'HU', 'CYS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0110102102', '0110102102', 'General Physics (2)', 'HU', 'CYS', 2, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0110102103', '0110102103', 'General Physics Laboratory (1)', 'HU', 'CYS', 2, 2, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0151002470', '0151002470', 'System Analysis & Design', 'HU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043251', '2010043251', 'Cryptography', 'HU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043360', '2010043360', 'Information Security Protocols', 'HU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043371', '2010043371', 'Database Management Systems and Security', 'HU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011321', '1910011321', 'Internet Protocols', 'HU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-1910011460', '1910011460', 'Artificial Intelligence', 'HU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0110101408', '0110101408', 'Numerical Methods', 'HU', 'CYS', 3, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043360', '2010043360', 'Network Monitoring and Analysis', 'HU', 'CYS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043361', '2010043361', 'Ethical Hacking', 'HU', 'CYS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043362', '2010043362', 'Ethical Hacking Lab', 'HU', 'CYS', 3, 2, 2, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043363', '2010043363', 'Network Security Threats', 'HU', 'CYS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-0151002410', '0151002410', 'Advanced Internet - Applications Programming', 'HU', 'CYS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010031436', '2010031436', 'Software Project Mangement', 'HU', 'CYS', 3, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043481', '2010043481', 'Digital Forensics', 'HU', 'CYS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043482', '2010043482', 'Digital Forensics Lab', 'HU', 'CYS', 4, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043472', '2010043472', 'E-commerce Security', 'HU', 'CYS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043484', '2010043484', 'Information Hiding Techniques', 'HU', 'CYS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043490', '2010043490', 'Practical Training', 'HU', 'CYS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043491', '2010043491', 'Applied Project(1)', 'HU', 'CYS', 4, 1, 1, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043452', '2010043452', 'Cloud Computing Security', 'HU', 'CYS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043485', '2010043485', 'Malicious Software', 'HU', 'CYS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043486', '2010043486', 'Integrated Penetration Protection', 'HU', 'CYS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043492', '2010043492', 'Applied Project(2)', 'HU', 'CYS', 4, 2, 2, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('hu-cys-2010043487', '2010043487', 'Special Topics in Cyber Security', 'HU', 'CYS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);