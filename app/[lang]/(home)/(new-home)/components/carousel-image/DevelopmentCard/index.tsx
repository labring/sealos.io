'use client';
import EditorImage from './assets/editor.svg';
import CodeBuddyLogo from '../../../assets/ide-icons/codebuddy.svg';
import CursorLogo from '../../../assets/ide-icons/cursor.svg';
import JBRemoteLogo from '../../../assets/ide-icons/jbremote.svg';
import JBToolboxLogo from '../../../assets/ide-icons/jbtoolbox.svg';
import KiroLogo from '../../../assets/ide-icons/kiro.svg';
import LingmaLogo from '../../../assets/ide-icons/lingma.svg';
import QoderLogo from '../../../assets/ide-icons/qoder.svg';
import TraeLogo from '../../../assets/ide-icons/trae.svg';
import VSCodeLogo from '../../../assets/ide-icons/vscode.svg';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 圆环配置
const circles = [
  { radius: 127.879, stroke: '#424242', strokeWidth: 1.26873 },
  { radius: 394.993, stroke: '#2C2C2C', strokeWidth: 1.26873 },
  { radius: 515.5, stroke: '#363636', strokeWidth: 1.26873 },
  { radius: 665.173, stroke: '#363636', strokeWidth: 1.6371 },
];

// 应用配置：每个圆环上的应用及其角度
// 第一圈和第四圈（最外圈）预留给其他内容，不放图标
const appPositions = [
  // 第二圈 - 3个应用
  {
    radius: 394.993,
    apps: [
      { logo: CodeBuddyLogo, angle: 347, size: 56 },
      { logo: KiroLogo, angle: 10, size: 56 },
      { logo: LingmaLogo, angle: 172, size: 56 },
    ],
  },
  // 第三圈 - 3个应用
  {
    radius: 515.5,
    apps: [
      { logo: JBToolboxLogo, angle: 20, size: 64 },
      { logo: QoderLogo, angle: 194, size: 64 },
      { logo: TraeLogo, angle: 356, size: 64 },
    ],
  },
  // 第3.5圈（没有圆环，只有图标）- 3个应用
  {
    radius: 590,
    apps: [
      { logo: VSCodeLogo, angle: 345, size: 72 },
      { logo: CursorLogo, angle: 168, size: 72 },
      { logo: JBRemoteLogo, angle: 184, size: 72 },
    ],
  },
];

export function DevelopmentCard() {
  // 获取圆环索引以同步延迟
  const getCircleDelay = (radius: number) => {
    const circleIndex = circles.findIndex((c) => c.radius === radius);
    return circleIndex >= 0 ? circleIndex * 0.2 : 0;
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <svg
        viewBox="-670 -670 1340 1340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute h-auto w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {circles.map((circle, index) => (
          <motion.circle
            key={index}
            cx="0"
            cy="0"
            r={circle.radius}
            stroke={circle.stroke}
            strokeWidth={circle.strokeWidth}
            style={{ transformOrigin: 'center' }}
            initial={{ transform: 'scale(1)' }}
            animate={{
              transform: ['scale(1)', 'scale(1.05)', 'scale(1)'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
          />
        ))}

        {/* 应用图标层 - 使用 foreignObject 统一坐标系统 */}
        {appPositions.map((circle, circleIdx) =>
          circle.apps.map((app, appIdx) => {
            const radius = circle.radius;
            const angleRad = (app.angle * Math.PI) / 180;
            const delay = getCircleDelay(radius);
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            // 扩大 foreignObject 尺寸以容纳动画和旋转，避免裁切
            // 旋转45度时对角线长度约为 size * 1.414，再加上动画偏移量的余量
            const containerSize = app.size * 1.6;
            const offset = containerSize / 2;

            return (
              <foreignObject
                key={`${circleIdx}-${appIdx}`}
                x={x - offset}
                y={y - offset}
                width={containerSize}
                height={containerSize}
                overflow="visible"
              >
                <motion.div
                  className="flex h-full w-full items-center justify-center will-change-transform"
                  initial={{
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: [0, x * 0.05, 0],
                    y: [0, y * 0.05, 0],
                    rotate: [-3, 3, -3, 3, -3],
                  }}
                  transition={{
                    x: {
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: delay,
                    },
                    y: {
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: delay,
                    },
                    rotate: {
                      duration: 0.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      repeatType: 'reverse',
                    },
                  }}
                >
                  <Image
                    src={app.logo}
                    alt=""
                    width={app.size}
                    height={app.size}
                    className="rounded-lg"
                  />
                </motion.div>
              </foreignObject>
            );
          }),
        )}
      </svg>

      {/* Editor 图片 - 居中显示，不需要动画 */}
      <div className="absolute flex w-1/2 items-center justify-center">
        <Image src={EditorImage} alt="" className="pointer-events-none h-2/3" />
      </div>
    </div>
  );
}
