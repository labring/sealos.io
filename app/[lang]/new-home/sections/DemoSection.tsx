import React from 'react';
import { FeatureStepper } from '../components/FeatureStepper';

export function DemoSection() {
  const filterId = React.useId();
  const gradientId = React.useId();

  return (
    <section className="relative mt-28">
      {/* Light */}
      <div className="absolute top-0 -z-10 -mt-36 w-full">
        <svg
          fill="none"
          viewBox="0 0 1263 532"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter={`url(#${filterId})`}>
            <path
              d="M632.021 150L1112.43 381.267H150L632.021 150Z"
              fill={`url(#${gradientId})`}
              fillOpacity=".3"
            />
          </g>
          <defs>
            <filter
              id={filterId}
              x="0"
              y="0"
              width="1262.4"
              height="531.27"
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                result="effect1_foregroundBlur_528_2962"
                stdDeviation="75"
              />
            </filter>
            <radialGradient
              id={gradientId}
              cx="0"
              cy="0"
              r="1"
              gradientTransform="translate(631.21 265.63) scale(481.21 115.63)"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" offset="0" />
              <stop stopColor="#0C0C0C" offset="1" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Stepper */}
      <FeatureStepper />

      {/* Demo */}
      <div className="perspective-midrange perspective-origin-center">
        <div className="bg-background mt-12 aspect-video origin-[top_center] transform-[rotate3d(1,0,0,8deg)] rounded-4xl border-4">
          Video here
        </div>
      </div>
    </section>
  );
}
