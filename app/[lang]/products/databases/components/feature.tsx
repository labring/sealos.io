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
      'Pay-per-use pricing',
      'Zero downtime scaling',
      'Performance optimization',
    ],
  },
  {
    title: 'Multi-Database Support',
    description:
      'Choose from PostgreSQL, MySQL, MongoDB, Redis, Kafka, and Milvus for your specific use case.',
    icon: <Database className="h-8 w-8" />,
    benefits: [
      'PostgreSQL for complex queries',
      'MongoDB for flexible schemas',
      'Redis for high-performance caching',
      'Kafka for event streaming',
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
    <section className="py-20">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Managed Database Excellence
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">
          Focus on building your application while Sealos handles database
          operations, scaling, security, and maintenance for you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            <div className="mb-6">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex-shrink-0 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg leading-tight font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">
                Key Benefits:
              </h4>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <span className="mr-2 text-green-500">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
