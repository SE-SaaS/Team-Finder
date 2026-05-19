import { PrefetchResult } from "../core/types";
import { SKILL_TAXONOMY } from "./taxonomy";

export interface ProjectSkillMeta {
  matchedSkills: string[];
}

// Maps common tag variants to canonical taxonomy keys.
const ALIASES: Record<string, string> = {
  "reactjs":                    "react",
  "node":                       "nodejs",
  "ts":                         "typescript",
  "js":                         "javascript",
  "es6":                        "javascript",
  "postgres":                   "postgresql",
  "psql":                       "postgresql",
  "mongo":                      "mongodb",
  "sk-learn":                   "scikit-learn",
  "sklearn":                    "scikit-learn",
  "hf":                         "huggingface",
  "tf":                         "tensorflow",
  "k8s":                        "kubernetes",
  "kube":                       "kubernetes",
  "gh-actions":                 "ci-cd",
  "github-actions":             "ci-cd",
  "jenkins":                    "ci-cd",
  "gitlab-ci":                  "ci-cd",
  "s4hana":                     "sap-s4hana",
  "fiori":                      "sap-fiori",
  "powerbi":                    "power-bi",
  "pbi":                        "power-bi",
  "ml":                         "machine-learning",
  "deep-learning":              "machine-learning",
  "dl":                         "machine-learning",
  "reinforcement-learning":     "machine-learning",
  "rl":                         "machine-learning",
  "cv":                         "computer-vision",
  "vision":                     "computer-vision",
  "face-recognition":           "computer-vision",
  "face-detection":             "computer-vision",
  "object-detection":           "computer-vision",
  "image-classification":       "computer-vision",
  "image-segmentation":         "computer-vision",
  "nlu":                        "nlp",
  "natural-language-processing":"nlp",
  "natural-language":           "nlp",
  "text-classification":        "nlp",
  "language-model":             "llm",
  "language-models":            "llm",
  "llms":                       "llm",
  "large-language-model":       "llm",
  "large-language-models":      "llm",
  "neural-networks":            "neural-network",
  "neural-net":                 "neural-network",
  "neural-nets":                "neural-network",
  "deep-neural-network":        "neural-network",
  "deep-neural-networks":       "neural-network",
  "transformers":               "transformer",
  "vuejs":                      "vue",
  "next":                       "nextjs",
  "netsec":                     "networking",
  "infosec":                    "networking",
  "network-protocols":          "networking",
  "appsec":                     "application-security",
  "pentest":                    "penetration-testing",
  "pen-test":                   "penetration-testing",
  "rev-eng":                    "reverse-engineering",
  "malware":                    "malware-analysis",
  "websec":                     "web-security",
  "webapp-security":            "web-security",
  "webappsec":                  "web-security",
  "ethicalhacking":             "ethical-hacking",
  "dp":                         "dynamic-programming",
  "dsa":                        "data-structures",
  "algorithm":                  "algorithms",
  "datastructures":             "data-structures",
  "cplusplus":                  "cpp",
  "c-plus-plus":                "cpp",
  "c-sharp":                    "csharp",
  "dot-net":                    "dotnet",
  "dot.net":                    "dotnet",
  "reactnative":                "react-native",
  "springboot":                 "spring-boot",
  "spring":                     "spring-boot",
  "scss":                       "sass",
  "tailwindcss":                "tailwind",
  "restful":                    "rest-api",
  "rest":                       "rest-api",
  "api":                        "rest-api",
  "tflite":                     "tensorflow",
  "torch":                      "pytorch",
  "container":                  "containerization",
  "containers":                 "containerization",
  "docker-compose":             "docker",
  "iac":                        "terraform",
  "infrastructure-as-code":     "terraform",
  "unittest":                   "unit-testing",
  "unit-tests":                 "unit-testing",
  "debug":                      "debugging",
  "data-science":               "data-analysis",
  "data-viz":                   "data-analysis",
  "datavisualization":          "data-analysis",
  "data-visualization":         "data-analysis",
};

// Replace tokens containing special characters before tokenization, since
// the split/normalize pipeline strips characters like + # and .
function preNormalize(text: string): string {
  return text
    .replace(/c\+\+/gi,  " cpp ")
    .replace(/c#/gi,     " csharp ")
    .replace(/\.net\b/gi, " dotnet ");
}

function normalize(token: string): string {
  return token.toLowerCase().replace(/[\s_./]/g, "-").replace(/[^a-z0-9-]/g, "");
}

function extractTokens(result: PrefetchResult): string[] {
  const joined = [
    ...(result.tags ?? []),
    result.title,
    result.description ?? "",
    result.language ?? "",
  ].join(" ");
  return preNormalize(joined)
    .split(/[\s,|/+]+/)
    .map(normalize)
    .filter(Boolean);
}

function resolveSkill(token: string): string | null {
  const aliased = ALIASES[token] ?? token;
  return aliased in SKILL_TAXONOMY ? aliased : null;
}

export function calcProjectSkillMeta(result: PrefetchResult): ProjectSkillMeta {
  const tokens = extractTokens(result);
  const seen   = new Set<string>();

  for (const token of tokens) {
    const resolved = resolveSkill(token);
    if (!resolved) continue;
    const displayName = SKILL_TAXONOMY[resolved];
    if (displayName) seen.add(displayName);
  }

  return { matchedSkills: [...seen] };
}

export function enrichResults(
  results: PrefetchResult[]
): (PrefetchResult & { skillMeta: ProjectSkillMeta })[] {
  return results.map(r => ({ ...r, skillMeta: calcProjectSkillMeta(r) }));
}
