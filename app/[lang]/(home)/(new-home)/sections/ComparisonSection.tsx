import { ReactNode } from 'react';
import { GradientText } from '../components/GradientText';
import {
  Bot,
  CircleHelp,
  CodeXml,
  GitCompare,
  Info,
  Network,
} from 'lucide-react';
import Image from 'next/image';
import SealosIcon from '../assets/shared-icons/sealos.svg';
import RailwayIcon from '../assets/platform-icons/railway.svg';
import RenderIcon from '../assets/platform-icons/render.svg';
import SupabaseIcon from '../assets/platform-icons/supabase.svg';
import VercelIcon from '../assets/platform-icons/vercel.svg';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { GradientCircleCheck } from '../components/GradientIcon';
import { GodRays } from '../components/GodRays';

// 对比数据类型定义
interface Platform {
  name: string;
  icon?: ReactNode;
}

interface ComparisonValue {
  name: string;
  icon?: ReactNode;
}

interface ComparisonItem {
  feature: string;
  help?: ReactNode;
  values: ComparisonValue[];
}

interface ComparisonCategory {
  name: string;
  icon?: ReactNode;
  items: ComparisonItem[];
}

interface ComparisonData {
  platforms: Platform[];
  categories: ComparisonCategory[];
}

// 对比数据结构
const comparisonData: ComparisonData = {
  platforms: [
    {
      name: 'Sealos',
      icon: <Image src={SealosIcon} alt="Sealos" width={24} height={24} />,
    },
    {
      name: 'Railway',
      icon: <Image src={RailwayIcon} alt="Railway" width={24} height={24} />,
    },
    {
      name: 'Render',
      icon: <Image src={RenderIcon} alt="Render" width={24} height={24} />,
    },
    {
      name: 'Supabase',
      icon: <Image src={SupabaseIcon} alt="Supabase" width={24} height={24} />,
    },
    {
      name: 'Vercel',
      icon: <Image src={VercelIcon} alt="Vercel" width={24} height={24} />,
    },
  ],
  categories: [
    {
      name: 'DEPLOYMENT & WORKFLOW',
      icon: <GitCompare size={20} />,
      items: [
        {
          feature: 'Deployment Flexibility',
          help: 'Deployment Flexibility: "Sealos lets you deploy with a simple sentence using AI Pilot, from any Docker Image, or directly from standard Kubernetes YAML files, offering maximum flexibility.',
          values: [
            {
              name: 'AI Pilot, K8s YAML, Docker',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Git Repo',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Git Repo',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Limited',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Git Repo',
              icon: <Info size={20} className="text-zinc-600" />,
            },
          ],
        },
        {
          feature: 'Native Kubernetes API',
          help: 'Native Kubernetes API: "You can use your existing kubectl and other standard cloud native tools to interact with Sealos directly. No proprietary CLI or vendor lock-in."',
          values: [
            {
              name: 'Full Compatibility',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
          ],
        },
      ],
    },
    {
      name: 'DEVELOPER EXPERIENCE',
      icon: <CodeXml size={20} />,
      items: [
        {
          feature: 'Unified Dev Environment',
          values: [
            {
              name: 'Cloud Env with Local IDE Connect',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
          ],
        },
        {
          feature: 'Real-time Dev Workflow',
          values: [
            {
              name: 'No more waiting for CI/CD',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Preview Deployments [1]',
              icon: <Info size={20} className="text-zinc-600" />,
            },
          ],
        },
        {
          feature: 'Universal Language Support',
          values: [
            {
              name: 'Any language or framework',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Full Support',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Full Support',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Limited',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Frontend Focused [2]',
              icon: <Info size={20} className="text-zinc-600" />,
            },
          ],
        },
      ],
    },
    {
      name: 'AI & DATA CAPABILITIES',
      icon: <Bot size={20} />,
      items: [
        {
          feature: 'Managed Databases',
          values: [
            {
              name: 'PG, MySQL, Mongo, Redis',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'PG, Redis',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'PG, Redis',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'PostgreSQL',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'PG, Redis',
              icon: <Info size={20} className="text-zinc-600" />,
            },
          ],
        },
        {
          feature: 'One-Click High Availability',
          values: [
            {
              name: 'Automated Failover',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Available',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Available',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Available',
              icon: <GradientCircleCheck className="size-5" />,
            },
          ],
        },
        {
          feature: 'Built-in Vector Database',
          values: [
            {
              name: 'pgvector & Milvus',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'pgvector',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
          ],
        },
        {
          feature: 'Unified AI Model API',
          values: [
            {
              name: 'Available',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
          ],
        },
      ],
    },
    {
      name: 'INFRASTRUCTURE & ARCHITECTURE',
      icon: <Network size={20} />,
      items: [
        {
          feature: 'S3-Compatible Object Storage',
          values: [
            {
              name: 'Available',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Not Available',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Available',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Available',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Blob Storage',
              icon: <GradientCircleCheck className="size-5" />,
            },
          ],
        },
        {
          feature: 'Core Trust Advantage',
          help: 'One-Click High Availability: "Launch a database cluster with master-slave replication and automated failover with a single click, a task that often requires expert configuration on other platforms."',
          values: [
            {
              name: '100% Source Available',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Proprietary',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Proprietary',
              icon: <Info size={20} className="text-zinc-600" />,
            },
            {
              name: 'Available',
              icon: <GradientCircleCheck className="size-5" />,
            },
            {
              name: 'Proprietary',
              icon: <Info size={20} className="text-zinc-600" />,
            },
          ],
        },
      ],
    },
  ],
};

export function ComparisonSection() {
  return (
    <section className="relative w-screen overflow-x-clip pt-28 pb-32">
      {/* 顶部渐变遮罩 - 灰到黑，覆盖整个屏幕宽度 */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-5 h-96 w-screen -translate-x-1/2"
        style={{
          background:
            'linear-gradient(to bottom, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 40%, transparent 100%)',
        }}
      />

      {/* GodRays 效果 */}
      <GodRays
        sources={[
          {
            x: 0.15,
            y: -0.18,
            angle: 60,
            spread: 45,
            count: 14,
            color: '220, 220, 220',
          },
        ]}
        speed={0.002}
        maxWidth={88}
        minLength={950}
        maxLength={1800}
        blur={19}
      />

      <div className="container">
        <div className="flex max-w-full flex-col items-center pb-8 md:gap-8 lg:max-w-4xl lg:flex-row lg:pb-16">
          <h2 className="w-full text-2xl leading-tight sm:text-4xl md:text-[2.5rem]">
            <span>Other platforms simplify deployment.</span>&nbsp;
            <GradientText>Sealos unifies your entire cloud.</GradientText>
          </h2>
          <p className="mt-3 w-full text-sm text-zinc-400 sm:text-base">
            Focus on your code, not the underlying complexity. Sealos provides
            an integrated, AI-powered experience from development to production,
            all in one place.
          </p>
        </div>

        {/* 对比表格 */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            {/* 表头 */}
            <thead>
              <tr>
                <th className="border-b border-zinc-800 px-4 py-9" />
                {comparisonData.platforms.map((platform, index) => (
                  <th
                    key={platform.name}
                    className={cn(
                      'relative border-b border-zinc-800 px-4 py-2.5 text-base font-semibold',
                      index === 0
                        ? 'text-zinc-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-t-lg before:border before:border-b-0 before:border-zinc-800 before:bg-white/5'
                        : 'text-zinc-400',
                    )}
                  >
                    <span className="relative flex items-center gap-2">
                      {platform.icon}
                      {platform.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {/* 表格内容 */}
            <tbody>
              {comparisonData.categories.map((category, categoryIndex) => (
                <>
                  {/* 分类标题行 */}
                  <tr key={`category-${categoryIndex}`}>
                    <td className="border-b border-zinc-800 px-4 py-5 text-lg font-medium text-zinc-200">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        {category.name}
                      </div>
                    </td>
                    {comparisonData.platforms.map((platform, platformIndex) => (
                      <td
                        key={platform.name}
                        className={cn(
                          'relative border-b border-zinc-800 px-4 py-5',
                          platformIndex === 0 &&
                            'bg-white/5 before:pointer-events-none before:absolute before:inset-0 before:border-x before:border-zinc-800',
                        )}
                      />
                    ))}
                  </tr>

                  {/* 分类下的对比项 */}
                  {category.items.map((item, itemIndex) => {
                    const isLastCategory =
                      categoryIndex === comparisonData.categories.length - 1;
                    const isLastItem = itemIndex === category.items.length - 1;
                    const isLastRow = isLastCategory && isLastItem;

                    return (
                      <tr key={`${categoryIndex}-${itemIndex}`}>
                        <td className="border-b border-zinc-800 px-4 py-5 text-base text-zinc-400">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            {item.feature}
                            {item.help && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <CircleHelp size={20} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{item.help}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                        {item.values.map((value, valueIndex) => (
                          <td
                            key={valueIndex}
                            className={cn(
                              'relative border-b border-zinc-800 px-4 py-5',
                              valueIndex === 0 && 'bg-white/5',
                              valueIndex === 0 &&
                                'before:pointer-events-none before:absolute before:inset-0 before:border-x before:border-zinc-800',
                            )}
                          >
                            <span
                              className={cn(
                                'relative flex items-center gap-2 text-base whitespace-nowrap',
                                valueIndex === 0
                                  ? 'text-zinc-200'
                                  : 'text-zinc-400',
                              )}
                            >
                              {value.icon}
                              {value.name}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <ol className="mt-8 space-y-1 text-sm text-zinc-600">
          <li>
            [1] Vercel: Preview deployments are generated based on Git commits,
            which still involves a CI/CD-like waiting period for builds.
          </li>
          <li>
            [2] Vercel: Optimized for front-end frameworks; backend support is
            primarily through Serverless Functions.
          </li>
        </ol>
      </div>
    </section>
  );
}
