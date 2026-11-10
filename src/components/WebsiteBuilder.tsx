import React, { useState } from 'react';
import { WebsiteSettings, PortfolioItem, Category, TemplateName, GridLayout } from '../types';
import {
  Globe,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Monitor,
  Code,
  Sliders,
  Palette,
  Eye,
  Sparkles,
} from 'lucide-react';

interface WebsiteBuilderProps {
  settings: WebsiteSettings;
  portfolioItems: PortfolioItem[];
  categories: Category[];
  onUpdateSettings: (newSettings: WebsiteSettings) => void;
  onOpenPublicSite: () => void;
}

export const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({
  settings,
  portfolioItems,
  categories,
  onUpdateSettings,
  onOpenPublicSite,
}) => {
  const [headline, setHeadline] = useState(settings.headline);
  const [biography, setBiography] = useState(settings.biography);
  const [templateName, setTemplateName] = useState<TemplateName>(settings.templateName);
  const [accentColor, setAccentColor] = useState(settings.accentColor);
  const [gridLayout, setGridLayout] = useState<GridLayout>(settings.gridLayout);
  const [desktopColumns, setDesktopColumns] = useState(settings.desktopColumns);
  const [mobileColumns, setMobileColumns] = useState(settings.mobileColumns);

  // Preview device view: 'desktop' | 'mobile' | 'embed'
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'embed'>('desktop');
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const publishedItems = portfolioItems.filter((i) => i.isPublished);

  const handleSave = () => {
    onUpdateSettings({
      ...settings,
      headline,
      biography,
      templateName,
      accentColor,
      gridLayout,
      desktopColumns,
      mobileColumns,
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const publicUrl = `${window.location.origin}/site/${settings.subdomain}`;
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="800" frameborder="0" style="border:0; border-radius: 8px; overflow: hidden;" title="${headline}"></iframe>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Preview styling based on chosen template
  const getTemplateTheme = () => {
    switch (templateName) {
      case 'monochrome-brutalist':
        return {
          bg: 'bg-[#0c0c0d]',
          text: 'text-[#f5f5f5]',
          subtext: 'text-stone-400',
          border: 'border-stone-800',
          cardBg: 'bg-[#141416]',
          cardBorder: 'border-stone-800',
          fontHeading: 'font-sans font-bold tracking-tight',
        };
      case 'warm-cinematic':
        return {
          bg: 'bg-[#181512]',
          text: 'text-[#faebd7]',
          subtext: 'text-[#c2b29e]',
          border: 'border-[#383129]',
          cardBg: 'bg-[#211d19]',
          cardBorder: 'border-[#383129]',
          fontHeading: 'font-editorial font-normal',
        };
      case 'editorial-minimal':
      default:
        return {
          bg: 'bg-[#fbf9f5]',
          text: 'text-[#141416]',
          subtext: 'text-stone-600',
          border: 'border-[#e8e3d8]',
          cardBg: 'bg-white',
          cardBorder: 'border-[#e8e3d8]',
          fontHeading: 'font-editorial font-normal',
        };
    }
  };

  const theme = getTemplateTheme();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e8e3d8]">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-mono-num">
            Public Surface Engine
          </span>
          <h1 className="font-editorial text-4xl font-normal text-[#141416] mt-1">
            Website Builder & Live Preview
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-xl">
            Customization automatically syncs to your live public portfolio at <strong className="font-mono-num text-stone-800 font-medium">/site/{settings.subdomain}</strong> and iframe embed route <strong className="font-mono-num text-stone-800 font-medium">/embed/{settings.subdomain}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-[#e8e3d8] rounded hover:bg-stone-50 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Copy Public URL'}</span>
          </button>

          <button
            onClick={onOpenPublicSite}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#141416] hover:bg-stone-800 rounded shadow-xs cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Open Public Site</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Main Grid: Controls Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Layout Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#e8e3d8] rounded-xl p-6 space-y-6 shadow-xs">
          <div>
            <h2 className="font-editorial text-2xl text-stone-900">Portfolio Identity</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Reflects the photographer or director persona on the public site.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">
                Headline / Master Name
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Alex Vance — Director of Photography"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">
                Artist Statement & Biography
              </label>
              <textarea
                rows={3}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Curatorial biography..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs text-stone-800 leading-relaxed focus:bg-white focus:outline-none focus:border-stone-800"
              />
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-xs font-mono-num uppercase text-stone-600 mb-2">
                Aesthetic Template
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'editorial-minimal' as const, label: 'Editorial Minimal', sub: 'Warm Sand' },
                  { id: 'monochrome-brutalist' as const, label: 'Brutalist', sub: 'Stark Jet' },
                  { id: 'warm-cinematic' as const, label: 'Cinematic', sub: 'Amber Haze' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setTemplateName(tpl.id)}
                    className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                      templateName === tpl.id
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <div className="text-xs font-medium">{tpl.label}</div>
                    <div className={`text-[10px] mt-0.5 ${templateName === tpl.id ? 'text-stone-300' : 'text-stone-500'}`}>
                      {tpl.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Layout Selector */}
            <div>
              <label className="block text-xs font-mono-num uppercase text-stone-600 mb-2">
                Grid Engine Architecture
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'masonry' as const, label: 'Masonry', sub: 'Aspect Preserved' },
                  { id: 'balanced-grid' as const, label: 'Balanced', sub: 'Clean Geometry' },
                  { id: 'editorial-asymmetric' as const, label: 'Asymmetric', sub: 'Curatorial Rhythm' },
                ].map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => setGridLayout(layout.id)}
                    className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                      gridLayout === layout.id
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <div className="text-xs font-medium">{layout.label}</div>
                    <div className={`text-[10px] mt-0.5 ${gridLayout === layout.id ? 'text-stone-300' : 'text-stone-500'}`}>
                      {layout.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop & Mobile Columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">
                  Desktop Columns
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => setDesktopColumns(cols)}
                      className={`flex-1 py-1.5 text-xs font-mono-num rounded border cursor-pointer ${
                        desktopColumns === cols
                          ? 'border-stone-900 bg-stone-900 text-white font-medium'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {cols} col
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">
                  Mobile Columns
                </label>
                <div className="flex gap-2">
                  {[1, 2].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => setMobileColumns(cols)}
                      className={`flex-1 py-1.5 text-xs font-mono-num rounded border cursor-pointer ${
                        mobileColumns === cols
                          ? 'border-stone-900 bg-stone-900 text-white font-medium'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {cols} col
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Embed Snippet Generator */}
            <div className="pt-3 border-t border-stone-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono-num uppercase text-stone-600 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>Embed Code Snippet</span>
                </label>
                <button
                  onClick={handleCopyEmbed}
                  className="text-xs text-stone-700 hover:text-stone-950 underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedEmbed ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmbed ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={2}
                readOnly
                value={embedCode}
                className="w-full px-2.5 py-1.5 bg-stone-100 border border-stone-200 rounded font-mono-num text-[11px] text-stone-600 select-all"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Paste into Squarespace, Webflow, WordPress, or external agency sites.
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{savedNotification ? 'Changes Saved to Public Site' : 'Publish Layout Updates'}</span>
          </button>
        </div>

        {/* Right Column: Live Interactive Viewport Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Device Preview Switcher Bar */}
          <div className="flex items-center justify-between bg-stone-200/80 px-4 py-2 rounded-lg text-xs font-medium">
            <span className="text-stone-600 font-mono-num flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>Live Engine Simulation</span>
            </span>

            <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-stone-300">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setPreviewDevice('embed')}
                className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'embed' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Code className="w-3 h-3" />
                <span>Embed Mode</span>
              </button>
            </div>
          </div>

          {/* Interactive Screen Simulation Frame */}
          <div className="flex justify-center bg-stone-200/40 border border-[#e8e3d8] rounded-xl p-4 overflow-hidden min-h-[580px]">
            <div
              className={`transition-all duration-300 shadow-xl overflow-hidden rounded-lg flex flex-col ${
                previewDevice === 'mobile'
                  ? 'w-[375px] border-4 border-stone-800'
                  : previewDevice === 'embed'
                  ? 'w-full max-w-xl border-2 border-stone-400'
                  : 'w-full border border-stone-300'
              } ${theme.bg}`}
              style={{ maxHeight: '680px' }}
            >
              {/* Browser Window Bar */}
              <div className={`px-4 py-2 border-b flex items-center justify-between text-[11px] font-mono-num ${theme.border} bg-black/5`}>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                </div>
                <div className="text-stone-500 truncate max-w-[200px]">
                  https://portfoliopilot.io/site/{settings.subdomain}
                </div>
                <span className="text-[10px] text-emerald-600">Sync: Live</span>
              </div>

              {/* Scrollable Public Portfolio Content */}
              <div className="p-6 overflow-y-auto space-y-8 flex-1">
                {/* Public Header */}
                <div className="space-y-3 pt-2">
                  <h1 className={`text-2xl sm:text-3xl ${theme.fontHeading} ${theme.text}`}>
                    {headline}
                  </h1>
                  <p className={`text-xs sm:text-sm leading-relaxed max-w-lg ${theme.subtext}`}>
                    {biography}
                  </p>
                </div>

                {/* Categories strip */}
                <div className="flex gap-4 border-b pb-2 text-xs font-mono-num overflow-x-auto border-stone-300/40">
                  <span className={`font-semibold ${theme.text}`}>All ({publishedItems.length})</span>
                  {categories.map((c) => (
                    <span key={c.id} className={`${theme.subtext}`}>
                      {c.name}
                    </span>
                  ))}
                </div>

                {/* Grid of Published Works */}
                {publishedItems.length === 0 ? (
                  <div className="py-12 text-center text-xs text-stone-500">
                    No published works yet. Publish items in Portfolio tab to view here.
                  </div>
                ) : (
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns:
                        previewDevice === 'mobile'
                          ? `repeat(${mobileColumns}, minmax(0, 1fr))`
                          : `repeat(${desktopColumns}, minmax(0, 1fr))`,
                    }}
                  >
                    {publishedItems.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded overflow-hidden flex flex-col group border ${theme.cardBorder} ${theme.cardBg}`}
                      >
                        <div
                          className="w-full bg-stone-900 overflow-hidden relative"
                          style={{ aspectRatio: `${item.aspectRatio || 1.33}` }}
                        >
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                          />
                          {item.isFeatured && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-stone-950 text-[9px] font-mono-num font-semibold px-1.5 py-0.5 rounded">
                              Spotlight
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <div className={`text-xs font-medium font-editorial ${theme.text} line-clamp-1`}>
                            {item.title}
                          </div>
                          <div className={`text-[10px] mt-0.5 line-clamp-1 ${theme.subtext}`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Signature footer */}
                <div className={`pt-6 border-t ${theme.border} text-center text-[10px] uppercase tracking-widest font-mono-num ${theme.subtext}`}>
                  Curated with PortfolioPilot Autonomous CMS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
