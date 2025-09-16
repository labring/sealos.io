---
title: "Unlocking Hidden Savings: A Guide to Using Spot Instances Safely in Kubernetes"
imageTitle: "Spot Instances in Kubernetes: Safe Savings"
description: Discover how to reduce Kubernetes costs by safely leveraging Spot Instances, with practical strategies for reliability and risk management. This guide covers workload selection, autoscaling, interruption handling, and monitoring to maximize savings without sacrificing availability.
date: 2025-09-13
tags:
  [
    "Kubernetes",
    "Spot Instances",
    "Cost Optimization",
    "Autoscaling",
    "Reliability",
    "Cloud Providers",
  ]
authors: ["default"]
---

The bill comes due at the end of the month. You open your cloud dashboard and the number isn’t just high—it’s surprising. You’ve tuned requests and limits, implemented autoscaling, and adopted efficient base images. But your compute line item still dwarfs everything else.

There’s a powerful lever most teams ignore: spot instances. With savings often exceeding 70%, spot capacity can transform your unit economics. But it comes with a catch—instability. The trick is not avoiding spot; it’s using it safely.

This guide shows you how to run spot instances in Kubernetes without putting availability at risk. You’ll learn what spot capacity is, why it matters, how it works across clouds, and precisely how to integrate it into your cluster with guardrails, patterns, and practical examples.

## What Are Spot Instances?

Cloud providers maintain pools of spare capacity. Spot instances let you run on that capacity at steep discounts, with the understanding that:

- Your instances can be interrupted at any time (with a short notice).
- Capacity availability and price are variable.
- You must architect for failure.

Different clouds use different names and policies:

- AWS: EC2 Spot Instances
- Google Cloud: Spot VMs and Preemptible VMs (preemptible have a 24-hour max lifetime)
- Azure: Spot Virtual Machines

### Cloud interruption differences at a glance

| Cloud | Name            | Typical interruption notice                                      | Max lifetime | Notes                                                               |
| ----- | --------------- | ---------------------------------------------------------------- | ------------ | ------------------------------------------------------------------- |
| AWS   | EC2 Spot        | ~2 minutes (Interruption notice), early rebalance recommendation | None         | Diversify instance types and AZs; use capacity-optimized allocation |
| GCP   | Spot VMs        | ~30 seconds via metadata                                         | None         | Cheapest; can be reclaimed anytime                                  |
| GCP   | Preemptible VMs | ~30 seconds via metadata                                         | 24 hours     | Lower price predictability; guaranteed max lifetime                 |
| Azure | Spot VMs        | ~30 seconds via Scheduled Events                                 | None         | Eviction policy: Deallocate or Delete                               |

Important: Notices are “best effort.” You must assume nodes can disappear with the indicated time window or even faster under rare conditions.

## Why Spot Instances Matter

- Massive cost reduction: 60–90% savings versus on-demand for many instance families.
- Elastic capacity: Burst for batch processing, training runs, or event-driven workloads.
- Sustainable utilization: Consume unused resources without long-term commitments.
- Better cost-to-result ratio: Redirect saved compute budget into innovation.

Spot isn’t a silver bullet for all workloads. It shines when you can handle interruption gracefully and scale horizontally.

## How Spot Works in Kubernetes

Kubernetes abstracts nodes. Whether your worker nodes are on-demand or spot, Pods schedule based on resource availability and constraints.

When a spot node is reclaimed:

- The node receives an interruption notice (time depends on provider).
- If you run an interruption handler, it can cordon and drain the node, triggering pod rescheduling.
- If the notice is too short or the handler is absent, Pods can be killed abruptly.
- The Cluster Autoscaler (or a provisioner like Karpenter) may add new capacity if pending Pods exist and policies allow.

Your goal is simple: ensure that important workloads avoid spot, opportunistic workloads prefer spot, and the system reacts to interruptions gracefully.

## Risk Assessment: What Should Run on Spot?

- Safe on spot (with safeguards)

  - Stateless web frontends behind a load balancer
  - API gateways with multiple replicas
  - Async workers and message consumers
  - Batch/ETL jobs, data processing, and build runners
  - ML training with checkpointing
  - Caches with clustered/replicated setups

- Risky or avoid on spot (unless you know what you’re doing)
  - Databases and quorum-based stateful systems (unless multi-replica and carefully configured)
  - Single-replica critical services
  - Control plane components (if self-managed; managed control planes are separate)

The pattern: keep a reliable baseline on on-demand nodes and burst the rest onto spot.

## Core Pattern: Separate Node Pools and Express Intent

Create two or more node groups (node pools):

- on-demand: resilient capacity for critical Pods
- spot: opportunistic capacity for scalable Pods

Label and taint your nodes so Pods go where they should.

### Taint spot nodes, tolerate in suitable Pods

- Taint spot worker nodes (via your node group or provisioner):

  - key: spot
  - value: "true"
  - effect: NoSchedule

- Add tolerations to Pods that are allowed to run on spot.

Example Pod snippet for a deployment that can run on spot:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker-api
spec:
  replicas: 6
  selector:
    matchLabels:
      app: worker-api
  template:
    metadata:
      labels:
        app: worker-api
        workload-class: opportunistic
    spec:
      tolerations:
        - key: "spot"
          operator: "Equal"
          value: "true"
          effect: "NoSchedule"
      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              preference:
                matchExpressions:
                  - key: node-capacity
                    operator: In
                    values: ["spot"]
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: kubernetes.io/os
                    operator: In
                    values: ["linux"]
      containers:
        - name: app
          image: ghcr.io/example/worker:1.2.3
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "1"
              memory: "1Gi"
          lifecycle:
            preStop:
              exec:
                command:
                  ["sh", "-c", "curl -s http://127.0.0.1:8080/drain && sleep 5"]
      terminationGracePeriodSeconds: 25
```

Notes:

- The taint prevents accidental scheduling; only Pods with a matching toleration can land on spot nodes.
- Node affinity “prefers” spot capacity but doesn’t require it; if spot is unavailable, Kubernetes can fall back to on-demand.

### Keep critical Pods away from spot

For critical workloads, force scheduling on on-demand nodes. Label your on-demand nodes with node-capacity=ondemand and use required nodeAffinity:

```yaml
spec:
  template:
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: node-capacity
                    operator: In
                    values: ["ondemand"]
```

Alternatively, taint on-demand nodes for system-critical usage and give those Pods the appropriate tolerations and higher priority classes.

## Graceful Interruption Handling

When a provider signals an impending reclaim, you want to:

1. Cordone the node (stop new Pods from scheduling there).
2. Drain Pods gracefully (honor PodDisruptionBudget and terminationGracePeriodSeconds).
3. Emit metrics and events for observability.
4. Optionally accelerate scale-up elsewhere to compensate.

### Use interruption handlers

- AWS: Node Termination Handler (NTH) watches the instance metadata for interruption notices and rebalance recommendations.
- Azure: Use Scheduled Events; tools like Azure Spot Interrupter or custom DaemonSet handlers.
- GCP: Watch the metadata server for termination signals.

Example: install AWS Node Termination Handler with Helm

```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm upgrade --install aws-node-termination-handler eks/aws-node-termination-handler \
  --namespace kube-system \
  --create-namespace \
  --set enableSpotInterruptionDraining=true \
  --set enableRebalanceDraining=true \
  --set nodeSelector."node-capacity"=spot \
  --set tolerations[0].key=spot \
  --set tolerations[0].operator=Equal \
  --set tolerations[0].value=true \
  --set tolerations[0].effect=NoSchedule
```

This ensures only spot nodes run the handler and that they are drained on notice.

### Tune termination behavior in Pods

- terminationGracePeriodSeconds: ensure this is realistic for your workload and fits the provider notice window (e.g., 25–60s for GCP/Azure, up to 90–110s for AWS).
- Use lifecycle preStop hooks to flush metrics, drain connections, or checkpoint state.
- Avoid long-running shutdown steps that exceed the notice window; rely on idempotent retries.

### Protect availability with PodDisruptionBudget (PDB)

PDBs don’t prevent involuntary disruption, but they can reduce cascading failures and enforce minimum availability during voluntary operations (drain, upgrades).

Example PDB for a frontend with 6 replicas:

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: frontend-pdb
spec:
  minAvailable: 4
  selector:
    matchLabels:
      app: frontend
```

### Control scheduling priorities

Use PriorityClasses to ensure critical system Pods and core services preempt opportunistic ones when capacity is tight.

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: critical-on-demand
value: 100000
globalDefault: false
description: "Critical services must land on on-demand capacity"
```

Assign this to critical Deployments via spec.priorityClassName.

## Autoscaling and Provisioning for Spot

### Cluster Autoscaler with separated node groups

Run the Cluster Autoscaler (CA) with at least two node groups:

- ng-ondemand (labels: node-capacity=ondemand)
- ng-spot (labels: node-capacity=spot; taint: spot=true:NoSchedule)

Tips:

- Enable balance-similar-node-groups to reduce hotspots:
  - --balance-similar-node-groups=true
- Prefer certain node groups for scale-ups with the priority expander.

Example priority expander ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-autoscaler-priority-expander
  namespace: kube-system
data:
  priorities: |
    10:
      - .*ng-ondemand.*
    50:
      - .*ng-spot.*
```

Higher number = higher priority. In this example, the autoscaler tries spot first for Pods that can tolerate spot, and falls back to on-demand otherwise.

### Karpenter as a dynamic provisioner

Karpenter can launch nodes per Pod requirements, across instance types and capacity types, including spot.

Example Karpenter Provisioner (AWS):

```yaml
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: spot-pool
spec:
  template:
    metadata:
      labels:
        node-capacity: spot
    spec:
      taints:
        - key: spot
          value: "true"
          effect: NoSchedule
      requirements:
        - key: "karpenter.k8s.aws/instance-family"
          operator: In
          values: ["m5", "m6i", "c5", "c6i", "r5", "r6i"]
        - key: "karpenter.k8s.aws/instance-category"
          operator: In
          values: ["c", "m", "r"]
        - key: "karpenter.sh/capacity-type"
          operator: In
          values: ["spot"]
        - key: "topology.kubernetes.io/zone"
          operator: In
          values: ["us-east-1a", "us-east-1b", "us-east-1c"]
  disruption:
    consolidationPolicy: WhenUnderutilized
    consolidateAfter: 2m
---
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: ondemand-pool
spec:
  template:
    metadata:
      labels:
        node-capacity: ondemand
    spec:
      requirements:
        - key: "karpenter.sh/capacity-type"
          operator: In
          values: ["on-demand"]
```

Best practices with Karpenter:

- Diversify instance types and zones.
- Enable consolidation to reduce fragmentation.
- Use requirements that reflect workload needs (CPU, memory, architecture, GPU).

### Cloud allocation strategies

- AWS Auto Scaling Groups: Use “capacity-optimized” allocation strategy and diversified instance types across AZs for Spot.
- Azure VMSS: Mix Spot with on-demand, set eviction policy (Deallocate helps preserve OS disk for faster reuse).
- GCP Managed Instance Groups: Use Spot or Preemptible templates; distribute across zones; prepare for 30-second notice.

## Building Spot-Resilient Workloads

### Stateless services: shift a percentage to spot

Pattern:

- Keep baseline replicas on on-demand.
- Run additional replicas on spot with tolerant scheduling.
- Use HPA to scale opportunistically.

Example of a split approach:

- frontend-ondemand: 3 replicas, required on-demand nodeAffinity, high PriorityClass.
- frontend-spot: 5 replicas, tolerates spot, preferred on spot, lower priority.

This way, spot interruptions reduce capacity but don’t take down the service.

### Batch jobs: retry and checkpoint

- Use Kubernetes Jobs with backoffLimit for retriable tasks.
- Store progress in durable storage (object store, database).
- Add preStop to flush state quickly.

Example Job:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: etl-daily
spec:
  backoffLimit: 6
  template:
    metadata:
      labels:
        app: etl
        workload-class: opportunistic
    spec:
      restartPolicy: Never
      tolerations:
        - key: "spot"
          operator: "Equal"
          value: "true"
          effect: "NoSchedule"
      containers:
        - name: etl
          image: ghcr.io/example/etl:2.0.1
          env:
            - name: CHECKPOINT_URI
              value: s3://acme-etl/checkpoints/run-{{.PodName}}
          lifecycle:
            preStop:
              exec:
                command:
                  ["sh", "-c", "python /app/checkpoint.py --to $CHECKPOINT_URI"]
          resources:
            requests:
              cpu: "2"
              memory: "4Gi"
          volumeMounts:
            - name: scratch
              mountPath: /scratch
      volumes:
        - name: scratch
          emptyDir: {}
```

This design relies on saving incremental progress so the next retry resumes rather than restarts.

### ML training and GPU workloads

- Save model checkpoints to object storage periodically.
- Use spot for data-parallel training workers; keep the coordinator/parameter server on on-demand.
- For large GPU nodes, consider mixed strategies and increased replication to avoid long pauses.

### CI/CD runners

- Great spot candidates; ephemeral workloads with retries.
- Isolate runners in dedicated namespaces and node pools.
- Cache artifacts in shared storage to reduce refetch time after interruptions.

## Scheduling Resilience: Policies That Matter

- Pod Topology Spread: Avoid placing too many replicas on a single failure domain (node, rack, zone). Helps reduce correlated spot evictions.
- Resource requests: Accurate requests reduce overpacking and shrink termination blast radius.
- Anti-affinity: Spread replicas across nodes to limit simultaneous loss.

Example topology spread:

```yaml
spec:
  template:
    spec:
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels:
              app: frontend
```

## Guardrails: Don’t Let Critical Pods Land on Spot

Admission policies and labels are your last line of defense.

- Use OPA Gatekeeper or Kyverno to block Pods without tolerations from running on spot nodes, or to block specific namespaces from tolerating spot.
- Enforce PriorityClass usage for critical namespaces.
- Require nodeAffinity=ondemand for stateful sets in protected namespaces.

Example Kyverno policy (conceptual):

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: no-spot-for-critical-ns
spec:
  validationFailureAction: enforce
  rules:
    - name: disallow-spot
      match:
        resources:
          kinds:
            - Pod
          namespaces:
            - prod-core
      validate:
        message: "Pods in prod-core must not tolerate spot"
        pattern:
          spec:
            tolerations:
              - key: "spot"
                operator: "Equal"
                value: "false"
```

Adjust to your exact rules. The point: encode intent as policy.

## Observability, SLOs, and Cost Feedback

- Track spot interruption rates, node drains, and Pod evictions.
- Alert on:
  - Rising Pending Pod counts by priority
  - Frequent node churn
  - PDB violations
  - HPA oscillations caused by capacity loss
- Record metrics for:
  - Provisioner/Autoscaler scale-up/scale-down events
  - Node pool capacity and utilization split (spot vs on-demand)
  - Cost per workload or namespace (labels and billing exports)
- Define availability SLOs and set a “spot budget”: e.g., 60–80% of non-critical workloads on spot, cap at 30–40% for mixed critical stacks, adjust by interruption rates.

Platforms that integrate cluster management, multi-tenant cost visibility, and autoscaling make this easier. For example, Sealos (https://sealos.io) provides a Kubernetes-first cloud operating platform where you can manage clusters, isolate tenants with namespaces, and apply policy and cost controls. If you maintain multiple teams or environments, consolidating governance and budgets in one place helps you safely expand spot usage without losing track of risk or spend.

## Cloud-Specific Notes

- AWS

  - 2-minute interruption notices via Instance Metadata Service; also consume “rebalance recommendations” to proactively drain.
  - Use capacity-optimized allocation and diversify instance types and AZs.
  - AWS Node Termination Handler integrates well with EKS and self-managed clusters.

- GCP

  - 30-second termination notice; plan short graceful termination paths.
  - Preemptible VMs (max 24 hours) vs Spot VMs (no max lifetime, can be reclaimed anytime).
  - Use MIGs with multiple zones and Autoscaler; watch for aggressive preemption in busy regions.

- Azure
  - ~30-second eviction notice via Scheduled Events; choose Deallocate to preserve OS disks if helpful.
  - VMSS mixed mode supports both Spot and Standard; consider priorities and max price.
  - For AKS, node pools can be Spot with eviction rate visibility.

## A Step-by-Step Rollout Plan

1. Define policies and classifications

   - Tag workloads as critical, important, opportunistic.
   - Decide what percentage of capacity can be spot initially (e.g., 20–30%).

2. Create separate node pools

   - One on-demand, one spot.
   - Apply labels and taints.

3. Enable interruption handling

   - Deploy cloud-specific handlers on spot nodes.
   - Verify cordon/drain events in test.

4. Adjust scheduling and protection

   - Add tolerations and nodeAffinity to opportunistic Pods.
   - Apply PriorityClasses and PDBs to critical services.

5. Configure autoscaling

   - Cluster Autoscaler with priority expander or Karpenter with diversified requirements.
   - Set sane scale-up/down cooldowns.

6. Test failure scenarios

   - Force-drain a spot node during business hours in staging.
   - Validate no SLO breaches and acceptable error rates.

7. Roll out gradually

   - Move stateless services first.
   - Then batch jobs and CI runners.
   - Consider ML training with checkpointing.

8. Observe and iterate
   - Monitor interruption rates and cost savings.
   - Tune replica splits and spot ratio.
   - Document playbooks for on-call engineers.

## Common Pitfalls and How to Avoid Them

- Letting critical Pods land on spot

  - Fix: taints and strict nodeAffinity; admission policies.

- Assuming terminationGracePeriodSeconds is enough

  - Fix: ensure preStop logic completes within the cloud notice window; test it.

- Single instance type in spot pools

  - Fix: diversify across multiple families and AZs.

- No spread constraints

  - Fix: topology spread and anti-affinity for replicas.

- Overreliance on spot for baseline capacity

  - Fix: maintain an on-demand baseline sized to your minimum steady-state demand.

- Ignoring observability
  - Fix: alert on Pending Pods, PDB violations, and rising eviction rates.

## Practical Recipes

### Mixed replica strategy for a service

- Keep N baseline replicas on on-demand (PriorityClass=critical-on-demand).
- Add M opportunistic replicas on spot (lower priority).
- Configure HPA to scale opportunistic deployment first.

### Graceful drain in the app

- Provide a /drain endpoint to stop accepting new requests and flush.
- Keep terminationGracePeriodSeconds short and predictable.
- Use connection draining at the load balancer for extra safety.

### Stateful systems

- Prefer multi-replica, quorum-based designs if you must consider spot.
- Pin leaders or quorum majority to on-demand; allow followers on spot.
- Carefully test failure and rebalance scenarios.

## Quick Checklist

- Separate node pools: on-demand and spot
- Taints on spot nodes; tolerations only for eligible Pods
- Node affinity and PriorityClasses to enforce placement
- Interruption handlers deployed and tested
- PDBs, topology spread, and anti-affinity for availability
- Autoscaling configured (CA/Karpenter) with diversification
- PreStop hooks and realistic termination windows
- Checkpointing for batch/ML workloads
- Observability and alerts for interruptions and Pending Pods
- Policy enforcement (Gatekeeper/Kyverno) to prevent drift
- Gradual rollout with SLO-aware targets

## FAQ

- Will spot save money if my workloads are small?

  - Yes, especially for bursty or batch tasks. Even modest clusters see significant savings when opportunistic capacity moves to spot.

- Can I run everything on spot?

  - Not safely. Keep a baseline on on-demand to preserve availability. Use spot for the elastic portion.

- What about data loss?

  - Stateless services are safe. For stateful, use replication, durable storage, and checkpointing. Assume nodes can disappear.

- How do I choose termination windows?

  - Match or undershoot the provider notice (30s for GCP/Azure, ~120s for AWS). Test with forced drains.

- Should I set a max price for AWS Spot?
  - The common recommendation is to avoid setting a custom MaxPrice; use capacity-optimized strategy and diversify to improve stability.

## Conclusion

Spot instances are one of the most effective levers for cutting Kubernetes compute costs—often by more than half—without compromising reliability. The key is intent and isolation:

- Separate node pools for on-demand and spot.
- Use taints, tolerations, and affinity to control placement.
- Add interruption handlers for graceful drains.
- Protect availability with PDBs, topology spread, and priorities.
- Provision smartly with Autoscaler or Karpenter, diversifying types and zones.
- Observe, alert, and iterate with clear SLOs and a spot budget.

Adopt spot where it makes sense first—stateless frontends, batch jobs, CI runners—and expand as your confidence grows. Whether you roll your own or use a platform like Sealos (https://sealos.io) to centralize cluster management, policy, and cost visibility, the outcome is the same: lower bills, higher efficiency, and a more resilient architecture that treats interruptions as a normal, well-handled event rather than an outage.

Unlock those hidden savings—with the right guardrails, spot capacity becomes a competitive advantage, not a gamble.
