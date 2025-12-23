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
