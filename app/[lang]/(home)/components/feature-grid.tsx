'use client';
import React from 'react';
import { BentoCard } from './feature-grid/bentogrid';
import { LogoCluster } from './feature-grid/logocluster';
import { Map } from './feature-grid/map';
import { Integrations } from './feature-grid/integrations';
import { AnimateElement } from '@/components/ui/animated-wrapper';

export default function FeatureGrid() {
  return (
    <AnimateElement type="slideUp">
      <div>
        <div className="text-center text-base font-bold text-black sm:text-4xl">
          Why developers love Sealos?
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <BentoCard
            eyebrow="Cloud Native"
            title="Enterprise Cloud OS"
            description="Gain all the benefits of Kubernetes without the hassle and complexity, with single-click cluster creation and automated container orchestration."
            graphic={
              // eslint-disable-next-line tailwindcss/no-contradicting-classname
              <div className="h-80 bg-[url(/images/enterprise-os.svg)] bg-cover bg-no-repeat" />
            }
            fade={['bottom']}
            className="max-lg:rounded-t-4xl lg:rounded-tl-4xl lg:col-span-3"
          />
          <BentoCard
            eyebrow="Seamless"
            title="Steamlined Workflow"
            description="From development to production — developers can code and build in their favorite IDEs then seamlessly test, release, and scale without friction."
            graphic={
              // eslint-disable-next-line tailwindcss/no-contradicting-classname
              <div className="absolute inset-0 -mt-6 bg-[url(/images/streamlined-workflow.svg)] bg-cover bg-no-repeat" />
            }
            fade={['bottom']}
            className="lg:rounded-tr-4xl lg:col-span-3"
          />
          <BentoCard
            eyebrow="Speed"
            title="One-click deployments"
            description="Effortlessly deploy your favorite frameworks, languages, databases and apps from pre-made templates (or create your own)."
            graphic={<Integrations />}
            className="lg:rounded-bl-4xl lg:col-span-2"
          />

          <BentoCard
            eyebrow="Unified"
            title="All-in-one solution"
            description="Remove the complexity of DevOps with our unified cloud platform that lets you, deploy and scale with ease."
            graphic={<LogoCluster />}
            className="lg:col-span-2"
          />
          <BentoCard
            eyebrow="Collaboration"
            title="Cloud workspaces"
            description="Create individual cloud workspaces for each of your projects and invite your team with customized permissions."
            graphic={<Map />}
            className="max-lg:rounded-b-4xl lg:rounded-br-4xl lg:col-span-2"
          />
        </div>
      </div>
    </AnimateElement>
  );
}
