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
