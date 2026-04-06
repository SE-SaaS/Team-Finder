import "dotenv/config";
import { supabase } from "./supabaseClient";
import { PrefetchResult } from "./core/types";
import { calcProjectSkillMeta } from "./skills/skillMatcher";

type Difficulty = "beginner" | "intermediate" | "advanced";

interface SupabaseProject {
  type: "external";
  title: string;
  description: string;
  difficulty: Difficulty;
  tech_stack: string[];
  skills_needed: string[];
  source: string;
  external_url: string;
  specialization: string;
  status: "open";
}

function determineDifficulty(result: PrefetchResult): Difficulty {
  // Use stars if available (GitHub projects)
  if (result.stars !== undefined) {
    if (result.stars < 100) return "beginner";
    if (result.stars < 1000) return "intermediate";
    return "advanced";
  }

  // Default based on category
  if (result.category === "resource") return "beginner";
  return "intermediate";
}

function mapToSupabaseProject(result: PrefetchResult): SupabaseProject {
  // Calculate skills from tags
  const skillMeta = calcProjectSkillMeta(result);

  return {
    type: "external",
    title: result.title.substring(0, 255), // Ensure reasonable length
    description: result.description || "No description available",
    difficulty: determineDifficulty(result),
    tech_stack: result.tags.slice(0, 20), // Limit to 20 tags
    skills_needed: skillMeta.matchedSkills.slice(0, 15), // Limit to 15 skills
    source: result.source,
    external_url: result.url,
    specialization: result.major,
    status: "open",
  };
}

async function checkDuplicate(external_url: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("projects")
    .select("id")
    .eq("external_url", external_url)
    .single();

  return !!data && !error;
}

export async function saveProjectsToSupabase(
  results: PrefetchResult[],
  options: { skipDuplicates?: boolean; onlyProjects?: boolean } = {}
): Promise<{ inserted: number; skipped: number; errors: number }> {
  const { skipDuplicates = true, onlyProjects = true } = options;

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  // Filter to only projects if requested
  const toInsert = onlyProjects
    ? results.filter((r) => r.category === "project")
    : results;

  console.log(`\nProcessing ${toInsert.length} projects for insertion...`);

  for (const result of toInsert) {
    try {
      // Skip if duplicate check enabled
      if (skipDuplicates && (await checkDuplicate(result.url))) {
        skipped++;
        continue;
      }

      const project = mapToSupabaseProject(result);

      const { error } = await supabase.from("projects").insert(project);

      if (error) {
        console.error(`Error inserting "${result.title}":`, error.message);
        errors++;
      } else {
        inserted++;
        if (inserted % 10 === 0) {
          console.log(`  Inserted ${inserted} projects...`);
        }
      }
    } catch (err) {
      console.error(`Exception inserting "${result.title}":`, (err as Error).message);
      errors++;
    }
  }

  console.log(`\n✓ Insertion complete:`);
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);

  return { inserted, skipped, errors };
}

export async function saveAllResourcesToSupabase(
  results: PrefetchResult[]
): Promise<{ inserted: number; skipped: number; errors: number }> {
  return saveProjectsToSupabase(results, {
    skipDuplicates: true,
    onlyProjects: false
  });
}
