import { supabase } from "./src/supabaseClient";

async function checkCourses() {
  // Check a few key courses
  const courses = [
    '1904102', // Introduction to Programming
    '1904222', // Data Structures
    '1904231', // OOP
    '1902211', // Applied Statistics
  ];

  for (const code of courses) {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .ilike('code', `%${code}%`)
      .limit(1)
      .single();

    if (data) {
      console.log(`\n${data.code} - ${data.name}`);
      console.log(`Unlocks: ${data.unlocks_skills || 'none'}`);
    }
  }
}

checkCourses();
