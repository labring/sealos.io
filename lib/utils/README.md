# Utility Functions

This directory contains reusable utility functions that help eliminate code duplication across the project.

## Translation Utils (`translations.ts`)

Provides type-safe translation management for components.

### Usage

```tsx
import { createTranslationHook, type TranslationConfig } from '@/lib/utils/translations';

const translations: TranslationConfig<{
  title: string;
  description: string;
}> = {
  en: {
    title: 'Hello World',
    description: 'Welcome to our app',
  },
  'zh-cn': {
    title: '你好世界',
    description: '欢迎使用我们的应用',
  },
};

const useTranslations = createTranslationHook(translations);

function MyComponent({ lang }: { lang: languagesType }) {
  const t = useTranslations(lang);
  return <h1>{t.title}</h1>;
}
```

### Common Translations

Use `getCommonTranslations()` for frequently used translations:

```tsx
import { getCommonTranslations } from '@/lib/utils/translations';

function MyComponent({ lang }: { lang: languagesType }) {
  const commonT = getCommonTranslations(lang);
  return <button>{commonT.getStarted}</button>;
}
```

## Style Variants (`style-variants.ts`)

Provides consistent styling patterns using CVA (Class Variance Authority).

### Usage

```tsx
import { containerVariants, cardVariants, textVariants } from '@/lib/utils/style-variants';

function MyComponent() {
  return (
    <div className={containerVariants({ size: 'lg', padding: 'md' })}>
      <div className={cardVariants({ hover: 'lift', padding: 'lg' })}>
        <h1 className={textVariants({ size: '2xl', weight: 'bold' })}>
          Title
        </h1>
      </div>
    </div>
  );
}
```

## Available Variants

- `containerVariants`: Container layouts with padding and spacing options
- `sectionVariants`: Section spacing and background variants
- `cardVariants`: Card styling with different variants and sizes
- `textVariants`: Typography variants for consistent text styling
- `gridVariants`: Responsive grid layouts

## Common Translations

The `commonTranslations` object provides frequently used translations like "Get Started", "Learn More", etc.

```tsx
import { getCommonTranslations } from '@/lib/utils/translations';

const common = getCommonTranslations('en');
console.log(common.getStarted); // "Get Started"
```

## Benefits

1. **Type Safety**: All translations are type-checked
2. **Consistency**: Reusable styling patterns
3. **Maintainability**: Single source of truth for common patterns
4. **Performance**: Reduced bundle size through code reuse
5. **Developer Experience**: Auto-completion and error checking
