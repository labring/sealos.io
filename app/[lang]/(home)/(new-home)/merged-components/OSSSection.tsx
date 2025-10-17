'use client';

interface OSSSectionProps {
  lang?: string;
}

export default function OSSSection({ lang = 'en' }: OSSSectionProps) {
  const translations = {
    en: {
      badge: '100% source available',
      title: 'Built for the',
      titleHighlight: 'Modern Application.',
      description:
        "Whether you're building next-gen AI agents or battle-tested web apps, our unified platform is designed to amplify your workflow.",
      viewSourceCode: 'View Source Code',
      startForFree: 'Start for free',
    },
    'zh-cn': {
      badge: '100% 开源可用',
      title: '为',
      titleHighlight: '现代应用而生。',
      description:
        '无论您是在构建下一代AI代理还是经过实战考验的Web应用，我们的统一平台都旨在增强您的工作流程。',
      viewSourceCode: '查看源代码',
      startForFree: '免费开始',
    },
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <div className="relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 h-auto w-full lg:h-[184px]">
        <div className="flex flex-col items-start justify-between lg:flex-row">
          {/* Left side - Main content */}
          <div className="max-w-2xl flex-1">
            {/* Badge */}
            <div className="mb-6">
              <div className="inline-flex h-10 w-[221px] items-center justify-center gap-1 rounded-full border border-white/5 bg-white/5 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 21 21"
                  fill="none"
                  className="aspect-square shrink-0"
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
                <span className="text-base leading-none font-medium whitespace-nowrap text-white">
                  {t.badge}
                </span>
              </div>
            </div>

            {/* Main heading - 根据设计稿样式 */}
            <div className="mb-8">
              {/* 仅左侧标题与描述，不包含按钮 */}
              <h1 className="mb-4 text-[40px] leading-[150%] font-medium lg:whitespace-nowrap">
                <span className="text-white">{t.title}</span>{' '}
                <span className="bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">
                  {t.titleHighlight}
                </span>
              </h1>

              <p className="w-full text-base leading-6 font-normal text-zinc-400 lg:w-[492px]">
                {t.description}
              </p>
            </div>
          </div>

          {/* Right side - Action buttons 仅下移与标题同一水平线 */}
          <div className="mt-6 ml-0 flex h-10 w-full items-start gap-3 lg:mt-[72px] lg:ml-8 lg:w-[305px] lg:items-center">
            {/* View Source Code */}
            <a
              href="https://github.com/labring/sealos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-44 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-1 py-2 shadow-sm"
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
              <span className="h-5 w-[120px] text-sm leading-5 font-medium whitespace-nowrap text-white">
                {t.viewSourceCode}
              </span>
            </a>

            {/* Start for free */}
            <a
              href="https://cloud.sealos.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-[117px] items-center justify-center gap-2 rounded-[54px] border border-white bg-gradient-to-br from-white to-gray-300 px-1 py-2 shadow-lg"
            >
              <span className="h-5 w-[85px] text-sm leading-5 font-medium whitespace-nowrap text-zinc-900">
                {t.startForFree}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
