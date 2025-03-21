import { languagesType } from '@/lib/i18n';
import CategoryBar from './CategoryBar';
import TagBar from './TagBar';

interface BlogHeaderProps {
  lang: languagesType;
  categories: string[];
  tags: string[];
}

type Text = Record<'title'|'description'|'cates'| 'all_cates'|'filter_tag'|'clear'|'all_tag', string>;


const translations: Record<languagesType, Text> = {
  en: {
    title: 'Blog',
    description:
      'Sharing our technical insights, product updates and industry news',
    cates: 'Categories',
    all_cates: 'All Categories',
    filter_tag: 'Filter by Tags',
    clear: 'Clear',
    all_tag: 'All Tags',
  },
  'zh-cn': {
    title: '博客',
    description: '分享我们的技术洞见、产品更新和行业新闻',
    cates: '分类',
    all_cates: '所有分类',
    filter_tag: '按标签过滤',
    clear: '清除',
    all_tag: '所有标签',
  },
};




export default function BlogHeader({
  lang,
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
          {text.title}
        </h1>
        <div className="flex flex-row justify-center gap-2.5 max-sm:flex-col max-sm:items-stretch">
          <p className="text-center text-lg text-muted-foreground">
            {text.description}
          </p>
        </div>
      </div>
      <CategoryBar categories={categories} text={text} />
      <div className="hidden sm:block">
        <TagBar tags={tags} text={text}/>
      </div>
    </div>
  );
}
