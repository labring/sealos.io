import { ArrowUpRight, Mail, Youtube } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { languagesType } from '@/lib/i18n';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { FooterV2 } from '@/new-components/Footer';
import {
  BilibiliIcon,
  DiscordIcon,
  GithubIcon,
  WechatIcon,
  XIcon,
} from '@/new-components/Footer/FooterIcons';
import { Header } from '@/new-components/Header';
import { PageTopRays } from '@/new-components/SideRays';

const translations = {
  en: {
    title: {
      main: 'Contact Us',
      sub: 'Get in Touch',
    },
    description:
      "Get in touch with our team. We're here to help you with any questions about Sealos and our cloud platform.",
    emailText: 'Email us at',
    followText: 'Follow us on social media',
    introText:
      "Have questions about Sealos? Need support with your cloud deployment? Our team is here to help. Reach out to us and we'll get back to you as soon as possible.",
    supportText: "We're here to help",
  },
  'zh-cn': {
    title: {
      main: '联系我们',
      sub: '与我们联系',
    },
    description:
      '与我们的团队取得联系。我们随时为您解答关于 Sealos 和我们云平台的任何问题。',
    emailText: '发邮件至',
    followText: '在社交媒体上关注我们',
    introText:
      '对 Sealos 有疑问？需要云部署支持？我们的团队随时为您提供帮助。请联系我们，我们会尽快回复您。',
    supportText: '我们随时为您提供帮助',
  },
};

const socialLinks = [
  {
    label: 'GitHub',
    href: siteConfig.links.github,
    icon: <GithubIcon />,
  },
  {
    label: 'Discord',
    href: siteConfig.links.discord,
    icon: <DiscordIcon />,
  },
  {
    label: 'X / Twitter',
    href: siteConfig.links.twitter,
    icon: <XIcon className="size-4" />,
  },
  {
    label: 'YouTube',
    href: siteConfig.links.youtube,
    icon: <Youtube className="size-4" strokeWidth={1.75} aria-hidden="true" />,
  },
];

const chineseSocialLinks = [
  {
    label: 'Bilibili',
    href: siteConfig.links.bilibili,
    icon: <BilibiliIcon />,
  },
  {
    label: 'WeChat',
    href: siteConfig.links.wechat,
    icon: <WechatIcon />,
  },
];

export async function generateMetadata({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang];

  return generatePageMetadata({
    title: t.title.main,
    description: t.description,
    pathname: `${params.lang}/contact`,
  });
}

export default function ContactPage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang];
  const visibleSocialLinks =
    params.lang === 'zh-cn'
      ? [...socialLinks, ...chineseSocialLinks]
      : socialLinks;

  return (
    <>
      <div className="bg-background relative z-10">
        <div className="sticky top-0 z-50 w-full max-lg:-mb-8">
          <Header lang={params.lang} />
        </div>

        <main
          id="main-content"
          className="relative min-h-screen overflow-x-clip text-white"
        >
          <section className="relative isolate overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-24 lg:pt-52 lg:pb-32">
            <PageTopRays />

            <div className="relative z-10 container">
              <div className="grid items-end gap-12 border-b border-white/10 pb-14 sm:pb-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:gap-20">
                <div>
                  <p className="flex items-center gap-3 text-sm font-medium tracking-normal text-zinc-400">
                    <span className="h-px w-8 bg-blue-500" aria-hidden="true" />
                    {t.title.sub}
                  </p>
                  <h1 className="mt-7 max-w-4xl text-5xl leading-[1.05] font-medium tracking-normal text-balance text-white sm:text-6xl lg:text-7xl">
                    {t.title.main}
                  </h1>
                  <p className="mt-7 max-w-2xl text-base leading-7 text-pretty text-zinc-400 sm:text-lg sm:leading-8">
                    {t.introText}
                  </p>
                </div>

                <div className="flex items-center gap-3 border-l border-white/10 py-2 pl-5 text-sm leading-6 text-zinc-400">
                  <span className="relative flex size-2.5 shrink-0">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-40 motion-reduce:animate-none" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-blue-400" />
                  </span>
                  {t.supportText}
                </div>
              </div>

              <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <section className="border-b border-white/10 py-10 sm:py-12 lg:border-r lg:border-b-0 lg:pr-14">
                  <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                    <span className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-zinc-300">
                      <Mail
                        className="size-4"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </span>
                    {t.emailText}
                  </div>

                  <a
                    href="mailto:contact@sealos.io"
                    className="group mt-7 inline-flex max-w-full items-center gap-3 text-2xl leading-tight font-medium tracking-normal text-white transition duration-200 hover:text-blue-300 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-blue-400 active:translate-y-px sm:text-3xl"
                  >
                    <span className="break-all">contact@sealos.io</span>
                    <ArrowUpRight
                      className="size-5 shrink-0 text-blue-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </a>
                </section>

                <section className="py-10 sm:py-12 lg:pl-14">
                  <h2 className="text-sm font-medium text-zinc-500">
                    {t.followText}
                  </h2>

                  <div className="mt-5 grid sm:grid-cols-2 sm:gap-x-8">
                    {visibleSocialLinks.map((socialLink) => (
                      <a
                        key={socialLink.label}
                        href={socialLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-16 items-center justify-between gap-4 border-b border-white/10 text-sm font-medium text-zinc-300 transition duration-200 hover:border-white/20 hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 active:translate-y-px"
                        aria-label={`Open ${socialLink.label}`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-zinc-300 transition-colors duration-200 group-hover:bg-blue-500/15 group-hover:text-blue-300">
                            <span aria-hidden="true">{socialLink.icon}</span>
                          </span>
                          <span className="truncate">{socialLink.label}</span>
                        </span>
                        <ArrowUpRight
                          className="size-4 shrink-0 text-zinc-600 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-400"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </section>
        </main>
      </div>

      <FooterV2 lang={params.lang} />
    </>
  );
}
