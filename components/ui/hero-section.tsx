'use client';

import { Code, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  lang?: string;
}

export default function HeroSection({ lang = 'en' }: HeroSectionProps) {
  const translations = {
    en: {
      badge: '100% source available',
      title: 'Built for the',
      titleHighlight: 'Modern Application.',
      description:
        "Whether you're building next-gen AI agents or battle-tested web apps, our unified platform is designed to amplify your workflow.",
      viewSourceCode: 'View Source Code',
      getStarted: 'Get Started Free',
    },
    'zh-cn': {
      badge: '100% 开源可用',
      title: '为',
      titleHighlight: '现代应用而生。',
      description:
        '无论您是在构建下一代AI代理还是经过实战考验的Web应用，我们的统一平台都旨在增强您的工作流程。',
      viewSourceCode: '查看源代码',
      getStarted: '免费开始',
    },
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Main content */}
      <div className="relative z-10 w-full" style={{ height: '184px' }}>
        <div className="flex items-start justify-between">
          {/* Left side - Main content */}
          <div className="max-w-2xl flex-1">
            {/* Badge */}
            <div className="mb-6">
              <div
                className="inline-flex"
                style={{
                  display: 'flex',
                  width: '221.4724578857422px',
                  height: '40.314971923828125px',
                  paddingTop: '10.16px',
                  paddingRight: '15.24px',
                  paddingBottom: '10.16px',
                  paddingLeft: '15.24px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '9999px', // border radius/full
                  border: '1px solid #FFFFFF0D',
                  background: '#FFFFFF0D',
                  boxShadow:
                    '0px 2px 4px -1px #00000005, 0px 4px 6px -1px #0000000D',
                  backdropFilter: 'blur(4px)',
                  opacity: 1,
                }}
              >
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 21 21"
                  fill="none"
                  style={{
                    flex: '0 0 auto',
                    aspectRatio: '1/1',
                  }}
                >
                  <path
                    d="M12.7362 18.4909V15.1576C12.8521 14.1136 12.5528 13.066 11.9029 12.2409C14.4029 12.2409 16.9029 10.5742 16.9029 7.65755C16.9695 6.61589 16.6779 5.59089 16.0695 4.74089C16.3029 3.78255 16.3029 2.78255 16.0695 1.82422C16.0695 1.82422 15.2362 1.82422 13.5695 3.07422C11.3695 2.65755 9.10286 2.65755 6.90286 3.07422C5.2362 1.82422 4.40286 1.82422 4.40286 1.82422C4.15286 2.78255 4.15286 3.78255 4.40286 4.74089C3.79609 5.58746 3.50159 6.61821 3.56953 7.65755C3.56953 10.5742 6.06953 12.2409 8.56953 12.2409C8.24453 12.6492 8.00286 13.1159 7.8612 13.6159C7.71953 14.1159 7.67786 14.6409 7.7362 15.1576M7.7362 15.1576V18.4909M7.7362 15.1576C3.97786 16.8242 3.5695 13.4909 1.90283 13.4909"
                    stroke="url(#paint0_linear_565_20099)"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_565_20099"
                      x1="1.90283"
                      y1="10.1576"
                      x2="16.9122"
                      y2="10.1576"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#146DFF" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Text */}
                <span
                  style={{
                    color: 'var(--tailwind-colors-base-white, #FFF)',
                    fontFamily:
                      'var(--typography-font-family-font-sans, Geist)',
                    fontSize:
                      'var(--typography-base-sizes-base-font-size, 16px)',
                    fontStyle: 'normal',
                    fontWeight: 'var(--font-weight-medium, 500)',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    opacity: 1,
                    whiteSpace: 'nowrap', // 确保文字不换行
                  }}
                >
                  {t.badge}
                </span>
              </div>
            </div>

            {/* Main heading - 根据设计稿样式 */}
            <div className="mb-8">
              {/* 仅左侧标题与描述，不包含按钮 */}
              <h1
                className="mb-4 whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: '500', // medium
                  fontSize: '40px',
                  lineHeight: '150%',
                  letterSpacing: '0%',
                }}
              >
                <span style={{ color: '#FFFFFF' }}>{t.title}</span>{' '}
                <span
                  style={{
                    background:
                      'linear-gradient(90deg, #FFFFFF 0%, #146DFF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t.titleHighlight}
                </span>
              </h1>

              <p
                className="leading-relaxed"
                style={{
                  color: 'var(--tailwind-colors-zinc-400, #A1A1AA)',
                  fontFamily: 'var(--typography-font-family-font-sans, Geist) ',
                  fontSize: 'var(--typography-base-sizes-base-font-size, 16px)',
                  fontStyle: 'normal',
                  fontWeight: 'var(--font-weight-normal, 400)',
                  lineHeight:
                    'var(--typography-base-sizes-base-line-height, 24px)',
                  width: '491.924px',
                }}
              >
                {t.description}
              </p>
            </div>
          </div>

          {/* Right side - Action buttons 仅下移与标题同一水平线 */}
          <div
            className="ml-8"
            style={{
              display: 'flex',
              width: '305px',
              height: '40px',
              gap: '12px',
              alignItems: 'center',
              opacity: 1,
              marginTop: '72.32px', // 徽标高度(≈40.31) + 与标题间距(≈32)
            }}
          >
            {/* View Source Code */}
            <a
              href="https://github.com/labring/sealos"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                width: '176px',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '9999px',
                border: '1px solid #FFFFFF1A',
                paddingTop: '8px',
                paddingRight: '4px',
                paddingBottom: '8px',
                paddingLeft: '4px',
                background: '#FFFFFF1A',
                boxShadow: '0px 4px 6px -2px #00000005',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M11.9999 10.8242L14.6666 8.15755L11.9999 5.49089M3.99992 5.49089L1.33325 8.15755L3.99992 10.8242M9.66659 2.82422L6.33325 13.4909"
                  stroke="#E4E4E7"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  color: 'var(--tailwind-colors-base-white, #FFF)',
                  fontFamily: 'var(--typography-font-family-font-sans, Geist)',
                  fontSize:
                    'var(--typography-base-sizes-small-font-size, 14px)',
                  fontStyle: 'normal',
                  fontWeight: 'var(--font-weight-medium, 500)',
                  lineHeight:
                    'var(--typography-base-sizes-small-line-height, 20px)',
                  width: '120px',
                  height: '20px',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.viewSourceCode}
              </span>
            </a>

            <a
              href="https://cloud.sealos.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                width: '117px',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '54px',
                border: '1px solid #FFFFFF',
                paddingTop: '8px',
                paddingRight: '4px',
                paddingBottom: '8px',
                paddingLeft: '4px',
                background:
                  'linear-gradient(191.74deg, #FFFFFF 8.86%, #CECECE 91.87%)',
                boxShadow:
                  '0px 4px 6px -2px #FFFFFF0D, 0px 10px 15px -3px #FFFFFF29',
              }}
            >
              <span
                style={{
                  color: 'var(--tailwind-colors-zinc-900, #18181B)',
                  fontFamily: 'var(--typography-font-family-font-sans, Geist)',
                  fontSize:
                    'var(--typography-base-sizes-small-font-size, 14px)',
                  fontStyle: 'normal',
                  fontWeight: 'var(--font-weight-medium, 500)',
                  lineHeight:
                    'var(--typography-base-sizes-small-line-height, 20px)',
                  width: '85px',
                  height: '20px',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.getStarted}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
