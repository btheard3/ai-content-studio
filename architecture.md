# 🏗️ AI Content Studio – Architecture Overview

AI Content Studio is a cloud-native, multi-agent AI platform that automates the full content creation lifecycle. It is powered by the **Agent Development Kit (ADK)**, **OpenAI**, and **Google Cloud**.

```ascii
                        +---------------------+
                        |     User Prompt     |
                        +----------+----------+
                                   |
                         [Frontend: React + Vite]
                                   |
                                   v
                    +-----------------------------+
                    |     FastAPI Backend (ADK)   |
                    +-------------+---------------+
                                  |
              +------------------+-------------------+
              | AgentExecutor loads task.yaml DAG    |
              | Executes agents in defined sequence  |
              +------------------+-------------------+
                                  |
             ┌───────────────────────────────────────────┐
             │           Multi-Agent Pipeline             │
             │  +----------------+    +----------------+  │
             │  | ContentAgent   | -> | ResearchAgent  |  │
             │  +----------------+    +----------------+  │
             │         ↓                     ↓            │
             │  +----------------+    +----------------+  │
             │  | WriterAgent    | -> | QC Agent       |  │
             │  +----------------+    +----------------+  │
             │                     ↓                      │
             │              +-------------+              │
             │              | Publishing   |              │
             │              +-------------+              │
             └───────────────────────────────────────────┘
                                  |
                    +-------------+-------------+
                    |  BigQuery Telemetry Logs  |
                    +---------------------------+
```

🧱 System Components
🔷 Frontend
React + Tailwind

Animated Workflow Visualizer (Framer Motion)

Campaign prompt input + agent output display

🔶 Backend
FastAPI (Python)

/run/<agent> API endpoints

Loads .env, calls AgentExecutor, returns results

🧠 Agents (ADK)
StrategistAgent – Generates campaign outline

ResearchAgent – Collects data from arXiv, Wikipedia, Google News

WriterAgent – Creates content via OpenAI

QualityControlAgent – Improves tone, clarity

PublisherAgent – Finalizes output

🔧 Technologies Used
Python, FastAPI, OpenAI SDK

React, Tailwind, Framer Motion

Agent Development Kit (ADK)

Google Cloud Run, BigQuery

Docker, Markdown, dotenv

🧪 Local Run Instructions
bash
Copy
Edit

# Clone and set up environment

git clone https://github.com/YOUR_USERNAME/ai-content-studio
cd ai-content-studio
pip install -r requirements.txt

# Start backend from project root

PYTHONPATH=. python3 backend/main.py

# Start frontend

cd frontend
npm install
npm run dev
🔐 Environment Setup
Create a .env file in the root directory with:

env
OPENAI_API_KEY=your-openai-key
PROJECT_ID=your-gcp-project-id
GCP_REGION=your-region
