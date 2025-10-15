'use client';

import { useEffect, useRef, useState } from 'react';
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

export function FallingTags() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const [bodies, setBodies] = useState<Matter.Body[]>([]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // 设置画布尺寸（用于鼠标交互）
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // 创建引擎
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 },
    });
    engineRef.current = engine;

    // 创建鼠标和鼠标约束
    const mouse = Matter.Mouse.create(canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.15, // 降低弹性，让拖拽更平滑
        render: {
          visible: false,
        },
      },
    });
    
    // 添加拖拽阈值，需要移动一定距离才开始拖拽
    let dragStartPos: { x: number; y: number } | null = null;
    let isDragging = false;
    const dragThreshold = 5; // 拖拽阈值（像素）
    
    Matter.Events.on(mouseConstraint, 'startdrag', (event) => {
      dragStartPos = { 
        x: mouse.position.x, 
        y: mouse.position.y 
      };
      isDragging = false;
    });
    
    Matter.Events.on(mouseConstraint, 'mousemove', () => {
      if (dragStartPos && !isDragging && mouseConstraint.body) {
        const dx = mouse.position.x - dragStartPos.x;
        const dy = mouse.position.y - dragStartPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 只有当移动超过阈值时才真正开始拖拽
        if (distance < dragThreshold) {
          mouseConstraint.constraint.stiffness = 0;
        } else {
          isDragging = true;
          mouseConstraint.constraint.stiffness = 0.15;
        }
      }
    });
    
    Matter.Events.on(mouseConstraint, 'enddrag', () => {
      dragStartPos = null;
      isDragging = false;
      mouseConstraint.constraint.stiffness = 0.15;
    });
    
    mouseConstraintRef.current = mouseConstraint;
    Matter.Composite.add(engine.world, mouseConstraint);

    // 修复鼠标离开画布时的事件问题
    const handleMouseUp = () => {
      if (mouseConstraint.body) {
        Matter.Sleeping.set(mouseConstraint.body, false);
      }
      // 重置约束
      mouseConstraint.constraint.bodyB = null as any;
      // 重置拖拽状态
      dragStartPos = null;
      isDragging = false;
      mouseConstraint.constraint.stiffness = 0.15;
    };

    const handleMouseLeave = () => {
      // 鼠标离开画布时强制释放拖拽
      if (mouseConstraint.body) {
        Matter.Sleeping.set(mouseConstraint.body, false);
      }
      // 重置约束
      mouseConstraint.constraint.bodyB = null as any;
      // 重置拖拽状态
      dragStartPos = null;
      isDragging = false;
      mouseConstraint.constraint.stiffness = 0.15;
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // 创建地面和墙壁（不可见的边界）- 增加墙壁厚度防止穿透
    const wallThickness = 100;
    const ground = Matter.Bodies.rectangle(
      containerWidth / 2,
      containerHeight + wallThickness / 2,
      containerWidth + wallThickness * 2,
      wallThickness,
      { isStatic: true, render: { fillStyle: 'transparent' } },
    );
    // 左右墙壁向上延伸，允许标签从顶部进入
    const wallHeight = containerHeight + 1000; // 向上延伸1000px
    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2,
      containerHeight / 2 - 500, // 向上偏移500px
      wallThickness,
      wallHeight,
      { isStatic: true, render: { fillStyle: 'transparent' } },
    );
    const rightWall = Matter.Bodies.rectangle(
      containerWidth + wallThickness / 2,
      containerHeight / 2 - 500, // 向上偏移500px
      wallThickness,
      wallHeight,
      { isStatic: true, render: { fillStyle: 'transparent' } },
    );

    // 创建标签物体
    const bodies = tags.map((tag, index) => {
      // 估算标签尺寸（基于文本长度）
      const width = Math.max(150, tag.text.length * 10);
      const height = 50;

      // 随机初始位置（从顶部上方开始，更分散）
      const x = Math.random() * (containerWidth - width - 100) + width / 2 + 50;
      const y = -200 - index * 80; // 增加垂直间距，避免初始挤压

      const body = Matter.Bodies.rectangle(x, y, width, height, {
        restitution: 0.8, // 增加弹性，让碰撞后更容易分散
        friction: 0.05,
        frictionAir: 0.01, // 增加空气阻力，减缓运动
        density: 0.002, // 增加密度，更有重量感
        render: {
          fillStyle: 'transparent',
        },
        label: tag.text,
      });

      // 添加初始横向速度（随机方向，增大范围让标签更分散）
      const horizontalVelocity = (Math.random() - 0.5) * 4; // -2 到 2 的随机速度
      const verticalVelocity = Math.random() * 0.5; // 0 到 0.5 的向下速度，减慢初始下落
      Matter.Body.setVelocity(body, {
        x: horizontalVelocity,
        y: verticalVelocity,
      });

      // 添加初始旋转角速度
      const angularVelocity = (Math.random() - 0.5) * 0.08; // 减小旋转速度
      Matter.Body.setAngularVelocity(body, angularVelocity);

      return body;
    });
    setBodies(bodies);

    // 添加所有物体到世界
    Matter.Composite.add(engine.world, [
      ...bodies,
      ground,
      leftWall,
      rightWall,
    ]);

    // 运行引擎
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // 添加随机扰动力，让标签保持运动
    const perturbationInterval = setInterval(() => {
      const currentBodies = Matter.Composite.allBodies(engine.world).filter(
        (body) => !body.isStatic,
      );

      currentBodies.forEach((body) => {
        // 随机施加一个小的力
        const forceMagnitude = 0.0001 + Math.random() * 0.0003;
        const angle = Math.random() * Math.PI * 2;
        const force = {
          x: Math.cos(angle) * forceMagnitude,
          y: Math.sin(angle) * forceMagnitude,
        };

        Matter.Body.applyForce(body, body.position, force);

        // 有时添加一些扭矩让它旋转
        if (Math.random() > 0.7) {
          Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.02);
        }
      });
    }, 200); // 每200ms施加一次扰动

    // 每30秒重置
    const resetInterval = setInterval(() => {
      // 移除所有标签物体（排除静态物体）
      const currentBodies = Matter.Composite.allBodies(engine.world).filter(
        (body) => !body.isStatic,
      );
      Matter.Composite.remove(engine.world, currentBodies);

      // 重新创建标签物体
      const newBodies = tags.map((tag, index) => {
        const width = Math.max(150, tag.text.length * 10);
        const height = 50;
        const x =
          Math.random() * (containerWidth - width - 100) + width / 2 + 50;
        const y = -200 - index * 80;

        const body = Matter.Bodies.rectangle(x, y, width, height, {
          restitution: 0.8,
          friction: 0.05,
          frictionAir: 0.01,
          density: 0.002,
          render: {
            fillStyle: 'transparent',
          },
          label: tag.text,
        });

        // 添加初始横向速度（随机方向）
        const horizontalVelocity = (Math.random() - 0.5) * 4;
        const verticalVelocity = Math.random() * 0.5;
        Matter.Body.setVelocity(body, {
          x: horizontalVelocity,
          y: verticalVelocity,
        });

        // 添加初始旋转角速度
        const angularVelocity = (Math.random() - 0.5) * 0.08;
        Matter.Body.setAngularVelocity(body, angularVelocity);

        return body;
      });

      Matter.Composite.add(engine.world, newBodies);
      setBodies(newBodies);
    }, 30000);

    // 清理函数
    return () => {
      clearInterval(resetInterval);
      clearInterval(perturbationInterval);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* 透明画布用于鼠标交互 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ opacity: 0, pointerEvents: 'all' }}
      />
      {/* 渲染标签 DOM 元素，位置由物理引擎控制 */}
      {bodies.map((body, index) => (
        <TagElement key={`${body.label}-${index}`} body={body} />
      ))}
    </div>
  );
}

// 单个标签元素组件
function TagElement({ body }: { body: Matter.Body }) {
  const [position, setPosition] = useState({ x: 0, y: 0, angle: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      setPosition({
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
      });
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [body]);

  return (
    <span
      className="inset-shadow-bubble absolute rounded-full border border-white/5 bg-neutral-950/30 px-4 py-3 text-lg backdrop-blur-md"
      style={{
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.angle}rad) translate(-50%, -50%)`,
        willChange: 'transform',
        pointerEvents: 'none', // 让鼠标事件穿透到画布
      }}
    >
      {body.label}
    </span>
  );
}
