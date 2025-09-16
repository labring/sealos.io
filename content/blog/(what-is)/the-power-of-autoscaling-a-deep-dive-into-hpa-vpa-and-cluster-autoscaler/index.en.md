---
title: 'The Power of Autoscaling: A Deep Dive into HPA, VPA, and Cluster Autoscaler'
imageTitle: 'Autoscaling Deep Dive: HPA, VPA & Cluster Autoscaler'
description: Explore how Horizontal Pod Autoscaler, Vertical Pod Autoscaler, and Cluster Autoscaler work together to optimize resource utilization, cost, and performance in Kubernetes environments. This guide breaks down mechanisms, configurations, and best practices to implement resilient autoscaling.
date: 2025-09-18
tags: ['Kubernetes', 'Autoscaling', 'HPA', 'VPA', 'Cluster Autoscaler']
authors: ['default']
---

Traffic doesn’t arrive politely. It surges during flash sales, dips at night, spikes after a product launch, and occasionally goes viral at 3:00 a.m. Without the ability to expand and contract capacity automatically, you either pay for idle infrastructure or risk degradation and outages at the worst possible moment.

Autoscaling in Kubernetes—spanning pods and nodes—promises a responsive, cost-effective, and resilient system. But it’s also nuanced. Horizontal Pod Autoscaler (HPA), Vertical Pod Autoscaler (VPA), and Cluster Autoscaler (CA) each address different layers of elasticity. Getting them right is often the difference between a smooth surge and a midnight firefight.

This article dives deeply into each autoscaler: what it is, why it matters, how it works, practical configuration, and how to combine them safely.

---

## Autoscaling in Kubernetes: A mental model

Kubernetes autoscaling operates at three layers:

- Horizontal: Change the number of pod replicas for a workload (HPA).
- Vertical: Change the CPU/memory resources requested by pods (VPA).
- Cluster-level: Change the number of nodes to fit pending pods (Cluster Autoscaler).

Think of it as a chain:

- HPA increases or decreases pod count to meet load targets.
- VPA right-sizes pods so each replica has enough CPU/memory.
- Cluster Autoscaler adds or removes nodes so the cluster has just enough capacity to run the desired pods.

When tuned together, these three create a responsive, efficient system. When misconfigured, they can fight each other, thrash, or fail to activate when you need them most.

---

## Horizontal Pod Autoscaler (HPA)

### What HPA is and why it’s important

HPA adjusts the number of pod replicas for a target workload (typically a Deployment, StatefulSet, or ReplicaSet) based on observed metrics. It’s the most common autoscaling mechanism because it:

- Responds quickly to load changes.
- Keeps replicas stateless and scalable.
- Supports multiple metric sources (CPU, memory, custom, external).

Use HPA when:

- Your service is horizontally scalable (stateless, or state is externalized).
- You can measure a scalable signal (CPU, requests per second, queue length, latency SLOs via custom metrics).

### How HPA works (the essentials)

- HPA periodically fetches metrics via the Kubernetes Metrics API and/or Custom/External Metrics APIs.
- It calculates the desired replica count using a target-tracking algorithm.
- For resource metrics like CPU, a common formula is:
  - desiredReplicas = ceil(currentReplicas × currentMetric / targetMetric)
- When multiple metrics are specified, HPA computes a proposed replica count per metric and uses the highest value (to avoid under-scaling).

Key inputs and behavior controls:

- Metrics:
  - Resource metrics: CPU and memory (from metrics-server).
  - Custom/pod/object metrics: typically via a Prometheus adapter.
  - External metrics: from sources outside the cluster (e.g., cloud service queues).
- Stabilization windows and scaling policies:
  - Stabilization windows dampen flapping by preventing immediate scale-down after a spike.
  - Policies allow setting max scale step changes per unit time.

### HPA example (v2 API) with behavior and mixed metrics

Below is an example that scales based on CPU and a custom per-pod metric http_requests_per_second. It also configures scale-up/down behavior to reduce thrash.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-frontend-hpa
  namespace: apps
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-frontend
  minReplicas: 3
  maxReplicas: 50
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: '20'
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0
      selectPolicy: Max
      policies:
        - type: Percent
          value: 100
          periodSeconds: 60
        - type: Pods
          value: 10
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      selectPolicy: Max
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
```

Notes:

- averageUtilization: 70 means keep CPU usage around 70% of requested CPU across pods.
- The Pods metric averageValue: "20" means target 20 requests/s per pod; if actual is 100 total requests/s across 4 pods (25 per pod), HPA will scale up.
- scaleDown stabilization window of 300 seconds prevents immediate scale-in after a transient drop.

### Metrics backends you’ll need

- metrics-server: Required for CPU/memory resource metrics.
- Prometheus Adapter: Expose Prometheus queries as Custom/External Metrics. This enables scaling on QPS, latency, queue depth, etc.
- KEDA (Kubernetes Event-Driven Autoscaling): A powerful complement to HPA that exposes external triggers (Kafka lag, RabbitMQ, cloud queues) and manages HPAs for you.

### Practical tips for HPA

- Pick the right signal:
  - CPU works for CPU-bound work.
  - For web services, QPS per pod or concurrency per pod is often better.
  - For queues, use lag/backlog signals (KEDA makes this easy).
- Avoid memory utilization as the sole signal for HPA:
  - Memory pressure is sticky; pods may not release memory quickly.
  - Prefer VPA for memory right-sizing; use HPA for load.
- Set sane minReplicas:
  - Keep a warm baseline to avoid cold starts during regular traffic spikes.
- Use behavior policies:
  - Limit scale-up step changes and slow down scale-down to reduce thrashing.

Useful commands:

- kubectl top pods -n apps
- kubectl describe hpa web-frontend-hpa -n apps

---

## Vertical Pod Autoscaler (VPA)

### What VPA is and why it matters

VPA automatically adjusts pod CPU/memory requests (and optionally limits) to match actual usage. It’s invaluable for:

- Right-sizing workloads to reduce waste or prevent OOMKills.
- Batch jobs and stateful services that aren’t easily sharded horizontally.
- Establishing baseline resource requests for new services.

Why it’s important:

- HPA depends on requests (e.g., CPU utilization is measured against requests). Bad requests lead to incorrect HPA decisions.
- Right-sized requests improve bin-packing and cluster efficiency, lowering costs.

### How VPA works (components and modes)

VPA includes:

- Recommender: Watches historical usage and recommends requests.
- Updater: Evicts pods that are under/over-provisioned so they can be recreated with new requests.
- Admission Controller: Mutates pod specs on creation to apply recommendations.

Update modes:

- Off: No changes; only recommendations are produced. Good for observe-first.
- Initial: Sets recommended requests on pod creation but doesn’t evict running pods.
- Auto: Can evict and recreate pods to apply updated recommendations.

VPA recommends CPU/memory based on usage percentiles and safety margins, avoiding extreme spikes. Recommendations are exposed in the VPA object status.

### VPA example (observe first, then automate)

Start with observe-only to build confidence:

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: web-frontend-vpa
  namespace: apps
spec:
  targetRef:
    apiVersion: 'apps/v1'
    kind: Deployment
    name: web-frontend
  updatePolicy:
    updateMode: 'Off' # Start with Off; switch to Initial or Auto later
  resourcePolicy:
    containerPolicies:
      - containerName: '*'
        controlledValues: 'RequestsOnly' # Avoid changing limits at first
        minAllowed:
          cpu: '100m'
          memory: '128Mi'
        maxAllowed:
          cpu: '2000m'
          memory: '2Gi'
```

After a week of traffic, inspect:

- kubectl describe vpa web-frontend-vpa -n apps
- Review recommendations and consider switching updateMode to Initial or Auto.

Important compatibility note:

- Do not run HPA and VPA on the same resource (CPU/memory) for the same workload. If you need both, use HPA with a custom metric (e.g., QPS) and let VPA manage CPU/memory requests.

### Practical applications for VPA

- Batch and ML workloads: Right-size heavy jobs to avoid over-requesting.
- Services with memory unpredictability: Prevent OOMs by nudging requests upward.
- Establish baselines for new microservices: Run Off mode to gather data, then apply.

---

## Cluster Autoscaler (CA)

### What CA is and why it matters

Cluster Autoscaler adjusts the number of nodes in your cluster to fit pending pods. It interacts with your cloud provider or cluster manager to:

- Scale up: Add nodes when pods are unschedulable due to insufficient resources.
- Scale down: Remove underutilized nodes safely to save costs.

Without CA, HPA can scale pods up all it wants, but if there are no nodes to host them, they remain pending. CA closes the loop at the infrastructure level.

### How Cluster Autoscaler works

- Watches for unschedulable pods.
- Simulates scheduling across node groups and decides whether adding nodes could help.
- Chooses which node group to scale using an “expander” strategy (e.g., least-waste, most-pods, price).
- For scale-down, identifies nodes that are underutilized or empty for a configurable time window and tries to drain them, respecting:
  - Pod Disruption Budgets (PDBs)
  - DaemonSets
  - Pods using local storage or with restrictive disruption policies
  - System critical priorities

It won’t remove a node if doing so violates PDBs or cannot safely evict pods.

### A typical CA deployment (conceptual flags)

You usually deploy CA as a Deployment in kube-system with provider-specific flags. This snippet shows common tuning flags (names vary by provider):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cluster-autoscaler
  namespace: kube-system
spec:
  template:
    spec:
      containers:
        - name: cluster-autoscaler
          image: k8s.gcr.io/autoscaling/cluster-autoscaler:v1.29.0
          command:
            - ./cluster-autoscaler
            - --cloud-provider=YOUR_PROVIDER
            - --nodes=1:50:node-group-name
            - --balance-similar-node-groups=true
            - --expander=least-waste
            - --scale-down-enabled=true
            - --scale-down-utilization-threshold=0.5
            - --scale-down-unneeded-time=10m
            - --scan-interval=10s
```

Provider-specific integrations (GKE, EKS, AKS, on-prem, etc.) differ in setup. If you’re on a managed Kubernetes platform, check if CA is built-in or configured through your provider’s console.

### Practical tips for CA

- Use node groups for different workload classes (e.g., CPU-optimized vs. memory-optimized).
- Label/taint nodes and match with workload tolerations to ensure pods land on appropriate nodes.
- Respect PDBs but set them realistically; overly strict PDBs can block scale-down indefinitely.
- Consider an overprovisioning “buffer” with low-priority pods:
  - Run tiny pause pods with a very low priority. CA scales up to fit them, keeping warm capacity ready.
  - When real workload arrives, these buffer pods are preempted quickly.

Alternatives and complements:

- Karpenter (AWS): A dynamic node provisioning project that can improve bin-packing and reduce scheduling latency.
- Descheduler: Not an autoscaler but helps rebalance pods, improving long-term efficiency.

---

## Choosing between HPA, VPA, and CA

Here’s a quick comparison:

| Dimension      | HPA                                  | VPA                                  | Cluster Autoscaler                    |
| -------------- | ------------------------------------ | ------------------------------------ | ------------------------------------- |
| Scales         | Number of pods                       | CPU/memory per pod (requests/limits) | Number of nodes                       |
| Primary signal | CPU, memory, custom/external metrics | Historical resource usage            | Unschedulable pods / node utilization |
| Reaction speed | Fast (seconds to minutes)            | Moderate (minutes to hours)          | Moderate (minutes)                    |
| Best for       | Stateless services, event/HTTP load  | Right-sizing, batch/stateful         | Cost control, capacity management     |
| Risks          | Thrashing if mis-tuned               | Evictions can cause disruptions      | Scale-down blocked by PDBs, taints    |

Guidance:

- Start with HPA for stateless services.
- Add VPA in Off/Initial mode to right-size requests, then consider Auto.
- Ensure CA is enabled in cloud environments so scale-outs have someplace to land.

---

## Combining autoscalers safely

Patterns that work well:

- HPA on custom signal + VPA for CPU/memory
  - Example: Web service scales on QPS per pod (HPA) while VPA sets CPU/memory requests.
- HPA for horizontal elasticity + CA for cluster capacity
  - HPA adds replicas; CA adds nodes if needed.
- VPA for batch jobs + CA for elastic node pools
  - VPA ensures jobs get sufficient resources; CA adds nodes to run them.

Avoid:

- HPA and VPA both acting on CPU/memory for the same target. If HPA uses CPU utilization (derived from requests) and VPA changes requests, feedback loops and oscillations can occur.

Use guardrails:

- Stabilization windows and scale policies in HPA.
- Reasonable min/max in VPA resourcePolicy.
- PDBs that allow controlled disruption but don’t block all scale-downs.

---

## Scaling on real signals: Custom metrics and KEDA

If CPU doesn’t correlate with load, use better signals:

- Requests per second per pod
- Active connections
- Queue length / lag
- 95th percentile latency versus an SLO target

Two common approaches:

- Prometheus Adapter: exposes Prometheus queries as Custom/External Metrics. You define rules mapping metrics to API endpoints HPA can consume.
- KEDA: defines ScaledObjects that connect to event sources (Kafka, RabbitMQ, Prometheus, Azure Queue, etc.) and manages the HPA for you.

Example: KEDA scaling on Kafka lag

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: orders-consumer-so
  namespace: apps
spec:
  scaleTargetRef:
    kind: Deployment
    name: orders-consumer
  minReplicaCount: 1
  maxReplicaCount: 100
  triggers:
    - type: kafka
      metadata:
        bootstrapServers: my-kafka:9092
        consumerGroup: orders-group
        topic: orders
        lagThreshold: '1000'
```

KEDA calculates desired replicas from lag and updates an HPA behind the scenes.

---

## Observability and tuning

To make autoscalers effective, close the loop with measurement and feedback:

- Monitor autoscaler events:
  - kubectl describe hpa/vpa deployments to see scale decisions and reasons.
- Track key metrics:
  - HPA: desired vs. current replicas, metric values, stabilization triggers.
  - VPA: recommendation ranges, eviction counts, pod restarts.
  - CA: pending pods, scale-up/down events, blocked scale-down reasons.
- Alert on anomalies:
  - Repeated oscillations, constant close-to-max replicas, chronic pending pods.
- A/B test policies:
  - Try different stabilization windows and scale step limits in staging.
- Warm-up times and readiness:
  - Consider container start times and cache warm-ups when setting minReplicas and scale-up steps.

---

## Common pitfalls and how to avoid them

| Pitfall                   | Symptom                                | Mitigation                                                   |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------ |
| CPU as a poor proxy       | HPA flaps or lags load                 | Use custom metrics aligned with SLOs (QPS, latency, queue)   |
| Overaggressive scale-down | Traffic “sawtooth” and cold starts     | Increase scaleDown stabilization window; set minReplicas     |
| HPA + VPA conflict        | Replica oscillation after VPA updates  | Use HPA on custom metrics; let VPA manage CPU/memory         |
| CA blocked by PDBs        | Nodes never scale down                 | Relax PDBs; allow some disruptions during low traffic        |
| Node taints mismatch      | Pods stay pending during scale-up      | Align taints/tolerations; ensure CA has correct node groups  |
| Memory-driven HPA         | Scale decisions don’t resolve pressure | Use VPA for memory; HPA on CPU or custom signal              |
| Missing metrics backend   | HPA in “Unknown” state                 | Install metrics-server; configure Prometheus Adapter or KEDA |

---

## End-to-end example: Putting it all together

Scenario: You operate a web frontend and a background orders consumer. You want smooth scaling during traffic spikes and cost efficiency overnight.

1. Right-size requests with VPA in observe mode:

- Deploy VPA with updateMode: Off for both workloads.
- After a week, apply recommendations with Initial mode to set baseline requests on new pods.

2. Scale web frontend with HPA on QPS and CPU:

- HPA targets 70% CPU and 20 RPS per pod, with stabilization windows. Min replicas set to keep cache warm.

3. Scale orders consumer with KEDA on Kafka lag:

- KEDA ScaledObject ensures consumers scale with backlog, reducing latency during spikes.

4. Enable Cluster Autoscaler:

- CA configured with least-waste expander and appropriate node groups (e.g., general-purpose for web, compute-optimized for consumers).
- Add a tiny overprovisioning buffer using a low-priority Deployment to reduce cold-start risk.

5. Observe and iterate:

- Monitor SLOs (99th percentile latency), HPA decisions, VPA recommendations, CA scale events.
- Tune scale step sizes and stabilization windows to eliminate oscillation.
- Confirm PDBs allow safe but effective scale-down.

---

## Running autoscaling on Sealos

If you prefer a cloud-native platform that makes Kubernetes easier to operate, Sealos (https://sealos.io) provides a multi-tenant cloud OS experience where you can run containerized apps with built-in Kubernetes under the hood. On Sealos:

- Deploy your workloads using a simple application workflow while still benefiting from Kubernetes primitives like HPA and VPA.
- Integrate metrics (e.g., Prometheus) and autoscaling policies without standing up all components from scratch.
- Manage cluster resources and costs more transparently, including node scaling with underlying infrastructure.

This can be especially useful for teams that want Kubernetes-level control with a simpler operational surface for autoscaling.

---

## Practical checklist

- Install and verify metrics-server.
- Choose your scaling signals:
  - CPU for CPU-bound, custom metrics for user load, KEDA for external event sources.
- Start VPA in Off mode to gather recommendations; consider Initial or Auto later.
- Configure HPA with:
  - Min/max replicas
  - Stabilization windows and scale policies
  - Mixed metrics if needed (CPU + custom)
- Enable Cluster Autoscaler (or provider equivalent), validate:
  - Node groups and labels/taints
  - PDBs don’t block scale-down entirely
  - Expander strategy fits your cost/perf goals
- Add observability: dashboards for HPA/VPA/CA decisions and SLOs.
- Load-test before production to validate behavior under stress.

---

## FAQs

- Can I use HPA and VPA together?

  - Yes, but avoid both acting on CPU/memory for the same workload. A common pattern is VPA managing CPU/memory while HPA scales on custom metrics like QPS.

- How fast will autoscaling react?

  - HPA can respond in tens of seconds to a couple of minutes depending on metrics resolution and stabilization. CA adds nodes in minutes. VPA is slower as it relies on historical data.

- Do I need Prometheus to use custom metrics?

  - Not strictly, but Prometheus + Prometheus Adapter is a popular and flexible path. KEDA provides many external triggers without custom adapter complexity.

- What about stateful services?
  - Stateful workloads can use VPA; HPA may be more constrained. Ensure disruption policies and readiness/liveness probes are tuned to avoid data loss.

---

## Conclusion: Autoscaling as a competitive advantage

Autoscaling isn’t just a cost-control tool—it’s operational leverage. HPA keeps services responsive by adapting replicas to demand. VPA quietly right-sizes resources to keep workloads healthy and efficient. Cluster Autoscaler ensures infrastructure elasticity so your pods have room to run.

Together, they transform your cluster into an adaptive system that meets user demand, protects SLOs, and avoids paying for idle capacity. Start with good signals, add guardrails (stabilization, min replicas, PDBs), and iterate with data. Whether you run Kubernetes on your own, on a managed cloud, or via a platform like Sealos, mastering autoscaling will help you ride the next traffic spike—not be crushed by it.
