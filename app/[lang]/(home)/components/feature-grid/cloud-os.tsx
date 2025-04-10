'use client';

import { cn } from '@/lib/utils';
import React, { forwardRef, useRef } from 'react';
import { AnimatedBeam, Circle } from '@/components/ui/animated-beam';
import { Cloud, Database, Folder, Package, User } from 'lucide-react';
import Image from 'next/image';

export default function index({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);
  const div8Ref = useRef<HTMLDivElement>(null);
  const div9Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'relative mx-auto flex w-full max-w-[500px] items-center justify-center overflow-hidden p-10',
        className,
      )}
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center gap-8">
          <Circle
            ref={div7Ref}
            className="border border-amber-200 bg-amber-50 p-2 shadow-md shadow-amber-100/30"
          >
            <Database className="text-amber-500" />
          </Circle>
          <Circle
            ref={div8Ref}
            className="border border-stone-200 bg-stone-50 p-2 shadow-md shadow-stone-100/30"
          >
            <Package className="text-stone-500" />
          </Circle>
          <Circle
            ref={div9Ref}
            className="border border-purple-200 bg-purple-50 p-2 shadow-md shadow-purple-100/30"
          >
            <Folder className="text-purple-500" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle
            ref={div6Ref}
            className="h-16 w-16 border border-blue-200 bg-blue-50 shadow-lg shadow-blue-100/30"
          >
            <Image src="/logo.svg" alt="Logo" width={48} height={48} />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle
            ref={div1Ref}
            className="border border-orange-200 bg-orange-50 shadow-md shadow-orange-100/30"
          >
            <User className="text-orange-500" />
          </Circle>
          <Circle
            className="border border-green-200 bg-green-50 p-2 shadow-md shadow-green-100/30"
            ref={div2Ref}
          >
            <User className="text-green-500" />
          </Circle>
          <Circle
            className="border border-violet-200 bg-violet-50 p-2 shadow-md shadow-violet-100/30"
            ref={div4Ref}
          >
            <User className="text-violet-500" />
          </Circle>
          <Circle
            className="border border-yellow-200 bg-yellow-50 p-2 shadow-md shadow-yellow-100/30"
            ref={div3Ref}
          >
            <User className="text-yellow-500" />
          </Circle>
          <Circle
            className="border border-indigo-200 bg-indigo-50 p-2 shadow-md shadow-indigo-100/30"
            ref={div5Ref}
          >
            <User className=" text-indigo-500" />
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div8Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div9Ref}
        duration={3}
      />
    </div>
  );
}
