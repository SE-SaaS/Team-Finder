import "dotenv/config";
import * as fs from "fs";
import { MajorPrefetcher, Major } from "./majorPrefetcher";

function loadApiKeys(): Record<string, string> {
  return Object.fromEntries(
    Object.entries({
      github:      process.env.GITHUB_TOKEN,
      kaggle:      process.env.KAGGLE_CREDENTIALS,
      huggingface: process.env.HF_TOKEN,
      gitlab:      process.env.GITLAB_TOKEN,
      hackthebox:  process.env.HTB_TOKEN,
      openhub:     process.env.OPENHUB_API_KEY,
    }).filter(([, v]) => Boolean(v)) as [string, string][]
  );
}

function printUsage() {
  console.log(`
Usage:
  ts-node src/main.ts --major <MAJOR> [--limit <N>] [--output <file.json>]
  ts-node src/main.ts --all            [--limit <N>] [--output <file.json>]

Majors: ${Object.values(Major).join(", ")}
`);
}

async function main() {
  const args    = process.argv.slice(2);
  const getArg  = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined; };
  const hasFlag = (flag: string) => args.includes(flag);

  if (!hasFlag("--major") && !hasFlag("--all")) { printUsage(); process.exit(1); }

  const limit   = parseInt(getArg("--limit") ?? "10", 10);
  const output  = getArg("--output");
  const apiKeys = loadApiKeys();
  const mp      = new MajorPrefetcher(apiKeys, limit);

  if (hasFlag("--all")) {
    const all = await mp.prefetchAll();
    for (const [major, results] of Object.entries(all)) {
      const s = mp.summarize(results);
      console.log(`\n${"=".repeat(50)}`);
      console.log(`  ${major}  |  total: ${s.total}`);
      console.log(`  by source:   ${JSON.stringify(s.bySource)}`);
      console.log(`  by category: ${JSON.stringify(s.byCategory)}`);
    }
    if (output) {
      fs.writeFileSync(output, JSON.stringify(
        Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v])), null, 2
      ));
      console.log(`\n✓ Saved to ${output}`);
    }
  } else {
    const majorArg = getArg("--major")?.toUpperCase() as Major;
    if (!Object.values(Major).includes(majorArg)) {
      console.error(`Unknown major: ${majorArg}`);
      printUsage();
      process.exit(1);
    }
    const results = await mp.prefetch(majorArg);
    const s       = mp.summarize(results);
    console.log(`\nMajor: ${majorArg}`);
    console.log(`Total:       ${s.total}`);
    console.log(`By source:   ${JSON.stringify(s.bySource)}`);
    console.log(`By category: ${JSON.stringify(s.byCategory)}`);
    console.log(`Languages:   ${JSON.stringify(s.languages)}`);
    if (output) {
      fs.writeFileSync(output, JSON.stringify(results, null, 2));
      console.log(`\n✓ Saved to ${output}`);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
