# Footer 链接显示修复

## 问题
Footer 中的链接没有正确显示。

## 原因
Footer Links 部分的容器设置了 `display: 'none'`，导致所有链接被隐藏。

## 修复内容

### 1. Footer Links 容器 ✅
**修复前：**
```tsx
<div style={{ display: 'none', ... }}>
```

**修复后：**
```tsx
<div className="mt-10 hidden w-full grid-cols-1 gap-4 text-center sm:grid sm:grid-cols-2 sm:gap-y-8 lg:mt-0 lg:grid-cols-4 lg:items-start lg:gap-10 lg:text-left">
```

现在使用 Tailwind 的响应式 grid：
- 移动端：`hidden`（默认隐藏）
- 小屏幕 (sm)：`sm:grid sm:grid-cols-2`（2列网格）
- 大屏幕 (lg)：`lg:grid-cols-4`（4列网格）

### 2. FooterLink 组件样式 ✅
**修复前：**
```tsx
<Link href={href} style={{ color: '#A1A1AA', fontWeight: 500, textDecoration: 'none' }}>
```

**修复后：**
```tsx
<Link href={href} className="text-zinc-400 font-medium hover:text-blue-600 hover:underline hover:underline-offset-4 transition-colors">
```

新增悬停效果：
- 默认：灰色文字 `text-zinc-400`
- 悬停：蓝色 `hover:text-blue-600` + 下划线 `hover:underline`
- 平滑过渡 `transition-colors`

### 3. 底部栏样式更新 ✅
将法律链接、版权和社交图标区域全部转换为 Tailwind classes：

**容器：**
```tsx
className="relative z-10 flex flex-col items-center gap-2 px-16 py-4 text-center text-xs lg:flex-row lg:items-center lg:justify-between lg:gap-0"
```

**法律链接：**
```tsx
className="order-1 flex flex-wrap justify-center gap-2 text-zinc-400 font-normal lg:order-none"
```

**版权信息：**
```tsx
className="order-3 text-zinc-400 font-normal lg:order-none lg:px-4"
```

**社交图标：**
```tsx
className="order-2 flex justify-center gap-4 lg:order-none"
```

### 4. 社交图标按钮 ✅
所有社交媒体图标都更新为 Tailwind classes：

```tsx
// 通用图标（GitHub, Discord, Twitter, YouTube, RSS）
className="flex w-8 h-8 items-center justify-center rounded-full bg-zinc-600/35 text-white hover:bg-zinc-400/60 transition-colors"

// 中国特定图标（Bilibili, WeChat）
className="flex w-8 h-8 items-center justify-center rounded-full bg-zinc-600 text-white hover:bg-zinc-400 transition-colors"
```

特性：
- 固定尺寸：`w-8 h-8`（32px）
- 圆形：`rounded-full`
- 半透明背景：`bg-zinc-600/35`
- 悬停效果：`hover:bg-zinc-400/60`
- 平滑过渡：`transition-colors`

## 布局说明

### 响应式显示
- **移动端（< 640px）**：Footer Links 隐藏，只显示 CTA 和底部栏
- **小屏幕（640px - 1023px）**：Footer Links 显示为 2 列网格
- **大屏幕（≥ 1024px）**：Footer Links 显示为 4 列网格

### Order 顺序（用于响应式布局）
在小屏幕上：
1. Legal Links (order-1)
2. Social Icons (order-2)
3. Copyright (order-3)

在大屏幕上：
- Legal Links | Copyright | Social Icons（横向排列）

## 测试检查清单
- [x] Footer Links 在大屏幕上正确显示（4列）
- [x] Footer Links 在小屏幕上正确显示（2列）
- [x] 链接悬停效果正常（变蓝色+下划线）
- [x] 法律链接正确显示
- [x] 版权信息正确显示
- [x] 社交图标正确显示
- [x] 社交图标悬停效果正常（背景变亮）
- [x] 中英文切换正常（Bilibili/WeChat 仅在中文显示）

## 相关文件
- `app/dev/new-home/merged-components/Footer.tsx`
- `app/dev/new-home/merged-components/FooterIcons.tsx`
