---
title: "Calculating Kubernetes Costs: A Breakdown of EKS, GKE, and AKS Pricing Models"
imageTitle: "Kubernetes Costs: EKS, GKE, AKS"
description: "Explore the pricing models for Amazon EKS, Google GKE, and Azure AKS, including node, control plane, and data transfer costs. Learn how to compare total costs and optimize Kubernetes spend."
date: 2025-09-09
tags: ["kubernetes", "cloud-pricing", "eks", "gke", "aks", "cost-optimization"]
authors: ["default"]
---

Kubernetes gives you elegant abstractions for deploying and scaling containers at any scale—but the moment those abstractions hit your cloud bill, they can become opaque. The same feature that makes Kubernetes powerful (scheduling pods across a pool of compute and automatically scaling them) also makes cost forecasting and chargeback tricky. If you’ve ever wondered why two clusters with the “same” workload end up with different monthly bills across AWS, Google Cloud, and Azure, this article is for you.

This guide breaks down how to think about Kubernetes costs, the pricing models of EKS (AWS), GKE (Google Cloud), and AKS (Azure), and how to build a simple, repeatable process to estimate and track costs. You’ll walk away with practical steps, example commands, and a framework you can adapt to your environment.

## What “Kubernetes Cost” Really Means

When you pay for Kubernetes in a managed cloud service, your bill is a bundle of separate services hiding behind kubectl:

- Control plane: The managed API servers, etcd, and orchestration that the provider runs for you.
- Worker compute: The VMs (nodes) that run your pods, or serverless per-pod/”Fargate/Autopilot” style resources.
- Storage: Disks (EBS/PD/Disk) attached to nodes and persistent volumes.
- Networking: Load balancers, public IPs, inter-zone and outbound egress, NAT gateways.
- Observability: Logging and metrics ingestion/storage.
- Registry and artifacts: Container image storage and network egress pulling images.

You’re also paying for the way you use Kubernetes:

- Requested vs actual usage: Oversized pod requests result in low bin-packing efficiency; you pay for idle headroom.
- Scaling patterns: Autoscaling may avoid waste—or spike LB/NAT and burst egress costs.
- Architecture choices: Do you use a service mesh? Sidecars? Stateful workloads? Ephemeral jobs? Each has cost implications.

Understanding costs means tallying each component for your cluster and applying the right unit price per cloud.

## Why This Matters

- Forecasting and budgeting: Finance teams want predictable spend. Engineers want elasticity.
- Chargeback/showback: Teams need to see their slice of shared cluster costs.
- Optimization: Right-sizing requests and adopting spot/preemptible nodes can unlock double-digit savings.
- Strategic choice: Choosing EKS vs GKE vs AKS vs serverless modes (Fargate, Autopilot, Virtual Nodes) hinges on cost structure and operational trade-offs.

## EKS, GKE, and AKS: High-Level Pricing Models

At a high level, all three managed Kubernetes offerings charge similarly for the data plane (compute, storage, networking) because those are underlying cloud services. Differences often hinge on:

- Control plane fees and tiers
- Node-based vs serverless (per-pod resource) modes
- Add-on surcharges (e.g., logging, mesh, gateway)
- Discount programs (Savings Plans/Committed Use/Reserved Instances)

Below is a simplified comparison to frame the discussion. Always check current provider pricing pages and calculators because rates and features evolve.

| Dimension          | AWS EKS                                                     | Google Kubernetes Engine (GKE)                                                                | Azure Kubernetes Service (AKS)                                                                |
| ------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Control plane fee  | Per-cluster control plane fee applies (verify current rate) | Standard mode typically no separate control plane fee; Autopilot has per-pod resource pricing | Free tier generally no control plane fee; optional tiers/Uptime SLA may add a per-cluster fee |
| Data plane (nodes) | EC2 instances (On-Demand, Savings Plans, Spot), EBS         | Compute Engine VMs (On-Demand, Committed Use, Spot), Persistent Disk                          | Azure VM Scale Sets (Pay-as-you-go, Reserved, Spot), Managed Disks                            |
| Serverless option  | EKS Fargate (pay per pod CPU/memory)                        | GKE Autopilot (pay for requested pod resources + premium)                                     | AKS Virtual Nodes via ACI (pay per container resources in ACI)                                |
| Load balancers     | ELB/ALB/NLB charges                                         | Cloud Load Balancing charges                                                                  | Azure Load Balancer/Application Gateway                                                       |
| Observability      | CloudWatch logs/metrics charges                             | Cloud Logging/Monitoring charges                                                              | Azure Monitor/Log Analytics charges                                                           |
| Image registry     | ECR                                                         | Artifact Registry/GCR                                                                         | Azure Container Registry                                                                      |

## Deep Dive: AWS EKS Pricing Model

EKS costs come from four main places:

1. Control plane

- Per-cluster fee for the managed Kubernetes control plane. This is independent of your node count.
- You may also pay for optional EKS Add-ons (e.g., managed CNI variants or security add-ons).

2. Data plane (compute)

- Managed node groups: EC2 instances billed per instance-hour. You can mix On-Demand, Spot, and Savings Plans.
- Self-managed nodes: Same EC2 pricing; you manage the lifecycle.
- EKS Fargate: Serverless pods billed by requested vCPU, memory, and time. No nodes to manage, but often a premium vs well-utilized nodes.

3. Storage

- EBS volumes attached to nodes (OS disks) and PVs (gp2/gp3/io2), plus IOPS/throughput charges for certain types.
- Snapshots.

4. Networking and extras

- Load balancers (NLB/ALB), data transfer (inter-AZ, inter-region, egress), NAT gateway, Elastic IPs.
- CloudWatch ingestion and retention for logs/metrics.
- ECR storage and egress (if pulling from ECR).

EKS is attractive when:

- You want deep EC2 control and cost levers (Spot, Savings Plans).
- You need AWS-native integration (ALB Ingress Controller, IRSA, KMS, VPC-CNI).
- You accept the per-cluster control plane fee and amortize it across many workloads.

## Deep Dive: GKE Pricing Model

GKE offers two primary modes:

1. GKE Standard

- You run node pools on Compute Engine. You pay for VMs, disks, and networking like any other GCE workload.
- At the time of writing, Standard mode typically does not have a separate control plane fee. Historically, Google has adjusted fees, so verify current pricing.

2. GKE Autopilot

- You don’t manage nodes. You pay per requested pod CPU, memory, and ephemeral storage.
- Includes opinionated limits and configurations; often increases efficiency for teams that right-size requests, but can be pricier for over-requested workloads.

Additional GKE cost factors:

- Cloud Load Balancing for Services of type LoadBalancer.
- Persistent Disk (zonal/Regional PD, SSD/HDD).
- Cloud NAT for outbound, egress fees, inter-zone traffic.
- Cloud Logging/Monitoring ingestion and retention (pay attention to default sinks).
- Artifact Registry for images.

GKE is attractive when:

- You value Google’s cluster automation and rapid K8s version cadence.
- You want Autopilot’s per-pod billing and simplified ops, or Standard with aggressive bin packing and CUDs (Committed Use Discounts) for VMs.
- You rely on Google’s networking and observability stack.

## Deep Dive: AKS Pricing Model

AKS pricing hinges on:

1. Control plane tiers

- AKS has historically offered a free control plane. Providers also offer optional tiers or Uptime SLA that may add a per-cluster charge. Confirm current “Free vs Standard tier” details.

2. Data plane (compute)

- Node pools run on VM Scale Sets; you pay per-VM, per-disk, and networking.
- Spot VMs can significantly reduce spend for tolerant workloads.
- Reserved Instances can lower long-term costs.

3. Serverless-style option

- AKS Virtual Nodes powered by Azure Container Instances (ACI) allow rapid burst without managing nodes; billed per container resources in ACI.

4. Networking and extras

- Azure Load Balancer or Application Gateway Ingress Controller.
- Data transfer/egress, NAT gateway, Public IPs.
- Azure Monitor Container Insights via Log Analytics (ingestion and retention can be a large line item).
- Azure Container Registry (ACR) storage and egress.

AKS is attractive when:

- You want tight integration with Azure AD, Managed Identity, and Azure networking.
- You value choice between free control plane and paid SLAs/features.
- Your estate already uses Reserved Instances and hybrid benefits.

## Cost Anatomy: A Reusable Estimation Framework

Regardless of provider, you can estimate cluster cost with the same structure:

Cluster cost per month ≈

- Control plane fee per hour × 730

* Sum(nodes) [ VM hourly rate × hours + OS disk + extra disks ]
* Sum(volumes) [ PV GB × rate + IOPS/throughput surcharges ]
* Load balancers [ per-LB hourly + LCU/processed data if applicable ]
* Networking [ inter-zone × GB + egress × GB + NAT Gateway processing/hour ]
* Observability [ log ingestion × GB + metrics × time series ]
* Registry [ storage × GB + egress × GB ]
* Serverless (if applicable) [ pod requested vCPU/mem × hours × rates ]

Note:

- If using discount programs (Reservations, Savings Plans, CUDs), apply the discounted unit rates.
- For Spot/preemptible, use the observed average rates but model interruption and headroom.

## Practical Example: Node-Based Clusters

Assume you run:

- 1 production cluster with 3 node pools:
  - General pool: 6 x 4 vCPU / 16 GB nodes
  - I/O pool: 3 x 8 vCPU / 32 GB nodes with SSD disks
  - Batch pool: 6 x 4 vCPU / 16 GB Spot/preemptible nodes
- 2 LoadBalancers (ingress + internal)
- 5 TB egress per month to the public internet
- 3 TB persistent volumes (general purpose)
- Logging: 800 GB ingestion/month

Estimation steps:

1. Control plane:

- EKS: include per-cluster fee.
- GKE Standard: typically $0 control plane; confirm.
- AKS Free: $0 control plane; Standard/Uptime SLA: add fee if used.

2. Compute:

- Multiply node counts by per-VM hourly rates for the chosen instance families.
- Apply your discount program (Savings Plans/CUDs/Reserved).
- Add OS disk costs per node (managed disks/EBS/PD).
- For Spot/preemptible nodes, use historical average rates and expected utilization.

3. Volumes:

- 3 TB × storage class rate (e.g., gp3, PD-SSD, Premium SSD) + any IOPS/throughput add-ons.

4. Load balancers:

- 2 LBs × hourly rate (+ processed data metrics for advanced LBs where applicable).

5. Networking:

- 5 TB egress × egress rate
- Inter-zone traffic if you run multi-zone (often overlooked)
- NAT gateway hourly + per-GB if using centralized NAT for nodes.

6. Logging:

- 800 GB × ingestion rate
- Retention beyond free tiers adds cost.

Repeat the same math across EKS, GKE, and AKS with their respective unit prices to compare.

## Practical Example: Serverless/Per-Pod Modes

Some workloads fit serverless pod pricing better:

- EKS Fargate: You are billed based on requested vCPU and memory for the duration pods run.
- GKE Autopilot: You pay per requested CPU, memory, and ephemeral storage. If you over-request, you pay more.
- AKS Virtual Nodes with ACI: You pay ACI rates for vCPU/memory seconds; good for bursty or spiky demand.

When to consider serverless modes:

- Spiky, short-lived jobs (CI, data pipelines).
- Teams without node SRE bandwidth.
- Strict multi-tenant isolation (no node sharing) with clear chargeback.

When nodes are better:

- High, steady utilization with good bin packing.
- Stateful workloads with stable resource profiles.
- Heavy use of Spot/preemptible discounts.

## Getting Prices Programmatically

Automating price retrieval makes your estimator repeatable.

### AWS: Price List API

Note: The Pricing API is in us-east-1.

- EKS control plane:

```
aws pricing get-products \
  --region us-east-1 \
  --service-code AmazonEKS \
  --filters Type=TERM_MATCH,Field=productFamily,Value="Amazon EKS Cluster" \
  --query 'PriceList[0]' \
  --output text
```

- EC2 on-demand for a specific instance:

```
aws pricing get-products \
  --region us-east-1 \
  --service-code AmazonEC2 \
  --filters '[
    {"Type":"TERM_MATCH","Field":"instanceType","Value":"m6i.xlarge"},
    {"Type":"TERM_MATCH","Field":"location","Value":"US East (N. Virginia)"},
    {"Type":"TERM_MATCH","Field":"operatingSystem","Value":"Linux"},
    {"Type":"TERM_MATCH","Field":"tenancy","Value":"Shared"},
    {"Type":"TERM_MATCH","Field":"preInstalledSw","Value":"NA"},
    {"Type":"TERM_MATCH","Field":"capacitystatus","Value":"Used"}
  ]' \
  --query 'PriceList[0]' \
  --output text
```

Parse the JSON to get the OnDemand price per hour.

### Google Cloud: Cloud Billing Catalog API

Get SKUs and unit prices:

```
curl -s -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://cloudbilling.googleapis.com/v1/services/6F81-5844-456A/skus?currencyCode=USD" \
  | jq '.skus[] | select(.skuId | contains("Compute")) | .description, .pricingInfo[0].pricingExpression'
```

- The service ID for Compute Engine is commonly used to price node-based clusters.
- For GKE Autopilot, query GKE-related SKUs similarly and filter by descriptions.

### Azure: Retail Prices API

Query VM prices:

```
curl -s "https://prices.azure.com/api/retail/prices?\$filter=serviceName eq 'Virtual Machines' and armRegionName eq 'eastus' and skuName eq 'D4s v5' and priceType eq 'Consumption'" \
 | jq '.Items[] | {skuName, unitPrice, unitOfMeasure, meterName}'
```

Query AKS-related SKUs (e.g., Uptime SLA or Managed Disks) by adjusting filters (serviceName, productName, armRegionName).

## Estimating Costs From Kubernetes Requests

If you bill teams based on requested resources, you can pull requests per namespace and apply per-unit rates.

### Get requested CPU/memory by namespace

```
kubectl get pods -A -o json \
| jq -r '
  .items[]
  | {ns: .metadata.namespace, c: .spec.containers}
  | {ns, reqs: ([.c[].resources.requests//{}] | add)}
  | {ns, cpu: ( .reqs.cpu // "0"), mem: ( .reqs.memory // "0")}
' \
| awk '
function cpu_to_m(cpu) {
  if (cpu ~ /m$/) { sub(/m$/,"",cpu); return cpu+0 }
  else if (cpu ~ /n$/) { sub(/n$/,"",cpu); return (cpu+0)/1000000 }
  else { return (cpu+0)*1000 }
}
function mem_to_mb(mem) {
  # crude: Ki, Mi, Gi support
  if (mem ~ /Gi$/) { sub(/Gi$/,"",mem); return (mem+0)*1024 }
  if (mem ~ /Mi$/) { sub(/Mi$/,"",mem); return (mem+0) }
  if (mem ~ /Ki$/) { sub(/Ki$/,"",mem); return (mem+0)/1024 }
  if (mem ~ /G$/) { sub(/G$/,"",mem); return (mem+0)*1024 }
  if (mem ~ /M$/) { sub(/M$/,"",mem); return (mem+0) }
  return mem+0
}
BEGIN { OFS=","; print "namespace,cpu_millicores,mem_MB" }
{
  ns=$2; cpu_m=cpu_to_m($4); mem_mb=mem_to_mb($6);
  agg[ns,"cpu"]+=cpu_m; agg[ns,"mem"]+=mem_mb
}
END {
  for (key in agg) {
    split(key,k,SUBSEP); ns=k[1]
  }
  # naive second pass to print; in practice use a better aggregator
}
'
```

For production use, prefer a proper script or a metrics pipeline (Prometheus with kube-state-metrics) to aggregate requests/usage over time.

### Apply rates to requests

Pseudo-formula per namespace per hour:

- CPU cost = (requested millicores / 1000) × vCPU_rate_per_hour
- Memory cost = (requested MB / 1024) × GB_mem_rate_per_hour
- Storage cost = PV_GB × storage_rate_per_hour
- Add proportional share of control plane and shared infra (LBs, NAT, logging) by splitting across namespaces using a weighting key (e.g., CPU+mem requests or actual usage).

In serverless modes (Fargate/Autopilot), you can align rates to the provider’s per-requested-resource prices and skip node math.

## Common Cost Traps to Watch

- Over-requesting resources: Requests drive node count and per-pod billing in serverless modes.
- Too many small clusters: Per-cluster control plane fees and add-on overheads add up; consider multi-tenant clusters with quotas and proper isolation.
- Logging ingestion defaults: Providers can ingest everything; aggressively filter noisy logs.
- Zonal spread and data transfer: Cross-zone chatter isn’t free. Co-locate chatty services.
- NAT gateway: High-volume egress through NAT can be surprisingly expensive; consider egress paths and private endpoints.
- Orphaned LBs and PVs: Clean up after scaling down or deleting namespaces.

## Optimization Playbook

- Right-size requests: Use Vertical Pod Autoscaler (VPA) in recommendation mode or tools like Goldilocks to set sane requests.
- Improve bin packing: Consolidate to fewer, larger nodes if that improves utilization; remove anti-affinity rules that block packing without strong reasons.
- Autoscale smartly: Cluster Autoscaler or Karpenter can right-size nodes to fit pods precisely.
- Use Spot/Preemptible where safe: For stateless/batch, interruption-tolerant workloads can save 50–80%.
- Buy commitments: Savings Plans (AWS), Committed Use Discounts (GCP), Reserved Instances (Azure) to reduce unit prices.
- Choose the right storage class: gp3/PD-balanced/Premium SSD v2 can be cheaper for given IOPS profiles.
- Filter logs and shorten retention: Keep what you query; archive the rest cheaply.
- Share clusters safely: Use namespaces, network policies, and quotas to consolidate. For multi-tenant platforms, solutions like Sealos (sealos.io) provide tenant isolation, quotas, and governance on Kubernetes, which can simplify chargeback/showback across teams or customers.

## Building a Simple Cost Calculator

You can produce a repeatable estimate with a small script that consumes:

- Cloud retail prices (or your negotiated rates)
- Cluster inventory (nodes, volumes, LBs)
- Resource requests by namespace/team

Here’s a minimal Python sketch to calculate monthly node-based costs. Replace the rates with values pulled from APIs:

```python
import math

HRS = 730

rates = {
  "control_plane_per_hr": 0.0,   # e.g., EKS fee; set to 0 if not applicable
  "vm_per_hr": {
    "general": 0.20,             # $/hr per VM in general pool
    "io": 0.40,
    "spot": 0.06
  },
  "os_disk_per_vm_month": 3.0,   # $/month
  "pv_per_gb_month": 0.10,       # $/GB-month
  "lb_per_hr": 0.025,            # $/hr per LB
  "egress_per_gb": 0.08,         # $/GB
  "log_ingest_per_gb": 0.50      # $/GB
}

workload = {
  "control_plane": True,
  "nodes": {
    "general": {"count": 6},
    "io": {"count": 3},
    "spot": {"count": 6}
  },
  "pv_gb": 3000,
  "lbs": 2,
  "egress_gb": 5000,
  "log_ingest_gb": 800
}

def monthly_cost(rates, workload):
    total = 0.0
    if workload["control_plane"]:
        total += rates["control_plane_per_hr"] * HRS
    for pool, info in workload["nodes"].items():
        vm_cost = rates["vm_per_hr"][pool] * HRS * info["count"]
        disk_cost = rates["os_disk_per_vm_month"] * info["count"]
        total += vm_cost + disk_cost
    total += workload["pv_gb"] * rates["pv_per_gb_month"]
    total += workload["lbs"] * rates["lb_per_hr"] * HRS
    total += workload["egress_gb"] * rates["egress_per_gb"]
    total += workload["log_ingest_gb"] * rates["log_ingest_per_gb"]
    return total

print(f"Estimated monthly cost: ${monthly_cost(rates, workload):,.2f}")
```

Adapt this model for:

- Fargate/Autopilot by replacing node pools with vCPU/memory requested × per-hour rates.
- Zone replication multipliers (regional disks, multi-zone LBs).
- Discount programs (override vm_per_hr).

## EKS vs GKE vs AKS: Which Is “Cheapest”?

There is no universally cheapest option—only the best fit for your workload and operations model. Some guiding observations:

- If you maintain high utilization and can wield Spot/preemptible/commitments effectively, node-based modes (EKS managed node groups, GKE Standard, AKS with VMSS) tend to be cost-efficient.
- If your workloads are spiky, short-lived, or run by small teams without infra engineers, serverless modes (GKE Autopilot, EKS Fargate, AKS Virtual Nodes) can reduce toil and surprise. Cost scales with requested resources; guard against over-requesting.
- Control plane fees matter for many small clusters. If you run dozens of small clusters, the per-cluster overhead (where applicable) can dominate. Consider multi-tenant clusters with quotas and isolation.
- Observability can be a top-3 line item. Optimize ingestion and retention regardless of platform.
- Your enterprise discounts might dominate all other differences. Compute the TCO with your actual negotiated rates.

## Practical Applications and Governance

- Showback/chargeback: Allocate cost by namespace/team using labels and requested resources. Export to your BI tool weekly.
- Budget alerts: Use cloud budgets (AWS Budgets, GCP Budgets, Azure Cost Management) and integrate alerts into Slack/Teams.
- FinOps KPIs: Track $/vCPU-hr delivered, $/namespace per month, idle rate (requested vs used), and cost of observability per workload.
- Platform engineering: Provide self-service templates with pre-set resource requests and budgets. If you’re building a multi-tenant developer platform, Sealos (https://sealos.io) offers a Kubernetes-based Cloud OS experience with tenant workspaces, quotas, and application catalog, which can help standardize governance and cost controls on top of your clusters.

## How It Works Under the Hood

Why do managed services price the way they do?

- Control plane: Providers run HA control planes, etcd backups, upgrades, and security patching for you. Fees recoup always-on infrastructure and SRE operations.
- Node-based: Classic IaaS billing where you manage capacity selection and utilization.
- Serverless per-pod: Provider abstracts nodes, schedules containers on shared infrastructure, and charges per requested resources with a premium for convenience and isolation.
- Add-ons: Load balancers and observability live in adjacent cloud products with their own teams and billing.

Understanding these drivers clarifies why optimizing requests and topology often yields better savings than chasing small unit price differences.

## Checklist: Before You Compare Providers

- Inventory current workloads: CPU/mem requests, pods per namespace, storage footprint, egress patterns.
- Decide your operational model: Node-based vs serverless vs hybrid.
- Gather current unit prices: Use APIs or calculators with your negotiated rates and regions.
- Model 3–4 utilization scenarios: Average, peak, growth plan, failure domain expansion (multi-zone).
- Include “hidden” items: NAT, inter-zone, logging, registry egress, snapshots.
- Validate with a 1-week pilot: Measure actual usage and compare to your estimate; tune your model.

## Conclusion

Kubernetes cost clarity starts with a simple truth: you’re paying for the resources your workloads request and consume, plus the shared infrastructure to run them. EKS, GKE, and AKS differ most in how they meter control plane operations and whether you pay for nodes or per-pod resources. The data plane—compute, storage, and networking—dominates spend and behaves similarly across clouds, subject to each provider’s unit prices and your discounts.

To make informed decisions:

- Break costs into control plane, compute, storage, networking, observability, and registry.
- Choose a mode (node-based vs serverless) that matches your workload shape and team bandwidth.
- Automate price retrieval and cost estimation; measure requests and usage over time.
- Optimize relentlessly: right-size, autoscale, spot/preemptible, and filter logs.
- Consider multi-tenant designs with quotas and clear chargeback to reduce per-cluster overhead—platforms like Sealos can help standardize governance and cost visibility across teams.

Do this, and Kubernetes becomes not just a powerful orchestration layer, but a platform you can operate confidently—technically and financially.
