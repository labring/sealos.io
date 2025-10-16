# Tailwind CSS 样式转换总结

已完成将 merged-components 中的内联样式转换为 Tailwind classes。

## 已更新的组件

### ✅ OSSSection.tsx

- Badge: `w-[221px] h-10 px-4 py-2.5 rounded-full border border-white/5 bg-white/5`
- Title: `text-[40px] font-medium leading-[150%]`
- Gradient text: `bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent`
- Description: `text-zinc-400 text-base font-normal leading-6 w-[492px]`
- Buttons: `flex w-44 h-10 items-center justify-center gap-2 rounded-full`

### ✅ StatsCards.tsx

- Container: `h-[196px] rounded-[20px] gap-7 p-6`
- Text colors: `text-zinc-200`, `text-zinc-400`
- Gradient number: `bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent`
- Icons: `shrink-0 w-4 h-4`

### ✅ WhySourceAvailableMatters.tsx

- Layout: `flex justify-between items-start h-[612px] w-full`
- Title: `text-white text-3xl font-medium leading-none mb-16`
- Feature container: `flex w-full h-20 items-start gap-12`
- Testimonial: `flex w-full flex-col items-start gap-4`
- Image: `rounded-full object-cover aspect-square`
- Grid borders: `border-white/20`, `border-white/15`
- Positioning: `absolute z-[1] -translate-y-1/2`

### ✅ FAQSection.tsx

- Container: `mt-24 px-16`
- Layout: `flex flex-row items-start w-full gap-20`
- Title: `text-white text-4xl font-medium leading-[150%]`
- Gradient: `bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent`
- Button: `w-full bg-transparent border-none text-white text-lg`
- Hover: `hover:text-zinc-200 hover:bg-zinc-500/30`
- Rotation: `rotate-180`, `rotate-0`
- Answer: `text-zinc-600 text-sm font-normal leading-5`

### ✅ SealosSticky.tsx

- Wrapper: `relative`
- Mask: `sticky top-0 left-0 right-0 bg-black z-[2]`
- Letters: `sticky top-0 mt-20 mb-5 flex items-end justify-center`
- Padding: `px-16`
- Z-index: `z-[1]`, `z-[2]`

### ⚠️ Footer.tsx

Footer 组件包含复杂的 SVG 和多语言支持，保留了部分内联样式以确保精确布局。
主要更新：

- 外层容器: `relative w-full bg-black pt-0`
- 内容区: `relative z-10 flex flex-col items-start justify-between px-16 text-sm`
- 标题: `text-[32px] font-medium leading-[48px] mb-4`
- 按钮: `inline-flex items-center gap-2 px-4 py-2 rounded-[54px]`

## Tailwind 颜色映射

| 设计颜色              | Tailwind Class |
| --------------------- | -------------- |
| #FFFFFF               | `white`        |
| #E4E4E7               | `zinc-200`     |
| #A1A1AA               | `zinc-400`     |
| #52525B               | `zinc-600`     |
| #18181B               | `zinc-900`     |
| #146DFF               | `blue-600`     |
| rgba(255,255,255,0.1) | `white/10`     |
| rgba(255,255,255,0.2) | `white/20`     |

## 渐变转换

| 原渐变                                                    | Tailwind                                   |
| --------------------------------------------------------- | ------------------------------------------ |
| linear-gradient(90deg, #FFF 0%, #146DFF 100%)             | `bg-gradient-to-r from-white to-blue-600`  |
| linear-gradient(180deg, #FFFFFF 0%, #BABABA 100%)         | `bg-gradient-to-b from-white to-gray-400`  |
| linear-gradient(191.74deg, #FFFFFF 8.86%, #CECECE 91.87%) | `bg-gradient-to-br from-white to-gray-300` |

## 间距近似

| 设计值 | Tailwind              |
| ------ | --------------------- |
| 4px    | `gap-1`               |
| 8px    | `gap-2`               |
| 12px   | `gap-3`               |
| 16px   | `gap-4`               |
| 20px   | `gap-5`               |
| 24px   | `gap-6`               |
| 28px   | `gap-7`               |
| 32px   | `gap-8`               |
| 48px   | `gap-12`              |
| 64px   | `gap-16` / `px-16`    |
| 80px   | `gap-20`              |
| 100px  | `mt-24` (96px 近似)   |
| 104px  | `mt-[104px]` (精确值) |

## 特殊样式保留

以下样式因为需要精确控制而保留内联：

- 百分比定位：`top: '45.588%'`, `left: 'calc(...)'`
- CSS 变量：`height: 'var(--sealosCoverH, 0px)'`
- 复杂的 calc 计算
- SVG borderImage 渐变
- 动画关键帧

## 使用建议

1. 优先使用 Tailwind 原生 class
2. 需要精确像素值时使用方括号：`w-[221px]`
3. 透明度使用斜杠语法：`bg-white/10`
4. 复杂计算保留内联样式
5. 响应式断点：`sm:`, `md:`, `lg:`
