import React from 'react';
import { NavTab } from '../types';
import { Plus, Eye, Sparkles, SlidersHorizontal, Globe } from 'lucide-react';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenUpload: () => void;
  onViewPublicSite: () => void;
  autopilotEnabled: boolean;
  publishedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenUpload,
  onViewPublicSite,
  autopilotEnabled,
  publishedCount,
}) => {
  const navItems: { id: NavTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'categories', label: 'Categories' },
    { id: 'activity', label: 'AI Activity' },
    { id: 'website', label: 'Website' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#e8e3d8]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Clean Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('overview')}
            className="text-left group flex items-baseline gap-2 cursor-pointer"
          >
            <span className="font-editorial text-2xl font-semibold tracking-tight text-[#141416]">
              PortfolioPilot
            </span>
            <span className="text-[11px] font-mono-num uppercase tracking-widest text-stone-500 hidden sm:inline">
              Studio CMS
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean text with underline) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`whitespace-nowrap transition-colors py-1 relative cursor-pointer ${
                  isActive
                    ? 'text-[#141416] font-semibold'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#141416]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onViewPublicSite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100/80 hover:bg-stone-200/80 rounded-md transition-colors whitespace-nowrap cursor-pointer border border-[#e8e3d8]"
            title="View Live Public Portfolio Website"
          >
            <Globe className="w-3.5 h-3.5 text-stone-600" />
            <span>Public Site</span>
            <span className="font-mono-num text-[11px] text-stone-500 ml-1">({publishedCount})</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#141416] hover:bg-stone-800 rounded-md shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Work</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden flex overflow-x-auto px-6 py-2 border-t border-[#e8e3d8] gap-4 text-xs font-medium scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`whitespace-nowrap py-1 ${
              currentTab === item.id
                ? 'text-[#141416] font-semibold border-b-2 border-[#141416]'
                : 'text-stone-500'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
