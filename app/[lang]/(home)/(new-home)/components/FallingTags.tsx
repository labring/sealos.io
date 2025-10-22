'use client';

import { useEffect, useRef, useState } from 'react';
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
  body: Matter.Body;
  elem: HTMLElement;
  landed: boolean;
  index: number;
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
    dropDelay: 500, // 每个元素掉落间隔
    stayDuration: 3000, // 停留时间
    drainDuration: 2500, // 流出时间
    resetDelay: 500, // 重置延迟
  },
  rendering: {
    updateInterval: 1000 / 10, // update at 10 fps
  },
};

export function FallingTags() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const floorRef = useRef<Matter.Body | null>(null);
  const bodiesRef = useRef<BodyItem[]>([]);
  const animationIdRef = useRef<number>(0);
  const [phase, setPhase] = useState<Phase>('dropping');
  const elementsRef = useRef<Map<number, HTMLElement>>(new Map());

  // 使用 motion/react 的 useInView 检测组件是否进入视口
  const inView = useInView(containerRef, {
    once: true, // 只触发一次
    amount: 0.1, // 10% 可见时触发
  });

  useEffect(() => {
    // 只有进入视口时才启动动画
    if (!inView || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

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
        containerHeight + 5,
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

    // 运行引擎
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // 创建 DOM 元素
    const createDOMElements = () => {
      elementsRef.current.clear();
      tags.forEach((tag, index) => {
        const elem = document.createElement('span');
        elem.className =
          'inset-shadow-bubble absolute rounded-full border border-white/5 bg-neutral-950/30 px-3 py-2 xl:px-4 xl:py-3 font-light text-base backdrop-blur-md transition-transform ease-linear will-change-transform';
        elem.textContent = tag.text;
        elem.style.opacity = '1';
        elem.style.left = '0';
        elem.style.top = '0';
        elem.style.transform = `translate(${containerWidth / 2}px, ${-150}px) translate(-50%, -50%)`;
        elem.style.willChange = 'transform';
        elem.style.pointerEvents = 'none';
        container.appendChild(elem);
        elementsRef.current.set(index, elem);
      });
    };

    createDOMElements();

    // 掉落元素
    const dropElements = () => {
      bodiesRef.current = [];

      tags.forEach((tag, index) => {
        setTimeout(() => {
          const elem = elementsRef.current.get(index);
          if (!elem || !engine) return;

          const rect = elem.getBoundingClientRect();
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
            },
          );

          Matter.Composite.add(engine.world, body);

          bodiesRef.current[index] = {
            body,
            elem,
            landed: false,
            index,
          };
        }, index * CONFIG.timing.dropDelay);
      });
    };

    dropElements();

    const startUpdateLoop = () => {
      let localLandedCount = 0;
      let lastUpdateTime = 0;

      const update = (currentTime: number) => {
        // Throttle updates
        const timeSinceLastUpdate = currentTime - lastUpdateTime;

        if (timeSinceLastUpdate >= CONFIG.rendering.updateInterval) {
          bodiesRef.current.forEach((item) => {
            if (!item || !item.body || !item.elem) return;

            const { x, y } = item.body.position;
            const angle = item.body.angle;

            item.elem.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}rad)`;

            // 添加淡出效果
            if (phase === 'draining') {
              const fadeStart = containerHeight * 0.8;
              if (y > fadeStart) {
                const opacity = Math.max(
                  0,
                  1 - (y - fadeStart) / (containerHeight * 0.3),
                );
                item.elem.style.opacity = opacity.toString();
              }
            }

            // 检测着陆
            if (!item.landed && item.body.isSleeping) {
              item.landed = true;
              localLandedCount++;

              if (localLandedCount === tags.length) {
                onAllLanded();
              }
            }
          });

          lastUpdateTime = currentTime;
        }

        animationIdRef.current = requestAnimationFrame(update);
      };

      animationIdRef.current = requestAnimationFrame(update);
    };

    startUpdateLoop();

    // 全部着陆后
    const onAllLanded = () => {
      setPhase('staying');
      setTimeout(() => {
        removeFloor();
      }, CONFIG.timing.stayDuration);
    };

    // 移除地板
    const removeFloor = () => {
      if (!engine || !floorRef.current) return;
      setPhase('draining');

      // 移除地板和墙壁
      Matter.Composite.remove(engine.world, floorRef.current);
      const leftWall = engine.world.bodies.find(
        (body) => body.label === 'leftWall',
      );
      const rightWall = engine.world.bodies.find(
        (body) => body.label === 'rightWall',
      );
      if (leftWall) Matter.Composite.remove(engine.world, leftWall);
      if (rightWall) Matter.Composite.remove(engine.world, rightWall);

      // 唤醒所有物体
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
      // 清理
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = 0;
      }

      // 移除 DOM 元素
      elementsRef.current.forEach((elem) => {
        if (elem.parentNode) {
          elem.parentNode.removeChild(elem);
        }
      });
      elementsRef.current.clear();

      // 清理物理引擎
      const currentBodies = Matter.Composite.allBodies(engine.world).filter(
        (body) => !body.isStatic,
      );
      Matter.Composite.remove(engine.world, currentBodies);

      setPhase('dropping');
      bodiesRef.current = [];

      // 重新开始
      setTimeout(() => {
        createBoundaries();
        createDOMElements();
        dropElements();
        startUpdateLoop();
      }, CONFIG.timing.resetDelay);
    };

    // 清理函数
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
      elementsRef.current.forEach((elem) => {
        if (elem.parentNode) {
          elem.parentNode.removeChild(elem);
        }
      });
      elementsRef.current.clear();
    };
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
    />
  );
}
