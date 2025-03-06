import { cn } from '@/lib/utils';
import Image from 'next/image';
import { MagicCard } from '@/components/ui/magic-card';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { Database, FolderGit2, Server } from 'lucide-react';

const iconStyle = 'text-blue-300 ';
const features = [
  {
    title: 'Environment Management',
    description:
      'Manage numerous projects and teams with multiple cloud workspaces. Allowing you to hare code, configs and data seamlessly with your team.',
    image: '/images/devbox/workspaces.svg',
    icon: <FolderGit2 className={iconStyle} />,
  },
  {
    title: 'Integrated Databases',
    description:
      'Instantly provision development databases with automated backups, snapshots, and scaling. Connect effortlessly to MySQL, PostgreSQL, MongoDB, and Redis.',
    image: '/images/devbox/databases.svg',
    icon: <Database className={iconStyle} />,
  },
  {
    title: 'Cloud-Native Storage',
    description:
      'Persistent, scalable object storage for your development needs. Seamlessly store and manage assets, logs, and data with S3 compatibility and built-in security.',
    image: '/images/devbox/cloud-storage.svg',
    icon: <Server className={iconStyle} />,
  },
];

export default function Feature() {
  return (
    <div className="mt-52">
      <AnimateElement type="slideUp">
        <div className="text-center text-4xl font-bold text-black">
          Cloud-Native Development
        </div>
      </AnimateElement>

      <AnimateElement type="slideUp">
        <div className="mt-16 flex flex-col justify-center gap-6 lg:flex-row">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative flex h-[424px] flex-1 flex-col justify-between rounded-lg bg-white"
              style={{
                boxShadow:
                  '0px 12px 40px -25px rgba(6, 26, 65, 0.20), 0px 0px 1px 0px rgba(19, 51, 107, 0.20)',
              }}
            >
              <AnimateElement type="slideUp">
                <div className="flex  gap-4 p-6 pb-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {feature.icon}
                      <h3 className="text-lg font-semibold sm:text-[20px]">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="mb-4 text-sm text-custom-secondary-text ">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimateElement>
              <div className="relative z-10 flex-1 overflow-hidden rounded-lg">
                <AnimateElement
                  type="slideUp"
                  delay={0.4}
                  className="mt-auto h-full"
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={411}
                    height={285}
                    className="z-10 mt-auto h-full w-full object-cover"
                  />
                </AnimateElement>
              </div>
              {index === 1 && (
                <div className="absolute left-1/2 top-2/3 z-0 h-[75px] w-[250px] -translate-x-1/2 -translate-y-1/2 bg-[#3DA7FF66] blur-[100px]"></div>
              )}
            </div>
          ))}
        </div>
      </AnimateElement>
    </div>
  );
}
