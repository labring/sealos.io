'use client';

import React, { useEffect, useRef } from 'react';

interface Ray {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  width: number;
  fading: boolean;
  opacity: number;
  threshold: number;
  color: string;
  gradient: CanvasGradient;
}

interface LightSource {
  /** 光源位置 X (0-1, 0=左, 1=右) */
  x: number;
  /** 光源位置 Y (0-1, 0=上, 1=下，可以为负数表示在视口上方) */
  y: number;
  /** 照射方向的角度（度数）
   * Canvas 坐标系: 0°=右(东), 90°=下(南), 180°=左(西), 270°=上(北)
   * 例如: 45°=右下(东南), 135°=左下(西南), 225°=左上(西北), 315°=右上(东北)
   */
  angle: number;
  /** 光线扩散角度范围（度数） */
  spread: number;
  /** 光线数量 */
  count: number;
  /** 光线颜色 (rgba 格式，不含透明度) */
  color?: string;
}

interface GodRaysProps {
  /** 光源配置数组 */
  sources?: LightSource[];
  /** 光线淡入淡出速度 */
  speed?: number;
  /** 光线最大宽度 */
  maxWidth?: number;
  /** 光线最小长度 */
  minLength?: number;
  /** 光线最大长度 */
  maxLength?: number;
  /** 模糊程度 (px) */
  blur?: number;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function GodRays({
  sources = [
    {
      x: 1,
      y: -0.75,
      angle: 225,
      spread: 60,
      count: 32,
      color: '128, 192, 255',
    },
  ],
  speed = 0.01,
  maxWidth = 128,
  minLength = 800,
  maxLength = 2000,
  blur = 10,
}: GodRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raysRef = useRef<Ray[]>([]);
  const animationFrameRef = useRef<number>();
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // 初始化画布尺寸
    const handleCanvasDimension = (x: number, y: number) => {
      canvas.width = x;
      canvas.height = y;
    };

    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      dimensionsRef.current = { width, height };
      handleCanvasDimension(width, height);
    };

    updateDimensions();

    // 将角度转换为弧度
    const degToRad = (degrees: number) => (degrees * Math.PI) / 180;

    // 创建新的光线
    const createRay = () => {
      // 随机选择一个光源
      const source = sources[Math.floor(Math.random() * sources.length)];

      const { width, height } = dimensionsRef.current;

      // 计算光源的实际位置
      const sourceX = width * source.x;
      const sourceY = height * source.y;

      // 计算照射方向
      const baseAngle = degToRad(source.angle);
      const spreadRad = degToRad(source.spread);

      // 在扩散范围内随机选择一个角度
      const randomAngle = baseAngle + (Math.random() - 0.5) * spreadRad;

      // 计算光线长度
      const rayLength = minLength + Math.random() * (maxLength - minLength);

      // 计算目标点
      const targetX = sourceX + Math.cos(randomAngle) * rayLength;
      const targetY = sourceY + Math.sin(randomAngle) * rayLength;

      const gradient = context.createLinearGradient(
        sourceX,
        sourceY,
        targetX,
        targetY,
      );
      const rayWidth = Math.random() * maxWidth;
      const rayColor = source.color || '128, 192, 255';

      raysRef.current.push({
        sourceX,
        sourceY,
        targetX,
        targetY,
        width: rayWidth,
        fading: false,
        opacity: 0,
        threshold: Math.random() * 0.5 * 2, // 进一步提高最大不透明度阈值
        color: rayColor,
        gradient,
      });
    };

    // 更新光线状态
    const updateRay = (ray: Ray) => {
      if (ray.opacity >= ray.threshold) {
        ray.fading = true;
      }

      if (ray.opacity < 0 && ray.fading) {
        ray.fading = false;
      }

      if (ray.fading) {
        ray.opacity -= speed;
      } else {
        ray.opacity += speed;
      }
    };

    // 绘制光线
    const drawRay = (ray: Ray) => {
      context.beginPath();
      context.moveTo(ray.sourceX, ray.sourceY);
      context.lineTo(ray.sourceX, ray.sourceY);
      context.lineTo(ray.targetX, ray.targetY);
      context.closePath();

      // 重新创建渐变
      ray.gradient = context.createLinearGradient(
        ray.sourceX,
        ray.sourceY,
        ray.targetX,
        ray.targetY,
      );
      ray.gradient.addColorStop(0, `rgba(${ray.color}, ${ray.opacity})`);
      ray.gradient.addColorStop(0.5, 'transparent');

      context.lineWidth = ray.width;
      context.strokeStyle = ray.gradient;
      context.stroke();
    };

    // 初始化和更新
    const init = () => {
      // 计算总光线数量
      const totalCount = sources.reduce((sum, source) => sum + source.count, 0);

      if (raysRef.current.length <= totalCount) {
        createRay();
      }

      raysRef.current.forEach((ray) => {
        updateRay(ray);
        drawRay(ray);
      });
    };

    // 动画循环
    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      init();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 窗口大小调整处理
    const handleResize = () => {
      updateDimensions();
      // 清空光线，让它们重新创建以适应新的尺寸
      raysRef.current = [];
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sources, speed, maxWidth, minLength, maxLength]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute -z-10"
      style={{
        mixBlendMode: 'lighten',
        filter: `blur(${blur}px)`,
        top: `-${blur}px`,
        left: `-${blur}px`,
        right: `-${blur}px`,
        bottom: `-${blur}px`,
        width: `calc(100% + ${blur * 2}px)`,
        height: `calc(100% + ${blur * 2}px)`,
        clipPath: `inset(${blur}px -100vw -100vh -100vw)`,
      }}
    />
  );
}
