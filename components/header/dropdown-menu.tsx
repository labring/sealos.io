'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'fumadocs-core/link';
import { cn } from '@/lib/utils';

interface DropdownItem {
  text: string;
  url: string;
  isExternal?: boolean;
}

interface DropdownMenuProps {
  trigger: string;
  items: DropdownItem[];
  className?: string;
}

export default function DropdownMenu({
  trigger,
  items,
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to allow moving to dropdown
  };

  return (
    <div
      className={cn('relative', className)}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-[#0306070D]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="py-2">
            {items.map((item) => (
              <Link
                key={item.text}
                href={item.url}
                className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
