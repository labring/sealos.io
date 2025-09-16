---
title: "How to Build and Deploy a RAG Pipeline with Llama 3 and Milvus on Sealos"
imageTitle: "RAG Pipeline with Llama 3 & Milvus on Sealos"
description: "A practical guide to building and deploying a Retrieval-Augmented Generation (RAG) pipeline using Llama 3 and Milvus on Sealos. Learn setup, indexing, and deployment best practices."
date: 2025-09-04
tags:
  ["RAG", "Llama-3", "Milvus", "Sealos", "AI Deployment", "Vector Databases"]
authors: ["default"]
---

If you’ve experimented with large language models (LLMs), you’ve likely encountered hallucinations and outdated answers. Retrieval-Augmented Generation (RAG) fixes that by grounding an LLM’s output in your own data. In this guide, you’ll learn how to build and deploy a production-ready RAG pipeline using Llama 3 for generation, Milvus for vector search, and Sealos for seamless cloud deployment. We’ll walk through architecture, deployment, code, and best practices—so you can go from zero to working system quickly and safely.

## What You’ll Build

- A scalable RAG service that:
  - Ingests and indexes your documents
  - Retrieves relevant chunks via Milvus vector search
  - Generates final, grounded answers using Llama 3
- Deployed on Sealos, a Kubernetes-powered cloud operating system that simplifies app, database, storage, and domain management

By the end, you’ll have a working FastAPI service you can call with a question and get accurate, cited responses backed by your data.

## Why RAG, Why Now?

- Accuracy and compliance: RAG reduces hallucinations by injecting facts from your domain-specific corpus.
- Cost and control: You can use open-source models (like Llama 3) and host your own data stack with Milvus.
- Speed to production: Platforms like Sealos make it easy to assemble cloud-native pieces—vector DB, GPU inference, API, and scaling—without wrestling with raw Kubernetes.

## Core Concepts: How RAG Works

At a high level:

1. You index your knowledge base into a vector store (Milvus):

   - Split documents into chunks
   - Create vector embeddings for each chunk
   - Insert vectors and metadata into Milvus

2. At query time:
   - Embed the user’s question
   - Search Milvus for the top-k similar chunks
   - Build a prompt that includes the question and retrieved context
   - Ask an LLM (Llama 3) to answer based on this context

This flow grounds the LLM, boosting factual reliability and controllability.

## Architecture Overview

We’ll use the following components:

- Llama 3 (Generation): Meta’s Llama 3 8B Instruct model, served via vLLM (OpenAI-compatible API)
- Embeddings: A lightweight open-source embedding model (e.g., BAAI/bge-small-en-v1.5)
- Milvus: A high-performance vector database for similarity search
- FastAPI: A simple API for your RAG service
- Sealos: To deploy and manage everything with minimal ops friction

Text diagram:

- Users → FastAPI /ask → Embedding model → Milvus → Retrieve top-k chunks → Prompt Builder → Llama 3 (vLLM) → Answer

On Sealos:

- Milvus runs as an app with persistent storage
- vLLM runs on GPU nodes
- FastAPI runs as a standard web app
- Object storage holds your documents (optional)
- Sealos provides DNS, TLS, secrets, and scaling

Learn more about Sealos at https://sealos.io.

## Prerequisites

- A Sealos account and workspace
- Access to GPU nodes for Llama 3 inference (or use a CPU-friendly generation model for testing)
- A Hugging Face token with access to Llama 3 (accept the license on the model page)
- Basic Docker and Python familiarity

Local development requirements:

- Python 3.10+
- pip install packages (listed below)
- A set of documents to index (markdown, PDFs converted to text, HTML, etc.)

## Step 1: Provision Your Infrastructure on Sealos

Sealos streamlines app deployment, storage, secrets, and networking. You can use the web console (App Launchpad) or CLI.

### 1.1 Milvus (Vector Database)

Option A: App Launchpad (recommended)

- In the Sealos console, open the App Store or Launchpad.
- Search for Milvus (standalone) and deploy with a persistent volume (e.g., 50–200 GB depending on your corpus).
- Note the service endpoint (e.g., milvus:19530 within the cluster, or assign an external address if needed).

Option B: Helm (if you prefer)

- Create a dedicated namespace, set storage class, and install Milvus standalone via the official Helm chart.
- Expose it internally via ClusterIP and deploy your RAG app in the same namespace for low-latency access.

Environment variable you’ll use in your app:

- MILVUS_URI=milvus:19530
- MILVUS_DB=default

### 1.2 Llama 3 with vLLM

We’ll serve Llama 3 8B Instruct via vLLM’s OpenAI-compatible server.

- Ensure you have GPU nodes in your Sealos cluster (NVIDIA drivers and runtime configured).
- Accept the Llama 3 license on Hugging Face, then set a secret HUGGING_FACE_HUB_TOKEN in Sealos.

Run the vLLM container (App Launchpad or YAML):

- Image: vllm/vllm-openai:latest
- Command example:
  - --model meta-llama/Meta-Llama-3-8B-Instruct
  - --dtype auto
  - --max-model-len 8192
  - --tensor-parallel-size 1 (or more if multi-GPU)
- Ports: 8000
- Env: HUGGING_FACE_HUB_TOKEN
- GPU: request appropriate GPU resources (e.g., 1x A10 or A100)
- Expose internally as vllm:8000 or assign a domain via Sealos Gateway if you want external access

The server exposes OpenAI-compatible REST endpoints at /v1/chat/completions.

### 1.3 Object Storage (Optional)

If your documents are not yet in your repo, use Sealos Object Storage (S3-compatible) to upload your corpus. You can mount from the API or indexing job.

### 1.4 Secrets and Config

In Sealos, create environment variables and secrets for your apps:

- VLLM_BASE_URL=http://vllm:8000/v1
- VLLM_API_KEY=dummy (vLLM allows a dummy key by default; set one for consistency)
- MILVUS_URI=milvus:19530
- MILVUS_DB=default

## Step 2: Data Preparation and Indexing

You’ll chunk documents, build embeddings, and insert vectors into Milvus. For simplicity, we’ll use the BAAI/bge-small-en-v1.5 embedding model (384-dimensional), which is fast and works well for many English corpora.

Install dependencies locally:

- pip install sentence-transformers pymilvus fastapi uvicorn openai numpy tqdm

If you prefer a single file for indexing and testing, use the example below.

### 2.1 Choose Chunking Strategy

General guidance:

- Chunk size: 300–800 tokens (or ~1,000–2,000 characters)
- Overlap: 10–20% to preserve context across boundaries
- Keep metadata (source URL, title, section) for filtering and citations

### 2.2 Milvus Collection Schema

We’ll store:

- id: VarChar primary key
- embedding: FloatVector (dim=384)
- text: the chunk text
- source: where it came from
- doc_id: group chunks by document
- chunk_id: numeric index within the doc

We’ll use cosine similarity. In Milvus, set metric_type=IP and L2-normalize embeddings to approximate cosine similarity.

### 2.3 Indexing Script

Example: index.py

```python
import os
import uuid
import numpy as np
from tqdm import tqdm
from typing import List, Dict

from sentence_transformers import SentenceTransformer
from pymilvus import (
    connections, FieldSchema, CollectionSchema, DataType, Collection, utility
)

# Env
MILVUS_URI = os.environ.get("MILVUS_URI", "localhost:19530")
MILVUS_DB = os.environ.get("MILVUS_DB", "default")

# 1) Connect
connections.connect(alias="default", uri=MILVUS_URI)

# 2) Define schema
COLLECTION_NAME = "rag_chunks"
EMBED_DIM = 384  # bge-small-en-v1.5

fields = [
    FieldSchema(name="id", dtype=DataType.VARCHAR, is_primary=True, max_length=64),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=EMBED_DIM),
    FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=65535),
    FieldSchema(name="source", dtype=DataType.VARCHAR, max_length=1024),
    FieldSchema(name="doc_id", dtype=DataType.VARCHAR, max_length=256),
    FieldSchema(name="chunk_id", dtype=DataType.INT64),
]
schema = CollectionSchema(fields=fields, description="RAG chunks with embeddings")

# 3) Create collection if not exists
if not utility.has_collection(COLLECTION_NAME):
    collection = Collection(name=COLLECTION_NAME, schema=schema)
    # Create index for vector field
    index_params = {
        "index_type": "HNSW",
        "metric_type": "IP",
        "params": {"M": 8, "efConstruction": 64}
    }
    collection.create_index(field_name="embedding", index_params=index_params)
else:
    collection = Collection(name=COLLECTION_NAME)

# 4) Load embedding model
embedder = SentenceTransformer("BAAI/bge-small-en-v1.5")

def l2_normalize(vecs: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(vecs, axis=1, keepdims=True) + 1e-12
    return vecs / norms

# 5) Simple chunker
def chunk_text(text: str, max_chars=1200, overlap=200) -> List[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = min(len(text), start + max_chars)
        chunks.append(text[start:end])
        start = end - overlap
        if start < 0:
            start = 0
        if start >= len(text):
            break
    return chunks

# 6) Load your documents (replace with actual loading logic)
def load_documents() -> List[Dict]:
    # Example documents; replace this with your loader (S3, files, etc.)
    docs = [
        {"doc_id": "doc-001", "source": "kb/article-1.md", "text": "Your long text here..."},
        {"doc_id": "doc-002", "source": "kb/article-2.md", "text": "Another long text..."},
    ]
    return docs

# 7) Build and insert vectors
def index_documents(docs: List[Dict]):
    ids, vectors, texts, sources, doc_ids, chunk_ids = [], [], [], [], [], []
    for d in tqdm(docs, desc="Indexing docs"):
        chunks = chunk_text(d["text"])
        embeddings = embedder.encode(chunks, batch_size=64, normalize_embeddings=True)
        # If normalize_embeddings isn't available, call l2_normalize(np.array(embeddings))
        for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
            ids.append(str(uuid.uuid4())[:32])
            vectors.append(emb.tolist())
            texts.append(chunk)
            sources.append(d["source"])
            doc_ids.append(d["doc_id"])
            chunk_ids.append(i)

    mr = collection.insert([ids, vectors, texts, sources, doc_ids, chunk_ids])
    collection.flush()
    collection.load()
    print(f"Inserted {len(ids)} chunks into collection {COLLECTION_NAME}")

if __name__ == "__main__":
    docs = load_documents()
    index_documents(docs)
```

Notes:

- For real projects, replace load_documents() with your own loader (filesystem, Git repo, S3 bucket in Sealos).
- For large datasets, consider batch insertion and running this as a Sealos CronJob.

## Step 3: Retrieval and Generation Service (FastAPI)

We’ll build a minimal FastAPI app to:

- Receive a question
- Embed it
- Search Milvus
- Compose a system/user prompt
- Call Llama 3 via vLLM
- Return a grounded answer with sources

### 3.1 FastAPI Service

Create app.py:

```python
import os
import numpy as np
from typing import List, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from pymilvus import connections, Collection
from openai import OpenAI

MILVUS_URI = os.environ.get("MILVUS_URI", "localhost:19530")
MILVUS_DB = os.environ.get("MILVUS_DB", "default")
COLLECTION_NAME = os.environ.get("COLLECTION_NAME", "rag_chunks")
EMBED_MODEL_NAME = os.environ.get("EMBED_MODEL_NAME", "BAAI/bge-small-en-v1.5")

VLLM_BASE_URL = os.environ.get("VLLM_BASE_URL", "http://localhost:8000/v1")
VLLM_API_KEY = os.environ.get("VLLM_API_KEY", "dummy")
LLM_MODEL = os.environ.get("LLM_MODEL", "meta-llama/Meta-Llama-3-8B-Instruct")

app = FastAPI(title="RAG with Llama 3 + Milvus")

# Initialize clients
connections.connect(alias="default", uri=MILVUS_URI)
collection = Collection(COLLECTION_NAME)
collection.load()

embedder = SentenceTransformer(EMBED_MODEL_NAME)
client = OpenAI(base_url=VLLM_BASE_URL, api_key=VLLM_API_KEY)

class AskRequest(BaseModel):
    question: str
    top_k: int = 5

def search_similar_chunks(query: str, top_k: int = 5) -> List[Dict]:
    qvec = embedder.encode([query], normalize_embeddings=True)[0].tolist()
    search_params = {"metric_type": "IP", "params": {"ef": 64}}
    results = collection.search(
        data=[qvec],
        anns_field="embedding",
        param=search_params,
        limit=top_k,
        output_fields=["text", "source", "doc_id", "chunk_id"]
    )
    hits = []
    for hit in results[0]:
        hits.append({
            "score": float(hit.distance),
            "text": hit.entity.get("text"),
            "source": hit.entity.get("source"),
            "doc_id": hit.entity.get("doc_id"),
            "chunk_id": int(hit.entity.get("chunk_id"))
        })
    return hits

def build_prompt(question: str, contexts: List[Dict]) -> List[Dict]:
    context_block = "\n\n".join([f"[{i+1}] {c['text']}" for i, c in enumerate(contexts)])
    sources_block = "\n".join([f"[{i+1}] {c['source']}" for i, c in enumerate(contexts)])
    system = (
        "You are a helpful assistant. Use ONLY the provided context to answer. "
        "If the answer is not in the context, say you don't know. Cite sources by index."
    )
    user = (
        f"Question: {question}\n\n"
        f"Context:\n{context_block}\n\n"
        f"Instructions:\n- Answer concisely.\n- Cite sources like [1], [2].\n"
        f"- If unsure, say you don't know.\n\n"
        f"Sources:\n{sources_block}"
    )
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user}
    ]

@app.post("/ask")
def ask(req: AskRequest):
    if not req.question.strip():
        raise HTTPException(400, "Question cannot be empty")
    contexts = search_similar_chunks(req.question, top_k=req.top_k)
    messages = build_prompt(req.question, contexts)
    completion = client.chat.completions.create(
        model=LLM_MODEL,
        messages=messages,
        temperature=0.2,
        max_tokens=800
    )
    answer = completion.choices[0].message.content
    return {"answer": answer, "contexts": contexts}
```

Test locally:

- Start Milvus locally or port-forward to your Sealos Milvus
- Ensure vLLM is reachable at VLLM_BASE_URL
- uvicorn app:app --host 0.0.0.0 --port 8080

Example request:

- curl -X POST http://localhost:8080/ask -H "Content-Type: application/json" -d '{"question":"What does article-1 say about X?"}'

### 3.2 Containerize the Service

Dockerfile:

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY app.py /app/app.py

RUN pip install --no-cache-dir fastapi uvicorn sentence-transformers pymilvus openai numpy

EXPOSE 8080
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
```

Build and push:

- docker build -t your-registry/rag-llama3:latest .
- docker push your-registry/rag-llama3:latest

You can use Sealos Image Hub or your own registry, then deploy via the Sealos console.

## Step 4: Deploy on Sealos

You can deploy the FastAPI container via the Sealos Launchpad UI:

- Create new app
- Image: your-registry/rag-llama3:latest
- Ports: 8080
- Env:
  - MILVUS_URI=milvus:19530
  - MILVUS_DB=default
  - COLLECTION_NAME=rag_chunks
  - EMBED_MODEL_NAME=BAAI/bge-small-en-v1.5
  - VLLM_BASE_URL=http://vllm:8000/v1
  - VLLM_API_KEY=dummy
  - LLM_MODEL=meta-llama/Meta-Llama-3-8B-Instruct
- Resources: CPU/memory requests (e.g., 0.5 CPU, 1–2 GB RAM)

Optionally, expose the service with a public domain:

- Use Sealos Gateway to attach a domain and enable HTTPS
- Configure an Ingress if using YAML flows

Kubernetes YAML (if you prefer IaC):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rag-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: rag-api
  template:
    metadata:
      labels:
        app: rag-api
    spec:
      containers:
        - name: rag-api
          image: your-registry/rag-llama3:latest
          ports:
            - containerPort: 8080
          env:
            - name: MILVUS_URI
              value: "milvus:19530"
            - name: MILVUS_DB
              value: "default"
            - name: COLLECTION_NAME
              value: "rag_chunks"
            - name: EMBED_MODEL_NAME
              value: "BAAI/bge-small-en-v1.5"
            - name: VLLM_BASE_URL
              value: "http://vllm:8000/v1"
            - name: VLLM_API_KEY
              value: "dummy"
            - name: LLM_MODEL
              value: "meta-llama/Meta-Llama-3-8B-Instruct"
          resources:
            requests:
              cpu: "500m"
              memory: "1Gi"
---
apiVersion: v1
kind: Service
metadata:
  name: rag-api
spec:
  selector:
    app: rag-api
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP
      name: http
  type: ClusterIP
```

Then add an Ingress (or use Sealos domain management) to expose rag-api externally.

## Step 5: Test the End-to-End Flow

- Verify Milvus collection exists and loaded: check pymilvus or the Milvus dashboard
- Verify vLLM is serving Llama 3: curl http://vllm:8000/v1/models
- Verify RAG API:
  - curl -X POST https://your-domain/ask -H "Content-Type: application/json" -d '{"question":"What is in article-1?"}'
  - Confirm the response includes an answer and contexts with source citations

If you see empty contexts:

- Check embeddings and ensure normalize_embeddings=True
- Ensure the collection index exists and collection.load() has been called
- Confirm MILVUS_URI is reachable from the API pod (same namespace recommended)

## Step 6: Production Hardening and Optimizations

RAG quality depends on thoughtful retrieval, robust infrastructure, and safe prompting. Here’s a checklist.

### Retrieval Quality

- Chunking:
  - Use semantic chunking (e.g., by headings for Markdown)
  - Tune chunk size and overlap based on your documents and LLM context window
- Embeddings:
  - bge-small-en-v1.5 (384-d) is fast for general English
  - Consider e5-large-v2 or bge-base/bge-large for higher accuracy (trade-off: speed/latency)
  - Normalize embeddings for cosine similarity with IP metric in Milvus
- Indexing:
  - HNSW: great for low-latency search, tune M and efConstruction
  - IVF_FLAT/IVF_PQ: better for very large corpora, with quantization
  - Maintain a separate scalar index for metadata filtering (e.g., source, date)
- Hybrid search:
  - Combine lexical (BM25) and vector results; re-rank with cross-encoders (e.g., bge-reranker-large)

### Prompting and Guardrails

- System prompts:
  - Force the model to only use provided context; instruct to say “I don’t know” for missing info
- Citations:
  - Include source indices and return them to the client
- Safety:
  - Filter prompts for PII or malicious instructions
  - Add content moderation where required

### Caching and Cost Control

- Response caching:
  - Cache frequent Q&A pairs at the API layer (e.g., Redis)
- Embedding cache:
  - Cache embeddings for repeated queries
- Batch requests:
  - For indexing, batch embeddings to maximize throughput

### Observability

- Metrics:
  - Track latency, hit rate (how often contexts actually contain the answer), token usage
- Logs:
  - Log query, retrieved sources, and anonymized outputs (respect privacy)
- Tracing:
  - Use OpenTelemetry to trace across API → Milvus → vLLM
- On Sealos:
  - Integrate with monitoring stacks you deploy alongside (Prometheus/Grafana) and set alerts

### Data Lifecycle

- Updates:
  - Run nightly or on-demand indexing jobs (Sealos CronJob) to pick up new/changed docs
- Deletes:
  - Implement soft deletes or filters (e.g., is_active flag) if hard deletes aren’t instant
- Multi-tenancy:
  - Separate collections per tenant or use a tenant_id scalar field for filtering

### Security

- Secrets:
  - Store API keys and tokens in Sealos Secrets, not in images
- Network:
  - Restrict egress where possible, use NetworkPolicies within the cluster
- Access:
  - Use Sealos RBAC to limit who can deploy/modify apps
- TLS:
  - Terminate HTTPS at Sealos Gateway or Ingress controller

## Practical Applications

- Internal knowledge assistants: Answer employee questions using your wiki, Confluence, or docs
- Customer support copilots: Pull from product manuals and past tickets to reduce handling time
- Compliance and policy Q&A: Grounded answers citing the exact policy text
- Engineering search: Query codebases, design docs, and RFCs with precise snippets
- Research assistants: Surface relevant passages from large PDFs or scientific docs

Each use case benefits from careful source management and metadata filters (department, product, document type, publish date).

## Troubleshooting Guide

- Llama 3 fails to load:
  - Ensure your GPU meets memory requirements (8B model typically needs ~16–24 GB GPU RAM with paged attention)
  - Accept the model license on Hugging Face and set HUGGING_FACE_HUB_TOKEN
- Slow generation:
  - Reduce max_tokens and temperature
  - Use tensor parallelism if multiple GPUs are available
  - Consider quantized variants (e.g., AWQ) with vLLM
- Poor retrieval:
  - Increase chunk size or overlap
  - Use a stronger embedding model
  - Try HNSW with higher efSearch at query time
- Empty results:
  - Confirm embeddings are normalized when using IP
  - Check that the collection is loaded (collection.load())
  - Verify that the field names match and output_fields include the right fields

## Cost and Scaling Tips

- Scale Milvus vertically (CPU, RAM) and assign sufficient disk IOPS for large collections
- Scale your API horizontally; stateless FastAPI pods are easy to autoscale
- Assign GPU to vLLM instances; scale out replicas for concurrency
- Use Sealos autoscaling policies to match demand patterns
- Cache popular answers and avoid regenerating identical responses

## Extending the Pipeline

- Add a re-ranker:
  - Use a cross-encoder like bge-reranker-base to improve the ordering of retrieved chunks
- Structured outputs:
  - Ask Llama 3 for JSON-formatted answers; validate with a schema
- Tool use:
  - Add tools for code execution or database queries, but keep guardrails strict
- Multi-lingual:
  - Use multilingual embeddings (e.g., bge-m3) if your corpus spans languages

## A Note on Model and License

Llama 3 is released under the Llama 3 Community License. Accept the license and ensure your usage complies with the terms. When deploying via vLLM, use a valid Hugging Face token to download weights at runtime.

## Why Sealos for RAG?

Sealos (https://sealos.io) is a cloud operating system that makes Kubernetes accessible. For RAG, it gives you:

- One-click app deployments (Milvus, your API) via Launchpad
- Built-in object storage, secrets, domain/SSL management
- GPU scheduling for LLM inference
- Multi-tenant workspaces and clear cost boundaries
- GitOps and YAML support for teams that prefer IaC

This means faster iterations, fewer moving parts, and production-grade reliability without a DevOps marathon.

## Summary and Next Steps

You built a fully functional RAG pipeline:

- Indexed your documents into Milvus with high-quality embeddings
- Deployed Llama 3 inference via vLLM on GPU
- Exposed a FastAPI service that performs retrieval and grounded generation
- Deployed everything on Sealos for an integrated, scalable setup

Key takeaways:

- RAG is the most practical way to inject domain knowledge into LLMs while reducing hallucinations
- Milvus provides fast and scalable vector search; choose the right index and embedding model
- Llama 3 offers strong open-source generation; pair with vLLM for performant serving
- Sealos simplifies deployment, scaling, and operations so you can focus on product features

Next steps:

- Add re-ranking for improved retrieval quality
- Implement response caching and analytics
- Expand your document loaders (PDF parsing, HTML cleaning, S3 ingestion)
- Harden security and observability for enterprise environments

With this foundation, you can confidently ship AI assistants that are accurate, auditable, and fast—powered by your data and deployed on a platform designed for cloud-native AI workloads.
