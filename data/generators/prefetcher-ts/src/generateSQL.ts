import "dotenv/config";
import * as fs from "fs";
import { MajorPrefetcher } from "./majorPrefetcher";
import { PrefetchResult } from "./core/types";
import { calcProjectSkillMeta } from "./skills/skillMatcher";

function loadApiKeys(): Record<string, string> {
  return Object.fromEntries(
    Object.entries({
      github: process.env.GITHUB_TOKEN,
      kaggle: process.env.KAGGLE_CREDENTIALS,
      huggingface: process.env.HF_TOKEN,
      gitlab: process.env.GITLAB_TOKEN,
      hackthebox: process.env.HTB_TOKEN,
      openhub: process.env.OPENHUB_API_KEY,
      sap: process.env.SAP_API_KEY,
      hackerrank: process.env.HACKERRANK_API_KEY,
      leetcode: process.env.LEETCODE_SESSION,
    }).filter(([, v]) => Boolean(v)) as [string, string][]
  );
}

function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

function determineDifficulty(result: PrefetchResult): string {
  if (result.stars !== undefined) {
    if (result.stars < 100) return "beginner";
    if (result.stars < 1000) return "intermediate";
    return "advanced";
  }
  if (result.category === "resource") return "beginner";
  return "intermediate";
}

function generateInsertStatement(result: PrefetchResult, index: number): string {
  const skillMeta = calcProjectSkillMeta(result);

  const title = escapeSqlString(result.title.substring(0, 255));
  const description = escapeSqlString((result.description || "No description available").substring(0, 1000));
  const difficulty = determineDifficulty(result);

  // Handle empty arrays with explicit type casting
  const techStackItems = result.tags.slice(0, 20).map((t) => `'${escapeSqlString(t)}'`);
  const techStack = techStackItems.length > 0 ? `ARRAY[${techStackItems.join(", ")}]` : `ARRAY[]::TEXT[]`;

  const skillsNeededItems = skillMeta.matchedSkills.slice(0, 15).map((s) => `'${escapeSqlString(s)}'`);
  const skillsNeeded = skillsNeededItems.length > 0 ? `ARRAY[${skillsNeededItems.join(", ")}]` : `ARRAY[]::TEXT[]`;

  const source = escapeSqlString(result.source);
  const url = escapeSqlString(result.url);
  const specialization = escapeSqlString(result.major);

  const prefix = index === 0 ? "INSERT INTO projects (\n  type, title, description, difficulty, tech_stack, skills_needed, source, external_url, specialization, status\n) VALUES" : "";

  return `${prefix ? prefix + "\n" : ""}  ('external', '${title}', '${description}', '${difficulty}', ${techStack}, ${skillsNeeded}, '${source}', '${url}', '${specialization}', 'open')`;
}

async function main() {
  console.log("🚀 Fetching all projects...\n");

  const apiKeys = loadApiKeys();
  const mp = new MajorPrefetcher(apiKeys, 20); // Limit 20 per source

  const allResults = await mp.prefetchAll();
  const flatResults = Object.values(allResults).flat();

  // Filter to only projects
  const projects = flatResults.filter((r) => r.category === "project");

  console.log(`\n📊 Total projects fetched: ${projects.length}`);
  console.log("\n📝 Generating SQL...");

  const sqlStatements: string[] = [];

  projects.forEach((project, index) => {
    sqlStatements.push(generateInsertStatement(project, index));
  });

  const fullSQL = `-- ================================================
-- External Projects Insertion Script
-- Generated: ${new Date().toISOString()}
-- Total projects: ${projects.length}
-- ================================================

-- Delete existing external projects (optional - uncomment if needed)
-- DELETE FROM projects WHERE type = 'external';

${sqlStatements.join(",\n")}
ON CONFLICT (external_url) DO NOTHING;

-- ================================================
-- End of insertion script
-- ================================================
`;

  const outputPath = "insert_external_projects.sql";
  fs.writeFileSync(outputPath, fullSQL, "utf-8");

  console.log(`\n✅ SQL file generated: ${outputPath}`);
  console.log(`   Total INSERT statements: ${projects.length}`);
  console.log(`\n🔧 To apply: psql -d your_database -f ${outputPath}`);
  console.log(`   Or run it through Supabase SQL Editor`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
