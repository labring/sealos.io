import { GradientText } from '../components/GradientText';

export function SequenceSection() {
  return (
    <section className="mt-48 mb-32">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-[2.5rem] leading-tight">
            <span>More Than a Platform. It's</span>&nbsp;
            <GradientText>Your Entire Cloud Workflow, Reimagined.</GradientText>
          </h2>
          <p className="mt-3 text-zinc-400">
            A sequence of modules that appear as the user scrolls.
          </p>
        </div>
      </div>
    </section>
  );
}
