'use client';

import { motion, Variants } from 'motion/react';
import { Star, Users, GitBranch } from 'lucide-react';
import { languagesType } from '@/lib/i18n';

interface SocialProofProps {
  lang?: languagesType;
}

const translations = {
  en: {
    trustedBy: 'Trusted by industry leaders',
    tagline: 'From code to production faster with DevBox',
    githubStars: 'GitHub Stars',
    developers: 'Active Developers',
    testimonialAuthor: 'Bieber, CEO at Teable',
    testimonialQuote:
      "DevBox reduced our environment setup time from 3 days to 30 minutes. It's a game-changer for our development workflow.",
  },
  'zh-cn': {
    trustedBy: '深受行业领导者信赖',
    tagline: '用 DevBox 更快从代码到生产',
    githubStars: 'GitHub Stars',
    developers: '活跃开发者',
    testimonialAuthor: 'Sarah Chen，TechCorp 工程负责人',
    testimonialQuote:
      'DevBox 将我们的环境设置时间从 3 天缩短到 30 分钟。这彻底改变了我们的开发工作流程。',
  },
};

export default function SocialProof({ lang = 'en' }: SocialProofProps) {
  const t = translations[lang] || translations.en;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const logos = [
    {
      name: 'GitHub',
      url: '/images/logos/github.svg',
    },
    {
      name: 'FastGPT',
      url: '/images/logos/fastgpt.svg',
    },
    {
      name: 'JetBrains',
      url: '/images/logos/jetbrains.svg',
    },
  ];

  return (
    <motion.section
      className="py-4 sm:py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <p className="mb-8 text-sm font-semibold tracking-wider text-zinc-500 uppercase">
            {t.trustedBy}
          </p>
          <p className="-mt-4 mb-6 text-xs text-zinc-500">{t.tagline}</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {logos.map((logo) => (
              <motion.div
                key={logo.name}
                className="opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid items-center gap-8 md:grid-cols-2">
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center gap-6 sm:flex-row md:justify-start"
          >
            <motion.div
              className="inset-shadow-bubble flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur"
              whileHover={{
                scale: 1.02,
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                <GitBranch className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">16K+</p>
                <p className="text-sm text-zinc-400">{t.githubStars}</p>
              </div>
            </motion.div>

            <motion.div
              className="inset-shadow-bubble flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur"
              whileHover={{
                scale: 1.02,
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-sm text-zinc-400">{t.developers}</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="inset-shadow-bubble rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8"
            whileHover={{ scale: 1.01 }}
          >
            <div className="mb-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </motion.div>
              ))}
            </div>
            <blockquote className="mb-4 text-lg leading-relaxed text-zinc-200">
              "{t.testimonialQuote}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-white shadow-lg shadow-emerald-500/25">
                SC
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {t.testimonialAuthor}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
