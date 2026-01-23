export type FAQ = {
  question: string;
  answer: string;
};

/**
 * Generate FAQs for the comparison of two platforms.
 * @param firstPlatformName name of the first platform
 * @param secondPlatformName name of the second platform
 * @returns FAQ data
 */
export function generateFaq(
  firstPlatformName: string,
  secondPlatformName: string,
): FAQ[] {
  // Render-specific FAQs
  if (secondPlatformName === 'Render') {
    return [
      {
        question: 'How much can I actually save by switching from Render to Sealos?',
        answer: `For always-on production workloads, savings typically range from **60-85%**.

**Example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):**

| Cost Component | Render | Sealos Standard |
|---------------|--------|-----------------|
| Compute (monthly) | ~$680 (2× Pro Max) | Included |
| PostgreSQL (Pro) | ~$95/mo | Included |
| Bandwidth (100GB) | ~$10 | Included |
| **Total** | **~$785/mo** | **~$128/mo** |

The larger your infrastructure, the more you save. Render's instance-based pricing is straightforward, but for production apps running continuously, Sealos's fixed plans deliver significant cost advantages.`,
      },
      {
        question: "What's included in Sealos that costs extra on Render?",
        answer: `Several things that Render charges separately are included in Sealos plans:

| Feature | Render | Sealos |
|---------|--------|--------|
| MySQL/MongoDB hosting | Not available (run yourself) | Included managed service |
| Object storage | Not available (use external S3) | Included (S3-compatible) |
| Egress bandwidth | $0.10/GB beyond free tier | Generous allowance (50GB-3TB) |
| Custom domains | Unlimited (paid plans) | Unlimited |
| App marketplace | Not available | 100+ one-click apps |`,
      },
      {
        question: 'Can I verify these claims myself?',
        answer: `Absolutely. All data in this comparison comes from official, publicly available sources:

- **Render Pricing**: [render.com/pricing](https://render.com/pricing)
- **Sealos Pricing**: [sealos.io/pricing](https://sealos.io/pricing)
- **Sealos Source Code**: [github.com/labring/sealos](https://github.com/labring/sealos)

We encourage you to verify and calculate based on your specific workload.`,
      },
      {
        question: 'How long does it take to migrate from Render to Sealos?',
        answer: `Typical migrations complete in **10–14 days**. Here's what the process looks like:

**Week 1: Assessment & Setup**
- Our team audits your Render services, databases, and environment variables
- We provision equivalent resources on Sealos and configure networking

**Week 2: Migration & Validation**
- Data migration with zero-downtime cutover strategy
- CI/CD pipeline reconfiguration
- Production validation and traffic switchover`,
      },
      {
        question: 'Do we need Kubernetes expertise to use Sealos?',
        answer: `**No.** DevBox and App Launchpad abstract Kubernetes primitives completely. You can:
- Deploy apps with a single click or natural language prompt
- Manage databases without touching YAML
- Scale services with simple UI controls

Platform teams who want deeper control can still access native Kubernetes APIs, \`kubectl\`, and Helm when needed. Sealos gives you **simplicity by default, power when required**.`,
      },
      {
        question: 'Can Sealos run in a private region or on our own infrastructure?',
        answer: `**Yes.** Because Sealos is 100% source-available, you have full deployment flexibility:

- **Sealos Cloud**: Fully managed service in multiple regions
- **Self-hosted**: Deploy on your own AWS, GCP, Azure, or bare metal
- **Hybrid**: Mix cloud and on-premise for compliance requirements

This is a key difference from Render, which only offers cloud deployment on Render's infrastructure. With Sealos, you're never locked in.`,
      },
    ];
  }

  // Replit-specific FAQs
  if (secondPlatformName === 'Replit') {
    return [
      {
        question:
          'How does Sealos pricing compare to Replit for production workloads?',
        answer: `For always-on production workloads, Sealos offers more predictable costs.

**Example comparison (8 vCPU, 16GB RAM, 24/7):**

| Cost Component | Replit Teams | Sealos Standard |
|---------------|--------------|-----------------|
| Base subscription | $35/user/mo | $128/mo (fixed) |
| Resources | Limited to 8 vCPU, 16GB | 8 vCPU, 16GB included |
| Team of 5 developers | $175/mo + overage | $128/mo (same) |
| Additional usage | Pay-as-you-go | Included in plan |

Sealos charges by resources, not users—so adding team members doesn't increase costs.`,
      },
      {
        question: "What's included in Sealos that Replit doesn't offer?",
        answer: `Several capabilities that Sealos includes are not available on Replit:

| Feature | Replit | Sealos |
|---------|--------|--------|
| Self-hosting option | ❌ | ✅ 100% source-available |
| Multiple database types | PostgreSQL only | MySQL, PostgreSQL, MongoDB, Redis, etc. |
| Object storage | ❌ | ✅ S3-compatible included |
| GPU support | ❌ | ✅ For AI/ML workloads |
| Kubernetes API access | ❌ | ✅ Full access |
| Cron jobs | ❌ | ✅ Unlimited |
| Horizontal scaling | ❌ | ✅ HPA support |`,
      },
      {
        question: 'Can I verify these claims myself?',
        answer: `Absolutely. All data in this comparison comes from official, publicly available sources:

- **Replit Pricing**: [replit.com/pricing](https://replit.com/pricing)
- **Sealos Pricing**: [sealos.io/pricing](https://sealos.io/pricing)
- **Sealos Source Code**: [github.com/labring/sealos](https://github.com/labring/sealos)

We encourage you to verify and calculate based on your specific workload.`,
      },
      {
        question: 'How long does it take to migrate from Replit to Sealos?',
        answer: `Typical migrations complete in **7–10 days**. Here's what the process looks like:

**Week 1: Assessment & Setup**
- Export your code from Replit (it's just files)
- Our team helps configure equivalent DevBox environments on Sealos
- Set up databases and migrate data

**Week 2: Validation & Cutover**
- Test your applications in Sealos DevBox
- Configure deployment pipelines
- Production validation and domain switchover

Since Replit code is standard source code, migration is straightforward. The main work is replicating environment configuration.`,
      },
      {
        question: 'Do we need Kubernetes expertise to use Sealos?',
        answer: `**No.** DevBox and App Launchpad abstract Kubernetes primitives completely. You can:
- Deploy apps with a single click or natural language prompt
- Manage databases without touching YAML
- Scale services with simple UI controls

Platform teams who want deeper control can still access native Kubernetes APIs, \`kubectl\`, and Helm when needed. Sealos gives you **simplicity by default, power when required**.`,
      },
      {
        question:
          'Can Sealos run in a private region or on our own infrastructure?',
        answer: `**Yes.** Because Sealos is 100% source-available, you have full deployment flexibility:

- **Sealos Cloud**: Fully managed service in multiple regions
- **Self-hosted**: Deploy on your own AWS, GCP, Azure, or bare metal
- **Hybrid**: Mix cloud and on-premise for compliance requirements

This is a key difference from Replit, which only offers cloud deployment with no self-hosting option. With Sealos, you're never locked in.`,
      },
    ];
  }

  // Vercel-specific FAQs
  if (secondPlatformName === 'Vercel') {
    return [
      {
        question: 'How much can I actually save by switching from Vercel to Sealos?',
        answer: `For always-on production workloads, savings typically range from **60-80%** because Vercel bills per Active CPU-hour, Provisioned Memory, bandwidth, and seats.

**Example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):**

| Cost Component | Vercel | Sealos Standard |
|---------------|--------|-----------------|
| Compute (monthly) | ~$737 (Active CPU @ $0.128/hr in iad1) | Included |
| Provisioned Memory | Metered separately | Included |
| 100GB egress | Region-based metering | Included |
| **Total** | **~$737+/mo** | **~$128/mo** |

The more resources you use, the more you save. Vercel's per-execution billing is great for sporadic workloads, but for production apps running continuously, fixed plans win.`,
      },
      {
        question: "What's included in Sealos that costs extra on Vercel?",
        answer: `Several things that Vercel charges separately are included in Sealos plans:

| Feature | Vercel | Sealos |
|---------|--------|--------|
| Database hosting | Metered (Postgres/KV/partners) | Included in plan quota |
| Object storage | Vercel Blob metered by usage | Included (S3-compatible) |
| Bandwidth | Metered by region after quota | Generous allowance (50GB-3TB) |
| Active CPU/Build minutes | Billed per CPU-hour | Included |
| Custom domains | Hobby: 50/project; Pro higher | Unlimited |`,
      },
      {
        question: 'Can I verify these claims myself?',
        answer: `Absolutely. All data in this comparison comes from official, publicly available sources:

- **Vercel Pricing**: [vercel.com/pricing](https://vercel.com/pricing)
- **Vercel Limits**: [vercel.com/docs/limits](https://vercel.com/docs/limits)
- **Sealos Pricing**: [sealos.io/pricing](https://sealos.io/pricing)
- **Sealos Source Code**: [github.com/labring/sealos](https://github.com/labring/sealos)

We encourage you to verify and calculate based on your specific workload.`,
      },
      {
        question: 'How long does it take to migrate from Vercel to Sealos?',
        answer: `Typical migrations complete in **10–14 days**. Here's what the process looks like:

**Week 1: Assessment & Setup**
- Our team audits your Vercel projects, functions, databases, and environment variables
- We provision equivalent resources on Sealos and configure networking

**Week 2: Migration & Validation**
- Data migration with zero-downtime cutover strategy
- CI/CD pipeline reconfiguration
- Production validation and traffic switchover`,
      },
      {
        question: 'Do we need Kubernetes expertise to use Sealos?',
        answer: `**No.** DevBox and App Launchpad abstract Kubernetes primitives completely. You can:
- Deploy apps with a single click or natural language prompt
- Manage databases without touching YAML
- Scale services with simple UI controls

Platform teams who want deeper control can still access native Kubernetes APIs, \`kubectl\`, and Helm when needed. Sealos gives you **simplicity by default, power when required**.`,
      },
      {
        question: 'Can Sealos run in a private region or on our own infrastructure?',
        answer: `**Yes.** Because Sealos is 100% source-available, you have full deployment flexibility:

- **Sealos Cloud**: Fully managed service in multiple regions
- **Self-hosted**: Deploy on your own AWS, GCP, Azure, or bare metal
- **Hybrid**: Mix cloud and on-premise for compliance requirements

This is a key difference from Vercel, which only offers managed cloud deployment. With Sealos, you're never locked in.`,
      },
    ];
  }

  // Heroku-specific FAQs
  if (secondPlatformName === 'Heroku') {
    return [
      {
        question: 'How much can I actually save by switching from Heroku to Sealos?',
        answer: `For always-on production workloads, savings typically range from **60-80%**.

**Example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):**

| Cost Component | Heroku | Sealos Standard |
|---------------|--------|-----------------|
| Compute (dynos) | ~$800 | Included |
| 50GB database | ~$50+ (add-on tier) | Included |
| 100GB egress | Included (plan limits) | Included |
| **Total** | **~$850+/mo** | **~$128/mo** |

The more resources you use, the more you save. Heroku's dyno pricing is predictable, but for production apps running continuously, fixed resource plans are often more cost-effective.`,
      },
      {
        question: "What's included in Sealos that costs extra on Heroku?",
        answer: `Several things that Heroku charges separately are included in Sealos plans:

| Feature | Heroku | Sealos |
|---------|--------|--------|
| Database hosting | Add-ons billed separately | Included in plan quota |
| Object storage | Add-ons / external S3 | Included (S3-compatible) |
| Egress bandwidth | Plan limits / higher tiers | Generous allowance (50GB-3TB) |
| CI/Review Apps dynos | Paid dyno hours | Included (within plan quota) |
| Custom domains | Multiple (per app) | Unlimited |`,
      },
      {
        question: 'Can I verify these claims myself?',
        answer: `Absolutely. All data in this comparison comes from official, publicly available sources:

- **Heroku Pricing**: [heroku.com/pricing](https://www.heroku.com/pricing)
- **Sealos Pricing**: [sealos.io/pricing](https://sealos.io/pricing)
- **Sealos Source Code**: [github.com/labring/sealos](https://github.com/labring/sealos)

We encourage you to verify and calculate based on your specific workload.`,
      },
      {
        question: 'How long does it take to migrate from Heroku to Sealos?',
        answer: `Typical migrations complete in **10–14 days**. Here's what the process looks like:

**Week 1: Assessment & Setup**
- Our team audits your Heroku services, databases, and environment variables
- We provision equivalent resources on Sealos and configure networking

**Week 2: Migration & Validation**
- Data migration with zero-downtime cutover strategy
- CI/CD pipeline reconfiguration
- Production validation and traffic switchover`,
      },
      {
        question: 'Do we need Kubernetes expertise to use Sealos?',
        answer: `**No.** DevBox and App Launchpad abstract Kubernetes primitives completely. You can:
- Deploy apps with a single click or natural language prompt
- Manage databases without touching YAML
- Scale services with simple UI controls

Platform teams who want deeper control can still access native Kubernetes APIs, \`kubectl\`, and Helm when needed. Sealos gives you **simplicity by default, power when required**.`,
      },
      {
        question: 'Can Sealos run in a private region or on our own infrastructure?',
        answer: `**Yes.** Because Sealos is 100% source-available, you have full deployment flexibility:

- **Sealos Cloud**: Fully managed service in multiple regions
- **Self-hosted**: Deploy on your own AWS, GCP, Azure, or bare metal
- **Hybrid**: Mix cloud and on-premise for compliance requirements

This is a key difference from Heroku, which is cloud-only (Private Spaces are still managed by Heroku). With Sealos, you're never locked in.`,
      },
    ];
  }

  // Fly.io-specific FAQs
  if (secondPlatformName === 'Fly.io') {
    return [
      {
        question: 'How much can I actually save by switching from Fly.io to Sealos?',
        answer: `For always-on production workloads, savings typically range from **50-70%**.

**Example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):**

| Cost Component | Fly.io | Sealos Standard |
|---------------|--------|-----------------|
| Compute (always-on VMs) | ~$300 | Included |
| Volumes & storage | ~$15+ | Included |
| Network egress | ~$10+ | Included |
| **Total** | **~$325+/mo** | **~$128/mo** |

The more resources you use, the more you save. Fly.io's usage-based billing is great for sporadic workloads, but for production apps running continuously, fixed plans win.`,
      },
      {
        question: "What's included in Sealos that costs extra on Fly.io?",
        answer: `Several things that Fly.io charges separately are included in Sealos plans:

| Feature | Fly.io | Sealos |
|---------|--------|--------|
| Persistent storage | Volumes billed per GB | Included in plan quota |
| Object storage | External add-ons | Included (S3-compatible) |
| Egress bandwidth | Metered per GB | Generous allowance (50GB-3TB) |
| IPv4 addresses | Billed per address | Included via shared resources |
| Custom domains | Supported | Unlimited |`,
      },
      {
        question: 'Can I verify these claims myself?',
        answer: `Absolutely. All data in this comparison comes from official, publicly available sources:

- **Fly.io Pricing**: [fly.io/pricing](https://fly.io/pricing)
- **Sealos Pricing**: [sealos.io/pricing](https://sealos.io/pricing)
- **Sealos Source Code**: [github.com/labring/sealos](https://github.com/labring/sealos)

We encourage you to verify and calculate based on your specific workload.`,
      },
      {
        question: 'How long does it take to migrate from Fly.io to Sealos?',
        answer: `Typical migrations complete in **10–14 days**. Here's what the process looks like:

**Week 1: Assessment & Setup**
- Our team audits your Fly.io services, databases, volumes, and environment variables
- We provision equivalent resources on Sealos and configure networking

**Week 2: Migration & Validation**
- Data migration with zero-downtime cutover strategy
- CI/CD pipeline reconfiguration
- Production validation and traffic switchover`,
      },
      {
        question: 'Do we need Kubernetes expertise to use Sealos?',
        answer: `**No.** DevBox and App Launchpad abstract Kubernetes primitives completely. You can:
- Deploy apps with a single click or natural language prompt
- Manage databases without touching YAML
- Scale services with simple UI controls

Platform teams who want deeper control can still access native Kubernetes APIs, \`kubectl\`, and Helm when needed. Sealos gives you **simplicity by default, power when required**.`,
      },
      {
        question: 'Can Sealos run in a private region or on our own infrastructure?',
        answer: `**Yes.** Because Sealos is 100% source-available, you have full deployment flexibility:

- **Sealos Cloud**: Fully managed service in multiple regions
- **Self-hosted**: Deploy on your own AWS, GCP, Azure, or bare metal
- **Hybrid**: Mix cloud and on-premise for compliance requirements

This is a key difference from Fly.io, which only offers managed cloud deployment. With Sealos, you're never locked in.`,
      },
    ];
  }

  // DigitalOcean-specific FAQs
  if (secondPlatformName === 'DigitalOcean') {
    return [
      {
        question: 'How much can I actually save by switching from DigitalOcean App Platform to Sealos?',
        answer: `For always-on production workloads, savings typically range from **55-70%**.

**Example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):**

| Cost Component | DigitalOcean | Sealos Standard |
|---------------|-------------|-----------------|
| App container | ~$240 | Included |
| Managed database | ~$60/mo | Included |
| Load balancer | ~$20/mo | Included |
| **Total** | **~$320/mo** | **~$128/mo** |

The more resources you use, the more you save. DigitalOcean's tier-based pricing is transparent, but Sealos's all-inclusive plans deliver better value at scale.`,
      },
      {
        question: "What's included in Sealos that costs extra on DigitalOcean?",
        answer: `Several things that DigitalOcean charges separately are included in Sealos plans:

| Feature | DigitalOcean | Sealos |
|---------|-------------|--------|
| Managed databases | Billed separately ($15+/mo) | Included in plan quota |
| Object storage | Spaces billed per GB | Included (S3-compatible) |
| Load balancers | $20/mo each | Included |
| Egress bandwidth | Metered after allowance | Generous allowance (50GB-3TB) |
| App marketplace | Separate provisioning | 100+ one-click apps |`,
      },
      {
        question: 'Can I verify these claims myself?',
        answer: `Absolutely. All data in this comparison comes from official, publicly available sources:

- **DigitalOcean App Platform Pricing**: [digitalocean.com/pricing/app-platform](https://www.digitalocean.com/pricing/app-platform)
- **Sealos Pricing**: [sealos.io/pricing](https://sealos.io/pricing)
- **Sealos Source Code**: [github.com/labring/sealos](https://github.com/labring/sealos)

We encourage you to verify and calculate based on your specific workload.`,
      },
      {
        question: 'How long does it take to migrate from DigitalOcean to Sealos?',
        answer: `Typical migrations complete in **7–10 days**. Here's what the process looks like:

**Week 1: Assessment & Setup**
- Our team audits your App Platform apps and managed databases
- We provision equivalent resources on Sealos and configure networking

**Week 2: Migration & Validation**
- Database export/import with minimal downtime
- CI/CD pipeline reconfiguration
- Production validation and traffic switchover`,
      },
      {
        question: 'Do we need Kubernetes expertise to use Sealos?',
        answer: `**No.** DevBox and App Launchpad abstract Kubernetes primitives completely. You can:
- Deploy apps with a single click or natural language prompt
- Manage databases without touching YAML
- Scale services with simple UI controls

Platform teams who want deeper control can still access native Kubernetes APIs, \`kubectl\`, and Helm when needed. Sealos gives you **simplicity by default, power when required**.`,
      },
      {
        question: 'Can Sealos run in a private region or on our own infrastructure?',
        answer: `**Yes.** Because Sealos is 100% source-available, you have full deployment flexibility:

- **Sealos Cloud**: Fully managed service in multiple regions
- **Self-hosted**: Deploy on your own AWS, GCP, Azure, or bare metal
- **Hybrid**: Mix cloud and on-premise for compliance requirements

This is a key difference from DigitalOcean, which only offers managed cloud deployment. With Sealos, you're never locked in.`,
      },
    ];
  }

  // AWS-specific FAQs
  if (secondPlatformName === 'AWS') {
    return [
      {
        question: 'How much can I actually save by switching from AWS Elastic Beanstalk to Sealos?',
        answer: `For always-on production workloads, savings typically range from **55-70%**.

**Example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):**

| Cost Component | AWS Elastic Beanstalk | Sealos Standard |
|---------------|------------------------|-----------------|
| EC2 instances | ~$250 | Included |
| ELB + CloudWatch | ~$70/mo | Included |
| RDS (PostgreSQL) | ~$80+/mo | Included |
| **Total** | **~$400+/mo** | **~$128/mo** |

The more resources you use, the more you save. AWS's resource-based pricing adds up quickly, while Sealos's all-inclusive plans provide predictable costs.`,
      },
      {
        question: "What's included in Sealos that costs extra on AWS?",
        answer: `Several things that AWS charges separately are included in Sealos plans:

| Feature | AWS Elastic Beanstalk | Sealos |
|---------|------------------------|--------|
| Managed databases | RDS billed separately | Included in plan quota |
| Load balancer | ELB hourly + data transfer | Included |
| Monitoring | CloudWatch billed separately | Included |
| S3 storage | Billed per GB + requests | Included (S3-compatible) |
| Egress bandwidth | Metered per GB | Generous allowance (50GB-3TB) |`,
      },
      {
        question: 'Can I verify these claims myself?',
        answer: `Absolutely. All data in this comparison comes from official, publicly available sources:

- **AWS Elastic Beanstalk Pricing**: [aws.amazon.com/elasticbeanstalk/pricing/](https://aws.amazon.com/elasticbeanstalk/pricing/)
- **Sealos Pricing**: [sealos.io/pricing](https://sealos.io/pricing)
- **Sealos Source Code**: [github.com/labring/sealos](https://github.com/labring/sealos)

We encourage you to verify and calculate based on your specific workload.`,
      },
      {
        question: 'How long does it take to migrate from AWS to Sealos?',
        answer: `Typical migrations complete in **14–21 days**. Here's what the process looks like:

**Week 1: Assessment & Setup**
- Our team audits your Beanstalk environments, RDS instances, and VPC configuration
- We provision equivalent resources on Sealos and configure networking

**Week 2-3: Migration & Validation**
- Database migration with minimal downtime using native tools
- CI/CD pipeline reconfiguration
- Production validation and traffic switchover`,
      },
      {
        question: 'Do we need Kubernetes expertise to use Sealos?',
        answer: `**No.** DevBox and App Launchpad abstract Kubernetes primitives completely. You can:
- Deploy apps with a single click or natural language prompt
- Manage databases without touching YAML
- Scale services with simple UI controls

Platform teams who want deeper control can still access native Kubernetes APIs, \`kubectl\`, and Helm when needed. Sealos gives you **simplicity by default, power when required**.`,
      },
      {
        question: 'Can Sealos run in a private region or on our own infrastructure?',
        answer: `**Yes.** Because Sealos is 100% source-available, you have full deployment flexibility:

- **Sealos Cloud**: Fully managed service in multiple regions
- **Self-hosted**: Deploy on your own AWS, GCP, Azure, or bare metal
- **Hybrid**: Mix cloud and on-premise for compliance requirements

This is a key difference from AWS Elastic Beanstalk, which runs only on AWS infrastructure. With Sealos, you're never locked in.`,
      },
    ];
  }

  // Azure-specific FAQs
  if (secondPlatformName === 'Azure') {
    return [
      {
        question: 'How much can I actually save by switching from Azure App Service to Sealos?',
        answer: `For always-on production workloads, savings typically range from **55-70%**.

**Example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):**

| Cost Component | Azure App Service | Sealos Standard |
|---------------|-------------------|-----------------|
| App Service Plan | ~$240/mo | Included |
| Azure SQL Database | ~$60+/mo | Included |
| Azure Monitor | ~$20/mo | Included |
| **Total** | **~$320+/mo** | **~$128/mo** |

The more resources you use, the more you save. Azure's resource-based pricing adds up quickly, while Sealos's all-inclusive plans provide predictable costs.`,
      },
      {
        question: "What's included in Sealos that costs extra on Azure?",
        answer: `Several things that Azure charges separately are included in Sealos plans:

| Feature | Azure App Service | Sealos |
|---------|-------------------|--------|
| Managed databases | Azure SQL billed separately | Included in plan quota |
| Blob storage | Billed per GB + operations | Included (S3-compatible) |
| Monitoring | Azure Monitor billed separately | Included |
| VNet integration | Higher tiers only | Included |
| Egress bandwidth | Metered per GB | Generous allowance (50GB-3TB) |`,
      },
      {
        question: 'Can I verify these claims myself?',
        answer: `Absolutely. All data in this comparison comes from official, publicly available sources:

- **Azure App Service Pricing**: [azure.microsoft.com/pricing/details/app-service/](https://azure.microsoft.com/pricing/details/app-service/)
- **Sealos Pricing**: [sealos.io/pricing](https://sealos.io/pricing)
- **Sealos Source Code**: [github.com/labring/sealos](https://github.com/labring/sealos)

We encourage you to verify and calculate based on your specific workload.`,
      },
      {
        question: 'How long does it take to migrate from Azure to Sealos?',
        answer: `Typical migrations complete in **14–21 days**. Here's what the process looks like:

**Week 1: Assessment & Setup**
- Our team audits your App Service apps, Azure SQL databases, and configuration
- We provision equivalent resources on Sealos and configure networking

**Week 2-3: Migration & Validation**
- Database export/import with minimal downtime
- CI/CD pipeline reconfiguration from Azure DevOps
- Production validation and traffic switchover`,
      },
      {
        question: 'Do we need Kubernetes expertise to use Sealos?',
        answer: `**No.** DevBox and App Launchpad abstract Kubernetes primitives completely. You can:
- Deploy apps with a single click or natural language prompt
- Manage databases without touching YAML
- Scale services with simple UI controls

Platform teams who want deeper control can still access native Kubernetes APIs, \`kubectl\`, and Helm when needed. Sealos gives you **simplicity by default, power when required**.`,
      },
      {
        question: 'Can Sealos run in a private region or on our own infrastructure?',
        answer: `**Yes.** Because Sealos is 100% source-available, you have full deployment flexibility:

- **Sealos Cloud**: Fully managed service in multiple regions
- **Self-hosted**: Deploy on your own AWS, GCP, Azure, or bare metal
- **Hybrid**: Mix cloud and on-premise for compliance requirements

This is a key difference from Azure App Service, which runs only on Azure infrastructure. With Sealos, you're never locked in.`,
      },
    ];
  }

  // Google Cloud-specific FAQs
  if (secondPlatformName === 'Google Cloud') {
    return [
      {
        question: 'How much can I actually save by switching from Google App Engine to Sealos?',
        answer: `For always-on production workloads, savings typically range from **55-70%**.

**Example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):**

| Cost Component | Google App Engine | Sealos Standard |
|---------------|-------------------|-----------------|
| Instance hours | ~$240/mo | Included |
| Cloud SQL | ~$60+/mo | Included |
| Cloud Logging | ~$20/mo | Included |
| **Total** | **~$320+/mo** | **~$128/mo** |

The more resources you use, the more you save. Google Cloud's instance-based pricing adds up quickly, while Sealos's all-inclusive plans provide predictable costs.`,
      },
      {
        question: "What's included in Sealos that costs extra on Google Cloud?",
        answer: `Several things that Google Cloud charges separately are included in Sealos plans:

| Feature | Google App Engine | Sealos |
|---------|-------------------|--------|
| Managed databases | Cloud SQL billed separately | Included in plan quota |
| Cloud Storage | Billed per GB + operations | Included (S3-compatible) |
| Logging & Monitoring | Cloud Logging billed separately | Included |
| Cloud Tasks/ Scheduler | Billed per request | Included |
| Egress bandwidth | Metered per GB | Generous allowance (50GB-3TB) |`,
      },
      {
        question: 'Can I verify these claims myself?',
        answer: `Absolutely. All data in this comparison comes from official, publicly available sources:

- **Google App Engine Pricing**: [cloud.google.com/appengine/pricing](https://cloud.google.com/appengine/pricing)
- **Sealos Pricing**: [sealos.io/pricing](https://sealos.io/pricing)
- **Sealos Source Code**: [github.com/labring/sealos](https://github.com/labring/sealos)

We encourage you to verify and calculate based on your specific workload.`,
      },
      {
        question: 'How long does it take to migrate from Google Cloud to Sealos?',
        answer: `Typical migrations complete in **14–21 days**. Here's what the process looks like:

**Week 1: Assessment & Setup**
- Our team audits your App Engine services, Cloud SQL databases, and configuration
- We provision equivalent resources on Sealos and configure networking

**Week 2-3: Migration & Validation**
- Database export/import with minimal downtime
- CI/CD pipeline reconfiguration from Cloud Build
- Production validation and traffic switchover`,
      },
      {
        question: 'Do we need Kubernetes expertise to use Sealos?',
        answer: `**No.** DevBox and App Launchpad abstract Kubernetes primitives completely. You can:
- Deploy apps with a single click or natural language prompt
- Manage databases without touching YAML
- Scale services with simple UI controls

Platform teams who want deeper control can still access native Kubernetes APIs, \`kubectl\`, and Helm when needed. Sealos gives you **simplicity by default, power when required**.`,
      },
      {
        question: 'Can Sealos run in a private region or on our own infrastructure?',
        answer: `**Yes.** Because Sealos is 100% source-available, you have full deployment flexibility:

- **Sealos Cloud**: Fully managed service in multiple regions
- **Self-hosted**: Deploy on your own AWS, GCP, Azure, or bare metal
- **Hybrid**: Mix cloud and on-premise for compliance requirements

This is a key difference from Google App Engine, which runs only on GCP infrastructure. With Sealos, you're never locked in.`,
      },
    ];
  }

  // Railway-specific FAQs (default)
  return [
    {
      question:
        'How much can I actually save by switching from Railway to Sealos?',
      answer: `For always-on production workloads, savings typically range from **60-70%**.

**Example calculation for a medium app (8 vCPU, 16GB RAM, 24/7):**

| Cost Component | Railway | Sealos Standard |
|---------------|---------|-----------------|
| Compute (monthly) | ~$300 | Included |
| 50GB storage | $12.50 | Included |
| 100GB egress | $5.00 | Included |
| **Total** | **~$317/mo** | **~$128/mo** |

The more resources you use, the more you save. Railway's per-second billing is great for sporadic workloads, but for production apps running continuously, fixed plans win.`,
    },
    {
      question: "What's included in Sealos that costs extra on Railway?",
      answer: `Several things that Railway charges separately are included in Sealos plans:

| Feature | Railway | Sealos |
|---------|---------|--------|
| Database hosting | Metered separately | Included in plan quota |
| Object storage | $0.015/GB-month | Included (S3-compatible) |
| Egress bandwidth | $0.05/GB | Generous allowance (50GB-3TB) |
| Build minutes | Counted against usage | Unlimited |
| Custom domains | Hobby: 2, Pro: 20 | Unlimited |`,
    },
    {
      question: 'Can I verify these claims myself?',
      answer: `Absolutely. All data in this comparison comes from official, publicly available sources:

- **Railway Pricing**: [railway.com/pricing](https://railway.com/pricing)
- **Sealos Pricing**: [sealos.io/pricing](https://sealos.io/pricing)
- **Sealos Source Code**: [github.com/labring/sealos](https://github.com/labring/sealos)

We encourage you to verify and calculate based on your specific workload.`,
    },
    {
      question: 'How long does it take to migrate from Railway to Sealos?',
      answer: `Typical migrations complete in **10–14 days**. Here's what the process looks like:

**Week 1: Assessment & Setup**
- Our team audits your Railway services, databases, and environment variables
- We provision equivalent resources on Sealos and configure networking

**Week 2: Migration & Validation**
- Data migration with zero-downtime cutover strategy
- CI/CD pipeline reconfiguration
- Production validation and traffic switchover`,
    },
    {
      question: 'Do we need Kubernetes expertise to use Sealos?',
      answer: `**No.** DevBox and App Launchpad abstract Kubernetes primitives completely. You can:
- Deploy apps with a single click or natural language prompt
- Manage databases without touching YAML
- Scale services with simple UI controls

Platform teams who want deeper control can still access native Kubernetes APIs, \`kubectl\`, and Helm when needed. Sealos gives you **simplicity by default, power when required**.`,
    },
    {
      question:
        'Can Sealos run in a private region or on our own infrastructure?',
      answer: `**Yes.** Because Sealos is 100% source-available, you have full deployment flexibility:

- **Sealos Cloud**: Fully managed service in multiple regions
- **Self-hosted**: Deploy on your own AWS, GCP, Azure, or bare metal
- **Hybrid**: Mix cloud and on-premise for compliance requirements

This is a key difference from Railway, which only offers cloud deployment (BYO Cloud is Enterprise-only). With Sealos, you're never locked in.`,
    },
  ];
}
