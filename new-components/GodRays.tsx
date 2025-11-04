'use client';

import React, { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';

interface Ray {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  width: number;
  fading: boolean;
  opacity: number;
  opacityMin: number;
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
  opacityMin?: number;
  opacityMax?: number;
  minWidth?: number;
  maxWidth?: number;
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
  /**
   * Cap X axis to container width
   */
  capWidth?: boolean;
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
      minWidth: 40,
      maxWidth: 100,
    },
  ],
  speed = 0.01,
  maxWidth = 128,
  minLength = 800,
  maxLength = 2000,
  blur = 10,
  capWidth = true,
}: GodRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raysRef = useRef<Ray[]>([]);
  const animationFrameRef = useRef<number>();
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // 使用 useInView 检测组件是否在视口内
  const isInView = useInView(canvasRef, {
    margin: '0px 0px 0px 0px',
    amount: 0,
  });

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

      // cap x axis to container dimension
      const cappedWidth =
        width > 1440
          ? 1440
          : width > 1280
            ? 1280
            : width > 1024
              ? 1024
              : width > 768
                ? 768
                : width > 640
                  ? 640
                  : width;

      // 计算光源的实际位置
      const sourceX = capWidth
        ? (width - cappedWidth) / 2 + cappedWidth * source.x
        : width;
      const sourceY = height * source.y;

      // 计算照射方向
      const baseAngle = degToRad(source.angle);
      const spreadRad = degToRad(source.spread);

      // 在扩散范围内随机选择一个角度
      const randomAngle = baseAngle + (Math.random() - 0.5) * spreadRad;

      // 计算光线长度
      let rayLength = minLength + Math.random() * (maxLength - minLength);

      // 限制光线不照射到 80vh 以下
      const maxY = height * 0.8;
      const sinAngle = Math.sin(randomAngle);

      // 如果光线向下（sin > 0），计算到达 33vh 边界的最大长度
      if (sinAngle > 0) {
        const maxLengthToLimit = (maxY - sourceY) / sinAngle;
        if (maxLengthToLimit > 0) {
          rayLength = Math.min(rayLength, maxLengthToLimit);
        }
      }

      // 计算目标点
      const targetX = sourceX + Math.cos(randomAngle) * rayLength;
      const targetY = sourceY + Math.sin(randomAngle) * rayLength;

      const gradient = context.createLinearGradient(
        sourceX,
        sourceY,
        targetX,
        targetY,
      );
      const rayWidth =
        (source.minWidth ?? 0) +
        Math.random() * ((source.maxWidth ?? 100) - (source.minWidth ?? 0));
      const rayColor = source.color || '128, 192, 255';

      const randomThres = Math.random() * 0.5 * 2;
      raysRef.current.push({
        sourceX,
        sourceY,
        targetX,
        targetY,
        width: rayWidth,
        fading: false,
        opacity: source.opacityMin ?? 0,
        opacityMin: source.opacityMin ?? 0,
        threshold:
          (source.opacityMax ?? randomThres > (source.opacityMin ?? 0))
            ? randomThres
            : 1,
        color: rayColor,
        gradient,
      });
    };

    // 更新光线状态
    const updateRay = (ray: Ray) => {
      if (ray.opacity >= ray.threshold) {
        ray.fading = true;
      }

      if (ray.opacity < ray.opacityMin && ray.fading) {
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
      if (!isInView) {
        // 不在视口时停止动画，但保持 RAF 循环以便重新进入时恢复
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

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
  }, [sources, speed, maxWidth, minLength, maxLength, isInView]);

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
      aria-hidden="true"
    />
  );
}
