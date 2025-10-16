import { CheckCheck, TriangleAlert } from 'lucide-react';
import { GradientText } from '../components/GradientText';
import { FallingTags } from '../components/FallingTags';
import { SealosChoiceCard } from '../components/SealosChoiceCard';

export function ChoicesSection() {
  return (
    <section className="mt-48 mb-32">
      <div>
        <h2 className="text-[2.5rem] leading-tight">
          <div>Want to ship your next feature</div>
          <div>
            <GradientText>in minutes</GradientText>, not months?
          </div>
        </h2>
        <p className="mt-3 text-zinc-400">You have two choices.</p>
      </div>

      <div className="flex gap-6">
        <div className="inset-shadow-bubble flex w-full flex-col rounded-xl border border-zinc-700">
          <div className="grow border-b border-zinc-700 p-8">
            <h3 className="flex items-center text-2xl font-medium text-zinc-200">
              <span>Bear the bottleneck</span>
              <TriangleAlert size={24} className="ml-2 text-red-500" />
            </h3>
            <p className="mt-2 text-lg text-zinc-400">
              A chaotic, physics-based cascade of 10 blocks crashing into a
              messy pile.
            </p>
          </div>
          <div className="relative h-96">
            <span className="absolute bottom-10 left-8 z-10 rounded-full px-3 py-0.5 text-lg text-zinc-400 backdrop-blur-lg">
              💥 Something broke...
            </span>
            <span className="absolute right-8 bottom-10 z-10 rounded-full px-3 py-0.5 text-lg text-zinc-400 backdrop-blur-lg">
              ⏰ 3 hours later...
            </span>
            <FallingTags />
          </div>
        </div>

        <div className="inset-shadow-bubble w-full rounded-xl border border-zinc-700">
          <div className="grow border-b border-zinc-700 p-8">
            <h3 className="flex items-center text-2xl font-medium text-zinc-200">
              <span>Or use Sealos</span>
              <CheckCheck size={24} className="ml-2 text-emerald-500" />
            </h3>
            <p className="mt-2 text-lg text-zinc-400">
              A smooth, elegant stack of 3 blocks, with each new block appearing
              as the previous one hops neatly on top.
            </p>
          </div>
          <div className="relative h-96">
            <span className="absolute right-8 bottom-10 text-lg text-zinc-400">
              ✨ Done in 30 seconds
            </span>
            <div className="flex h-full w-full items-center justify-center">
              <SealosChoiceCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
