import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType } from '@/lib/i18n';
import { siteConfig } from '@/config/site';
import Link from 'fumadocs-core/link';
import {
  GithubIcon,
  DiscordIcon,
  BilibiliIcon,
  WechatIcon,
} from '@/components/ui/icons';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';

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
  },
};

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

  return (
    <div className="h-full bg-[#EBF2FF]">
      <Header lang={params.lang} />

      <main className="custom-container px-8 pt-14 md:px-[15%]">
        <Hero
          title={t.title}
          mainTitleEmphasis={1}
          lang={params.lang}
          testimonial={false}
          videoCta={false}
        >
          <div className="mx-auto max-w-4xl">
            <p className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-gray-600 md:text-xl">
              {t.introText}
            </p>

            {/* Visual Separator with Logo */}
            <div className="mb-16 flex justify-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-200"></div>
                  <div className="rounded-full bg-white p-4 shadow-lg">
                    <img
                      src="/logo.svg"
                      alt="Sealos"
                      width={48}
                      height={48}
                      className="h-12 w-12"
                    />
                  </div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-200"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">
                    {params.lang === 'zh-cn'
                      ? '我们随时为您提供帮助'
                      : "We're here to help"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-12">
              {/* Email Section */}
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  {t.emailText}
                </h2>
                <Link
                  href="mailto:contact@sealos.io"
                  className="inline-flex items-center text-xl font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
                >
                  contact@sealos.io
                </Link>
              </div>

              {/* Social Media Section */}
              <div className="text-center">
                <h2 className="mb-8 text-2xl font-semibold text-gray-900">
                  {t.followText}
                </h2>
                <div className="flex justify-center space-x-6">
                  <Link
                    className="flex size-12 items-center justify-center rounded-full bg-[#FAFCFF] transition-colors duration-200 hover:bg-[#1118240D]"
                    href={siteConfig.links.github}
                    aria-label="GitHub"
                  >
                    <GithubIcon />
                  </Link>

                  <Link
                    className="flex size-12 items-center justify-center rounded-full bg-[#FAFCFF] transition-colors duration-200 hover:bg-[#1118240D]"
                    href={siteConfig.links.discord}
                    aria-label="Discord"
                  >
                    <DiscordIcon />
                  </Link>

                  <Link
                    className="flex size-12 items-center justify-center rounded-full bg-[#FAFCFF] transition-colors duration-200 hover:bg-[#1118240D]"
                    href={siteConfig.links.twitter}
                    aria-label="Twitter"
                  >
                    <img
                      src="/icons/twitter.svg"
                      alt="Twitter"
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                  </Link>

                  <Link
                    className="flex size-12 items-center justify-center rounded-full bg-[#FAFCFF] transition-colors duration-200 hover:bg-[#1118240D]"
                    href={siteConfig.links.youtube}
                    aria-label="YouTube"
                  >
                    <img
                      src="/icons/youtube.svg"
                      alt="YouTube"
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                  </Link>

                  {params.lang === 'zh-cn' && (
                    <>
                      <Link
                        className="flex size-12 items-center justify-center rounded-full bg-[#FAFCFF] transition-colors duration-200 hover:bg-[#1118240D]"
                        href={siteConfig.links.bilibili}
                        aria-label="Bilibili"
                      >
                        <BilibiliIcon />
                      </Link>

                      <Link
                        className="flex size-12 items-center justify-center rounded-full bg-[#FAFCFF] transition-colors duration-200 hover:bg-[#1118240D]"
                        href={siteConfig.links.wechat}
                        aria-label="WeChat"
                      >
                        <WechatIcon />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Hero>
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer lang={params.lang} />
    </div>
  );
}
