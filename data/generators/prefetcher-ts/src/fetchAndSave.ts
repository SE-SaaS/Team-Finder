import "dotenv/config";
import { MajorPrefetcher, Major } from "./majorPrefetcher";
import { saveProjectsToSupabase, saveAllResourcesToSupabase } from "./saveToSupabase";

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

async function main() {
  const args = process.argv.slice(2);
  const includeAll = args.includes("--all-categories");
  const limit = parseInt(args.find((a) => a.startsWith("--limit="))?.split("=")[1] || "10", 10);

  console.log("🚀 Starting prefetch and save to Supabase...\n");
  console.log(`   Limit per source: ${limit}`);
  console.log(`   Include all categories: ${includeAll ? "Yes (projects, datasets, resources)" : "No (projects only)"}\n`);

  const apiKeys = loadApiKeys();
  const mp = new MajorPrefetcher(apiKeys, limit);

  // Fetch all projects
  console.log("📥 Fetching projects from all sources...\n");
  const allResults = await mp.prefetchAll();

  // Flatten results
  const flatResults = Object.values(allResults).flat();

  console.log(`\n📊 Total fetched: ${flatResults.length} items`);
  console.log(`   Projects: ${flatResults.filter((r) => r.category === "project").length}`);
  console.log(`   Datasets: ${flatResults.filter((r) => r.category === "dataset").length}`);
  console.log(`   Resources: ${flatResults.filter((r) => r.category === "resource").length}`);

  // Save to Supabase
  console.log("\n💾 Saving to Supabase...");

  const stats = includeAll
    ? await saveAllResourcesToSupabase(flatResults)
    : await saveProjectsToSupabase(flatResults);

  console.log("\n✅ Done!");
  console.log(`   Total inserted: ${stats.inserted}`);
  console.log(`   Total skipped: ${stats.skipped}`);
  console.log(`   Total errors: ${stats.errors}`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
