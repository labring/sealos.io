import { CheckCheck, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import { GradientText } from '../components/GradientText';
import { FallingTags } from '../components/FallingTags';
import { SealosChoiceCard } from '../components/SealosChoiceCard';
import ChoicesBeamGrid from '../assets/choices-beam-grid.svg';

export function ChoicesSection() {
  return (
    <section className="relative -mt-[100vh] w-screen overflow-x-clip pt-28 pb-32">
      <div className="container">
        <div className="relative pb-8 lg:pb-16">
          <div className="w-full">
            <h2 className="text-2xl leading-tight sm:text-4xl md:text-[2.5rem]">
              <div>Want to ship your next feature</div>
              <div>
                <GradientText>in minutes</GradientText>, not months?
              </div>
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              You have two choices.
            </p>
          </div>
          <div className="pointer-events-none absolute top-0 right-0 -z-10 h-full w-full md:w-1/2">
            <Image
              src={ChoicesBeamGrid}
              alt=""
              className="h-full w-full object-contain object-right-bottom"
              fill
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="inset-shadow-bubble flex flex-col rounded-xl border border-zinc-700">
            <div className="grow border-b border-zinc-700 p-6 sm:p-8">
              <h3 className="flex items-center text-base font-medium text-zinc-200 sm:text-2xl">
                <span>Bear the bottleneck</span>
                <TriangleAlert className="ml-2 size-4 text-red-500 sm:size-6" />
              </h3>
            </div>
            <div className="relative h-96">
              <span className="absolute bottom-10 left-8 z-10 rounded-full px-3 py-0.5 text-xs text-zinc-400 backdrop-blur-lg sm:text-lg">
                💥 Something broke...
              </span>
              <span className="absolute right-8 bottom-10 z-10 rounded-full px-3 py-0.5 text-xs text-zinc-400 backdrop-blur-lg sm:text-lg">
                ⏰ 3 hours later...
              </span>
              <FallingTags />
            </div>
          </div>

          <div className="inset-shadow-bubble flex flex-col rounded-xl border border-zinc-700">
            <div className="grow border-b border-zinc-700 p-6 sm:p-8">
              <h3 className="flex items-center text-base font-medium text-zinc-200 sm:text-2xl">
                <span>Or use Sealos</span>
                <CheckCheck className="ml-2 size-4 text-emerald-500 sm:size-6" />
              </h3>
            </div>
            <div className="relative h-96">
              <span className="absolute right-8 bottom-10 text-xs text-zinc-400 sm:text-lg">
                ✨ Done in 30 seconds
              </span>
              <div className="flex h-full w-full items-center justify-center">
                <SealosChoiceCard className="p-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
