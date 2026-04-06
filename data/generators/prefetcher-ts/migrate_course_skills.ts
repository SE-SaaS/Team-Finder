import { supabase } from "./src/supabaseClient";

console.log('\n🔄 Migrating courses to use skill names instead of IDs\n');

async function migrateCourseSkills() {
  // Step 1: Update specific courses with correct skill mappings
  const updates = [
    {
      search: 'Introduction to Programming',
      skills: ['C++'],
      note: 'Y1 - C++ fundamentals'
    },
    {
      search: 'Data Structure',
      skills: ['C++'],
      note: 'Y2 - DS with C++'
    },
    {
      search: 'Object Oriented',
      skills: ['Java'],
      note: 'Y2 - OOP with Java (not Spring Boot)'
    },
    {
      search: 'Applied Statistics',
      skills: ['R'],
      note: 'Statistics with R'
    }
  ];

  for (const update of updates) {
    console.log(`\n📝 ${update.search}`);
    console.log(`   Skills: ${update.skills.join(', ')}`);
    console.log(`   Note: ${update.note}`);

    const { data: courses, error: fetchError } = await supabase
      .from('courses')
      .select('*')
      .ilike('name', `%${update.search}%`);

    if (fetchError) {
      console.log(`   ❌ Error fetching: ${fetchError.message}`);
      continue;
    }

    if (!courses || courses.length === 0) {
      console.log(`   ⚠️  No courses found`);
      continue;
    }

    console.log(`   Found ${courses.length} course(s)`);

    for (const course of courses) {
      const { error: updateError } = await supabase
        .from('courses')
        .update({ unlocks_skills: update.skills })
        .eq('id', course.id);

      if (updateError) {
        console.log(`   ❌ Error updating ${course.code}: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated ${course.code} - ${course.name}`);
      }
    }
  }

  // Step 2: Verify updates
  console.log('\n\n📊 Verification - Courses with skills:\n');
  const { data: updatedCourses } = await supabase
    .from('courses')
    .select('code, name, unlocks_skills, year, semester')
    .not('unlocks_skills', 'is', null)
    .order('year')
    .order('semester')
    .limit(20);

  if (updatedCourses) {
    updatedCourses.forEach(c => {
      console.log(`${c.code} (Y${c.year} S${c.semester}): ${c.unlocks_skills?.join(', ') || 'none'}`);
      console.log(`   ${c.name}\n`);
    });
  }

  console.log('\n✅ Migration complete!\n');
}

migrateCourseSkills();
