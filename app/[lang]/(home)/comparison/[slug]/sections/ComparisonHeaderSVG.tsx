import { useId } from 'react';
import { ComparisonConfig } from '../../config/platforms';

interface ComparisonHeaderSVGProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function ComparisonHeaderSVG({
  firstPlatform,
  secondPlatform,
}: ComparisonHeaderSVGProps) {
  const baseId = useId();
  const ids = {
    clipPath: `${baseId}-clip`,
    gradientB: `${baseId}-gradient-b`,
    gradientC: `${baseId}-gradient-c`,
    gradientD: `${baseId}-gradient-d`,
    gradientE: `${baseId}-gradient-e`,
    gradientG: `${baseId}-gradient-g`,
    gradientH: `${baseId}-gradient-h`,
    gradientJ: `${baseId}-gradient-j`,
    gradientK: `${baseId}-gradient-k`,
    filterF: `${baseId}-filter-f`,
    filterI: `${baseId}-filter-i`,
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 541 190"
        className="w-full h-48"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient
            id={ids.gradientB}
            x1=".5"
            x2="540.5"
            y1="43.5"
            y2="43.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".42" stopColor="#fff" stopOpacity=".2" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={ids.gradientC}
            x1="0"
            x2="540"
            y1="142.5"
            y2="142.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".42" stopColor="#fff" stopOpacity=".2" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={ids.gradientD}
            x1="403.5"
            x2="403.5"
            y1="0"
            y2="188"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".42" stopColor="#fff" stopOpacity=".2" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={ids.gradientE}
            x1="134.5"
            x2="134.5"
            y1="2"
            y2="190"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".42" stopColor="#fff" stopOpacity=".2" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={ids.gradientG}
            x1="185"
            x2="185"
            y1="42"
            y2="142"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#292929" />
            <stop offset="1" stopColor="#191919" />
          </linearGradient>
          <linearGradient
            id={ids.gradientH}
            x1="185"
            x2="185"
            y1="42"
            y2="142"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6C6C6C" />
            <stop offset="1" stopColor="#1B1B1B" />
          </linearGradient>
          <linearGradient
            id={ids.gradientJ}
            x1="355"
            x2="355"
            y1="42"
            y2="142"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#292929" />
            <stop offset="1" stopColor="#191919" />
          </linearGradient>
          <linearGradient
            id={ids.gradientK}
            x1="355"
            x2="355"
            y1="42"
            y2="142"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6C6C6C" />
            <stop offset="1" stopColor="#1B1B1B" />
          </linearGradient>
          <filter
            id={ids.filterF}
            width="138"
            height="138"
            x="116"
            y="23"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="4"
              result="effect1_dropShadow_2154_8916"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
            <feBlend
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2154_8916"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_2154_8916"
              result="shape"
            />
          </filter>
          <filter
            id={ids.filterI}
            width="138"
            height="138"
            x="286"
            y="23"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="4"
              result="effect1_dropShadow_2154_8916"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
            <feBlend
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2154_8916"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_2154_8916"
              result="shape"
            />
          </filter>
          <clipPath id={ids.clipPath}>
            <path fill="#fff" d="M-449.25-216h1440v6799h-1440z" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${ids.clipPath})`}>
          <path stroke={`url(#${ids.gradientB})`} d="M.5 42.5h540" />
          <path stroke={`url(#${ids.gradientC})`} d="M0 141.5h540" />
          <path stroke={`url(#${ids.gradientD})`} d="M404.5 0v188" />
          <path stroke={`url(#${ids.gradientE})`} d="M135.5 2v188" />
          <g filter={`url(#${ids.filterF})`}>
            <rect
              width="100"
              height="100"
              x="135"
              y="42"
              fill={`url(#${ids.gradientG})`}
              rx="20"
            />
            <rect
              width="99.21"
              height="99.21"
              x="135.39"
              y="42.39"
              stroke={`url(#${ids.gradientH})`}
              strokeWidth=".79"
              rx="19.61"
            />
            {/* Icon A */}
            <foreignObject
              x="135"
              y="42"
              width="100"
              height="100"
              xmlns="http://www.w3.org/1999/xhtml"
            >
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex size-16 items-center justify-center">
                  {firstPlatform.icon}
                </div>
              </div>
            </foreignObject>
          </g>
          <path
            fill="#FAFAFA"
            d="m260.52 99-5.12-14.2h2.3l4.18 11.8 4.18-11.8h2.3L263.22 99h-2.7Zm14.37.32c-1.14 0-2.12-.2-2.96-.62a4.92 4.92 0 0 1-1.96-1.72 5.4 5.4 0 0 1-.84-2.56l2.22-.14c.09.67.28 1.23.58 1.7.29.45.68.8 1.18 1.04.5.23 1.11.34 1.82.34.61 0 1.13-.07 1.56-.22.44-.16.77-.4 1-.7.22-.3.34-.68.34-1.12 0-.4-.1-.75-.3-1.06-.19-.32-.56-.6-1.1-.86a11.5 11.5 0 0 0-2.36-.78 13.92 13.92 0 0 1-2.72-.92 3.48 3.48 0 0 1-1.48-1.24c-.3-.5-.44-1.13-.44-1.86 0-.81.19-1.53.58-2.14.4-.63.96-1.11 1.7-1.46a6.13 6.13 0 0 1 2.64-.52c1.08 0 2 .2 2.76.6.77.4 1.38.95 1.82 1.64.45.7.73 1.49.84 2.38l-2.22.12a3.37 3.37 0 0 0-.5-1.44 2.65 2.65 0 0 0-1.08-.98 3.54 3.54 0 0 0-1.66-.36c-.83 0-1.48.2-1.96.58-.47.37-.7.87-.7 1.5 0 .4.09.74.28 1.02.2.27.54.5 1.04.7.5.2 1.22.41 2.14.64 1.22.28 2.2.63 2.92 1.04.73.4 1.25.87 1.56 1.42.3.55.46 1.17.46 1.86 0 .84-.22 1.57-.66 2.2a4.11 4.11 0 0 1-1.8 1.42c-.78.33-1.68.5-2.7.5Zm6.7-.32v-2.52h2.57V99h-2.58Z"
          />
          <g filter={`url(#${ids.filterI})`}>
            <rect
              width="100"
              height="100"
              x="305"
              y="42"
              fill={`url(#${ids.gradientJ})`}
              rx="20"
            />
            <rect
              width="99.21"
              height="99.21"
              x="305.39"
              y="42.39"
              stroke={`url(#${ids.gradientK})`}
              strokeWidth=".79"
              rx="19.61"
            />
            {/* Icon B */}
            <foreignObject
              x="305"
              y="42"
              width="100"
              height="100"
              xmlns="http://www.w3.org/1999/xhtml"
            >
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex size-16 items-center justify-center">
                  {secondPlatform.icon}
                </div>
              </div>
            </foreignObject>
          </g>
        </g>
      </svg>
    </div>
  );
}

