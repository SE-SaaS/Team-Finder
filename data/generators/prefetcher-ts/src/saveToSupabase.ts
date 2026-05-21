import "dotenv/config";
import { supabase } from "./supabaseClient";
import { PrefetchResult } from "./core/types";
import { calcProjectSkillMeta } from "./skills/skillMatcher";
import { scoreProject, bucketDifficulty, normalizeDifficulty, DifficultyLabel } from "./core/scoring";

interface SupabaseProject {
  type:              "external";
  title:             string;
  description:       string;
  difficulty:        DifficultyLabel | null;
  difficulty_score:  number | null;
  popularity_score:  number;
  primary_language:  string | null;
  last_activity_at:  string | null;
  source_metadata:   Record<string, unknown>;
  tech_stack:        string[];
  skills_needed:     string[];
  source:            string;
  external_url:      string;
  specialization:    string;
  status:            "open";
}

// Extract the source's "last activity" timestamp into a unified column.
// Different sources use different field names; we pick the most relevant.
function extractLastActivity(result: PrefetchResult): string | null {
  const extra = result.extra ?? {};
  const candidate =
    extra.pushed_at ??
    extra.last_activity_at ??
    extra.lastModified ??
    extra.last_updated ??
    extra.updated_at ??
    extra.published ??
    null;
  return candidate ? String(candidate) : null;
}

function mapToSupabaseProject(result: PrefetchResult): SupabaseProject {
  const skillMeta = calcProjectSkillMeta(result);
  const scored    = scoreProject(result);
  const label     = normalizeDifficulty(bucketDifficulty(scored.difficulty_score));

  return {
    type:             "external",
    title:            result.title.substring(0, 255),
    description:      result.description || "No description available",
    difficulty:       label,
    difficulty_score: scored.difficulty_score,
    popularity_score: scored.popularity_score,
    primary_language: result.language ?? null,
    last_activity_at: extractLastActivity(result),
    source_metadata:  result.extra ?? {},
    tech_stack:       result.tags.slice(0, 20),
    skills_needed:    skillMeta.matchedSkills.slice(0, 15),
    source:           result.source,
    external_url:     result.url,
    specialization:   result.major,
    status:           "open",
  };
}

async function checkDuplicate(external_url: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("projects")
    .select("id")
    .eq("external_url", external_url)
    .maybeSingle();

  if (error) {
    console.warn(`Duplicate-check query failed for ${external_url}: ${error.message}`);
    return false;
  }
  return data !== null;
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
