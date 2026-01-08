import Image from 'next/image';

interface AppScreenshotsProps {
  app: {
    name: string;
    screenshots?: string[];
  };
}

export default function AppScreenshots({ app }: AppScreenshotsProps) {
  if (!app.screenshots || app.screenshots.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        Screenshots
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {app.screenshots.map((screenshot: string, index: number) => (
          <div key={index} className="relative aspect-video">
            <Image
              src={screenshot}
              alt={`${app.name} screenshot ${index + 1}`}
              fill
              className="rounded-lg border border-white/10 object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
        ))}
      </div>
    </div>
  );
}
