"""
Seed dev_tools and dev_tool_resources tables from the frontend dev_tools.ts data.

Usage:
    cd backend
    python scripts/seed_dev_tools.py
"""

import os, sys
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding="utf-8")

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))

DATABASE_URL = os.getenv("DATABASE_URL")

DEV_TOOLS = [
    {
        "id": "git-what-is",
        "title": "What is Git and GitHub",
        "description": "Understand version control, why it matters, and the difference between Git (local) and GitHub (remote).",
        "url": "https://github.com",
        "category": "github",
        "resources": [
            {"type": "youtube", "label": "Git Explained in 100 Seconds - Fireship",       "url": "https://www.youtube.com/watch?v=hwP7WQkmECE"},
            {"type": "youtube", "label": "Git and GitHub Crash Course - Traversy Media",   "url": "https://www.youtube.com/watch?v=SWYqp7iY_Tc"},
            {"type": "docs",    "label": "GitHub Docs - Getting Started",                  "url": "https://docs.github.com/en/get-started"},
        ],
    },
    {
        "id": "git-first-repo",
        "title": "Setting Up Your First Repo",
        "description": "Install Git, configure your identity, create a repo locally and push it to GitHub.",
        "url": "https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories",
        "category": "github",
        "resources": [
            {"type": "youtube", "label": "GitHub for Beginners - freeCodeCamp",            "url": "https://www.youtube.com/watch?v=RGOj5yH7evk"},
            {"type": "docs",    "label": "GitHub Quickstart",                              "url": "https://docs.github.com/en/get-started/quickstart"},
            {"type": "article", "label": "First Contributions Guide",                      "url": "https://github.com/firstcontributions/first-contributions"},
        ],
    },
    {
        "id": "git-branching",
        "title": "Branching and Pull Requests",
        "description": "Learn the feature-branch workflow: create branches, open PRs, resolve conflicts, and merge.",
        "url": "https://docs.github.com/en/pull-requests",
        "category": "github",
        "resources": [
            {"type": "youtube", "label": "Branching and Merging - The Coding Train",       "url": "https://www.youtube.com/watch?v=oPpnCh7InLY"},
            {"type": "docs",    "label": "About Pull Requests",                            "url": "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests"},
            {"type": "article", "label": "Git Branching - Atlassian",                      "url": "https://www.atlassian.com/git/tutorials/using-branches"},
        ],
    },
    {
        "id": "git-collaboration",
        "title": "Collaborating on a Team Project",
        "description": "Forks, cloning, code reviews, resolving merge conflicts, and team conventions.",
        "url": "https://docs.github.com/en/get-started/using-github/github-flow",
        "category": "github",
        "resources": [
            {"type": "youtube", "label": "GitHub Collaboration - Academind",               "url": "https://www.youtube.com/watch?v=MnUd31TvBoU"},
            {"type": "docs",    "label": "GitHub Flow Guide",                              "url": "https://docs.github.com/en/get-started/using-github/github-flow"},
        ],
    },
    {
        "id": "git-portfolio",
        "title": "GitHub for Your Portfolio",
        "description": "Pin repos, write good READMEs, use GitHub Pages to deploy your portfolio site.",
        "url": "https://pages.github.com",
        "category": "github",
        "resources": [
            {"type": "youtube", "label": "GitHub Pages Tutorial - Programming with Mosh",  "url": "https://www.youtube.com/watch?v=SKXkC4SqtRk"},
            {"type": "article", "label": "How to Write a Good README",                     "url": "https://www.makeareadme.com"},
            {"type": "docs",    "label": "GitHub Pages Docs",                              "url": "https://docs.github.com/en/pages"},
        ],
    },
    {
        "id": "docs-devdocs-io",
        "title": "DevDocs.io",
        "description": "Fast, offline-capable API documentation browser. Search across multiple languages and frameworks in one place.",
        "url": "https://devdocs.io",
        "category": "devdocs",
        "resources": [
            {"type": "docs",    "label": "DevDocs.io - Browse All Docs",                   "url": "https://devdocs.io"},
            {"type": "article", "label": "How to Use DevDocs",                             "url": "https://devdocs.io/about"},
        ],
    },
    {
        "id": "docs-mdn",
        "title": "MDN Web Docs",
        "description": "The gold standard reference for HTML, CSS, and JavaScript. Start here for anything web-related.",
        "url": "https://developer.mozilla.org",
        "category": "devdocs",
        "resources": [
            {"type": "docs",    "label": "MDN - HTML Reference",                           "url": "https://developer.mozilla.org/en-US/docs/Web/HTML"},
            {"type": "docs",    "label": "MDN - CSS Reference",                            "url": "https://developer.mozilla.org/en-US/docs/Web/CSS"},
            {"type": "docs",    "label": "MDN - JS Reference",                             "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"},
        ],
    },
    {
        "id": "docs-python",
        "title": "Python Official Docs",
        "description": "The authoritative Python reference. Use it to look up built-ins, standard library modules, and language syntax.",
        "url": "https://docs.python.org/3/",
        "category": "devdocs",
        "resources": [
            {"type": "docs",    "label": "Python 3 Docs",                                  "url": "https://docs.python.org/3/"},
            {"type": "docs",    "label": "Python Standard Library",                        "url": "https://docs.python.org/3/library/index.html"},
            {"type": "article", "label": "How to Read Python Docs - RealPython",           "url": "https://realpython.com/python-documentation/"},
        ],
    },
    {
        "id": "docs-react",
        "title": "React Docs",
        "description": "The official React documentation covering components, hooks, state, and advanced patterns.",
        "url": "https://react.dev",
        "category": "devdocs",
        "resources": [
            {"type": "docs",    "label": "React - Learn",                                  "url": "https://react.dev/learn"},
            {"type": "docs",    "label": "React - API Reference",                          "url": "https://react.dev/reference/react"},
            {"type": "youtube", "label": "How to Use React Docs",                          "url": "https://www.youtube.com/watch?v=wIyHSOugGGw"},
        ],
    },
    {
        "id": "docs-stackoverflow",
        "title": "Stack Overflow Basics",
        "description": "How to search effectively, read answers critically, and ask a good question when stuck.",
        "url": "https://stackoverflow.com",
        "category": "devdocs",
        "resources": [
            {"type": "article", "label": "How to Ask a Good Question",                     "url": "https://stackoverflow.com/help/how-to-ask"},
            {"type": "article", "label": "Minimal Reproducible Example",                   "url": "https://stackoverflow.com/help/minimal-reproducible-example"},
        ],
    },
    {
        "id": "docs-google-dev",
        "title": "How to Google Like a Developer",
        "description": "Search operators, how to phrase technical queries, reading error messages, and using AI tools correctly.",
        "url": "https://www.google.com",
        "category": "devdocs",
        "resources": [
            {"type": "article", "label": "Google Search Tips for Developers - freeCodeCamp", "url": "https://www.freecodecamp.org/news/how-to-google-like-a-pro-10-tips-for-effective-googling/"},
            {"type": "youtube", "label": "How Developers Search the Web - Fireship",         "url": "https://www.youtube.com/watch?v=cEBkvm0-rg0"},
        ],
    },
]


def Main():
    print("Connecting to database...")
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    for tool in DEV_TOOLS:
        cur.execute("""
            INSERT INTO dev_tools (id, title, description, url, category)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
              title       = EXCLUDED.title,
              description = EXCLUDED.description,
              url         = EXCLUDED.url,
              category    = EXCLUDED.category
        """, (tool["id"], tool["title"], tool["description"], tool["url"], tool["category"]))

        cur.execute("DELETE FROM dev_tool_resources WHERE tool_id = %s", (tool["id"],))

        if tool["resources"]:
            execute_values(cur, """
                INSERT INTO dev_tool_resources (tool_id, resource_type, label, url)
                VALUES %s
            """, [(tool["id"], r["type"], r["label"], r["url"]) for r in tool["resources"]])

    conn.commit()
    cur.close()
    conn.close()
    print(f"Seeded {len(DEV_TOOLS)} dev tools.")


if __name__ == "__main__":
    Main()
