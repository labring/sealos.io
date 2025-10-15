import Image from 'next/image';
import { ReactNode } from 'react';
import { FileCode } from 'lucide-react';
import ContainerImage from './container.svg';
import SealosLogo from './logo/sealos.svg';
import K8sLogo from './logo/k8s.svg';
import DockerLogo from './logo/docker.svg';
import GithubLogo from './logo/github.svg';

// 容器配置类型（导出以便外部使用）
export interface ContainerConfig {
  id: string | number;
  x: number; // 网格X坐标
  y: number; // 网格Y坐标
  z: number; // 网格Z坐标（层级）
  visible?: boolean; // 是否显示
  topIcon?: ReactNode; // 顶面图标
  centerDecal?: ReactNode; // 中心贴图
}

interface DeploymentCardProps {
  containers?: ContainerConfig[];
  angle?: number; // 观测角度（度）
  baseDistance?: number; // 基础间距
  containerHeight?: number; // 容器显示高度
}

export function DeploymentCard({
  containers: customContainers,
  angle = 30,
  baseDistance = 110, // 100 * 1.1
  containerHeight = 198, // 180 * 1.1
}: DeploymentCardProps = {}) {
  // 默认配置：完整的3x3网格容器展开
  const defaultContainers: ContainerConfig[] = [
    // 第一层 (z=0) - 3x3网格，每个位置都可以独立配置
    {
      id: '1-0-0',
      x: 1,
      y: 0,
      z: 0,
      visible: true,
    },
    {
      id: '2-0-0',
      x: 2,
      y: 0,
      z: 0,
      visible: true,
      topIcon: (
        <div className="relative" style={{ width: '59.4px', height: '59.4px' }}>
          <Image
            src={K8sLogo}
            alt="Kubernetes"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      ),
    },

    {
      id: '0-1-0',
      x: 0,
      y: 1,
      z: 0,
      visible: true,
    },
    {
      id: '1-1-0',
      x: 1,
      y: 1,
      z: 0,
      visible: true,
    },
    {
      id: '2-1-0',
      x: 2,
      y: 1,
      z: 0,
      visible: true,
      topIcon: <FileCode size={59.4} strokeWidth={1} className="text-white" />,
    },

    {
      id: '0-2-0',
      x: 0,
      y: 2,
      z: 0,
      visible: true,
      topIcon: (
        <div className="relative" style={{ width: '59.4px', height: '59.4px' }}>
          <Image
            src={DockerLogo}
            alt="Docker"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      ),
    },
    {
      id: '1-2-0',
      x: 1,
      y: 2,
      z: 0,
      visible: true,
      topIcon: (
        <div className="relative" style={{ width: '59.4px', height: '59.4px' }}>
          <Image
            src={GithubLogo}
            alt="Github"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      ),
    },
    {
      id: '2-2-0',
      x: 2,
      y: 2,
      z: 0,
      visible: true,
    },

    {
      id: '1-1-1',
      x: 1,
      y: 1,
      z: 1,
      visible: true,
      centerDecal: (
        <div className="relative" style={{ width: '132px', height: '132px' }}>
          <Image
            src={SealosLogo}
            alt="Sealos"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      ),
    },
  ];

  const containers = customContainers || defaultContainers;

  // 根据角度计算偏移量
  const calculateIsometricOffset = (
    angleDeg: number,
    baseDistance: number = 120,
  ) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      deltaX: baseDistance,
      deltaY: baseDistance * Math.tan(angleRad),
      ratio: Math.tan(angleRad),
    };
  };

  const { deltaX, deltaY } = calculateIsometricOffset(angle, baseDistance);

  // 计算布局边界和居中偏移
  // SVG原始尺寸比例 215:251
  const svgAspectRatio = 215 / 251;
  const containerDisplayHeight = containerHeight; // 使用props传入的高度
  const containerDisplayWidth = containerDisplayHeight * svgAspectRatio; // 保持宽高比
  const containerWidth = 500;

  // 动态计算z轴高度偏移
  // z轴堆叠高度应该综合考虑baseDistance和容器高度
  // 使用baseDistance的一个合理比例，同时考虑容器本身的高度
  const zHeight = baseDistance * 0.6 + containerDisplayHeight * 0.3; // baseDistance的60% + 容器高度的30%

  // 找到所有可见容器的边界
  const visibleContainers = containers.filter((c) => c.visible !== false);
  const minX = Math.min(...visibleContainers.map((c) => (c.x - c.y) * deltaX));
  const maxX = Math.max(...visibleContainers.map((c) => (c.x - c.y) * deltaX));
  const layoutWidth = maxX - minX + containerDisplayWidth;
  const offsetX = (containerWidth - layoutWidth) / 2 - minX;

  // 按照z坐标和屏幕y坐标排序，确保正确的绘制顺序
  const sortedContainers = [...visibleContainers].sort((a, b) => {
    const renderOrderA = a.z * 1000 + (a.x + a.y) * deltaY;
    const renderOrderB = b.z * 1000 + (b.x + b.y) * deltaY;
    return renderOrderA - renderOrderB;
  });

  // 计算顶面图标的变换和位置
  // 根据SVG路径：顶点在 (107.511, 1.37109)，左右顶点在 y=63.1211
  // 顶面中心点大约在 y=32 (1.37 + 63.12)/2 的位置 <--- 这个不对，顶面中点是左右顶点连线
  const getTopIconPosition = () => {
    // SVG viewBox 0 0 215 251 中，顶面中心约在 y=56
    const topCenterY = 56 / 251; // 转换为百分比
    return {
      top: `${topCenterY * 100}%`, // 约12.75%
      left: '50%',
    };
  };

  const getTopIconTransform = (angleDeg: number) => {
    // 顶面需要根据等轴测角度进行旋转
    // rotateX让图标贴合斜面，rotateZ顺时针旋转45度调整方向
    const skewAngle = angleDeg;
    return `translate(-50%, -50%) rotateX(${60}deg) rotateZ(-45deg) scale(1)`;
  };

  return (
    <div className="relative flex h-auto w-full items-center justify-center overflow-hidden">
      {/* 通过定位模拟正交视角 */}
      <div className="relative h-[400px] w-[500px]">
        {sortedContainers.map((container) => {
          // 正交视角位置计算（isometric）
          // screenX = (x - y) * deltaX
          // screenY = (x + y) * deltaY - z * zHeight
          const screenX = (container.x - container.y) * deltaX;
          const screenY =
            (container.x + container.y) * deltaY - container.z * zHeight;

          return (
            <div
              key={container.id}
              data-x={container.x}
              data-y={container.y}
              data-z={container.z}
              className="group absolute transition-all duration-300 ease-out hover:-translate-y-[15%]"
              style={{
                left: `${screenX + offsetX}px`,
                top: `${screenY}px`,
                width: `${containerDisplayWidth}px`,
                height: `${containerDisplayHeight}px`,
              }}
            >
              {/* 背景模糊层 - 使用CSS backdrop-filter */}
              <div
                className="absolute inset-0"
                style={{
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  clipPath: `polygon(
                    0.26% 25.14%,
                    50% 0.55%,
                    99.74% 25.14%,
                    99.74% 74.95%,
                    50% 99.56%,
                    0.26% 74.95%
                  )`,
                }}
              />

              {/* 容器图像 */}
              <div className="relative h-full w-full">
                <Image
                  src={ContainerImage}
                  alt=""
                  width={containerDisplayWidth}
                  height={containerDisplayHeight}
                  className="drop-shadow-lg"
                />
              </div>

              {/* 顶面图标 - 需要变换以匹配等轴测视角 */}
              {container.topIcon && (
                <div
                  className="absolute"
                  style={{
                    ...getTopIconPosition(),
                    transform: getTopIconTransform(angle),
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {container.topIcon}
                </div>
              )}

              {/* 中心贴图 - 居中显示，不需要变换 */}
              {container.centerDecal && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {container.centerDecal}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
