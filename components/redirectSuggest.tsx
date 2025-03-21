'use client';

import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Info = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0,0,62,62" fill="none">
    <g clipPath="url(#a)">
      <path
        fill="#F7B500"
        d="M59.557 43.048c-1.63 3.768-3.846 7.054-6.653 9.86-2.808 2.804-6.09 5.017-9.844 6.648C39.307 61.186 35.287 62 31.002 62c-4.29 0-8.305-.814-12.06-2.441-3.753-1.63-7.032-3.843-9.84-6.649-2.807-2.805-5.025-6.091-6.655-9.859C.813 39.281 0 35.257 0 30.973s.813-8.298 2.447-12.047c1.633-3.751 3.848-7.031 6.656-9.833 2.804-2.802 6.086-5.018 9.84-6.649C22.696.814 26.716 0 31.002 0c4.285 0 8.302.814 12.055 2.444 3.754 1.63 7.036 3.847 9.843 6.649 2.805 2.805 5.023 6.085 6.653 9.833C61.187 22.675 62 26.693 62 30.973c.003 4.28-.813 8.305-2.443 12.075ZM31.002 10.973a3.508 3.508 0 1 0 0 7.016 3.508 3.508 0 1 0 0-7.016Zm3.51 14.577a3.508 3.508 0 0 0-3.51-3.508c-1.94 0-3.51 1.57-3.51 3.508v21.969c0 1.94 1.57 3.508 3.51 3.508 1.94 0 3.51-1.568 3.51-3.508v-21.97Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 62h62V0H0z" />
      </clipPath>
    </defs>
  </svg>
);

const ipDetectURL = 'https://qifu-api.baidubce.com/ip/local/geo/v1/district';

const easeFromBottom = `@keyframes easeFromBottom {
  0% {
    opacity: 0.3;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}`;

export default function RedirectSuggest() {
  const [open, setOpen] = useState(false);

  const checkIpInChina = useCallback(async () => {
    try {
      sessionStorage.setItem('RedirectHadShow', 'true');
      const res = await fetch(ipDetectURL)
        .then((res) => res.json())
        .then((res) => res.data);
      const country = res?.country;
      if (
        country &&
        country === '中国' &&
        res.prov !== '中国香港' &&
        res.prov !== '中国澳门' &&
        res.prov !== '中国台湾'
      ) {
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [setOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sessionStorage.getItem('RedirectHadShow') !== 'true') {
        checkIpInChina();
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [checkIpInChina]);

  if (open) {
    return (
      <>
        <style>{easeFromBottom}</style>
        <div className="fixed bottom-6 z-50 grid animate-[easeFromBottom_0.4s_ease-in-out] grid-cols-[56px_1fr] rounded-xl bg-white p-6 shadow-[0px_4px_4px_0px_#00000040] max-md:mx-4 md:right-6">
          <Info />
          <div>
            <h3 className="my-1 text-md font-medium md:text-lg xl:text-[23px]">
              访问版本提醒
            </h3>
            <div className="relative max-xl:text-sm md:w-60 xl:w-[400px]">
              <p className="leading-[180%] text-[#93919A] ">
              检测到您是中国大陆IP，推荐您使用 Sealos 中国大陆版（人民币计费）以享受本地化价格与服务。
              </p>
              <a
                className="absolute bottom-0 right-0 text-[#52AEFF] "
                href="https://sealos.run/"
              >
                立即前往&gt;&gt;
              </a>
            </div>
          </div>
          <div
            className="absolute right-[31px] top-[23px] cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <X color="#A7ADB8" />
          </div>
        </div>
      </>
    );
  } else return <></>;
}
