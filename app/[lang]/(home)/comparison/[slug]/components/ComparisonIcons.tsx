import React from 'react';

export const CircleX = (
  props: React.DetailedHTMLProps<
    React.SVGAttributes<SVGSVGElement>,
    SVGSVGElement
  >,
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <rect
        width="20"
        height="20"
        rx="10"
        style={{ fill: 'hsl(var(--muted-foreground))' }}
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m6.5 6.5 7 7m0-7-7 7"
        style={{ stroke: 'hsl(var(--primary-foreground))' }}
      />
    </svg>
  );
};

export const TriangleAlert = (
  props: React.DetailedHTMLProps<
    React.SVGAttributes<SVGSVGElement>,
    SVGSVGElement
  >,
) => {
  return (
    <svg
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.32927 0.940583C9.09007 -0.313531 10.9099 -0.313526 11.6707 0.940588L19.7136 14.1984C20.5036 15.5007 19.566 17.1661 18.0428 17.1661H1.95718C0.43399 17.1661 -0.503586 15.5007 0.286442 14.1984L8.32927 0.940583Z"
        style={{ fill: 'hsl(var(--muted-foreground))' }}
      />
      <path
        d="M10 5.48584V10.1665M10 13.1035H10.0058"
        style={{ stroke: 'hsl(var(--primary-foreground))' }}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
