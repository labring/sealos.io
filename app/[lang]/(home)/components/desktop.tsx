'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  ExternalLink,
  X,
  Code,
  Database,
  ShoppingBag,
  Terminal,
  Rocket,
  Bot,
  Server,
  Wallet,
  Minus,
  Square,
  MinusSquare,
} from 'lucide-react';
import Image from 'next/image';
import { trackCustomEvent } from '@/lib/gtm';

interface ModuleType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  features: string[];
  productLink?: string;
  color: string;
}

interface OpenWindow {
  id: string;
  module: ModuleType;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  originalPosition?: { x: number; y: number };
  originalSize?: { width: number; height: number };
}

// Define available modules
const MODULES: ModuleType[] = [
  // First row
  {
    id: 'devbox',
    name: 'DevBox',
    icon: Code,
    color: 'from-gray-400 via-gray-700 to-gray-900',
    description:
      'Cloud-based development environment that eliminates "works on my machine" problems. Code in your favorite IDE while running everything in a consistent cloud environment.',
    features: [
      'Instant cloud workspaces',
      'Pre-configured templates',
      'Team collaboration built-in',
      'Zero setup time',
    ],
    productLink: '/products/devbox',
  },
  {
    id: 'appstore',
    name: 'App Store',
    icon: ShoppingBag,
    color: 'from-blue-200 via-blue-500 to-blue-700',
    description:
      '100+ pre-configured applications ready to deploy. From WordPress to n8n, get popular software running in minutes.',
    features: [
      '100+ ready-to-use apps',
      'One-click deployment',
      'Automatic updates',
      'Custom configurations',
    ],
    productLink: '/products/app-store',
  },
  {
    id: 'database',
    name: 'Database',
    icon: Database,
    color: 'from-green-200 via-green-500 to-green-700',
    description:
      'One-click deployment of production-ready databases. Built on KubeBlocks for enterprise-grade reliability and performance.',
    features: [
      'Relational, NoSQL, Vector databases and more',
      'Automatic backups & scaling',
      'High availability built-in',
      'Point-in-time recovery',
    ],
    productLink: '/products/databases',
  },
  {
    id: 'launchpad',
    name: 'App Launchpad',
    icon: Rocket,
    color: 'from-purple-200 via-purple-500 to-purple-700',
    description:
      'Deploy applications with ease using our intuitive launchpad. Get your apps running in production with just a few clicks.',
    features: [
      'One-click deployment',
      'Auto-scaling',
      'CI/CD integration',
      'Load balancing',
    ],
    // productLink: '/products/launchpad',
  },
  // Second row
  {
    id: 'aiproxy',
    name: 'AI Proxy',
    icon: Bot,
    color: 'from-indigo-300 via-purple-600 to-gray-800',
    description:
      'Intelligent API gateway for AI services. Route, cache, and manage your AI model requests with built-in rate limiting and analytics.',
    features: [
      'Multi-model support',
      'Request caching',
      'Rate limiting',
      'Usage analytics',
    ],
    // productLink: '/products/ai-proxy',
  },
  {
    id: 'objectstorage',
    name: 'Object Storage',
    icon: Server,
    color: 'from-pink-200 via-pink-500 to-rose-600',
    description:
      'S3-compatible object storage for your applications. Store files, images, and data with automatic scaling and backup.',
    features: [
      'S3-compatible API',
      'Automatic scaling',
      'Data redundancy',
      'Multiple region support',
    ],
    // productLink: '/products/object-storage',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: Terminal,
    color: 'from-slate-400 via-gray-700 to-black',
    description:
      'Cloud-native terminal with kubectl access. Manage your Kubernetes clusters and applications directly from the browser.',
    features: [
      'Built-in kubectl',
      'Cloud shell access',
      'Secure connections',
      'Multi-cluster support',
    ],
    // productLink: '/products/terminal',
  },
  {
    id: 'costcenter',
    name: 'Cost Center',
    icon: Wallet,
    color: 'from-emerald-200 via-teal-500 to-cyan-600',
    description:
      'Track and manage your cloud spending with detailed analytics. Monitor costs across all services and optimize your budget.',
    features: [
      'Cost tracking',
      'Budget alerts',
      'Usage analytics',
      'Resource optimization',
    ],
    // productLink: '/products/cost-center',
  },
];

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    text: string;
    x: number;
    y: number;
  }>({ show: false, text: '', x: 0, y: 0 });
  const [dragData, setDragData] = useState<{
    windowId: string;
    startPos: { x: number; y: number };
    offset: { x: number; y: number };
  } | null>(null);
  const [resizeData, setResizeData] = useState<{
    windowId: string;
    startPos: { x: number; y: number };
    startSize: { width: number; height: number };
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    setTodayDate(new Date().toLocaleDateString());
  }, []);

  const desktopRef = useRef<HTMLDivElement>(null);

  // Auto-hide loading screen after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showTooltip = useCallback((text: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setTooltip({
      show: true,
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip({ show: false, text: '', x: 0, y: 0 });
  }, []);

  const minimizeAllWindowsWithTooltip = useCallback(() => {
    const activeWindows = openWindows.filter((w) => !w.isMinimized);
    if (activeWindows.length > 0) {
      trackCustomEvent('desktop_interaction', 'minimize_all_windows', {
        windows_count: activeWindows.length,
        module_names: activeWindows.map((w) => w.module.name),
      });
    }
    setOpenWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })));
    hideTooltip();
  }, [hideTooltip, openWindows]);

  const closeWindow = useCallback(
    (windowId: string) => {
      const window = openWindows.find((w) => w.id === windowId);
      if (window) {
        trackCustomEvent('desktop_interaction', 'window_close', {
          module_id: window.module.id,
          module_name: window.module.name,
        });
      }
      setOpenWindows((prev) => prev.filter((w) => w.id !== windowId));
    },
    [openWindows],
  );

  const minimizeWindow = useCallback(
    (windowId: string) => {
      const window = openWindows.find((w) => w.id === windowId);
      if (window) {
        trackCustomEvent('desktop_interaction', 'window_minimize', {
          module_id: window.module.id,
          module_name: window.module.name,
        });
      }
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w)),
      );
    },
    [openWindows],
  );

  const restoreWindow = useCallback(
    (windowId: string) => {
      const window = openWindows.find((w) => w.id === windowId);
      if (window) {
        trackCustomEvent('desktop_interaction', 'window_restore', {
          module_id: window.module.id,
          module_name: window.module.name,
        });
      }

      const newZIndex = highestZIndex + 1;
      setOpenWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? { ...w, isMinimized: false, zIndex: newZIndex }
            : w,
        ),
      );
      setHighestZIndex(newZIndex);
    },
    [highestZIndex, openWindows],
  );

  const maximizeWindow = useCallback((windowId: string) => {
    const window = openWindows.find((w) => w.id === windowId);
    if (window) {
      trackCustomEvent('desktop_interaction', 'window_maximize', {
        module_id: window.module.id,
        module_name: window.module.name,
        action: window.isMaximized ? 'restore' : 'maximize',
      });
    }

    const desktopRect = desktopRef.current?.getBoundingClientRect();
    if (desktopRect) {
      const headerHeight = 73;
      const taskbarHeight = 52;
      const availableHeight = desktopRect.height - headerHeight - taskbarHeight;
      const availableWidth = desktopRect.width;

      setOpenWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? {
                ...w,
                originalPosition: w.isMaximized
                  ? w.originalPosition
                  : w.position,
                originalSize: w.isMaximized ? w.originalSize : w.size,
                position: w.isMaximized
                  ? w.originalPosition || { x: 50, y: 50 }
                  : { x: 0, y: 0 },
                size: w.isMaximized
                  ? w.originalSize || { width: 500, height: 400 }
                  : { width: availableWidth, height: availableHeight },
                isMaximized: !w.isMaximized,
              }
            : w,
        ),
      );
    }
  }, []);

  const openModule = useCallback(
    (module: ModuleType) => {
      // Track module click
      trackCustomEvent('desktop_interaction', 'module_click', {
        module_id: module.id,
        module_name: module.name,
        module_description: module.description,
        has_product_link: !!module.productLink,
      });

      const existingWindow = openWindows.find((w) => w.module.id === module.id);
      if (existingWindow) {
        if (existingWindow.isMinimized) {
          restoreWindow(existingWindow.id);
        } else {
          setOpenWindows((prev) =>
            prev.map((w) =>
              w.id === existingWindow.id
                ? { ...w, zIndex: highestZIndex + 1 }
                : w,
            ),
          );
          setHighestZIndex((prev) => prev + 1);
        }
      } else {
        const desktopRect = desktopRef.current?.getBoundingClientRect();
        const windowWidth = 500;
        const windowHeight = 400;

        let newX = 50 + openWindows.length * 30;
        let newY = 50 + openWindows.length * 30;

        if (desktopRect) {
          const headerHeight = 73;
          const taskbarHeight = 52;
          const availableHeight =
            desktopRect.height - headerHeight - taskbarHeight;
          const availableWidth = desktopRect.width;

          const maxX = availableWidth - windowWidth;
          const maxY = availableHeight - windowHeight;

          newX = Math.max(0, Math.min(maxX, newX));
          newY = Math.max(0, Math.min(maxY, newY));

          if (newX >= maxX || newY >= maxY) {
            newX = 20;
            newY = 20;
          }
        }

        const newWindow: OpenWindow = {
          id: `${module.id}-${Date.now()}`,
          module,
          zIndex: highestZIndex + 1,
          position: { x: newX, y: newY },
          size: { width: windowWidth, height: windowHeight },
          isMinimized: false,
          isMaximized: false,
        };
        setOpenWindows((prev) => [...prev, newWindow]);
        setHighestZIndex((prev) => prev + 1);
      }
    },
    [openWindows, highestZIndex, restoreWindow],
  );

  const bringToFront = useCallback(
    (windowId: string) => {
      const newZIndex = highestZIndex + 1;
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, zIndex: newZIndex } : w)),
      );
      setHighestZIndex(newZIndex);
    },
    [highestZIndex],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, windowId: string, type: 'drag' | 'resize') => {
      e.preventDefault();
      e.stopPropagation();

      bringToFront(windowId);

      const window = openWindows.find((w) => w.id === windowId);
      if (!window) return;

      if (type === 'drag') {
        const desktopRect = desktopRef.current?.getBoundingClientRect();
        if (desktopRect) {
          const relativeX = e.clientX - desktopRect.left - window.position.x;
          const relativeY =
            e.clientY - desktopRect.top - 73 - window.position.y;

          setDragData({
            windowId,
            startPos: { x: e.clientX, y: e.clientY },
            offset: { x: relativeX, y: relativeY },
          });
        }
      } else if (type === 'resize') {
        setResizeData({
          windowId,
          startPos: { x: e.clientX, y: e.clientY },
          startSize: { width: window.size.width, height: window.size.height },
        });
      }
    },
    [openWindows, bringToFront],
  );

  // Global mouse move and up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragData) {
        const desktopRect = desktopRef.current?.getBoundingClientRect();
        if (desktopRect) {
          const headerHeight = 73;
          const taskbarHeight = 52;
          const availableHeight =
            desktopRect.height - headerHeight - taskbarHeight;
          const availableWidth = desktopRect.width;

          const window = openWindows.find((w) => w.id === dragData.windowId);
          if (window) {
            const maxX = availableWidth - window.size.width;
            const maxY = availableHeight - window.size.height;

            const desktopX = e.clientX - desktopRect.left - dragData.offset.x;
            const desktopY =
              e.clientY - desktopRect.top - dragData.offset.y - headerHeight;

            const newX = Math.max(0, Math.min(maxX, desktopX));
            const newY = Math.max(0, Math.min(maxY, desktopY));

            setOpenWindows((prev) =>
              prev.map((w) =>
                w.id === dragData.windowId
                  ? { ...w, position: { x: newX, y: newY } }
                  : w,
              ),
            );
          }
        }
      }

      if (resizeData) {
        const desktopRect = desktopRef.current?.getBoundingClientRect();
        if (desktopRect) {
          const headerHeight = 73;
          const taskbarHeight = 52;
          const availableHeight =
            desktopRect.height - headerHeight - taskbarHeight;
          const availableWidth = desktopRect.width;

          const window = openWindows.find((w) => w.id === resizeData.windowId);
          if (window) {
            const deltaX = e.clientX - resizeData.startPos.x;
            const deltaY = e.clientY - resizeData.startPos.y;

            const maxWidth = availableWidth - window.position.x;
            const maxHeight = availableHeight - window.position.y;

            const newWidth = Math.max(
              300,
              Math.min(maxWidth, resizeData.startSize.width + deltaX),
            );
            const newHeight = Math.max(
              200,
              Math.min(maxHeight, resizeData.startSize.height + deltaY),
            );

            setOpenWindows((prev) =>
              prev.map((w) =>
                w.id === resizeData.windowId
                  ? { ...w, size: { width: newWidth, height: newHeight } }
                  : w,
              ),
            );
          }
        }
      }
    };

    const handleMouseUp = () => {
      setDragData(null);
      setResizeData(null);
    };

    if (dragData || resizeData) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragData, resizeData, openWindows]);

  return (
    <>
      {/* Desktop with Shadow Effect */}
      <div
        ref={desktopRef}
        className="relative h-[600px] w-full cursor-pointer overflow-hidden rounded-lg bg-gray-50 transition-all duration-300"
        style={{
          boxShadow:
            '0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header */}
        <div className="flex cursor-default items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
              <Image src="/logo.svg" alt="Sealos Logo" width={24} height={24} />
            </div>
            <span className="text-lg font-semibold text-gray-900">Sealos</span>
          </div>
        </div>

        {/* Main Dashboard Area */}
        <div
          className="relative flex h-[calc(100%-125px)] cursor-default items-center justify-center p-6"
          onMouseEnter={(e) => {
            if (e.target === e.currentTarget) {
              e.currentTarget.style.cursor = 'default';
            }
          }}
        >
          {/* Module Grid */}
          <div className="grid max-w-4xl grid-cols-4 gap-6">
            {MODULES.map((module) => {
              const IconComponent = module.icon;
              return (
                <motion.div
                  key={module.id}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModule(module)}
                >
                  <div className="flex flex-col items-center space-y-3 rounded-lg p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${module.color}`}
                    >
                      <IconComponent className="h-8 w-8 text-white drop-shadow-sm" />
                    </div>
                    <span className="text-center text-sm font-medium text-gray-700">
                      {module.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Windows */}
          <AnimatePresence mode="popLayout">
            {openWindows
              .filter((window) => !window.isMinimized)
              .map((window) => {
                const IconComponent = window.module.icon;
                return (
                  <motion.div
                    key={window.id}
                    className="absolute overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
                    style={{
                      width: window.size.width,
                      height: window.size.height,
                      left: window.position.x,
                      top: window.position.y,
                      zIndex: window.zIndex,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    {/* Window Header */}
                    <div
                      className="flex cursor-move items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 select-none"
                      onMouseDown={(e) => handleMouseDown(e, window.id, 'drag')}
                    >
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-gray-700" />
                        <span className="font-semibold text-gray-900">
                          {window.module.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            minimizeWindow(window.id);
                          }}
                          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            maximizeWindow(window.id);
                          }}
                          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                        >
                          <Square className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeWindow(window.id);
                          }}
                          className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Window Content */}
                    <div className="h-[calc(100%-57px)] overflow-y-auto p-6">
                      <p className="mb-4 text-sm leading-relaxed text-gray-600">
                        {window.module.description}
                      </p>
                      <div className="mb-6">
                        <h4 className="mb-3 text-sm font-semibold text-gray-800">
                          Key Features:
                        </h4>
                        <ul className="space-y-2">
                          {window.module.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <div className="mr-3 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {window.module.productLink && (
                        <div className="flex justify-end">
                          <a
                            href={window.module.productLink}
                            onClick={() => {
                              trackCustomEvent(
                                'desktop_interaction',
                                'learn_more_click',
                                {
                                  module_id: window.module.id,
                                  module_name: window.module.name,
                                  product_link: window.module.productLink,
                                },
                              );
                            }}
                            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                          >
                            <span>Learn More</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Resize Handle */}
                    <div
                      className="absolute right-0 bottom-0 z-10 h-4 w-4 cursor-nw-resize"
                      onMouseDown={(e) =>
                        handleMouseDown(e, window.id, 'resize')
                      }
                    >
                      <div className="absolute right-1 bottom-1 h-3 w-3 opacity-50">
                        <Square className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>

        {/* Taskbar/Dock */}
        <div className="absolute right-0 bottom-0 left-0 h-[52px] cursor-default border-t border-gray-200 bg-white/95 px-6 py-3 backdrop-blur-sm">
          <div className="flex h-full items-center justify-between">
            <div className="relative flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">
                {openWindows.length} app
                {openWindows.length !== 1 ? 's' : ''} running
              </span>

              {/* Minimize All Button - Positioned absolutely to avoid layout shift */}
              {openWindows.some((w) => !w.isMinimized) && (
                <button
                  onClick={minimizeAllWindowsWithTooltip}
                  onMouseEnter={(e) =>
                    showTooltip('Minimize all windows', e.currentTarget)
                  }
                  onMouseLeave={hideTooltip}
                  className="absolute left-full ml-4 flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-gray-50 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100"
                  title="Minimize all windows"
                >
                  <MinusSquare className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>

            {/* Active Windows Dock */}
            <div className="flex items-center space-x-2">
              {openWindows.map((window) => {
                const IconComponent = window.module.icon;
                return (
                  <motion.button
                    key={window.id}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200 ${
                      window.isMinimized
                        ? 'border-gray-200 bg-gray-100 hover:bg-gray-200'
                        : 'border-blue-200 bg-blue-50 shadow-sm hover:bg-blue-100'
                    }`}
                    onClick={() => {
                      if (window.isMinimized) {
                        restoreWindow(window.id);
                      } else {
                        minimizeWindow(window.id);
                      }
                    }}
                    onMouseEnter={(e) => {
                      const tooltipText = `${window.module.name}${window.isMinimized ? ' (minimized)' : ''}`;
                      showTooltip(tooltipText, e.currentTarget);
                    }}
                    onMouseLeave={hideTooltip}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <IconComponent className="h-5 w-5 text-gray-700" />

                    {/* Active indicator */}
                    {!window.isMinimized && (
                      <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500"></div>
                    )}
                  </motion.button>
                );
              })}

              {openWindows.length === 0 && (
                <span className="text-xs text-gray-400 italic">
                  No active applications
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{todayDate}</span>
            </div>
          </div>
        </div>

        {/* Loading Screen */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-white"
            >
              <div className="text-center">
                <motion.div
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-blue-200 bg-white shadow-lg"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Image
                    src="/logo.svg"
                    alt="Sealos Logo"
                    width={64}
                    height={64}
                  />
                </motion.div>
                <div className="mb-2 text-xl font-bold text-gray-800">
                  Sealos
                </div>
                <div className="text-sm text-gray-500">
                  Loading your workspace...
                </div>
                <div className="mt-4">
                  <div className="mx-auto h-1 w-32 overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      className="h-full bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>{' '}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Portal-rendered Tooltip */}
      {mounted &&
        tooltip.show &&
        typeof window !== 'undefined' &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="pointer-events-none fixed rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translateX(-50%) translateY(-100%)',
              zIndex: 999999,
            }}
          >
            {tooltip.text}
          </div>,
          document.body,
        )}
    </>
  );
}
