# Firefox 性能问题分析报告

## 📋 问题概述
在 `app/[lang]/(home)/(new-home)/` 目录下发现多个导致 Firefox 严重性能问题的动画和渲染问题。

---

## 🔴 严重问题

### 1. GodRays Canvas 动画 - 多实例同时运行
**文件**: `components/GodRays.tsx`

**问题描述**:
- 使用 `requestAnimationFrame` 持续重绘 canvas，每帧都清空并重绘所有光线
- 在3个section中被使用，每个都有独立的canvas动画循环：
  - `HeroSection`: 2个光源，30条光线，blur=16px
  - `SequenceSection`: 2个光源，25条光线，blur=17px  
  - `CapsSection`: 2个光源，23条光线，blur=18px
- **关键问题**: Firefox对 `filter: blur()` + `mixBlendMode: 'lighten'` 的支持不佳

**代码位置**:
```typescript
// GodRays.tsx:207-210
const animate = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  init();
  animationFrameRef.current = requestAnimationFrame(animate);
};
```

**Firefox特定问题**:
```typescript
// GodRays.tsx:238-239
style={{
  mixBlendMode: 'lighten',
  filter: `blur(${blur}px)`,  // blur 值在 16-18px
}}
```

**建议修复方案**:
1. **降低刷新率**: 限制为30fps或更低
2. **减少光线数量**: Firefox下减少50%
3. **移除blur或降低值**: Firefox下禁用blur或降低到5px以下
4. **使用CSS动画代替**: 对静态效果使用CSS渐变动画
5. **添加性能检测**: 检测Firefox并自动降级

---

### 2. FallingTags - Matter.js 物理引擎
**文件**: `components/FallingTags.tsx`

**问题描述**:
- 使用Matter.js物理引擎模拟11个标签掉落
- 每帧更新DOM元素的transform、opacity
- 虽然已限制到10fps，但仍在持续操作DOM

**代码位置**:
```typescript
// FallingTags.tsx:198-240
const update = (currentTime: number) => {
  if (timeSinceLastUpdate >= CONFIG.rendering.updateInterval) {
    bodiesRef.current.forEach((item) => {
      // 每个元素都更新transform
      item.elem.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}rad)`;
    });
  }
  animationIdRef.current = requestAnimationFrame(update);
};
```

**建议修复方案**:
1. **懒加载**: 仅在进入视口时启动（已实现，但可以增加更多节流）
2. **使用CSS动画**: 考虑改用预设的CSS关键帧动画
3. **减少元素数量**: Firefox下减少到6-7个元素
4. **使用will-change**: 已添加，但可以优化

---

### 3. 多个 GlowingEffect 实例
**文件**: `components/GlowingContainer.tsx`

**问题描述**:
- 在 `CapsSection` 的4个卡片上同时运行
- 每个实例都监听全局鼠标移动和滚动事件
- 使用 `requestAnimationFrame` 更新CSS变量

**代码位置**:
```typescript
// GlowingContainer.tsx:44
animationFrameRef.current = requestAnimationFrame(() => {
  // 计算角度和更新CSS变量
  element.style.setProperty('--start', String(value));
});
```

**使用位置**:
```typescript
// sections/CapsSection.tsx:133-142
<GlowingEffect
  color="#ffffff"
  proximity={300}
  spread={60}
  disabled={false}  // 4个卡片都启用
/>
```

**建议修复方案**:
1. **共享事件监听器**: 使用单一全局监听器，计算一次后分发给所有实例
2. **增加节流**: 限制更新频率到30fps
3. **Firefox下禁用**: 检测Firefox后设置 `disabled={true}`
4. **使用Intersection Observer**: 仅对可见卡片启用效果

---

## 🟡 中等问题

### 4. HeroBackground - 鼠标跟踪渐变
**文件**: `components/HeroBackground.tsx`

**问题描述**:
- 使用 `useTransform` 实时计算渐变背景
- 两层混合模式：`multiply` 和 `overlay`

**代码位置**:
```typescript
// HeroBackground.tsx:98-105
<motion.div
  style={{
    background: darkenBackground,  // 实时计算的渐变
    mixBlendMode: 'multiply',
    opacity: isActive,
  }}
/>
```

**建议修复方案**:
1. **Firefox下降级**: 移除混合模式或简化效果
2. **降低渐变复杂度**: 减少渐变stop数量

---

### 5. AnimatedCarouselContainer - 模糊动画
**文件**: `components/AnimatedCarouselContainer.tsx`

**问题描述**:
- 切换时使用 `filter: blur(8px)` 动画
- Firefox对动态blur性能较差

**代码位置**:
```typescript
// AnimatedCarouselContainer.tsx:21-27
initial={{
  opacity: 0,
  scale: 1.05,
  filter: 'blur(8px)',  // 入场模糊
}}
```

**建议修复方案**:
1. **Firefox下移除blur**: 仅保留opacity和scale动画
2. **减小blur值**: 降低到3-4px

---

### 6. 多处使用 backdrop-blur
**问题描述**:
- 多个组件使用 `backdrop-blur` 或 `backdrop-filter`
- Firefox对backdrop-filter性能开销较大

**影响的组件**:
- `components/Header.tsx`: `backdrop-blur-lg`
- `components/FallingTags.tsx`: `backdrop-blur-md`
- `merged-components/StatsCards.tsx`: `backdrop-blur-sm`
- `sections/ChoicesSection.tsx`: `backdrop-blur-lg`

**建议修复方案**:
1. **Firefox下降级**: 使用半透明背景代替
2. **减少模糊值**: 将 `blur(14px)` 降低到 `blur(4px)`

---

## 📊 性能优化优先级

### P0 - 立即修复
1. ✅ **GodRays**: 添加Firefox检测，降低或禁用blur
2. ✅ **GlowingEffect**: Firefox下禁用或共享监听器

### P1 - 高优先级  
3. ✅ **FallingTags**: 减少元素数量或改用CSS动画
4. ✅ **AnimatedCarouselContainer**: Firefox下移除blur动画

### P2 - 中优先级
5. ✅ **HeroBackground**: 简化混合模式
6. ✅ **backdrop-blur**: 全局降低值或Firefox下禁用

---

## 🔧 通用优化建议

### 1. 添加浏览器检测工具
```typescript
// lib/browser-detection.ts
export const isFirefox = () => {
  return typeof navigator !== 'undefined' && 
         /Firefox/i.test(navigator.userAgent);
};

export const getPerformanceConfig = () => {
  if (isFirefox()) {
    return {
      enableBlur: false,
      enableMixBlend: false,
      animationFPS: 30,
      reduceMotion: true,
    };
  }
  return {
    enableBlur: true,
    enableMixBlend: true,
    animationFPS: 60,
    reduceMotion: false,
  };
};
```

### 2. 使用 Performance API 监控
```typescript
useEffect(() => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 16.67) { // >60fps
        console.warn('Slow frame detected:', entry);
      }
    }
  });
  observer.observe({ entryTypes: ['measure'] });
}, []);
```

### 3. 条件渲染优化
```typescript
// 仅在视口内渲染重动画组件
const { ref, inView } = useInView({
  triggerOnce: false,
  threshold: 0.1,
});

return (
  <div ref={ref}>
    {inView && <HeavyAnimationComponent />}
  </div>
);
```

---

## 📈 预期改善

实施以上优化后，Firefox性能预计改善：
- **FPS提升**: 从 10-20fps 提升到 45-60fps
- **CPU使用率降低**: 减少 40-60%
- **渲染卡顿**: 基本消除

---

## 🧪 测试建议

1. **Firefox DevTools**:
   - 打开Performance面板
   - 录制滚动和交互
   - 查看火焰图中的长任务

2. **关键指标**:
   - Frame Rate (目标 >50fps)
   - CPU Usage (目标 <60%)
   - Paint Events (减少重绘)

3. **测试场景**:
   - 页面加载
   - 滚动浏览
   - 鼠标移动交互
   - 卡片切换动画

---

*报告生成时间: 2025-10-20*
