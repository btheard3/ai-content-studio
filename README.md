# AI Content Studio

🚀 A fully orchestrated multi-agent AI content creation system built with Google Cloud's Agent Development Kit (ADK), OpenAI, and BigQuery.

### 🌐 Live Demo

- Frontend: https://ai-content-frontend-48545302633.us-central1.run.app/
- Backend: https://ai-content-backend-48545302633.us-central1.run.app/

---

## 🧠 Overview

**AI Content Studio** enables users to generate complete, high-quality marketing campaigns using multi-agent orchestration. It combines the power of AI agents, research, tone analysis, creativity, and quality control to generate polished, deployable content — all in one click.

---

## 🧩 Key Features

- ✨ Multi-agent orchestration using **Google's Agent Development Kit**
- 🧠 LLM-enhanced agents for ideation, writing, editing, and publishing
- 🔍 Real-time research from arXiv, Wikipedia, Google News, World Bank, PubMed
- 📊 BigQuery logging for analytics
- 🎯 AI-assisted campaign theme ideation
- 📜 Full creative writing pipeline with tone/style analysis
- ✅ Final content validated via a quality control agent

---

## 🏗 Architecture

User (Browser)
|
v
[Frontend (React + Tailwind)]
|
| /run_workflow (REST)
v
[Cloud Run Backend (FastAPI)]
|
v
[AgentExecutor (ADK)]
|
+--> content_strategist
| |
| +--> OpenAI GPT-4
|
+--> research_data
| |
| +--> arXiv, Wikipedia, Google News
|
+--> creative_writer
| |
| +--> OpenAI GPT-4
|
+--> quality_control
| |
| +--> GPT-4 Scoring
|
+--> publishing_agent
|
+--> UI + BigQuery Log

[BigQuery] <--- Logs & metrics
[Secret Manager] --> OPENAI_API_KEY
Logging]
G --> I[💻 Frontend UI (Vite + Tailwind)]
B -->|🔁 Context Flow| B

---

## ⚙️ Tech Stack

- **Frontend**: Vite + React + Tailwind + Framer Motion
- **Backend**: FastAPI + Google Cloud Run
- **Orchestration**: Google Cloud ADK (Python)
- **LLM**: OpenAI (gpt-4o)
- **External Data**: Wikipedia, arXiv, PubMed, World Bank, Google News
- **Database**: Supabase + SQLite
- **Analytics**: BigQuery

---

## 🛠 How to Run Locally

### 🔧 Prerequisites

- Python 3.9+
- Node.js 18+
- Google Cloud CLI (for deployment)
- `openai` Python SDK + Google Cloud credentials

### 📦 Backend

```bash
cd backend
pip install -r requirements.txt
PYTHONPATH=. python3 main.py


```

cd frontend
npm install
npm run dev
