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

export function GradientBot(
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
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.33"
        d="M10 6.667V3.334H6.667m-5 8.333h1.666m13.334 0h1.666m-5.833-.833V12.5m-5-1.666V12.5M5 6.667h10c.92 0 1.667.746 1.667 1.667V15c0 .92-.747 1.667-1.667 1.667H5c-.92 0-1.667-.746-1.667-1.667V8.334c0-.921.747-1.667 1.667-1.667"
      ></path>
      <defs>
        <linearGradient
          id={gradientId}
          x1="1.667"
          x2="18.333"
          y1="10"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff"></stop>
          <stop offset="1" stopColor="#146DFF"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GradientAppWindowMac(
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
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        d="M4.99999 6.66683H5.00832M8.33332 6.66683H8.34166M11.6667 6.66683H11.675M3.33332 3.3335H16.6667C17.5871 3.3335 18.3333 4.07969 18.3333 5.00016V15.0002C18.3333 15.9206 17.5871 16.6668 16.6667 16.6668H3.33332C2.41285 16.6668 1.66666 15.9206 1.66666 15.0002V5.00016C1.66666 4.07969 2.41285 3.3335 3.33332 3.3335Z"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="1.66666"
          y1="10.0002"
          x2="18.3333"
          y2="10.0002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#146DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GradientRocket(
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
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        d="M10 12.5L7.50001 10M10 12.5C11.164 12.0573 12.2807 11.499 13.3333 10.8334M10 12.5V16.6667C10 16.6667 12.525 16.2084 13.3333 15C14.2333 13.65 13.3333 10.8334 13.3333 10.8334M7.50001 10C7.94346 8.84957 8.50185 7.74676 9.16668 6.70838C10.1377 5.15587 11.4897 3.87758 13.0942 2.99512C14.6987 2.11266 16.5022 1.65535 18.3333 1.66671C18.3333 3.93338 17.6833 7.91671 13.3333 10.8334M7.50001 10L3.33334 10.0001C3.33334 10.0001 3.79168 7.47506 5.00001 6.66672C6.35001 5.76672 9.16668 6.66672 9.16668 6.66672M3.75001 13.7501C2.50001 14.8001 2.08334 17.9168 2.08334 17.9168C2.08334 17.9168 5.20001 17.5001 6.25001 16.2501C6.84168 15.5501 6.83334 14.4751 6.17501 13.8251C5.8511 13.5159 5.42442 13.3373 4.97687 13.3235C4.52931 13.3096 4.09241 13.4616 3.75001 13.7501Z"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="2.08334"
          y1="9.79164"
          x2="18.3333"
          y2="9.79164"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#146DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GradientDatabase(
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
      viewBox="0 0 20 21"
      {...props}
    >
      <path
        d="M17.5 5.13135C17.5 6.51206 14.1421 7.63135 10 7.63135C5.85786 7.63135 2.5 6.51206 2.5 5.13135M17.5 5.13135C17.5 3.75064 14.1421 2.63135 10 2.63135C5.85786 2.63135 2.5 3.75064 2.5 5.13135M17.5 5.13135V16.798C17.5 17.4611 16.7098 18.0969 15.3033 18.5658C13.8968 19.0346 11.9891 19.298 10 19.298C8.01088 19.298 6.10322 19.0346 4.6967 18.5658C3.29018 18.0969 2.5 17.4611 2.5 16.798V5.13135M2.5 10.9647C2.5 11.6277 3.29018 12.2636 4.6967 12.7324C6.10322 13.2013 8.01088 13.4647 10 13.4647C11.9891 13.4647 13.8968 13.2013 15.3033 12.7324C16.7098 12.2636 17.5 11.6277 17.5 10.9647"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="2.5"
          y1="10.9647"
          x2="17.5"
          y2="10.9647"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#146DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
