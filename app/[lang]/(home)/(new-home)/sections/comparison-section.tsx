import Image from 'next/image';

import {
  ArrowRight,
  Bot,
  CircleCheck,
  CircleX,
  CodeXml,
  GitCompare,
  Info,
  type LucideIcon,
} from 'lucide-react';

import HerokuIcon from '@/assets/platform-icons/heroku.svg';
import RailwayIcon from '@/assets/platform-icons/railway.svg';
import RenderIcon from '@/assets/platform-icons/render.svg';
import VercelIcon from '@/assets/platform-icons/vercel.svg';
import SealosIcon from '@/assets/shared-icons/sealos.svg';
import { StarBorder } from '@/components/ui/star-border';
import { GradientLucideIcon } from '@/new-components/GradientLucideIcon';

type Platform = {
  name: string;
  icon: string;
};

type Cell = {
  label: string;
  tone: 'check' | 'x' | 'info';
};

type ComparisonRow = {
  feature: string;
  values: Cell[];
};

type ComparisonGroup = {
  title: string;
  icon: LucideIcon;
  rows: ComparisonRow[];
};

const platforms: Platform[] = [
  { name: 'Sealos', icon: SealosIcon },
  { name: 'Vercel', icon: VercelIcon },
  { name: 'Render', icon: RenderIcon },
  { name: 'Railway', icon: RailwayIcon },
  { name: 'Heroku', icon: HerokuIcon },
];

const groups: ComparisonGroup[] = [
  {
    title: 'DEPLOYMENT & WORKFLOW',
    icon: GitCompare,
    rows: [
      {
        feature: 'Deploy from Git repo',
        values: [
          { tone: 'check', label: 'AI Pilot + Git + K8s' },
          { tone: 'info', label: 'Git Repo' },
          { tone: 'info', label: 'Git Repo' },
          { tone: 'info', label: 'Limited' },
          { tone: 'info', label: 'Git Repo' },
        ],
      },
      {
        feature: 'Native K8s API',
        values: [
          { tone: 'check', label: 'Full' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
        ],
      },
      {
        feature: 'Deploy via Terminal Agent Tools (Skills)',
        values: [
          { tone: 'check', label: 'Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
        ],
      },
    ],
  },
  {
    title: 'DEVELOPER EXPERIENCE',
    icon: CodeXml,
    rows: [
      {
        feature: 'Cloud dev env + local IDE link',
        values: [
          { tone: 'check', label: 'DevBox' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
        ],
      },
      {
        feature: 'Real-time dev workflow (no CI/CD wait)',
        values: [
          { tone: 'check', label: 'Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Preview deploys' },
        ],
      },
      {
        feature: 'Universal language support',
        values: [
          { tone: 'check', label: 'Full Support' },
          { tone: 'check', label: 'Full Support' },
          { tone: 'check', label: 'Full Support' },
          { tone: 'info', label: 'Limited' },
          { tone: 'x', label: 'FrontendFocused' },
        ],
      },
    ],
  },
  {
    title: 'INFRASTRUCTURE & TRUST',
    icon: Bot,
    rows: [
      {
        feature: 'Managed databases',
        values: [
          { tone: 'check', label: 'PG · MySQL · Mongo · Redis' },
          { tone: 'info', label: 'PG, Redis' },
          { tone: 'info', label: 'PG, Redis' },
          { tone: 'info', label: 'PostgreSQL' },
          { tone: 'info', label: 'PG, Redis' },
        ],
      },
      {
        feature: 'One-click HA',
        values: [
          { tone: 'check', label: 'Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'check', label: 'Available' },
          { tone: 'check', label: 'Available' },
          { tone: 'check', label: 'Available' },
        ],
      },
      {
        feature: 'Built-in DB studio (browse/import/backup)',
        values: [
          { tone: 'check', label: 'Full studio' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
          { tone: 'x', label: 'Not Available' },
        ],
      },
      {
        feature: 'Source-available core',
        values: [
          { tone: 'check', label: '100%' },
          { tone: 'check', label: '100%' },
          { tone: 'check', label: '100%' },
          { tone: 'info', label: 'Partial' },
          { tone: 'check', label: '100%' },
        ],
      },
    ],
  },
];

export function ComparisonSection() {
  return (
    <section className="px-4 pt-16 pb-24 text-white sm:px-6 lg:px-16 lg:pt-20 lg:pb-28">
      <div className="mx-auto flex max-w-[1312px] flex-col gap-16">
        <div className="mx-auto flex max-w-[812px] flex-col items-center gap-6 text-center">
          <h2 className="bg-linear-to-r from-white to-blue-500 bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent sm:text-5xl">
            Other platforms simplify deployment. Sealos unifies your entire
            cloud.
          </h2>
          <p className="max-w-[618px] text-base leading-6 text-zinc-500">
            Pick the trade-offs you actually care about. We built Sealos so you
            don't have to keep adding tools to your stack.
          </p>
        </div>

        <div className="overflow-x-auto" aria-label="Feature comparison table">
          <table className="w-full min-w-[1180px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-[339px] border-b border-zinc-800" />
                {platforms.map((platform, index) => (
                  <th
                    key={platform.name}
                    className={
                      index === 0
                        ? 'w-[280px] rounded-t-xl border border-b-0 border-zinc-800 bg-linear-to-b from-blue-950/20 to-white/10 px-4 py-8 text-lg font-normal text-zinc-200'
                        : 'border-b border-zinc-800 px-4 py-8 text-lg font-normal text-zinc-200'
                    }
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <Image
                        src={platform.icon}
                        alt=""
                        width={24}
                        height={24}
                      />
                      {platform.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <GroupRows key={group.title} group={group} />
              ))}
            </tbody>
          </table>
        </div>

        <MigrationCard />
      </div>
    </section>
  );
}

function GroupRows({ group }: { group: ComparisonGroup }) {
  const GroupIcon = group.icon;

  return (
    <>
      <tr>
        <td
          colSpan={platforms.length + 1}
          className="border-b border-zinc-800 px-4 py-5"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <GroupIcon size={20} aria-hidden="true" />
            {group.title}
          </div>
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.feature}>
          <th className="border-b border-zinc-800 px-4 py-5 text-base font-normal text-zinc-400">
            <span className="block max-w-[310px] truncate">{row.feature}</span>
          </th>
          {row.values.map((value, index) => (
            <td
              key={`${row.feature}-${index}`}
              className={
                index === 0
                  ? 'border-x border-b border-zinc-800 bg-white/5 px-4 py-5'
                  : 'border-b border-zinc-800 px-4 py-5'
              }
            >
              <span
                className={
                  index === 0
                    ? 'flex items-center gap-2 text-base whitespace-nowrap text-zinc-200'
                    : 'flex items-center gap-2 text-base whitespace-nowrap text-zinc-400'
                }
              >
                <ValueIcon tone={value.tone} />
                {value.label}
              </span>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function ValueIcon({ tone }: { tone: Cell['tone'] }) {
  if (tone === 'check') {
    return <GradientLucideIcon Icon={CircleCheck} className="size-5" />;
  }

  const Icon = tone === 'x' ? CircleX : Info;

  return <Icon className="size-5 text-zinc-600" aria-hidden="true" />;
}

function MigrationCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900 px-5 py-7 text-center shadow-2xl">
      <div className="relative flex flex-col items-center gap-5">
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-zinc-200">
            Locked into another platform?
          </h3>
          <p className="flex flex-wrap items-center justify-center gap-2 text-base text-zinc-500">
            <span>Paste your</span>
            {['vercel.json', 'render.yaml', 'docker-compose.yml'].map(
              (file) => (
                <span
                  key={file}
                  className="rounded-lg bg-blue-700/40 px-2.5 py-1 text-zinc-200"
                >
                  {file}
                </span>
              ),
            )}
            <span>configurations.</span>
          </p>
          <p className="text-base text-zinc-500">
            The Sealos engine will automatically parse, rewrite, and migrate
            your entire cluster infrastructure cleanly in under 3 minutes.
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute inset-x-2 -bottom-2 h-8 rounded-full bg-blue-600/35 blur-xl"
            aria-hidden="true"
          />
          <StarBorder
            as="div"
            color="var(--color-blue-500)"
            contentClassName="h-10 gap-2 border border-white bg-gradient-to-b from-white via-zinc-100 to-zinc-300 px-4 text-sm font-medium text-zinc-900 shadow-lg"
            speed="5s"
            thickness={1}
          >
            <span>Test the migration tool</span>
            <ArrowRight size={16} aria-hidden="true" />
          </StarBorder>
        </div>
      </div>
    </div>
  );
}
