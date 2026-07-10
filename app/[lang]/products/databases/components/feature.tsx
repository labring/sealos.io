'use client';

import { Zap, Database, Shield, Container } from 'lucide-react';

const features = [
  {
    title: 'Auto-Scaling Infrastructure',
    description:
      'Databases that automatically scale based on your application demands, from startup to enterprise.',
    icon: <Zap className="h-8 w-8" />,
    benefits: [
      'Automatic resource scaling',
      'Transparent subscription pricing',
      'Zero downtime scaling',
      'Performance optimization',
    ],
  },
  {
    title: 'Multi-Database Support',
    description:
      'Choose from PostgreSQL, MySQL, MongoDB, Redis, and Milvus for your specific use case.',
    icon: <Database className="h-8 w-8" />,
    benefits: [
      'PostgreSQL for complex queries',
      'MongoDB for flexible schemas',
      'Redis for high-performance caching',
    ],
  },
  {
    title: 'Kubernetes Orchestration',
    description:
      'Leveraging Kubernetes orchestration for reliability, high availability, and fault tolerance.',
    icon: <Container className="h-8 w-8" />,
    benefits: [
      'Self-healing infrastructure',
      'Automatic failover',
      'Rolling updates',
      'Integrated monitoring and logging',
    ],
  },
  {
    title: 'Smart Backup & Management',
    description:
      'Seamless data import, automated backups, and customizability for complete database management.',
    icon: <Shield className="h-8 w-8" />,
    benefits: [
      'Automated scheduled backups',
      'One-click data import/export',
      'Customizable database parameters',
      'One-click restore and recovery',
    ],
  },
];

export default function Feature() {
  return (
    <section className="relative overflow-hidden pt-16 sm:pt-24">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-96 w-screen -translate-x-1/2"
        style={{
          background:
            'linear-gradient(to bottom, rgba(30, 30, 30, 0.62) 0%, rgba(20, 20, 20, 0.42) 42%, transparent 100%)',
        }}
      />

      <div className="mb-10 max-w-3xl sm:mb-16">
        <h2 className="text-2xl leading-tight text-white sm:text-4xl md:text-[2.5rem]">
          Managed Database Excellence
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
          Focus on building your application while Sealos handles database
          operations, scaling, security, and maintenance for you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] sm:p-6"
          >
            <div className="flex flex-1 flex-col">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-blue-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg leading-tight font-semibold text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                <h4 className="text-sm font-semibold text-zinc-200">
                  Key Benefits:
                </h4>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm leading-5 text-zinc-400"
                    >
                      <span className="mr-2 size-1.5 rounded-full bg-blue-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
