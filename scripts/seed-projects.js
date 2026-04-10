// Seed university projects into Supabase
// Run with: node scripts/seed-projects.js

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '../frontend/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('   Add SUPABASE_SERVICE_ROLE_KEY to .env.local to bypass RLS')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const universityProjects = [
  // JU Projects
  {
    type: 'university',
    title: 'AI-Powered Study Planner',
    description: 'Build an intelligent study planning app that uses machine learning to optimize student schedules based on course difficulty, deadlines, and personal learning patterns.',
    difficulty: 'advanced',
    tech_stack: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
    skills_needed: ['Machine Learning', 'Data Science', 'Full-Stack Development'],
    team_size: 4,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'University of Jordan',
    status: 'locked',
  },
  {
    type: 'university',
    title: 'Campus Navigation AR App',
    description: 'Develop an augmented reality mobile app that helps students navigate the JU campus using their phone camera with real-time directions and building information.',
    difficulty: 'intermediate',
    tech_stack: ['React Native', 'ARKit', 'Node.js', 'MongoDB'],
    skills_needed: ['Mobile Development', 'AR/VR', 'Backend Development'],
    team_size: 3,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'University of Jordan',
    status: 'open',
  },
  {
    type: 'university',
    title: 'Blockchain-Based Grade Verification',
    description: 'Create a blockchain system for secure, tamper-proof storage and verification of academic transcripts and certificates.',
    difficulty: 'advanced',
    tech_stack: ['Solidity', 'Ethereum', 'Web3.js', 'Next.js'],
    skills_needed: ['Blockchain', 'Smart Contracts', 'Cryptography'],
    team_size: 3,
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'University of Jordan',
    status: 'locked',
  },
  {
    type: 'university',
    title: 'Virtual Lab Simulation Platform',
    description: 'Design an interactive web platform for conducting chemistry and physics experiments virtually with real-time calculations and 3D visualizations.',
    difficulty: 'intermediate',
    tech_stack: ['Three.js', 'React', 'WebGL', 'Firebase'],
    skills_needed: ['3D Graphics', 'Physics Simulation', 'Frontend Development'],
    team_size: 4,
    deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'University of Jordan',
    status: 'open',
  },
  {
    type: 'university',
    title: 'Student Collaboration Hub',
    description: 'Build a real-time collaboration platform where students can share notes, create study groups, and work on projects together with integrated video calls.',
    difficulty: 'beginner',
    tech_stack: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
    skills_needed: ['Web Development', 'Real-time Systems', 'Database Design'],
    team_size: 3,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'University of Jordan',
    status: 'open',
  },
  {
    type: 'university',
    title: 'Campus Energy Monitor',
    description: 'IoT-based system to monitor and optimize energy consumption across campus buildings with real-time dashboards and predictive analytics.',
    difficulty: 'advanced',
    tech_stack: ['Python', 'IoT', 'React', 'InfluxDB', 'MQTT'],
    skills_needed: ['IoT Development', 'Data Analytics', 'System Architecture'],
    team_size: 5,
    deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'University of Jordan',
    status: 'locked',
  },
  {
    type: 'university',
    title: 'Course Registration Optimizer',
    description: 'Intelligent system that suggests optimal course combinations based on prerequisites, schedule conflicts, and graduation requirements.',
    difficulty: 'intermediate',
    tech_stack: ['Python', 'Django', 'React', 'PostgreSQL'],
    skills_needed: ['Algorithm Design', 'Full-Stack Development', 'Database Optimization'],
    team_size: 3,
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'University of Jordan',
    status: 'open',
  },
  {
    type: 'university',
    title: 'Library Book Recommendation System',
    description: 'ML-powered recommendation engine for the university library that suggests books based on major, reading history, and trending topics.',
    difficulty: 'intermediate',
    tech_stack: ['Python', 'scikit-learn', 'FastAPI', 'Vue.js'],
    skills_needed: ['Machine Learning', 'REST APIs', 'Frontend Development'],
    team_size: 3,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'University of Jordan',
    status: 'open',
  },

  // HU Projects
  {
    type: 'university',
    title: 'Smart Attendance System',
    description: 'Face recognition-based attendance system with anti-spoofing features and automated reporting for professors.',
    difficulty: 'advanced',
    tech_stack: ['Python', 'OpenCV', 'TensorFlow', 'Flask', 'MySQL'],
    skills_needed: ['Computer Vision', 'Deep Learning', 'Backend Development'],
    team_size: 4,
    deadline: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'Hashemite University',
    status: 'locked',
  },
  {
    type: 'university',
    title: 'Campus Event Management Platform',
    description: 'Comprehensive platform for creating, managing, and discovering campus events with ticketing, notifications, and analytics.',
    difficulty: 'beginner',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
    skills_needed: ['Web Development', 'Payment Integration', 'UX Design'],
    team_size: 4,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'Hashemite University',
    status: 'open',
  },
  {
    type: 'university',
    title: 'Research Paper Collaboration Tool',
    description: 'Platform for students and faculty to collaborate on research papers with version control, citation management, and LaTeX support.',
    difficulty: 'intermediate',
    tech_stack: ['React', 'Firebase', 'LaTeX', 'Git'],
    skills_needed: ['Full-Stack Development', 'Version Control', 'Document Processing'],
    team_size: 3,
    deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'Hashemite University',
    status: 'open',
  },
  {
    type: 'university',
    title: 'Exam Proctoring AI',
    description: 'AI-powered online exam proctoring system with behavior analysis, screen monitoring, and automated flagging of suspicious activity.',
    difficulty: 'advanced',
    tech_stack: ['Python', 'TensorFlow', 'WebRTC', 'React', 'Redis'],
    skills_needed: ['Computer Vision', 'Real-time Processing', 'Security'],
    team_size: 5,
    deadline: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'Hashemite University',
    status: 'locked',
  },
  {
    type: 'university',
    title: 'Career Services Portal',
    description: 'Connect students with internship and job opportunities, resume building tools, and interview preparation resources.',
    difficulty: 'intermediate',
    tech_stack: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind'],
    skills_needed: ['Full-Stack Development', 'Authentication', 'Database Design'],
    team_size: 4,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'Hashemite University',
    status: 'open',
  },
  {
    type: 'university',
    title: 'Mental Health Support Chatbot',
    description: 'AI chatbot providing mental health resources, stress management tips, and connecting students with counseling services.',
    difficulty: 'intermediate',
    tech_stack: ['Python', 'Rasa', 'React', 'PostgreSQL'],
    skills_needed: ['NLP', 'Chatbot Development', 'Frontend Development'],
    team_size: 3,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'Hashemite University',
    status: 'open',
  },
  {
    type: 'university',
    title: 'Campus Transportation Tracker',
    description: 'Real-time bus tracking system for campus shuttles with route optimization and estimated arrival times.',
    difficulty: 'beginner',
    tech_stack: ['React Native', 'Node.js', 'Google Maps API', 'Socket.io'],
    skills_needed: ['Mobile Development', 'Real-time Systems', 'APIs'],
    team_size: 3,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'Hashemite University',
    status: 'open',
  },
  {
    type: 'university',
    title: 'Peer Tutoring Marketplace',
    description: 'Platform connecting students who need help with those offering tutoring services, with scheduling and payment features.',
    difficulty: 'beginner',
    tech_stack: ['React', 'Express', 'MongoDB', 'Stripe'],
    skills_needed: ['Web Development', 'Payment Processing', 'Database Design'],
    team_size: 4,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    university: 'Hashemite University',
    status: 'open',
  },
]

async function seedProjects() {
  console.log('🌱 Starting to seed university projects...\n')

  // Clear existing seeded projects (optional - comment out if you want to keep existing)
  // const { error: deleteError } = await supabase
  //   .from('projects')
  //   .delete()
  //   .eq('type', 'university')
  // if (deleteError) console.error('⚠️  Error clearing old projects:', deleteError.message)

  let successCount = 0
  let errorCount = 0

  for (const project of universityProjects) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()

    if (error) {
      console.error(`❌ Failed to insert "${project.title}":`, error.message)
      errorCount++
    } else {
      console.log(`✅ Inserted: ${project.title} (${project.university} - ${project.status})`)
      successCount++
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)
  console.log(`   🔒 Locked projects: ${universityProjects.filter(p => p.status === 'locked').length}`)
  console.log(`   🔓 Open projects: ${universityProjects.filter(p => p.status === 'open').length}`)
}

seedProjects()
  .then(() => {
    console.log('\n✨ Seeding complete!')
    process.exit(0)
  })
  .catch(err => {
    console.error('\n💥 Seeding failed:', err)
    process.exit(1)
  })
