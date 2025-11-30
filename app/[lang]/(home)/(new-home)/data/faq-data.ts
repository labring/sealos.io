// FAQ data shared between client component and server-side schema generation
export const faqData = [
  {
    question: 'What is Sealos?',
    answer:
      'Sealos is an AI-native Cloud Operating System built on Kubernetes that unifies the entire application lifecycle, from development in cloud IDEs to production deployment and management. It is perfect for building and scaling modern AI applications, SaaS platforms, and complex microservice architectures. The platform is 100% source-available, and for production you can choose either a fully managed cloud service or self-host on your own infrastructure.',
  },
  {
    question: "Can I use Sealos if I'm not a Kubernetes expert?",
    answer:
      "Absolutely! Sealos is designed to abstract away all Kubernetes complexity. You don't need to write YAML files, manage containers, or understand Kubernetes internals. Simply describe what you want to deploy using natural language or our intuitive UI, and Sealos handles the rest. Our AI-powered deployment system makes cloud infrastructure accessible to developers of all skill levels.",
  },
  {
    question: 'What languages and frameworks can I deploy?',
    answer:
      'Sealos supports virtually any programming language and framework. This includes Node.js, Python, Java, Go, Rust, PHP, Ruby, .NET, and more. Popular frameworks like Next.js, React, Vue, Django, Flask, Spring Boot, FastAPI, and Express are all fully supported. If it runs in a container, it runs on Sealos.',
  },
  {
    question: 'How does billing and pricing work?',
    answer:
      'Sealos offers simple subscription-based pricing with four plans: Starter ($7/month), Hobby ($25/month), Pro ($512/month), and Team ($2,030/month). Each plan includes dedicated resources (vCPU, RAM, storage, and traffic). Start with a 7-day free trial, no credit card required. All plans are flexible to scale as your needs grow, with no hidden fees or surprises.',
  },
  {
    question: 'Can I migrate from Vercel, Railway, or Render?',
    answer:
      'Yes! Migrating to Sealos is straightforward. We support standard Docker images, Git repository deployments, and Docker Compose files. Most applications can be migrated with minimal configuration changes. Our documentation includes step-by-step migration guides for popular platforms, and our support team is available to assist with complex migrations.',
  },
  {
    question: "What's the difference between Sealos Cloud and self-hosted?",
    answer:
      'Sealos Cloud is our fully managed service where we handle all infrastructure, updates, and maintenance. Self-hosted Sealos lets you deploy the platform on your own Kubernetes cluster, giving you complete control over your data and infrastructure. Both options use the same source-available codebase. Self-hosting is ideal for enterprises with strict data residency requirements or existing Kubernetes infrastructure.',
  },
  {
    question: 'Does Sealos support custom domains and SSL?',
    answer:
      "Yes, Sealos fully supports custom domains with automatic SSL certificate provisioning via Let's Encrypt. You can configure custom domains for any application with just a few clicks. We also support wildcard certificates for multi-tenant applications and bring-your-own certificate options for enterprise requirements.",
  },
  {
    question: 'What databases does Sealos support?',
    answer:
      'Sealos provides one-click deployment for PostgreSQL, MySQL, MongoDB, Redis, Kafka, and vector databases like Milvus and pgvector. All databases come with high availability options, automated backups, point-in-time recovery, and easy scaling. You can also connect to external databases or deploy any database available as a Docker image.',
  },
  {
    question: 'What kind of support is available?',
    answer:
      'We offer multiple support channels: comprehensive documentation, community Discord server, GitHub discussions, and email support. Pro and Enterprise plans include priority support with faster response times, dedicated account managers, and optional on-call support. Our community is active and helpful for troubleshooting and best practices.',
  },
];
