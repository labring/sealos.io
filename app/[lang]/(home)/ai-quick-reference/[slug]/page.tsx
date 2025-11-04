import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { GradientText } from '../../(new-home)/components/GradientText';
import { FAQTag } from '@/new-components/FAQTag';
import { FAQCard } from '@/new-components/FAQCard';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: {
    slug: string;
    lang: string;
  };
}

export default function FAQDetailPage({ params }: PageProps) {
  const langPrefix = `/${params.lang}`;

  // TODO: 从实际数据源获取数据
  const faqData = {
    tag: {
      label: 'Platform Value & Trends',
      color: 'bg-blue-400',
    },
    title: "What exactly is an 'Intelligent Cloud OS'?",
  };

  const relatedQuestions = [
    {
      tag: { label: 'Platform Value & Trends', color: 'bg-blue-400' },
      title: 'How does Sealos compare to traditional cloud providers?',
      description:
        'Sealos offers a more intelligent and integrated approach to cloud computing, combining AI assistance with seamless infrastructure management.',
      href: `${langPrefix}/ai-quick-reference/how-does-sealos-compare`,
    },
    {
      tag: { label: 'Features', color: 'bg-green-400' },
      title: 'What programming languages are supported?',
      description:
        'Sealos supports a wide range of programming languages and frameworks, making it easy to deploy applications regardless of your tech stack.',
      href: `${langPrefix}/ai-quick-reference/supported-languages`,
    },
    {
      tag: { label: 'Pricing', color: 'bg-purple-400' },
      title: 'What is the pricing model?',
      description:
        'Our pricing is transparent and flexible, designed to scale with your needs. Start free and only pay for what you use.',
      href: `${langPrefix}/ai-quick-reference/pricing`,
    },
    {
      tag: { label: 'Security', color: 'bg-red-400' },
      title: 'How secure is my data?',
      description:
        'Security is our top priority. We implement industry-leading security measures to protect your applications and data.',
      href: `${langPrefix}/ai-quick-reference/security`,
    },
  ];

  const keepReading = [
    {
      title: 'Understanding Cloud OS Architecture',
      href: `${langPrefix}/ai-quick-reference/cloud-os-architecture`,
    },
    {
      title: 'Getting Started with AI Pilot',
      href: `${langPrefix}/ai-quick-reference/ai-pilot-guide`,
    },
    {
      title: 'Deployment Best Practices',
      href: `${langPrefix}/ai-quick-reference/deployment-best-practices`,
    },
    {
      title: 'Database Management Tips',
      href: `${langPrefix}/ai-quick-reference/database-management`,
    },
  ];

  return (
    <div className="container -mt-24 pt-44 pb-20">
      {/* Back Button */}
      <Link
        href={`${langPrefix}/ai-quick-reference`}
        className="text-muted-foreground hover:text-foreground mb-14 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to FAQ</span>
      </Link>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_360px]">
        {/* Main Content */}
        <article>
          <div className="mb-12 flex flex-col gap-5">
            {/* Tag */}
            <div>
              <FAQTag label={faqData.tag.label} color={faqData.tag.color} />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-semibold">{faqData.title}</h1>
          </div>

          {/* Main Content */}
          <div className="text-muted-foreground mb-14 flex flex-col gap-5 text-base">
            <p>
              It means we're more than just a hosting platform. Sealos is an
              integrated system where an AI core (our AI Pilot) understands how
              development, deployment, and databases should work together. You
              describe what you want, and the OS intelligently handles the how.
            </p>
            <p>
              Our Intelligent Cloud OS combines the power of AI with cloud
              infrastructure, creating a seamless experience where developers
              can focus on building rather than managing infrastructure. The
              system learns from your patterns and preferences, making
              intelligent suggestions and automating routine tasks.
            </p>
            <p>
              This approach fundamentally changes how you interact with cloud
              resources. Instead of manually configuring servers, databases, and
              deployment pipelines, you simply express your intent, and the OS
              handles the complexity behind the scenes.
            </p>
          </div>

          {/* Prev/Next Navigation */}
          <div className="mb-14 flex gap-3">
            <Link
              href={`${langPrefix}/ai-quick-reference/previous`}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </Link>
            <Link
              href={`${langPrefix}/ai-quick-reference/next`}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Related Questions */}
          <div className="mt-20">
            <h2 className="mb-8 text-2xl font-semibold">Related Questions</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {relatedQuestions.map((question, index) => (
                <FAQCard
                  key={index}
                  tag={question.tag}
                  title={question.title}
                  description={question.description}
                  href={question.href}
                />
              ))}
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="flex flex-col gap-12 lg:sticky lg:top-24 lg:h-fit">
          {/* Sealos Brand Card */}
          <div className="border-border bg-card rounded-xl border p-8">
            <div className="mb-8 flex flex-col gap-6">
              <div className="flex items-center gap-1">
                <Image
                  alt="Sealos Logo"
                  src="/logo.svg"
                  className="h-6 w-6"
                  width={24}
                  height={24}
                />
                <span className="text-base font-bold text-white">Sealos</span>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xl font-medium">
                  <GradientText>
                    Ready to Stop Configuring and Start Creating?
                  </GradientText>
                </p>
                <p className="text-muted-foreground text-center text-sm">
                  Get started for free. No credit card required.
                </p>
              </div>
            </div>

            <Button variant="landing-primary" asChild>
              <Link href={siteConfig.links.mainCta}>
                <span>Start Building for Free</span>
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          {/* Keep Reading */}
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-bold">Keep Reading</h2>
            <div className="flex flex-col gap-3">
              {keepReading.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="border-border bg-card text-muted-foreground hover:text-foreground rounded-xl border p-4 text-sm transition-colors"
                >
                  <span className="line-clamp-1">{item.title}</span>
                </Link>
              ))}
            </div>
            <Link
              href={`${langPrefix}/ai-quick-reference`}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <span>All Frequently Asked Questions</span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
