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
    gradient: 'from-blue-50/70 to-indigo-50/70',
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
    gradient: 'from-blue-50/70 to-indigo-50/70',
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
    gradient: 'from-blue-50/70 to-indigo-50/70',
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
    gradient: 'from-blue-50/70 to-indigo-50/70',
    deployUrl: `${appDomain + dbAppSlug}`,
  },
  {
    name: 'Apache Kafka',
    description:
      'Distributed event streaming platform for high-throughput data',
    iconPath: '/images/database/kafka.svg',
    useCases: [
      'Event Streaming',
      'Log Aggregation',
      'Real-time Pipelines',
      'Microservices',
    ],
    features: [
      'High Throughput',
      'Fault Tolerance',
      'Stream Processing',
      'Exactly-once Semantics',
    ],
    gradient: 'from-blue-50/70 to-indigo-50/70',
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
    gradient: 'from-blue-50/70 to-indigo-50/70',
    deployUrl: `${appDomain + dbAppSlug}`,
  },
];

export default function Databases() {
  return (
    <section className="py-20">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Choose Your Perfect Database
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">
          From traditional SQL to modern NoSQL, streaming platforms to vector
          databases - deploy any database with enterprise-grade management.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {databases.map((db, index) => (
          <div
            key={index}
            className="group flex flex-col overflow-hidden rounded-2xl border border-blue-50 bg-white shadow-lg transition-all duration-300 hover:border-blue-100 hover:shadow-xl"
          >
            <div
              className={`bg-gradient-to-r ${db.gradient} border-b border-blue-100/50 p-6 text-slate-700`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100/30 bg-white/80 shadow-sm">
                  <img
                    src={db.iconPath}
                    alt={`${db.name} icon`}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="rounded-full border border-blue-100/30 bg-white/80 px-3 py-1">
                  <span className="text-sm font-medium text-slate-600">
                    Managed
                  </span>
                </div>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-800">
                {db.name}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {db.description}
              </p>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="mb-6 flex-1">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Key Features
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {db.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <span className="mr-2 text-xs text-blue-400">●</span>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Perfect For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {db.useCases.map((useCase, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              <CustomButton
                title="Deploy Database"
                className="mt-auto block w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
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

      <div className="mt-16 text-center">
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Need Help Choosing?
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600">
            Our database selection guide helps you pick the perfect database for
            your specific use case, considering factors like data structure,
            scaling needs, and performance requirements.
          </p>
          <a
            href="/blog/the-best-db-to-pick-on-sealos"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Read Our Database Guide
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
