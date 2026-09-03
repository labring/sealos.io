import { Button } from '@/components/ui/button';
import { ContentIndexHeader } from '@/components/content-index-header';
import { RssIcon } from 'lucide-react';

export function BlogHeader() {
  return (
    <ContentIndexHeader
      prefix="Sealos"
      accent="Blog"
      description="Sharing our technical insights, product updates and industry news"
      action={
        <Button variant="landing-primary" className="h-10" asChild>
          <a href="/rss.xml">
            <RssIcon size={16} className="mr-2" />
            <span>Subscribe</span>
          </a>
        </Button>
      }
    />
  );
}
