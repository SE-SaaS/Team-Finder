import { supabase } from './supabase';
import { ProfileData } from '@/types/profile';

// Save or update user profile
export async function saveProfile(userId: string, data: Partial<ProfileData>) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      username: data.email?.split('@')[0] || '', // Generate username from email
      email: data.email,
      name: data.name,
      university: data.university,
      year: data.year,
      availability: data.availability,
      bio: data.bio,
      avatar: data.avatar,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}

// Get user profile
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Save user's selected skills
export async function saveUserSkills(userId: string, skillIds: number[]) {
  // First, delete existing skills
  await supabase
    .from('user_skills')
    .delete()
    .eq('user_id', userId);

  // Then insert new skills
  const skillsData = skillIds.map(skillId => ({
    user_id: userId,
    skill_id: skillId,
  }));

  const { error } = await supabase
    .from('user_skills')
    .insert(skillsData);

  if (error) throw error;
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
export async function saveUserCourses(userId: string, courseIds: number[]) {
  // Delete existing courses
  await supabase
    .from('user_courses')
    .delete()
    .eq('user_id', userId);

  // Insert new courses
  const coursesData = courseIds.map(courseId => ({
    user_id: userId,
    course_id: courseId,
  }));

  const { error } = await supabase
    .from('user_courses')
    .insert(coursesData);

  if (error) throw error;
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
