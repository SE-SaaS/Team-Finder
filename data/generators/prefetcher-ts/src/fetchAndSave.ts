import "dotenv/config";
import { MajorPrefetcher } from "./majorPrefetcher";
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
  const projectsOnly = args.includes("--projects-only");
  const limit = parseInt(args.find((a) => a.startsWith("--limit="))?.split("=")[1] || "10", 10);

  console.log("Starting prefetch and save to Supabase...\n");
  console.log(`   Limit per source: ${limit}`);
  console.log(`   Mode: ${projectsOnly ? "projects only" : "all categories (projects, datasets, resources)"}\n`);

  const apiKeys = loadApiKeys();
  const mp = new MajorPrefetcher(apiKeys, limit);

  console.log("Fetching from all sources...\n");
  const allResults = await mp.prefetchAll();

  const flatResults = Object.values(allResults).flat();

  const projects = flatResults.filter((r) => r.category === "project").length;
  const datasets = flatResults.filter((r) => r.category === "dataset").length;
  const resources = flatResults.filter((r) => r.category === "resource").length;

  console.log(`\nTotal fetched: ${flatResults.length} items`);
  console.log(`   Projects:  ${projects}`);
  console.log(`   Datasets:  ${datasets}`);
  console.log(`   Resources: ${resources}`);

  const willInsert = projectsOnly ? projects : flatResults.length;
  console.log(`\nWill attempt to insert: ${willInsert} items`);
  if (willInsert === 0) {
    console.warn("Nothing to insert. Check API keys and source connectivity.");
    return;
  }

  console.log("\nSaving to Supabase...");

  const stats = projectsOnly
    ? await saveProjectsToSupabase(flatResults)
    : await saveAllResourcesToSupabase(flatResults);

  console.log("\nDone.");
  console.log(`   Inserted: ${stats.inserted}`);
  console.log(`   Skipped:  ${stats.skipped}`);
  console.log(`   Errors:   ${stats.errors}`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
