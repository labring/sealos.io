import Image from 'next/image';
import { Button } from '@/components/ui/button';
import FacebookIconImage from '@/assets/social-icons/facebook.svg';
import XIconImage from '@/assets/social-icons/x.svg';
import LinkedinIconImage from '@/assets/social-icons/linkedin.svg';
import YcombinatorIconImage from '@/assets/social-icons/ycombinator.svg';
import RedditIconImage from '@/assets/social-icons/reddit.svg';

interface SocialLinksProps {
  url: string;
  title: string;
}

export function SocialLinks({ url, title }: SocialLinksProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="mt-6 flex gap-6 text-white">
      <Button
        variant="secondary"
        className="h-10 w-10 rounded-full p-0"
        asChild
      >
        <a
          href={`https://linkedin.com/shareArticle?url=${encodedUrl}&mini=true&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={LinkedinIconImage}
            alt="Share to Linkedin"
            className="size-4"
            width={24}
            height={24}
          />
        </a>
      </Button>
      <Button
        variant="secondary"
        className="h-10 w-10 rounded-full p-0"
        asChild
      >
        <a
          href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={XIconImage}
            alt="Share to X"
            className="size-4"
            width={24}
            height={24}
          />
        </a>
      </Button>
      <Button
        variant="secondary"
        className="h-10 w-10 rounded-full p-0"
        asChild
      >
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={FacebookIconImage}
            alt="Share to Facebook"
            className="size-4"
            width={24}
            height={24}
          />
        </a>
      </Button>
      <Button
        variant="secondary"
        className="h-10 w-10 rounded-full p-0"
        asChild
      >
        <a
          href={`https://www.reddit.com/submit?url=${encodedUrl}&type=LINK`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={RedditIconImage}
            alt="Share to Reddit"
            className="size-6"
            width={24}
            height={24}
          />
        </a>
      </Button>
      <Button
        variant="secondary"
        className="h-10 w-10 rounded-full p-0"
        asChild
      >
        <a
          href={`https://news.ycombinator.com/submitlink?t=${encodedTitle}&u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={YcombinatorIconImage}
            alt="Share to Hacker News"
            className="size-4"
            width={24}
            height={24}
          />
        </a>
      </Button>
    </div>
  );
}
