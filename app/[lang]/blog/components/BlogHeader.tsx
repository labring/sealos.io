import { languagesType } from '@/lib/i18n';
import CategoryBar from './CategoryBar';
import TagBar from './TagBar';
import { RSSButton } from '@/components/ui/rss-button';

interface BlogHeaderProps {
  lang: languagesType;
  title: string;
  description?: string;
  categories: string[];
  tags: string[];
}

export const translations: Record<languagesType, Record<'cats' | 'all_cats' | 'filter_tag' | 'clear' | 'all_tag', string>> = {
  en: {
    cats: 'Categories',
    all_cats: 'All Categories',
    filter_tag: 'Filter by Tags',
    clear: 'Clear',
    all_tag: 'All Tags',
  },
  'zh-cn': {
    cats: '分类',
    all_cats: '所有分类',
    filter_tag: '按标签过滤',
    clear: '清除',
    all_tag: '所有标签',
  },
};


export default function BlogHeader({
  lang,
  title,
  description,
  categories,
  tags,
}: BlogHeaderProps) {
  const text = translations[lang];

  return (
    <div>
      <div className="py-12 pt-28">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-lg bg-primary/10 px-4 py-1.5 text-lg font-medium text-primary">
            Sealos Blog
          </span>
        </div>
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
        <div className="flex justify-center mt-6">
          <RSSButton lang={lang} />
        </div>
      </div>
      <CategoryBar categories={categories} text={text} />
      <div className="hidden sm:block">
        <TagBar tags={tags} text={text} />
      </div>
    </div>
  );
}
