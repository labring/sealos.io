import { ArrowRight } from 'lucide-react';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { appDomain } from '@/config/site';
import Image from 'next/image';

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.7889 3.48313C12.234 2.25042 13.9773 2.25041 14.4224 3.48312L16.4035 8.9696L21.8601 10.966C23.0853 11.4144 23.0853 13.1473 21.8601 13.5956L16.4035 15.592L14.4224 21.0785C13.9773 22.3112 12.234 22.3112 11.7889 21.0785L9.8078 15.592L4.35124 13.5956C3.12597 13.1473 3.12597 11.4144 4.35124 10.966L9.8078 8.9696L11.7889 3.48313ZM13.1057 5.72527L11.5938 9.91229C11.4531 10.3019 11.1471 10.6092 10.7581 10.7516L6.57849 12.2808L10.7581 13.81C11.1471 13.9524 11.4531 14.2597 11.5938 14.6493L13.1057 18.8363L14.6175 14.6493C14.7582 14.2597 15.0642 13.9524 15.4533 13.81L19.6328 12.2808L15.4533 10.7516C15.0642 10.6092 14.7582 10.3019 14.6175 9.91229L13.1057 5.72527Z"
      fill="url(#paint0_linear_319_31)"
    />
    <path
      d="M4.19276 2.94774C4.32162 2.59949 4.81418 2.59949 4.94304 2.94774L5.34435 4.03227C5.38487 4.14175 5.47119 4.22808 5.58068 4.26859L6.66521 4.6699C7.01345 4.79877 7.01345 5.29132 6.66521 5.42019L5.58068 5.8215C5.47119 5.86201 5.38487 5.94834 5.34435 6.05782L4.94304 7.14235C4.81418 7.4906 4.32162 7.4906 4.19276 7.14235L3.79145 6.05782C3.75094 5.94834 3.66461 5.86201 3.55512 5.8215L2.4706 5.42019C2.12235 5.29132 2.12235 4.79877 2.4706 4.6699L3.55512 4.26859C3.66461 4.22808 3.75094 4.14176 3.79145 4.03227L4.19276 2.94774Z"
      fill="url(#paint1_linear_319_31)"
    />
    <path
      d="M4.19276 17.1586C4.32162 16.8103 4.81418 16.8103 4.94304 17.1586L5.34435 18.2431C5.38487 18.3526 5.47119 18.4389 5.58068 18.4794L6.66521 18.8808C7.01345 19.0096 7.01345 19.5022 6.66521 19.631L5.58068 20.0324C5.47119 20.0729 5.38487 20.1592 5.34435 20.2687L4.94304 21.3532C4.81418 21.7015 4.32162 21.7015 4.19276 21.3532L3.79145 20.2687C3.75094 20.1592 3.66461 20.0729 3.55512 20.0324L2.4706 19.631C2.12235 19.5022 2.12235 19.0096 2.4706 18.8808L3.55512 18.4794C3.66461 18.4389 3.75094 18.3526 3.79145 18.2431L4.19276 17.1586Z"
      fill="url(#paint2_linear_319_31)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_319_31"
        x1="12.4942"
        y1="2.55859"
        x2="12.4942"
        y2="22.003"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A1D3F6" />
        <stop offset="1" stopColor="#52A7E3" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_319_31"
        x1="12.4942"
        y1="2.55859"
        x2="12.4942"
        y2="22.003"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A1D3F6" />
        <stop offset="1" stopColor="#52A7E3" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_319_31"
        x1="12.4942"
        y1="2.55859"
        x2="12.4942"
        y2="22.003"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A1D3F6" />
        <stop offset="1" stopColor="#52A7E3" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Example() {
  return (
    <div className="mt-[140px]">
      <AnimateElement type="slideUp">
        <div
          className="mt-[100px] flex w-full flex-col justify-between overflow-hidden rounded-[20px] md:flex-row"
          style={{
            background: 'linear-gradient(90deg, #D6EEFF 0%, #E1F3FF 100%)',
          }}
        >
          <AnimateElement type="slideUp">
            <div className="flex size-full flex-col justify-center gap-16 px-4 py-16 sm:px-[72px] md:pr-0">
              <div className="text-base font-bold leading-normal  text-black sm:text-[28px]">
                Develop faster and deploy smarter with DevBox
              </div>
              <a href={`${appDomain}/?openapp=system-devbox`} target="_blank">
                <div className="flex w-fit cursor-pointer items-center justify-center gap-[6px] rounded-md bg-[#FAFCFF] py-2 pl-5 pr-4 font-medium text-custom-primary-text shadow-button hover:bg-[#F1F5FB]">
                  Try DevBox today!
                  <ArrowRight className="relative h-4 w-4" />
                </div>
              </a>
            </div>
          </AnimateElement>
          <Image
            src="/images/quick-start.png"
            alt="Quick Start"
            className="ml-auto block h-[312px] w-[478px] object-cover"
            width={4000}
            height={2590}
          />
        </div>
      </AnimateElement>
    </div>
  );
}
