# prefetcher-ts

Async TypeScript prefetcher — fetches learning resources, projects & datasets for AI / CS / CIS / BI / CYS / DS / SWE majors.

## Setup

```bash
npm install
cp .env.example .env   # fill in your API keys
```

## Run (dev)

```bash
# Single major
npx ts-node src/main.ts --major AI --limit 10

# All majors, save JSON
npx ts-node src/main.ts --all --output results.json
```

## Build & run (prod)

```bash
npm run build
node dist/main.js --major DS
```

## Import into your AI wrapper

```ts
import { MajorPrefetcher, Major } from "./prefetcher-ts/src/majorPrefetcher";

const mp      = new MajorPrefetcher({ github: process.env.GITHUB_TOKEN });
const results = await mp.prefetch(Major.AI);
// → PrefetchResult[] → feed into your AI context
```

## Source map

| Major | Sources |
|-------|---------|
| AI    | GitHub, Kaggle, HuggingFace, AI Generator |
| CS    | GitHub, LeetCode (GraphQL), HackerRank |
| CIS   | GitHub, Kaggle, SAP |
| BI    | GitHub, Kaggle, Tableau Public, Power BI |
| CYS   | GitHub, HackTheBox, VulnHub, CTFtime |
| DS    | GitHub, Kaggle, HuggingFace, Papers With Code, UCI |
| SWE   | GitHub, GitLab, OpenHub |

## Strategy per source

- **API** → GitHub, Kaggle, HuggingFace, HackerRank, HTB, CTFtime, PwC, UCI, GitLab, OpenHub, SAP  
- **GraphQL** → LeetCode  
- **Scraping** (cheerio) → VulnHub, Tableau Public, Power BI  
- **Internal seed** → AIGenerator  
