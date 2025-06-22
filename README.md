# AI Content Studio

AI Content Studio is a fully autonomous multi-agent system that creates, edits, and publishes professional content—all powered by the **Agent Development Kit (ADK)**, **OpenAI**, and **Google Cloud**.

> 🚀 Built for the [ADK Hackathon on Devpost](https://adkhackathon.devpost.com/)  
> 🧠 Category: Content Creation and Generation

---

## 🧠 What It Does

AI Content Studio automates the full content pipeline using five coordinated agents:

- **Content Strategist**: Plans the campaign
- **Research & Data**: Gathers insights from real sources (arXiv, Google News, Wikipedia)
- **Creative Writer**: Uses OpenAI to generate human-like content
- **Quality Control**: Edits for clarity and tone
- **Publisher**: Formats and finalizes the content

All agents run in sequence via an ADK `task.yaml` and are orchestrated with Python + FastAPI.

---

## ⚙️ Built With

- 🧱 Agent Development Kit (Python)
- 🤖 OpenAI (LLM APIs)
- 🧠 FastAPI (Backend)
- 💡 React + Tailwind + Framer Motion (Frontend)
- ☁️ Google Cloud Run (Hosting)
- 🧮 BigQuery (Logging and analytics)

---

## 📦 Reproduction Instructions

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-content-studio.git
cd ai-content-studio

# Set up your Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# ⚠️ Important: Start the backend from the root using PYTHONPATH
PYTHONPATH=. python3 backend/main.py

```

# Start frontend

For the frontend:
cd frontend
npm install
npm run dev

Make sure you’ve added your .env credentials (OpenAI keys, etc.)

🧪 Local Run Instruction

🔐 Environment Setup
Create a .env file in the root directory with:

env
OPENAI_API_KEY=your-openai-key
PROJECT_ID=your-gcp-project-id
GCP_REGION=your-region

📊 Live Demo
🌐 https://ai-content-frontend-48545302633.us-central1.run.app/

🧠 Backend ADK Orchestrator (FastAPI)

💻 Demo Video on YouTube
https://youtu.be/gBUxahyYif8

---

## 🧭 `architecture.md` (Copy as a file)

````markdown
# 🏗️ AI Content Studio – Architecture Overview

AI Content Studio is a full-stack, multi-agent AI system powered by ADK and Google Cloud.

## 🔧 System Components

### 🎯 Frontend (React + Tailwind)

- Live form to input campaign prompts
- Workflow Visualizer (Framer Motion)
- Displays each agent’s output in real-time

### 🚀 Backend (FastAPI)

- Runs multi-agent ADK workflows using `AgentExecutor`
- Each agent defined as a Python class with ADK `agent.yaml`
- Integrated OpenAI for strategy, writing, review

### 🤖 Agents

- **StrategistAgent**
- **ResearchAgent**
- **WriterAgent**
- **QualityControlAgent**
- **PublisherAgent**

### ☁️ Deployment & Services

- **Google Cloud Run**: Backend + frontend hosting
- **BigQuery**: Logs agent outputs and run history
- **OpenAI API**: Reasoning and writing tasks

## ⚙️ Workflow

```plaintext
User Prompt ➜ Frontend Form ➜ /run endpoint ➜ ADK Task DAG ➜ Agent 1 ➜ Agent 2 ➜ ... ➜ Final Output ➜ Render in UI
```
````

---

## ✍️ 3-Minute Blog Post for Devpost / Medium

```markdown
# From Idea to Agent: Building AI Content Studio for the ADK Hackathon

**When we started AI Content Studio, we had one mission:** automate the entire content creation process—just like a real marketing team, but powered by intelligent agents.

We built it for the **Devpost ADK Hackathon**, and it quickly evolved into more than just a project. It became a blueprint for orchestrating collaborative AI agents across the full content lifecycle.

## 💡 Inspiration

We were inspired by how real content teams operate: strategy, research, writing, editing, publishing. We asked: _what if each of those roles could be filled by a specialized AI agent?_ The Agent Development Kit made that idea possible.

## 🛠️ Building with ADK, OpenAI & Google Cloud

We used:

- **ADK** to define and orchestrate multi-agent workflows using `task.yaml`
- **OpenAI** to generate content, interpret data, and polish language
- **BigQuery** to store results and track insights
- **Cloud Run** to deploy a scalable, real-time backend and frontend

Each agent—Strategist, Researcher, Writer, Reviewer, Publisher—was built as a modular service, running together in an orchestrated pipeline. It was exciting to see them collaborate in real-time.

## 🚧 Challenges

We faced issues with environment variables in Cloud Run, OpenAI throttling, and syncing agent outputs across services. But we debugged relentlessly, tested iteratively, and stayed true to our mission.

## 🚀 Final Thoughts

AI Content Studio is now live, deployed, and fully functional. It’s proof that multi-agent AI systems aren't just research—they’re usable, scalable, and real.

This is just the beginning. We’re excited to open source it and inspire more builders.

➡️ [Live App](https://ai-content-frontend-48545302633.us-central1.run.app)  
➡️ [GitHub Repo](https://github.com/YOUR_USERNAME/ai-content-studio)  
➡️ [Built for the ADK Hackathon](https://adkhackathon.devpost.com)

#ADKHackathon #OpenAI #GoogleCloud #AgentDevelopmentKit #ContentCreation #HackathonJourney
```
