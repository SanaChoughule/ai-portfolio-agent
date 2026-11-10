import React, { useState } from 'react';
import { WebsiteSettings, PortfolioItem, Category } from '../types';
import { ArrowLeft, ExternalLink, X, Film, Star } from 'lucide-react';

interface PublicPortfolioSiteProps {
  settings: WebsiteSettings;
  items: PortfolioItem[];
  categories: Category[];
  isEmbed?: boolean;
  onBackToDashboard?: () => void;
}

export const PublicPortfolioSite: React.FC<PublicPortfolioSiteProps> = ({
  settings,
  items,
  categories,
  isEmbed = false,
  onBackToDashboard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const publishedItems = items.filter((it) => it.isPublished);

  const filteredItems =
    selectedCategory === 'all'
      ? publishedItems
      : publishedItems.filter((it) => it.categoryId === selectedCategory);

  // Template Theme
  const getTheme = () => {
    switch (settings.templateName) {
      case 'monochrome-brutalist':
        return {
          bg: 'bg-[#080809]',
          textPrimary: 'text-[#f4f4f5]',
          textMuted: 'text-[#a1a1aa]',
          border: 'border-[#27272a]',
          cardBg: 'bg-[#121214]',
          headerFont: 'font-sans font-bold tracking-tight',
        };
      case 'warm-cinematic':
        return {
          bg: 'bg-[#15120e]',
          textPrimary: 'text-[#faebd7]',
          textMuted: 'text-[#c4b5a3]',
          border: 'border-[#383129]',
          cardBg: 'bg-[#1e1a14]',
          headerFont: 'font-editorial font-normal',
        };
      case 'editorial-minimal':
      default:
        return {
          bg: 'bg-[#fbf9f5]',
          textPrimary: 'text-[#141416]',
          textMuted: 'text-stone-600',
          border: 'border-[#e8e3d8]',
          cardBg: 'bg-white',
          headerFont: 'font-editorial font-normal',
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textPrimary} transition-colors selection:bg-stone-900 selection:text-white`}>
      {/* Floating back button for prototype convenience */}
      {onBackToDashboard && !isEmbed && (
        <div className="fixed top-5 left-5 z-40">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium bg-stone-900/90 text-white hover:bg-stone-950 backdrop-blur-md rounded-full shadow-lg border border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Studio CMS Dashboard</span>
          </button>
        </div>
      )}

      {/* Editorial Header */}
      {!isEmbed && (
        <header className="max-w-7xl mx-auto px-6 pt-24 pb-14 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-stone-300/40">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-widest font-mono-num text-stone-500 mb-2">
                Portfolio · Selected Works
              </div>
              <h1 className={`text-4xl sm:text-6xl md:text-7xl ${theme.headerFont} tracking-tight leading-[1.08]`}>
                {settings.headline}
              </h1>
              <p className={`mt-6 text-base sm:text-lg leading-relaxed ${theme.textMuted} font-light`}>
                {settings.biography}
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-mono-num text-stone-500 uppercase tracking-wider">
                Location
              </div>
              <div className="text-sm font-medium mt-0.5">{settings.location || 'London · Tokyo'}</div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono-num">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`pb-1 cursor-pointer transition-colors ${
                selectedCategory === 'all'
                  ? `border-b-2 border-current font-semibold ${theme.textPrimary}`
                  : `${theme.textMuted} hover:text-stone-900`
              }`}
            >
              All Works ({publishedItems.length})
            </button>
            {categories.map((cat) => {
              const count = publishedItems.filter((i) => i.categoryId === cat.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`pb-1 cursor-pointer transition-colors ${
                    selectedCategory === cat.id
                      ? `border-b-2 border-current font-semibold ${theme.textPrimary}`
                      : `${theme.textMuted} hover:text-stone-900`
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </header>
      )}

      {/* Dynamic Grid Engine */}
      <main className={`max-w-7xl mx-auto px-6 md:px-12 pb-28 ${isEmbed ? 'pt-6' : ''}`}>
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm font-light text-stone-500">No published portfolio works in this category.</p>
          </div>
        ) : (
          <div
            className="grid gap-x-8 gap-y-14"
            style={{
              gridTemplateColumns: `repeat(${settings.desktopColumns}, minmax(0, 1fr))`,
            }}
          >
            {filteredItems.map((item) => {
              const category = categories.find((c) => c.id === item.categoryId);

              return (
                <article
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className="group flex flex-col cursor-pointer"
                >
                  <div
                    className="overflow-hidden rounded-xs bg-stone-950 relative"
                    style={{ aspectRatio: `${item.aspectRatio || 1.33}` }}
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    />

                    {item.isFeatured && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 px-2 py-0.5 rounded text-[10px] font-mono-num font-semibold shadow-sm">
                        Featured
                      </div>
                    )}

                    {item.mediaType === 'video' && (
                      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white p-1 rounded-full">
                        <Film className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Title & Category Line */}
                  <div className="mt-4 flex items-baseline justify-between border-b border-stone-300/40 pb-2">
                    <h3 className={`font-editorial text-xl sm:text-2xl tracking-tight ${theme.textPrimary}`}>
                      {item.title}
                    </h3>
                    <span className="text-xs uppercase tracking-widest font-mono-num text-stone-400 ml-4 shrink-0">
                      {category?.name || 'Editorial'}
                    </span>
                  </div>

                  <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${theme.textMuted} line-clamp-2 font-light`}>
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Signature Footer */}
      {!isEmbed && (
        <footer className="border-t border-stone-300/40 py-12 text-center text-xs tracking-widest uppercase font-mono-num text-stone-400">
          Published with PortfolioPilot Autonomous CMS Engine
        </footer>
      )}

      {/* Fullscreen Lightbox / Media Viewer */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="max-w-4xl w-full bg-[#121214] text-stone-100 rounded-lg overflow-hidden shadow-2xl border border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[68vh] bg-black flex items-center justify-center overflow-hidden">
              {activeItem.mediaType === 'video' && activeItem.mediaUrl.endsWith('.mp4') ? (
                <video src={activeItem.mediaUrl} controls autoPlay className="max-h-[68vh] w-auto" />
              ) : (
                <img
                  src={activeItem.mediaUrl}
                  alt={activeItem.title}
                  className="max-h-[68vh] w-auto object-contain"
                />
              )}

              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black text-white rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-7 space-y-3">
              <div className="text-xs uppercase font-mono-num tracking-wider text-stone-400">
                {categories.find((c) => c.id === activeItem.categoryId)?.name || 'Editorial Work'}
              </div>
              <h2 className="font-editorial text-3xl text-white font-normal">
                {activeItem.title}
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed font-light">
                {activeItem.description}
              </p>

              <div className="pt-2 flex flex-wrap gap-1.5">
                {activeItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono-num bg-stone-800 text-stone-300 px-2.5 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
