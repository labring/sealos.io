import { Button } from '@/components/ui/button';
import { GradientText } from '@/new-components/GradientText';
import { RssIcon } from 'lucide-react';

export function BlogHeader() {
  return (
    <div>
      <h1
        aria-label="Sealos Blog"
        className="mb-4 text-center text-4xl font-medium"
      >
        <span>Sealos </span>
        <GradientText>Blog</GradientText>
      </h1>
      <p className="text-center text-zinc-400">
        Sharing our technical insights, product updates and industry news
      </p>

      <div className="mt-10 flex w-full justify-center">
        <Button variant="landing-primary" className="h-10" asChild>
          <a href="/rss.xml">
            <RssIcon size={16} className="mr-2" />
            <span>Subscribe</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
