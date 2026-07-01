'use client';
import React, { useCallback, useState } from 'react';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { appDomain } from '@/config/site';
import { CustomButton } from '@/components/ui/button-custom';
import { Package, Star } from 'lucide-react';
import Image from 'next/image';

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
    <div>
      <AnimateElement type="slideUp">
        <div className="mb-6 text-center text-3xl font-medium text-white sm:mb-8 sm:text-4xl">
          Comprehensive Development Stack Support
        </div>

        <div className="mb-8 flex justify-center">
          <div className="max-w-[760px] rounded-full border border-blue-300/20 bg-blue-500/10 px-4 py-3 text-center text-xs font-medium text-zinc-400 md:text-sm">
            Launch specialized development environments for
            <span className="px-1 text-blue-300">
              any framework or language.
            </span>
          </div>
        </div>

        <div className="mb-4 overflow-x-auto pb-2">
          <div className="mx-auto flex w-max min-w-full justify-start gap-2 text-sm font-medium sm:justify-center sm:text-base">
            {Object.keys(tileData).map((tab) => (
              <button
                key={tab}
                className={`cursor-pointer rounded-full border px-3 py-2 whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'border-white/20 bg-white text-zinc-950'
                    : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 text-center text-sm text-zinc-500">
          {tileData[activeTab].description}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tileData[activeTab].items.map((tech) => {
            const deployName = tech.name.toLowerCase().replace(/\s+/g, '');
            return (
              <div
                key={tech.name}
                className="inset-shadow-bubble flex min-h-[168px] flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur transition-colors hover:border-blue-400/40"
              >
                <div className="relative flex gap-4">
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-4xl">
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={40}
                      height={40}
                      className="size-7 object-contain"
                      loading="lazy"
                      sizes="40px"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-medium text-white">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-zinc-500">{tech.language}</p>
                  </div>
                  <div className="absolute top-0 right-0 -mt-2 flex flex-col items-center gap-1 rounded p-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-zinc-500">
                      {tech.githubStars
                        ? tech.githubStars.toLocaleString()
                        : 'Popular'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <CustomButton
                    className="group relative flex h-10 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border border-white bg-white px-4 py-2 text-sm font-medium whitespace-pre text-zinc-950 shadow-sm transition-all duration-300 ease-out hover:bg-zinc-200 focus-visible:ring-1 focus-visible:ring-white focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 md:flex"
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
      </AnimateElement>
    </div>
  );
}
