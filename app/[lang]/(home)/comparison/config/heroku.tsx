import Image from 'next/image';
import HerokuIcon from '@/assets/platform-icons/heroku.svg';
import {
  CodeXml,
  GitCompare,
  Settings,
  Box,
  Globe,
  Shield,
  TrendingUp,
  Users,
  Key,
  Network,
  Store,
  Database,
  Bot,
  Wrench,
  Plug,
  Zap,
  Clock,
  DollarSign,
} from 'lucide-react';
import { ComparisonConfig } from './platforms';

export const herokuConfig: ComparisonConfig = {
  name: 'Heroku',
  icon: <Image src={HerokuIcon} alt="" className="size-full" />,
  order: 10,
  content: {
    overview:
      'Heroku is a mature Platform-as-a-Service (PaaS) built around git-based deployment and buildpacks. It runs applications on dynos (managed Linux containers), pairs seamlessly with the Heroku CLI and GitHub integration, and offers Pipelines, Review Apps, and a large add-ons marketplace. The platform abstracts infrastructure details for teams that want a fast path from code to production with a predictable, dyno-based pricing model.',
    pricing: `Heroku Dyno Rates:
• Eco: $5/mo (0.5 GB, sleeps on inactivity)
• Basic: $7/mo (0.5 GB, no sleeping)
• Standard-1X: $25/mo (0.5 GB)
• Standard-2X: $50/mo (1 GB)
• Performance-M: $250+/mo (2.5 GB)
• Performance-L/2XL: $500-$1,000+/mo (14-128 GB)
• Add-ons (Postgres/Redis/Kafka): priced separately`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Proprietary PaaS' },
          { type: 'check', value: false },
          {
            type: 'text-multi-check',
            value: ['Cloud only', 'Private Spaces: Enterprise'],
          },
          { type: 'text', value: 'No free tier (Eco $5/mo)' },
          { type: 'text', value: 'Performance-2XL: 128GB' },
          { type: 'text', value: 'Performance-2XL: 128GB' },
          { type: 'text', value: 'Multiple (per app)' },
          { type: 'text', value: 'Plan-based (dyno limits)' },
          { type: 'text', value: 'Via add-on (Scheduler)' },
          { type: 'text', value: 'Limited (1500 lines; add-ons)' },
          { type: 'text-with-check', value: 'Eco dynos sleep' },
          { type: 'check', value: true },
        ],
        strengths: [],
      },
      'developer-experience': {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <GitCompare className="size-full" />,
            title: 'Classic Git-Push Workflow',
            content:
              'Heroku pioneered the git-push-to-deploy workflow with buildpack-based detection, making it easy to ship supported frameworks with minimal configuration.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Review Apps & Pipelines',
            content:
              "Heroku Flow includes **Pipelines** and **Review Apps** that spin up disposable environments for every pull request, making QA and stakeholder review seamless.",
          },
          {
            icon: <Settings className="size-full" />,
            title: 'Mature CLI & Dashboard',
            content:
              'The Heroku CLI and web dashboard provide a cohesive operational experience—scaling dynos, tailing logs, running one-off commands, and managing add-ons with a few commands or clicks.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Declarative App Configuration',
            content:
              'Heroku supports config-as-code through `Procfile`, `app.json`, and `heroku.yml`, keeping deployment behavior versioned alongside your code.',
          },
        ],
        keyDifference: {
          title: 'Heroku Approach',
          content:
            "Heroku prioritizes a mature, opinionated PaaS workflow with buildpacks, git-based deploys, and Review Apps. Teams that want a proven, low-friction path from git push to production will appreciate Heroku's streamlined flow.",
        },
      },
      architecture: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Private Spaces are enterprise-only',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          {
            type: 'text-with-check',
            value: 'Eco dynos sleep',
          },
          {
            type: 'warning',
            value: 'Single-region app',
            note: 'Multi-region requires multiple apps',
          },
        ],
        strengths: [
          {
            icon: <Box className="size-full" />,
            title: 'Dyno Model Simplicity',
            content:
              "Heroku's dyno abstraction makes scaling straightforward: increase dyno count for horizontal scale or switch to larger dyno sizes for more headroom.",
          },
          {
            icon: <TrendingUp className="size-full" />,
            title: 'Eco Dyno Sleeping',
            content:
              'Eco dynos sleep on inactivity, making them well-suited for dev/staging apps that do not need to run 24/7.',
          },
          {
            icon: <TrendingUp className="size-full" />,
            title: 'Performance Tier Autoscaling',
            content:
              'Autoscaling is available on Performance dynos, letting teams scale based on load without managing infrastructure.',
          },
          {
            icon: <Globe className="size-full" />,
            title: 'Regional Choice',
            content:
              'Heroku lets you choose a region per app (US/EU), though active-active multi-region deployments require multiple apps and additional routing.',
          },
        ],
        keyDifference: {
          title: 'Heroku Approach',
          content:
            'Heroku provides maximum operational simplicity through its dyno abstraction, at the cost of portability and deep infrastructure control. Teams that want a mature, fully managed PaaS without Kubernetes complexity will value this trade-off.',
        },
      },
      collaboration: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Heroku Enterprise',
          },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Paid per seat',
            note: 'Enterprise teams require paid seats',
          },
          { type: 'check', value: true },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Heroku Enterprise',
          },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Heroku Enterprise',
          },
        ],
        strengths: [
          {
            icon: <Users className="size-full" />,
            title: 'Simple Team Collaboration',
            content:
              'Heroku Teams and app-level collaborators provide a straightforward model for managing access without Kubernetes complexity.',
          },
          {
            icon: <Clock className="size-full" />,
            title: 'Release & Activity History',
            content:
              'The Heroku dashboard surfaces release history and activity streams that make it easy to audit deployments and configuration changes.',
          },
          {
            icon: <CodeXml className="size-full" />,
            title: 'Review Apps for Team QA',
            content:
              "Heroku Flow's Review Apps make it easy for teams to validate changes in isolated environments tied to pull requests.",
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Private Spaces for Isolation',
            content:
              'Enterprise teams can use Private Spaces for stronger network isolation, VPC peering, and stricter compliance requirements.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Enterprise Compliance',
            content:
              'Heroku Enterprise supports SOC, HIPAA/BAA, PCI, and SSO/SAML integrations for regulated industries.',
          },
        ],
        keyDifference: {
          title: 'Heroku Approach',
          content:
            'Heroku provides simpler team management that "just works" for most teams, with enterprise compliance and Private Spaces available at higher tiers.',
        },
      },
      ecosystem: {
        features: [
          { type: 'check', value: true },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Via add-ons',
            note: 'Available through Heroku Elements',
          },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Via add-ons',
            note: 'Available through Heroku Elements',
          },
          {
            type: 'warning',
            value: 'Via add-ons',
            note: 'Available through Heroku Elements',
          },
          {
            type: 'warning',
            value: 'Via add-ons',
            note: 'Available through Heroku Elements',
          },
          {
            type: 'warning',
            value: 'Via add-ons',
            note: 'Available through Heroku Elements',
          },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: [
          {
            icon: <Store className="size-full" />,
            title: 'Extensive Add-ons Marketplace',
            content:
              "Heroku's Elements marketplace offers hundreds of add-ons for databases, messaging, observability, analytics, and security—available in just a few clicks.",
          },
          {
            icon: <Database className="size-full" />,
            title: 'First-Party Data Services',
            content:
              'Heroku Postgres and Heroku Redis are tightly integrated, with automatic provisioning, backups, and environment variable wiring.',
          },
          {
            icon: <Plug className="size-full" />,
            title: 'Add-on Integration',
            content:
              'Provisioned services are automatically injected into your app configuration, reducing manual setup and keeping everything in one billing plane.',
          },
          {
            icon: <Wrench className="size-full" />,
            title: 'Ecosystem Maturity',
            content:
              "Heroku's add-on ecosystem has matured over a decade, making it easy to assemble production-ready stacks quickly.",
          },
        ],
        keyDifference: {
          title: 'Heroku Approach',
          content:
            'Heroku offers a broad, mature add-ons ecosystem with tight platform integration for common services, but it lacks Kubernetes-native extensibility. If you want a fully managed PaaS with a rich marketplace, Heroku shines.',
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$200/mo',
          sealosSavings: { type: 'comparable', savings: 88 },
          label: 'Heroku (Dyno-Based)',
        },
        {
          cost: '~$800/mo',
          sealosSavings: { type: 'comparable', savings: 84 },
          label: 'Heroku (Dyno-Based)',
        },
        {
          cost: '~$1,600/mo',
          sealosSavings: { type: 'comparable', savings: 68 },
          label: 'Heroku (Dyno-Based)',
        },
      ],
      note: 'Heroku calculation: Standard-2X dynos $50/mo each, scaled to approximate RAM requirements',
      source: {
        url: 'https://www.heroku.com/pricing',
        label: 'Heroku Pricing',
      },
    },
    guidance: [
      {
        icon: <GitCompare className="size-full" />,
        content:
          'Prefer a **classic git-push workflow** with buildpacks and minimal config',
      },
      {
        icon: <CodeXml className="size-full" />,
        content:
          'Need **Heroku Flow (Pipelines + Review Apps)** for PR-based QA',
      },
      {
        icon: <Store className="size-full" />,
        content:
          'Rely on the **Heroku Elements add-ons ecosystem** for managed services',
      },
      {
        icon: <Shield className="size-full" />,
        content:
          'Value a **mature PaaS** with strong compliance options (SOC, HIPAA, PCI)',
      },
      {
        icon: <Settings className="size-full" />,
        content: 'Want fast onboarding via the **Heroku CLI + dashboard**',
      },
      {
        icon: <DollarSign className="size-full" />,
        content:
          'Are comfortable with **dyno-based pricing** and add-on billing',
      },
    ],
  },
};
