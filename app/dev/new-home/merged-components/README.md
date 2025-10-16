# 黑色背景部分组件迁移说明

## 概述

此目录包含从 `app/[lang]/(home)/` 迁移过来的第六屏、第七屏和页脚相关组件，用于 new-home 页面的调试和开发。

## 组件列表

### 主组件

- **SourceAvailSection.tsx** - 原 `sixth-screen.tsx`，包含第六屏的完整内容
- **OSSSection.tsx** - 原 `hero-section.tsx`，100% 开源可用部分
- **Footer.tsx** - 页脚组件，包含 Sealos 大字背景和法律链接
- **FAQSection.tsx** - 常见问题部分

### 支持组件

- **StatsCards.tsx** - 统计卡片（GitHub Stars, Contributors 等）
- **WhySourceAvailableMatters.tsx** - 为什么开源很重要部分
- **SealosSticky.tsx** - Sealos 背景文字的粘性效果组件
- **CountUp.tsx** - 数字计数动画组件
- **FooterIcons.tsx** - Footer 中使用的 SVG 图标

## 图片资源

所有相关图片已移动到 `app/dev/new-home/assets/` 目录：

- `light1.png`, `light2.png`, `light3.png` - 光照背景图
- `liht4.png` - 第七屏与页脚之间的光照背景
- `lt.png`, `rt.png`, `lb.png`, `rb.png` - 用户评价头像

## 样式处理

按照要求，样式已经尽量使用 Tailwind CSS 类，无法用 Tailwind 表达的样式已经内联到组件中，避免污染 global.css。

## 使用方式

查看 `app/dev/new-home/test-merged.tsx` 文件，了解如何使用这些组件。

```tsx
import SourceAvailSection from './merged-components/SourceAvailSection';
import FAQSection from './merged-components/FAQSection';
import Footer from './merged-components/Footer';

// 在页面中使用
<div className="bg-black">
  <div className="site-shell">
    <SourceAvailSection lang="en" />
  </div>
  <FAQSection />
  <Footer lang="en" />
</div>;
```

## 图片导入

所有图片都使用 Next.js 的 Image 组件导入：

```tsx
import light1 from '../assets/light1.png';
import Image from 'next/image';

<Image src={light1} alt="" className="h-auto w-full select-none" priority />;
```

## 注意事项

1. 所有组件都是客户端组件（'use client'）
2. Footer 组件提取了所有 SVG 到 FooterIcons.tsx 中
3. CountUp 组件是项目内部实现，不依赖外部库
4. 样式完全独立，不依赖 global.css
