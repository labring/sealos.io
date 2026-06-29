import { GradientText } from '@/new-components/GradientText';

import { DockerImageDemo } from '../components/docker-image-demo';

export function DockerImageSection() {
  return (
    <section
      id="docker-image-section"
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
            Bring your own image. We&apos;ll handle the infrastructure.
          </GradientText>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400">
            Just paste your Docker image tag. The agent instantly spins up your
            container, configures the network, and exposes it to the world with
            zero friction.
          </p>
        </div>

        <DockerImageDemo />
      </div>
    </section>
  );
}
