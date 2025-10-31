import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  BlogPost,
  formatCategoryTitle,
  getBlogImage,
  getPageCategory,
  getRelatedArticles,
} from '@/lib/utils/blog-utils';

interface RelatedArticlesProps {
  currentArticle: BlogPost;
  relatedArticles: BlogPost[];
  lang: string;
}

type LocaleKey = 'en' | 'zh-cn';

const LABELS: Record<
  LocaleKey,
  {
    heading: string;
    empty: string;
    error: string;
  }
> = {
  en: {
    heading: 'Related Articles',
    empty: 'No related articles available right now.',
    error: 'Something went wrong while loading related articles.',
  },
  'zh-cn': {
    heading: '相关文章',
    empty: '暂无相关文章推荐。',
    error: '加载相关文章时出现问题。',
  },
};

type ErrorKey = 'missingCurrentArticle' | 'invalidArticles' | 'computeFailed';

export default function RelatedArticles({
  currentArticle,
  relatedArticles,
  lang,
}: RelatedArticlesProps) {
  const locale: LocaleKey = lang === 'zh-cn' ? 'zh-cn' : 'en';
  const labels = LABELS[locale];

  let articlesToRender: BlogPost[] = [];
  let errorKey: ErrorKey | null = null;

  if (!currentArticle) {
    errorKey = 'missingCurrentArticle';
  } else if (!Array.isArray(relatedArticles)) {
    errorKey = 'invalidArticles';
  } else {
    try {
      articlesToRender = getRelatedArticles(currentArticle, relatedArticles, {
        maxRecommendations: 4,
      });
    } catch (error) {
      console.error('RelatedArticles: failed to compute recommendations', error);
      errorKey = 'computeFailed';
      articlesToRender = [];
    }
  }

  const hasError = Boolean(errorKey);
  const showEmptyState = !hasError && articlesToRender.length === 0;

  return (
    <section
      aria-labelledby="related-articles-heading"
      className="mt-16 space-y-6"
    >
      <header className="flex items-center justify-between">
        <h2
          id="related-articles-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          {labels.heading}
        </h2>
      </header>

      {hasError ? (
        <div className="border-destructive/40 bg-destructive/10 text-destructive flex items-center rounded-lg border px-4 py-3 text-sm">
          {labels.error}
        </div>
      ) : showEmptyState ? (
        <div className="border-muted bg-muted/40 text-muted-foreground flex items-center rounded-lg border px-4 py-3 text-sm">
          {labels.empty}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {articlesToRender.map((article) => {
            const category = getPageCategory(article);
            const imageSrc =
              article.data?.image ?? getBlogImage(article, category);
            const description =
              article.data?.description ??
              (locale === 'zh-cn'
                ? '欢迎阅读完整文章以了解更多内容。'
                : 'Read the full article to learn more.');

            return (
              <Link
                key={article.url ?? article.data.title}
                href={article.url}
                className="bg-card text-card-foreground group flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 no-underline hover:no-underline"
                prefetch={false}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={article.data.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={false}
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <Badge
                    variant="secondary"
                    className="bg-secondary/70 text-xs uppercase tracking-wide"
                  >
                    {formatCategoryTitle(category)}
                  </Badge>
                  <h3 className="line-clamp-2 text-lg font-semibold leading-snug">
                    {article.data.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
