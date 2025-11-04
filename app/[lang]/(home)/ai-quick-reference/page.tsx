import { ArrowRightIcon, ChevronDownIcon, ListIcon } from 'lucide-react';
import { GradientText } from '../(new-home)/components/GradientText';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FAQTag } from '@/new-components/FAQTag';
import { FAQCard } from '@/new-components/FAQCard';

interface PageProps {
  params: {
    lang: string;
  };
}

export default function AiFaqPage({ params }: PageProps) {
  const langPrefix = `/${params.lang}`;

  return (
    <>
      <section className="container -mt-24 pt-44 pb-14">
        <h1
          aria-label="Frequently Asked Questions"
          className="mb-4 text-center text-4xl font-medium"
        >
          <span>Frequently Asked </span>
          <GradientText>Questions</GradientText>
        </h1>
        <p className="mb-11 text-center text-zinc-400">
          Find answers to common questions about Sealos
        </p>

        <div className="border-gradient-glass mx-auto flex max-w-2xl rounded-xl p-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-full w-fit shrink-0 items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5">
              <span>All Categories</span>
              <ChevronDownIcon size={16} />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>label</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>1</DropdownMenuItem>
              <DropdownMenuItem>2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mx-3 my-2 border-r" />

          <input
            type="text"
            placeholder="Search questions"
            className="w-full outline-none"
          />
        </div>
      </section>

      <section className="container min-h-[calc(100vh-800px)]">
        <div className="text-muted-foreground mb-8 flex items-center gap-2">
          <ListIcon size={16} />
          <span>Showing 1400 questions</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FAQCard
            tag={{ label: 'Platform Value & Trends', color: 'bg-blue-400' }}
            title='What exactly is an "Intelligent Cloud OS"?'
            description="It means we're more than just a hosting platform. Sealos is an integrated system where an AI core (our AI Pilot) understands how development, deployment, and databases should work together. You describe what you want, and the OS intelligently handles the how."
            href={`${langPrefix}/ai-quick-reference/intelligent-cloud-os`}
          />
        </div>
      </section>
    </>
  );
}
