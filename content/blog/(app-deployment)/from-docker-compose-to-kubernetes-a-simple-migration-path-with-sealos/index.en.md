---
title: "From Docker Compose to Kubernetes: A Simple Migration Path with Sealos"
imageTitle: "Docker Compose to Kubernetes with Sealos"
description: "A practical guide outlining a straightforward migration path from Docker Compose to Kubernetes using Sealos. Learn essential steps, best practices, and common pitfalls to avoid."
date: 2025-09-02
tags: ["Docker", "Kubernetes", "Docker-Compose", "Sealos", "Migration"]
authors: ["default"]
---

Modern applications seldom stay small. What starts as a handful of containers running happily in Docker Compose often grows into a distributed system that demands better scalability, resilience, and governance. That’s the point where Kubernetes shines—and also where many teams hesitate, worried that the migration will be complex, disruptive, or time-consuming.

Good news: it doesn’t need to be. In this article, you’ll learn a practical, low-friction path from Docker Compose to Kubernetes using Sealos—a cloud operating system built on Kubernetes that makes cluster creation and operations dramatically simpler. We’ll cover what each piece is, why this migration matters, how the conversion works in practice (with real code), and how to deploy and operate your workloads on Sealos.

By the end, you’ll be able to:

- Stand up a production-grade Kubernetes cluster quickly with Sealos.
- Convert Docker Compose to Kubernetes manifests using familiar tools.
- Apply best practices for secrets, storage, networking, and health checks.
- Deploy, observe, and scale your migrated workloads with confidence.

---

## What Are Docker Compose, Kubernetes, and Sealos?

### Docker Compose in 30 Seconds

Docker Compose is a developer-friendly tool for defining and running multi-container applications with a single YAML file. It’s perfect for local development and simple deployments because it hides a lot of complexity. But as your system grows, Compose becomes harder to scale, secure, and manage across environments.

### Kubernetes: The Standard for Orchestrating Containers

Kubernetes is a container orchestration platform that handles scheduling, networking, storage, health checks, rollouts, and autoscaling. It’s more complex than Compose because it solves a larger problem: running containerized apps reliably at scale in production.

Key benefits:

- Self-healing deployments and rolling updates
- Service discovery and load balancing
- Persistent storage orchestration
- Resource quotas, security policies, and multi-tenancy
- Horizontal autoscaling

### Sealos: Kubernetes Made Simple

Sealos is a cloud operating system that simplifies the lifecycle of Kubernetes:

- Create a cluster with a single command (or use the Sealos Cloud).
- Package cluster components as container images for reproducible installs.
- Operate with standard Kubernetes tools like kubectl and Helm.

Sealos does not reinvent Kubernetes. Instead, it makes Kubernetes accessible by streamlining installation and management, so you can focus on your workloads rather than cluster plumbing.

---

## Why Migrate from Docker Compose to Kubernetes (with Sealos)?

1. Scalability and Resilience: Kubernetes reschedules failed containers, handles rolling updates, and scales workloads.
2. Environment Parity: Reuse the same manifests across dev, staging, and production with minimal drift.
3. Security and Control: Namespaces, network policies, secrets management, admission control, and RBAC.
4. Day-2 Operations: Metrics, logs, tracing, and autoscaling are first-class citizens.
5. Simpler Cluster Ops: Sealos removes much of the friction in setting up and maintaining Kubernetes.

In short, Kubernetes future-proofs your deployments, and Sealos reduces the operational load to get you there.

---

## A Practical Migration Strategy

Migrating isn’t just running a converter on your compose file and calling it a day. Plan for these steps to ensure success:

1. Inventory Your Services

   - List all services, images, environment variables, volumes, and ports.
   - Identify external dependencies (databases, message brokers, third-party APIs).

2. Classify State

   - Stateless (web, API workers) → Deployments.
   - Stateful (databases, queues) → StatefulSets with PersistentVolumeClaims (PVCs).

3. Externalize Secrets

   - Move passwords, tokens, and keys into Kubernetes Secrets.

4. Replace Volumes

   - Map Compose volumes to StorageClasses and PVCs.
   - Decide on a storage backend (local-path, hostPath for dev, or cloud CSI/OpenEBS/Longhorn for prod).

5. Networking and Ingress

   - Replace Compose ports with Services and Ingress.
   - Plan TLS and DNS.

6. Health Checks and Resources

   - Map Compose healthchecks to Kubernetes readiness/liveness/startup probes.
   - Add resource requests/limits for better scheduling and autoscaling.

7. Dev-to-Prod Promotion
   - Use Kustomize or Helm to parameterize environments.

---

## Setting Up Kubernetes with Sealos

You can use Sealos to spin up a Kubernetes cluster on VMs or bare metal quickly. Once you have the Sealos CLI installed, creating a single-node development cluster is often as simple as:

```bash
# Create a single-node Kubernetes cluster
sealos run labring/kubernetes:v1.28.3 --single

# Verify Kubernetes is ready (kubectl should point to the Sealos cluster)
kubectl get nodes
kubectl get pods -A
```

Notes:

- Replace the Kubernetes version tag with the release you need.
- For multi-node clusters, Sealos can join masters and workers via flags or inventory files. Consult the Sealos docs for production-ready topologies, HA control planes, and advanced networking.
- Sealos works with standard Kubernetes tooling, so all kubectl and Helm workflows apply.

Install an ingress controller (for HTTP/HTTPS routing), and a default storage class (for PVCs) if your environment doesn’t provide them:

```bash
# Install Helm if it’s not already available
# (If Sealos installed Helm images, you can skip installation)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install ingress-nginx (popular and simple)
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace

# Install a simple storage class for development clusters
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml
kubectl annotate storageclass local-path storageclass.kubernetes.io/is-default-class="true"
```

With Sealos handling cluster creation and the basic add-ons in place, you’re ready to migrate your applications.

---

## Example: Migrating a Docker Compose App

Let’s start with a representative docker-compose.yaml for a simple web API with Redis and PostgreSQL:

```yaml
version: "3.9"
services:
  api:
    image: ghcr.io/example/my-api:1.2.3
    ports:
      - "8080:8080"
    env_file:
      - .env
    environment:
      - DATABASE_URL=postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432/appdb
      - REDIS_URL=redis://redis:6379/0
      - APP_ENV=production
    depends_on:
      - postgres
      - redis
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"]
      interval: 10s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7.2
    ports:
      - "6379:6379"
    command: ["redis-server", "--save", "20", "1", "--loglevel", "warning"]

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

Key concerns we’ll address:

- Secrets: Move POSTGRES_PASSWORD to a Kubernetes Secret.
- Volumes: Use PVCs for postgres data.
- Health checks: Convert to readiness/liveness probes.
- Networking: Replace host port mappings with Services and Ingress.
- Dependencies: Compose’s depends_on is not a startup gate; we’ll use probes and retries.

---

## Converting Compose to Kubernetes with Kompose

Kompose is a tool that translates Docker Compose files into Kubernetes manifests. It won’t produce perfect production manifests, but it’s a great starting point.

Install Kompose:

```bash
# Linux example
curl -L https://github.com/kubernetes/kompose/releases/latest/download/kompose-linux-amd64 \
  -o /usr/local/bin/kompose
chmod +x /usr/local/bin/kompose

# Verify
kompose version
```

Convert:

```bash
kompose convert -f docker-compose.yaml -o k8s/
```

You’ll get several YAML files under k8s/, typically including Deployments, Services, and PVCs. Review the output for api, redis, and postgres resources.

To keep things maintainable, we’ll use Kustomize to layer improvements on top of the generated manifests without editing them directly.

---

## Structuring Manifests with Kustomize

Create a structure like this:

```
k8s/
  base/            # generated by kompose (or moved here)
    api-deployment.yaml
    api-service.yaml
    redis-deployment.yaml
    redis-service.yaml
    postgres-deployment.yaml
    postgres-service.yaml
    postgres-pvc.yaml
    kustomization.yaml   # we will add this
  overlays/
    dev/
      kustomization.yaml
      patches/
        api-probes.yaml
        api-resources.yaml
        postgres-statefulset.yaml
        secrets.yaml
        configmap.yaml
        ingress.yaml
```

### Base kustomization.yaml

```yaml
# k8s/base/kustomization.yaml
resources:
  - api-deployment.yaml
  - api-service.yaml
  - redis-deployment.yaml
  - redis-service.yaml
  - postgres-deployment.yaml
  - postgres-service.yaml
  - postgres-pvc.yaml
```

We’ll patch in secrets, probes, and other improvements in the overlay.

---

## Adding Secrets and Config

Create a Secret for sensitive values and a ConfigMap for non-sensitive config:

```yaml
# k8s/overlays/dev/patches/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  POSTGRES_PASSWORD: "replace-me-in-prod"
```

```yaml
# k8s/overlays/dev/patches/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "development"
```

Patch the api Deployment to reference them:

```yaml
# k8s/overlays/dev/patches/api-probes.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  template:
    spec:
      containers:
        - name: api
          env:
            - name: APP_ENV
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: APP_ENV
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: POSTGRES_PASSWORD
            - name: DATABASE_URL
              value: "postgres://postgres:$(POSTGRES_PASSWORD)@postgres:5432/appdb"
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 5
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 20
            timeoutSeconds: 3
            failureThreshold: 5
          startupProbe:
            httpGet:
              path: /health
              port: 8080
            failureThreshold: 30
            periodSeconds: 3
```

Also add resource requests/limits (helps scheduling, stability, and autoscaling):

```yaml
# k8s/overlays/dev/patches/api-resources.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  template:
    spec:
      containers:
        - name: api
          resources:
            requests:
              cpu: "100m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

Patch postgres Deployment into a StatefulSet with a PVC:

```yaml
# k8s/overlays/dev/patches/postgres-statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: "postgres"
  replicas: 1
  selector:
    matchLabels:
      io.kompose.service: postgres
  template:
    metadata:
      labels:
        io.kompose.service: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15
          env:
            - name: POSTGRES_DB
              value: appdb
            - name: POSTGRES_USER
              value: postgres
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: POSTGRES_PASSWORD
          ports:
            - containerPort: 5432
          readinessProbe:
            exec:
              command: ["pg_isready", "-U", "postgres"]
            initialDelaySeconds: 10
            periodSeconds: 10
          livenessProbe:
            exec:
              command: ["pg_isready", "-U", "postgres"]
            initialDelaySeconds: 30
            periodSeconds: 20
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

Note: We’re replacing the kompose-generated postgres Deployment and PVC with a StatefulSet and a volumeClaimTemplate for better data consistency. Ensure you remove or override the original postgres Deployment in the overlay so only the StatefulSet is applied.

If you need Ingress to reach the API, add it:

```yaml
# k8s/overlays/dev/patches/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api
  annotations:
    kubernetes.io/ingress.class: "nginx"
spec:
  rules:
    - host: api.dev.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 8080
```

Finally, wire the overlay together:

```yaml
# k8s/overlays/dev/kustomization.yaml
namespace: demo

resources:
  - ../../base

patchesStrategicMerge:
  - patches/api-probes.yaml
  - patches/api-resources.yaml
  - patches/postgres-statefulset.yaml

resources:
  - patches/secrets.yaml
  - patches/configmap.yaml
  - patches/ingress.yaml
```

Apply to your Sealos-managed cluster:

```bash
kubectl create namespace demo
kubectl apply -k k8s/overlays/dev

kubectl -n demo get pods,svc,ingress
```

If you’re not using DNS, you can test the API by port-forwarding:

```bash
kubectl -n demo port-forward svc/api 8080:8080
curl http://localhost:8080/health
```

---

## Handling Redis

For Redis, the kompose-generated Deployment is adequate for dev/test. For production, consider:

- Redis as a StatefulSet with a PVC for persistence.
- Using a well-maintained Helm chart (bitnami/redis) for built-in replication, metrics, and password support.

Example Redis resource patch for a simple persistent standalone:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  serviceName: "redis"
  selector:
    matchLabels:
      app: redis
  replicas: 1
  template:
    metadata:
      labels:
        app: redis
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 5Gi
```

---

## Optional: Generate a Helm Chart from Compose

Kompose can generate a Helm chart:

```bash
kompose convert -f docker-compose.yaml -c -o chart/
helm upgrade --install myapp chart/ -n demo --create-namespace
```

Helm can be a better fit if you want:

- Parameterized values for different environments.
- A packaging format for distribution.
- Built-in rollback and release history.

Sealos plays nicely with Helm—use whichever packaging strategy suits your team.

---

## Day-2 Operations on Sealos: Observability, Scaling, and Updates

Kubernetes gives you powerful primitives for operations. With Sealos providing the cluster, you can layer standard tools:

### Observability Stack

- Logs: Use kubectl logs for ad-hoc, then deploy EFK/ELK or Loki for centralized logging.
- Metrics: Install the Prometheus Operator (kube-prometheus-stack) via Helm for cluster and application metrics.
- Tracing: Deploy OpenTelemetry Collector to export traces from your services.

Example install:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

### Horizontal Pod Autoscaling (HPA)

Add resource requests and deploy an HPA for the API:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api
  namespace: demo
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60
```

Apply:

```bash
kubectl apply -f hpa.yaml
```

Ensure the metrics server is running (often deployed by default in many clusters; if not, install it):

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

### Rolling Updates and Rollbacks

Kubernetes Deployments enable zero-downtime rollouts:

```bash
kubectl -n demo set image deployment/api api=ghcr.io/example/my-api:1.2.4
kubectl -n demo rollout status deployment/api

# Roll back if needed
kubectl -n demo rollout undo deployment/api
```

### Backups for Persistent Volumes

Your storage backend dictates backup strategy:

- CSI snapshots: Use VolumeSnapshot resources to take point-in-time snapshots.
- Application-level: pg_dump for PostgreSQL, Redis RDB/AOF persistence, and off-site backups.
- For production, adopt a tested operator or backup toolchain (e.g., Velero for cluster resources and supported PVs).

---

## Networking and Security Considerations

- Namespaces: Use namespaces for isolation across environments and teams.
- Network Policies: Restrict pod-to-pod communication to only what’s necessary.
- Secrets Management: Use Kubernetes Secrets, sealed-secrets, or an external KMS (e.g., HashiCorp Vault).
- Pod Security: Use Pod Security Admission or Pod Security Policies (where applicable) and ensure containers run as non-root where possible.
- Ingress and TLS: Terminate TLS at the ingress controller and manage certificates via cert-manager.

Install cert-manager:

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true
```

Then create ClusterIssuer and annotate your Ingress for automatic certificates.

---

## Storage: Choosing the Right Backing

Your choice depends on environment:

- Development: local-path-provisioner or hostPath volumes (simple, not HA).
- Bare Metal Production: OpenEBS (LVM/Mayastor), Longhorn, or Ceph/Rook.
- Cloud: Use your provider’s CSI driver (EBS, PD, Azure Disk).

Make sure:

- A default StorageClass exists.
- Stateful workloads use ReadWriteOnce volumes, unless your setup supports shared access (RWX).
- I/O requirements and capacity are sized correctly.

---

## Validating and Hardening the Migration

Before declaring success, run through a checklist:

- Pods become Ready consistently after a fresh deploy.
- Readiness/liveness probes behave correctly under failure scenarios.
- Databases persist data across restarts and node reboots.
- Services are reachable via ClusterIP and Ingress/TLS is configured.
- Resource limits prevent noisy neighbor issues.
- HPA scales up under load test and scales down cleanly.
- Logs and metrics are visible; alerts are configured for key SLOs.
- Backups work and restores are tested.
- RBAC roles are least-privilege for CI/CD and ops.

---

## CI/CD Integration

For each environment, automate:

- Build and push images to a trusted registry.
- Update image tags in Kustomize/Helm (e.g., via GitOps).
- Run kubectl apply -k or helm upgrade as a pipeline stage.
- Add gates for canary or blue-green releases when appropriate.

GitOps with Argo CD or Flux is a natural next step for reliability and auditability.

---

## Troubleshooting Common Issues

- Pods Pending due to PVC: Ensure a default StorageClass exists and the provisioner is healthy.
- CrashLoopBackOff: Inspect container logs and events (kubectl describe pod). Check secrets and env vars.
- Ingress Not Routing: Confirm the ingress controller is running, the Ingress resource uses the correct class, and DNS resolves to the controller’s endpoint.
- Image Pull Errors: Verify the registry is reachable and imagePullSecrets are set for private registries.
- DNS Failures in Pods: Check CoreDNS status (kubectl -n kube-system get pods) and network policies.

Helpful commands:

```bash
kubectl -n demo get pods
kubectl -n demo describe pod <name>
kubectl -n demo logs <name> -c <container>
kubectl get events -A --sort-by=.lastTimestamp
```

---

## Practical Applications and Patterns

- Monolith → Microservices: Kubernetes lets you decompose the system incrementally. Start by migrating the whole Compose stack, then split services.
- Stateful Workloads: Move dev databases first using StatefulSets, then consider managed databases or operators (e.g., Postgres Operator) for production.
- Multi-tenant SaaS: Namespaces per tenant, resource quotas, and network policies keep tenants isolated with predictable performance.
- Edge and On-Prem: Sealos simplifies standing up clusters outside cloud providers; use CSI drivers suited to your hardware.

---

## How Sealos Fits Long-Term

As your usage grows:

- Cluster Lifecycle: Create, upgrade, or tear down clusters predictably using Sealos “cluster images.”
- Standard Tooling: Keep using kubectl, Helm, Kustomize, and your favorite operators—Sealos embraces the ecosystem.
- Portability: Move clusters or workloads across environments with minimal friction.

The aim is to make Kubernetes feel as approachable as Docker Compose without sacrificing the power you need in production.

---

## Conclusion

Moving from Docker Compose to Kubernetes doesn’t have to be a leap into the unknown. With a clear strategy, a conversion tool like Kompose, and a simplified cluster lifecycle via Sealos, you can migrate in a measured, confidence-building way.

Key takeaways:

- Use Sealos to stand up a robust Kubernetes cluster quickly.
- Convert Compose to Kubernetes manifests with Kompose, then refine with Kustomize or Helm.
- Externalize secrets, map volumes to PVCs, add probes, and define resource requests/limits.
- Install ingress and a storage class; adopt observability and autoscaling early.
- Validate with health checks, backups, and load tests before promoting to production.

Start small: migrate a single Compose stack into your Sealos-managed cluster, iterate on best practices, and scale features as your needs grow. The Kubernetes ecosystem will meet you where you are—and with Sealos, getting there is far simpler than you might think.
