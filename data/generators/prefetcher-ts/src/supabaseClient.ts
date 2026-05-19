import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

const envPaths: string[] = [
  path.join(__dirname, "../.env"),
  path.join(__dirname, "../../../../.env"),
];

for (const p of envPaths) {
  dotenv.config({ path: p });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const missing: string[] = [];
if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)");
if (!supabaseServiceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");

if (missing.length > 0) {
  throw new Error(
    "Prefetcher env validation failed.\n" +
    "  Missing: " + missing.join(", ") + "\n" +
    "  Searched: " + envPaths.join(", ") + "\n" +
    "  Fix: add the missing keys to data/generators/prefetcher-ts/.env or the repo-root .env."
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl as string,
  supabaseServiceKey as string
);
