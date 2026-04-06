import { MajorPrefetcher, Major } from "./src/majorPrefetcher";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const mp = new MajorPrefetcher({
  ...(process.env.GITHUB_TOKEN      && { github:      process.env.GITHUB_TOKEN }),
  ...(process.env.KAGGLE_CREDENTIALS && { kaggle:      process.env.KAGGLE_CREDENTIALS }),
  ...(process.env.HF_TOKEN          && { huggingface: process.env.HF_TOKEN }),
});

  // Test a single major first
  console.log("Testing AI major...");
  const results = await mp.prefetch(Major.AI);
  const summary = mp.summarize(results);

  console.log("Total:", summary.total);
  console.log("By source:", summary.bySource);
  console.log("Sample result:", results[0]);
}

test().catch(console.error);