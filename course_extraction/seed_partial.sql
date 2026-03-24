-- Seed data for courses table
-- Generated from PDF extraction: JU CS, AI, DS

-- JU CS (26 courses)

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
VALUES ('ju-cs-1902242', '1902242', 'Data Structures', 'JU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1902243', '1902243', 'Data Structures Lab', 'JU', 'CS', 2, 1, 2, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1902224', '1902224', 'Database Management Systems', 'JU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cs-1901204', '1901204', 'Logic Design', 'JU', 'CS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
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

-- JU AI (22 courses)

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
VALUES ('ju-ai-1932111', '1932111', 'AI Programming', 'JU', 'AI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1902242', '1902242', 'Data Structures', 'JU', 'AI', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
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
VALUES ('ju-ai-1904691', '1904691', 'Special Topics in Artificial Intelligence', 'JU', 'AI', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- JU DS (22 courses)

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
VALUES ('ju-ds-1932111', '1932111', 'AI Programming', 'JU', 'DS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902242', '1902242', 'Database Systems', 'JU', 'DS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1901242', '1901242', 'Data Structures', 'JU', 'DS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
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
VALUES ('ju-ds-1934691', '1934691', 'Special Topics in Data Science', 'JU', 'DS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
