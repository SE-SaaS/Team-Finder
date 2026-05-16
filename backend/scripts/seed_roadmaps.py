"""
Fetch roadmap.sh JSON and content files from GitHub, seed into Supabase.

For each roadmap slug:
  1. Downloads the node layout JSON
  2. Downloads content markdown files (description + resource links per node)
  3. Inserts into roadmaps, roadmap_nodes, roadmap_node_resources tables

Usage:
    cd backend
    python scripts/seed_roadmaps.py
"""

import os, re, time, sys
import requests
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding="utf-8")

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))

DATABASE_URL = os.getenv("DATABASE_URL")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")

GITHUB_API_BASE = "https://api.github.com/repos/kamranahmedse/developer-roadmap"

# Tuples of (slug, title, parent_slug)
# parent_slug is set when the JSON lives inside another roadmap's folder
ROADMAPS = [
    ("frontend",                      "Frontend Developer",               None),
    ("frontend-beginner",             "Frontend Beginner",                "frontend"),
    ("backend",                       "Backend Developer",                None),
    ("backend-beginner",              "Backend Beginner",                 "backend"),
    ("full-stack",                    "Full Stack Developer",             None),
    ("devops",                        "DevOps Engineer",                  None),
    ("devops-beginner",               "DevOps Beginner",                  "devops"),
    ("devsecops",                     "DevSecOps",                        None),
    ("cyber-security",                "Cyber Security",                   None),
    ("data-analyst",                  "Data Analyst",                     None),
    ("data-engineer",                 "Data Engineer",                    None),
    ("ai-data-scientist",             "AI and Data Scientist",            None),
    ("ai-engineer",                   "AI Engineer",                      None),
    ("ai-agents",                     "AI Agents",                        None),
    ("machine-learning",              "Machine Learning",                 None),
    ("mlops",                         "MLOps",                            None),
    ("computer-science",              "Computer Science",                 None),
    ("datastructures-and-algorithms", "Data Structures and Algorithms",   None),
    ("system-design",                 "System Design",                    None),
    ("software-design-architecture",  "Software Design and Architecture", None),
    ("software-architect",            "Software Architect",               None),
    ("docker",                        "Docker",                           None),
    ("kubernetes",                    "Kubernetes",                       None),
    ("aws",                           "AWS",                              None),
    ("java",                          "Java",                             None),
    ("cpp",                           "C++",                              None),
    ("rust",                          "Rust",                             None),
    ("git-github",                    "Git and GitHub",                   None),
    ("git-github-beginner",           "Git and GitHub Beginner",          "git-github"),
    ("ux-design",                     "UX Design",                        None),
]


def GithubHeaders():
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers


def FetchRoadmapNodes(slug: str, parent_slug: str = None) -> list[dict]:
    """Download roadmap JSON and return topic and subtopic nodes only."""
    folder = parent_slug if parent_slug else slug
    url = f"{GITHUB_API_BASE}/contents/src/data/roadmaps/{folder}/{slug}.json"
    response = requests.get(url, headers=GithubHeaders())
    if response.status_code != 200:
        print(f"  [skip] JSON not found for {slug} (status {response.status_code})")
        return []

    download_url = response.json().get("download_url", "")
    raw = requests.get(download_url, headers=GithubHeaders())
    if raw.status_code != 200:
        print(f"  [skip] Could not download JSON for {slug}")
        return []

    all_nodes = raw.json().get("nodes", [])
    return [n for n in all_nodes if n.get("type") in ("topic", "subtopic")]


def FetchContentIndex(slug: str) -> dict[str, str]:
    """Return a mapping of node_id to download_url for all content markdown files."""
    url = f"{GITHUB_API_BASE}/contents/src/data/roadmaps/{slug}/content"
    response = requests.get(url, headers=GithubHeaders())
    if response.status_code != 200:
        return {}

    index = {}
    for item in response.json():
        filename = item.get("name", "")
        if not filename.endswith(".md"):
            continue
        # Filename pattern: {topic-slug}@{nodeId}.md
        parts = filename.rsplit("@", 1)
        if len(parts) == 2:
            node_id = parts[1].replace(".md", "")
            index[node_id] = item["download_url"]
    return index


def ParseContentFile(text: str) -> tuple[str, list[dict]]:
    """
    Parse a roadmap.sh content markdown file into description and resource list.
    Resource link format: - [@type@Title](url)
    """
    lines = text.strip().splitlines()
    description_lines = []
    resources = []
    in_resources_section = False

    for line in lines:
        line = line.strip()
        if not line:
            continue
        if "Visit the following resources" in line:
            in_resources_section = True
            continue
        if in_resources_section:
            match = re.match(r"-\s+\[@(\w+)@(.+?)\]\((.+?)\)", line)
            if match:
                resources.append({
                    "type":  match.group(1).lower(),
                    "title": match.group(2).strip(),
                    "url":   match.group(3).strip(),
                })
        else:
            if not line.startswith("# "):
                description_lines.append(line)

    description = " ".join(description_lines).strip()
    return description, resources


def SeedRoadmap(conn, slug: str, title: str, parent_slug: str = None):
    print(f"\n[{slug}] {title}")
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO roadmaps (id, title, source)
        VALUES (%s, %s, 'roadmap.sh')
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title
    """, (slug, title))

    nodes = FetchRoadmapNodes(slug, parent_slug)
    if not nodes:
        conn.commit()
        cur.close()
        return

    print(f"  nodes: {len(nodes)}")

    content_index = FetchContentIndex(slug)
    print(f"  content files: {len(content_index)}")

    cur.execute("DELETE FROM roadmap_nodes WHERE roadmap_id = %s", (slug,))

    for node in nodes:
        node_id   = node["id"]
        label     = node.get("data", {}).get("label", "").strip()
        node_type = node.get("type", "topic")
        position  = node.get("position", {})

        if not label:
            continue

        description, resources = "", []
        if node_id in content_index:
            try:
                md_response = requests.get(content_index[node_id], headers=GithubHeaders())
                if md_response.status_code == 200:
                    description, resources = ParseContentFile(md_response.text)
            except Exception:
                pass
            time.sleep(0.05)

        cur.execute("""
            INSERT INTO roadmap_nodes (id, roadmap_id, label, description, node_type, pos_x, pos_y)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
              label = EXCLUDED.label,
              description = EXCLUDED.description
        """, (node_id, slug, label, description or None, node_type,
              position.get("x"), position.get("y")))

        if resources:
            execute_values(cur, """
                INSERT INTO roadmap_node_resources (node_id, title, url, resource_type)
                VALUES %s
                ON CONFLICT DO NOTHING
            """, [(node_id, r["title"], r["url"], r["type"]) for r in resources])

    conn.commit()
    cur.close()
    print(f"  done")


def Main():
    print("Connecting to database...")
    conn = psycopg2.connect(DATABASE_URL)

    for slug, title, parent_slug in ROADMAPS:
        try:
            SeedRoadmap(conn, slug, title, parent_slug)
        except Exception as e:
            print(f"  [error] {slug}: {e}")
            conn.rollback()

    conn.close()
    print("\nAll roadmaps seeded.")


if __name__ == "__main__":
    Main()
