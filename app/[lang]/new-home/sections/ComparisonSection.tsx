import { GradientText } from '../components/GradientText';

// 对比数据结构
const comparisonData = {
  platforms: ['Sealos', 'Railway', 'Render', 'Supabase', 'Vercel'],
  categories: [
    {
      name: 'DEPLOYMENT & WORKFLOW',
      items: [
        {
          feature: 'Deployment Flexibility',
          values: ['✓', '✓', '✓', '—', '✓'],
        },
        {
          feature: 'Native Kubernetes API',
          values: ['✓', '—', '—', '—', '—'],
        },
      ],
    },
    {
      name: 'DEVELOPER EXPERIENCE',
      items: [
        {
          feature: 'AI-Powered Development',
          values: ['✓', '—', '—', '—', '—'],
        },
        {
          feature: 'Built-in Database',
          values: ['✓', '✓', '—', '✓', '—'],
        },
      ],
    },
  ],
};

export function ComparisonSection() {
  return (
    <section className="mt-48 mb-32">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-[2.5rem] leading-tight">
            <span>Other platforms simplify deployment.</span>&nbsp;
            <GradientText>Sealos unifies your entire cloud.</GradientText>
          </h2>
          <p className="mt-3 text-zinc-400">
            Focus on your code, not the underlying complexity. Sealos provides an
            integrated, AI-powered experience from development to production, all
            in one place.
          </p>
        </div>

        {/* 对比表格 */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* 表头 */}
            <thead>
              <tr>
                <th className="border border-zinc-800 bg-zinc-900/50 p-4 text-left text-sm font-medium text-zinc-400">
                  Feature
                </th>
                {comparisonData.platforms.map((platform, index) => (
                  <th
                    key={platform}
                    className={`border border-zinc-800 p-4 text-center text-sm font-semibold ${
                      index === 0
                        ? 'bg-gradient-to-b from-purple-500/10 to-pink-500/10 text-white relative'
                        : 'bg-zinc-900/50 text-zinc-300'
                    }`}
                  >
                    {index === 0 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 pointer-events-none" />
                    )}
                    <span className="relative z-10">{platform}</span>
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
                    <td
                      colSpan={comparisonData.platforms.length + 1}
                      className="border border-zinc-800 bg-zinc-900/70 p-3 text-xs font-bold text-purple-400 tracking-wider"
                    >
                      {category.name}
                    </td>
                  </tr>

                  {/* 分类下的对比项 */}
                  {category.items.map((item, itemIndex) => (
                    <tr key={`${categoryIndex}-${itemIndex}`}>
                      <td className="border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-300">
                        {item.feature}
                      </td>
                      {item.values.map((value, valueIndex) => (
                        <td
                          key={valueIndex}
                          className={`border border-zinc-800 p-4 text-center relative ${
                            valueIndex === 0
                              ? 'bg-gradient-to-b from-purple-500/5 to-pink-500/5'
                              : 'bg-zinc-900/30'
                          }`}
                        >
                          {valueIndex === 0 && (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />
                          )}
                          <span
                            className={`relative z-10 text-lg ${
                              value === '✓'
                                ? valueIndex === 0
                                  ? 'text-purple-400'
                                  : 'text-green-500'
                                : 'text-zinc-600'
                            }`}
                          >
                            {value}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
