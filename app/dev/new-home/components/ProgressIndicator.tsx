import React from 'react';

export function ProgressIndicator(
  props: React.DetailedHTMLProps<
    React.SVGAttributes<SVGSVGElement>,
    SVGSVGElement
  >,
) {
  const gradientId = React.useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 25 77"
      {...props}
    >
      <path
        fill={`url(#${gradientId})`}
        d="M21.224 0c3.099 0 4.163 4.127 1.451 5.626l-8.724 4.821c-.3.166-.622.276-.95.331V75.25a1 1 0 0 1-2 0V10.42L2.325 5.626C-.387 4.126.678 0 3.776 0z"
      ></path>
      <defs>
        <linearGradient
          id={gradientId}
          x1="0.772"
          x2="24.228"
          y1="38.125"
          y2="38.125"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff"></stop>
          <stop offset="1" stopColor="#146DFF"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}
