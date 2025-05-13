'use client';
import React from 'react';
import { BentoCard } from './feature-grid/bentogrid';
import { LogoCluster } from './feature-grid/logocluster';
import { Map } from './feature-grid/map';
import CloudOs from './feature-grid/cloud-os';
import Optimal from './feature-grid/optimal';
import { Integrations } from './feature-grid/integrations';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { motion } from 'framer-motion';

export default function FeatureGrid() {
  return (
    <AnimateElement type="slideUp">
      <div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-base font-bold text-black sm:text-4xl">
            An Enterprise Cloud OS Solution
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600 sm:text-lg">
            Sealos combines powerful features to streamline your development workflow
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-3"
          >
            <BentoCard
              eyebrow="Cloud Native"
              title="Seamless & Secure"
              description="Deploy, manage, and scale applications effortlessly with enterprise-grade Kubernetes. Single-click cluster creation, automated orchestration, and isolated environments eliminate dependency issues, while auto-scaling up to 10,000 nodes ensures peak performance."
              graphic={<CloudOs />}
              className="max-lg:rounded-t-4xl lg:rounded-tl-4xl h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-3"
          >
            <BentoCard
              eyebrow="Flexibility"
              title="Efficient Development"
              description="Optimal cloud resource assignment helps cut infrastructure costs by 90% while accelerating development. Reproducible workspaces offer a streamlined workflows, ensuring continued uptime. While built-in security and SSL offer complete protection."
              graphic={<Optimal />}
              className="lg:rounded-tr-4xl h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-2"
          >
            <BentoCard
              eyebrow="Speed"
              title="One-click deployments"
              description="Effortlessly deploy your favorite frameworks, languages, databases and apps from pre-made templates (or create your own)."
              graphic={<Integrations />}
              className="lg:rounded-bl-4xl h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-2"
          >
            <BentoCard
              eyebrow="Unified"
              title="All-in-one solution"
              description="Remove the complexity of DevOps with our unified cloud platform that lets you, deploy and scale with ease."
              graphic={<LogoCluster />}
              className="h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-2"
          >
            <BentoCard
              eyebrow="Collaboration"
              title="Cloud workspaces"
              description="Create individual cloud workspaces for each of your projects and invite your team with customized permissions."
              graphic={<Map />}
              className="max-lg:rounded-b-4xl lg:rounded-br-4xl h-full"
            />
          </motion.div>
        </div>
      </div>
    </AnimateElement>
  );
}
