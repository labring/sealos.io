import Image from 'next/image';
import ReplitIcon from '@/assets/platform-icons/replit.svg';
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
  MonitorPlay,
  Sparkles,
} from 'lucide-react';
import { ComparisonConfig } from './platforms';

export const replitConfig: ComparisonConfig = {
  name: 'Replit',
  icon: <Image src={ReplitIcon} alt="" className="size-full" />,
  order: 2,
  content: {
    overview:
      'Replit is an all-in-one, AI-driven online development platform that combines a browser-based IDE with cloud hosting capabilities. It offers real-time multiplayer coding, AI-powered code completion (Ghostwriter/Replit Agent), and instant deployment from the browser. Replit is popular among students, educators, and developers who value zero-setup coding environments and seamless collaboration, with recent additions of production deployments and managed PostgreSQL databases.',
    pricing: `Replit Pricing Model:
• Starter (Free): 1 vCPU, 2GB RAM, 1200 min/month, public repos only
• Core ($25/mo): 4 vCPU, 8GB RAM, $25 credits included, private repos
• Teams ($35/user/mo): 8 vCPU, 16GB RAM, $40 credits/user, RBAC
• Enterprise: Custom pricing, up to 64 vCPU, 128GB RAM, SSO/SAML`,
    dimensions: {
      overview: {
        features: [
          { type: 'text', value: 'Proprietary Container Platform' },
          { type: 'check', value: false },
          { type: 'text', value: 'Cloud only' },
          { type: 'text', value: 'Free tier: 1 vCPU, 2GB, 1200 min/month' },
          { type: 'text', value: 'Starter: 1, Core: 4, Teams: 8, Ent: 64' },
          { type: 'text', value: 'Starter: 2GB, Core: 8GB, Teams: 16GB' },
          {
            type: 'warning',
            value: 'Core+',
            note: 'Custom domains available on Core and above',
          },
          { type: 'text', value: 'Single instance only' },
          { type: 'check', value: false },
          { type: 'text', value: 'Limited' },
          { type: 'text-with-check', value: '(Repls sleep when idle)' },
          {
            type: 'warning',
            value: 'Templates',
            note: 'Template gallery for quick project starts',
          },
        ],
        strengths: [],
      },
      'developer-experience': {
        features: [
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Partial',
            note: 'Browser-based environment may differ from production',
          },
          { type: 'check', value: true },
          { type: 'check', value: true },
          { type: 'check', value: false },
          {
            type: 'warning',
            value: 'Templates',
            note: 'Template gallery for quick starts',
          },
          { type: 'check', value: true },
          { type: 'check', value: true },
        ],
        strengths: [
          {
            icon: <MonitorPlay className="size-full" />,
            title: 'Zero-Setup Browser IDE',
            content:
              'Replit offers a fully browser-based IDE that requires no local software installation. You can start coding in seconds from any device with a web browser—perfect for quick prototyping or coding on the go.',
          },
          {
            icon: <Users className="size-full" />,
            title: 'Real-Time Multiplayer Coding',
            content:
              "The platform's signature feature is **real-time multiplayer coding**, where multiple developers see each other's cursors and edits live, similar to Google Docs for code.",
          },
          {
            icon: <Sparkles className="size-full" />,
            title: 'AI-Powered Development',
            content:
              "Replit's **Ghostwriter/Agent** provides AI-powered code completion, generation, and even autonomous coding tasks. The AI is deeply integrated into the browser IDE experience.",
          },
          {
            icon: <Box className="size-full" />,
            title: 'Nix-Powered Flexibility',
            content:
              'Through **Nix integration**, Replit supports virtually any language or framework, with over 30,000 packages available instantly.',
          },
        ],
        keyDifference: {
          title: 'Replit Approach',
          content:
            "Replit prioritizes instant accessibility and collaboration through browser-based development. Teams that value real-time pair programming and zero-setup environments will appreciate Replit's approach.",
        },
      },
      architecture: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Multi-region available only on Enterprise plan',
          },
        ],
        strengths: [
          {
            icon: <Zap className="size-full" />,
            title: 'Instant Accessibility',
            content:
              "Replit's browser-based platform eliminates all setup friction. There's no infrastructure to manage, no containers to configure, no deployment pipelines to set up.",
          },
          {
            icon: <TrendingUp className="size-full" />,
            title: 'Repls Sleep When Idle',
            content:
              'Replit automatically suspends inactive Repls and wakes them on request, which is cost-effective for intermittent workloads like staging environments or admin dashboards.',
          },
          {
            icon: <Database className="size-full" />,
            title: 'Integrated Database Management',
            content:
              'Recent additions like managed **PostgreSQL** with automatic dev/prod separation and schema migrations make database management straightforward for web applications.',
          },
          {
            icon: <Globe className="size-full" />,
            title: 'Regional Clusters',
            content:
              'Replit has evolved to support multiple regional clusters for improved performance and reliability, with enterprise customers potentially getting dedicated single-tenant clusters.',
          },
        ],
        keyDifference: {
          title: 'Replit Approach',
          content:
            "Replit provides maximum operational simplicity at the cost of significant vendor lock-in. Your code runs in Replit's proprietary environment with no export path for infrastructure configuration.",
        },
      },
      collaboration: {
        features: [
          { type: 'check', value: false },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Per-seat',
            note: 'Priced per user on Teams plan ($35/user/month)',
          },
          { type: 'check', value: true },
          { type: 'check', value: true },
          {
            type: 'warning',
            value: 'Partial',
            note: 'Limited internal networking capabilities',
          },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Replit Enterprise plan',
          },
          {
            type: 'warning',
            value: 'Enterprise',
            note: 'Available only on Replit Enterprise plan',
          },
        ],
        strengths: [
          {
            icon: <Users className="size-full" />,
            title: 'Real-Time Multiplayer Coding',
            content:
              "Replit's signature collaboration feature is **real-time multiplayer coding**, where team members see each other's cursors and edits live. This is unmatched for pair programming and code reviews.",
          },
          {
            icon: <Users className="size-full" />,
            title: 'Viewer Seats',
            content:
              'The Teams plan includes **50 free "Viewer" seats**—clients or stakeholders who can view projects without counting as paid members.',
          },
          {
            icon: <Key className="size-full" />,
            title: 'Role-Based Access Control',
            content:
              'Teams can set up pre-defined roles (Admin, Developer, Deploy-only) for project access control.',
          },
          {
            icon: <Shield className="size-full" />,
            title: 'Enterprise Compliance',
            content:
              "For compliance-heavy industries, Replit's Enterprise plan offers **SSO/SAML integration**, SCIM user provisioning, and audit logs.",
          },
        ],
        keyDifference: {
          title: 'Replit Approach',
          content:
            "Replit provides unmatched real-time collaboration with per-user pricing. Teams that prioritize live pair programming and don't mind per-seat costs will appreciate Replit's collaborative features.",
        },
      },
      ecosystem: {
        features: [
          {
            type: 'warning',
            value: 'Templates',
            note: 'Template gallery for quick project starts',
          },
          { type: 'check', value: true },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
          { type: 'check', value: false },
        ],
        strengths: [
          {
            icon: <Database className="size-full" />,
            title: 'Integrated PostgreSQL Database',
            content:
              'Replit now offers managed **PostgreSQL** with automatic development/production separation and schema migrations at deploy time—a significant improvement for web applications.',
          },
          {
            icon: <Store className="size-full" />,
            title: 'Templates Gallery',
            content:
              'Replit provides a **templates gallery** for quickly starting new projects with pre-configured frameworks and languages.',
          },
          {
            icon: <Box className="size-full" />,
            title: 'Nix Package Ecosystem',
            content:
              'Through Nix integration, Replit provides access to over **30,000 packages**, allowing flexible environment configuration for virtually any language or tool.',
          },
          {
            icon: <Sparkles className="size-full" />,
            title: 'AI-Powered Code Assistance',
            content:
              "Replit's **Ghostwriter/Agent** provides AI code completion, generation, and autonomous coding tasks deeply integrated into the development experience.",
          },
        ],
        keyDifference: {
          title: 'Replit Approach',
          content:
            "Replit offers a narrower but tightly integrated set of tools optimized for the browser-based development experience. If you're building standard web applications and value AI coding assistance, Replit's integrated tooling works well.",
        },
      },
    },
    costs: {
      rows: [
        {
          cost: '~$25/mo',
          savings: 0,
          label: 'Replit (Core: 4 vCPU, 8GB max)',
        },
        {
          cost: '~$105/mo',
          savings: 0,
          label: 'Replit (Teams 3 devs: 8 vCPU, 16GB max)',
        },
        {
          cost: 'N/A',
          savings: 0,
          label: 'Replit (Exceeds 8 vCPU/16GB plan limit)',
        },
      ],
      sealosSavings: [0, 0, 100], // Sealos savings vs Replit: $25 vs $25 (0%), $128 vs $105 (Sealos costs more), $512 vs N/A (100% - only Sealos can handle)
      note: 'Replit Teams: $35/user/month. Max resources per deployment: 8 vCPU, 16GB RAM. Workloads requiring 16+ vCPU or 32+ GB RAM cannot be deployed on standard Replit plans.',
      source: {
        url: 'https://replit.com/pricing',
        label: 'Replit Pricing',
      },
    },
    guidance: [
      {
        icon: <MonitorPlay className="size-full" />,
        content: 'Want **instant browser-based coding** with zero local setup',
      },
      {
        icon: <Users className="size-full" />,
        content:
          'Need **real-time multiplayer coding** for live pair programming',
      },
      {
        icon: <Sparkles className="size-full" />,
        content:
          'Value **integrated AI coding assistance** (Ghostwriter/Agent)',
      },
      {
        icon: <Users className="size-full" />,
        content:
          'Are a **student, educator, or hobbyist** exploring programming',
      },
      {
        icon: <DollarSign className="size-full" />,
        content: 'Prefer **per-user pricing** for small, collaborative teams',
      },
      {
        icon: <Box className="size-full" />,
        content: "Don't need Kubernetes-level infrastructure control",
      },
    ],
  },
};
