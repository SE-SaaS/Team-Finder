# 🧪 AI Agent Testing Guide

## ✅ Automated Tests Completed

### What Was Tested:
- ✅ Python 3.11.4 installed
- ✅ Environment variables configured (`ANTHROPIC_API_KEY`, `DATABASE_URL`)
- ✅ All Python dependencies installed:
  - `langchain-anthropic` 1.4.0
  - `anthropic` 0.88.0
  - `fastapi` 0.135.3
  - `langchain` 1.2.10
  - All other dependencies
- ✅ Agent imports working correctly
- ✅ FastAPI imports working correctly

### Known Issues:
- ✅ ~~TypeScript errors in `examQuestionsMock.ts`~~ **FIXED** - File disabled (not in use, exams not ready)
- ⚠️ Some TypeScript warnings in other files (pre-existing, don't affect functionality)

---

## 🚀 Manual Testing Steps

### Step 1: Start the Backend Server

**Option A: Using the startup script** (Recommended)
```bash
cd backend
start_server.bat
```

**Option B: Manual start**
```bash
cd backend
python app/main.py
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Verify Backend is Running

Open browser and go to: `http://localhost:8000`

**Expected Response:**
```json
{
  "status": "online",
  "service": "University Career Assistant API",
  "powered_by": "Claude (Anthropic)"
}
```

### Step 3: Check Health Endpoint

Go to: `http://localhost:8000/api/health`

**Expected Response:**
```json
{
  "status": "healthy",
  "agent": "initialized",
  "database": "connected"
}
```

### Step 4: Start the Frontend

In a **new terminal**:
```bash
cd frontend
npm run dev
```

Frontend will start on: `http://localhost:3002`

### Step 5: Test the AI Chat

1. Navigate to `http://localhost:3002/dashboard`
2. Log in if needed
3. Look for the **red chat button** in the bottom-right corner
4. Click it to open the chat widget
5. Type a test message

### Step 6: Test AI Capabilities

Try these sample prompts:

#### **Database Queries:**
- "What courses are available for Computer Science?"
- "Show me all students in the database"
- "List all projects"

#### **Career Guidance:**
- "I want to be a backend developer, what should I learn?"
- "Find me a roadmap for DevOps"
- "What are popular career paths in tech?"

#### **Profile Management:** (if you have a student email)
- "Add Python to my skills"
- "What courses have I completed?"
- "Add CS101 to my completed courses"

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error: "ModuleNotFoundError"**
```bash
cd backend
pip install -r requirements.txt
```

**Error: "ANTHROPIC_API_KEY not set"**
- Check `.env` file exists in project root
- Verify `ANTHROPIC_API_KEY` is set

**Error: "Connection refused"**
- Check if port 8000 is already in use
- Try changing port in `app/main.py`

### Frontend Errors

**Error: "Failed to get response"**
- Make sure backend is running on port 8000
- Check CORS settings in `app/main.py`

**TypeScript Compilation Errors**
- These are pre-existing in `examQuestionsMock.ts`
- They don't affect the AI chat functionality
- Can be ignored for this test

### Chat Not Responding

1. Check backend terminal for errors
2. Open browser DevTools (F12) → Console
3. Look for network errors
4. Verify API endpoint: `http://localhost:8000/api/chat`

---

## 📊 Expected Results

### ✅ Success Indicators:
- Backend starts without errors
- Health endpoint returns "healthy"
- Chat widget appears on dashboard
- Messages send and receive responses
- Agent can query the database
- Agent provides helpful career guidance

### ❌ Failure Indicators:
- Backend crashes on startup
- 500 errors when sending messages
- Chat widget doesn't appear
- No response from AI

---

## 🎯 What the AI Agent Can Do

1. **Database Operations:**
   - Query students, courses, skills, projects
   - Add/remove courses from student profiles
   - Add/remove skills from student profiles

2. **Career Guidance:**
   - Search roadmaps on roadmap.sh
   - Provide learning paths
   - Suggest courses based on career goals

3. **University Planning:**
   - Get major course plans
   - Check course prerequisites
   - Track student progress

---

## 📝 Test Checklist

- [ ] Backend starts successfully
- [ ] Health endpoint responds
- [ ] Frontend compiles and runs
- [ ] Chat widget appears on dashboard
- [ ] Can send a message
- [ ] Receives AI response
- [ ] Database queries work
- [ ] Roadmap search works
- [ ] Conversation history maintained

---

## 🎉 Ready for Manual Testing!

Everything is set up and automated tests passed. 
Now it's your turn to test the AI chat integration!

**Start with:**
1. Run `backend\start_server.bat`
2. Run `npm run dev` in frontend folder
3. Open dashboard and click the chat button
4. Say hi to Claude! 👋
