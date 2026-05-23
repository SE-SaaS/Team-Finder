"""One-off migration runner. Reads DATABASE_URL from .env (root) and applies
the SQL file passed on the command line.

Usage:
    python scripts/apply_migration.py supabase/migrations/12_availability_enum.sql
"""
import os
import sys
from pathlib import Path

import psycopg2


def load_env(env_path: Path) -> dict:
    out = {}
    for raw in env_path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: apply_migration.py <path-to-sql-file>", file=sys.stderr)
        return 2

    sql_path = Path(sys.argv[1])
    if not sql_path.is_file():
        print(f"SQL file not found: {sql_path}", file=sys.stderr)
        return 2

    env_path = Path(__file__).resolve().parent.parent / ".env"
    env = load_env(env_path)
    dsn = env.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not found in .env", file=sys.stderr)
        return 2

    sql = sql_path.read_text()
    print(f"Applying: {sql_path.name}")
    print("-" * 60)

    conn = psycopg2.connect(dsn)
    try:
        conn.autocommit = False
        with conn.cursor() as cur:
            cur.execute(sql)
            print(f"Statement executed; rows touched by last statement: {cur.rowcount}")
            cur.execute(
                "SELECT conname FROM pg_constraint "
                "WHERE conrelid = 'profiles'::regclass "
                "AND conname = 'profiles_availability_check'"
            )
            row = cur.fetchone()
            print(
                "CHECK constraint present"
                if row
                else "WARNING: profiles_availability_check not found after run"
            )
            cur.execute(
                "SELECT COUNT(*) FROM profiles WHERE availability IS NOT NULL"
            )
            (non_null,) = cur.fetchone()
            print(f"profiles rows with availability set: {non_null}")
        conn.commit()
        print("-" * 60)
        print("Migration committed.")
        return 0
    except Exception as exc:
        conn.rollback()
        print(f"FAILED, rolled back: {exc}", file=sys.stderr)
        return 1
    finally:
        conn.close()


if __name__ == "__main__":
    sys.exit(main())
