'use client';
import React, { useCallback, useState } from 'react';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import Image from 'next/image';

interface TechItem {
  name: string;
  language: string;
  icon: string;
  githubStars?: number;
  adoptionRate?: string;
  isEnterprise?: boolean;
}

interface CategoryData {
  description: string;
  items: TechItem[];
}

const mockData: Record<string, CategoryData> = {
  'Industry Standards': {
    description: 'Production-tested technologies powering modern applications',
    items: [
      {
        name: 'Node.js',
        language: 'JavaScript',
        icon: '/icons/node.js.svg',
        githubStars: 89000,
        adoptionRate: '95%',
        isEnterprise: true,
      },
      {
        name: 'Python',
        language: 'Python',
        icon: '/icons/python.svg',
        githubStars: 45000,
        adoptionRate: '92%',
        isEnterprise: true,
      },
      {
        name: 'Ruby',
        language: 'Ruby',
        icon: '/icons/ruby.png',
        githubStars: 30000,
        adoptionRate: '88%',
        isEnterprise: true,
      },
      {
        name: 'Java',
        language: 'Java',
        icon: '/icons/java.svg',
        githubStars: 75000,
        adoptionRate: '93%',
        isEnterprise: true,
      },
      {
        name: 'Go',
        language: 'Go',
        icon: '/icons/go.svg',
        githubStars: 50000,
        adoptionRate: '91%',
        isEnterprise: true,
      },
      {
        name: 'PHP',
        language: 'PHP',
        icon: '/icons/php.svg',
        githubStars: 20000,
        adoptionRate: '85%',
        isEnterprise: true,
      },
    ],
  },
  'Backend & APIs': {
    description: 'Robust server-side frameworks for scalable applications',
    items: [
      {
        name: 'Echo',
        language: 'JavaScript',
        icon: '/icons/echo.svg',
        githubStars: 24000,
        adoptionRate: '78%',
        isEnterprise: true,
      },
      {
        name: 'Chi',
        language: 'JavaScript',
        icon: '/icons/chi.svg',
        githubStars: 15000,
        adoptionRate: '72%',
        isEnterprise: true,
      },
      {
        name: 'Iris',
        language: 'TypeScript',
        icon: '/icons/iris.svg',
        githubStars: 18000,
        adoptionRate: '75%',
        isEnterprise: true,
      },
      {
        name: 'Gin',
        language: 'Go',
        icon: '/icons/gin.svg',
        githubStars: 12000,
        adoptionRate: '68%',
        isEnterprise: true,
      },
      {
        name: 'vert.x',
        language: 'Go',
        icon: '/icons/vert.x.svg',
        githubStars: 10000,
        adoptionRate: '65%',
        isEnterprise: true,
      },
      {
        name: 'Spring Boot',
        language: 'Java',
        icon: '/icons/spring-boot.svg',
        githubStars: 50000,
        adoptionRate: '93%',
        isEnterprise: true,
      },
      {
        name: 'Django',
        language: 'Python',
        icon: '/icons/django.svg',
        githubStars: 35000,
        adoptionRate: '87%',
        isEnterprise: true,
      },
      {
        name: 'Flask',
        language: 'Python',
        icon: '/icons/flask.svg',
        githubStars: 20000,
        adoptionRate: '82%',
        isEnterprise: true,
      },
      {
        name: 'Rocket',
        language: 'Rust',
        icon: '/icons/rocket.svg',
        githubStars: 10000,
        adoptionRate: '70%',
        isEnterprise: true,
      },
      {
        name: 'Express.js',
        language: 'JavaScript',
        icon: '/icons/express.js.svg',
        githubStars: 40000,
        adoptionRate: '89%',
        isEnterprise: true,
      },
    ],
  },
  'Frontend & UI': {
    description:
      'Modern frontend frameworks for building interactive user interfaces',
    items: [
      {
        name: 'Next.js',
        language: 'JavaScript',
        icon: '/icons/next.js.svg',
        githubStars: 50000,
        adoptionRate: '94%',
        isEnterprise: true,
      },
      {
        name: 'React',
        language: 'JavaScript',
        icon: '/icons/react.svg',
        githubStars: 70000,
        adoptionRate: '95%',
        isEnterprise: true,
      },
      {
        name: 'Vue',
        language: 'JavaScript',
        icon: '/icons/vue.svg',
        githubStars: 40000,
        adoptionRate: '92%',
        isEnterprise: true,
      },
      {
        name: 'Angular',
        language: 'JavaScript',
        icon: '/icons/angular.svg',
        githubStars: 60000,
        adoptionRate: '93%',
        isEnterprise: true,
      },
      {
        name: 'nuxt3',
        language: 'JavaScript',
        icon: '/icons/nuxt3.svg',
        githubStars: 20000,
        adoptionRate: '85%',
        isEnterprise: true,
      },
      {
        name: 'Umi',
        language: 'JavaScript',
        icon: '/icons/umi.svg',
        githubStars: 15000,
        adoptionRate: '80%',
        isEnterprise: true,
      },
      {
        name: 'SvelteKit',
        language: 'JavaScript',
        icon: '/icons/svelte.svg',
        githubStars: 10000,
        adoptionRate: '75%',
        isEnterprise: true,
      },
    ],
  },
  'Documentation & Content': {
    description:
      'Tools for creating and managing technical documentation and content',
    items: [
      {
        name: 'Docusaurus',
        language: 'JavaScript',
        icon: '/icons/docusaurus.svg',
        githubStars: 20000,
        adoptionRate: '85%',
        isEnterprise: true,
      },
      {
        name: 'VuePress',
        language: 'JavaScript',
        icon: '/icons/vuepress.svg',
        githubStars: 15000,
        adoptionRate: '82%',
        isEnterprise: true,
      },
      {
        name: 'Gatsby',
        language: 'JavaScript',
        icon: '/icons/gatsby.svg',
        githubStars: 25000,
        adoptionRate: '88%',
        isEnterprise: true,
      },
      {
        name: 'Hugo',
        language: 'Go',
        icon: '/icons/hugo.svg',
        githubStars: 10000,
        adoptionRate: '75%',
        isEnterprise: true,
      },
      {
        name: 'Jekyll',
        language: 'Ruby',
        icon: '/icons/jekyll.png',
        githubStars: 12000,
        adoptionRate: '80%',
        isEnterprise: true,
      },
      {
        name: 'Reveal.js',
        language: 'JavaScript',
        icon: '/icons/reveal.js.svg',
        githubStars: 18000,
        adoptionRate: '87%',
        isEnterprise: true,
      },
    ],
  },
  'Systems & Native Development': {
    description:
      'Native development frameworks and languages for building high-performance applications',
    items: [
      {
        name: 'C++',
        language: 'C++',
        icon: '/icons/c++.svg',
        githubStars: 50000,
        adoptionRate: '94%',
        isEnterprise: true,
      },
      {
        name: 'Rust',
        language: 'Rust',
        icon: '/icons/rust.svg',
        githubStars: 30000,
        adoptionRate: '88%',
        isEnterprise: true,
      },
      {
        name: 'Go',
        language: 'Go',
        icon: '/icons/go.svg',
        githubStars: 40000,
        adoptionRate: '92%',
        isEnterprise: true,
      },
      {
        name: 'Java',
        language: 'Java',
        icon: '/icons/java.svg',
        githubStars: 70000,
        adoptionRate: '95%',
        isEnterprise: true,
      },
      {
        name: 'C#',
        language: 'C#',
        icon: '/icons/csharp.svg',
        githubStars: 35000,
        adoptionRate: '89%',
        isEnterprise: true,
      },
      {
        name: 'Kotlin',
        language: 'Kotlin',
        icon: '/icons/kotlin.svg',
        githubStars: 25000,
        adoptionRate: '86%',
        isEnterprise: true,
      },
    ],
  },
};

export default function TechGrid() {
  const [activeTab, setActiveTab] = useState('Backend & APIs');

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="mt-0 lg:mt-52">
      <AnimateElement type="slideUp">
        <div className="mb-6 text-center text-base font-bold text-black sm:mb-16 sm:text-4xl">
          Comprehensive Development Stack Support
        </div>

        {/* Tabs */}
        <div className="mb-4 flex flex-wrap justify-center gap-4 text-sm font-medium sm:text-base">
          {Object.keys(mockData).map((tab) => (
            <button
              key={tab}
              className={`rounded-md px-2 py-1 ${
                activeTab === tab
                  ? 'rounded-md bg-[#FAFCFF] text-black'
                  : 'text-custom-secondary-text hover:bg-[#FAFCFF]/80'
              }`}
              style={{
                boxShadow:
                  activeTab === tab
                    ? '0px 4px 4px 0px rgba(19, 51, 107, 0.05), 0px 0px 1px 0px rgba(19, 51, 107, 0.08)'
                    : '',
              }}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="mb-6 text-center text-sm text-custom-secondary-text">
          {mockData[activeTab].description}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mockData[activeTab].items.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col gap-4 rounded-lg bg-white px-6 py-5"
              style={{
                boxShadow:
                  '0px 12px 40px -25px rgba(6, 26, 65, 0.20), 0px 0px 1px 0px rgba(19, 51, 107, 0.20)',
              }}
            >
              <div className="flex gap-4">
                <div className="relative flex size-7 items-center justify-center text-4xl lg:size-10">
                  <Image
                    src={tech.icon}
                    alt={tech.name}
                    fill
                    className="size-7 lg:size-10"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xs font-medium text-black lg:text-lg">
                    {tech.name}
                  </h3>
                  <p className="text-[8px] text-custom-secondary-text lg:text-xs">
                    {tech.language}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              {(tech.githubStars || tech.adoptionRate || tech.isEnterprise) && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {tech.githubStars && (
                    <span className="rounded bg-gray-100 px-2 py-1">
                      ⭐ {tech.githubStars.toLocaleString()}
                    </span>
                  )}
                  {tech.adoptionRate && (
                    <span className="rounded bg-gray-100 px-2 py-1">
                      📈 {tech.adoptionRate}
                    </span>
                  )}
                  {tech.isEnterprise && (
                    <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">
                      Enterprise Ready
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <div
            className="max-w-[760px] rounded-[46px] border border-solid border-[#ABE1FF] px-4 py-3 text-center text-xs font-medium text-custom-secondary-text md:text-sm"
            style={{
              background:
                'linear-gradient(90deg, rgba(170, 229, 255, 0.30) 0%, rgba(170, 229, 255, 0.20) 100%)',
            }}
          >
            Launch specialized development environments for
            <span className="px-1 text-[#008AB6]">
              any framework or language.
            </span>
          </div>
        </div>
      </AnimateElement>
    </div>
  );
}
