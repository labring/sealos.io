import { AiRuntimeCard } from '../components/caps-image/AiRuntimeCard';
import { DBCard } from '../components/caps-image/DBCard';
import { DeploymentCard } from '../components/caps-image/DeploymentCard';
import { StacksCard } from '../components/caps-image/StacksCard';
import {
  GradientBot,
  GradientAppWindowMac,
  GradientRocket,
  GradientDatabase,
} from '../components/GradientIcon';
import { GradientText } from '../components/GradientText';

interface CardData {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  title: string;
  description: string;
  tags: string[];
  colSpan: 2 | 3;
  image: React.ReactNode;
}

const cardsData: CardData[] = [
  {
    icon: GradientBot,
    label: 'AI & Agent Runtimes',
    title: 'Ship from Anywhere, Run Anything',
    description:
      'Your workflow is our workflow. Deploy instantly from a GitHub repo, run any public or private image from Docker Hub, or integrate Sealos into your existing CI/CD pipeline with GitHub Actions.',
    tags: ['GPU-Ready', 'AI Proxy', 'Auto Scale'],
    colSpan: 2,
    image: <AiRuntimeCard />,
  },
  {
    icon: GradientAppWindowMac,
    label: 'Full-Stack Web Apps',
    title: 'Deploy a Full-Stack Powerhouse',
    description:
      'Go beyond static sites. Seamlessly deploy both your React/Vue frontend and your Node.js/Go backend in a unified environment. We automate the build, containerization, and networking for you.',
    tags: ['Frontend + Backend', 'Auto Build', 'Unified Deploy'],
    colSpan: 3,
    image: <StacksCard />,
  },
  {
    icon: GradientRocket,
    label: 'Ultimate Deployment Flexibility',
    title: 'Ship from Anywhere, Run Anything',
    description:
      'Your workflow is our workflow. Deploy instantly from a GitHub repo, run any public or private image from Docker Hub, or integrate Sealos into your existing CI/CD pipeline with GitHub Actions.',
    tags: ['GitHub Deploy', 'Docker Images', 'CI/CD Ready'],
    colSpan: 3,
    image: <DeploymentCard />,
  },
  {
    icon: GradientDatabase,
    label: 'One-Click Backend Services',
    title: 'Get Production-Ready Backends, Instantly',
    description:
      'Stop wasting time on database ops. Launch a high-availability PostgreSQL or MySQL cluster with a single click. Need a mobile backend API or a Redis cache? Deploy it as a container in seconds.',
    tags: ['One-Click DB', 'High Availability', 'Instant Deploy'],
    colSpan: 2,
    image: <DBCard />,
  },
];

export function CapsSection() {
  return (
    <section className="mt-48 mb-32">
      <div className="flex flex-col gap-8">
        <h2 className="text-[2.5rem] leading-tight">
          <span>Built for the</span>&nbsp;
          <GradientText>Modern Application.</GradientText>
        </h2>
        <p className="mt-3 text-zinc-400">
          Whether you're building next-gen AI agents or battle-tested web apps,
          our unified platform is designed to amplify your workflow.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-5 grid-rows-2 gap-9">
        {cardsData.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={card.colSpan === 2 ? 'col-span-2' : 'col-span-3'}
            >
              <div className="flex h-full flex-col">
                {/* Section Tag */}
                <div className="flex w-fit items-center rounded-full border border-white/5 bg-white/5 px-3 py-2 text-zinc-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),_0_2px_4px_-1px_rgba(0,0,0,0.02)]">
                  <Icon className="mr-2 size-5" />
                  <span>{card.label}</span>
                </div>

                <h3 className="mt-6 text-xl text-zinc-200">{card.title}</h3>

                {/* Description */}
                <p className="mt-2 text-sm text-zinc-500">{card.description}</p>

                {/* Tags */}
                <div className="mt-6 flex gap-2">
                  {card.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="flex items-center rounded-lg border border-dashed border-white/15 px-2 py-1 text-zinc-400"
                    >
                      <div className="mr-2 size-2 rounded-full bg-blue-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                {/* Card Image */}
                <div className="mt-4 h-[16rem] grow">{card.image}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
