import React from 'react';
import { Category, PortfolioItem, ImportJob, WebsiteSettings, NavTab } from '../types';
import {
  UploadCloud,
  Sparkles,
  ArrowRight,
  Globe,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
  Star,
  ExternalLink,
} from 'lucide-react';

interface DashboardOverviewProps {
  portfolioItems: PortfolioItem[];
  categories: Category[];
  jobs: ImportJob[];
  settings: WebsiteSettings;
  onOpenUpload: () => void;
  onSelectTab: (tab: NavTab) => void;
  onViewPublicSite: () => void;
  onOpenReviewJob: (job: ImportJob) => void;
  onToggleAutopilot: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  portfolioItems,
  categories,
  jobs,
  settings,
  onOpenUpload,
  onSelectTab,
  onViewPublicSite,
  onOpenReviewJob,
  onToggleAutopilot,
}) => {
  const publishedItems = portfolioItems.filter((i) => i.isPublished);
  const draftItems = portfolioItems.filter((i) => !i.isPublished);
  const featuredItems = portfolioItems.filter((i) => i.isFeatured);
  const pendingReviewJobs = jobs.filter((j) => j.status === 'REQUIRES_REVIEW');
  const recentJobs = jobs.slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e8e3d8]">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-mono-num">
            Studio CMS Engine
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#141416] mt-1 tracking-tight">
            Curatorial Overview
          </h1>
          <p className="text-stone-600 text-sm mt-2 max-w-xl leading-relaxed">
            Autonomous ingestion, intelligent category mapping, and direct sync to your live public portfolio site at{' '}
            <span className="font-mono-num text-xs text-stone-800 bg-stone-200/60 px-1.5 py-0.5 rounded">
              /site/{settings.subdomain}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewPublicSite}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-stone-800 bg-white border border-[#e8e3d8] rounded-md hover:bg-stone-50 transition-colors shadow-xs cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            <span>Open Public Site</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </button>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-[#141416] hover:bg-stone-800 rounded-md transition-colors shadow-sm cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest Media</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Zero-Pill, Tabular Figures) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-5 bg-white border border-[#e8e3d8] rounded-lg">
          <div className="text-xs text-stone-500 font-medium">Total Portfolio Works</div>
          <div className="mt-2 text-3xl font-light font-editorial text-[#141416] font-mono-num">
            {portfolioItems.length}
          </div>
          <div className="mt-2 text-xs text-stone-500 flex items-center gap-1.5">
            <span>{publishedItems.length} live</span>
            <span aria-hidden="true">·</span>
            <span>{draftItems.length} drafts</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#e8e3d8] rounded-lg">
          <div className="text-xs text-stone-500 font-medium">Active Taxonomies</div>
          <div className="mt-2 text-3xl font-light font-editorial text-[#141416] font-mono-num">
            {categories.length}
          </div>
          <div className="mt-2 text-xs text-stone-500">
            <span>User-defined classification pool</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#e8e3d8] rounded-lg">
          <div className="text-xs text-stone-500 font-medium">Featured Spotlights</div>
          <div className="mt-2 text-3xl font-light font-editorial text-[#141416] font-mono-num flex items-center gap-2">
            <span>{featuredItems.length}</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 inline" />
          </div>
          <div className="mt-2 text-xs text-stone-500">
            <span>Priority grid tier</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#e8e3d8] rounded-lg">
          <div className="text-xs text-stone-500 font-medium">Autopilot Engine</div>
          <div className="mt-2 text-2xl font-light font-editorial text-[#141416] flex items-center gap-2">
            <span className={settings.autopilotEnabled ? 'text-stone-900 font-normal' : 'text-stone-400'}>
              {settings.autopilotEnabled ? 'Autonomous' : 'Manual'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
            <span>{settings.autoPublishEnabled ? 'Auto-publish' : 'Approval required'}</span>
            <button
              onClick={onToggleAutopilot}
              className="text-stone-700 hover:text-stone-950 underline cursor-pointer text-[11px]"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>

      {/* Review Banner if jobs require human approval */}
      {pendingReviewJobs.length > 0 && (
        <div className="p-5 bg-stone-900 text-stone-100 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium">
                {pendingReviewJobs.length} item{pendingReviewJobs.length > 1 ? 's' : ''} awaiting curatorial approval
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                AI has finished frame analysis, category matching, and metadata composition.
              </div>
            </div>
          </div>
          <button
            onClick={() => onOpenReviewJob(pendingReviewJobs[0])}
            className="px-4 py-2 text-xs font-medium bg-white text-stone-900 hover:bg-stone-100 rounded transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            Review First Ingestion
          </button>
        </div>
      )}

      {/* Two Column Layout: Recent Uploads & AI Ingestion Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Portfolio Works */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl text-[#141416]">Recent Portfolio Works</h2>
            <button
              onClick={() => onSelectTab('portfolio')}
              className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>View all ({portfolioItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolioItems.slice(0, 4).map((item) => {
              const category = categories.find((c) => c.id === item.categoryId);
              return (
                <div
                  key={item.id}
                  className="group bg-white border border-[#e8e3d8] rounded-lg overflow-hidden flex flex-col hover:border-stone-400 transition-all"
                >
                  <div className="relative aspect-[4/3] bg-stone-900 overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono-num px-2 py-0.5 rounded">
                      {item.sourceType === 'INSTAGRAM' ? 'Instagram Reel' : 'Direct Master'}
                    </div>
                    {item.isFeatured && (
                      <div className="absolute top-3 right-3 bg-amber-500/90 text-stone-950 p-1 rounded">
                        <Star className="w-3 h-3 fill-stone-950" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-stone-500 uppercase tracking-wider">
                        {category?.name || 'Uncategorized'}
                      </div>
                      <h3 className="font-editorial text-lg text-stone-900 mt-1 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span className={item.isPublished ? 'text-stone-700 font-medium' : 'text-stone-400'}>
                        {item.isPublished ? 'Published to Grid' : 'Draft'}
                      </span>
                      {item.aiConfidence && (
                        <span className="font-mono-num text-[11px]">
                          {Math.round(item.aiConfidence * 100)}% AI confidence
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: AI Processing Pipeline & Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl text-[#141416]">Ingestion Jobs</h2>
            <button
              onClick={() => onSelectTab('activity')}
              className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Activity log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-[#e8e3d8] rounded-lg divide-y divide-[#e8e3d8]">
            {recentJobs.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No active import jobs. Ingest a Reel or video to begin.
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-stone-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono-num text-stone-500 flex items-center gap-1.5">
                        <span>{job.sourceType === 'INSTAGRAM' ? 'Reel URL' : 'Direct Upload'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-sm font-medium text-stone-900 truncate mt-0.5">
                        {job.suggestedMetadata?.title || job.sourcePayload}
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        {job.statusMessage}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {job.status === 'PUBLISHED' && (
                        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Live
                        </span>
                      )}
                      {job.status === 'REQUIRES_REVIEW' && (
                        <button
                          onClick={() => onOpenReviewJob(job)}
                          className="text-[11px] font-medium text-amber-900 bg-amber-50 border border-amber-300 hover:bg-amber-100 px-2 py-0.5 rounded cursor-pointer"
                        >
                          Review
                        </button>
                      )}
                      {job.status !== 'PUBLISHED' && job.status !== 'REQUIRES_REVIEW' && (
                        <span className="text-[11px] font-mono-num text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          {job.stepProgress}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for in-flight tasks */}
                  {job.stepProgress < 100 && (
                    <div className="mt-3 w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-stone-900 h-full transition-all duration-300"
                        style={{ width: `${job.stepProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Quick Upload Action Box */}
          <div className="p-5 border border-dashed border-stone-300 rounded-lg bg-stone-100/40 text-center">
            <UploadCloud className="w-8 h-8 mx-auto text-stone-400 stroke-1" />
            <div className="text-sm font-medium text-stone-800 mt-2">Ready to publish new work?</div>
            <p className="text-xs text-stone-500 mt-1">
              Supports MP4, MOV, or Instagram Reel links.
            </p>
            <button
              onClick={onOpenUpload}
              className="mt-4 px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors cursor-pointer"
            >
              Add New Work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
