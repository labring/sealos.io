# 性能优化快速参考

## 📦 新增文件

### 工具类
- `lib/browser-detection.ts` - 浏览器品牌检测

### 组件
- `components/AnimationViewport.tsx` - 视口监听封装
- `components/GlowingEffectManager.tsx` - 共享事件管理器

---

## 🔧 修改的组件

### 全局优化（所有浏览器）

#### 1. GodRays.tsx
```diff
+ IntersectionObserver 监听可见性
+ 不在视口时跳过渲染
- 移除了 Firefox 降级策略
```

#### 2. GlowingContainer.tsx
```diff
+ 使用共享事件管理器（4个监听器→1个）
+ IntersectionObserver 监听可见性
+ 不在视口时跳过计算
- 移除了 Firefox 降级策略
```

#### 3. FallingTags.tsx
```diff
+ 双重 IntersectionObserver
  - 首次进入：启动动画
  - 持续监听：暂停/恢复
+ 不在视口时跳过 DOM 更新
```

#### 4. HeroBackground.tsx
```diff
+ IntersectionObserver 监听可见性
+ 不在视口时跳过鼠标计算
+ 离开视口时重置状态
- 移除了 Firefox 降级策略
```

---

### Firefox 单独适配

#### AnimatedCarouselContainer.tsx ⭐
```diff
+ 检测 Firefox 浏览器
+ Firefox: 移除 blur 动画，简化动画变体
+ 其他浏览器: 保持完整 blur 效果
```

**Firefox 动画**:
- ❌ 无 `filter: blur`
- ✅ scale: 1.02 (更小的缩放)
- ✅ y: 10px (更小的位移)
- ✅ duration: 0.4s (更快)

**其他浏览器动画**:
- ✅ `filter: blur(8px)`
- ✅ scale: 1.05
- ✅ y: 20px
- ✅ duration: 0.6s

---

## 🎯 使用示例

### 浏览器检测
```typescript
import { isFirefox, getBrowserBrand } from '@/lib/browser-detection';

// 方式 1: 直接判断
if (isFirefox()) {
  // Firefox 特殊处理
}

// 方式 2: 获取品牌
const brand = getBrowserBrand(); // 'firefox' | 'chrome' | 'safari' | 'unknown'
```

### 视口监听
```typescript
import { AnimationViewport } from './components/AnimationViewport';

<AnimationViewport threshold={0.1} rootMargin="100px">
  {(isVisible) => (
    <MyComponent paused={!isVisible} />
  )}
</AnimationViewport>
```

### 共享事件管理器
```typescript
import GlowingEffectManager from './components/GlowingEffectManager';

useEffect(() => {
  const manager = GlowingEffectManager.getInstance();
  const unsubscribe = manager.subscribe((position) => {
    // 处理鼠标位置
  });
  
  return unsubscribe;
}, []);
```

---

## 📊 性能对比

| 项目 | 优化前 | 优化后 | 说明 |
|------|--------|--------|------|
| **鼠标监听器** | 4个 | 1个 | GlowingEffect 共享 |
| **不可见时渲染** | 持续 | 跳过 | 所有组件 |
| **Firefox Blur** | 有 | 无 | 仅 AnimatedCarouselContainer |
| **视觉效果损失** | - | 最小 | 仅轮播动画简化 |

---

## ✅ 检查清单

### 测试项
- [ ] Chrome: 所有动画完整
- [ ] Firefox: 轮播动画流畅（无卡顿）
- [ ] Firefox: 其他效果与 Chrome 一致
- [ ] 滚动时: 不可见组件停止渲染
- [ ] 鼠标移动: 仅 1 个全局监听器

### 性能指标
- [ ] Firefox DevTools 无性能警告
- [ ] 轮播切换流畅（Firefox）
- [ ] 滚动流畅
- [ ] CPU 使用合理

---

## 🐛 故障排查

### 动画不工作
1. 检查 `isVisible` 状态
2. 检查 IntersectionObserver 是否正确初始化
3. 检查浏览器控制台错误

### Firefox 仍然卡顿
1. 确认 AnimatedCarouselContainer 已应用 Firefox 适配
2. 检查是否有其他组件使用 blur 动画
3. 考虑添加更多组件级适配

### 视觉效果异常
1. 确认非 AnimatedCarouselContainer 组件未做降级
2. 检查 CSS 是否被意外修改
3. 对比 Chrome 和 Firefox 的渲染差异

---

*快速参考 v1.0 - 2025-10-20*
