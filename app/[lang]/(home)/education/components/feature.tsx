import { AnimateElement } from '@/components/ui/animated-wrapper';
import { BookOpen, Briefcase, Users } from 'lucide-react';

const iconStyle = 'text-blue-300 ';
const features = [
  {
    title: 'Simplified Learning',
    description:
      'Intuitive interface designed for students and educators with no cloud expertise required.',
    icon: <BookOpen className={iconStyle} />,
  },
  {
    title: 'Real-world Skills',
    description:
      'Students gain hands-on experience with industry-standard cloud technologies.',
    icon: <Briefcase className={iconStyle} />,
  },
  {
    title: 'Collaborative',
    description:
      'Teachers and students can share environments, manage access, and collaborate within real projects.',
    icon: <Users className={iconStyle} />,
  },
];

export default function Feature() {
  return (
    <div className="mt-32">
      <AnimateElement type="slideUp">
        <div className="text-center text-4xl font-bold text-black">
          Why Choose Sealos for Education?
        </div>
      </AnimateElement>

      <AnimateElement type="slideUp">
        <div className="mt-16 flex flex-col justify-center gap-6 lg:flex-row">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative flex flex-1 flex-col rounded-lg bg-white p-6"
              style={{
                boxShadow:
                  '0px 12px 40px -25px rgba(6, 26, 65, 0.20), 0px 0px 1px 0px rgba(19, 51, 107, 0.20)',
              }}
            >
              <AnimateElement type="slideUp">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {feature.icon}
                      <h3 className="text-lg font-semibold sm:text-[20px]">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-custom-secondary-text text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimateElement>
              {index === 1 && (
                <div className="absolute top-1/2 left-1/2 z-0 h-[75px] w-[250px] -translate-x-1/2 -translate-y-1/2 bg-[#3DA7FF66] blur-[100px]"></div>
              )}
            </div>
          ))}
        </div>
      </AnimateElement>
    </div>
  );
}
