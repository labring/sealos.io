import React from 'react';

export const GradientCircleCheck = (
  props: React.DetailedHTMLProps<
    React.SVGAttributes<SVGSVGElement>,
    SVGSVGElement
  >,
) => {
  const gradientId = React.useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 21"
      {...props}
    >
      <path
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.33}
        d="m7.5 10.335 1.667 1.667L12.5 8.669m5.833 1.666a8.333 8.333 0 1 1-16.666 0 8.333 8.333 0 0 1 16.666 0Z"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1={1.667}
          x2={18.333}
          y1={10.335}
          y2={10.335}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#146DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
};
