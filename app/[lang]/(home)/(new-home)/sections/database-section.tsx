import { GradientText } from '@/new-components/GradientText';

import { DatabaseDemo } from '../components/project-type-demos';

export function DatabaseSection() {
  return (
    <section
      id="database-section"
      className="relative isolate overflow-hidden px-4 py-20 text-white sm:px-6 lg:px-16 lg:py-28"
    >
      <div
        className="absolute inset-0 -z-10 [background-image:radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 mx-auto h-[720px] max-w-[1440px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.22),transparent_64%)]"
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-20">
        <div className="max-w-4xl text-center">
          <GradientText
            as="h2"
            className="to-blue-500 text-4xl leading-tight font-semibold text-balance sm:text-5xl"
          >
            Other platforms hand you a connection string. Sealos hands you a
            database.
          </GradientText>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400">
            Schema tree, rows browser, backup policies — all built in. No second
            tool, no second login.
          </p>
        </div>

        <DatabaseDemo />
      </div>
    </section>
  );
}
