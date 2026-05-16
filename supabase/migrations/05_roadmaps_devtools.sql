-- ============================================
-- ROADMAPS & DEV TOOLS TABLES
-- Sources: internal (roadmaps.ts) + roadmap.sh
-- ============================================

-- ── Roadmaps ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmaps (
  id          TEXT PRIMARY KEY,           -- e.g. 'frontend', 'fullstack'
  title       TEXT NOT NULL,
  icon        TEXT,
  description TEXT,
  source      TEXT NOT NULL DEFAULT 'roadmap.sh'
    CHECK (source IN ('internal', 'roadmap.sh'))
);

-- ── Roadmap Nodes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmap_nodes (
  id          TEXT PRIMARY KEY,           -- roadmap.sh node id or internal slug
  roadmap_id  TEXT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  description TEXT,
  node_type   TEXT NOT NULL DEFAULT 'topic',  -- topic | subtopic | section
  depends_on  TEXT[]  DEFAULT '{}',
  skills      TEXT[]  DEFAULT '{}',
  pos_x       FLOAT,
  pos_y       FLOAT
);

-- ── Roadmap Node Resources ────────────────────────────────────────
-- Covers both internal course links and roadmap.sh @article/@video/@course links
CREATE TABLE IF NOT EXISTS roadmap_node_resources (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id       TEXT NOT NULL REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  url           TEXT NOT NULL,
  resource_type TEXT DEFAULT 'link'  -- article | video | course | official | feed | link
);

-- ── Roadmap Edges ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmap_edges (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id TEXT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  from_node  TEXT NOT NULL,
  to_node    TEXT NOT NULL,
  UNIQUE(roadmap_id, from_node, to_node)
);

-- ── Dev Tools ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dev_tools (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  url         TEXT,
  category    TEXT NOT NULL CHECK (category IN ('github', 'devdocs', 'tools'))
);

-- ── Dev Tool Resources ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dev_tool_resources (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id       TEXT NOT NULL REFERENCES dev_tools(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('youtube', 'docs', 'article', 'book')),
  label         TEXT NOT NULL,
  url           TEXT NOT NULL
);

-- ── RLS (all public read, admin seeded, no user writes) ───────────
ALTER TABLE roadmaps               ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_nodes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_node_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_edges          ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_tools              ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_tool_resources     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read roadmaps"               ON roadmaps               FOR SELECT USING (true);
CREATE POLICY "Public read roadmap_nodes"          ON roadmap_nodes          FOR SELECT USING (true);
CREATE POLICY "Public read roadmap_node_resources" ON roadmap_node_resources FOR SELECT USING (true);
CREATE POLICY "Public read roadmap_edges"          ON roadmap_edges          FOR SELECT USING (true);
CREATE POLICY "Public read dev_tools"              ON dev_tools              FOR SELECT USING (true);
CREATE POLICY "Public read dev_tool_resources"     ON dev_tool_resources     FOR SELECT USING (true);
