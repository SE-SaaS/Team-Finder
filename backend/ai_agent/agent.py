"""
University Career Assistant AI Agent
Built with LangGraph and powered by Z.AI
Uses SQLDatabaseToolkit for flexible database queries
"""

import os
import asyncio
import uuid
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2.extras import RealDictCursor

from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, AIMessage
from langchain.agents import create_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit

from system_prompt import SYSTEM_PROMPT

# Load environment variables
load_dotenv()

# Database connection for custom tools
_db_connection = None

def get_db_connection():
    """Get or create database connection for custom write operations."""
    global _db_connection
    if _db_connection is None or _db_connection.closed:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise ValueError("DATABASE_URL must be set in .env file")
        _db_connection = psycopg2.connect(database_url)
    return _db_connection


# ==================== Custom Write Tools (user_courses, user_skills only) ====================

@tool
def add_course_to_student(email: str, course_code: str) -> str:
    """
    Add a completed course to a student's record.
    IMPORTANT: This is the ONLY way to add courses to user_courses table.

    Args:
        email: Student's email address
        course_code: Course code (e.g., 'CS101')

    Returns:
        Success or error message
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Get user_id
        cur.execute("SELECT id FROM profiles WHERE email = %s", (email,))
        profile = cur.fetchone()
        if not profile:
            cur.close()
            return "Student not found"
        user_id = profile['id']

        # Get course_id
        cur.execute("SELECT id FROM courses WHERE code = %s", (course_code,))
        course = cur.fetchone()
        if not course:
            cur.close()
            return f"Course '{course_code}' not found"
        course_id = course['id']

        # Add to user_courses
        cur.execute("""
            INSERT INTO user_courses (user_id, course_id)
            VALUES (%s, %s)
            ON CONFLICT (user_id, course_id) DO NOTHING
        """, (user_id, course_id))

        conn.commit()
        cur.close()

        return f"✓ Successfully added course '{course_code}' to student's completed courses"

    except Exception as e:
        conn.rollback()
        return f"Error: {str(e)}"


@tool
def remove_course_from_student(email: str, course_code: str) -> str:
    """
    Remove a course from a student's completed courses.
    IMPORTANT: This is the ONLY way to remove courses from user_courses table.

    Args:
        email: Student's email address
        course_code: Course code to remove

    Returns:
        Success or error message
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Get user_id
        cur.execute("SELECT id FROM profiles WHERE email = %s", (email,))
        profile = cur.fetchone()
        if not profile:
            cur.close()
            return "Student not found"
        user_id = profile['id']

        # Get course_id
        cur.execute("SELECT id FROM courses WHERE code = %s", (course_code,))
        course = cur.fetchone()
        if not course:
            cur.close()
            return f"Course '{course_code}' not found"
        course_id = course['id']

        # Remove from user_courses
        cur.execute("""
            DELETE FROM user_courses
            WHERE user_id = %s AND course_id = %s
        """, (user_id, course_id))

        conn.commit()
        rows_deleted = cur.rowcount
        cur.close()

        if rows_deleted > 0:
            return f"✓ Successfully removed course '{course_code}' from student's records"
        else:
            return f"Course '{course_code}' was not in student's completed courses"

    except Exception as e:
        conn.rollback()
        return f"Error: {str(e)}"


@tool
def add_skill_to_student(email: str, skill_name: str) -> str:
    """
    Add a skill to a student's profile.
    IMPORTANT: This is the ONLY way to add skills to user_skills table.

    Args:
        email: Student's email address
        skill_name: Name of the skill to add

    Returns:
        Success or error message
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Get user_id
        cur.execute("SELECT id FROM profiles WHERE email = %s", (email,))
        profile = cur.fetchone()
        if not profile:
            cur.close()
            return "Student not found"
        user_id = profile['id']

        # Get skill_id
        cur.execute("SELECT id FROM skills WHERE name ILIKE %s", (skill_name,))
        skill = cur.fetchone()
        if not skill:
            cur.close()
            return f"Skill '{skill_name}' not found in the system"
        skill_id = skill['id']

        # Add to user_skills
        cur.execute("""
            INSERT INTO user_skills (user_id, skill_id)
            VALUES (%s, %s)
            ON CONFLICT (user_id, skill_id) DO NOTHING
        """, (user_id, skill_id))

        conn.commit()
        cur.close()

        return f"✓ Successfully added skill '{skill_name}' to student's profile"

    except Exception as e:
        conn.rollback()
        return f"Error: {str(e)}"


@tool
def remove_skill_from_student(email: str, skill_name: str) -> str:
    """
    Remove a skill from a student's profile.
    IMPORTANT: This is the ONLY way to remove skills from user_skills table.

    Args:
        email: Student's email address
        skill_name: Name of the skill to remove

    Returns:
        Success or error message
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Get user_id
        cur.execute("SELECT id FROM profiles WHERE email = %s", (email,))
        profile = cur.fetchone()
        if not profile:
            cur.close()
            return "Student not found"
        user_id = profile['id']

        # Get skill_id
        cur.execute("SELECT id FROM skills WHERE name ILIKE %s", (skill_name,))
        skill = cur.fetchone()
        if not skill:
            cur.close()
            return f"Skill '{skill_name}' not found"
        skill_id = skill['id']

        # Remove from user_skills
        cur.execute("""
            DELETE FROM user_skills
            WHERE user_id = %s AND skill_id = %s
        """, (user_id, skill_id))

        conn.commit()
        rows_deleted = cur.rowcount
        cur.close()

        if rows_deleted > 0:
            return f"✓ Successfully removed skill '{skill_name}' from student's profile"
        else:
            return f"Skill '{skill_name}' was not in student's profile"

    except Exception as e:
        conn.rollback()
        return f"Error: {str(e)}"
    

@tool
def get_major_plan(major_code: str) -> str:
    """
    Fetch a university major's course plan.

    Args:
        major_code: The major plan code (e.g., 'AI_JU', 'CS_JU')

    Returns:
        The full major plan as text, or an error message if not found
    """
    try:
        import importlib.util
        import os

        plans_path = os.path.join(os.path.dirname(__file__), "..", "..", "majors_plans", "plans.py")
        plans_path = os.path.abspath(plans_path)

        spec = importlib.util.spec_from_file_location("plans", plans_path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)

        plan = getattr(mod, major_code, None)
        if plan is None:
            return f"Major plan '{major_code}' not found in plans.py"
        return plan
    except Exception as e:
        return f"Error loading major plan: {str(e)}"



# ==================== Web Scraping Tools ====================

@tool
def search_roadmap(career_path: str) -> str:
    """
    Search for career roadmaps on roadmap.sh.

    Args:
        career_path: The career or technology to search for (e.g., "frontend", "backend", "devops", "python")

    Returns:
        Information about the roadmap and its URL
    """
    try:
        roadmap_slug = career_path.lower().replace(" ", "-")
        url = f"https://roadmap.sh/{roadmap_slug}"

        response = requests.get(url, timeout=10)

        if response.status_code == 404:
            return f"Roadmap for '{career_path}' not found. Visit https://roadmap.sh to explore available roadmaps."

        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        title = soup.find('title')
        title_text = title.get_text() if title else f"{career_path.title()} Roadmap"

        description = soup.find('meta', attrs={'name': 'description'})
        desc_text = description.get('content') if description else "A comprehensive learning path"

        return f"""Found roadmap for {career_path}!

Title: {title_text}
Description: {desc_text}

URL: {url}

This roadmap provides a comprehensive learning path for {career_path}."""

    except Exception as e:
        return f"Error: {str(e)}"


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
    zai_api_key = os.getenv("ZAI_API_KEY")
    database_url = os.getenv("DATABASE_URL")

    if not zai_api_key:
        raise ValueError("ZAI_API_KEY must be set in .env file")
    if not database_url:
        raise ValueError("DATABASE_URL must be set in .env file")

    # Initialize LLM
    llm = ChatOpenAI(
        model="glm-4.7",
        temperature=0.0,
        base_url="https://api.z.ai/api/coding/paas/v4",
        api_key=zai_api_key
    )

    # Create SQLDatabase connection
    print("Connecting to database...")
    db = SQLDatabase.from_uri(database_url)

    # Create SQL toolkit (auto-generates query tools)
    print("Initializing SQLDatabaseToolkit...")
    sql_toolkit = SQLDatabaseToolkit(db=db, llm=llm)
    sql_tools = sql_toolkit.get_tools()

    # Custom write tools
    custom_tools = [
        add_course_to_student,
        remove_course_from_student,
        add_skill_to_student,
        remove_skill_from_student,
        get_major_plan,
    ]

    # Roadmap tools
    roadmap_tools = [
        search_roadmap,
        get_available_roadmaps,
    ]

    # Combine all tools
    all_tools = sql_tools + custom_tools + roadmap_tools

    print(f"\n✓ Loaded {len(all_tools)} tools:")
    print(f"  - {len(sql_tools)} SQL query tools (auto-generated)")
    print(f"  - {len(custom_tools)} custom write tools (user_courses, user_skills)")
    print(f"  - {len(roadmap_tools)} roadmap search tools")

    # Create agent
    agent = create_agent(
        model=llm,
        tools=all_tools,
        system_prompt=SYSTEM_PROMPT,
        checkpointer=MemorySaver()
    )

    return agent


# ==================== Terminal Interface ====================

async def run_agent_terminal():
    """Run the agent in terminal mode for interactive conversations."""
    print("=" * 60)
    print("University Career Assistant AI")
    print("Powered by Z.AI and LangGraph")
    print("SQLDatabaseToolkit + Custom Tools")
    print("=" * 60)
    print("\nType 'exit' or 'quit' to end the conversation.")
    print("Type 'clear' to start a new conversation.\n")

    try:
        agent = await create_university_assistant()
    except Exception as e:
        print(f"\n✗ Failed to initialize agent: {e}")
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
                print("\nThank you for using University Career Assistant AI. Goodbye!")
                if _db_connection and not _db_connection.closed:
                    _db_connection.close()
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
