'use client';
import React, { useCallback, useState } from 'react';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { appDomain } from '@/config/site';
import { CustomButton } from '@/components/ui/button-custom';
import { Package } from 'lucide-react';

interface TechItem {
  name: string;
  language: string;
  icon: string;
  githubStars?: number;
  adoptionRate?: string;
  isEnterprise?: boolean;
  githubRepo?: string;
}

interface CategoryData {
  description: string;
  items: TechItem[];
}

const deployLink = `${appDomain}/?openapp=system-devbox?page%3Dcreate%26runtime%3D`;
const tileData: Record<string, CategoryData> = {
  'Industry Standards': {
    description: 'Production-tested technologies powering modern applications',
    items: [
      {
        name: 'Node.js',
        language: 'JavaScript',
        icon: '/icons/node.js.svg',
        githubStars: 110000,
        githubRepo: 'https://github.com/nodejs/node',
        // adoptionRate: '95%',
        // isEnterprise: true,
      },
      {
        name: 'Python',
        language: 'Python',
        icon: '/icons/python.svg',
        githubStars: 65600,
        githubRepo: 'https://github.com/python/cpython',
        // adoptionRate: '92%',
        // isEnterprise: true,
      },
      {
        name: 'Ruby',
        language: 'Ruby',
        icon: '/icons/ruby.png',
        githubStars: 22400,
        githubRepo: 'https://github.com/ruby/ruby',
        // adoptionRate: '88%',
        // isEnterprise: true,
      },
      {
        name: 'Java',
        language: 'Java',
        icon: '/icons/java.svg',
        githubStars: 20500,
        githubRepo: 'https://github.com/openjdk/jdk',
        // adoptionRate: '93%',
        // isEnterprise: true,
      },
      {
        name: 'Go',
        language: 'Go',
        icon: '/icons/go.svg',
        githubStars: 126000,
        githubRepo: 'https://github.com/golang/go',
        // adoptionRate: '91%',
        // isEnterprise: true,
      },
      {
        name: 'PHP',
        language: 'PHP',
        icon: '/icons/php.svg',
        githubStars: 38700,
        githubRepo: 'https://github.com/php/php-src',
        // adoptionRate: '85%',
        // isEnterprise: true,
      },
      {
        name: '.NET',
        language: '.NET',
        icon: '/icons/net.svg',
        githubStars: 15900,
        githubRepo: 'https://github.com/dotnet/runtime',
        // adoptionRate: '85%',
        // isEnterprise: true,
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
        githubStars: 30600,
        githubRepo: 'https://github.com/labstack/echo',
        // adoptionRate: '78%',
        // isEnterprise: true,
      },
      {
        name: 'Chi',
        language: 'JavaScript',
        icon: '/icons/chi.svg',
        githubStars: 19200,
        githubRepo: 'https://github.com/go-chi/chi',
        // adoptionRate: '72%',
        // isEnterprise: true,
      },
      {
        name: 'Iris',
        language: 'TypeScript',
        icon: '/icons/iris.svg',
        githubStars: 25400,
        githubRepo: 'https://github.com/kataras/iris',
        // adoptionRate: '75%',
        // isEnterprise: true,
      },
      {
        name: 'Gin',
        language: 'Go',
        icon: '/icons/gin.svg',
        githubStars: 80600,
        githubRepo: 'https://github.com/gin-gonic/gin',
        // adoptionRate: '68%',
        // isEnterprise: true,
      },
      {
        name: 'Spring Boot',
        language: 'Java',
        icon: '/icons/spring-boot.svg',
        githubStars: 76300,
        githubRepo: 'https://github.com/spring-projects/spring-boot',
        // adoptionRate: '93%',
        // isEnterprise: true,
      },
      {
        name: 'Django',
        language: 'Python',
        icon: '/icons/django.svg',
        githubStars: 82600,
        githubRepo: 'https://github.com/django/django',
        // adoptionRate: '87%',
        // isEnterprise: true,
      },
      {
        name: 'Flask',
        language: 'Python',
        icon: '/icons/flask.svg',
        githubStars: 69000,
        githubRepo: 'https://github.com/pallets/flask',
        // adoptionRate: '82%',
        // isEnterprise: true,
      },
      {
        name: 'Rocket',
        language: 'Rust',
        icon: '/icons/rocket.svg',
        githubStars: 24900,
        githubRepo: 'https://github.com/SergioBenitez/Rocket',
        // adoptionRate: '70%',
        // isEnterprise: true,
      },
      {
        name: 'Express.js',
        language: 'JavaScript',
        icon: '/icons/express.js.svg',
        githubStars: 66400,
        githubRepo: 'https://github.com/expressjs/express',
        // adoptionRate: '89%',
        // isEnterprise: true,
      },
      {
        name: 'Vert.x',
        language: 'Java',
        icon: '/icons/vert.x.svg',
        githubStars: 14400,
        githubRepo: 'https://github.com/eclipse-vertx/vert.x',
        // adoptionRate: '89%',
        // isEnterprise: true,
      },
      {
        name: 'nginx',
        language: 'nginx',
        icon: '/icons/nginx.svg',
        githubStars: 26200,
        githubRepo: 'https://github.com/nginx/nginx',
        // adoptionRate: '89%',
        // isEnterprise: true,
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
        githubStars: 130000,
        githubRepo: 'https://github.com/vercel/next.js',
        // adoptionRate: '94%',
        // isEnterprise: true,
      },
      {
        name: 'React',
        language: 'JavaScript',
        icon: '/icons/react.svg',
        githubStars: 233000,
        githubRepo: 'https://github.com/facebook/react',
        // adoptionRate: '95%',
        // isEnterprise: true,
      },
      {
        name: 'Vue',
        language: 'JavaScript',
        icon: '/icons/vue.svg',
        githubStars: 208000,
        githubRepo: 'https://github.com/vuejs/vue',
        // adoptionRate: '92%',
        // isEnterprise: true,
      },
      {
        name: 'Angular',
        language: 'JavaScript',
        icon: '/icons/angular.svg',
        githubStars: 97100,
        githubRepo: 'https://github.com/angular/angular',
        // adoptionRate: '93%',
        // isEnterprise: true,
      },
      {
        name: 'nuxt3',
        language: 'JavaScript',
        icon: '/icons/nuxt3.svg',
        githubStars: 56300,
        githubRepo: 'https://github.com/nuxt/nuxt.js',
        // adoptionRate: '85%',
        // isEnterprise: true,
      },
      {
        name: 'Umi',
        language: 'JavaScript',
        icon: '/icons/umi.svg',
        githubStars: 15600,
        githubRepo: 'https://github.com/umijs/umi',
        // adoptionRate: '80%',
        // isEnterprise: true,
      },
      {
        name: 'SvelteKit',
        language: 'JavaScript',
        icon: '/icons/svelte.svg',
        githubStars: 19100,
        githubRepo: 'https://github.com/sveltejs/kit',
        // adoptionRate: '75%',
        // isEnterprise: true,
      },
      {
        name: 'Hexo',
        language: 'JavaScript',
        icon: '/icons/hexo.svg',
        githubStars: 40100,
        githubRepo: 'https://github.com/hexojs/hexo',
        // adoptionRate: '75%',
        // isEnterprise: true,
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
        githubStars: 58600,
        githubRepo: 'https://github.com/facebook/docusaurus',
        // adoptionRate: '85%',
        // isEnterprise: true,
      },
      {
        name: 'VuePress',
        language: 'JavaScript',
        icon: '/icons/vuepress.svg',
        githubStars: 22700,
        githubRepo: 'https://github.com/vuejs/vuepress',
        // adoptionRate: '82%',
        // isEnterprise: true,
      },
      {
        name: 'Gatsby',
        language: 'JavaScript',
        icon: '/icons/gatsby.svg',
        githubStars: 55800,
        githubRepo: 'https://github.com/gatsbyjs/gatsby',
        // adoptionRate: '88%',
        // isEnterprise: true,
      },
      {
        name: 'Hugo',
        language: 'Go',
        icon: '/icons/hugo.svg',
        githubStars: 78500,
        githubRepo: 'https://github.com/gohugoio/hugo',
        // adoptionRate: '75%',
        // isEnterprise: true,
      },
      {
        name: 'Jekyll',
        language: 'Ruby',
        icon: '/icons/jekyll.png',
        githubStars: 49700,
        githubRepo: 'https://github.com/jekyll/jekyll',
        // adoptionRate: '80%',
        // isEnterprise: true,
      },
      {
        name: 'Reveal.js',
        language: 'JavaScript',
        icon: '/icons/reveal.js.svg',
        githubStars: 68500,
        githubRepo: 'https://github.com/hakimel/reveal.js',
        // adoptionRate: '87%',
        // isEnterprise: true,
      },
      {
        name: 'Astro',
        language: 'JavaScript',
        icon: '/icons/astro.svg',
        githubStars: 49600,
        githubRepo: 'https://github.com/withastro/astro',
        // adoptionRate: '87%',
        // isEnterprise: true,
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
        githubStars: undefined,
        githubRepo: undefined,
        // adoptionRate: '94%',
        // isEnterprise: true,
      },
      {
        name: 'Rust',
        language: 'Rust',
        icon: '/icons/rust.svg',
        githubStars: 102000,
        githubRepo: 'https://github.com/rust-lang/rust',
        // adoptionRate: '88%',
        // isEnterprise: true,
      },
      {
        name: 'Go',
        language: 'Go',
        icon: '/icons/go.svg',
        githubStars: 126000,
        githubRepo: 'https://github.com/golang/go',
        // adoptionRate: '92%',
        // isEnterprise: true,
      },
      {
        name: 'Java',
        language: 'Java',
        icon: '/icons/java.svg',
        githubStars: undefined,
        githubRepo: undefined,
        // adoptionRate: '95%',
        // isEnterprise: true,
      },
      {
        name: 'C#',
        language: 'C#',
        icon: '/icons/csharp.svg',
        githubStars: undefined,
        githubRepo: undefined,
        // adoptionRate: '89%',
        // isEnterprise: true,
      },
      {
        name: 'Kotlin',
        language: 'Kotlin',
        icon: '/icons/kotlin.svg',
        githubStars: 50100,
        githubRepo: 'https://github.com/JetBrains/kotlin',
        // adoptionRate: '86%',
        // isEnterprise: true,
      },
      {
        name: 'Ubuntu',
        language: 'Ubuntu',
        icon: '/icons/ubuntu.svg',
        githubStars: undefined,
        githubRepo: undefined,
        // adoptionRate: '86%',
        // isEnterprise: true,
      },
      {
        name: 'Debian',
        language: 'Debian',
        icon: '/icons/debian.svg',
        githubStars: undefined,
        githubRepo: undefined,
        // adoptionRate: '86%',
        // isEnterprise: true,
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
        <div className="mb-6 text-center text-4xl font-bold text-black sm:mb-16">
          Comprehensive Development Stack Support
        </div>

        {/* Tabs */}
        <div className="mb-4 flex flex-wrap justify-center gap-4 text-sm font-medium sm:text-base">
          {Object.keys(tileData).map((tab) => (
            <button
              key={tab}
              className={`cursor-pointer rounded-md px-2 py-1 ${
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
        <div className="text-custom-secondary-text mb-6 text-center text-sm">
          {tileData[activeTab].description}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {tileData[activeTab].items.map((tech) => {
            const deployName = tech.name.toLowerCase().replace(/\s+/g, '');
            return (
              <div
                key={tech.name}
                className="flex flex-col gap-4 rounded-lg bg-white px-6 py-5"
                style={{
                  boxShadow:
                    '0px 12px 40px -25px rgba(6, 26, 65, 0.20), 0px 0px 1px 0px rgba(19, 51, 107, 0.20)',
                }}
              >
                <div className="relative flex gap-4">
                  <div className="relative flex size-7 items-center justify-center text-4xl lg:size-10">
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="size-7 lg:size-10"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-medium text-black">
                      {tech.name}
                    </h3>
                    <p className="text-custom-secondary-text text-xs">
                      {tech.language}
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 -mt-2 flex flex-col items-center gap-2 rounded p-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-custom-secondary-text text-xs">
                      {tech.githubStars
                        ? tech.githubStars.toLocaleString()
                        : 'Popular'}
                    </span>
                  </div>
                </div>

                {/* Deploy Button */}
                <div className="mt-4 flex justify-center">
                  <CustomButton
                    className="group bg-custom-bg text-custom-primary-text hover:ring-custom-bg focus-visible:ring-ring relative flex h-9 w-full max-w-52 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md px-4 py-2 text-sm font-medium whitespace-pre shadow-sm transition-all duration-300 ease-out hover:bg-[#97D9FF] hover:ring-2 hover:ring-offset-2 focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 md:flex"
                    title="Deploy DevBox"
                    href={`${deployLink}${deployName}`}
                    location="tech-grid"
                    additionalData={{
                      technology: tech.name,
                      category: activeTab,
                    }}
                  >
                    <div className="flex items-center">
                      <Package className="h-4 w-4 fill-none" />
                      <span className="ml-2">Deploy on DevBox</span>
                    </div>
                  </CustomButton>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <div
            className="text-custom-secondary-text max-w-[760px] rounded-[46px] border border-solid border-[#ABE1FF] px-4 py-3 text-center text-xs font-medium md:text-sm"
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
