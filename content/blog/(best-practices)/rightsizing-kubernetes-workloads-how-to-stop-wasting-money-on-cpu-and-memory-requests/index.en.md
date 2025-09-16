---
title: "Rightsizing Kubernetes Workloads: How to Stop Wasting Money on CPU and Memory Requests"
imageTitle: "Rightsizing Kubernetes Workloads"
description: "Learn practical strategies to rightsize CPU and memory requests in Kubernetes, reducing overprovisioning and lowering cloud costs without sacrificing performance. Includes methods for analyzing workloads, implementing requests and limits, and using autoscaling and cost-aware governance."
date: 2025-09-11
tags:
  [
    "kubernetes",
    "cost-optimization",
    "resource-management",
    "cpu-memory-requests",
    "autoscaling",
  ]
authors: ["default"]
---

If your cloud bill keeps climbing while your apps sit mostly idle, you’re not alone. Kubernetes makes it easy to scale and isolate workloads, but it’s just as easy to overspend by overprovisioning CPU and memory. The cure is rightsizing: continuously tuning resource requests and limits so pods get what they need—no more, no less.

This guide demystifies how resource requests and limits really work, how to measure what your workloads actually use, and exactly how to set sane values. You’ll learn a pragmatic process you can apply today, with examples, queries, and automation tips that work in any cluster.

Whether you run a few services or thousands, a smart rightsizing strategy can unlock significant cost savings while improving reliability and performance.

---

## What Is Rightsizing in Kubernetes?

Rightsizing is the practice of setting resource requests and limits for your containers based on observed usage, performance requirements, and risk tolerance. The goal is to:

- Reduce waste from inflated requests that block bin-packing and inflate your node count
- Avoid throttling and OOMKills that cause performance issues and incidents
- Improve scheduling efficiency and autoscaling behavior
- Align resource guarantees with your service-level objectives (SLOs)

In practical terms, rightsizing means:

- Choosing CPU and memory requests based on historical usage percentiles plus a safety margin
- Setting limits only when they protect the platform from misbehaving apps (especially memory)
- Automating recommendations and applying them safely (e.g., with Vertical Pod Autoscaler in recommendation mode)

---

## Why Rightsizing Is Important

- Cost: In most clouds, you pay for the nodes your pods reserve. Overstated requests waste money because the scheduler reserves capacity you’ll never use, which forces more nodes.
- Reliability: Understated requests can cause noisy-neighbor issues, preemption, or frequent evictions under pressure. Misaligned limits can lead to CPU throttling or OOMKills.
- Performance: Well-tuned requests improve HPA scaling signals, reduce tail latencies, and allow the cluster autoscaler to add/remove nodes more efficiently.
- Fairness and multi-tenancy: Accurate requests support fair scheduling across teams and products, reducing surprise incidents.

If you’re using a platform like Sealos (sealos.io) to run multi-tenant Kubernetes, rightsizing pairs naturally with per-namespace quotas and cost visibility. It helps teams understand their footprint and stay within budget while maintaining SLOs.

---

## How Kubernetes Resources Actually Work

Before tuning, it’s essential to understand how Kubernetes interprets resource requests and limits.

### Requests vs. Limits

- Request: A guaranteed amount of a resource that informs scheduling. The scheduler ensures the node has at least this much available. CPU requests also set cgroups CPU shares (relative priority).
- Limit: A hard cap enforced by cgroups. CPU limits translate to CFS quota; memory limits cap resident memory; exceeding memory limits triggers OOMKill.

### QoS Classes

Kubernetes assigns a Quality of Service (QoS) class based on your requests/limits:

- Guaranteed: Every container in the pod has memory and CPU requests equal to limits. Highest eviction priority.
- Burstable: At least one container has a request, and some requests are less than limits. Medium eviction priority.
- BestEffort: No requests or limits. Lowest priority, first to be evicted under pressure.

Setting requests matters even if you don’t set limits. Avoid BestEffort for anything important.

### CPU vs. Memory Semantics

- CPU is compressible: An app can be throttled with minimal safety impact; it simply runs slower. CPU requests define scheduling and shares; limits cap usage and can cause throttling.
- Memory is not compressible: If a container exceeds its memory limit, the kernel kills it (OOMKill). Memory requests determine scheduling and, together with limits, control QoS/eviction behavior.

A common, cost-effective pattern is:

- Set accurate CPU requests and avoid CPU limits unless you need strict caps (e.g., noisy libraries or batch jobs).
- Set memory requests close to expected usage and memory limits high enough to avoid frequent OOMKills, but low enough to prevent runaway memory.

### Eviction and Node Pressure

Under memory pressure, the kubelet evicts Pods based on QoS and usage. BestEffort pods go first, then Burstable, while Guaranteed pods are protected longest. Right-sized memory requests (with reasonable limits) reduce surprise evictions.

---

## How Rightsizing Works: A Practical Methodology

Here’s a battle-tested, repeatable process you can apply to any cluster.

### 1) Define SLOs and Observation Window

- Determine critical performance metrics (latency SLOs, throughput, error budgets).
- Select a representative observation window that includes traffic patterns: typically 7–14 days.
- Separate weekday/weekend or seasonal differences if significant.

### 2) Collect Usage Data

Use a combination of:

- kubectl top (quick view via metrics-server)
- Prometheus (recommended for quantiles and long windows)
- Container runtime metrics and APM (language-specific memory behaviors, GC patterns)

Quick commands:

- kubectl top pods -n your-namespace
- kubectl top pod your-pod -n your-namespace --containers

PromQL examples for a single container (adjust labels to your environment):

```
# CPU cores averaged over time
rate(container_cpu_usage_seconds_total{container!="",pod="my-app-abc",namespace="prod"}[5m])

# 95th percentile memory over 7 days (bytes)
quantile_over_time(0.95, container_memory_working_set_bytes{container="app",pod=~"my-app-.*",namespace="prod"}[7d])
```

Note: container_memory_working_set_bytes is often a better proxy for “active” memory than usage, but validate for your stack.

### 3) Choose Targets and Headroom

A sensible baseline for many services:

- CPU request ≈ 50–70th percentile of CPU usage, averaged over 1–5 minute intervals
- Memory request ≈ 95th percentile of working set
- Memory limit ≈ 110–150% of memory request, depending on risk tolerance
- Avoid CPU limits unless you must enforce fairness or control bursting

This balances cost with performance. For latency-critical services, raise CPU request percentiles; for batch or bursty tasks, widen headroom.

### 4) Translate Measurements to Requests/Limits

Example calculation:

- Observed CPU P70 = 350 millicores (0.35 vCPU)
- Observed Memory P95 = 700 MiB
- Choose headroom: CPU +15%, Memory +25% for limit

Then:

- cpu.request = 0.35 \* 1.0 = 350m (no headroom needed if using HPA, see below)
- memory.request = 700Mi
- memory.limit = 700Mi \* 1.25 ≈ 875Mi (round to 900Mi or 1Gi for simplicity)
- cpu.limit: omit unless required

### 5) Validate Safely

- Roll changes behind a canary or a small percentage of replicas.
- Watch p95 latency, error rates, throttling, and OOM events.
- Compare cost (node count or vCPU/GB-hour) before/after.

### 6) Automate Recommendations

- Vertical Pod Autoscaler (VPA) can provide recommendations and optionally apply them.
  - Start in Off mode (recommendations only)
  - Consider Initial mode (set on first schedule), or Auto for memory in steady workloads
- Goldilocks (by Fairwinds) uses VPA to visualize suggested requests per namespace.

### 7) Combine with HPA and Cluster Autoscaler

- Horizontal Pod Autoscaler (HPA) scales replicas based on metrics (CPU, memory, custom).
- Best practice:
  - Use HPA for scale-out on CPU or QPS metrics
  - Use VPA for rightsizing requests (often memory) and to inform CPU baselines
- Avoid conflicts: Do not let VPA and HPA both control CPU aggressively in the same workload. Use VPA in “Off” or “Initial” when HPA is active, or configure VPA to exclude CPU.
- Cluster Autoscaler reacts to pending pods whose requests don’t fit; accurate requests yield efficient node scaling.

### 8) Enforce Defaults with Policies

- Use LimitRange to ensure every container has requests/limits.
- Use ResourceQuota to cap total namespace consumption.
- Provide team guardrails without breaking workloads (sane defaults, generous quotas, and clear escalation paths).

---

## Practical YAML Examples

### A well-sized Deployment

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: checkout
  namespace: prod
spec:
  replicas: 4
  selector:
    matchLabels:
      app: checkout
  template:
    metadata:
      labels:
        app: checkout
    spec:
      containers:
        - name: app
          image: ghcr.io/acme/checkout:1.8.3
          resources:
            requests:
              cpu: "350m"
              memory: "700Mi"
            limits:
              memory: "1Gi"
          ports:
            - containerPort: 8080
          env:
            - name: GOMEMLIMIT
              value: "950Mi"  # helps Go apps respect container memory limit
```

Notes:

- No CPU limit to avoid throttling in latency-critical paths (validate for your workload).
- Memory limit set with headroom; Go’s GOMEMLIMIT aligns GC behavior with the container limit.

### LimitRange and ResourceQuota for Guardrails

```
apiVersion: v1
kind: LimitRange
metadata:
  name: defaults
  namespace: prod
spec:
  limits:
    - type: Container
      defaultRequest:
        cpu: "100m"
        memory: "256Mi"
      default:
        memory: "1Gi"
      max:
        cpu: "2000m"
        memory: "4Gi"
      min:
        cpu: "50m"
        memory: "128Mi"
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-a-quota
  namespace: prod
spec:
  hard:
    requests.cpu: "40"
    requests.memory: "80Gi"
    limits.memory: "150Gi"
    pods: "200"
```

These defaults prevent BestEffort pods and set rational bounds. Adjust to your org’s norms.

### HPA for Scale-Out + VPA for Recommendations

```
# HPA: scale on CPU utilization target
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: checkout
  namespace: prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: checkout
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
---
# VPA: recommendations only (no automatic updates)
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: checkout
  namespace: prod
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: checkout
  updatePolicy:
    updateMode: "Off"      # get recommendations without applying
  resourcePolicy:
    containerPolicies:
      - containerName: app
        controlledResources: ["memory"]  # avoid CPU conflicts with HPA
```

Use a dashboard (e.g., Goldilocks) to view recommendations and adjust requests periodically.

---

## Observability and Queries That Matter

To rightsize, you need actionable metrics. Track:

- CPU usage cores (rate of container_cpu_usage_seconds_total)
- CPU throttling (container_cpu_cfs_throttled_seconds_total, if available)
- Memory working set and RSS (container_memory_working_set_bytes, container_memory_rss)
- OOMKills and restarts (kube_pod_container_status_last_terminated_reason, kube events)
- Latency SLOs and throughput (from your APM)

PromQL snippets:

```
# CPU P70 per container over 7d (approximate)
quantile_over_time(0.70, rate(container_cpu_usage_seconds_total{container!="",namespace="prod",pod=~"checkout-.*"}[5m])[7d:5m])

# Memory P95 per container over 7d
quantile_over_time(0.95, container_memory_working_set_bytes{container="app",namespace="prod",pod=~"checkout-.*"}[7d])

# Detect CPU throttling ratio (if exposed)
sum by (pod, container) (
  rate(container_cpu_cfs_throttled_seconds_total{namespace="prod"}[5m])
)
/
sum by (pod, container) (
  rate(container_cpu_cfs_periods_total{namespace="prod"}[5m])
)
```

If you lack Prometheus, at minimum use kubectl top and logs/events to catch OOMKills:

- kubectl describe pod <pod> -n prod
- kubectl logs <pod> -n prod --previous

---

## Cost Model: Where the Money Goes

You pay for reserved capacity at the node level. The high-level cost of waste is:

- Wasted CPU cost ≈ sum over pods of max(0, requestedCPU − actualCPU) × pricePerCPUHour
- Wasted memory cost ≈ sum over pods of max(0, requestedMem − actualMem) × pricePerGBHour

Rightsizing reduces the gap between requests and usage so the scheduler can pack pods densely, allowing Cluster Autoscaler to remove nodes.

Tip: Tools like Kubecost can attribute costs per namespace/workload. Platforms like Sealos can pair quotas and policy with visibility for multi-tenant clusters.

---

## Advanced Rightsizing Considerations

### Multi-Container Pods and Sidecars

- Sum requests/limits across all containers. Don’t forget init containers and sidecars.
- Common pitfall: a logging/metrics sidecar with no requests can distort QoS and eviction behavior.
- For service meshes, reserve CPU/memory for the proxy; measure its usage separately.

### Language Runtimes and Memory

- Java: Align -Xmx with memory limits; allocate headroom for metaspace, threads, off-heap (e.g., set -XX:MaxRAMPercentage, -XX:MaxDirectMemorySize).
- Go: Use GOMEMLIMIT or GOGC tuning to manage working set under container limits.
- Node.js/Python: Account for V8/heap and native buffers; consider --max-old-space-size for Node.

### CPU Limits and Latency

CPU limits can cause throttling that inflates tail latencies, especially under bursty load. Many teams remove CPU limits for latency-critical web services and rely on requests for fair sharing while retaining limits for batch or potentially runaway jobs. Measure before and after.

### Ephemeral Storage

Logs and temporary files can evict pods if ephemeral-storage limits are exceeded. If you use emptyDir or write logs to disk:

- Set requests/limits for ephemeral-storage
- Use log rotation and sidecar configurations

Example:

```
resources:
  requests:
    ephemeral-storage: "1Gi"
  limits:
    ephemeral-storage: "5Gi"
```

### Node Sizing and Bin Packing

- Smaller nodes give the scheduler more flexibility to pack disparate workloads; larger nodes can be more cost-effective if your workloads are homogenous.
- Align pod sizes (sum of requests) to node shapes. Avoid “fragmentation” where pods don’t fit into leftover gaps.

### Pod Priority and Preemption

Critical system workloads should have higher priority. For app workloads, accurate requests reduce the chance of preemption and avoid starvation of lower-priority pods.

### Pod Overhead

If you use RuntimeClass with pod overhead defined, Kubernetes accounts for per-pod overhead in scheduling. This matters for very small pods or high pod densities.

---

## A Step-by-Step Example From Raw Metrics to YAML

Assume you’ve collected 14 days of metrics for the “payments” deployment:

- CPU usage (5m rate) P70 = 220m, P95 = 450m
- Memory working set P50 = 400Mi, P95 = 780Mi, P99 = 900Mi
- No CPU throttling observed; occasional GC spikes in memory
- Latency SLO: p95 < 150ms

Decisions:

- CPU request = 250m (slightly above P70)
- No CPU limit (latency-sensitive service)
- Memory request = 800Mi (round up near P95)
- Memory limit = 1.2Gi (≈ 150% of request to avoid P99 spike OOMs)

YAML:

```
resources:
  requests:
    cpu: "250m"
    memory: "800Mi"
  limits:
    memory: "1200Mi"
```

Roll out to 10% of replicas, watch error budgets and OOMs for a week, then apply to all.

---

## Common Anti-Patterns and How to Fix Them

- Anti-pattern: No requests at all (BestEffort). Result: Unpredictable scheduling and eviction under pressure.
  Fix: Enforce a LimitRange with sensible defaults.

- Anti-pattern: CPU requests at 1 vCPU “just in case.”
  Fix: Use usage percentiles; start at P50–P70 and adjust.

- Anti-pattern: Memory limits far below P95 working set.
  Fix: Set request near P95 and limit with enough headroom to avoid OOMs under normal peaks.

- Anti-pattern: HPA and VPA both trying to manage CPU aggressively.
  Fix: Use HPA for CPU-based scaling; use VPA in Off/Initial or control only memory.

- Anti-pattern: Ignoring sidecars.
  Fix: Measure and request resources for each container.

- Anti-pattern: Assuming dev/stage usage equals prod.
  Fix: Observe in production with canaries; production traffic patterns are unique.

---

## Tooling and Automation

- Vertical Pod Autoscaler (VPA)
  - Pros: Builds recommendations from historical usage; can apply automatically
  - Use cases: Memory-heavy workloads, steady baselines, suggestions for human review
- Goldilocks (Fairwinds)
  - Pros: Visualizes VPA recommendations across namespaces; helpful dashboards
- Horizontal Pod Autoscaler (HPA)
  - Pros: Reactive scale-out on CPU/memory/custom metrics
  - Use cases: Front-end/web services, event-driven workloads
- KEDA
  - Pros: Scale on external metrics (Kafka lag, queue length, etc.)
- Kubecost (or similar)
  - Pros: Cost allocation per namespace/workload; track savings from rightsizing
- Sealos
  - Pros: For multi-tenant Kubernetes, Sealos provides a cloud-native platform to manage clusters, namespaces, and quotas with a consistent UI and policy framework. Pair rightsizing with per-team quotas and cost governance for sustainable operations. See sealos.io.

---

## Frequently Asked Questions

### Should I always set CPU limits?

No. CPU limits can cause throttling, increasing tail latencies. Many teams omit CPU limits for latency-sensitive services but keep reasonable CPU requests. Use CPU limits when you must prevent runaway CPU (e.g., batch jobs) or enforce strict multi-tenancy.

### How do I pick memory limits?

Start with memory request near the P95 of working set, then set limit 10–50% higher based on risk tolerance and spike behavior. Validate to avoid OOMKills.

### Can I use both HPA and VPA?

Yes, but avoid conflicts. A common pattern is HPA for CPU-based scaling and VPA in “Off” for recommendations or controlling only memory.

### How often should I revisit requests?

Monthly is a good cadence for most services. Also revisit after major code changes, traffic shifts, or dependency upgrades.

### What if my workload is extremely bursty?

- Consider higher CPU requests to avoid slow starts (or pre-warmed pods)
- Use HPA with a lower cooldown and scale-to-zero where appropriate (with KEDA)
- Provide generous memory headroom if bursts affect heap/allocations

---

## Cheat Sheet: Recommended Targets by Resource

| Dimension       | Baseline Target                       | Notes                                        |
| --------------- | ------------------------------------- | -------------------------------------------- |
| CPU Request     | P50–P70 of CPU usage (5m rate)        | Raise for latency-critical services          |
| CPU Limit       | Often omit; use only if necessary     | Prevents runaway but can cause throttling    |
| Memory Request  | P95 of working set                    | Round up; account for runtime overhead       |
| Memory Limit    | 110–150% of memory request            | Choose headroom based on spike patterns      |
| Ephemeral Store | Request/limit based on logs/temp peak | Add rotation; avoid surprise evictions       |
| HPA Target      | 60–75% average CPU utilization        | Tune per service; validate scaling stability |

---

## Putting It All Together: A Rightsizing Playbook

1. Instrument and collect: Ensure metrics-server and Prometheus are available; label workloads.
2. Baseline: Choose 7–14 days of representative traffic; compute percentiles.
3. Propose: Translate P70 CPU and P95 memory into requests; add sensible memory limits.
4. Test: Apply to a canary subset; watch throttling, OOMs, and SLOs.
5. Roll and monitor: Gradually apply cluster-wide; track cost and performance deltas.
6. Automate: Use VPA for recommendations; Goldilocks for visibility; HPA for scale-out.
7. Govern: Apply LimitRange and ResourceQuota; standardize defaults per namespace.
8. Iterate: Review monthly; adjust for seasonality and code changes.

For multi-tenant platforms like Sealos, combine this playbook with per-tenant quotas, namespaces, and dashboards to balance autonomy with governance.

---

## Conclusion

Rightsizing is one of the highest-ROI optimizations you can make in Kubernetes. By aligning CPU and memory requests with how your workloads actually behave, you:

- Cut waste that drives up node count and cloud spend
- Improve performance by reducing throttling and surprise evictions
- Enable more predictable autoscaling and fair multi-tenancy

Start with data: measure, pick sane percentiles, add headroom, and validate with canaries. Automate recommendations with VPA and visualize with tools like Goldilocks, then let HPA handle scale-out. Enforce good defaults with LimitRange and ResourceQuota so you never slip back into BestEffort chaos.

Do this well, and you’ll ship faster, sleep better, and pay only for the compute your apps really need.
