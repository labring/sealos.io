---
title: Fine-Tuning Open-Source LLMs on a Budget with Sealos
imageTitle: Fine-Tuning Open-Source LLMs with Sealos
description: Explore practical, budget-friendly strategies to fine-tune open-source LLMs using Sealos. Achieve strong performance while optimizing compute and memory costs.
date: 2025-09-02
tags: ['open-source', 'LLMs', 'fine-tuning', 'Sealos', 'budget-optimization']
authors: ['default']
---

You don’t need a cluster of H100s to teach a large language model to speak your business’s language. With the right techniques and a thoughtful workflow, you can fine-tune open-source LLMs for domain-specific tasks—customer support, legal drafting, knowledge retrieval, analytics—at a fraction of the cost.

In this guide, you’ll learn how to fine-tune open-source LLMs on a budget using parameter-efficient methods such as LoRA and QLoRA, with a cloud-native setup powered by Sealos. We’ll cover what fine-tuning is, why it matters, how to structure an efficient training pipeline, and how to deploy your model quickly. You’ll also see code snippets and Kubernetes examples you can copy, adapt, and run.

If you already use Kubernetes or want a configurable, developer-friendly platform to run AI workloads, Sealos (https://sealos.io) provides a streamlined way to provision GPU-backed environments, object storage, and apps like notebooks or web UIs so you can focus on your model—not on plumbing.

## What We Mean by “Fine-Tuning”

Fine-tuning adapts a base LLM to a specific domain or task by continuing training on your curated dataset. You can:

- Supervised fine-tune (SFT): Teach the model to produce desired outputs from instructions or prompts.
- Preference optimize (DPO/RLHF): Align with human preferences after SFT.
- Task-specialize: Summarization, code generation, SQL generation, classification, etc.

Full fine-tuning updates all model weights and can be expensive. Parameter-efficient fine-tuning (PEFT) like LoRA and QLoRA updates only small “adapter” matrices, dramatically reducing compute, memory, and cost.

## Why Budget-Friendly Fine-Tuning Is Important

- Lower TCO and faster iteration: Train in hours on a single mid-range GPU instead of days on a cluster.
- Data-centric wins: High-quality, task-aligned data beats brute force compute.
- Deployment simplicity: Small adapter files are easy to store, version, and swap.
- Compliance and control: Keep models and data in your environment; open-source models let you control licensing and security posture.

## Where Sealos Fits

Sealos is an open-source cloud platform that makes running Kubernetes-backed apps and workloads simpler. For LLM fine-tuning, you can use Sealos to:

- Provision GPU-backed compute as containerized jobs or long-running services.
- Set up object storage (S3-compatible) for datasets, checkpoints, and artifacts.
- Launch developer tooling (e.g., JupyterLab, VS Code Web) to iterate quickly.
- Host model inference endpoints with tools like vLLM or Open WebUI.

Whether you deploy Sealos on your own infrastructure or use a managed Sealos-based cloud, you get a consistent app-centric experience with Kubernetes robustness underneath.

Learn more at https://sealos.io.

## The Budget Strategy: A High-Level Blueprint

- Choose a compact, permissively licensed base model (e.g., 3B–8B parameters).
- Use LoRA/QLoRA to update only 0.1–1% of the parameters.
- Quantize weights to 4-bit during training (QLoRA) to fit into a single 16–24 GB GPU.
- Keep sequence lengths and dataset size sane; prioritize quality over quantity.
- Use gradient accumulation, mixed precision, and gradient checkpointing to stay within memory limits.
- Track and resume training; autosave checkpoints to S3 storage.
- Serve with an efficient runtime (e.g., vLLM) and scale only when needed.

## Choosing the Right Base Model

Match model capacity to your task and budget:

- 3B–8B class: Good for classification, summarization, structured generation, and many assistive tasks. Examples: Mistral 7B, Llama 3 8B, Mixtral-instruct (Mixture-of-Experts requires more memory to serve).
- 13B+ class: For higher fluency or complex reasoning; cost will increase significantly.

Important notes:

- License: Some models require acceptance of a license (e.g., Llama 3). Ensure your use case complies.
- Context length: If you need long context (8k–32k), pick a base model that supports it.
- Tokenizer: Keep compatibility between tokenizer and base model.

## Estimate Cost Before You Start

Compute an order-of-magnitude estimate:

- Total tokens processed ≈ num_examples × avg_tokens_per_example × epochs.
- Training throughput on 7B QLoRA: roughly 100–300 tokens/sec on a single L4/A10G (varies widely).
- Hours ≈ total_tokens / throughput / 3600.

Example:

- 20,000 examples, 300 tokens each, 2 epochs → 12M tokens.
- At 200 tokens/sec → 60,000 sec (~16.7 hours).
- If GPU costs $0.60–$1.20/hour, expect $10–$20 in compute.

These are rough numbers; your actual throughput depends on sequence length, batch size, model, and hardware.

## Architecture on Sealos

A minimal, budget-conscious setup:

- Compute: A single GPU-backed container in Sealos.
- Storage: S3-compatible object storage in Sealos for datasets and checkpoints.
- Image: A Docker image with PyTorch, Transformers, PEFT, BitsAndBytes, and Accelerate.
- Orchestration: Kubernetes job or long-running pod; use Sealos UI or GitOps.
- Serving: A separate deployment (e.g., vLLM) that loads base weights plus LoRA adapters, or merges adapters into a new checkpoint for faster inference.

### Example Kubernetes Spec (Requesting a GPU)

If you’re using Sealos over Kubernetes, a simple pod spec might look like:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: qlora-train
spec:
  restartPolicy: Never
  containers:
    - name: trainer
      image: ghcr.io/huggingface/transformers-pytorch-deepspeed:latest
      command: ['bash', '-lc']
      args:
        - |
          pip install -U transformers datasets peft bitsandbytes accelerate sentencepiece s3fs
          python train.py
      resources:
        limits:
          nvidia.com/gpu: 1
          cpu: '6'
          memory: '24Gi'
      env:
        - name: HF_TOKEN
          valueFrom:
            secretKeyRef:
              name: hf-secret
              key: token
        - name: AWS_ACCESS_KEY_ID
          valueFrom:
            secretKeyRef:
              name: s3-creds
              key: access_key
        - name: AWS_SECRET_ACCESS_KEY
          valueFrom:
            secretKeyRef:
              name: s3-creds
              key: secret_key
        - name: AWS_DEFAULT_REGION
          value: us-east-1
      volumeMounts:
        - name: scratch
          mountPath: /workspace
  volumes:
    - name: scratch
      emptyDir: {}
```

In Sealos, you can create similar GPU-backed workloads through the console, and provision an S3-compatible bucket using the object storage app. Store your datasets and checkpoints in S3 and access them via s3:// URIs.

## Data: The Real Lever for Quality (and Cost)

High-quality, representative data lets you train fewer steps and get better results.

- Start small: 5k–50k examples often suffice for narrow tasks.
- Format consistently: Use a clear instruction → output schema.
- Limit sequence length: Truncate inputs; move long references to retrieval if possible.
- De-duplicate and sanitize: Quality beats quantity.

### Example JSONL and Prompt Template

Data example (jsonl):

```json
{"instruction": "Summarize the ticket.", "input": "User cannot log in after password reset...", "output": "Summary: User reset password and is now locked out..."}
{"instruction": "Classify sentiment.", "input": "I love the new dashboard.", "output": "positive"}
```

Prompt template applied during training:

```
### Instruction:
{instruction}

### Input:
{input}

### Response:
{output}
```

Keeping a consistent prompt reduces prompt-shift between training and inference.

## Training on a Budget with QLoRA

QLoRA pairs 4-bit weight quantization with LoRA adapters. The base model remains quantized; only small adapter weights are learned. This allows fitting 7B models on 16–24 GB GPUs with decent throughput.

### Minimal Training Script (Transformers + PEFT)

Below is a streamlined script you can adapt. It uses:

- BitsAndBytes 4-bit quantization.
- LoRA adapters with PEFT.
- Gradient accumulation and checkpointing for memory control.

File: train.py

```python
import os
from dataclasses import dataclass
from typing import Dict

import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

# Config
BASE_MODEL = os.environ.get("BASE_MODEL", "mistralai/Mistral-7B-v0.1")
DATASET_PATH = os.environ.get("DATASET_PATH", "s3://my-bucket/datasets/instructions.jsonl")
OUTPUT_DIR = os.environ.get("OUTPUT_DIR", "s3://my-bucket/checkpoints/mistral-qlora")
MAX_LEN = int(os.environ.get("MAX_LEN", "1024"))
BATCH_SIZE = int(os.environ.get("BATCH_SIZE", "1"))
GRAD_ACCUM = int(os.environ.get("GRAD_ACCUM", "16"))
LR = float(os.environ.get("LR", "2e-4"))
EPOCHS = int(os.environ.get("EPOCHS", "2"))
WARMUP = int(os.environ.get("WARMUP", "50"))

# Tokenizer
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, use_fast=True)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

# Load dataset (JSONL with fields: instruction, input, output)
# Requires s3fs if using s3:// URLs
raw = load_dataset("json", data_files=DATASET_PATH, split="train")

def format_example(ex):
    instr = ex.get("instruction", "").strip()
    inp = ex.get("input", "").strip()
    out = ex.get("output", "").strip()
    prompt = f"### Instruction:\n{instr}\n\n### Input:\n{inp}\n\n### Response:\n"
    # We train to predict the response tokens
    text = prompt + out + tokenizer.eos_token
    return {"text": text}

formatted = raw.map(format_example, remove_columns=raw.column_names)

def tokenize(examples: Dict):
    return tokenizer(
        examples["text"],
        truncation=True,
        max_length=MAX_LEN,
        padding=False,
    )

tokenized = formatted.map(tokenize, batched=True, remove_columns=["text"])

# 4-bit quantization config
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

# Load model in 4-bit
model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    quantization_config=bnb_config,
    device_map="auto",
)
model = prepare_model_for_kbit_training(model)

# LoRA
lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"]  # adjust per model
)
model = get_peft_model(model, lora_config)

# Data collator (causal LM)
collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

# Training arguments
args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=BATCH_SIZE,
    gradient_accumulation_steps=GRAD_ACCUM,
    learning_rate=LR,
    num_train_epochs=EPOCHS,
    warmup_steps=WARMUP,
    fp16=False,
    bf16=True,
    logging_steps=20,
    save_steps=500,
    save_total_limit=2,
    evaluation_strategy="no",
    optim="paged_adamw_8bit",
    gradient_checkpointing=True,
    lr_scheduler_type="cosine",
    max_grad_norm=0.3,
    report_to=[],
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized,
    data_collator=collator,
)
trainer.train()

# Save adapter weights
trainer.model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)
```

Notes:

- If you use s3:// paths with the datasets library, pip install s3fs and configure AWS credentials (or Sealos object storage credentials) via environment variables.
- target_modules depend on the model architecture; Mistral/LLaMA-like models typically use q_proj, k_proj, v_proj, o_proj.
- Set bf16=True only if GPU supports bfloat16 (Ampere+). Otherwise, switch to fp16=True.

### Running the Training Job

On Sealos, you can:

- Build your own image with the dependencies above, or
- Use a ready-made image and pip install dependencies at runtime, then run train.py.

If you prefer a lightweight Dockerfile:

```
FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y python3-pip git && rm -rf /var/lib/apt/lists/*

RUN pip3 install -U torch --index-url https://download.pytorch.org/whl/cu121 \
    && pip3 install -U transformers datasets peft bitsandbytes accelerate sentencepiece s3fs

WORKDIR /app
COPY train.py /app/train.py
CMD ["python3", "train.py"]
```

Push the image to your registry and reference it in your Sealos workload.

## Quick Evaluation

Evaluate before long runs to avoid wasting compute.

### Smoke Test Inference with Adapters

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

BASE_MODEL = "mistralai/Mistral-7B-v0.1"
ADAPTER_DIR = "s3://my-bucket/checkpoints/mistral-qlora"

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, use_fast=True)
model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, torch_dtype=torch.bfloat16, device_map="auto")
model = PeftModel.from_pretrained(model, ADAPTER_DIR)

prompt = "### Instruction:\nSummarize the ticket.\n\n### Input:\nUser cannot log in after reset\n\n### Response:\n"
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
with torch.no_grad():
    out = model.generate(**inputs, max_new_tokens=128, do_sample=False)
print(tokenizer.decode(out[0], skip_special_tokens=True))
```

### Lightweight Perplexity Check

For generative tasks, compute perplexity on a held-out set:

```python
from datasets import load_dataset
from transformers import Trainer, TrainingArguments, DataCollatorForLanguageModeling, AutoTokenizer, AutoModelForCausalLM

# assuming BASE_MODEL + adapters already loaded into 'model'
eval_data = load_dataset("json", data_files="s3://my-bucket/datasets/heldout.jsonl", split="train")
eval_data = eval_data.map(lambda ex: {"text": ex["output"] + tokenizer.eos_token})
eval_tok = eval_data.map(lambda ex: tokenizer(ex["text"]), batched=True, remove_columns=["text"])
collator = DataCollatorForLanguageModeling(tokenizer, mlm=False)
args = TrainingArguments(output_dir="/tmp/ppl", per_device_eval_batch_size=2)
trainer = Trainer(model=model, args=args, eval_dataset=eval_tok, data_collator=collator)
ppl = torch.exp(torch.tensor(trainer.evaluate()["eval_loss"])).item()
print("Perplexity:", ppl)
```

Small, consistent improvements in perplexity on relevant text usually correlate with better outputs.

## Serving the Fine-Tuned Model on a Budget

Two options:

- Load base model + LoRA adapters at runtime. Pros: small artifact size, can swap adapters easily. Cons: slight overhead on first load.
- Merge LoRA adapters into base weights offline, then serve the merged model for best inference throughput.

### Merging Adapters

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

BASE_MODEL = "mistralai/Mistral-7B-v0.1"
ADAPTER_DIR = "s3://my-bucket/checkpoints/mistral-qlora"
MERGED_DIR = "/models/mistral-merged"

model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, torch_dtype="auto")
model = PeftModel.from_pretrained(model, ADAPTER_DIR)
merged = model.merge_and_unload()  # merges LoRA into base
merged.save_pretrained(MERGED_DIR, safe_serialization=True)
tok = AutoTokenizer.from_pretrained(BASE_MODEL)
tok.save_pretrained(MERGED_DIR)
```

Upload MERGED_DIR to your model store (e.g., S3), then serve.

### Serving with vLLM (Kubernetes)

vLLM is efficient and easy to deploy. Example Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-mistral
spec:
  replicas: 1
  selector:
    matchLabels: { app: vllm }
  template:
    metadata:
      labels: { app: vllm }
    spec:
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          args:
            - --model
            - s3://my-bucket/models/mistral-merged
            - --tensor-parallel-size
            - '1'
            - --max-model-len
            - '4096'
          ports:
            - containerPort: 8000
          resources:
            limits:
              nvidia.com/gpu: 1
              cpu: '4'
              memory: '16Gi'
          env:
            - name: AWS_ACCESS_KEY_ID
              valueFrom:
                secretKeyRef: { name: s3-creds, key: access_key }
            - name: AWS_SECRET_ACCESS_KEY
              valueFrom:
                secretKeyRef: { name: s3-creds, key: secret_key }
            - name: AWS_DEFAULT_REGION
              value: us-east-1
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-svc
spec:
  selector: { app: vllm }
  ports:
    - port: 80
      targetPort: 8000
      protocol: TCP
```

With Sealos, you can expose the service via an Ingress or built-in domain routing, and test with the OpenAI-compatible endpoint:

```bash
curl http://<your-endpoint>/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral-merged",
    "prompt": "Write a concise summary of: ...",
    "max_tokens": 128
  }'
```

Alternatively, you can deploy Open WebUI on Sealos to chat with your model.

## Practical Applications

- Customer support: Teach the model to resolve common tickets, follow your policy handbook, and produce templated responses.
- Sales assistants: Personalize outreach, qualify leads, and fill CRM fields consistently.
- Documentation Q&A: Summarize changelogs, answer questions about your API, and draft guides with your tone.
- Legal/finance drafting: Create structured summaries, extract clauses, or generate compliance-ready checklists.
- Data engineering helpers: Generate SQL against your schema, annotate ETL pipeline code, and document datasets.

Tip: Keep your training data narrowly focused on the task. For retrieval-heavy tasks, combine a smaller instruction-tuned model with a vector database and RAG, rather than trying to stuff all knowledge into weights.

## Tips to Reduce Cost Without Sacrificing Quality

- Use QLoRA with r=8–16 and lora_alpha=16–32. Often sufficient.
- Keep sequence length tight (512–2048). Longer context is costly.
- Start with 1–2 epochs; stop early if validation plateaus.
- Freeze everything except attention projections (q,k,v,o) and perhaps the MLP in later experiments.
- Enable gradient checkpointing and use paged_adamw_8bit optimizer.
- Pre-tokenize your dataset to avoid CPU bottlenecks on the GPU clock.
- Use spot/preemptible GPUs if your platform supports checkpoint resume.
- Validate data quality. A single corrupted shard or mixed schema can waste runs.

## Common Pitfalls and How to Avoid Them

- Out-of-memory (OOM): Reduce MAX_LEN, increase GRAD_ACCUM, lower LoRA rank, or switch to smaller base model.
- Catastrophic forgetting: Use a small proportion (5–20%) of general data mixed with your domain data, or apply regularization (e.g., KL during preference training).
- Instruction drift: Keep a stable prompt template and mirror it in inference.
- Overfitting: Monitor held-out loss; add early stopping; reduce epochs.
- Tokenization mismatches: Always use the base model’s tokenizer; never mix tokenizers.

## Putting It All Together on Sealos

A step-by-step outline you can follow:

1. Provision storage:

   - Create an S3-compatible bucket in Sealos to hold datasets and checkpoints.
   - Upload your JSONL dataset and optionally a held-out eval set.

2. Prepare the image:

   - Build the Dockerfile above and push to your registry, or use a prebuilt image and provide train.py as a ConfigMap/volume in Kubernetes.

3. Launch a GPU workload:

   - In Sealos, create a GPU-enabled job or pod using your image.
   - Set environment variables: BASE_MODEL, DATASET_PATH, OUTPUT_DIR, etc.
   - Mount credentials for S3.

4. Monitor and iterate:

   - Stream logs to check throughput and loss.
   - If loss flattens early, cancel to save cost and adjust hyperparameters.

5. Save and test:

   - After training, ensure adapter weights and tokenizer are saved to S3.
   - Run a quick smoke test with the inference code to validate outputs.

6. Serve:

   - Merge adapters for faster inference (optional).
   - Deploy vLLM with the merged model or load adapters dynamically.
   - Expose an endpoint, and connect a UI (e.g., Open WebUI).

7. Automate:
   - Use GitOps or CI/CD to trigger fine-tunes on new data drops.
   - Schedule cost-saving policies (TTL jobs, off-hours scaling) via Kubernetes.

Sealos simplifies each of these steps with an application-centric console, while still giving you full control over Kubernetes primitives when you need them.

## Security, Compliance, and Governance

- Data residency: Keep datasets and checkpoints in your Sealos-hosted object storage within your region.
- Secrets: Store access keys in Kubernetes Secrets; avoid hardcoding.
- Licenses: Ensure your base model’s license permits your use case and redistribution if you plan to share the merged model.
- Auditing: Log training runs and configurations; store training args alongside checkpoints for reproducibility.

## Frequently Asked Questions

- Can I fine-tune without a GPU?

  - Technically yes for very small adapters and tiny models, but training speed will be impractical. A single mid-range GPU (e.g., L4/A10G) is a sweet spot.

- Do I need Deepspeed or FSDP?

  - Not for 7B QLoRA on a single GPU. If you scale beyond 13B or need full fine-tuning, consider them.

- Should I use DPO/RLHF?

  - Start with SFT. If you need preference alignment (tone, safety, style), add DPO with a small pairwise preference dataset.

- How big should my dataset be?
  - For narrow tasks, 5k–20k high-quality examples often suffice. For broader instruction tuning, 50k–200k is common—still manageable with QLoRA.

## A Sample Budget Plan

- Hardware: 1× L4 24GB (or A10G 24GB) on-demand for 6–12 hours.
- Steps:
  - Data cleanup and tokenization: 1–2 hours CPU time.
  - Pilot run (1 epoch): 2–4 hours.
  - Main run (2 epochs): 4–8 hours.
  - Merge + deploy: 1 hour.
- Estimated spend: $10–$30 depending on GPU price and total hours.

Optimize by reducing sequence length, trimming low-quality samples, and merging early if results are already good after 1 epoch.

## Conclusion: Small Budgets, Big Impact

Fine-tuning open-source LLMs doesn’t have to be expensive or complicated. With QLoRA/LoRA, careful data curation, and efficient tooling, you can ship models that feel bespoke to your domain—often in a day and well within a modest budget.

Sealos helps you operationalize this workflow: spin up GPU workloads, store datasets and artifacts, iterate in familiar developer tools, and deploy serving endpoints—without wrangling infrastructure details. Start small, measure often, and let data quality—not raw compute—drive your improvements.

When you’re ready to level up your AI stack with a practical, cloud-native approach, explore Sealos at https://sealos.io and put your fine-tuning plan into action.
