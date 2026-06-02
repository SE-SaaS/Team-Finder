import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('workflow/diagrams');
const NOW = 1779990000000;

let counter = 0;
function id(prefix = 'el') {
  counter += 1;
  return `${prefix}_${counter.toString(36).padStart(4, '0')}`;
}

function baseElement(type, x, y, width, height, extra = {}) {
  return {
    id: id(type),
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: extra.strokeColor ?? '#1e1e1e',
    backgroundColor: extra.backgroundColor ?? 'transparent',
    fillStyle: 'solid',
    strokeWidth: extra.strokeWidth ?? 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: extra.frameId ?? null,
    roundness: extra.roundness ?? { type: 3 },
    seed: 100000 + counter,
    version: 1,
    versionNonce: 200000 + counter,
    isDeleted: false,
    boundElements: null,
    updated: NOW,
    link: null,
    locked: false,
    ...extra,
  };
}

function rect(elements, x, y, width, height, label, opts = {}) {
  const r = baseElement('rectangle', x, y, width, height, {
    strokeColor: opts.stroke ?? '#1e1e1e',
    backgroundColor: opts.bg ?? '#ffffff',
    frameId: opts.frameId ?? null,
  });
  elements.push(r);
  if (label) {
    text(elements, x + 14, y + 12, label, {
      size: opts.size ?? 16,
      width: width - 28,
      color: opts.color ?? '#1e1e1e',
      frameId: opts.frameId ?? null,
    });
  }
  return r;
}

function text(elements, x, y, value, opts = {}) {
  const size = opts.size ?? 16;
  const width = opts.width ?? Math.max(180, Math.min(760, value.length * size * 0.48));
  const lines = String(value).split('\n').length;
  const height = opts.height ?? Math.max(size * 1.25, lines * size * 1.25);
  const t = baseElement('text', x, y, width, height, {
    strokeColor: opts.color ?? '#1e1e1e',
    backgroundColor: 'transparent',
    frameId: opts.frameId ?? null,
    roundness: null,
    text: value,
    fontSize: size,
    fontFamily: opts.family ?? 2,
    textAlign: opts.align ?? 'left',
    verticalAlign: 'top',
    containerId: null,
    originalText: value,
    autoResize: false,
  });
  elements.push(t);
  return t;
}

function arrow(elements, x1, y1, x2, y2, label = '', opts = {}) {
  const a = baseElement('arrow', x1, y1, x2 - x1, y2 - y1, {
    strokeColor: opts.stroke ?? '#1e1e1e',
    backgroundColor: 'transparent',
    frameId: opts.frameId ?? null,
    roundness: { type: 2 },
    startBinding: null,
    endBinding: null,
    points: [[0, 0], [x2 - x1, y2 - y1]],
    lastCommittedPoint: null,
    startArrowhead: opts.startArrowhead ?? null,
    endArrowhead: opts.endArrowhead ?? 'arrow',
  });
  elements.push(a);
  if (label) {
    text(elements, (x1 + x2) / 2 - 90, (y1 + y2) / 2 - 22, label, {
      size: opts.size ?? 12,
      width: 180,
      color: opts.stroke ?? '#1e1e1e',
      frameId: opts.frameId ?? null,
    });
  }
  return a;
}

function frame(elements, x, y, width, height, name) {
  const f = baseElement('frame', x, y, width, height, {
    name,
    strokeColor: '#868e96',
    backgroundColor: 'transparent',
    roundness: null,
  });
  elements.push(f);
  return f;
}

function diagram(elements) {
  return {
    type: 'excalidraw',
    version: 2,
    source: 'codex-verified-repo-diagram',
    elements,
    appState: {
      gridSize: null,
      viewBackgroundColor: '#ffffff',
    },
    files: {},
  };
}

function writeDiagram(name, elements) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(diagram(elements), null, 2));
}

function frontendRoutingDiagram() {
  counter = 0;
  const e = [];
  text(e, 60, 30, 'Team-Finder Frontend Routing and Modules\nVerified from frontend/src/app, middleware, hooks, contexts, and components', {
    size: 28,
    width: 1180,
  });

  const fw = frame(e, 50, 100, 1500, 920, 'Frontend Routing');

  rect(e, 80, 145, 300, 130, 'Root shell\nsrc/app/layout.tsx\nErrorBoundary\nBackgroundThemeProvider\nAuthProvider', { bg: '#e7f5ff', frameId: fw.id });
  rect(e, 430, 145, 330, 130, 'Middleware\nsrc/middleware.ts\nrefresh Supabase session\nprotect route prefixes\nredirect auth users from login/signup', { bg: '#fff3bf', frameId: fw.id });
  rect(e, 810, 145, 320, 130, 'Authenticated layout\nsrc/app/(authenticated)/layout.tsx\nclient auth guard\nAuthenticatedUserProvider', { bg: '#e6fcf5', frameId: fw.id });
  rect(e, 1180, 145, 300, 130, 'Supabase clients\nlib/supabase.ts browser\nlib/supabaseServer.ts server\nlib/auth/serverAuth.ts API auth helper', { bg: '#f3f0ff', frameId: fw.id });

  arrow(e, 380, 210, 430, 210, '', { frameId: fw.id });
  arrow(e, 760, 210, 810, 210, '', { frameId: fw.id });
  arrow(e, 1130, 210, 1180, 210, '', { frameId: fw.id });

  rect(e, 80, 330, 310, 205, 'Public routes\n/\n/auth/login\n/auth/signup\n/auth/forgot-password\n/auth/reset-password\n/auth/callback route\n/faq\n/legal/privacy\n/legal/terms', { bg: '#ffffff', frameId: fw.id });
  rect(e, 430, 330, 350, 205, 'Protected app routes\n/dashboard\n/profile\n/projects\n/projects/create\n/projects/[id]\n/projects/[id]/edit\n/learning\n/settings\n/chat\n/chat/[id]\n/qna\n/qna/new\n/qna/[id]', { bg: '#f8f9fa', frameId: fw.id });
  rect(e, 825, 330, 315, 205, 'Next API routes\n/api/auth/signup\n/api/profile\n/api/profile/complete\n/api/courses/[university]/[major]\n/api/chat/*\n/api/qna/*', { bg: '#f8f9fa', frameId: fw.id });
  rect(e, 1180, 330, 300, 205, 'Missing/fallback API attempts\nuseRoadmaps fetches /api/roadmaps\nuseDevTools fetches /api/dev-tools\nNo matching route files exist.\nBoth hooks fall back to src/data/*.ts', { bg: '#fff5f5', stroke: '#c92a2a', frameId: fw.id });

  arrow(e, 580, 275, 575, 330, 'protected route prefixes', { frameId: fw.id });
  arrow(e, 985, 535, 985, 615, 'server mutations and cached reads', { frameId: fw.id });
  arrow(e, 1330, 535, 1330, 615, 'fallback', { stroke: '#c92a2a', frameId: fw.id });

  rect(e, 80, 635, 315, 210, 'Dashboard module\nProfileCompletionBanner\nBackgroundCanvas / ThemeToggle\nAIChat floating assistant\nreads profiles, user_skills, user_courses, projects\ncalls /api/courses/... for course sidebar', { bg: '#e7f5ff', frameId: fw.id });
  rect(e, 430, 635, 320, 210, 'Profile wizard\nProfileWizardController\nSteps 1,2,3,5,6,7\nlocalStorage draft\nreads profile/skills/courses\nposts /api/profile/complete', { bg: '#e6fcf5', frameId: fw.id });
  rect(e, 785, 635, 325, 210, 'Learning module\nLearningPage\nCourseCatalog\nDevToolsHub\nPersonalizedPath\nuseCourses -> courses table\nuseProgress -> learning_progress', { bg: '#e6fcf5', frameId: fw.id });
  rect(e, 1145, 635, 330, 210, 'Collaboration modules\nProjects pages -> projects/project_members\nChat pages + /api/chat/* -> chat tables\nQ&A pages + /api/qna/* -> qna tables\nScoring code -> algorithm/*', { bg: '#f3f0ff', frameId: fw.id });

  rect(e, 80, 885, 1395, 90, 'Frontend algorithm and static data\nalgorithm/finalScore.ts uses toVector + cosineSimilarity + availScore + weights + penalties.\nStatic catalogs live in src/data: universities, majors, roadmaps, dev_tools, skillLocks. Course/devtool/roadmap hooks mix Supabase and local fallback data.', {
    bg: '#f8f9fa',
    frameId: fw.id,
  });

  return e;
}

function dataFlowDiagram() {
  counter = 0;
  const e = [];
  text(e, 60, 30, 'Team-Finder Data Flow\nVerified from page components, Next API routes, FastAPI backend, agent tools, and Supabase migrations', {
    size: 28,
    width: 1250,
  });

  const f = frame(e, 50, 100, 1620, 1000, 'End-to-End Data Flow');
  rect(e, 80, 160, 230, 110, 'Student browser\nReact client components\nSupabase browser client\nsession access token', { bg: '#e7f5ff', frameId: f.id });
  rect(e, 370, 140, 270, 150, 'Next.js frontend\nApp Router pages\nAPI route handlers\nSSR cookie client\nmiddleware session refresh', { bg: '#fff3bf', frameId: f.id });
  rect(e, 720, 150, 300, 130, 'Supabase platform\nAuth\nPostgres DB\nRLS policies\nRPC rate limit', { bg: '#e6fcf5', frameId: f.id });
  rect(e, 1100, 140, 250, 150, 'FastAPI backend\n/api/chat\nJWT verification\nthread ownership\nCORS allowlist', { bg: '#ffe3e3', frameId: f.id });
  rect(e, 1410, 140, 220, 150, 'AI services\nLangGraph agent\nClaude Sonnet 4\nPostgres checkpointer', { bg: '#f3f0ff', frameId: f.id });

  arrow(e, 310, 210, 370, 210, 'page/API requests', { frameId: f.id });
  arrow(e, 640, 210, 720, 210, 'Supabase JS', { frameId: f.id });
  arrow(e, 310, 250, 720, 250, 'direct client reads/writes', { frameId: f.id });
  arrow(e, 310, 185, 1100, 185, 'AIChat fetch + Bearer token', { stroke: '#c92a2a', frameId: f.id });
  arrow(e, 1350, 210, 1410, 210, 'agent stream', { frameId: f.id });
  arrow(e, 1410, 275, 1020, 275, 'tool SQL/checkpoint DB', { frameId: f.id });

  rect(e, 80, 360, 335, 170, 'Auth/signup flow\n/auth/signup page -> /api/auth/signup\nvalidate JU/HU email + password\nSupabase auth.signUp\nDB RPC check_signup_rate_limit\n/auth/callback exchanges code\ncreates profiles row if missing', { bg: '#ffffff', frameId: f.id });
  rect(e, 455, 360, 345, 170, 'Profile wizard flow\nProfileWizardController hydrates profiles, user_skills, user_courses\nloads eligible courses by university/major/year\nPOST /api/profile/complete\nupsert profile\nreplace skills/courses\ncourse prerequisites unlock skills', { bg: '#ffffff', frameId: f.id });
  rect(e, 840, 360, 345, 170, 'Project flow\n/dashboard and /projects read projects\n/create inserts projects\n/[id] reads project + project_members\n/[id]/edit updates projects\nmatching code computes client-side score from skills/rating/availability', { bg: '#ffffff', frameId: f.id });
  rect(e, 1225, 360, 365, 170, 'Learning flow\nuseCourses reads courses table\nuseProgress merges localStorage + learning_progress\nmarkComplete upserts learning_progress\nuseRoadmaps and useDevTools try missing API routes then use local data files', { bg: '#ffffff', frameId: f.id });

  rect(e, 80, 590, 370, 170, 'Private chat flow\n/chat reads chat_threads, participant_state, chat_messages, profiles\n/api/chat/threads creates/fetches canonical 1:1 thread\n/api/chat/threads/[id]/messages inserts messages\n/api/chat/messages/[id] edits sender message\nread/mute update participant_state', { bg: '#f8f9fa', frameId: f.id });
  rect(e, 495, 590, 350, 170, 'Q&A flow\n/qna reads questions + answer/vote counts + author profiles\n/qna/new -> /api/qna/questions\n/qna/[id] reads answers and votes\nvote routes toggle question/answer vote rows\naccept route sets accepted_answer_id when present in later migration', { bg: '#f8f9fa', frameId: f.id });
  rect(e, 890, 590, 340, 170, 'AI assistant flow\nAIChat sends message/history/thread_id to backend\nAuthorization header carries Supabase access token\nbackend verifies JWKS JWT and university domain\nthread_id is user_id:uuid and ownership-checked', { bg: '#f8f9fa', frameId: f.id });
  rect(e, 1275, 590, 315, 170, 'AI tool data access\nget_my_profile\nget_learning_progress\nmark_learning_item_complete\nsearch_courses\nsearch_skills_catalog\nget_available_projects\nfind_teammates\nadd/remove course or skill\nmajor/roadmap utilities', { bg: '#f8f9fa', frameId: f.id });

  arrow(e, 265, 530, 265, 590, 'DMs', { frameId: f.id });
  arrow(e, 670, 530, 670, 590, 'community Q&A', { frameId: f.id });
  arrow(e, 1070, 530, 1070, 590, 'AI chat', { frameId: f.id });
  arrow(e, 1230, 675, 1275, 675, 'agent tools', { frameId: f.id });

  rect(e, 80, 820, 1510, 220, 'Database entities touched by flows\nAuth/profiles: auth.users, profiles, signup_rate_limits/check_signup_rate_limit\nAcademic/profile: courses, user_courses, skills, user_skills, skill_proficiencies, assessment_results, learning_progress\nProjects: projects, project_members, project_applications\nChat: chat_threads, chat_messages, chat_participant_state\nQ&A: qna_questions, qna_answers, qna_question_votes, qna_answer_votes\nLearning content: roadmaps, roadmap_nodes, roadmap_edges, roadmap_node_resources, dev_tools, dev_tool_resources\nAgent persistence: LangGraph Postgres checkpoint tables created by AsyncPostgresSaver.setup()', {
    bg: '#f1f3f5',
    frameId: f.id,
    size: 15,
  });

  return e;
}

function fullSystemDiagram() {
  counter = 0;
  const e = [];
  text(e, 60, 30, 'Team-Finder Full System Architecture\nVerified from actual code, route files, migrations, backend modules, hooks, and scripts', {
    size: 28,
    width: 1320,
  });

  const f = frame(e, 45, 100, 1780, 1220, 'Full System');
  rect(e, 80, 150, 300, 190, 'Frontend app\nNext.js 14 + React + TypeScript + Tailwind\nApp Router in src/app\nClient-heavy pages\nSentry configs present\nRuns on port 3002', { bg: '#e7f5ff', frameId: f.id });
  rect(e, 445, 150, 310, 190, 'Auth boundary\nSupabase Auth\n@supabase/ssr clients\nmiddleware route protection\nAuthContext session/user\nAuthenticatedUserProvider for protected app', { bg: '#fff3bf', frameId: f.id });
  rect(e, 820, 150, 310, 190, 'Supabase Postgres\nCore tables + RLS\npublic read catalogs\nuser-owned profile/progress/chat state\nservice scripts for seeding', { bg: '#e6fcf5', frameId: f.id });
  rect(e, 1195, 150, 280, 190, 'Python backend\nFastAPI app/main.py\n/api/chat and /api/health\nSupabase JWT verifier\nCORS for localhost/vercel/allowed origins', { bg: '#ffe3e3', frameId: f.id });
  rect(e, 1540, 150, 250, 190, 'AI layer\nLangGraph create_agent\nChatAnthropic\nclaude-sonnet-4-20250514\nAsyncPostgresSaver checkpointing', { bg: '#f3f0ff', frameId: f.id });

  arrow(e, 380, 245, 445, 245, '', { frameId: f.id });
  arrow(e, 755, 245, 820, 245, '', { frameId: f.id });
  arrow(e, 1130, 245, 1195, 245, 'AIChat only', { stroke: '#c92a2a', frameId: f.id });
  arrow(e, 1475, 245, 1540, 245, '', { frameId: f.id });
  arrow(e, 1540, 325, 1130, 325, 'agent tools + checkpoints', { frameId: f.id });

  rect(e, 80, 410, 360, 225, 'Frontend route groups\nPublic: /, /auth/login, /auth/signup, /auth/forgot-password, /auth/reset-password, /auth/callback, /faq, /legal/*\nProtected: /dashboard, /profile, /projects, /projects/create, /projects/[id], /projects/[id]/edit, /learning, /settings, /chat, /chat/[id], /qna, /qna/new, /qna/[id]\nNext API: auth, profile, courses, chat, qna', { bg: '#ffffff', frameId: f.id, size: 14 });
  rect(e, 500, 410, 330, 225, 'Frontend modules\nDashboard: profile completion, project hub, AIChat\nProfile: wizard steps + draft persistence\nProjects: browse/create/detail/edit\nLearning: courses/dev tools/personalized path\nChat: DM inbox/thread\nQ&A: question list/detail/new\nSettings: profile/account/contact updates', { bg: '#ffffff', frameId: f.id, size: 14 });
  rect(e, 890, 410, 340, 225, 'Frontend data access patterns\nDirect Supabase client: most reads and some writes\nNext API routes: signup, profile completion, cached course lookup, chat mutations, Q&A mutations\nBackend API: only AIChat fetches NEXT_PUBLIC_BACKEND_URL/api/chat\nLocal fallback: roadmaps/dev_tools data files', { bg: '#ffffff', frameId: f.id, size: 14 });
  rect(e, 1290, 410, 430, 225, 'Backend internals\nStartup requires NEXT_PUBLIC_SUPABASE_URL, DATABASE_URL, ANTHROPIC_API_KEY\nJWT verifier loads Supabase JWKS and enforces JU/HU email domain\nThread ID format: user_id:uuid\nAgent tools use psycopg2 connection pool for allowed SQL access\nCheckpointer uses async psycopg pool', { bg: '#ffffff', frameId: f.id, size: 14 });

  rect(e, 80, 710, 340, 250, 'Database schema groups\nprofiles\ncourses\nuser_courses\nskills\nuser_skills\nskill_proficiencies\nassessment_results\nlearning_progress', { bg: '#f8f9fa', frameId: f.id });
  rect(e, 465, 710, 340, 250, 'Project schema\nprojects\nproject_members\nproject_applications\nproject type: university/external\nstatus: open/in_progress/completed/closed\nexternal_url unique\nmetadata/difficulty migrations', { bg: '#f8f9fa', frameId: f.id });
  rect(e, 850, 710, 340, 250, 'Communication schema\nchat_threads canonical ordered pair\nchat_messages immutable history, sender edits only\nchat_participant_state muted/read state\nqna_questions\nqna_answers\nqna_question_votes\nqna_answer_votes', { bg: '#f8f9fa', frameId: f.id });
  rect(e, 1235, 710, 340, 250, 'Learning content schema\nroadmaps\nroadmap_nodes\nroadmap_edges\nroadmap_node_resources\ndev_tools\ndev_tool_resources\nAll public read, seeded/admin data', { bg: '#f8f9fa', frameId: f.id });

  arrow(e, 250, 635, 250, 710, 'profile/learning', { frameId: f.id });
  arrow(e, 665, 635, 665, 710, 'projects', { frameId: f.id });
  arrow(e, 1030, 635, 1030, 710, 'chat/qna', { frameId: f.id });
  arrow(e, 1400, 635, 1400, 710, 'learning catalog', { frameId: f.id });

  rect(e, 80, 1030, 510, 210, 'Data generation and seed pipeline\ndata/generators/prefetcher-ts fetches external project/resource candidates from GitHub, Kaggle, HuggingFace, GitLab, OpenHub, LeetCode, HackerRank, CTFtime, VulnHub, and others.\nscripts/seed-projects.js inserts seeded university projects.\nbackend/scripts/seed_roadmaps.py and seed_dev_tools.py write roadmaps/dev tools through DATABASE_URL.', { bg: '#fff9db', frameId: f.id, size: 14 });
  rect(e, 650, 1030, 520, 210, 'Matching and scoring\nfrontend/src/algorithm/finalScore.ts\nproject skills + student skills -> binary vectors\ncosineSimilarity for skill component\nrating normalized /5\navailScore for availability\nweights combine base score\nlow-rating penalty multiplier\nrounded 0-100 result with breakdown', { bg: '#fff9db', frameId: f.id, size: 14 });
  rect(e, 1230, 1030, 500, 210, 'Verified caveats shown in code\n/api/roadmaps and /api/dev-tools are called by hooks but no route files exist, so local fallback is active.\nProfile completion route is sequential, not transactional; code comment recommends a Postgres RPC for true atomicity.\nFrontend sends user_id/session_id to AIChat body, but FastAPI ignores trust in body and uses verified JWT identity.', { bg: '#fff5f5', stroke: '#c92a2a', frameId: f.id, size: 14 });

  return e;
}

writeDiagram('team-finder-frontend-routing.excalidraw', frontendRoutingDiagram());
writeDiagram('team-finder-data-flow.excalidraw', dataFlowDiagram());
writeDiagram('team-finder-full-system.excalidraw', fullSystemDiagram());

console.log(`Generated Excalidraw diagrams in ${OUT_DIR}`);
