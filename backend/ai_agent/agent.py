"""
University Career Assistant AI Agent
Built with LangGraph and Claude (Anthropic)
"""

import os
import asyncio
import uuid
import threading
from contextlib import contextmanager
from typing import Optional, List
from dotenv import load_dotenv
import psycopg2
from psycopg2 import pool as pg_pool
from psycopg2.extras import RealDictCursor

from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langchain.agents import create_agent
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from psycopg_pool import AsyncConnectionPool

from .system_prompt import SYSTEM_PROMPT

load_dotenv()

# ==================== Major Plans — load once at startup ====================

_VALID_MAJOR_CODES = frozenset({
    "AI_JU", "BIT_JU", "CIS_JU", "CS_JU", "CYS_JU", "DS_JU",
    "BIT_HU", "CIS_HU", "CS_HU", "CYS_HU", "DSAI_HU", "SWE_HU",
})


def _load_major_plans() -> dict:
    try:
        import importlib.util
        plans_path = os.path.join(os.path.dirname(__file__), "..", "majors_plans", "plans.py")
        plans_path = os.path.abspath(plans_path)
        spec = importlib.util.spec_from_file_location("majors_plans", plans_path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return {code: getattr(mod, code) for code in _VALID_MAJOR_CODES if hasattr(mod, code)}
    except Exception as e:
        print(f"Warning: Could not load major plans: {e}")
        return {}


_MAJOR_PLANS = _load_major_plans()

# ==================== Connection Pool + Context Manager ====================

_pool: "pg_pool.ThreadedConnectionPool | None" = None
_pool_lock = threading.Lock()


def _get_pool() -> "pg_pool.ThreadedConnectionPool":
    global _pool
    if _pool is None:
        with _pool_lock:
            if _pool is None:
                database_url = os.getenv("DATABASE_URL")
                if not database_url:
                    raise ValueError("DATABASE_URL must be set in .env file")
                _pool = pg_pool.ThreadedConnectionPool(1, 10, database_url)
    return _pool


@contextmanager
def get_db_cursor():
    """
    Yield a RealDictCursor from the connection pool.
    Commits on clean exit, rolls back on exception, always closes
    the cursor and returns the connection to the pool.
    """
    p = _get_pool()
    conn = p.getconn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        yield cur
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()
        p.putconn(conn)


# ==================== Write Tools (user_courses, user_skills, learning_progress) ====================

@tool
def add_course_to_student(course_code: str, config: RunnableConfig) -> str:
    """
    Add a completed course to the current student's record.
    IMPORTANT: This is the ONLY way to add courses to user_courses table.

    Args:
        course_code: Course code (e.g., 'CS101')

    Returns:
        Success or error message
    """
    user_id = (config.get("configurable") or {}).get("user_id")
    if not user_id:
        return "Error: No authenticated user in context."

    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT code, name FROM courses WHERE code = %s", (course_code,))
            course = cur.fetchone()
            if not course:
                return f"Course '{course_code}' not found"

            cur.execute("""
                INSERT INTO user_courses (user_id, course_code, course_name)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id, course_code) DO NOTHING
            """, (user_id, course['code'], course['name']))

        return f"Successfully added course '{course_code}' to your completed courses"
    except Exception as e:
        return f"Error: {str(e)}"


@tool
def remove_course_from_student(course_code: str, config: RunnableConfig) -> str:
    """
    Remove a course from the current student's completed courses.
    IMPORTANT: This is the ONLY way to remove courses from user_courses table.

    Args:
        course_code: Course code to remove

    Returns:
        Success or error message
    """
    user_id = (config.get("configurable") or {}).get("user_id")
    if not user_id:
        return "Error: No authenticated user in context."

    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT code FROM courses WHERE code = %s", (course_code,))
            course = cur.fetchone()
            if not course:
                return f"Course '{course_code}' not found"

            cur.execute("""
                DELETE FROM user_courses
                WHERE user_id = %s AND course_code = %s
            """, (user_id, course_code))
            rows_deleted = cur.rowcount

        if rows_deleted > 0:
            return f"Successfully removed course '{course_code}' from your records"
        else:
            return f"Course '{course_code}' was not in your completed courses"
    except Exception as e:
        return f"Error: {str(e)}"


@tool
def add_skill_to_student(skill_name: str, config: RunnableConfig) -> str:
    """
    Add a skill to the current student's profile.
    IMPORTANT: This is the ONLY way to add skills to user_skills table.

    Args:
        skill_name: Name of the skill to add

    Returns:
        Success or error message
    """
    user_id = (config.get("configurable") or {}).get("user_id")
    if not user_id:
        return "Error: No authenticated user in context."

    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT name FROM skills WHERE name ILIKE %s", (skill_name,))
            skill = cur.fetchone()
            if not skill:
                return f"Skill '{skill_name}' not found in the system"

            cur.execute("""
                INSERT INTO user_skills (user_id, skill_name)
                VALUES (%s, %s)
                ON CONFLICT (user_id, skill_name) DO NOTHING
            """, (user_id, skill['name']))

        return f"Successfully added skill '{skill_name}' to your profile"
    except Exception as e:
        return f"Error: {str(e)}"


@tool
def remove_skill_from_student(skill_name: str, config: RunnableConfig) -> str:
    """
    Remove a skill from the current student's profile.
    IMPORTANT: This is the ONLY way to remove skills from user_skills table.

    Args:
        skill_name: Name of the skill to remove

    Returns:
        Success or error message
    """
    user_id = (config.get("configurable") or {}).get("user_id")
    if not user_id:
        return "Error: No authenticated user in context."

    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT name FROM skills WHERE name ILIKE %s", (skill_name,))
            skill = cur.fetchone()
            if not skill:
                return f"Skill '{skill_name}' not found"

            cur.execute("""
                DELETE FROM user_skills
                WHERE user_id = %s AND skill_name = %s
            """, (user_id, skill['name']))
            rows_deleted = cur.rowcount

        if rows_deleted > 0:
            return f"Successfully removed skill '{skill_name}' from your profile"
        else:
            return f"Skill '{skill_name}' was not in your profile"
    except Exception as e:
        return f"Error: {str(e)}"


# ==================== Profile Tools ====================

@tool
def get_my_profile(config: RunnableConfig) -> str:
    """
    Load the current student's full profile: personal info, completed courses,
    skills, and assessment scores. Call this whenever you need to know anything
    about the student beyond their user ID.

    Returns:
        Structured text with the student's complete academic profile.
    """
    user_id = (config.get("configurable") or {}).get("user_id")
    if not user_id:
        return "Error: No authenticated user in context."

    try:
        with get_db_cursor() as cur:
            cur.execute("""
                SELECT full_name, email, university, major, year, bio, availability
                FROM profiles WHERE id = %s
            """, (user_id,))
            profile = cur.fetchone()
            if not profile:
                return "Profile not found for this user."

            cur.execute("""
                SELECT course_name AS name, course_code AS code
                FROM user_courses
                WHERE user_id = %s
                ORDER BY course_name
            """, (user_id,))
            courses = cur.fetchall()

            cur.execute("""
                SELECT us.skill_name AS name, sp.rating
                FROM user_skills us
                LEFT JOIN skills s ON s.name ILIKE us.skill_name
                LEFT JOIN skill_proficiencies sp
                    ON sp.skill_id = s.id AND sp.user_id = us.user_id
                WHERE us.user_id = %s
                ORDER BY us.skill_name
            """, (user_id,))
            skills = cur.fetchall()

            cur.execute("""
                SELECT s.name AS skill, ar.score, ar.retake_count
                FROM assessment_results ar
                JOIN skills s ON s.id = ar.skill_id
                WHERE ar.user_id = %s
                ORDER BY ar.score DESC
            """, (user_id,))
            assessments = cur.fetchall()

        lines = [
            f"Name: {profile['full_name']}",
            f"Email: {profile['email']}",
            f"University: {profile['university']}",
            f"Major: {profile['major']}",
            f"Year: {profile['year']}",
            f"Availability: {profile['availability']}",
            "",
            f"Completed Courses ({len(courses)}):",
        ]
        for c in courses:
            lines.append(f"  - {c['name']} ({c['code']})")

        lines.append(f"\nSkills ({len(skills)}):")
        for s in skills:
            rating = f"  [rating: {s['rating']}/100]" if s['rating'] else ""
            lines.append(f"  - {s['name']}{rating}")

        lines.append(f"\nAssessment Results ({len(assessments)}):")
        for a in assessments:
            lines.append(f"  - {a['skill']}: {a['score']}/100 (retakes: {a['retake_count']})")

        return "\n".join(lines)
    except Exception as e:
        return f"Error loading profile: {str(e)}"


@tool
def get_learning_progress(config: RunnableConfig) -> str:
    """
    Get the current student's learning progress — all roadmap nodes and courses
    they have marked complete on the Learning page.

    Returns:
        List of completed item IDs grouped by type (node / course).
    """
    user_id = (config.get("configurable") or {}).get("user_id")
    if not user_id:
        return "Error: No authenticated user in context."

    try:
        with get_db_cursor() as cur:
            cur.execute("""
                SELECT item_id, item_type, completed_at
                FROM learning_progress
                WHERE user_id = %s
                ORDER BY item_type, completed_at
            """, (user_id,))
            rows = cur.fetchall()

        if not rows:
            return "No learning progress recorded yet."

        nodes = [r for r in rows if r['item_type'] == 'node']
        courses = [r for r in rows if r['item_type'] == 'course']

        lines = [f"Learning Progress ({len(rows)} items completed):"]
        if nodes:
            lines.append(f"\nRoadmap Nodes ({len(nodes)}):")
            for r in nodes:
                lines.append(f"  - {r['item_id']}")
        if courses:
            lines.append(f"\nCourses ({len(courses)}):")
            for r in courses:
                lines.append(f"  - {r['item_id']}")

        return "\n".join(lines)
    except Exception as e:
        return f"Error loading learning progress: {str(e)}"


@tool
def mark_learning_item_complete(item_id: str, item_type: str, config: RunnableConfig) -> str:
    """
    Mark a roadmap node or learning course as complete for the current student.

    Args:
        item_id: The ID of the node or course to mark complete
        item_type: Either 'node' (roadmap node) or 'course' (learning course)

    Returns:
        Success or error message
    """
    user_id = (config.get("configurable") or {}).get("user_id")
    if not user_id:
        return "Error: No authenticated user in context."

    if item_type not in ('node', 'course'):
        return "Error: item_type must be 'node' or 'course'"

    try:
        with get_db_cursor() as cur:
            cur.execute("""
                INSERT INTO learning_progress (user_id, item_id, item_type)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id, item_id) DO NOTHING
            """, (user_id, item_id, item_type))

        return f"Marked '{item_id}' as complete"
    except Exception as e:
        return f"Error: {str(e)}"


# ==================== Read Tools ====================

@tool
def search_courses(
    university: str,
    major: Optional[str] = None,
    keyword: Optional[str] = None,
) -> str:
    """
    Search the university course catalog.

    Args:
        university: 'University of Jordan' or 'Hashemite University'
        major: filter by major name (optional)
        keyword: partial match on course name or code (optional)

    Returns:
        Matching courses grouped by major.
    """
    try:
        with get_db_cursor() as cur:
            query = "SELECT code, name, major FROM courses WHERE university = %s"
            params: list = [university]
            if major:
                query += " AND major ILIKE %s"
                params.append(f"%{major}%")
            if keyword:
                query += " AND (name ILIKE %s OR code ILIKE %s)"
                params.extend([f"%{keyword}%", f"%{keyword}%"])
            query += " ORDER BY major, code LIMIT 100"
            cur.execute(query, params)
            rows = cur.fetchall()

        if not rows:
            return "No courses found matching the criteria."

        lines = [f"Courses ({len(rows)} found):"]
        current_major = None
        for r in rows:
            if r['major'] != current_major:
                current_major = r['major']
                lines.append(f"\n{current_major}:")
            lines.append(f"  {r['code']} - {r['name']}")
        return "\n".join(lines)
    except Exception as e:
        return f"Error searching courses: {str(e)}"


@tool
def search_skills_catalog(keyword: Optional[str] = None) -> str:
    """
    Search the master skills catalog by name.

    Args:
        keyword: partial skill name to search (optional; returns all if omitted)

    Returns:
        Comma-separated list of matching skill names.
    """
    try:
        with get_db_cursor() as cur:
            if keyword:
                cur.execute(
                    "SELECT name FROM skills WHERE name ILIKE %s ORDER BY name LIMIT 50",
                    (f"%{keyword}%",),
                )
            else:
                cur.execute("SELECT name FROM skills ORDER BY name LIMIT 100")
            rows = cur.fetchall()

        if not rows:
            return "No skills found."
        return "Skills: " + ", ".join(r['name'] for r in rows)
    except Exception as e:
        return f"Error searching skills: {str(e)}"


@tool
def get_available_projects(
    university: Optional[str] = None,
    required_skill: Optional[str] = None,
) -> str:
    """
    Browse open projects, optionally filtered by university or required skill.

    Args:
        university: filter by university (optional)
        required_skill: filter to projects that need this skill (optional)

    Returns:
        Project titles, descriptions, difficulty, and required skills.
    """
    try:
        with get_db_cursor() as cur:
            query = """
                SELECT title, description, difficulty, tech_stack, skills_needed, university
                FROM projects
                WHERE status = 'open'
            """
            params: list = []
            if university:
                query += " AND university = %s"
                params.append(university)
            if required_skill:
                query += " AND %s = ANY(skills_needed)"
                params.append(required_skill)
            query += " ORDER BY title LIMIT 20"
            cur.execute(query, params or None)
            rows = cur.fetchall()

        if not rows:
            return "No open projects found matching the criteria."

        lines = [f"Open Projects ({len(rows)} found):"]
        for r in rows:
            lines.append(f"\n{r['title']} [{r['difficulty']}]  ({r['university']})")
            lines.append(f"  {r['description']}")
            if r['tech_stack']:
                lines.append(f"  Tech: {', '.join(r['tech_stack'])}")
            if r['skills_needed']:
                lines.append(f"  Skills needed: {', '.join(r['skills_needed'])}")
        return "\n".join(lines)
    except Exception as e:
        return f"Error fetching projects: {str(e)}"


@tool
def find_teammates(
    skill_names: List[str],
    university: Optional[str] = None,
    config: RunnableConfig = ...,
) -> str:
    """
    Find students at the same university who have specific skills.
    Returns name, major, year, availability, and matching skills only.
    Never returns email or contact info.

    Args:
        skill_names: list of required skill names to search for
        university: filter by university (defaults to the current user's university)

    Returns:
        Matching students with public profile info.
    """
    user_id = (config.get("configurable") or {}).get("user_id")
    if not user_id:
        return "Error: No authenticated user in context."
    if not skill_names:
        return "Error: Provide at least one skill name."

    try:
        with get_db_cursor() as cur:
            if not university:
                cur.execute("SELECT university FROM profiles WHERE id = %s", (user_id,))
                row = cur.fetchone()
                university = row['university'] if row else None

            skill_lower = [s.lower() for s in skill_names]
            placeholders = ",".join(["%s"] * len(skill_lower))
            cur.execute(f"""
                SELECT
                    p.full_name AS name,
                    p.major,
                    p.year,
                    p.availability,
                    array_agg(DISTINCT us.skill_name ORDER BY us.skill_name) AS matched_skills
                FROM profiles p
                JOIN user_skills us ON us.user_id = p.id
                WHERE p.id != %s
                  AND p.university = %s
                  AND LOWER(us.skill_name) = ANY(ARRAY[{placeholders}]::text[])
                GROUP BY p.id, p.full_name, p.major, p.year, p.availability
                ORDER BY p.full_name
                LIMIT 10
            """, [user_id, university] + skill_lower)
            rows = cur.fetchall()

        if not rows:
            return f"No teammates found with skills: {', '.join(skill_names)}"

        lines = [f"Potential Teammates ({len(rows)} found):"]
        for r in rows:
            lines.append(f"\n{r['name']} - {r['major']}, Year {r['year']}")
            lines.append(f"  Availability: {r['availability']}")
            lines.append(f"  Matching skills: {', '.join(r['matched_skills'])}")
        return "\n".join(lines)
    except Exception as e:
        return f"Error finding teammates: {str(e)}"


# ==================== Utility Tools ====================

@tool
def get_major_plan(major_code: str) -> str:
    """
    Fetch a university major's full course plan.

    Args:
        major_code: One of AI_JU, BIT_JU, CIS_JU, CS_JU, CYS_JU, DS_JU,
                    BIT_HU, CIS_HU, CS_HU, CYS_HU, DSAI_HU, SWE_HU

    Returns:
        The full major plan as text, or an error message if not found.
    """
    if major_code not in _VALID_MAJOR_CODES:
        valid = ", ".join(sorted(_VALID_MAJOR_CODES))
        return f"Unknown major code '{major_code}'. Valid codes are: {valid}"
    plan = _MAJOR_PLANS.get(major_code)
    if plan is None:
        return f"Major plan '{major_code}' could not be loaded. Check server logs."
    return plan


@tool
def search_roadmap(career_path: str) -> str:
    """
    Return the roadmap.sh URL for a given career or technology path.

    Args:
        career_path: The career or technology to search for (e.g., "frontend", "backend", "devops", "python")

    Returns:
        The direct URL to the roadmap
    """
    slug = career_path.lower().strip().replace(" ", "-")
    return (
        f"Here is the roadmap for '{career_path}':\n"
        f"https://roadmap.sh/{slug}\n\n"
        f"Share this link with the student so they can explore the full interactive roadmap."
    )


@tool
def get_available_roadmaps() -> str:
    """Get list of popular career roadmaps from roadmap.sh."""
    return """Popular roadmaps on roadmap.sh:

Role-based: Frontend, Backend, Full Stack, DevOps, Android, iOS, Data Scientist,
AI/ML Engineer, Blockchain, QA Engineer, Software Architect, Game Developer

Skill-based: Python, JavaScript, Java, Go, Rust, TypeScript, React, Angular, Vue,
Node.js, GraphQL, Docker, Kubernetes, PostgreSQL, MongoDB

Visit https://roadmap.sh to explore all roadmaps!"""


# ==================== Agent Setup ====================

async def create_university_assistant():
    """Create and configure the University Career Assistant AI Agent."""
    anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
    database_url = os.getenv("DATABASE_URL")

    if not anthropic_api_key:
        raise ValueError("ANTHROPIC_API_KEY must be set in .env file")
    if not database_url:
        raise ValueError("DATABASE_URL must be set in .env file")

    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        temperature=0.0,
        api_key=anthropic_api_key,
        max_tokens=4096
    )

    profile_tools = [
        get_my_profile,
        get_learning_progress,
        mark_learning_item_complete,
    ]

    read_tools = [
        search_courses,
        search_skills_catalog,
        get_available_projects,
        find_teammates,
    ]

    write_tools = [
        add_course_to_student,
        remove_course_from_student,
        add_skill_to_student,
        remove_skill_from_student,
    ]

    utility_tools = [
        get_major_plan,
        search_roadmap,
        get_available_roadmaps,
    ]

    all_tools = profile_tools + read_tools + write_tools + utility_tools

    print(f"\nLoaded {len(all_tools)} tools:")
    print(f"  - {len(profile_tools)} profile/progress tools")
    print(f"  - {len(read_tools)} allowlisted read tools")
    print(f"  - {len(write_tools)} write tools (user_courses, user_skills)")
    print(f"  - {len(utility_tools)} utility tools")

    db_pool = AsyncConnectionPool(
        conninfo=database_url,
        max_size=10,
        open=False,
        kwargs={"autocommit": True, "prepare_threshold": 0},
    )
    await db_pool.open()

    checkpointer = AsyncPostgresSaver(db_pool)
    await checkpointer.setup()

    agent = create_agent(
        model=llm,
        tools=all_tools,
        system_prompt=SYSTEM_PROMPT,
        checkpointer=checkpointer
    )

    return agent


# ==================== Terminal Interface ====================

async def run_agent_terminal():
    """Run the agent in terminal mode for interactive conversations."""
    print("=" * 60)
    print("University Career Assistant AI")
    print("Powered by Claude (Anthropic) and LangGraph")
    print("=" * 60)
    print("\nType 'exit' or 'quit' to end the conversation.")
    print("Type 'clear' to start a new conversation.\n")

    try:
        agent = await create_university_assistant()
    except Exception as e:
        print(f"\nFailed to initialize agent: {e}")
        print("Please check your .env configuration\n")
        return

    thread_id = str(uuid.uuid4())
    print(f"\n[Session ID: {thread_id}]")
    print("[Agent ready! You can start chatting now.]\n")

    conversation_history = []

    while True:
        try:
            user_input = input("\nYou: ").strip()

            if not user_input:
                continue

            if user_input.lower() in ['exit', 'quit']:
                print("\nGoodbye!")
                p = _pool
                if p:
                    p.closeall()
                break

            if user_input.lower() == 'clear':
                conversation_history = []
                thread_id = str(uuid.uuid4())
                print(f"\n[Conversation cleared. New Session ID: {thread_id}]\n")
                continue

            conversation_history.append(HumanMessage(content=user_input))

            config = {"configurable": {"thread_id": thread_id}}

            print("\nAssistant: ", end="", flush=True)

            full_response = ""

            async for event in agent.astream_events(
                {"messages": conversation_history},
                config=config,
                version="v2"
            ):
                if event["event"] == "on_chat_model_stream":
                    content = event["data"]["chunk"].content
                    if content:
                        print(content, end="", flush=True)
                        full_response += content

            print()

            if full_response:
                conversation_history.append(AIMessage(content=full_response))

        except KeyboardInterrupt:
            print("\n\nInterrupted. Type 'exit' to quit or continue chatting.")
        except Exception as e:
            print(f"\n[Error: {str(e)}]")
            print("Please try again or type 'exit' to quit.")


if __name__ == "__main__":
    asyncio.run(run_agent_terminal())
