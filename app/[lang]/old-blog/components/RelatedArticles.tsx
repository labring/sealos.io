import { BlogPost, getRelatedArticles } from '@/lib/utils/blog-utils';
import BlogItem from '@/app/[lang]/(home)/blog/components/BlogItem';

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
      console.error(
        'RelatedArticles: failed to compute recommendations',
        error,
      );
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {articlesToRender.map((article) => (
            <BlogItem
              key={article.url ?? article.data.title}
              page={article}
              priorityImage={false}
            />
          ))}
        </div>
      )}
    </section>
  );
}
