# 视口动画优化总结

## 概述
为所有动画组件添加了 IntersectionObserver 优化，使用 Framer Motion 的 `useInView` hook，在组件不在视口内时停止动画以提升性能。

## 优化的组件列表

### 1. RotatingWords 组件
**文件**: `app/[lang]/(home)/(new-home)/components/RotatingWords.tsx`
**优化内容**:
- 添加 `useInView` 检测
- 只在视口内时运行文字轮播动画
- 配置: `margin: '0px 0px -10% 0px'` (提前 10% 开始)

### 2. FallingTags 组件
**文件**: `app/[lang]/(home)/(new-home)/components/FallingTags.tsx`
**状态**: ✅ 已有 `useInView` 实现
- 使用 `once: true` 只触发一次
- 配置: `amount: 0.1` (10% 可见时触发)

### 3. GradientWave 组件
**文件**: `app/[lang]/(home)/(new-home)/components/GradientWave.tsx`
**优化内容**:
- 为主容器添加 `useInView`
- 将 `isInView` 状态传递给 `WaveLine` 子组件
- 不在视口时波形保持静止状态
- 配置: `margin: '0px 0px -20% 0px', amount: 0.3`

### 4. WorkflowProgress 组件
**文件**: `app/[lang]/(home)/(new-home)/components/WorkflowProgress.tsx`
**优化内容**:
- 添加 `useInView` 检测
- 在 `useMotionValueEvent` 中检查 `isInView`
- 不在视口时不更新阶段状态
- 配置: `margin: '0px 0px -20% 0px', amount: 0.3`

### 5. AnimatedCarouselContainer 组件 ⭐️
**文件**: `app/[lang]/(home)/(new-home)/components/AnimatedCarouselContainer.tsx`
**优化内容**:
- 添加 `useInView` 检测视口状态
- **Firefox 浏览器降级处理**:
  - 检测 Firefox 浏览器 (User Agent)
  - Firefox 下移除 `blur` 和 `scale` 效果
  - 使用更短的过渡时间 (0.4s vs 0.6s)
  - 减少 GPU 负载防止卡顿
- 不在视口时显示静态内容
- 配置: `margin: '0px 0px -10% 0px', amount: 0.2`

**Firefox 降级配置**:
```javascript
// Firefox 版本 - 无 blur 和 scale
const firefoxVariants = {
  initial: { opacity: 0, y: -20, zIndex: 10 },
  animate: { opacity: 1, y: 0, zIndex: 10 },
  exit: { opacity: 0, y: 20, zIndex: 20 },
};

// 标准版本 - 完整效果
const standardVariants = {
  initial: { opacity: 0, scale: 1.05, filter: 'blur(8px)', y: -20, zIndex: 10 },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, zIndex: 10 },
  exit: { opacity: 0, scale: 0.95, filter: 'blur(8px)', y: 20, zIndex: 20 },
};
```

### 6. GlowingEffect 组件
**文件**: `app/[lang]/(home)/(new-home)/components/GlowingContainer.tsx`
**优化内容**:
- 添加 `useInView` 检测
- 不在视口时不处理鼠标移动事件
- 不在视口时不监听 scroll 和 pointermove 事件
- 配置: `margin: '0px 0px -10% 0px', amount: 0.1`

### 7. GodRays 组件
**文件**: `app/[lang]/(home)/(new-home)/components/GodRays.tsx`
**优化内容**:
- 添加 `useInView` 检测
- 不在视口时跳过渲染但保持 RAF 循环
- 重新进入视口时自动恢复动画
- 配置: `margin: '0px 0px -10% 0px', amount: 0.1`

### 8. CapsSection 卡片组件

#### 8.1 AiRuntimeCard
**文件**: `app/[lang]/(home)/(new-home)/components/caps-image/AiRuntimeCard/index.tsx`
**优化内容**:
- 添加 `useInView` 检测
- 不在视口时停止所有 logo 滚动动画
- 配置: `margin: '0px 0px -10% 0px', amount: 0.2`

#### 8.2 DeploymentCard
**文件**: `app/[lang]/(home)/(new-home)/components/caps-image/DeploymentCard/index.tsx`
**优化内容**:
- 添加 `useInView` 检测
- 不在视口时停止渐变动画
- 配置: `margin: '0px 0px -10% 0px', amount: 0.2`

#### 8.3 StacksCard
**文件**: `app/[lang]/(home)/(new-home)/components/caps-image/StacksCard/index.tsx`
**优化内容**:
- 添加 `useInView` 检测
- 不在视口时停止所有三列的滚动动画
- 配置: `margin: '0px 0px -10% 0px', amount: 0.2`

#### 8.4 DBCard
**文件**: `app/[lang]/(home)/(new-home)/components/caps-image/DBCard/index.tsx`
**状态**: 无需优化 (静态图片，无动画)

## 配置说明

### margin 参数
- `-10%`: 组件底部进入视口前 10% 就开始动画
- `-20%`: 组件底部进入视口前 20% 就开始动画

### amount 参数
- `0.1`: 10% 的元素可见时触发
- `0.2`: 20% 的元素可见时触发
- `0.3`: 30% 的元素可见时触发

## 性能提升

### 预期效果
1. **CPU 使用率降低**: 不在视口的动画不再消耗 CPU 资源
2. **GPU 使用率降低**: 减少不必要的重绘和合成
3. **电池续航提升**: 移动设备上电池消耗显著降低
4. **Firefox 体验改善**: 通过降级处理解决卡顿问题
5. **整体流畅度**: 页面滚动更加流畅

### 优化策略
1. **使用 Framer Motion 的 `useInView`**: 利用 IntersectionObserver API
2. **条件动画**: `animate={isInView ? {...} : undefined}`
3. **浏览器检测**: Firefox 特定优化
4. **保持 RAF 循环**: GodRays 在离开视口时保持循环，便于恢复

## 兼容性
- ✅ Chrome/Edge: 完整动画效果
- ✅ Safari: 完整动画效果  
- ✅ Firefox: 降级动画效果 (AnimatedCarouselContainer)
- ✅ 移动浏览器: 完整支持

## 最佳实践
1. 对于重动画组件使用较大的 `margin` 值提前加载
2. 对于轻量级动画使用较小的 `amount` 值快速触发
3. 在 Firefox 中避免使用 `filter: blur()` 和频繁的 `scale` 变换
4. Canvas 动画保持 RAF 循环但跳过绘制逻辑

## 测试建议
1. 在不同浏览器中测试动画表现
2. 使用 Chrome DevTools Performance 分析 FPS
3. 在移动设备上测试电池消耗
4. 测试快速滚动时的动画启停
5. 特别关注 Firefox 的性能表现
