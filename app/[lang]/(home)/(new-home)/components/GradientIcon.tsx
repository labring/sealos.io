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
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <rect width="20" height="20" fill={`url(#${gradientId})`} rx="10" />
      <path
        stroke="#18181b"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m14.67 6.5-6.42 6.42L5.33 10"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          x2="20"
          y1="10"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#146dff" />
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

export function GradientGitHub(
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
        d="M12.7362 18.4909V15.1576C12.8521 14.1136 12.5528 13.066 11.9029 12.2409C14.4029 12.2409 16.9029 10.5742 16.9029 7.65755C16.9695 6.61589 16.6779 5.59089 16.0695 4.74089C16.3029 3.78255 16.3029 2.78255 16.0695 1.82422C16.0695 1.82422 15.2362 1.82422 13.5695 3.07422C11.3695 2.65755 9.10286 2.65755 6.90286 3.07422C5.2362 1.82422 4.40286 1.82422 4.40286 1.82422C4.15286 2.78255 4.15286 3.78255 4.40286 4.74089C3.79609 5.58746 3.50159 6.61821 3.56953 7.65755C3.56953 10.5742 6.06953 12.2409 8.56953 12.2409C8.24453 12.6492 8.00286 13.1159 7.8612 13.6159C7.71953 14.1159 7.67786 14.6409 7.7362 15.1576M7.7362 15.1576V18.4909M7.7362 15.1576C3.97786 16.8242 3.5695 13.4909 1.90283 13.4909"
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

export function GradientCodeXml(
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
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="m18 16 4-4-4-4"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m6 8-4 4 4 4"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m14.5 4-5 16"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="2"
          y1="12"
          x2="22"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#146DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GradientLayoutGrid(
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
      viewBox="0 0 24 24"
      {...props}
    >
      <rect
        width="7"
        height="7"
        x="3"
        y="3"
        rx="1"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        width="7"
        height="7"
        x="14"
        y="3"
        rx="1"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        width="7"
        height="7"
        x="14"
        y="14"
        rx="1"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        width="7"
        height="7"
        x="3"
        y="14"
        rx="1"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="2"
          y1="12"
          x2="22"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#146DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GradientDatabaseIcon(
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
      viewBox="0 0 24 24"
      {...props}
    >
      <ellipse
        cx="12"
        cy="5"
        rx="9"
        ry="3"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 5V19A9 3 0 0 0 21 19V5"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12A9 3 0 0 0 21 12"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#146DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GradientCpu(
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
      viewBox="0 0 24 24"
      {...props}
    >
      <rect
        width="16"
        height="16"
        x="4"
        y="4"
        rx="2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        width="6"
        height="6"
        x="9"
        y="9"
        rx="1"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 2v2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 20v2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 15h2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 9h2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 15h2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 9h2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 2v2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 20v2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="2"
          y1="12"
          x2="22"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#146DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GradientBox(
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
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m3.3 7 8.7 5 8.7-5"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V12"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="3.3"
          y1="12"
          x2="20.7"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#146DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GradientBotIcon(
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
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M12 8V4H8"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        width="16"
        height="12"
        x="4"
        y="8"
        rx="2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 14h2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 14h2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 13v2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13v2"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="2"
          y1="12"
          x2="22"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#146DFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
