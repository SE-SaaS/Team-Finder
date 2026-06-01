# Backend (FastAPI + LangGraph) image for Google Cloud Run.
# Build context MUST be the repo root: the agent loads curriculum data
# from ../../data/raw/majors/majors_plans relative to backend/ai_agent/.
#   docker build -t teamfinder-backend .

FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install dependencies first so this layer caches across code changes.
# psycopg2-binary and psycopg[binary] ship manylinux wheels, so no
# system build toolchain (gcc/libpq-dev) is required.
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --upgrade pip && pip install -r backend/requirements.txt

# Application code.
COPY backend/ ./backend/

# Curriculum plans, loaded once at agent startup. The whole directory is
# required: plans.py dynamically imports the sibling *_plan.py files.
COPY data/raw/majors/majors_plans/ ./data/raw/majors/majors_plans/

# Run as a non-root user.
RUN useradd --create-home --uid 10001 appuser \
    && chown -R appuser:appuser /app
USER appuser

# Cloud Run injects PORT (default 8080); app/main.py honors it.
ENV PORT=8080
EXPOSE 8080

CMD ["python", "backend/app/main.py"]
