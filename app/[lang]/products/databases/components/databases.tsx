'use client';

import { CustomButton } from '@/components/ui/button-custom';
import { appDomain } from '@/config/site';
const dbAppSlug = '?openapp=system-dbprovider';

const databases = [
  {
    name: 'PostgreSQL',
    description:
      'Advanced open-source relational database with powerful SQL capabilities',
    iconPath: '/images/database/postgresql.svg',
    useCases: [
      'Web Applications',
      'Analytics',
      'Data Warehousing',
      'Geospatial Data',
    ],
    features: [
      'ACID Compliance',
      'JSON Support',
      'Advanced Indexes',
      'Extensions',
    ],
    deployUrl: `${appDomain + dbAppSlug}`,
  },
  {
    name: 'MySQL',
    description: "World's most popular open-source relational database",
    iconPath: '/images/database/mysql.svg',
    useCases: [
      'Web Development',
      'E-commerce',
      'Content Management',
      'Logging',
    ],
    features: [
      'High Performance',
      'Replication',
      'Partitioning',
      'Full-text Search',
    ],
    deployUrl: `${appDomain + dbAppSlug}`,
  },
  {
    name: 'MongoDB',
    description: 'Leading document database for modern applications',
    iconPath: '/images/database/mongodb.svg',
    useCases: [
      'Content Management',
      'IoT Applications',
      'Real-time Analytics',
      'Catalogs',
    ],
    features: [
      'Flexible Schema',
      'Horizontal Scaling',
      'Aggregation Pipeline',
      'GridFS',
    ],
    deployUrl: `${appDomain + dbAppSlug}`,
  },
  {
    name: 'Redis',
    description: 'High-performance in-memory data structure store',
    iconPath: '/images/database/redis.svg',
    useCases: [
      'Caching',
      'Session Storage',
      'Real-time Analytics',
      'Message Queues',
    ],
    features: [
      'In-Memory Speed',
      'Data Structures',
      'Pub/Sub',
      'Lua Scripting',
    ],
    deployUrl: `${appDomain + dbAppSlug}`,
  },
  {
    name: 'Milvus',
    description: 'Open-source vector database for AI applications',
    iconPath: '/images/database/milvus.svg',
    useCases: [
      'AI/ML Apps',
      'Similarity Search',
      'Recommendation Systems',
      'Image Search',
    ],
    features: [
      'Vector Search',
      'GPU Acceleration',
      'Hybrid Search',
      'Multi-tenancy',
    ],
    deployUrl: `${appDomain + dbAppSlug}`,
  },
];

export default function Databases() {
  return (
    <section className="relative overflow-hidden">
      <div className="mb-10 max-w-3xl sm:mb-16">
        <h2 className="text-2xl leading-tight text-white sm:text-4xl md:text-[2.5rem]">
          Choose Your Perfect Database
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
          From traditional SQL to modern NoSQL and vector databases - deploy any
          database with enterprise-grade management.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {databases.map((db, index) => (
          <div
            key={index}
            className="group flex min-h-[31rem] flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]"
          >
            <div className="border-b border-white/10 bg-white/[0.025] p-5 text-zinc-100 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white shadow-sm">
                  <img
                    src={db.iconPath}
                    alt={`${db.name} icon`}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <span className="text-sm font-medium text-zinc-300">
                    Managed
                  </span>
                </div>
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-white">
                {db.name}
              </h3>
              <p className="text-sm leading-6 text-zinc-400">
                {db.description}
              </p>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="mb-6 flex-1">
                <h4 className="mb-3 font-semibold text-zinc-200">
                  Key Features
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {db.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <span className="mr-2 size-1.5 rounded-full bg-blue-400" />
                      <span className="text-sm text-zinc-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 font-semibold text-zinc-200">
                  Perfect For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {db.useCases.map((useCase, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-zinc-400"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              <CustomButton
                title="Deploy Database"
                className="mt-auto block w-full cursor-pointer rounded-full border border-white/15 bg-white px-4 py-3 text-center font-medium text-zinc-950 transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_12px_36px_rgba(255,255,255,0.16)]"
                newWindow={true}
                href={db.deployUrl}
                location="databases-section"
                additionalData={{ technology: db.name }}
              >
                Deploy {db.name}
              </CustomButton>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center sm:mt-16">
        <div className="rounded-xl border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur sm:p-8">
          <h3 className="mb-4 text-2xl font-semibold text-white">
            Need Help Choosing?
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Our database selection guide helps you pick the perfect database for
            your specific use case, considering factors like data structure,
            scaling needs, and performance requirements.
          </p>
          <a
            href="/blog/the-best-db-to-pick-on-sealos"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 font-medium text-white transition-colors hover:bg-white/[0.1]"
          >
            Read Our Database Guide
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
