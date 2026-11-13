# 🐞 Intelligent Bug Diagnosis Platform

<p align="center">
  <strong>AI-Powered Defect Analysis • Historical Bug Retrieval • Intelligent Fix Recommendations</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-blue?logo=python" />
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi" />
  <img src="https://img.shields.io/badge/RAG-Enabled-purple" />
  <img src="https://img.shields.io/badge/Status-In%20Development-orange" />
</p>

---

## ✨ Overview

An intelligent software debugging platform that leverages **Retrieval-Augmented Generation (RAG), semantic search, and specialized AI agents** to analyze software defects.

The platform retrieves relevant historical bug reports, investigates potential root causes, detects duplicate defects, and generates evidence-based fix recommendations.

## 🚀 Key Features

- 📝 Intelligent bug report submission
- 📂 Stack trace and error log analysis
- 🔍 Semantic similarity and duplicate detection
- 🧠 Historical defect knowledge base
- 🤖 Multi-agent diagnosis architecture
- 💡 AI-powered remediation recommendations

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Vector Search | Qdrant |
| Embeddings | Sentence Transformers |
| Task Processing | Celery, Redis |
| AI | LLM API |
| Infrastructure | Docker |

## 🧩 Architecture

The platform follows a modular, agent-oriented RAG architecture with separate ingestion, retrieval, processing, and diagnosis workflows.

## 📁 Project Structure

```text
frontend/        → React application
backend/         → FastAPI services
workers/         → Background processing
knowledge_base/  → RAG ingestion and retrieval
agents/          → Specialized AI agents
orchestration/   → Agent workflow management
docs/            → Project documentation
tests/           → Testing and evaluation
```

## ⚙️ Getting Started

```bash
git clone <your-repository-url>
cd intelligent-bug-diagnosis
```

Start infrastructure:

```bash
docker compose up -d
```

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Refer to the project setup documentation for complete configuration.

## 🗺️ Development Roadmap

- [x] Initial project planning
- [ ] M1.1 — Research & Technical Understanding
- [ ] M1.2 — System Architecture
- [ ] M1.3 — Bug Submission Module
- [ ] M1.4 — Historical Defect Knowledge Base
- [ ] Future — Intelligent Multi-Agent Diagnosis

## 🎯 Vision

To simplify software debugging by connecting historical defect knowledge with intelligent AI-powered diagnosis and remediation assistance.

---

<p align="center">
  <strong>Built with ❤️ for smarter software debugging.</strong>
</p>
