@echo off
echo ============================================
echo Installing AI Agent Dependencies
echo ============================================
echo.

echo Installing Python packages...
echo.

pip install python-dotenv>=1.0.0
pip install requests>=2.31.0
pip install beautifulsoup4>=4.12.0
pip install psycopg2-binary>=2.9.9
pip install langchain>=0.1.0
pip install langchain-openai>=0.0.5
pip install langchain-core>=0.1.0
pip install langchain-community>=0.0.20
pip install langgraph>=0.0.20

echo.
echo ============================================
echo Installation Complete!
echo ============================================
echo.
echo You can now run the AI agent with:
echo python backend/ai_agent/agent.py
echo.
pause
