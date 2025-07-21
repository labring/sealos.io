'use client';

import { memo } from 'react';

const TerminalDemo = memo(() => {
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[16/10]"
      style={{
        contain: 'layout style',
        willChange: 'contents',
      }}
    >
      {/* Terminal Container */}
      <div className="h-full rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-1 shadow-2xl">
        <div className="flex h-full flex-col rounded-lg bg-gray-900">
          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500 transition-opacity hover:opacity-80"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500 transition-opacity hover:opacity-80"></div>
              <div className="h-3 w-3 rounded-full bg-green-500 transition-opacity hover:opacity-80"></div>
            </div>
            <div className="text-xs text-gray-400">devbox@devbox:~/project</div>
          </div>

          {/* Terminal Content */}
          <div className="flex-1 overflow-hidden p-4 font-mono text-sm">
            <div className="space-y-3">
              {/* Command 2 */}
              <div className="flex items-start">
                <span className="mr-2 text-green-400">$</span>
                <span className="text-white">npm install</span>
              </div>

              {/* Progress Bar */}
              <div className="ml-4">
                <div className="mb-1 text-xs text-gray-500">
                  <span className="text-blue-400">info</span> - Installing
                  dependencies...
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-90"></div>
                </div>
                <div className="mt-1 text-xs text-green-400">
                  added 324 packages in 12s
                </div>
              </div>

              {/* Command 3 */}
              <div className="flex items-start">
                <span className="mr-2 text-green-400">$</span>
                <span className="text-white">npm run dev</span>
              </div>

              {/* Next.js Dev Server Output */}
              <div className="ml-4 space-y-1 text-gray-400">
                <div className="text-cyan-400">▲ Next.js 14.2.28</div>
                <div>
                  - Local:{' '}
                  <span className="text-blue-400 underline">
                    http://localhost:3000
                  </span>
                </div>
                <div>- Environments: .env.local</div>
                <div className="mt-2 text-green-400">✓ Ready in 2.1s</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute right-4 bottom-4 z-10">
        <div className="rounded-lg bg-white p-3 shadow-xl lg:p-4">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-[#44BCFF] lg:h-8 lg:w-8"></div>
            <div>
              <div className="text-xs text-gray-500">DevBox Status</div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-semibold text-green-600">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TerminalDemo.displayName = 'TerminalDemo';

export default TerminalDemo;
