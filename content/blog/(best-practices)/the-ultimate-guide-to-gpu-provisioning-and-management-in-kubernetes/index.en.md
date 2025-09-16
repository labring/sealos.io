---
title: The Ultimate Guide to GPU Provisioning and Management in Kubernetes
imageTitle: GPU Provisioning in Kubernetes
description: Explore how to provision, schedule, and manage GPUs in Kubernetes with best practices, tooling, and scalable AI workloads. Learn practical tips for resource guarantees, driver management, and monitoring.
date: 2025-09-12
tags:
  [
    "Kubernetes",
    "GPU",
    "Container Orchestration",
    "Cluster Management",
    "DevOps",
  ]
authors: ["default"]
---

GPUs have become the backbone of modern AI, high-performance data analytics, and scientific computing. But running GPU-intensive workloads at scale is not just about getting a powerful card—it's about orchestrating resources efficiently, ensuring isolation and fairness, and automating lifecycle operations. Kubernetes, with its extensible scheduling and robust ecosystem, has emerged as the platform of choice for GPU workloads. The challenge is knowing how to provision GPU resources, configure the stack correctly, and manage performance, cost, and reliability.

This guide is your end-to-end handbook for GPU provisioning and management in Kubernetes. Whether you’re deploying your first GPU node or running multi-tenant GPU clusters for MLOps, you’ll find actionable practices, example manifests, and operational tips to help you succeed.

---

## What “GPU in Kubernetes” Actually Means

Kubernetes treats GPUs as “extended resources” provided by a device plugin. Unlike CPU and memory, GPUs are not first-class schedulable resources built into the core Kube scheduler; they are discovered and advertised via plugins, and consumed by pods as resource limits.

Key concepts:

- Extended resources: Devices exposed to Kubernetes by a device plugin (for NVIDIA: nvidia.com/gpu).
- Device plugin: A DaemonSet that advertises devices to the kubelet on each node and handles device assignment to pods.
- Runtime support: Containers must run with a runtime supporting GPU (e.g., NVIDIA Container Toolkit).
- Drivers and libraries: Node-level NVIDIA driver; in-container CUDA libraries and user-space tooling.

Why it matters:

- Separation of concerns: K8s schedules GPUs without bundling GPU vendor logic.
- Flexibility: Support for features like multi-instance GPU (MIG) or time-slicing via plugins.
- Compatibility: Consistency across cloud and on-prem environments.

---

## Why GPUs in Kubernetes Are Important

- Unified Platform: Run training, inference, ETL, and batch jobs within one orchestrated platform.
- Automation: Autoscaling, rolling upgrades, job queues, and CI/CD integrate with GPU workloads.
- Cost Efficiency: Bin-packing, sharing strategies (time-slicing/MIG), and quotas reduce waste.
- Multi-tenancy: Namespaces, quotas, and policies ensure fair and secure sharing across teams.
- Portability: Hybrid and multi-cloud GPU deployments with the same stack.

Platforms like Sealos (sealos.io) build on Kubernetes to provide a cloud operating system experience, with app marketplaces and multi-tenant isolation that simplify GPU cluster setup, operator installation, and project-level governance. If you are building a self-service AI platform, Sealos can be a strong fit.

---

## How Kubernetes Sees GPUs: Device Plugin and Scheduling

### NVIDIA Device Plugin in a Nutshell

- The NVIDIA device plugin runs as a DaemonSet.
- It registers GPUs with the kubelet as extended resources, typically nvidia.com/gpu.
- Pods request GPUs by setting resource limits on nvidia.com/gpu.
- The scheduler selects nodes that have the requested GPU count available.

Important behavior:

- For extended resources like GPUs, Kubernetes schedules based on limits. Set limits for nvidia.com/gpu; requests must equal limits if both are specified.
- A GPU is assigned exclusively to a container unless you use MIG or time-slicing mechanisms.

### Example: Request a GPU in a Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  runtimeClassName: nvidia # Provided by the GPU Operator
  containers:
    - name: cuda-vectoradd
      image: nvcr.io/nvidia/k8s/cuda-sample:vectoradd-cuda11.7 # example CUDA app
      resources:
        limits:
          nvidia.com/gpu: "1" # Request 1 GPU
      command: ["bash", "-lc"]
      args: ["nvidia-smi && ./vectorAdd"]
```

Notes:

- runtimeClassName: nvidia is configured by the NVIDIA GPU Operator to ensure the correct runtime.
- Use official CUDA-compatible images for best compatibility.

---

## Provisioning GPU Nodes

### Cloud vs. On-Prem

- Cloud: Use GPU instance families (AWS p3/p4/g5/g6, GCP A2/L4, Azure ND/NC). Benefits: elasticity and fast provisioning. Tradeoffs: cost and quota limits.
- On-Prem/Edge: You control hardware and drivers; great for fixed workloads and data locality. Requires careful operations.

### Node Requirements

- NVIDIA driver installed on GPU nodes.
- Container runtime with NVIDIA Container Toolkit support.
- Kubernetes versions compatible with your device plugin and operator.
- Optional but recommended: NVIDIA GPU Operator to manage drivers, device plugin, and monitoring.

---

## Installing the NVIDIA GPU Operator

The NVIDIA GPU Operator deploys and manages:

- NVIDIA drivers
- Container Toolkit
- Device Plugin
- DCGM and DCGM Exporter (for monitoring)
- Node Feature Discovery (optional)

Example installation via Helm:

```bash
helm repo add nvidia https://nvidia.github.io/gpu-operator
helm repo update
helm install --wait --generate-name nvidia/gpu-operator
```

Post-install checks:

- kubectl get pods -n gpu-operator
- Ensure DaemonSets (nvidia-device-plugin, nvidia-driver-daemonset) and DCGM exporter are healthy.
- kubectl describe node <node> | grep -i nvidia to verify resources are advertised.

Tip: On platforms like Sealos, you can often install the GPU Operator from an app marketplace with a few clicks, then use namespaces and projects to isolate teams.

---

## Scheduling and Placement Strategies

### Taints and Tolerations

GPU nodes are valuable; you may want to schedule only GPU pods on them.

- Add a taint to GPU nodes:
  kubectl taint nodes <gpu-node> gpu=true:NoSchedule
- Add toleration to GPU pods:

```yaml
tolerations:
  - key: "gpu"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
```

### Node Affinity

Target specific GPU models or generations:

```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: nvidia.com/gpu.product
              operator: In
              values: ["NVIDIA-A100-SXM4-40GB", "Tesla-T4"] # Example labels
```

Labels like nvidia.com/gpu.product are often provided by the GPU Operator’s feature discovery components; validate actual label keys in your cluster.

### Resource-Aware Scheduling

- Pod PriorityClasses: Ensure mission-critical inference pods preempt lower-priority jobs if necessary.
- Topology Manager: Align CPU, memory, and device allocation within a NUMA node for lower latency. Configure kubelet with topologyManagerPolicy: single-numa-node on GPU nodes for the strictest alignment.
- Gang Scheduling: For multi-GPU or multi-pod jobs (e.g., distributed training), use Kueue or Volcano to ensure all pods start together, reducing stragglers.

---

## Sharing, Partitioning, and Isolation

GPU sharing is essential for maximizing utilization, especially for inference. Three main approaches:

### 1) Time-Slicing (Soft Sharing)

The NVIDIA device plugin can allow multiple pods to share a GPU by time-slicing.

- Pros: Simple, good for light or bursty inference.
- Cons: Performance is not isolated; throughput/latency can vary.

Example ConfigMap for time-slicing (actual schema may vary with plugin version; consult the plugin docs):

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nvidia-device-plugin-config
  namespace: gpu-operator
data:
  config.yaml: |
    version: v1
    sharing:
      timeSlicing:
        resources:
          - name: nvidia.com/gpu
            replicas: 2   # Allow up to 2 pods to share each physical GPU
```

Patch or configure the device plugin DaemonSet to mount this ConfigMap.

Pods still request nvidia.com/gpu: 1; the plugin enforces sharing.

### 2) MIG (Multi-Instance GPU) on A100/H100

MIG splits one physical GPU into isolated GPU instances with dedicated memory and compute.

- Pros: Strong isolation, predictable performance.
- Cons: Static partitioning (reconfiguration requires draining or careful coordination).

With the NVIDIA GPU Operator, you can enable MIG mode and expose MIG profiles as distinct resources, e.g., nvidia.com/mig-1g.10gb.

Pod example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mig-inference
spec:
  runtimeClassName: nvidia
  containers:
    - name: server
      image: nvcr.io/nvidia/tensorrtserver:21.12-py3
      resources:
        limits:
          nvidia.com/mig-1g.10gb: "1"
```

### 3) MPS and vGPU

- MPS (Multi-Process Service): NVIDIA feature to improve context sharing for CUDA workloads. Helps throughput with many small jobs but not strict isolation.
- vGPU: NVIDIA Virtual GPU for virtualization platforms; can be surfaced to Kubernetes via appropriate plugins, most common in VDI or specialized environments.

---

## Multi-Tenancy and Fairness

### Namespaces, Quotas, and Limits

- ResourceQuota can enforce GPU consumption caps per namespace.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: gpu-quota
  namespace: team-a
spec:
  hard:
    limits.nvidia.com/gpu: "4"
    requests.cpu: "20"
    requests.memory: "64Gi"
```

Notes:

- Use limits.nvidia.com/gpu and/or requests.nvidia.com/gpu keys to govern extended resources.
- LimitRange can set min/max constraints for GPUs per pod, but cannot set default requests/limits for extended resources.

### Priority and Preemption

Create PriorityClass objects to ensure critical services preempt non-critical training jobs only when necessary.

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: inference-critical
value: 100000
globalDefault: false
description: "High priority for latency-sensitive inference."
```

### Batch and Queued Workloads

- Kueue: Kubernetes-native batch job queueing that integrates with resource quotas and orchestrates start times when GPUs are available.
- Volcano: Provides gang scheduling and advanced batch features.

These frameworks help avoid idle resources and prevent head-of-line blocking for distributed jobs.

Platforms like Sealos can complement these with project-level isolation, self-service namespaces, and app store integrations for Kueue, Ray, or Kubeflow, improving your user experience for multi-tenant GPU clusters.

---

## Autoscaling GPU Workloads

### Cluster Autoscaler and Node Pools

- Maintain a dedicated node group/pool for GPU instances.
- Configure Cluster Autoscaler with scale-up policies for the GPU pool.
- Taint GPU nodes and use tolerations so only GPU workloads trigger GPU node scale-ups.

### Horizontal Pod Autoscaler (HPA) with GPU Metrics

HPA can scale on custom metrics (e.g., GPU utilization or inference latency).

- Export GPU metrics with DCGM Exporter (deployed by GPU Operator).
- Use a Prometheus Adapter to surface metrics to the Kubernetes Metrics API.
- Define HPA based on a custom metric like dcgm_gpu_utilization.

Example HPA (conceptual; actual metric names may vary):

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: triton-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: triton-server
  minReplicas: 1
  maxReplicas: 10
  metrics:
    - type: Pods
      pods:
        metric:
          name: dcgm_gpu_utilization
        target:
          type: AverageValue
          averageValue: "70"
```

For batch jobs, consider Kueue-based scaling and Cluster Autoscaler, rather than HPA, to control when nodes are added.

---

## Observability and Monitoring

A robust GPU cluster needs visibility:

- DCGM Exporter: Exposes GPU metrics such as utilization, memory usage, temperature, and power draw.
- Prometheus + Grafana: Set up dashboards for GPU health and performance.
- Alerts: Trigger alerts on high temperature, low memory, ECC errors, or stalled jobs.

Example PromQL snippets:

- Average GPU utilization per pod:
  avg by (pod) (dcgm_gpu_utilization)

- Memory usage per GPU:
  dcgm_fb_used_bytes / dcgm_fb_total_bytes

- Node-level power draw:
  avg by (instance) (dcgm_power_usage_watts)

In addition, instrument application-level metrics (e.g., inference latency, throughput) to correlate with GPU metrics.

---

## Storage and Data Pipelines for GPU Jobs

GPU applications are often I/O intensive:

- Use fast storage: NVMe local SSDs for scratch space; high-performance network storage for datasets.
- Consider data caching layers like Alluxio or your object store’s caching gateways to reduce data fetch latency.
- GPUDirect Storage (GDS): For advanced setups, GDS can bypass CPU for I/O, improving throughput. Ensure driver and kernel compatibility.
- PersistentVolumeClaims for model artifacts and checkpoints; CSI drivers that support high throughput.

---

## Security and Compliance

- RuntimeClass: Use the NVIDIA runtime class; avoid privileged containers unless strictly necessary.
- Avoid hostPath mounts to /dev/nvidia\*; the device plugin maps devices automatically.
- Image hygiene: Use trusted base images with pinned tags, scan for vulnerabilities, and keep CUDA libraries up to date.
- Pod Security: Apply Pod Security Admission (baseline/restricted), NetworkPolicies to isolate tenants, and Secrets for credentials.
- Egress governance: Control data exfiltration paths for compliance-sensitive AI workloads.

---

## Operations: Upgrades, Resilience, and Performance Tuning

### Driver and Toolkit Upgrades

- The GPU Operator can orchestrate driver upgrades; use node draining and PodDisruptionBudgets (PDBs) for minimal downtime.
- Validate CUDA/runtime compatibility in staging; pin image versions to avoid accidental incompatibilities.

### Node Maintenance

- Drain nodes before maintenance:
  kubectl drain <node> --ignore-daemonsets --delete-emptydir-data
- Ensure workloads have appropriate PDBs to avoid abrupt termination of critical services.

### Performance Tuning Checklist

- Enable topology-aware allocation on GPU nodes:
  - kubelet: topologyManagerPolicy=single-numa-node
  - CPU Manager: static policy for guaranteed CPU pinning if latency sensitive
- Use MIG for strict isolation in multi-tenant inference.
- Enable MPS for throughput-optimized micro-batch jobs.
- Choose the right model serving stack:
  - NVIDIA Triton Inference Server for multi-framework serving and dynamic batching
  - TensorRT optimizations for low latency
- Batch tuning:
  - Balance batch size vs. latency
  - Use dynamic batching for Triton
- I/O:
  - Preload models
  - Warm up caches
  - Pin CPU memory for data loaders if applicable

---

## Practical Patterns and Examples

### Example 1: Inference Deployment with Affinity and Tolerations

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: triton-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: triton
  template:
    metadata:
      labels:
        app: triton
    spec:
      runtimeClassName: nvidia
      tolerations:
        - key: "gpu"
          operator: "Equal"
          value: "true"
          effect: "NoSchedule"
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: nvidia.com/gpu.product
                    operator: In
                    values: ["NVIDIA-A10", "Tesla-T4"]
      containers:
        - name: triton
          image: nvcr.io/nvidia/tritonserver:24.02-py3
          ports:
            - containerPort: 8000
          resources:
            limits:
              nvidia.com/gpu: "1"
          args: ["tritonserver", "--model-repository=/models"]
          volumeMounts:
            - name: models
              mountPath: /models
      volumes:
        - name: models
          persistentVolumeClaim:
            claimName: triton-models-pvc
```

### Example 2: Resource Quotas per Team

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: team-a
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-a-gpu
  namespace: team-a
spec:
  hard:
    limits.nvidia.com/gpu: "8"
    requests.cpu: "100"
    requests.memory: "256Gi"
```

### Example 3: Gang-Scheduled Distributed Training (Conceptual)

- Use Volcano or Kueue with a Job CRD (e.g., PyTorchJob, Kubeflow TFJob).
- Ensure the scheduler starts all workers/PS replicas simultaneously.
- Bind to GPU nodes with appropriate tolerations and affinities.

---

## A Decision Map: Sharing Strategy vs. Use Case

- Batch training with sustained GPU usage:
  - MIG or dedicated GPUs for predictable performance.
- Online inference with spiky, small requests:
  - Time-slicing or MPS to increase multiplexing.
- Multi-tenant platform with strict isolation/SLA:
  - MIG profiles and quotas per namespace; PriorityClasses for critical workloads.
- Cost-sensitive experimentation:
  - Time-slicing with quotas; elastic GPU node pools via Cluster Autoscaler.

---

## Working Smarter with Platform Abstractions

Operating GPU clusters involves many moving parts. Consider layering platform abstractions:

- “Cloud OS” on Kubernetes: Platforms like Sealos simplify cluster lifecycle, user projects, cost tracking, and app installation.
- App marketplace: One-click deploy of NVIDIA GPU Operator, Ray, Kubeflow, or model-serving stacks to reduce setup time.
- Self-service projects: Developers request GPUs within quotas and get isolated environments by default.

These approaches reduce toil and let you focus on models and applications rather than infrastructure plumbing.

---

## Common Pitfalls and How to Avoid Them

- Mismatched CUDA/driver versions:
  - Always verify the CUDA toolkit in your image is compatible with the node driver.
- Forgetting runtimeClassName or lacking Container Toolkit:
  - Pods won’t see GPUs; use GPU Operator and test with nvidia-smi.
- Overcommitting GPUs without a plan:
  - Time-slicing without SLO monitoring leads to unpredictable latency; set HPA and alerts.
- Ignoring topology and NUMA:
  - Leads to cross-socket traffic and jitter; enable topology manager on GPU nodes.
- Single-tenancy mindset in shared clusters:
  - Without quotas and priority classes, one team can starve others.

---

## An End-to-End Minimal Checklist

1. Provision GPU nodes (cloud or on-prem).
2. Install NVIDIA GPU Operator (drivers, device plugin, DCGM exporter).
3. Label and taint GPU nodes; set tolerations for GPU workloads.
4. Configure MIG or time-slicing if sharing is required.
5. Enforce ResourceQuotas and PriorityClasses per namespace/team.
6. Set up monitoring: Prometheus, Grafana, alerts on GPU and app metrics.
7. Enable autoscaling:
   - Cluster Autoscaler for GPU node pool
   - HPA on custom metrics for inference
8. Use gang scheduling for distributed training (Kueue/Volcano).
9. Implement Pod Security, NetworkPolicies, and image scanning.
10. Document upgrade procedures; test driver/runtime changes in staging.

---

## Conclusion

Kubernetes offers a powerful, flexible foundation for running GPU workloads at scale, but realizing its full potential requires a thoughtful approach to provisioning and management. The core ideas are straightforward: expose GPUs via the device plugin, request them as extended resources, and use Kubernetes’ scheduling, policies, and operators to automate the rest. From there, you can progressively add sophistication—MIG for isolation, time-slicing for efficiency, quotas for fairness, topology tuning for performance, and autoscaling for elasticity.

Get the fundamentals right, and the benefits compound: faster experimentation, higher utilization, lower costs, and a better developer experience. Whether you craft your own stack or leverage platforms like Sealos to simplify operations and provide self-service workflows, the path to reliable, scalable GPU operations in Kubernetes is within reach.

Use this guide as your roadmap—start small with a single GPU node and the GPU Operator, then iterate toward multi-tenant, autoscaled, and observability-rich clusters that power your organization’s AI ambitions.
