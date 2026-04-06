import { supabase } from "./supabaseClient";

export interface ProjectRecord {
  title: string;
  description: string;
  url: string;
  source: string;         // "github" | "kaggle" | "huggingface" | etc.
  major: string;          // "AI" | "CS" | "CIS" | "BIT" | "CYS" | "DS" | "SWE"
  min_year: number;       // 1 | 2 | 3 | 4
  skills_needed: string[];
  tags: string[];
  stars?: number;
  fetched_at: string;     // ISO timestamp
}

/**
 * Upserts a batch of projects into Supabase.
 * Uses `url` as the unique conflict key — safe to re-run.
 */
export async function insertProjects(projects: ProjectRecord[]): Promise<void> {
  if (projects.length === 0) return;

  const { error } = await supabase
    .from("projects")
    .upsert(projects, { onConflict: "url" });

  if (error) {
    console.error("❌ Supabase insert error:", error.message);
    throw error;
  }

  console.log(`✅ Upserted ${projects.length} projects`);
}

/**
 * Convenience wrapper — inserts one page at a time (Supabase limit: 1000 rows).
 */
export async function insertProjectsBatched(
  projects: ProjectRecord[],
  batchSize = 500
): Promise<void> {
  for (let i = 0; i < projects.length; i += batchSize) {
    const batch = projects.slice(i, i + batchSize);
    await insertProjects(batch);
    console.log(`  → batch ${Math.floor(i / batchSize) + 1} done`);
  }
}
