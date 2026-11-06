import { useId, type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.33,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function SealosMark(props: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 21.23 19.76" aria-hidden {...props}>
      <defs>
        <linearGradient
          id={`${id}a`}
          x1="0.8"
          y1="-0.11"
          x2="-0.31"
          y2="1.16"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#0aa3f9" />
          <stop offset="1" stopColor="#b5b4ff" />
        </linearGradient>
        <linearGradient
          id={`${id}b`}
          x1="1.15"
          y1="1.03"
          x2="0.47"
          y2="-0.03"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#0aa3f9" />
          <stop offset="1" stopColor="#b5b4ff" />
        </linearGradient>
      </defs>
      <path
        d="M3.814 9.167C5.182 11.166 8.016 10.981 8.016 10.981C7.313 10.297 6.851 9.668 6.795 7.891C6.740 6.114 5.741 5.633 5.741 5.633C7.562 4.492 6.906 3.245 6.851 1.862C6.817 1.007 7.327 0.364 7.723 0C3.353 0.645 0 4.409 0 8.958C0 9.279 0.034 9.580 0.067 9.893C0.235 9.444 2.551 7.319 3.816 9.167Z"
        fill={`url(#${id}a)`}
      />
      <path
        transform="translate(0.156 2.713)"
        d="M19.138 1.024C18.172 0.211 17.135 0 16.336 0C14.050 0 12.122 1.864 12.011 4.147C12.005 4.250 12.005 4.324 12.005 4.411C12.005 4.566 12.020 4.734 12.031 4.866C12.052 5.095 12.131 5.462 12.186 5.782C12.253 6.171 12.281 6.377 12.296 6.781C12.308 7.182 12.271 7.613 12.232 7.879C12.170 8.295 12.041 8.796 11.890 9.177C11.439 10.321 10.699 11.277 9.757 11.967C8.749 12.707 7.501 13.158 6.104 13.158C5.094 13.158 4.169 12.925 3.335 12.506C1.615 11.641 0.381 10.045 0 8.052C0.753 13.149 5.206 17.051 10.513 17.051C16.348 17.051 21.078 12.320 21.078 6.485C21.078 5.651 20.986 4.903 20.857 4.268C20.760 3.795 20.605 3.261 20.378 2.735C20.087 2.056 19.713 1.510 19.138 1.024Z"
        fill={`url(#${id}b)`}
      />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path d="M6 12l4-4-4-4" {...stroke} />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path d="M4 6l4 4 4-4" {...stroke} />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path d="M3.5 8h9M8.6 3.33 13.5 8l-4.9 4.67" {...stroke} />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path
        d="M12.67 7.33a5.33 5.33 0 1 1-10.67 0 5.33 5.33 0 0 1 10.67 0ZM14 14l-2.87-2.87"
        {...stroke}
      />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path
        d="M14.67 8A6.67 6.67 0 1 1 1.33 8a6.67 6.67 0 0 1 13.34 0ZM8 1.33A9.6 9.6 0 0 0 5.33 8 9.6 9.6 0 0 0 8 14.67 9.6 9.6 0 0 0 10.67 8 9.6 9.6 0 0 0 8 1.33ZM1.33 8h13.34"
        {...stroke}
      />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path d="M8 3v10M3 8h10" {...stroke} />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path d="M2.5 5h11M2.5 11h11" {...stroke} />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" {...stroke} />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path
        d="M5.5 5.5V3.83c0-.73.6-1.33 1.33-1.33h5.34c.73 0 1.33.6 1.33 1.33v5.34c0 .73-.6 1.33-1.33 1.33H10.5M3.83 5.5h5.34c.73 0 1.33.6 1.33 1.33v5.34c0 .73-.6 1.33-1.33 1.33H3.83c-.73 0-1.33-.6-1.33-1.33V6.83c0-.73.6-1.33 1.33-1.33Z"
        {...stroke}
      />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" {...stroke} />
    </svg>
  );
}

export function AppleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 20" width="16" height="18" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M13.2 3.2C14 2.3 14.3 1.2 14.2 0c-1.1.1-2.3.8-3 1.6-.7.8-1.2 1.9-1.1 3 1.2.1 2.3-.5 3.1-1.4ZM16.7 14.6c-.4 1-1 2-1.7 3-1 1.3-1.9 2.4-3.2 2.4-1.2 0-1.6-.8-3.1-.8s-2 .8-3.2.8C4.2 20 3.3 18.9 2.4 17.6.2 14.5-.7 8.8 1.6 6.3c1-1.1 2.3-1.7 3.7-1.7 1.2 0 2.3.8 3.1.8s2.2-1 3.7-.8c1.3 0 2.7.7 3.5 1.8-3.1 1.9-2.6 6.2 1.1 8.2Z"
      />
    </svg>
  );
}

export function WindowsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" width="16" height="16" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M0 2.5 7.5 1.4v7H0Zm8.5-1.2L18 0v8.4H8.5ZM0 9.5h7.5v7.1L0 15.5Zm8.5 0H18V18l-9.5-1.3Z"
      />
    </svg>
  );
}

export function LinuxIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden {...props}>
      <path
        d="M3 3.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5v-9ZM5.5 6l2 2-2 2M8.5 10.5H10.5"
        {...stroke}
      />
    </svg>
  );
}
