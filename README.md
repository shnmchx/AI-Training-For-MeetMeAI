# Meet Me AI — Agent Training & Runtime

This repository contains the **AI training, orchestration, and runtime layer** for **Meet Me AI**.

It is **not** the full SaaS application.
This repo focuses exclusively on how **role-based AI agents are defined, executed, and evaluated** using multiple foundation models (GPT, Gemini, and others).

The goal is to build **deterministic, auditable, session-based AI reasoning**, not free-form chat.

---

## Scope of This Repository

This repository is responsible for:

* Defining **AI Agent configurations** (role, behavior, constraints)
* Executing agents inside **isolated meeting sessions**
* Orchestrating **multiple AI models** (GPT, Gemini, future models)
* Producing **structured, deterministic outputs**
* Supporting **AI training, tuning, and evaluation workflows**

Out of scope:

* UI / frontend
* Billing
* Authentication
* Multi-user collaboration
* General chatbot features

---

## Core Concept

### Agent ≠ Prompt

An **Agent** is a persistent, versioned instruction object.

It defines:

* Role & expertise
* Behavioral rules
* Reasoning style
* Scope & hard constraints
* Output contract (required structure)

Agents do nothing by default.
They are only executed inside a meeting runtime.

---

### Meeting ≠ Chat

A **Meeting** is an isolated execution container.

Properties:

* 1 user ↔ 1 agent
* Fresh context window per session
* No cross-session memory bleed
* Fully traceable execution

Think of a meeting as:

> a sandboxed reasoning process, not a conversation log.

---

### Artifact-Driven Output

Every meeting produces structured artifacts:

* Transcript (raw interaction log)
* Summary (contract-based structured output)
* Model metadata (model used, version, parameters)
* Execution trace (for training & audit)

These artifacts are the **ground truth** for:

* Evaluation
* Retraining
* Prompt / instruction refinement

---

## Multi-Model Strategy

Meet Me AI is **model-agnostic by design**.

Supported / planned models:

* OpenAI GPT models
* Google Gemini
* Other LLM providers (future)

The system does **not** hard-code behavior to one model.

Instead:

* Agents define *what* to think
* Model adapters define *how* thinking is executed

This allows:

* Model comparison
* Fallback strategies
* Cost vs accuracy trade-offs
* Training against multiple reasoning styles

---

## Technology Stack

* **Language**: TypeScript
* **Runtime**: Node.js
* **AI Models**:

  * OpenAI GPT
  * Google Gemini
  * Pluggable model adapters
* **Design Style**:

  * Configuration-driven
  * Deterministic execution
  * Versioned instructions

---

## High-Level Architecture

```
Agent Definition (versioned)
        ↓
Meeting Runtime (isolated)
        ↓
Model Orchestrator
   ├── GPT Adapter
   ├── Gemini Adapter
   └── Other Model Adapters
        ↓
Structured Artifacts
```

No shared memory.
No silent state mutation.
No hidden prompt chaining.

---

## Repository Structure (Proposed)

```
/src
  /agents
    agent.schema.ts        # Agent definition & validation
    agent.versioning.ts

  /meetings
    meeting.runtime.ts     # Session isolation & lifecycle
    meeting.context.ts

  /models
    gpt.adapter.ts
    gemini.adapter.ts
    model.interface.ts

  /orchestration
    execution.engine.ts
    output.contract.ts

  /artifacts
    transcript.ts
    summary.ts
    execution.trace.ts

  /training
    evaluation.ts
    prompt.tuning.ts
    model.benchmark.ts

/docs
  agent-design.md
  meeting-lifecycle.md
  multi-model-strategy.md
```

---

## Design Principles

* **Deterministic over creative**
* **Explicit over implicit**
* **Versioned over mutable**
* **Artifacts over answers**
* **Training-ready by default**

If a result cannot be replayed, audited, or evaluated, it is considered a bug.

---

## Intended Use

This repository is intended for:

* AI agent training
* Prompt & instruction tuning
* Multi-model evaluation
* Internal AI system development

It is **not** intended as:

* A public chatbot framework
* A plug-and-play AI app
* A general LLM playground


