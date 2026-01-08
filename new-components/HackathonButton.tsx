'use client';

import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import React, { useId } from 'react';
import { motion, type SVGMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

const ParticlesImage = (
  props: SVGMotionProps<SVGSVGElement> & { id?: string },
) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 146 36"
    {...props}
  >
    <path
      fill="#fff"
      fillOpacity={0.5}
      d="M154.2-6.5q-.1 0-.2.2l.1.2.1-.2zm-1 5.5-.2.1.2.2v-.2q0 0 0-.1m-10-7-.2.2.2.2.1-.1zm-.8 4.8-.2.1.2.2v-.3m-10-6.2-.3.1.2.2v-.1q0-.2 0-.2m-1 5-.2.2.2.2V-4q0-.2 0-.2m-1.1 6.5-.2.1.1.2.2-.1zm-9.8-7.9-.2.1.1.2.2-.1zm8.2 16.7-.2.1.2.3.1-.2zM126 8h-.6q.2.3.6.4.2 0 .3-.2 0-.1-.3-.2M119.4.6q-.2 0-.3.2l.2.2.1-.2zm2.2 4.5-.2.3q.1 0 .4 0V5zm1.8 2.6V8h.2v-.3zm3.3 5.5-.2.3q.1 0 .4 0v-.3zm-17.8-23v.3q0 0 .2 0v-.2zm4.6 7q0 0 0 .2h.2v-.2q0-.1-.2 0m4.7 6.7-.1.3q.1 0 .2 0V4zm5.3 8q0 0 0 .2h.2v-.2q-.1 0-.2 0M92-31.4l-.2.2.2.2.1-.2zm17.5 26.5h-.6l.6.3.3-.1q0-.2-.3-.2M127 19.7l-.6.3-.2.3q0 0 .4 0zm-9.2-10.3q-.1 0-.2.2l.1.2q.1 0 .2-.2zm-2.7-2.9-.6.1.5.3.3-.1q0-.2-.2-.3m6.8 11h-.6l.6.3.3-.1zM104.1-8.5l-.4.6.6-.3q.2-.2.1-.4zm17.2 25-.2.3.1.2q.2 0 .2-.2zM92.3-26l-.1.2.2.2q0 0 0-.2zm16 24.8q-.4.3-.4.6l.5-.3q.3-.2.2-.4zM104.6-6h-.6q.2.3.5.3h.4q0-.3-.3-.3m6.3 11.1-.2.3q0 0 .4 0l.4-.6zm1.7 2.2-.2.4.4-.1v-.3zm5 8.1q0 .1 0 .4l.3-.1v-.3zm3.8 6.5h-.3v.2h.2zM101.3-6.6v.3h.2q.1-.1.1-.4zm-8.5-12.8q-.1 0-.2.2l.2.1.1-.2zm13.6 21q-.1 0 0 .2h.1l.2-.3zm-1.9-2.7v.3h.2l.1-.3zm.6 1.5h-.3q0 .3.3.3l.2-.1q0-.2-.2-.2m14.5 22.1-.1.2.1.2q.1 0 .2-.2 0-.1-.2-.2m-3.4-4.3q-.1 0-.2.2l.2.2.1-.2zM99.5-6.2l-.6.1.5.3.3-.1q0-.2-.2-.3m5.4 8.3-.2.1.1.2.2-.2zM85.5-25h-.2v.3h.2zM107 9.4q-.2.3-.1.4l.3-.1q.3-.3.4-.6zM99.8-1.9v.3h.2v-.2zm4.6 6.8v.3h.2V5q0 0-.2 0m4.7 6.9q-.1 0-.1.3h.2v-.3zM81-29.2q-.1 0-.2.2 0 0 .2 0zM100.2-.8l-.3.1.2.2.2-.1zm-6.8-9.8-.2.2.3.1v-.3M111 16h-.6l.5.3.4-.1q0-.2-.3-.2M98-1.6v.3h.2l.2-.3zm2 2.5-.3.1.2.2.1-.1zm3.1 5.7v.2q.1 0 .2 0l.2-.3zM101 3.4v.2l.1.1q.1 0 .1-.3zM90-12.5l-.5.3h.6q.3 0 .3-.2zm16 23.8h-.5q.2.3.5.4.3 0 .3-.2 0-.1-.2-.2m4.6 6.8-.1.1v.2q.3 0 .3-.2zM81.3-24.5l-.2.2.2.1.1-.1zm22 33.6-.3.1.2.3.2-.2zM95-.9h-.3q0 .3.2.3t.2-.2zm-1-.9-.3.2q0 .2.3.1v-.3m17.2 26.6-.2.2.2.2.1-.3zM81.7-18q-.1 0-.1.2l.2.2v-.4M92.2-1.3l-.1.2v.1h.3q0-.2-.2-.3M107.7 23h-.3q0 0 .2.3l.6.2zM100 12l-.2-.1v.3h.3zm9.6 14.2-.2.1v.2q.3 0 .4 0 0 0-.2-.3M90-1.5q-.1 0-.3.2l.3.2.1-.2zm-1.6-.8-.6.3h.6q.3 0 .3-.2zm8.5 12.6-.1.2q0 .1.2.2v-.3M89.8.3h-.2l.1.3.1-.2zm8 12.4h-.3v.3h.2zm-3.3-4.4-.1.2.1.2.2-.2q0-.2-.2-.2M82.3-9.2l-.1.2q0 0 .2 0zM70-27.2l-.2.2.3.1v-.3m26.2 39.5-.1.1q0 .2.2.2l.1-.2q0-.1-.2-.1M79-11.5l-.6.3h.6l.3-.1zm15 23.1h-.2v.3h.2zm8.7 13.5-.2.1.1.2h.2zM70.3-22.1q-.1 0-.2.2l.2.1q0 0 0-.2zm30.1 44.8v.2q0 .1.2.1v-.3zM91 10.4q-.2 0-.2.2l.2.1.1-.1zm11.5 17.5q0 0 0 .2l.2.1v-.3zM91.3 11.6l-.2.1.2.2.1-.3zm7.8 12v.2q0 .3.2.2v-.4zM83-.4q-.2 0-.2.2l.2.1v-.3M85.7 5l-.2.3.1.2.2-.2zM92.8 16q0 0-.2 0v.2h.3zm8.4 12.8q0 0 0 .2t.2.2v-.4zm-2.4-3.3h-.1v.3l.2-.1zm-28-41.2-.3.2.2.2.1-.2zM84 7.2v.2q0 0 .2 0l.2-.3zM77.2-2l-.6.2h.6l.3-.1q0-.2-.3-.1m13.9 21.3q-.3 0-.3.3h.4l.5-.5s-.5 0-.6.2M81.8 5.9l-.1.2.1.1q.2 0 .3-.2zm7.4 11.5-.3.2.3.2.6-.3zM93 23v.4l.4.5v-.7q-.3-.3-.4-.2m-9.3-13q0-.2-.2 0v.2h.2zM95 28.1v.4l.4.5-.1-.7q-.2-.3-.3-.2m-23.7-35-.2.1.3.2V-7M68-12h-.3v.3h.3zM79.6 6.3l-.6.2h.6l.3-.1q0-.2-.3-.1m-2.1-3.5h-.3V3h.3zm-4.8-6.2h-.3v.2h.3zM68-8.8l-.6.3h.6l.3-.1zm20.7 31.2-.1.3h.2q0 0 0-.2 0 0-.1 0M78.6 8.8V9q0 0 .1 0t.1-.2zM37.2-51.8h-.3v.3h.2zm44.6 68-.1.1.1.2.3-.2zM72 1.8l-.1.2.2.2v-.4m17.7 26.7-.2.3v.2l.3-.1zm-6-8.1-.2.1v.3h.2q0-.3 0-.4m4.9 9.4q-.3 0-.2.3h.3l.5-.5q-.2 0-.6.2m-53.4-79q-.1-.2-.2 0 0 .1 0 .2h.2zM64.8-5v.4l.2-.2zm4.3 6.7q-.4-.3-.6-.3s.2.5.4.6h.3zm8.8 13-.3.2v.3h.2q.2-.3 0-.4m-12-15q-.2 0-.2.2l.3.1.5-.2zm6.6 8.8h-.3l.1.3h.2zm-7.4-10-.1.1v.2l.3-.2zm1.5 2-.2.1v.2h.2zm6 10.2q-.2 0-.2.2l.2.1v-.3m2.8 4.6v.4l.3-.2zm6.4 11-.1.2.1.1q.2 0 .3-.2zm-7.2-11-.2.1q0 .2.2.2l.1-.1zM65.3 1.8l-.1.2.1.2.2-.2zM60.8-5l-.2.1v.2h.2zm11.4 20v.2h.2V15zM48.7-19q-.3.1-.3.2l.3.2.6-.3zm8.5 12.5-.1.1.1.2.3-.2q0-.2-.3-.1M54.7-10l-.5.4-.1.4q0 0 .3-.2zm23.5 36-.5.5q-.1.3 0 .4l.2-.2zM42.8-24.1q0 0-.3.2v.2h.3zm5.7 9.1-.3.1.1.2h.2zm27.3 40.7-.1.2v.2l.3-.2zm-3.6-4.8q-.1 0-.2 0v.2h.2q0-.1 0-.2M64 10.2h-.2v.2h.3zM38.7-25.6q0 0 0 .2v.2l.2-.2zm38 56.4-.3.2v.2h.3q0-.1 0-.4M28.2-40q-.1 0-.2.2l.1.2.2-.2zM48.8-8.6q-.3 0-.3.2t.3.1l.6-.2zm8.8 12.4h-.1l-.2.2v.3h.2V4h.1L58 4zM71 25.2l-.3.2v.2h.2q0-.1 0-.4M43.7-14l-.1.2.2.1q.2 0 .2-.2zm-5.5-8.6h-.3v.2h.3zM76 34.5v.3q.1 0 .2-.2zM51.8-1.8l-.3.2v.3h.2q.2-.3.1-.5M27.6-36.6l-.2.1.2.2v-.1q0-.2 0-.2M70.8 28q-.2 0-.2.2l.2.1.3-.2zM52.2 1v.4l.3-.2zm-9.1-14.5-.5.4q-.1.3 0 .4l.2-.2zm3 6-.4.2v.3h.3zM27-33.2l-.3.1.2.2v-.1q0-.2 0-.2m-4.4-5.6H22q.1.3.6.3h.3q0-.3-.2-.3M64 22.4l-.2.1q0 .2.2.2l.1-.2zM36.5-16.3q-.3 0-.3.2h.3q.5 0 .6-.2zm19 27.6h-.3l.1.3.2-.1zm2.7 5.1v.2l.1.2.1-.2q0-.2-.2-.2m5 7.6v.2h.1l.1-.2q-.1 0-.2 0m-19-27.8q-.3 0-.2.2 0 .1.1.1.2 0 .3-.2zm27 40.2-.4.5v.3l.2-.1q.3-.4.3-.7M51.7 8.6l-.3.1.1.2h.2zM70 38q-.3 0-.3.2l.3.1.6-.2q-.2-.2-.6-.1M19.7-35.8h-.6l.6.3.3-.1q0-.1-.3-.2M65.3 31h-.2v.3h.2zM21-32.1h-.6l.5.3.3-.1q0-.2-.2-.2M47 7.9l-.1.3h.3q.4-.4.4-.6zm2.4 4-.3.1.3.2.6-.3zm7.8 12.3q-.2 0-.1.3h.3l.4-.6c0-.1-.5.1-.6.3m-1-2.2-.1.1v.2q.2 0 .3-.2zm7.5 10.8-.2.3.1.2.2-.1zM25.2-23.1q-.1 0-.2.2l.2.2v-.2q0 0 0-.2M65 36v.4q.2 0 .2-.2zM44.5 6.5l-.2.2.2.2.3-.3zm-5.2-7.8H39v.2h.3zm25 37.1-.3.2v.3h.2q.1-.3 0-.5M19.7-28.9l-.6.1.5.3.4-.1zM62.2 34l-.2.2.1.2.2-.1zM48.8 14.7l-.6-.2.4.5h.3zM56.3 26l-.2.1.1.2.2-.1zM43.6 6.4 43 7q-.1.2 0 .4l.2-.2zm15.3 24.4q0 .1 0 .2 0 .2.2 0 .1 0 .1-.3zm-7.5-11.7h-.2v.3h.3zM40.6 3.6v.3q.2 0 .2-.2zm-16-23.3q-.1 0-.2.2l.2.2v-.2q0-.1 0-.2m26 38.5v.4l.1.1.1-.2zM63 38.1v.2q0 .1.2 0 .1 0 .1-.3zm.8.5-.1.4.1.2.2-.2q0-.3-.2-.4M44 9.6l-.1.2v.2l.3-.1q0-.3-.2-.4M18.5-25.7l-.6.1.5.3.4-.1zm30 43.7-.1.7v.4q.2 0 .3-.4zm13.8 21.7-.2.2.1.1.2-.1zM56 31.9q-.2 0-.2.2l.1.1.2-.1zm-1.6-2.8-.2.7.1.3q.1 0 .2-.3zM31.6-3.6l-.2.6.1.4.2-.3zm-7.9-11q-.1 0-.2.2l.2.2.1-.2zm27 41.2v.7q0 .3.2.3l.1-.4zM17-22.4q-.2 0-.3.2l.2.2q.2 0 .2-.2zM48.5 26l-.2.3.1.2q.2 0 .2-.2zM56 37.7l-.1.2.1.2q.1 0 .2-.2zM54.3 35l-.2.7.1.3q.1 0 .2-.3zm-.5 0h-.6q.1.2.5.3h.3q0-.3-.2-.3M39.9 14.3l-.2.2.2.1h.1zM52 32.2v.7q0 .2.2.2v-.3c0-.2-.1-.7-.2-.6m-20.7-29v.2h.2q.1-.1.1-.4zm5 8v.3h.3l.1-.3zm8 11q-.4-.1-.7-.1l.5.5h.3q0-.2-.2-.3m3.1 4.8h-.2v.3h.2zM35 8.7l-.2.4.2.1.1-.1zm8 12.1-.2.3q0 0 .2 0l.1-.1q0-.2-.2-.2m-1.5-1.4q0 0 0 .2h.2q.1 0 .1-.3zm-25.6-38h-.3l.3.3.1-.2zm30.7 46.1q-.2.1 0 .2 0 .2.1 0l.2-.3zM39 15.9q-.3-.2-.6-.2l.5.5h.3q0-.2-.2-.3m12.1 18.5v.2q.1 0 .2 0 0 0 0-.2zm-7-9.2q-.3.1-.2.4 0 .2.2.1l.1-.2zm4.2 6.5-.2.3.1.2q.2 0 .2-.2zm6 9-.1.7v.4q.2 0 .3-.4zm-9-12.8-.2.7.1.4.2-.4zm10 15.6-.1.2.1.2q.1 0 .2-.2 0-.1-.2-.2M42.7 26.8v.3h.1l.1-.1q0-.1-.2-.2m-1-1.6-.2.3.1.2q.1 0 .2-.2zm3.6 5.6-.1.4q0 0 .2 0l.1-.1zm7.7 13q-.2 0-.1.3l.3-.1.4-.6zM48.5 36h-.3l.2.3.2-.1zm-.1 1.4-.2.4.1.1.2-.1zm-7.4-10v.1q0 .1.2 0 0 0 0-.2zm-1.4-2.2-.2.1.1.2q.2 0 .2-.2zm7.3 11-.1.3q0 .2.1.1.2 0 .2-.2zm-2.9-4v.4q.3 0 .2-.2 0-.1-.2-.1m1.1 1.5-.2.6.1.4.2-.3zm6 9.6h-.6q.2.3.5.4l.4-.1zM47.9 40v.3l.2.1.1-.2q0-.2-.3-.2m2.6 4.8q0 .1 0 .4 0 .2.2 0V45zm-5-6.9v.3h.3q0-.3-.2-.3M35.4 23l-.1.3q0 0 .2 0v-.1zM43.4 35h-.2v.3l.2-.1zm-10-14.2H33l.2.3h.2zm2.9 6.2-.1.2.1.2.2-.2zm2.6 3.6q-.2 0-.4 0l.2.3h.2zm7.4 13-.1.3q0 0 .1 0h.2q0-.2-.2-.2M33.7 25l-.5-.1.4.4h.3q0 0-.2-.3m-3.6-4.2-.6-.2.5.5h.3q0 0-.2-.3m7.5 11.8-.2.2.2.1.1-.2zm-2.3-2.2v.8q0 .3.2.2V31c0-.2 0-.7-.2-.7m9.7 15-.2.2q0 .3.3.3v-.3zM39 38l-.1.2q0 0 .2 0l.1-.1q0-.2-.2-.1m4.5 7h-.3l.2.3h.2zm-7-9.1v.7q0 .3.2.3 0 0 0-.4zM26.8 22v.7l.1.3q.2 0 .1-.4zm15.4 23.4H42l-.1.4q0 0 .3-.2zm-2.4-1.7-.1.2.2.1q0 0 0-.2zm-1.6-2.3v.7l.1.3q.2 0 .1-.4c0-.2-.1-.7-.2-.6m.6 2.6h-.2v.3l.2-.1zM28.7 29.3l-.1.4.1.1.2-.2zm-.2.3-.2.1v.2h.2zm-3.3-4.8H25v.3h.2zM34 39.4h-.4l.2.3h.2zm4.9 7.7v.7l.1.3q.2 0 .1-.4zm-9-12.2v.3l.1.2q.2 0 .1-.3 0-.2-.2-.2m-1.3-1.2q-.3-.2-.6-.2l.4.5h.4q0 0-.2-.3m8.7 13.5-.2.2.2.3q.2 0 .1-.3zM25 29.5q-.3-.2-.6-.2l.4.5h.4q0-.1-.2-.3m6.5 10.8q0 .1 0 .4v.1q.2 0 .2-.2zm-5.4-8v.7q0 .3.2.3V33zm-6.5-7.8-.2.1v.2h.2zM27.4 38v.7l.1.3q.2 0 .1-.4zm4.8 8.1-.1.4q0 .2.2.1 0 0 0-.2zM21.8 31v.3l.1.1q.2 0 .1-.2 0-.2-.2-.3m8.3 12v.7q0 .3.2.3 0 0 0-.4zm3.4 5.9h-.1q0 .1 0 .2.1 0 .2 0zM19.7 28.6q-.3-.2-.6-.2l.4.5h.4q0 0-.2-.3M31.1 47H31v.3l.3-.1zM19.8 31.7l-.1.2.2.1v-.2zm4 7h-.2v.3h.3zM20.6 34h-.3l.1.3h.2zm10.9 16-.3.1q-.2.4-.2.7l.4-.5q.2-.3.1-.4M15.2 26.1l-.6-.2.4.5h.4q0 0-.2-.3m14.2 21.2q-.1 0-.2.2l-.3.6.5-.5zm.2 1.7-.2.2.2.3.1-.3zM21 37.2l-.1.2.1.2.2-.2zm3.3 5-.1.2.2.1q0 0 0-.2zm-.8.3-.2.1v.2h.2zM20 38.3l-.2.1v.2h.2zM17 34.2v.7q0 .3.2.3l.1-.4zm8.9 13q-.1 0-.3.2l-.3.6c.1.1.4-.3.5-.4q.2-.4 0-.4M15 33.6h-.3v.3h.3zM11.1 29H11l.2.3h.2zm7.2 10.8v.7q0 .4.2.3v-.3zM26 52l-.1.2q0 .1.2.1 0-.1 0-.2M9 26.4v.7q0 .4.2.3v-.3zm4 6.7q-.2.1-.1.4 0 .2.1.1.2 0 .2-.2zm1.7 4.3-.2.1v.2h.2zm-4.3-6.2h-.2v.3h.3zm14 22h-.2v.3l.2-.1zM11 34.2q-.2 0-.1.2l.1.2.1-.2zm10.6 17.3-.1.2q0 0 .2 0 0 0 0-.1l.3-.1v-.2h-.2v.2zM10.2 35l-.2.1v.2h.2zm9.4 14.4h-.2v.3l.2-.1zM4.3 28.2q-.3-.1-.6-.1s.3.4.5.4h.3q0 0-.2-.3m14 26 .1.3q.2 0 .1-.3zm.2.3q0 0-.3.2-.2.4-.2.7l.4-.5q.2-.2 0-.4M0 28.3v.7l.1.3q.2 0 .1-.4z"
    />
  </motion.svg>
);

const LightImage = (props: SVGMotionProps<SVGSVGElement> & { id?: string }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 144 10"
    {...props}
  >
    <g filter="url(#a)" opacity={0.8}>
      <rect width={135.8} height={5} x={4} y={6.6} fill="url(#b)" rx={2.5} />
    </g>
    <g filter="url(#c)" opacity={0.8}>
      <rect width={83.4} height={7.6} x={30.2} y={4} fill="url(#d)" rx={3.8} />
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={4}
        x2={139.8}
        y1={9.1}
        y2={9.1}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#95bdfe" stopOpacity={0} />
        <stop offset={0.5} stopColor="#79acff" />
        <stop offset={1} stopColor="#95bdfe" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="d"
        x1={30.2}
        x2={113.6}
        y1={7.8}
        y2={7.8}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#95bdfe" stopOpacity={0} />
        <stop offset={0.5} stopColor="#448bff" />
        <stop offset={1} stopColor="#95bdfe" stopOpacity={0} />
      </linearGradient>
      <filter
        id="a"
        width={143.8}
        height={13}
        x={0}
        y={2.6}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          result="effect1_foregroundBlur_4342_104"
          stdDeviation={2}
        />
      </filter>
      <filter
        id="c"
        width={91.4}
        height={15.6}
        x={26.2}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          result="effect1_foregroundBlur_4342_104"
          stdDeviation={2}
        />
      </filter>
    </defs>
  </motion.svg>
);

export function HackathonButton({
  className,
  href,
}: {
  className?: string;
  href: string;
}) {
  const id = useId();
  const particlesId = `${id}-particles`;
  const lightId = `${id}-light`;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Button
      className={cn(
        'bg-accent text-accent-foreground hover:text-accent-foreground hover:bg-accent group relative gap-2 overflow-hidden rounded-full',
        className,
      )}
      asChild
    >
      <motion.a
        href={href}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-2"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <ParticlesImage
          id={particlesId}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          width={146}
          height={36}
          style={{ width: '146px', height: '36px', flexShrink: 0, scale: 2.5 }}
          animate={
            isHovered
              ? {
                  x: [0, 5, -5, 5, -5, 0],
                  y: [0, -3, 3, -3, 3, 0],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }
              : { x: 0, y: 0 }
          }
        />
        <LightImage
          id={lightId}
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
          width={144}
          height={10}
          style={{
            width: '144px',
            height: '10px',
            flexShrink: 0,
            transformOrigin: 'center bottom',
          }}
          animate={
            isHovered
              ? {
                  scale: 1.2,
                  transition: {
                    duration: 0.3,
                    ease: 'easeOut',
                  },
                }
              : { scale: 1 }
          }
        />
        <span className="relative z-10">Join Challenge</span>
        <ArrowRightIcon
          size={16}
          className="text-muted-foreground relative z-10"
        />
      </motion.a>
    </Button>
  );
}
