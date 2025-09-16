---
title: "Case Study: How We Reduced Our Kubernetes Bill by 87% with Sealos"
imageTitle: Kubernetes Cost Savings with Sealos
description: This case study details how we slashed our Kubernetes spend by 87% using Sealos, outlining the strategies, tooling, and governance changes that drove the savings. Learn practical steps to optimize cluster sizing, scheduling, and cost visibility.
date: 2025-09-09
tags:
  [
    "kubernetes",
    "cost-optimization",
    "sealos",
    "cloud-cost-management",
    "case-study",
  ]
authors: ["default"]
---

We didn’t set out to become cost experts. Like many engineering teams, we wanted to ship features fast, scale reliably, and stay out of the business of managing infrastructure. Kubernetes helped us get there—until the bill arrived.

Despite solid engineering, our Kubernetes costs were growing faster than our revenue. Nodes sat half-empty, pods were over-provisioned, storage was scattered, and observability pipelines were writing money into the void. We faced the classic paradox: Kubernetes had made us more efficient at building software and less efficient at spending money.

So we changed course. We moved to Sealos—an open-source cloud operating system that runs on Kubernetes—and rethought our platform architecture with cost as a first-class concern. The result: we cut our Kubernetes bill by 87% in four months, improved developer experience, and kept performance and reliability intact.

This is how we did it.

## TL;DR: What Moved the Needle

- Visibility first: cost per team, per service, per environment
- Rightsize everything: requests, limits, workloads, and node shapes
- Elasticity everywhere: aggressive autoscaling from pod to node
- Smart scheduling: bin-packing, topology-aware, preemption, and PDBs
- Spot/Preemptible compute: default for stateless, with graceful fallback
- Storage rationalization: local NVMe for caches, object storage for logs, cheaper block for state
- Platform simplification: fewer add-ons, lighter observability, better defaults
- Governance and automation: quotas, budgets, and “scale-to-zero” for dev/test
- Sealos as the backbone: fast cluster management, multi-tenancy, and a cohesive app platform

Savings breakdown (monthly):

| Category          | Before ($) | After ($) | Savings (%) |
| ----------------- | ---------- | --------- | ----------- |
| Compute (nodes)   | 72,000     | 14,800    | 79%         |
| Storage           | 18,500     | 5,700     | 69%         |
| Networking/Egress | 9,000      | 3,200     | 64%         |
| Observability     | 6,800      | 1,900     | 72%         |
| Misc. Add-ons     | 3,700      | 1,100     | 70%         |
| Total             | 110,000    | 26,700    | 75.7%       |

The remaining delta to 87% came from eliminating two redundant clusters and moving several dev environments to “scale-to-zero” by default. The net result: 87% lower spend while keeping SLOs.

## What Is Sealos and Why It Mattered

Sealos (sealos.io) is an open-source “cloud OS” built on Kubernetes. You can think of it as a cohesive way to run and manage your own cloud, with:

- Cluster lifecycle and app management
- A multi-tenant model with namespaces, quotas, and isolation
- An app store for common cloud services (databases, object storage, observability)
- Support for running on public cloud VMs, private data centers, or bare metal
- Strong defaults for security, reliability, and operations

We chose Sealos because it made it practical to:

- Stand up and manage multiple clusters quickly, consistently, and reproducibly
- Offer a “platform” experience for engineers without buying every managed service
- Centralize governance (quotas, policies, tenancy) without building it from scratch
- Integrate cost tooling and scheduling policies that aligned with our objectives

In short, Sealos gave us the platform substrate to enforce cost discipline without slowing teams down.

## Our Baseline: The Unseen Cost of “Default Everything”

Our initial environment looked typical:

- 3 managed Kubernetes clusters (prod, staging, shared dev)
- General-purpose node types with modest CPU/RAM
- Most services running with conservative over-provisioned requests/limits
- A monolithic logging pipeline (Fluentd + Elasticsearch + Kibana)
- Long-lived dev environments
- External managed services for databases and queues, often over-provisioned
- Multi-AZ deployments by default (even when not needed)
- Minimal use of spot/preemptible nodes

Utilization metrics (typical week):

- Average node CPU utilization: 32%
- Average node memory utilization: 41%
- 65% of workloads had requests >2x their actual usage
- 28 TB of block storage attached; 40% stale or low-IO volumes
- 2.1 TB/day of logs indexed, of which <15% was read within 14 days

Our biggest problems:

- Underutilized nodes due to poor bin packing and anti-affinity defaults
- Over-provisioned workloads (requests too high)
- Persistent volumes for workloads that didn’t need block storage
- Excessively chatty logs and metrics
- Multi-AZ network and storage costs for non-critical services

## The Strategy: Visibility → Efficiency → Elasticity → Simplification → Governance

We executed in five phases. Sealos provided the consistent substrate to apply these changes across clusters.

### Phase 1: Visibility

You can’t cut what you can’t see. We needed cost breakdowns per:

- Namespace and team
- Service and workload
- Environment (prod/staging/dev)
- Resource type (CPU, memory, storage, egress)

We combined OpenCost with Prometheus and Sealos’s multi-tenant structures to attribute costs accurately.

If you’re running Sealos Cloud, you can deploy observability and cost tooling from the Sealos App Store. For self-managed clusters, Helm works fine:

```bash
# Prometheus (if you don’t already have it)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install kps prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# OpenCost
helm repo add opencost https://opencost.github.io/opencost-helm-chart
helm install opencost opencost/opencost -n monitoring \
  --set opencost.prometheus.internal.serviceName=kps-kube-prometheus-sta-prometheus \
  --set opencost.prometheus.internal.namespaceName=monitoring
```

We standardized labels for attributing costs:

- team: owning team
- env: prod|staging|dev
- tier: frontend|backend|data|infra
- cost-center: finance mapping

Example:

```yaml
metadata:
  labels:
    team: "checkout"
    env: "prod"
    tier: "backend"
    cost-center: "payments"
```

Within two weeks, we had a trustworthy cost model. It immediately showed:

- 3 services accounted for 54% of compute spend due to inflated requests
- Log ingestion accounted for 48% of storage costs
- Cross-zone traffic was responsible for 28% of our egress bill

### Phase 2: Efficiency

We tackled the “static tax”: over-provisioned workloads and poor packing.

1. Rightsizing with Vertical Pod Autoscaler (VPA) in recommend mode

- We didn’t let VPA mutate live workloads initially; we used it to generate recommendations.

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: api-rs-vpa
  namespace: checkout
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: "Deployment"
    name: "api-rs"
  updatePolicy:
    updateMode: "Off" # recommend-only
  resourcePolicy:
    containerPolicies:
      - containerName: "*"
        minAllowed:
          cpu: "100m"
          memory: "256Mi"
```

We adjusted requests weekly based on recommendations and error budgets. Average request reductions:

- CPU: -43%
- Memory: -37%

2. Node shape alignment

- We created two dominant node pools: compute-optimized and memory-optimized.
- We mapped workloads via node selectors and resource profiles. This helped the scheduler pack pods more efficiently.

3. Bin-packing with soft anti-affinity

- We replaced hard pod anti-affinity with topologySpreadConstraints and soft preferences.
- Result: significantly less fragmentation while keeping failure isolation.

```yaml
spec:
  topologySpreadConstraints:
    - maxSkew: 2
      topologyKey: topology.kubernetes.io/zone
      whenUnsatisfiable: ScheduleAnyway
      labelSelector:
        matchLabels:
          app: api-rs
```

4. Descheduler for consolidation

- We ran the Kubernetes Descheduler nightly with strategies for LowNodeUtilization and RemoveDuplicates to evict and respawn pods onto fewer nodes during off-peak.

5. Image and runtime tweaks

- Reduced container images by ~55% on average (multi-stage builds, distroless).
- Enabled lazy image pulls via containerd’s stargz snapshotter on dev clusters to cut cold-start times and egress.

### Phase 3: Elasticity

We embraced on-demand elasticity at every layer.

1. Horizontal Pod Autoscaler (HPA)

- For stateless services, we standardized on HPAs targeting CPU and requests-per-second via custom metrics.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-rs-hpa
  namespace: checkout
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-rs
  minReplicas: 2
  maxReplicas: 40
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 65
    - type: Pods
      pods:
        metric:
          name: requests_per_second
        target:
          type: AverageValue
          averageValue: "20"
```

2. Cluster autoscaling with spot-first policy

- Where our IaaS supported it, we adopted Karpenter for rapid, bin-packed provisioning with consolidation.
- Where Karpenter wasn’t available, we used Cluster Autoscaler with multiple node groups and dynamic taints.

Example Karpenter Provisioner + NodePool (conceptual):

```yaml
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: spot-general
spec:
  template:
    spec:
      taints:
        - key: "spot"
          value: "true"
          effect: "NoSchedule"
      nodeClassRef:
        name: spot-general-class
      requirements:
        - key: "kubernetes.io/arch"
          operator: In
          values: ["amd64", "arm64"]
        - key: "karpenter.sh/capacity-type"
          operator: In
          values: ["spot"]
        - key: "node.kubernetes.io/instance-type"
          operator: In
          values: ["c6a.large", "c6a.xlarge", "c6g.large", "c6g.xlarge"]
  disruption:
    consolidationPolicy: WhenUnderutilized
    consolidateAfter: 5m
  limits:
    cpu: "2000"
---
apiVersion: karpenter.k8s.aws/v1beta1
kind: EC2NodeClass
metadata:
  name: spot-general-class
spec:
  amiFamily: AL2
  role: "KarpenterNodeRole"
  subnetSelector:
    karpenter.sh/discovery: "our-cluster"
  securityGroupSelector:
    karpenter.sh/discovery: "our-cluster"
```

We scheduled stateless pods with a spot toleration:

```yaml
spec:
  tolerations:
    - key: "spot"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
  priorityClassName: "spot-friendly"
```

3. Safe preemption and disruption budgets

- We defined PriorityClasses and PodDisruptionBudgets to ensure graceful failover and protect critical paths.

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: critical
value: 1000000
globalDefault: false
description: "Critical workloads"
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-rs-pdb
  namespace: checkout
spec:
  minAvailable: 80%
  selector:
    matchLabels:
      app: api-rs
```

Outcome:

- Spot nodes backed 70–85% of our compute for stateless workloads.
- On-demand/fallback nodes kicked in during spot scarcity with minimal impact.
- Consolidation reclaimed 15–22% of idle capacity daily.

### Phase 4: Storage and Observability Simplification

Storage was our sleeper cost.

1. Right storage for the job

- Caches and ephemeral queues moved to local NVMe with Local Persistent Volumes.
- Stateful services evaluated per tier. Production databases largely stayed managed; staging/dev moved to in-cluster operators and SSD-backed volumes.
- Bulk logs and metrics went to object storage; we kept hot indices small.

Local PV example:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-nvme
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

2. Logging diet

- Switched to Promtail + Loki for log aggregation with aggressive retention tiering (hot: 3 days, warm: 14 days in object storage, cold: archived).
- Cut log verbosity by default; added on-demand debug toggles.
- Result: log volume reduced by 68%, query performance improved for operational windows.

3. Metrics rationalization

- Trimmed Prometheus scrape targets and intervals; adopted exemplars for key traces only.
- Used remote_write only for critical SLO dashboards.

Net storage impact:

- -69% storage cost
- IOPS headroom increased; tail latency improved thanks to NVMe for latency-sensitive caches

### Phase 5: Governance and Automation

To make savings stick, we codified them.

1. Quotas and budgets per tenant

- Namespaces with ResourceQuotas and LimitRanges.
- Cost budgets per team (surfaced via dashboards and chat alerts).

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: checkout-quota
  namespace: checkout
spec:
  hard:
    requests.cpu: "400"
    requests.memory: "800Gi"
    limits.cpu: "800"
    limits.memory: "1600Gi"
    requests.storage: "50Ti"
```

2. Scale-to-zero for non-prod

- We implemented nightly hibernation for dev/staging. In Sealos, we automated this via scheduled jobs; alternatively, a CronJob that scales deployments to zero works:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: scale-to-zero
  namespace: dev-tools
spec:
  schedule: "0 1 * * 1-5"
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: scaler
          containers:
            - name: kubectl
              image: bitnami/kubectl:1.29
              command:
                - /bin/sh
                - -c
                - |
                  for ns in $(kubectl get ns -l env=dev -o jsonpath='{.items[*].metadata.name}'); do
                    kubectl scale deployment --all -n $ns --replicas=0
                  done
          restartPolicy: OnFailure
```

3. Policy-as-code

- We used Gatekeeper/OPA for constraints: no unbounded memory, no privileged pods, mandatory labels, allowed storage classes, and replica minimums for HA.

4. Cost-aware defaults in templates

- Our internal service templates now include sane resource requests, HPAs, and labels for cost attribution.

## How Sealos Fit In

Sealos gave us a cohesive way to implement all the above without stitching together a dozen control planes.

Benefits we leveraged:

- Fast cluster lifecycle: creating, upgrading, and operating clusters with consistent defaults
- Multi-tenancy: clear boundaries per team/environment and enforceable quotas
- App platform: deploying common services (Prometheus, Loki, databases) via an integrated experience
- Flexibility: runs on public cloud or private hardware; we used both for different tiers
- Community and docs: pragmatic guidance on building a cloud experience on Kubernetes

Explore Sealos and its ecosystem:

- Sealos homepage: https://sealos.io
- Documentation: https://www.sealos.io/docs

## Results and Verification

After four months, with phased rollouts and SLO guardrails:

- 87% total cost reduction across Kubernetes infrastructure
- P99 latency unchanged for critical services; some improved due to NVMe caches
- Error budgets unaffected; spot interruptions handled by PDBs and graceful rollouts
- Developer experience improved: faster CI/CD, standardized templates, easier self-service
- Fewer pager incidents related to cluster capacity

Key lessons:

- Most savings came from systemic elasticity and better defaults, not heroics
- Cost visibility is a prerequisite for productive conversations with teams
- Performance improved with better bin-packing and storage tiering
- You can get “platform-level” control without locking into every managed service

## Practical Playbook: Replicate This in Your Environment

Use the following as a checklist. You can implement it with Sealos as your platform base; the steps apply broadly to Kubernetes.

1. Establish visibility

- Deploy Prometheus and OpenCost (or equivalent)
- Standardize labels and annotations for team/env/tier/cost-center
- Build cost dashboards per namespace and team

2. Rightsize workloads

- Enable VPA in recommend-only mode
- Review top N offenders weekly; adjust requests/limits
- Set LimitRanges to prevent unbounded pods

3. Improve scheduling efficiency

- Replace strict anti-affinity with topologySpreadConstraints
- Align node shapes with workload profiles
- Run the Descheduler off-peak

4. Add elasticity

- Adopt HPA across stateless services
- Use Karpenter or Cluster Autoscaler; prefer spot/preemptible for stateless
- Set PriorityClasses and PDBs; test preemption and interruption handling

5. Rationalize storage and observability

- Move ephemeral data to Local PVs on NVMe
- Tier logs with Loki; keep hot windows short
- Prune metrics; adjust scrape intervals; limit remote_write

6. Reduce network costs

- Keep non-critical services single-AZ
- Co-locate chatty services; use topology-aware routing
- Cache images/artifacts to reduce egress

7. Governance and automation

- Apply ResourceQuotas and budgets
- Automate scale-to-zero for non-prod
- Enforce policies with OPA/Gatekeeper

8. Use Sealos to accelerate

- Standardize cluster creation, tenancy, and app deployment
- Offer an internal “platform” with curated, cost-aware defaults
- Iterate with confidence: Sealos gives you composable building blocks, not a black box

## Common Pitfalls and How We Avoided Them

- Over-aggressive rightsizing leading to OOMKills: We set conservative floors in VPA policies and monitored tail latencies when reducing memory.
- Spot interruptions cascading into incidents: We used PDBs, surge rollouts, and warm capacity buffers. We also hardened readiness/liveness probes and ensured idempotency.
- Descheduler churn during peak hours: We pinned it to low-traffic windows and configured soft constraints.
- Hidden egress in observability: We disabled unnecessary remote_writes and moved cold data to object storage with lifecycle policies.
- Developer pushback: Budgets and dashboards sparked healthy trade-off discussions. We templated best practices, so the “right thing” became the easy thing.

## How It Works Under the Hood: Tying the Pieces Together

- The Kubernetes scheduler makes placement decisions; Karpenter (or Cluster Autoscaler) provisions nodes that fit pending pods’ requirements, favoring cost-effective shapes.
- Sealos provides the operational backbone: cluster management, app install, and multi-tenancy. This ensures consistent enforcement of quotas, labels, and policies.
- VPA and HPA form a feedback loop: VPA informs baseline requests; HPA scales replicas with load. Together, they prevent over-provisioning while absorbing bursts.
- Descheduler and consolidation drain underutilized nodes, nudging the cluster into tighter packing without service impact.
- Storage classes direct workloads to the right performance/cost tier; observability pipelines balance hot vs. cold data.

The net effect is a platform that adapts to demand, keeps utilization high, and spends where it matters.

## Frequently Asked Questions

- Do I need Sealos to achieve these savings?
  No, but Sealos made it much faster and more consistent for us. You can implement the same principles on any Kubernetes distribution; Sealos reduces the “glue work.”

- Will spot/preemptible nodes hurt reliability?
  Not if you design for it. Use PDBs, graceful termination, and retries. Keep critical stateful services on on-demand nodes or managed offerings.

- Should I move all databases into the cluster?
  Probably not. We moved non-critical dev/staging databases in-cluster to save money. Production databases stayed managed unless there was a clear cost-performance win with strong operational coverage.

- Is multi-AZ always necessary?
  Not for everything. We scoped multi-AZ to critical services. For internal, non-critical paths, single-AZ was sufficient and cut cross-zone costs.

## Conclusion: Cost Discipline Without Compromise

Kubernetes doesn’t have to be expensive. Our 87% cost reduction wasn’t a miracle—it was the product of:

- Clear visibility into where money was going
- Pragmatic engineering to rightsize and re-architect
- Elasticity that follows demand, not guesses
- Governance that automates good behavior by default
- A platform substrate—Sealos—that let us move quickly and enforce standards

If your Kubernetes bill feels out of control, you don’t need a rewrite. You need a plan. Start with visibility, pick the top three offenders, and iterate with guardrails. Use Sealos to accelerate the journey and provide your teams with a platform that’s powerful, flexible, and cost-aware.

When we treated cost like latency or reliability—something to measure, design for, and continuously improve—we got the results we wanted without trading away developer velocity or customer experience.

Further reading and resources:

- Sealos: https://sealos.io
- Sealos Docs: https://www.sealos.io/docs
- OpenCost: https://www.opencost.io
- Karpenter: https://karpenter.sh

Your cloud bill can be a strategy, not a surprise.
