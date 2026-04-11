'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ALL_SKILLS } from '@/lib/skills';
import { MAJORS } from '@/data/majors';

type Section = 'year' | 'courses' | 'skills' | 'availability' | 'specialization';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('year');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<any>(null);
  const [year, setYear] = useState<string>('');
  const [semester, setSemester] = useState<number>(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [availability, setAvailability] = useState<number>(20);
  const [specialization, setSpecialization] = useState('');

  // Available courses from database
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Load profile data
  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      try {
        // Get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
        setYear(profileData.year || '');
        setSemester(profileData.semester || 1);
        setAvailability(profileData.availability || 20);
        setSpecialization(profileData.specialization || '');

        // Get user skills
        const { data: skillsData } = await supabase
          .from('user_skills')
          .select('skill_name')
          .eq('user_id', user.id);

        setSkills(skillsData?.map(s => s.skill_name) || []);

        // Get completed courses
        const { data: coursesData } = await supabase
          .from('user_courses')
          .select('course_id')
          .eq('user_id', user.id);

        setCourses(coursesData?.map(c => c.course_id) || []);

      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  // Load courses when year changes
  useEffect(() => {
    if (!profile || !year) return;

    async function loadCourses() {
      try {
        const yearNum = parseInt(year.charAt(0));
        const { data: coursesDb } = await supabase
          .from('courses')
          .select('*')
          .eq('university', profile.university === 'University of Jordan' ? 'JU' : 'HU')
          .eq('major', profile.major)
          .lte('year', yearNum) // Load courses up to current year
          .order('year', { ascending: true })
          .order('semester', { ascending: true })
          .limit(1000);

        console.log(`Loaded ${coursesDb?.length || 0} courses for year ${year}`);
        setAvailableCourses(coursesDb || []);
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    }

    loadCourses();
  }, [year, profile]);

  const handleSkillToggle = (skill: string) => {
    setSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleCourseToggle = (courseId: string) => {
    setCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(c => c !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Save year, semester, availability and specialization to profile
      await supabase
        .from('profiles')
        .update({
          year,
          semester,
          availability,
          specialization: specialization || null
        })
        .eq('id', user.id);

      // Save skills
      await supabase.from('user_skills').delete().eq('user_id', user.id);
      if (skills.length > 0) {
        await supabase.from('user_skills').insert(
          skills.map(skill => ({ user_id: user.id, skill_name: skill }))
        );
      }

      // Save courses
      await supabase.from('user_courses').delete().eq('user_id', user.id);
      if (courses.length > 0) {
        await supabase.from('user_courses').insert(
          courses.map(courseId => ({ user_id: user.id, course_id: courseId }))
        );
      }

      alert('Profile updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  const majorInfo = profile?.major ? MAJORS[profile.major] : null;

  return (
    <div className="min-h-screen bg-black">
      {/* Starfield Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars stars-blue"></div>
        <div className="stars stars-red"></div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-white font-medium">Back to Dashboard</span>
            </Link>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
          <p className="text-gray-400">Update your skills, courses, and availability</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 space-y-1 sticky top-24">
              {[
                { id: 'year', label: 'Year & Semester', icon: '📅' },
                { id: 'courses', label: 'Courses', icon: '📚' },
                { id: 'skills', label: 'Skills', icon: '🎯' },
                { id: 'availability', label: 'Availability', icon: '⏰' },
                { id: 'specialization', label: 'Specialization', icon: '🎓' },
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as Section)}
                  className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-[#dc2626] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">

              {/* Year & Semester Section */}
              {activeSection === 'year' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Academic Year & Semester</h2>
                  <p className="text-sm text-gray-400 mb-6">
                    Select your current academic year and semester. This determines which courses are available.
                  </p>

                  {/* Year Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-3">
                      Current Academic Year <span className="text-[#dc2626]">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(['1st', '2nd', '3rd', '4th'] as const).map((yr) => (
                        <button
                          key={yr}
                          onClick={() => setYear(yr)}
                          className={`px-6 py-4 rounded-lg font-semibold transition-all ${
                            year === yr
                              ? 'bg-[#dc2626] text-white shadow-lg'
                              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-[#dc2626] hover:text-white'
                          }`}
                        >
                          {yr} Year
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Semester Selection */}
                  {year && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-3">
                        Current Semester <span className="text-[#dc2626]">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[1, 2].map((sem) => (
                          <button
                            key={sem}
                            onClick={() => setSemester(sem)}
                            className={`px-6 py-4 rounded-lg font-semibold transition-all ${
                              semester === sem
                                ? 'bg-[#dc2626] text-white shadow-lg'
                                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-[#dc2626] hover:text-white'
                            }`}
                          >
                            Semester {sem}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {year && semester && (
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-sm text-blue-200">
                        ℹ️ You're in <strong>{year} Year, Semester {semester}</strong>.
                        Courses up to this point will be available in the Courses section.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Your Skills</h2>
                  <p className="text-sm text-gray-400 mb-6">
                    Select the skills you're proficient in. These will be used to match you with projects.
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-[500px] overflow-y-auto p-4 bg-black border border-gray-800 rounded-lg">
                    {ALL_SKILLS.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                          skills.includes(skill)
                            ? 'bg-[#dc2626] text-white border-2 border-[#b91c1c]'
                            : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-[#dc2626]'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-gray-400">
                    {skills.length} skill{skills.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}

              {/* Courses Section */}
              {activeSection === 'courses' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Completed Courses</h2>
                  <p className="text-sm text-gray-400 mb-6">
                    Mark the courses you've completed. This helps unlock skills and improve matching.
                  </p>
                  {availableCourses.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      No courses available. Make sure your major is set in basic info.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {availableCourses.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => handleCourseToggle(course.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            courses.includes(course.id)
                              ? 'bg-[#dc2626]/20 border-2 border-[#dc2626] text-white'
                              : 'bg-black border border-gray-800 text-gray-400 hover:border-[#dc2626] hover:text-white'
                          }`}
                        >
                          <div className="font-medium">{course.code} - {course.name}</div>
                          {course.unlocks_skills && course.unlocks_skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {course.unlocks_skills.map((skill: string) => (
                                <span
                                  key={skill}
                                  className="text-xs px-2 py-0.5 rounded bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/30"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="mt-4 text-xs text-gray-400">
                    {courses.length} course{courses.length !== 1 ? 's' : ''} completed
                  </p>
                </div>
              )}

              {/* Availability Section */}
              {activeSection === 'availability' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Weekly Availability</h2>
                  <p className="text-sm text-gray-400 mb-6">
                    How many hours per week can you dedicate to projects?
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Hours per week: <span className="text-[#dc2626] font-bold">{availability}</span>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        step="5"
                        value={availability}
                        onChange={(e) => setAvailability(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#dc2626]"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>5 hrs</span>
                        <span>20 hrs</span>
                        <span>40 hrs</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specialization Section */}
              {activeSection === 'specialization' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Specialization</h2>
                  <p className="text-sm text-gray-400 mb-6">
                    Choose your area of focus within your major.
                  </p>
                  {majorInfo ? (
                    <div className="space-y-2">
                      {majorInfo.specializations.map((spec) => (
                        <button
                          key={spec}
                          onClick={() => setSpecialization(spec)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            specialization === spec
                              ? 'bg-[#dc2626] text-white border-2 border-[#b91c1c]'
                              : 'bg-black border border-gray-800 text-gray-400 hover:border-[#dc2626] hover:text-white'
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      Major not set. Please update your basic info first.
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
