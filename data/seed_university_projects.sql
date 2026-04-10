-- Seed standardized university projects (always visible, some locked)
-- Run this to populate the database with test projects for prefetching

-- JU Projects
INSERT INTO projects (type, title, description, difficulty, tech_stack, skills_needed, team_size, deadline, university, status, created_at) VALUES
('university', 'AI-Powered Study Planner', 'Build an intelligent study planning app that uses machine learning to optimize student schedules based on course difficulty, deadlines, and personal learning patterns.', 'advanced', ARRAY['Python', 'TensorFlow', 'React', 'PostgreSQL'], ARRAY['Machine Learning', 'Data Science', 'Full-Stack Development'], 4, NOW() + INTERVAL '60 days', 'University of Jordan', 'locked', NOW()),

('university', 'Campus Navigation AR App', 'Develop an augmented reality mobile app that helps students navigate the JU campus using their phone camera with real-time directions and building information.', 'intermediate', ARRAY['React Native', 'ARKit', 'Node.js', 'MongoDB'], ARRAY['Mobile Development', 'AR/VR', 'Backend Development'], 3, NOW() + INTERVAL '45 days', 'University of Jordan', 'open', NOW()),

('university', 'Blockchain-Based Grade Verification', 'Create a blockchain system for secure, tamper-proof storage and verification of academic transcripts and certificates.', 'advanced', ARRAY['Solidity', 'Ethereum', 'Web3.js', 'Next.js'], ARRAY['Blockchain', 'Smart Contracts', 'Cryptography'], 3, NOW() + INTERVAL '90 days', 'University of Jordan', 'locked', NOW()),

('university', 'Virtual Lab Simulation Platform', 'Design an interactive web platform for conducting chemistry and physics experiments virtually with real-time calculations and 3D visualizations.', 'intermediate', ARRAY['Three.js', 'React', 'WebGL', 'Firebase'], ARRAY['3D Graphics', 'Physics Simulation', 'Frontend Development'], 4, NOW() + INTERVAL '75 days', 'University of Jordan', 'open', NOW()),

('university', 'Student Collaboration Hub', 'Build a real-time collaboration platform where students can share notes, create study groups, and work on projects together with integrated video calls.', 'beginner', ARRAY['React', 'Socket.io', 'Express', 'PostgreSQL'], ARRAY['Web Development', 'Real-time Systems', 'Database Design'], 3, NOW() + INTERVAL '30 days', 'University of Jordan', 'open', NOW()),

('university', 'Campus Energy Monitor', 'IoT-based system to monitor and optimize energy consumption across campus buildings with real-time dashboards and predictive analytics.', 'advanced', ARRAY['Python', 'IoT', 'React', 'InfluxDB', 'MQTT'], ARRAY['IoT Development', 'Data Analytics', 'System Architecture'], 5, NOW() + INTERVAL '120 days', 'University of Jordan', 'locked', NOW()),

('university', 'Course Registration Optimizer', 'Intelligent system that suggests optimal course combinations based on prerequisites, schedule conflicts, and graduation requirements.', 'intermediate', ARRAY['Python', 'Django', 'React', 'PostgreSQL'], ARRAY['Algorithm Design', 'Full-Stack Development', 'Database Optimization'], 3, NOW() + INTERVAL '50 days', 'University of Jordan', 'open', NOW()),

('university', 'Library Book Recommendation System', 'ML-powered recommendation engine for the university library that suggests books based on major, reading history, and trending topics.', 'intermediate', ARRAY['Python', 'scikit-learn', 'FastAPI', 'Vue.js'], ARRAY['Machine Learning', 'REST APIs', 'Frontend Development'], 3, NOW() + INTERVAL '40 days', 'University of Jordan', 'open', NOW()),

-- HU Projects
('university', 'Smart Attendance System', 'Face recognition-based attendance system with anti-spoofing features and automated reporting for professors.', 'advanced', ARRAY['Python', 'OpenCV', 'TensorFlow', 'Flask', 'MySQL'], ARRAY['Computer Vision', 'Deep Learning', 'Backend Development'], 4, NOW() + INTERVAL '70 days', 'Hashemite University', 'locked', NOW()),

('university', 'Campus Event Management Platform', 'Comprehensive platform for creating, managing, and discovering campus events with ticketing, notifications, and analytics.', 'beginner', ARRAY['React', 'Node.js', 'MongoDB', 'Stripe API'], ARRAY['Web Development', 'Payment Integration', 'UX Design'], 4, NOW() + INTERVAL '35 days', 'Hashemite University', 'open', NOW()),

('university', 'Research Paper Collaboration Tool', 'Platform for students and faculty to collaborate on research papers with version control, citation management, and LaTeX support.', 'intermediate', ARRAY['React', 'Firebase', 'LaTeX', 'Git'], ARRAY['Full-Stack Development', 'Version Control', 'Document Processing'], 3, NOW() + INTERVAL '55 days', 'Hashemite University', 'open', NOW()),

('university', 'Exam Proctoring AI', 'AI-powered online exam proctoring system with behavior analysis, screen monitoring, and automated flagging of suspicious activity.', 'advanced', ARRAY['Python', 'TensorFlow', 'WebRTC', 'React', 'Redis'], ARRAY['Computer Vision', 'Real-time Processing', 'Security'], 5, NOW() + INTERVAL '100 days', 'Hashemite University', 'locked', NOW()),

('university', 'Career Services Portal', 'Connect students with internship and job opportunities, resume building tools, and interview preparation resources.', 'intermediate', ARRAY['Next.js', 'Supabase', 'TypeScript', 'Tailwind'], ARRAY['Full-Stack Development', 'Authentication', 'Database Design'], 4, NOW() + INTERVAL '45 days', 'Hashemite University', 'open', NOW()),

('university', 'Mental Health Support Chatbot', 'AI chatbot providing mental health resources, stress management tips, and connecting students with counseling services.', 'intermediate', ARRAY['Python', 'Rasa', 'React', 'PostgreSQL'], ARRAY['NLP', 'Chatbot Development', 'Frontend Development'], 3, NOW() + INTERVAL '60 days', 'Hashemite University', 'open', NOW()),

('university', 'Campus Transportation Tracker', 'Real-time bus tracking system for campus shuttles with route optimization and estimated arrival times.', 'beginner', ARRAY['React Native', 'Node.js', 'Google Maps API', 'Socket.io'], ARRAY['Mobile Development', 'Real-time Systems', 'APIs'], 3, NOW() + INTERVAL '30 days', 'Hashemite University', 'open', NOW()),

('university', 'Peer Tutoring Marketplace', 'Platform connecting students who need help with those offering tutoring services, with scheduling and payment features.', 'beginner', ARRAY['React', 'Express', 'MongoDB', 'Stripe'], ARRAY['Web Development', 'Payment Processing', 'Database Design'], 4, NOW() + INTERVAL '40 days', 'Hashemite University', 'open', NOW());

-- Note: Projects with status='locked' are visible but require certain criteria to join
-- Projects with status='open' are available for immediate joining
