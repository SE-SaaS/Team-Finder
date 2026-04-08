import { supabase } from './supabase';
import { ProfileData } from '@/types/profile';

// Save or update user profile via secure API route
export async function saveProfile(_userId: string, data: Partial<ProfileData>) {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Include cookies for authentication
    body: JSON.stringify({
      major: data.major,
      specialization: data.specialization,
      year: data.year,
      semester: data.semester, // FIXED: Added semester
      availability: data.availability,
      bio: data.bio,
      avatar: data.avatar,
      avatarColor: data.avatarColor, // FIXED: Changed from avatarColor to match API
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save profile');
  }
}

// Get own profile (authenticated user viewing their own data)
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, university, major, specialization, year, availability, bio, avatar, avatar_color, updated_at')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Get a public profile (browsing another student) — never exposes email or internal fields
export async function getPublicProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('university, major, specialization, year, availability, bio, avatar, avatar_color')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Save user's selected skills (with race condition fix)
export async function saveUserSkills(userId: string, skillNames: string[]) {
  // First, delete existing skills
  const { error: deleteError } = await supabase
    .from('user_skills')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  if (skillNames.length === 0) return;

  // Then insert new skills
  const skillsData = skillNames.map(skillName => ({
    user_id: userId,
    skill_name: skillName, // Fixed: was skill_id, should be skill_name
  }));

  const { error: insertError } = await supabase
    .from('user_skills')
    .insert(skillsData);

  if (insertError) throw insertError;
}

// Save skill ratings/proficiencies
export async function saveSkillRatings(
  userId: string,
  ratings: Record<string, { level: string; rating: number; verified: boolean }>
) {
  // Delete existing proficiencies
  await supabase
    .from('skill_proficiencies')
    .delete()
    .eq('user_id', userId);

  // Get skill IDs from skill names
  const skillNames = Object.keys(ratings);
  const { data: skills } = await supabase
    .from('skills')
    .select('id, name')
    .in('name', skillNames);

  if (!skills) return;

  // Insert new proficiencies
  const proficiencies = skills.map(skill => ({
    user_id: userId,
    skill_id: skill.id,
    level: ratings[skill.name].level,
    rating: ratings[skill.name].rating,
    verified: ratings[skill.name].verified,
  }));

  const { error } = await supabase
    .from('skill_proficiencies')
    .insert(proficiencies);

  if (error) throw error;
}

// Save user's completed courses
export async function saveUserCourses(userId: string, courseIds: string[]) {
  // Delete existing courses
  const { error: deleteError } = await supabase
    .from('user_courses')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  if (courseIds.length === 0) return;

  // FIXED: Fetch course details from courses table to get code and name
  const { data: courses, error: fetchError } = await supabase
    .from('courses')
    .select('id, code, name')
    .in('id', courseIds);

  if (fetchError) throw fetchError;

  if (!courses || courses.length === 0) return;

  // Insert new courses using course_code and course_name (matching schema)
  const coursesData = courses.map(course => ({
    user_id: userId,
    course_code: course.code,
    course_name: course.name,
    status: 'completed' as const,
  }));

  const { error: insertError } = await supabase
    .from('user_courses')
    .insert(coursesData);

  if (insertError) throw insertError;
}

// Save exam result
export async function saveExamResult(
  userId: string,
  skillId: number,
  originalDifficulty: string,
  adjustedDifficulty: string,
  score: number,
  retakeAllowedAt?: Date
) {
  const { error } = await supabase
    .from('assessment_results')
    .insert({
      user_id: userId,
      skill_id: skillId,
      original_difficulty: originalDifficulty,
      adjusted_difficulty: adjustedDifficulty,
      score,
      retake_allowed_at: retakeAllowedAt?.toISOString(),
    });

  if (error) throw error;
}

// Get exam results for a user
export async function getExamResults(userId: string) {
  const { data, error } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Check if user can retake exam
export async function canRetakeExam(userId: string, skillId: number): Promise<boolean> {
  const { data } = await supabase
    .from('assessment_results')
    .select('retake_allowed_at')
    .eq('user_id', userId)
    .eq('skill_id', skillId)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single();

  if (!data || !data.retake_allowed_at) return true;

  return new Date(data.retake_allowed_at) <= new Date();
}

// Get all skills
export async function getAllSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

// Get all courses
export async function getAllCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('year, name');

  if (error) throw error;
  return data;
}
