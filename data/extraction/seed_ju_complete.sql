-- COMPLETE JU MAJORS SEED DATA
-- 6 majors: CS, AI, DS, BIT, CIS, CYS
-- 157 courses total, average 76 credits per major
-- Excludes university requirements (27 cr)

-- JU CS: 26 courses, 72 credits

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

-- JU AI: 27 courses, 81 credits

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
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1905353', '1905353', 'Intelligent Robotics', 'JU', 'AI', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1901421', '1901421', 'Cloud Computing', 'JU', 'AI', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1904122', '1904122', 'Project Management', 'JU', 'AI', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1905380', '1905380', 'Arabic Language Engineering', 'JU', 'AI', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ai-1911483', '1911483', 'Security Intelligence', 'JU', 'AI', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- JU DS: 27 courses, 78 credits

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
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1904122', '1904122', 'IT Project Management', 'JU', 'DS', 4, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902253', '1902253', 'Web Server Programming', 'JU', 'DS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1905353', '1905353', 'Intelligent Robotics', 'JU', 'DS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1904321', '1904321', 'Virtual Reality', 'JU', 'DS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-ds-1902324', '1902324', 'Database Languages and Tools', 'JU', 'DS', 4, 2, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);

-- JU BIT: 26 courses, 78 credits

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
VALUES ('ju-bit-1902242', '1902242', 'Data Structures', 'JU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1902224', '1902224', 'Database Management Systems', 'JU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-bit-1902235', '1902235', 'Statistical Packages', 'JU', 'BIT', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
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

-- JU CIS: 25 courses, 75 credits

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
VALUES ('ju-cis-1902242', '1902242', 'Data Structures', 'JU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902224', '1902224', 'Database Management Systems', 'JU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1902235', '1902235', 'Information Systems and Organizations', 'JU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cis-1905201', '1905201', 'Computer Networks', 'JU', 'CIS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
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

-- JU CYS: 26 courses, 75 credits

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
VALUES ('ju-cys-1911251', '1911251', 'Cryptography', 'JU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1911252', '1911252', 'Security Risk Assessment and Ethics', 'JU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1902242', '1902242', 'Data Structures', 'JU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
INSERT INTO public.courses (id, code, name, university, major, year, semester, credit_hours, prerequisite_ids, unlocks_skills, description)
VALUES ('ju-cys-1902324', '1902324', 'Database Techniques', 'JU', 'CYS', 2, 1, 3, ARRAY[]::TEXT[], ARRAY[]::INTEGER[], NULL);
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
