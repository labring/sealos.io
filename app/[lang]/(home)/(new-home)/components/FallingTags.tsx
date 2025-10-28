'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';
import * as Matter from 'matter-js';

interface Tag {
  text: string;
}

const tags: Tag[] = [
  { text: '① Have an idea' },
  { text: '② Provision a VM' },
  { text: '③ Install dependencies' },
  { text: '④ Realize dependencies conflict' },
  { text: '⑤ Start over with Docker' },
  { text: '⑥ Write a complex Dockerfile' },
  { text: '⑦ Configure network ports' },
  { text: '⑧ Set up a separate database' },
  { text: '⑨ Manually configure DB connection strings' },
  { text: '⑩ Finally, deploy...' },
  { text: '...and it works on your machine, but not on the server' },
];

type Phase = 'dropping' | 'staying' | 'draining';

interface BodyItem {
  body: Matter.Body | null;
  element: HTMLElement;
  landed: boolean;
  index: number;
  rect?: DOMRect;
}

const CONFIG = {
  physics: {
    gravity: 1,
    restitution: 0.4,
    friction: 0.7,
    density: 0.001,
    frictionAir: 0.02,
  },
  timing: {
    dropDelay: 500,
    stayDuration: 3000,
    drainDuration: 2500,
    resetDelay: 500,
  },
  rendering: {
    // 不再需要 updateInterval，每帧都更新
  },
};

export function FallingTags({
  resetAfterAllLanded = false,
  stopEngineAfterLanded = true,
}: {
  resetAfterAllLanded?: boolean;
  stopEngineAfterLanded?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const floorRef = useRef<Matter.Body | null>(null);
  const bodiesRef = useRef<BodyItem[]>([]);
  const animationIdRef = useRef<number>(0);
  const phaseRef = useRef<Phase>('dropping');
  const containerHeightRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // 使用 motion/react 的 useInView 检测组件是否进入视口
  const inView = useInView(containerRef, {
    once: true,
    amount: 0.1,
  });

  useEffect(() => {
    if (!inView || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    containerHeightRef.current = containerHeight;

    // 创建引擎
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: CONFIG.physics.gravity },
      enableSleeping: true,
      positionIterations: 10,
      velocityIterations: 8,
    });
    engineRef.current = engine;

    // 创建边界
    const createBoundaries = () => {
      const wallThickness = 10;
      const wallStyle = {
        isStatic: true,
        render: { fillStyle: 'transparent' },
      };

      const floor = Matter.Bodies.rectangle(
        containerWidth / 2,
        containerHeight + 5 - 96,
        containerWidth,
        wallThickness,
        { ...wallStyle, label: 'floor' },
      );
      floorRef.current = floor;

      const leftWall = Matter.Bodies.rectangle(
        -5,
        containerHeight / 2,
        wallThickness,
        containerHeight,
        { ...wallStyle, label: 'leftWall' },
      );

      const rightWall = Matter.Bodies.rectangle(
        containerWidth + 5,
        containerHeight / 2,
        wallThickness,
        containerHeight,
        { ...wallStyle, label: 'rightWall' },
      );

      Matter.Composite.add(engine.world, [floor, leftWall, rightWall]);
    };

    createBoundaries();

    // 不使用 Runner，改用手动 rAF 驱动物理引擎

    // 创建 DOM 元素并初始化 bodies
    const initializeBodies = () => {
      bodiesRef.current = tags.map((tag, index) => {
        const elem = document.createElement('span');
        // 移除 backdrop-blur-md，改用轻量样式
        elem.className =
          'absolute whitespace-nowrap rounded-full px-3 py-2 xl:px-4 xl:py-3 font-light text-base inset-shadow-bubble';
        elem.textContent = tag.text;

        // 使用内联样式设置轻量外观（渐变背景替代内阴影）
        elem.style.cssText = `
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05) 15%, #141414 40%, #141414 60%, rgba(255, 255, 255, 0.05) 85%, rgba(255, 255, 255, 0.15));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          will-change: transform;
          contain: layout style paint;
          transform: translate3d(0px, -200px, 0) rotate(0deg);
          opacity: 1;
        `;

        container.appendChild(elem);
        const rect = elem.getBoundingClientRect();

        return {
          body: null,
          element: elem,
          landed: false,
          index,
          rect,
        };
      });
    };

    initializeBodies();

    // 掉落元素
    const dropElements = () => {
      tags.forEach((_, index) => {
        setTimeout(() => {
          const item = bodiesRef.current[index];
          if (!item || !engine || !item.rect) return;

          const rect = item.rect;
          const initialAngle = (Math.random() - 0.5) * 0.5;
          const dropX =
            containerWidth / 2 + (Math.random() - 0.5) * (containerWidth * 0.6);

          const body = Matter.Bodies.rectangle(
            dropX,
            -80 - index * 70,
            rect.width,
            rect.height,
            {
              restitution: CONFIG.physics.restitution,
              friction: CONFIG.physics.friction,
              density: CONFIG.physics.density,
              frictionAir: CONFIG.physics.frictionAir,
              render: { fillStyle: 'transparent' },
              angle: initialAngle,
              angularVelocity: (Math.random() - 0.5) * 0.1,
              // 添加 chamfer 使物理形状匹配圆角胶囊外观
              chamfer: { radius: rect.height / 2 },
            },
          );

          Matter.Composite.add(engine.world, body);
          item.body = body;
        }, index * CONFIG.timing.dropDelay);
      });
    };

    dropElements();

    const startUpdateLoop = () => {
      let localLandedCount = 0;
      lastTimeRef.current = performance.now();

      const update = (now: number) => {
        // 计算时间差并限制最大步长，避免大跳跃
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;
        const clampedDelta = Math.min(delta, 33); // 最大 33ms (约 30fps)

        // 手动推进物理引擎
        if (engineRef.current) {
          Matter.Engine.update(engineRef.current, clampedDelta);
        }

        // 同步 DOM - 批量更新减少重排
        bodiesRef.current.forEach((item) => {
          if (!item || !item.body || !item.element) return;

          const { x, y } = item.body.position;
          const angle = item.body.angle;

          // 物理引擎的 x 坐标就是相对于容器的绝对位置
          // 需要减去元素自身宽度的一半来居中
          const offsetX = x - (item.rect?.width || 0) / 2;
          const offsetY = y;

          // 添加淡出效果
          if (phaseRef.current === 'draining') {
            const fadeStart = containerHeightRef.current * 0.8;
            if (y > fadeStart) {
              const opacity = Math.max(
                0,
                1 - (y - fadeStart) / (containerHeightRef.current * 0.3),
              );
              // 使用 cssText 一次性更新多个属性，减少样式重算
              item.element.style.cssText = `
                background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05) 15%, #141414 40%, #141414 60%, rgba(255, 255, 255, 0.05) 85%, rgba(255, 255, 255, 0.15));
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                will-change: transform;
                contain: layout style paint;
                transform: translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${angle}rad);
                opacity: ${opacity};
              `;
            } else {
              item.element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${angle}rad)`;
            }
          } else {
            item.element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${angle}rad)`;
          }

          // 检测着陆
          if (!item.landed && item.body.isSleeping) {
            item.landed = true;
            localLandedCount++;

            if (localLandedCount === tags.length) {
              // 所有元素都已着陆
              if (stopEngineAfterLanded) {
                // 停止更新循环以节省性能
                if (animationIdRef.current) {
                  cancelAnimationFrame(animationIdRef.current);
                  animationIdRef.current = 0;
                }
              }

              if (resetAfterAllLanded) {
                onAllLanded();
              }
            }
          }
        });

        // 继续下一帧（除非已停止）
        if (animationIdRef.current !== 0) {
          animationIdRef.current = requestAnimationFrame(update);
        }
      };

      animationIdRef.current = requestAnimationFrame(update);
    };

    startUpdateLoop();

    // 全部着陆后
    const onAllLanded = () => {
      phaseRef.current = 'staying';
      setTimeout(() => {
        removeFloor();
      }, CONFIG.timing.stayDuration);
    };

    // 移除地板
    const removeFloor = () => {
      if (!engine || !floorRef.current) return;
      phaseRef.current = 'draining';

      // 重新启动更新循环（如果之前停止了）
      if (animationIdRef.current === 0) {
        lastTimeRef.current = performance.now();
        const update = (now: number) => {
          const delta = now - lastTimeRef.current;
          lastTimeRef.current = now;
          const clampedDelta = Math.min(delta, 33);

          if (engineRef.current) {
            Matter.Engine.update(engineRef.current, clampedDelta);
          }

          bodiesRef.current.forEach((item) => {
            if (!item || !item.body || !item.element) return;

            const { x, y } = item.body.position;
            const angle = item.body.angle;
            const offsetX = x - (item.rect?.width || 0) / 2;
            const offsetY = y;

            if (phaseRef.current === 'draining') {
              const fadeStart = containerHeightRef.current * 0.8;
              if (y > fadeStart) {
                const opacity = Math.max(
                  0,
                  1 - (y - fadeStart) / (containerHeightRef.current * 0.3),
                );
                item.element.style.cssText = `
                  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05) 15%, #141414 40%, #141414 60%, rgba(255, 255, 255, 0.05) 85%, rgba(255, 255, 255, 0.15));
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                  will-change: transform;
                  contain: layout style paint;
                  transform: translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${angle}rad);
                  opacity: ${opacity};
                `;
              } else {
                item.element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${angle}rad)`;
              }
            } else {
              item.element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${angle}rad)`;
            }
          });

          if (animationIdRef.current !== 0) {
            animationIdRef.current = requestAnimationFrame(update);
          }
        };
        animationIdRef.current = requestAnimationFrame(update);
      }

      Matter.Composite.remove(engine.world, floorRef.current);
      const leftWall = engine.world.bodies.find(
        (body) => body.label === 'leftWall',
      );
      const rightWall = engine.world.bodies.find(
        (body) => body.label === 'rightWall',
      );
      if (leftWall) Matter.Composite.remove(engine.world, leftWall);
      if (rightWall) Matter.Composite.remove(engine.world, rightWall);

      bodiesRef.current.forEach((item) => {
        if (item && item.body) {
          Matter.Body.setStatic(item.body, false);
          Matter.Body.setAngularVelocity(
            item.body,
            (Math.random() - 0.5) * 0.2,
          );
          Matter.Sleeping.set(item.body, false);
        }
      });

      setTimeout(() => {
        resetCycle();
      }, CONFIG.timing.drainDuration);
    };

    // 重置循环
    const resetCycle = () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = 0;
      }

      const currentBodies = Matter.Composite.allBodies(engine.world).filter(
        (body) => !body.isStatic,
      );
      Matter.Composite.remove(engine.world, currentBodies);

      phaseRef.current = 'dropping';

      // 重置元素位置和状态
      bodiesRef.current.forEach((item) => {
        item.body = null;
        item.landed = false;
        if (item.element) {
          item.element.style.cssText = `
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05) 15%, #141414 40%, #141414 60%, rgba(255, 255, 255, 0.05) 85%, rgba(255, 255, 255, 0.15));
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            will-change: transform;
            contain: layout style paint;
            transform: translate3d(0px, -200px, 0) rotate(0deg);
            opacity: 1;
          `;
        }
      });

      setTimeout(() => {
        createBoundaries();
        dropElements();
        startUpdateLoop();
      }, CONFIG.timing.resetDelay);
    };

    // 清理函数
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
      // 清理 DOM 元素
      bodiesRef.current.forEach((item) => {
        if (item.element && item.element.parentNode) {
          item.element.parentNode.removeChild(item.element);
        }
      });
    };
  }, [inView, resetAfterAllLanded, stopEngineAfterLanded]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
    />
  );
}
