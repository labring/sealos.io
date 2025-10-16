import { ReactNode } from 'react';
import { GradientText } from '../components/GradientText';
import { Circle, CircleHelp, CodeXml, GitCompare, Info } from 'lucide-react';
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
    { name: 'Sealos', icon: <Circle size={24} /> },
    { name: 'Railway', icon: <Circle size={24} /> },
    { name: 'Render', icon: <Circle size={24} /> },
    { name: 'Supabase', icon: <Circle size={24} /> },
    { name: 'Vercel', icon: <Circle size={24} /> },
  ],
  categories: [
    {
      name: 'DEPLOYMENT & WORKFLOW',
      icon: <GitCompare size={20} />,
      items: [
        {
          feature: 'Deployment Flexibility',
          help: 'Help Text',
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
          help: 'Help Text',
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
            { name: '' },
            { name: '' },
            { name: '' },
            { name: '' },
            { name: '' },
          ],
        },
        {
          feature: 'Real-time Dev Workflow',
          values: [
            { name: '' },
            { name: '' },
            { name: '' },
            { name: '' },
            { name: '' },
          ],
        },
      ],
    },
  ],
};

export function ComparisonSection() {
  return (
    <section className="relative pt-28 pb-32">
      {/* 顶部渐变遮罩 - 灰到黑，覆盖整个屏幕宽度 */}
      <div
        className="pointer-events-none absolute top-0 -z-5 h-96"
        style={{
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          width: '100vw',
          background: 'linear-gradient(to bottom, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 40%, transparent 100%)',
        }}
      />

      {/* GodRays 效果 */}
      <GodRays
        sources={[
          {
            x: -0.02,
            y: -0.18,
            angle: 70,
            spread: 118,
            count: 14,
            color: '220, 220, 220',
          },
          {
            x: 0.52,
            y: -0.1,
            angle: 70,
            spread: 108,
            count: 13,
            color: '225, 225, 225',
          },
        ]}
        speed={0.002}
        maxWidth={88}
        minLength={950}
        maxLength={2300}
        blur={19}
      />
      <div className="flex max-w-2/3 items-center gap-8">
        <h2 className="w-full text-[2.5rem] leading-tight">
          <span>Other platforms simplify deployment.</span>&nbsp;
          <GradientText>Sealos unifies your entire cloud.</GradientText>
        </h2>
        <p className="mt-3 w-full text-zinc-400">
          Focus on your code, not the underlying complexity. Sealos provides an
          integrated, AI-powered experience from development to production, all
          in one place.
        </p>
      </div>

      {/* 对比表格 */}
      <div className="mt-14 overflow-x-auto">
        <table className="w-full border-collapse">
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
                        <div className="flex items-center gap-2">
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
                              'relative flex items-center gap-2 text-base',
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
    </section>
  );
}
