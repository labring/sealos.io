import React from 'react';

export function AiAgentStar(
  props: React.DetailedHTMLProps<
    React.SVGAttributes<SVGSVGElement>,
    SVGSVGElement
  >,
) {
  const gradientId = React.useId();

  return (
    <svg
      width="7"
      height="7"
      viewBox="0 0 7 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.66858 0.0819092C4.21764 1.56572 5.38753 2.73561 6.87134 3.28467C5.38753 3.83373 4.21764 5.00362 3.66858 6.48743C3.11952 5.00362 1.94963 3.83373 0.46582 3.28467C1.94963 2.73561 3.11952 1.56572 3.66858 0.0819092Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="3.66858"
          y1="0.0819092"
          x2="3.66858"
          y2="6.48743"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#5A5A5A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
