---
title: "Building an AI Agentic Workflow with LangChain and Sealos"
imageTitle: "AI Agentic Workflow: LangChain & Sealos"
description: "Design and orchestrate an AI-driven agentic workflow using LangChain and Sealos. Learn practical architecture, integrations, and execution patterns for robust automation."
date: 2025-09-01
tags: ["AI", "LangChain", "Sealos", "Automation", "Workflow"]
authors: ["default"]
---

The newest wave of AI applications are more than chatbots. They are agents: systems that can understand goals, plan multi-step tasks, call tools and APIs, consult knowledge bases, and operate reliably in production. This “agentic” paradigm combines reasoning, retrieval, tool use, and orchestration into workflows—unlocking use cases from automated customer support to data operations and incident response.

If you’ve experimented with LangChain to prototype agents, the next challenge is taking them to production. That’s where Sealos, a Kubernetes-native platform, fits in. Sealos makes it straightforward to deploy containerized AI services, manage secrets and domains, scale based on demand, and connect to stateful backends like databases or vector stores—all without you needing to become a cluster expert.

In this article, you’ll learn how to design and implement an agentic workflow with LangChain (including LangGraph for multi-step orchestration) and deploy it reliably on Sealos. We’ll cover the what, why, and how, with practical code snippets and production-minded advice.

## What is an Agentic Workflow?

An agentic workflow is a loop of perception, planning, tool use, and reflection that lets an AI system autonomously move toward a goal. In practice, it blends several capabilities:

- Reasoning: Turning ambiguous user goals into concrete steps.
- Tool use: Calling functions and APIs (search, database queries, calculators, CRMs, etc.).
- Memory and context: Remembering past interactions and grounding answers in a knowledge base (RAG: Retrieval-Augmented Generation).
- Orchestration: Coordinating multiple steps or even multiple specialized agents.
- Guardrails: Validation, constraints, retries, timeouts, and logging to keep the system safe and predictable.

LangChain provides these building blocks in a developer-friendly way. Sealos provides the production substrate—deployment, scaling, secrets, and networking—so your agent can run 24/7 and integrate with your stack.

## Why Agentic Workflows Matter

- From answers to actions: Instead of just text completion, agents can execute tasks (e.g., file reports, schedule meetings, sync tickets).
- Reliability and repeatability: A defined workflow with guardrails outperforms ad-hoc prompt chains, especially under load.
- Cost and latency control: Plan-execute strategies and retrieval limit token usage and external calls.
- Better UX: Grounded, auditable steps increase trust and provide “what happened” traces—great for enterprise users and compliance.

## Architecture Overview

At a high level, an agentic system has:

- LLM backbone: The reasoning engine (e.g., OpenAI, Anthropic, local models).
- Tools: Functions/APIs the agent can call.
- Knowledge store: Vector database or document store for retrieval.
- Orchestrator: State machine/graph that manages steps and decisions.
- API layer: A web service exposing your agent to clients.
- Ops layer: Deployment platform, scaling, secrets, observability.

On Sealos (sealos.io), you package the agent as a containerized web service, configure secrets (like model API keys), attach databases or storage, set up a domain and TLS, and scale replicas as needed.

### Component mapping

| Concern           | LangChain piece                               | Sealos role                                        |
| ----------------- | --------------------------------------------- | -------------------------------------------------- |
| Reasoning         | Chat models (langchain-openai, etc.)          | Secrets for API keys, network egress               |
| Tool use          | Tools API, function-calling agents            | Secure env vars, network policies to external APIs |
| Knowledge (RAG)   | Vector stores (FAISS, Chroma, pgvector, etc.) | Managed DB/storage, volumes, persistent data       |
| Orchestration     | AgentExecutor, LangGraph state machines       | Scaling, health checks, rollouts                   |
| API exposure      | FastAPI/Uvicorn server                        | Domains, TLS/SSL termination                       |
| Ops & reliability | LangSmith tracing (optional), logging         | Central logs, resource quotas, autoscaling         |

## Core Building Blocks in LangChain

- Models: Chat models for reasoning and tool-calling.
- Tools: Typed functions the LLM can invoke. LangChain handles the JSON schema.
- Prompts and output parsers: Structure inputs and validate outputs.
- Retrieval: Split, embed, and index documents, then retrieve chunks for grounding.
- Agents/Orchestration:
  - AgentExecutor with Tool-Calling (function calling).
  - LangGraph for building stateful, multi-step workflows with conditional routing.

## A Minimal Tool-Calling Agent

The following example builds a simple agent with:

- One retrieval tool (backed by a vector store).
- One calculator tool (safe arithmetic).
- A tool-calling model configured with LangChain.

Note: In production, you’ll use a real vector database (e.g., pgvector) and more tools.

```python
# app/agent.py
import os
from typing import List
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.tools import tool
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")  # set this in Sealos secrets/env

# 1) Build a tiny in-memory knowledge base for demo
docs = [
    "Sealos is a Kubernetes-native platform to deploy and scale apps easily.",
    "LangChain helps developers build LLM-powered applications with tools and retrieval.",
    "Agentic workflows combine planning, tool use, and knowledge retrieval."
]
splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=50)
splits = splitter.split_text("\n".join(docs))

embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
vectorstore = FAISS.from_texts(splits, embedding=embeddings)
retriever = vectorstore.as_retriever(k=3)

# 2) Tools
@tool
def retrieve_docs(query: str) -> str:
    """
    Retrieve relevant knowledge snippets for a query.
    Use this when you need grounded information.
    """
    results = retriever.get_relevant_documents(query)
    return "\n\n".join([r.page_content for r in results])

@tool
def calculator(expression: str) -> str:
    """
    Evaluate simple arithmetic expressions, e.g., '12 * 7 + 5'.
    """
    import math  # only safe operations
    allowed = set("0123456789+-*/(). ")
    if not set(expression) <= allowed:
        return "Error: Disallowed characters."
    try:
        return str(eval(expression, {"__builtins__": {}}, {"math": math}))
    except Exception as e:
        return f"Error: {e}"

tools = [retrieve_docs, calculator]

# 3) Model and prompt
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=OPENAI_API_KEY)

system = """You are a helpful AI agent.
- Use tools when they can improve accuracy.
- Prefer 'retrieve_docs' for factual questions about Sealos or LangChain.
- Show brief reasoning when helpful, but keep answers concise for users.
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system),
    ("human", "{input}")
])

# 4) Build the agent with tool-calling
agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

if __name__ == "__main__":
    question = "What is Sealos and why is it useful for deploying LangChain agents?"
    print(agent_executor.invoke({"input": question})["output"])
```

Highlights:

- Tools are just Python functions with the @tool decorator; LangChain infers JSON schemas so the model can call them.
- We used FAISS for local retrieval. For production, switch to a persistent store (see the Sealos section).
- The agent chooses when to invoke tools based on the prompt and model capabilities.

## Orchestrating Multi-Step Workflows with LangGraph

For more complex tasks, a single model call isn’t enough. LangGraph helps you build a small state machine (graph) that can plan, act, and loop until the goal is met or a limit is reached.

Below is a compact plan–execute pattern:

- Planner: Breaks a user goal into steps.
- Executor: Uses the tool-calling agent from above to execute steps iteratively.
- Controller: Decides when to stop.

```python
# app/graph.py
from typing import TypedDict, List
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.graph import StateGraph, END

# Reuse agent_executor from agent.py
from .agent import agent_executor, OPENAI_API_KEY
from pydantic import BaseModel, Field

class Plan(BaseModel):
    steps: List[str] = Field(..., description="Ordered list of steps to accomplish the goal")

class GraphState(TypedDict):
    goal: str
    plan: List[str]
    cursor: int
    results: List[str]

planner_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=OPENAI_API_KEY)

def plan_node(state: GraphState) -> GraphState:
    prompt = f"Create a concise plan with 1-5 steps for the goal:\n\n{state['goal']}\n"
    # Ask the model to produce a JSON plan
    plan_json = planner_llm.with_structured_output(Plan).invoke([HumanMessage(content=prompt)])
    return {**state, "plan": plan_json.steps, "cursor": 0, "results": []}

def execute_step(state: GraphState) -> GraphState:
    step = state["plan"][state["cursor"]]
    output = agent_executor.invoke({"input": f"Step: {step}. Goal: {state['goal']}."})["output"]
    state["results"].append(output)
    state["cursor"] += 1
    return state

def should_continue(state: GraphState) -> str:
    if state["cursor"] >= len(state["plan"]):
        return END
    return "execute"

# Assemble the graph
graph = StateGraph(GraphState)
graph.add_node("plan", plan_node)
graph.add_node("execute", execute_step)
graph.set_entry_point("plan")
graph.add_edge("plan", "execute")
graph.add_conditional_edges("execute", should_continue, {END: END, "execute": "execute"})

workflow = graph.compile()

if __name__ == "__main__":
    initial = {"goal": "Summarize benefits of deploying an AI agent on Sealos and give one example."}
    result = workflow.invoke(initial)
    print(result["results"])
```

This pattern gives you:

- Deterministic control over steps and termination.
- An audit trail of what happened at each step.
- A place to add guardrails: timeouts, retries, rate limiting, or policy checks between nodes.

## Adding Retrieval-Augmented Generation (RAG)

RAG reduces hallucinations by grounding answers in your data. In development, FAISS or Chroma works fine. In production, choose a persistent store (e.g., Postgres with pgvector, or a dedicated vector DB). The workflow:

1. Indexing: Split documents, embed, and write vectors to storage.
2. Retrieval: For each question, find top-k chunks and feed them to the agent/tool.

A simple indexing script:

```python
# scripts/index_docs.py
import os, glob
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

def build_faiss_index(data_dir="data", index_path="faiss_index"):
    files = glob.glob(f"{data_dir}/*.txt")
    texts = []
    for fp in files:
        with open(fp, "r", encoding="utf-8") as f:
            texts.append(f.read())
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120)
    docs = splitter.create_documents(texts)
    vs = FAISS.from_documents(docs, OpenAIEmbeddings(api_key=OPENAI_API_KEY))
    vs.save_local(index_path)

if __name__ == "__main__":
    build_faiss_index()
```

Swap FAISS for a production vector store when you deploy so your index survives restarts and scales horizontally.

## Turning Your Agent into an API

Wrap the agent in a small web server. FastAPI is a common choice.

```python
# app/server.py
import os
from fastapi import FastAPI
from pydantic import BaseModel
from .agent import agent_executor

app = FastAPI(title="Agent API")

class Query(BaseModel):
    input: str

@app.post("/chat")
def chat(q: Query):
    result = agent_executor.invoke({"input": q.input})
    return {"output": result["output"]}
```

You now have a single-process service ready to containerize.

## Deploying and Scaling on Sealos

Sealos is a Kubernetes-native platform designed to make it easy to deploy and operate cloud applications. For agentic systems, you get:

- Simple container deployment and rollouts.
- Environment variables and secret management for API keys.
- Domains and TLS to expose your service securely.
- Access to storage and databases for RAG indexes.
- Horizontal scaling to handle traffic spikes.

Visit sealos.io to learn more and create an account or bootstrap your own cluster.

### Containerize your service

Create a Dockerfile:

```dockerfile
# Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies
RUN pip install --no-cache-dir \
    fastapi uvicorn \
    langchain langchain-openai langchain-community langgraph \
    faiss-cpu pydantic

WORKDIR /app
COPY app /app

EXPOSE 8000
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and push to your container registry:

- docker build -t your-registry/agent-api:latest .
- docker push your-registry/agent-api:latest

Tip: Use a minimal base image and pin versions for reproducible builds. If you rely on system libraries (e.g., for GPU inference), add them explicitly.

### Provision data backends

For RAG and stateful needs:

- Use a persistent vector store. Depending on your stack, you might:
  - Connect to a managed Postgres with pgvector.
  - Deploy a dedicated vector DB.
  - Attach a persistent volume for FAISS (less ideal for scale).
- Install or connect to a cache (e.g., Redis) if you need shared memory, rate limiting, or job queues.

Sealos simplifies attaching storage and configuring environment variables for connection strings. Prefer managed services or stateful apps that survive restarts and support backups.

### Configure your app on Sealos

- Create a new application and point it to your container image.
- Set environment variables:
  - OPENAI_API_KEY or your chosen model provider key.
  - DB/Vector store connection strings (if applicable).
- Networking:
  - Assign a public domain and enable TLS.
  - Restrict inbound/outbound traffic if needed (e.g., to specific APIs).
- Scaling:
  - Start with 1–2 replicas.
  - Configure autoscaling based on CPU/memory or custom metrics.
- Observability:
  - Review logs for the pod(s).
  - Add request metrics at your FastAPI layer if needed.

Because Sealos is Kubernetes-native, you can also:

- Run background jobs (e.g., indexer) on a schedule.
- Use separate deployments for ingest/index and for serving chat to keep pods lean.
- Perform zero-downtime rollouts with health checks and readiness probes.

### Secrets and keys

Never bake keys into images. In Sealos:

- Store keys as secrets and expose them as environment variables.
- Rotate keys periodically.
- Consider per-environment keys (dev/staging/prod).

### CI/CD

Automate builds and deployments:

- GitHub Actions or similar to build/push images on git tags.
- Deploy to Sealos by updating the image tag and triggering a rollout.
- Keep configuration (env vars, secrets, scaling) in environment-specific manifests or the Sealos console.

## Practical Applications

- Customer support copilot:

  - Tools: CRM API, ticketing system, knowledge base retriever.
  - Workflow: Classify intent, retrieve relevant policies, draft a response, optionally execute a refund workflow with human-in-the-loop.

- Data operations agent:

  - Tools: Warehouse (SQL), dashboards API, alerting service.
  - Workflow: Investigate a metric regression, pull top queries, summarize anomalies, notify channel with a report.

- Incident responder:

  - Tools: Pager, runbook retrieval, Kubernetes API, log search.
  - Workflow: Detect incident, retrieve playbook, run safe diagnostic commands, propose mitigation steps.

- Marketing automation:

  - Tools: Content library, calendar API, SEO analytics.
  - Workflow: Plan weekly content, draft posts grounded in library, schedule with approvals.

- Internal knowledge assistant:
  - Tools: Vectorized company docs, meeting transcripts.
  - Workflow: Answer employee questions with citations, escalate when low confidence.

## Best Practices and Pitfalls

- Guard tool boundaries:

  - Validate tool inputs (schemas, regex).
  - Enforce timeouts and retries.
  - Sanitize anything that executes (e.g., calculations, shell-like actions).

- Control context size:

  - Use chunking and a retriever that prioritizes diverse, relevant passages.
  - Apply compression or summarization when passing many chunks to the model.

- Determinism vs. creativity:

  - Set temperature low for planning/execution.
  - If you need creative content, confine higher temperature to a dedicated generation step after facts are gathered.

- Observability:

  - Log steps, tool calls, and retrieved documents.
  - Consider tracing with tools like LangSmith for debugging and evaluation during development.
  - In production, sample traces to balance cost and visibility.

- Cost and latency:

  - Cache embeddings and retrieval results for frequent queries.
  - Use a smaller, faster model for classification/planning and a larger model for final answers (“router” pattern).
  - Batch embedding jobs and pre-index offline.

- Safety and policy:
  - Add a policy check node in LangGraph for sensitive actions (e.g., payments, data exports).
  - Require human approval for high-impact steps.

## Evolving the Architecture

As usage grows:

- Split services:
  - Indexing worker(s) for document ingest.
  - Serving API pods for chat/agent execution.
  - Callback queue worker for long-running tool actions.
- Add a message bus or task queue if tools involve slow operations (email, ETL).
- Adopt a persistent memory layer for conversations (e.g., storing message histories keyed by session IDs).
- Multi-agent setups:
  - Specialized agents for retrieval, coding, and external systems, coordinated by a small controller graph.

Sealos helps by letting you deploy these as separate apps with shared networking and secrets, scale each independently, and keep the whole system manageable.

## Troubleshooting

- The agent hallucinates tools or outputs unstructured text:

  - Use function/tool-calling models and verify tool schemas.
  - Add a structured output parser for the final answer when needed.

- Retrieval is low quality:

  - Improve chunking (overlap, semantic chunkers).
  - Use better embeddings and tune k value.
  - De-duplicate documents and enrich metadata.

- Timeouts:

  - Increase server timeouts or move long-running tasks off the request path to a worker and return a job ID.

- Cold starts:
  - Keep a minimum number of warm replicas.
  - Lazy-load heavy resources and share across requests where possible.

## Example: From Local Dev to Sealos

1. Develop locally

- Run your FastAPI server: uvicorn app.server:app --reload
- Test /chat with curl or a lightweight UI.
- Add sample documents and test retrieval.

2. Prepare production

- Switch FAISS to a persistent vector store.
- Add env var configuration for model keys and DB connections.
- Add health endpoints (/healthz) and timeouts.

3. Containerize and push

- docker build -t your-registry/agent-api:1.0.0 .
- docker push your-registry/agent-api:1.0.0

4. Deploy on Sealos

- Create an app with image your-registry/agent-api:1.0.0
- Set OPENAI_API_KEY in secrets.
- Add DB connection env var.
- Assign a custom domain and enable TLS.
- Scale to 2 replicas for HA.

5. Observe and iterate

- Check logs for tool errors and retrieval misses.
- Add caching if requests concentrate on a few topics.
- Create scheduled jobs for re-indexing documents.

For Sealos-specific instructions and capabilities, see sealos.io and its documentation. The platform streamlines these steps while staying close to Kubernetes primitives.

## Security Considerations

- Principle of least privilege:

  - Limit outbound network access from your agent containers to only the APIs they need.
  - Scope API tokens narrowly (read-only where possible).

- Data handling:

  - If you send sensitive data to LLM providers, ensure contractual safeguards and encryption in transit and at rest.
  - Redact PII before sending to third-party APIs when feasible.

- Validation:
  - Validate model outputs that drive actions, especially when modifying external systems.
  - Combine automated checks and human approvals for critical workflows.

## Summary and Next Steps

Agentic workflows turn LLMs into practical, reliable systems that can plan, use tools, retrieve knowledge, and act. LangChain provides composable primitives—tools, retrieval, and orchestration—while LangGraph gives you a clear way to model multi-step behavior with guardrails. To serve users, you then need a robust platform to deploy and scale these agents.

Sealos offers a Kubernetes-native path to production: ship your agent as a containerized API, attach the right storage and databases, secure your keys, and scale replicas as demand grows. Combined, LangChain and Sealos let you move from a notebook prototype to a resilient AI service.

Where to go from here:

- Expand your toolset: connect CRMs, ticketing systems, data warehouses.
- Upgrade RAG: adopt a persistent vector database and build a clean ingestion pipeline.
- Add LangGraph nodes for policy checks, retries, and human-in-the-loop approvals.
- Deploy on Sealos, monitor usage, and iteratively improve.

Build your first agent locally, wrap it behind a simple API, and deploy it on Sealos. With a clear architecture and the right platform, you’ll ship AI that not only talks—but gets work done.
