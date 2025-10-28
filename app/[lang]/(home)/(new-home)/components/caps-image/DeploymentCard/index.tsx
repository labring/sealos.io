'use client';
import Image from 'next/image';
import DeploymentImage from './assets/image.svg';

export function DeploymentCard() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* 原始 SVG 图片 */}
      <Image src={DeploymentImage} alt="Deployment" className="h-full w-auto" />

      {/* 动画渐变层 */}
      <svg
        className="absolute inset-0 h-full w-full"
        width="514"
        height="210"
        viewBox="0 0 514 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: 'none' }}
      >
        <style jsx>
          {`
            @keyframes pathGlow {
              0% {
                clip-path: inset(0 100% 0 0);
                opacity: 1;
              }
              25% {
                clip-path: inset(0 0 0 0);
                opacity: 1;
              }
              37.5% {
                clip-path: inset(0 0 0 0);
                opacity: 0;
              }
              50%,
              100% {
                clip-path: inset(0 100% 0 0);
                opacity: 0;
              }
            }

            @keyframes rectGlow {
              0%,
              50% {
                clip-path: inset(0 100% 0 0);
                opacity: 1;
              }
              75% {
                clip-path: inset(0 0 0 0);
                opacity: 1;
              }
              87.5% {
                clip-path: inset(0 0 0 0);
                opacity: 0;
              }
              100% {
                clip-path: inset(0 100% 0 0);
                opacity: 0;
              }
            }
          `}
        </style>

        {/* 左侧曲线 - 灰色底层（始终显示） */}
        <path
          d="M253 28.499C270.16 28.499 285.64 38.8089 292.254 54.6426L303.668 81.9668C309.323 95.5053 322.179 104.556 336.692 105.429C337.457 105.384 338.227 105.36 339 105.36V106.499C338.666 106.499 338.333 106.493 338 106.484V107H332.048C319.501 109.326 308.76 117.852 303.777 129.936L292.136 158.166C285.599 174.017 270.146 184.36 253 184.36V183.36C269.741 183.36 284.829 173.261 291.211 157.784L302.853 129.555C307.418 118.483 316.695 110.321 327.795 107H217V106H331.955C332.083 105.977 332.211 105.953 332.339 105.931C319.243 103.681 307.984 94.8922 302.745 82.3516L291.331 55.0273C284.872 39.5661 269.756 29.499 253 29.499V28.499Z"
          fill="#6B7280"
        />

        {/* 左侧曲线 - 蓝白渐变动画层 */}
        <path
          d="M253 28.499C270.16 28.499 285.64 38.8089 292.254 54.6426L303.668 81.9668C309.323 95.5053 322.179 104.556 336.692 105.429C337.457 105.384 338.227 105.36 339 105.36V106.499C338.666 106.499 338.333 106.493 338 106.484V107H332.048C319.501 109.326 308.76 117.852 303.777 129.936L292.136 158.166C285.599 174.017 270.146 184.36 253 184.36V183.36C269.741 183.36 284.829 173.261 291.211 157.784L302.853 129.555C307.418 118.483 316.695 110.321 327.795 107H217V106H331.955C332.083 105.977 332.211 105.953 332.339 105.931C319.243 103.681 307.984 94.8922 302.745 82.3516L291.331 55.0273C284.872 39.5661 269.756 29.499 253 29.499V28.499Z"
          fill="url(#pathGradient)"
          style={{ animation: 'pathGlow 6s linear infinite' }}
        />

        {/* 右侧矩形边框 - 灰色底层（始终显示） */}
        <rect
          x="339.5"
          y="78.5"
          width="174"
          height="53"
          rx="26.5"
          fill="none"
          stroke="#6B7280"
          strokeWidth="1"
        />

        {/* 右侧矩形边框 - 蓝白渐变动画层 */}
        <rect
          x="339.5"
          y="78.5"
          width="174"
          height="53"
          rx="26.5"
          fill="none"
          stroke="url(#rectGradient)"
          strokeWidth="1"
          style={{ animation: 'rectGlow 6s linear infinite' }}
        />

        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#146DFF" />
            <stop offset="50%" stopColor="white" />
            <stop offset="100%" stopColor="#146DFF" />
          </linearGradient>
          <linearGradient id="rectGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#146DFF" />
            <stop offset="50%" stopColor="white" />
            <stop offset="100%" stopColor="#146DFF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
