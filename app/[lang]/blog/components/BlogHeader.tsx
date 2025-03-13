interface BlogHeaderProps {
  title: string;
  description?: string;
}

export default function BlogHeader({ title, description }: BlogHeaderProps) {
  return (
    <div className="py-16 pt-32">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
        {title}
      </h1>
      {description && (
        <div className="flex flex-row justify-center gap-2.5 max-sm:flex-col max-sm:items-stretch">
          <p className="text-center text-lg text-muted-foreground">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
