import Footer from '@/components/footer';
import Header from '@/components/header';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { appDomain } from '@/config/site';
import RedirectSuggest from '@/components/redirectSuggest';
import { languagesType } from '@/lib/i18n';
import { HovermeButton } from '@/components/button/hoverme';
import Image from 'next/image';

const title = {
  main: 'Empower your education journey with cloud technology',
  sub: 'Free Cloud Credits for Educational Institutions and Startups',
};

export const metadata = generatePageMetadata({
  title: 'Sealos Education - Free Cloud Credits for Academic Projects',
  description:
    'Empower students and educators with Sealos cloud platform. Apply for free startup credits for your academic institution.',
});

export default function EducationPage({
  params,
}: {
  params: { lang: languagesType };
}) {
  return (
    <div className="h-full bg-[#EBF2FF]">
      <Header lang={params.lang} />
      <main className="custom-container px-8 pt-14 md:px-[15%]">
        {/* Hero Section */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h1 className="mb-6 text-4xl font-bold text-blue-900 md:text-5xl">
            {title.main}
          </h1>
          <p className="mb-8 max-w-3xl text-xl text-blue-800 md:text-2xl">
            {title.sub}
          </p>
          <div className="relative mb-8 h-64 w-full max-w-3xl overflow-hidden rounded-lg bg-blue-100 md:h-80">
            <Image
              src="/images/education-hero.jpg"
              alt="Students using cloud technology"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <a href="#apply-now" className="mb-8">
            <HovermeButton text="Apply for Free Credits" />
          </a>
          <p className="font-medium text-blue-600">
            Join hundreds of universities already using Sealos for education
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="mb-10 text-center text-3xl font-bold text-blue-900">
            Why Choose Sealos for Education?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Simplified Learning',
                description:
                  'Intuitive interface designed for students and educators with no cloud expertise required',
                icon: '📚',
              },
              {
                title: 'Real-world Skills',
                description:
                  'Students gain hands-on experience with industry-standard cloud technologies',
                icon: '💼',
              },
              {
                title: 'Dedicated Support',
                description:
                  'Specialized assistance for academic institutions and educational projects',
                icon: '🛟',
              },
            ].map((benefit, i) => (
              <div key={i} className="rounded-lg bg-white p-8 shadow-md">
                <div className="mb-4 text-4xl">{benefit.icon}</div>
                <h3 className="mb-3 text-xl font-bold text-blue-900">
                  {benefit.title}
                </h3>
                <p className="text-blue-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Apply Section */}
        <div className="mb-20" id="apply-now">
          <h2 className="mb-10 text-center text-3xl font-bold text-blue-900">
            How to Apply for Free Credits
          </h2>
          <div className="rounded-lg bg-white p-8 shadow-md">
            <ol className="space-y-6">
              {[
                'Complete the application form with your institution details',
                'Verify your academic status or startup credentials',
                'Receive your credits within 2 business days',
                'Start building and deploying with Sealos Cloud!',
              ].map((step, i) => (
                <li key={i} className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    {i + 1}
                  </div>
                  <p className="text-lg text-blue-800">{step}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex justify-center">
              <a href={`${appDomain}/education-apply`}>
                <HovermeButton text="Apply Now" />
              </a>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="mb-10 text-center text-3xl font-bold text-blue-900">
            What Educators Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                quote:
                  'Sealos has transformed how we teach cloud computing. Students can focus on learning concepts rather than fighting with complex infrastructure.',
                name: 'Dr. Sarah Chen',
                title: 'Professor of Computer Science, MIT',
              },
              {
                quote:
                  'The free credits from Sealos enabled our student startup to develop and launch our MVP without worrying about infrastructure costs.',
                name: 'Michael Rodriguez',
                title: 'Student Entrepreneur, Stanford University',
              },
            ].map((testimonial, i) => (
              <div key={i} className="rounded-lg bg-white p-8 shadow-md">
                <p className="mb-6 text-blue-700 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-bold text-blue-900">{testimonial.name}</p>
                  <p className="text-blue-600">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mb-20 rounded-lg bg-blue-100 p-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900">
            Ready to empower your students?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-700">
            Get up to $2000 in free Sealos credits for your educational
            institution or student project
          </p>
          <a href={`${appDomain}/education-apply`}>
            <HovermeButton text="Apply for Free Credits" />
          </a>
        </div>
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer lang={params.lang} />
      <TailwindIndicator />
      <RedirectSuggest />
    </div>
  );
}
