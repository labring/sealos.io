import Image from 'next/image';
import {
  Activity,
  CircleCheckBig,
  Cpu,
  Database,
  DatabaseZap,
  Globe,
  GlobeLock,
  Grid2X2,
  LayoutGrid,
  type LucideIcon,
  MousePointerClick,
  ShieldCheck,
} from 'lucide-react';
import SealosLogo from '@/assets/shared-icons/sealos.svg';
import K8sLogo from '@/assets/stacks-appicons/kubernetes.svg';
import { cn } from '@/lib/utils';
import SectionHeading from './SectionHeading';

type DeployStep =
  | {
      title: string;
      description: string;
      icon: LucideIcon;
      iconType?: never;
    }
  | {
      title: string;
      description: string;
      iconType: 'k8s';
      icon?: never;
    };

const steps: DeployStep[] = [
  {
    title: 'One-Click Deployment',
    description:
      'Deploy any app template in seconds. No compose setup, manual configure, and go live.',
    icon: MousePointerClick,
  },
  {
    title: 'Managed Kubernetes Reliability',
    description:
      'Built on Sealos Managed Kubernetes for high availability, auto-scaling, and self-healing by default.',
    iconType: 'k8s',
  },
  {
    title: 'Automatic HTTPS & Security',
    description:
      'Every deployment includes a secure domain with automatic SSL. We handle certificates and text protection for you.',
    icon: GlobeLock,
  },
  {
    title: 'Persistent Storage',
    description:
      'Attach persistent volumes with ease. Your data stays safe, durable, and always accessible.',
    icon: DatabaseZap,
  },
  {
    title: 'Scale when needed',
    description: 'Adjust resources as your app grows, no downtime required.',
    icon: LayoutGrid,
  },
];

const resourceIcons = [
  { label: 'Compute', icon: Cpu },
  { label: 'Networking', icon: Globe },
  { label: 'Storage', icon: Database },
  { label: 'Security', icon: ShieldCheck },
  { label: 'Observability', icon: Activity },
];

const gradientBorderStyle = {
  background:
    'linear-gradient(#0A0A0A, #0A0A0A) padding-box, linear-gradient(109.08deg, #FFFFFF 0.55%, rgba(255, 255, 255, 0) 26.65%) border-box, linear-gradient(285.16deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 8.87%) border-box, linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)) border-box',
};

const diagramCardClassName = 'border-[0.5px] border-transparent bg-[#0A0A0A]';

const diagramTopCardClassName = `${diagramCardClassName} rounded-xl p-3`;

const diagramResourceGridClassName = `${diagramCardClassName} grid w-full grid-cols-2 overflow-hidden rounded-lg sm:grid-cols-5`;

const diagramLiveCardClassName = `${diagramCardClassName} inline-flex items-center gap-3 rounded-lg px-5 py-4 text-sm font-semibold text-white`;

export default function WhyDeployOnSealos() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-14 pb-16 lg:px-8 lg:pt-16 lg:pb-24">
      <SectionHeading
        title="Why deploy on Sealos"
        description="Sealos makes deploying any app effortless, secure, and production-ready. From one-click launch to ongoing operations, we handle the heavy lifting so you can focus on what matters."
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-center">
        <div className="relative min-h-[460px] overflow-hidden p-8">
          <div className="relative mx-auto flex max-w-[430px] flex-col items-center">
            <div
              className={diagramTopCardClassName}
              style={gradientBorderStyle}
            >
              <div className="flex h-10 items-center gap-3 px-4 text-sm font-semibold text-white">
                <Grid2X2 className="h-4 w-4 text-[#69a3ff]" />
                One-Click Deploy
              </div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#146DFF]/30 bg-[#146DFF]/10 shadow-[0_0_60px_rgba(20,109,255,0.28)]">
              <Image
                src={SealosLogo}
                alt="Sealos logo"
                width={44}
                height={44}
                className="h-11 w-11"
              />
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div
              className={diagramResourceGridClassName}
              style={gradientBorderStyle}
            >
              {resourceIcons.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    'flex min-h-[74px] flex-col items-center justify-center gap-2 text-center',
                    index > 0 ? 'border-l border-white/10' : '',
                  )}
                >
                  <item.icon className="h-5 w-5 text-zinc-300" />
                  <span className="text-[11px] text-zinc-400">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div
              className={diagramLiveCardClassName}
              style={gradientBorderStyle}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white/[0.055]">
                <CircleCheckBig className="h-6 w-6 text-[#22C55E]" />
              </span>
              Your Application is Live
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {steps.map((step) => (
            <div
              key={step.title}
              className="group grid gap-5 py-7 sm:grid-cols-[48px_1fr]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.055] text-white transition-colors group-hover:text-[#69a3ff]">
                {step.iconType === 'k8s' ? (
                  <Image
                    src={K8sLogo}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 brightness-0 grayscale invert transition group-hover:brightness-100 group-hover:grayscale-0 group-hover:invert-0"
                  />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-100">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
