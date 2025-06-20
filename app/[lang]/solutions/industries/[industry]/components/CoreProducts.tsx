'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import { appDomain } from '@/config/site';
import { CheckCircle, Code, Database, Globe } from 'lucide-react';
import Link from 'next/link';

interface CoreProductsProps {
  industryName: string;
}

export default function CoreProducts({ industryName }: CoreProductsProps) {
  return (
    <AnimateElement type="slideUp">
      <section className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Core Sealos Products for {industryName}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Three foundational products that form the backbone of modern{' '}
            {industryName.toLowerCase()} infrastructure - development
            environments, managed databases, and curated applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* DevBox */}
          <AnimateElement type="slideUp">
            <div className="flex h-full min-h-[400px] flex-col rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4 flex items-center gap-4">
                <div className="rounded-lg bg-blue-600 p-3">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">DevBox</h3>
                  <p className="font-medium text-blue-600">
                    Cloud Development Environment
                  </p>
                </div>
              </div>

              <p className="mb-4 leading-relaxed text-gray-700">
                Instant, pre-configured development environments that teams can
                access from anywhere. No more setup issues or environment
                inconsistencies.
              </p>

              <div className="mb-4">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Perfect for:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Collaborative development
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Quick prototyping
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Remote team work
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Consistent environments
                  </li>
                </ul>
              </div>

              <div className="mt-auto flex gap-3">
                <Link
                  href="/products/devbox"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Learn More
                </Link>
                <Link
                  href={appDomain}
                  className="flex-1 rounded-lg border-2 border-blue-600 px-4 py-3 text-center font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Try Now
                </Link>
              </div>
            </div>
          </AnimateElement>

          {/* Databases */}
          <AnimateElement type="slideUp">
            <div className="flex h-full min-h-[400px] flex-col rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4 flex items-center gap-4">
                <div className="rounded-lg bg-green-600 p-3">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Databases
                  </h3>
                  <p className="font-medium text-green-600">
                    Managed Database Services
                  </p>
                </div>
              </div>

              <p className="mb-4 leading-relaxed text-gray-700">
                Production-ready databases with automatic scaling, backups, and
                monitoring. Focus on your application, not database
                administration.
              </p>

              <div className="mb-4">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Perfect for:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Application backends
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Data analytics
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    High-availability systems
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Scalable data storage
                  </li>
                </ul>
              </div>

              <div className="mt-auto flex gap-3">
                <Link
                  href="/products/databases"
                  className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-green-700"
                >
                  Learn More
                </Link>
                <Link
                  href={appDomain}
                  className="flex-1 rounded-lg border-2 border-green-600 px-4 py-3 text-center font-medium text-green-600 transition-colors hover:bg-green-50"
                >
                  Try Now
                </Link>
              </div>
            </div>
          </AnimateElement>

          {/* App Store */}
          <AnimateElement type="slideUp">
            <div className="flex h-full min-h-[400px] flex-col rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 p-8 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4 flex items-center gap-4">
                <div className="rounded-lg bg-purple-600 p-3">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    App Store
                  </h3>
                  <p className="font-medium text-purple-600">
                    One-Click Application Deployment
                  </p>
                </div>
              </div>

              <p className="mb-4 leading-relaxed text-gray-700">
                Deploy 100+ applications with a single click. From specialized
                tools to productivity suites, everything you need is ready to
                deploy.
              </p>

              <div className="mb-4">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Perfect for:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Quick tool deployment
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Specialized applications
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Team productivity
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Collaborative workspaces
                  </li>
                </ul>
              </div>

              <div className="mt-auto flex gap-3">
                <Link
                  href="/products/app-store"
                  className="flex-1 rounded-lg bg-purple-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-purple-700"
                >
                  Learn More
                </Link>
                <Link
                  href={appDomain}
                  className="flex-1 rounded-lg border-2 border-purple-600 px-4 py-3 text-center font-medium text-purple-600 transition-colors hover:bg-purple-50"
                >
                  Try Now
                </Link>
              </div>
            </div>
          </AnimateElement>
        </div>
      </section>
    </AnimateElement>
  );
}
