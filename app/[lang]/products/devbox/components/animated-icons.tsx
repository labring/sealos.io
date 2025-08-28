'use client';

// 导出所有动画图标组件
export { ClockIcon } from '@/components/ui/clock';
export { ShieldCheckIcon } from '@/components/ui/shield-check';
export { RocketIcon } from '@/components/ui/rocket';
export { TrendingDownIcon } from '@/components/ui/trending-down';
export { TrendingUpIcon } from '@/components/ui/trending-up';
export { UsersIcon } from '@/components/ui/users';
export { CircleCheckIcon } from '@/components/ui/circle-check';
export { XIcon } from '@/components/ui/x';
export { CoffeeIcon } from '@/components/ui/coffee';
export { MoonIcon } from '@/components/ui/moon';
export { ArrowRightIcon } from '@/components/ui/arrow-right';
export { RefreshCWIcon as RefreshCwIcon } from '@/components/ui/refresh-cw';

// 对于没有动画版本的图标，仍然使用 lucide-react
export { 
  AlertCircle,
  Zap,
  DollarSign,
  GitBranch,
  Code,
  GitCommit,
  Laptop,
  Cloud,
  Package,
  Star // Star 图标暂时使用 lucide-react 版本
} from 'lucide-react';