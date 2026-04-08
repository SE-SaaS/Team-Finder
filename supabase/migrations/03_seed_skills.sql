-- ============================================
-- SEED MASTER SKILLS TABLE
-- All available skills in the platform
-- ============================================

INSERT INTO skills (name, category) VALUES
-- Frontend
('HTML/CSS', 'Frontend'),
('JavaScript', 'Frontend'),
('TypeScript', 'Frontend'),
('React', 'Frontend'),
('Vue', 'Frontend'),
('Angular', 'Frontend'),
('Next.js', 'Frontend'),
('Tailwind', 'Frontend'),
('Sass', 'Frontend'),
('Webpack', 'Frontend'),

-- Backend
('Node.js', 'Backend'),
('Express', 'Backend'),
('Python', 'Backend'),
('Django', 'Backend'),
('Flask', 'Backend'),
('Java', 'Backend'),
('Spring Boot', 'Backend'),
('C#', 'Backend'),
('.NET', 'Backend'),
('PHP', 'Backend'),
('Go', 'Backend'),
('Rust', 'Backend'),
('REST APIs', 'Backend'),
('GraphQL', 'Backend'),

-- Database
('SQL', 'Database'),
('MySQL', 'Database'),
('PostgreSQL', 'Database'),
('MongoDB', 'Database'),
('Redis', 'Database'),
('Firebase', 'Database'),

-- DevOps & Cloud
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('CI/CD', 'DevOps'),
('Git', 'DevOps'),
('AWS', 'Cloud'),
('Azure', 'Cloud'),
('GCP', 'Cloud'),

-- Mobile
('React Native', 'Mobile'),
('Flutter', 'Mobile'),
('Swift', 'Mobile'),
('Kotlin', 'Mobile'),

-- Data Science & ML
('R', 'Data Science'),
('Pandas', 'Data Science'),
('NumPy', 'Data Science'),
('Scikit-learn', 'Machine Learning'),
('TensorFlow', 'Machine Learning'),
('PyTorch', 'Machine Learning'),
('Spark', 'Big Data'),
('Hadoop', 'Big Data'),

-- Programming Languages
('C++', 'Programming'),
('C', 'Programming'),

-- Other
('AI', 'AI/ML'),
('Testing', 'Testing'),
('Networking', 'Networking'),
('Security', 'Security'),
('Cryptography', 'Security'),
('Linux', 'Systems')

ON CONFLICT (name) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Skills seeded successfully!';
END $$;
