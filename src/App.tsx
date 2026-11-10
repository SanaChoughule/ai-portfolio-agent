import React, { useState, useEffect } from 'react';
import { NavTab, Category, PortfolioItem, ImportJob, WebsiteSettings } from './types';
import { PortfolioStore } from './services/store';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { PortfolioManager } from './components/PortfolioManager';
import { CategoryManager } from './components/CategoryManager';
import { AiActivityLog } from './components/AiActivityLog';
import { WebsiteBuilder } from './components/WebsiteBuilder';
import { SettingsManager } from './components/SettingsManager';
import { MediaIngestionModal } from './components/MediaIngestionModal';
import { AiProcessingWorkflow } from './components/AiProcessingWorkflow';
import { AiReviewDrawer } from './components/AiReviewDrawer';
import { PublicPortfolioSite } from './components/PublicPortfolioSite';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isPublicSiteView, setIsPublicSiteView] = useState<boolean>(false);
  const [isEmbedView, setIsEmbedView] = useState<boolean>(false);

  // Core application data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(PortfolioStore.getSettings());

  // Ingestion & AI workflow state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [activeProcessingJob, setActiveProcessingJob] = useState<ImportJob | null>(null);
  const [activeReviewJob, setActiveReviewJob] = useState<ImportJob | null>(null);

  // Initial load & URL routing check
  useEffect(() => {
    loadData();

    // Check if directly loaded with /site or /embed
    const pathname = window.location.pathname;
    if (pathname.includes('/site/')) {
      setIsPublicSiteView(true);
    } else if (pathname.includes('/embed/')) {
      setIsPublicSiteView(true);
      setIsEmbedView(true);
    }
  }, []);

  const loadData = () => {
    setCategories(PortfolioStore.getCategories());
    setPortfolioItems(PortfolioStore.getPortfolioItems());
    setJobs(PortfolioStore.getJobs());
    setSettings(PortfolioStore.getSettings());
  };

  // Category handlers
  const handleCreateCategory = (catData: Omit<Category, 'id' | 'createdAt'>) => {
    const created = PortfolioStore.addCategory(catData);
    setCategories(PortfolioStore.getCategories());
  };

  const handleUpdateCategory = (id: string, updates: Partial<Category>) => {
    PortfolioStore.updateCategory(id, updates);
    setCategories(PortfolioStore.getCategories());
  };

  const handleDeleteCategory = (id: string): boolean => {
    const success = PortfolioStore.deleteCategory(id);
    if (success) {
      setCategories(PortfolioStore.getCategories());
    }
    return success;
  };

  // Portfolio handlers
  const handleUpdateItem = (id: string, updates: Partial<PortfolioItem>) => {
    PortfolioStore.updatePortfolioItem(id, updates);
    setPortfolioItems(PortfolioStore.getPortfolioItems());
    setCategories(PortfolioStore.getCategories()); // refresh item counts
  };

  const handleDeleteItem = (id: string) => {
    PortfolioStore.deletePortfolioItem(id);
    setPortfolioItems(PortfolioStore.getPortfolioItems());
    setCategories(PortfolioStore.getCategories());
  };

  const handleReorder = (orderedIds: string[]) => {
    PortfolioStore.reorderPortfolio(orderedIds);
    setPortfolioItems(PortfolioStore.getPortfolioItems());
  };

  // Settings handlers
  const handleUpdateSettings = (newSettings: WebsiteSettings) => {
    PortfolioStore.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleToggleAutopilot = () => {
    const updated = {
      ...settings,
      autopilotEnabled: !settings.autopilotEnabled,
    };
    handleUpdateSettings(updated);
  };

  const handleResetDefaults = () => {
    PortfolioStore.resetToDefaults();
    loadData();
  };

  // Ingestion workflow start
  const handleStartIngest = (ingestData: {
    sourceType: 'DIRECT_UPLOAD' | 'INSTAGRAM';
    payload: string;
    filePreviewUrl?: string;
    mediaType: 'photo' | 'video';
    sourceTitle?: string;
    keyframeBase64?: string;
  }) => {
    const newJob = PortfolioStore.addJob({
      sourceType: ingestData.sourceType,
      sourcePayload: ingestData.payload,
      status: 'QUEUED',
      stepProgress: 5,
      statusMessage: 'Job queued in autonomous processing pool',
      previewThumbnail: ingestData.filePreviewUrl,
    });

    setJobs(PortfolioStore.getJobs());
    setActiveProcessingJob(newJob);
  };

  // Pipeline step update
  const handleJobUpdated = (updatedJob: ImportJob) => {
    PortfolioStore.updateJob(updatedJob.id, updatedJob);
    setJobs(PortfolioStore.getJobs());

    // If auto-published, also create portfolio item right away
    if (updatedJob.status === 'PUBLISHED' && updatedJob.suggestedMetadata) {
      const meta = updatedJob.suggestedMetadata;
      const matchedCat =
        categories.find((c) => c.slug === meta.recommendedCategorySlug) || categories[0];

      const newItem = PortfolioStore.addPortfolioItem({
        title: meta.title,
        slug: meta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: meta.description,
        categoryId: matchedCat?.id || 'cat-fashion',
        tags: meta.tags || ['Editorial'],
        mediaUrl: updatedJob.previewThumbnail || '/src/assets/images/fashion_monochrome_editorial_1794341700592.jpg',
        thumbnailUrl: updatedJob.previewThumbnail || '/src/assets/images/fashion_monochrome_editorial_1794341700592.jpg',
        aspectRatio: meta.suggestedAspectRatio || 1.33,
        isPublished: true,
        isFeatured: false,
        sortOrder: 1,
        aiConfidence: meta.confidence,
        aiSummary: 'Autonomous auto-published via PortfolioPilot Autopilot engine.',
        sourceType: updatedJob.sourceType,
        sourceReference: updatedJob.sourcePayload,
        mediaType: 'photo',
      });

      PortfolioStore.updateJob(updatedJob.id, { portfolioItemId: newItem.id });
      setPortfolioItems(PortfolioStore.getPortfolioItems());
      setCategories(PortfolioStore.getCategories());
    }
  };

  // Approve & Publish from AI Review Drawer
  const handleApproveAndPublish = (approvedData: {
    title: string;
    description: string;
    categoryId: string;
    tags: string[];
    isFeatured: boolean;
    publishImmediate: boolean;
    mediaUrl: string;
    thumbnailUrl: string;
    aspectRatio: number;
    sourceType: 'DIRECT_UPLOAD' | 'INSTAGRAM';
    sourceReference: string;
    confidence: number;
    aiSummary: string;
  }) => {
    const newItem = PortfolioStore.addPortfolioItem({
      title: approvedData.title,
      slug: approvedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: approvedData.description,
      categoryId: approvedData.categoryId,
      tags: approvedData.tags,
      mediaUrl: approvedData.mediaUrl,
      thumbnailUrl: approvedData.thumbnailUrl,
      aspectRatio: approvedData.aspectRatio,
      isPublished: approvedData.publishImmediate,
      isFeatured: approvedData.isFeatured,
      sortOrder: 1,
      aiConfidence: approvedData.confidence,
      aiSummary: approvedData.aiSummary,
      sourceType: approvedData.sourceType,
      sourceReference: approvedData.sourceReference,
      mediaType: 'photo',
    });

    if (activeReviewJob) {
      PortfolioStore.updateJob(activeReviewJob.id, {
        status: approvedData.publishImmediate ? 'PUBLISHED' : 'REQUIRES_REVIEW',
        stepProgress: 100,
        statusMessage: approvedData.publishImmediate
          ? 'Approved and published to public portfolio'
          : 'Saved as draft in studio archive',
        portfolioItemId: newItem.id,
      });
      setJobs(PortfolioStore.getJobs());
    }

    setPortfolioItems(PortfolioStore.getPortfolioItems());
    setCategories(PortfolioStore.getCategories());
    setActiveReviewJob(null);
  };

  const handleRejectJob = (jobId: string) => {
    PortfolioStore.updateJob(jobId, {
      status: 'FAILED',
      statusMessage: 'Rejected and purged by creator',
    });
    setJobs(PortfolioStore.getJobs());
    setActiveReviewJob(null);
  };

  // If currently in public site route or preview view
  if (isPublicSiteView) {
    return (
      <PublicPortfolioSite
        settings={settings}
        items={portfolioItems}
        categories={categories}
        isEmbed={isEmbedView}
        onBackToDashboard={() => setIsPublicSiteView(false)}
      />
    );
  }

  const publishedCount = portfolioItems.filter((i) => i.isPublished).length;

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#141416] flex flex-col font-sans">
      {/* Universal Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onViewPublicSite={() => setIsPublicSiteView(true)}
        autopilotEnabled={settings.autopilotEnabled}
        publishedCount={publishedCount}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 md:py-10">
        {currentTab === 'overview' && (
          <DashboardOverview
            portfolioItems={portfolioItems}
            categories={categories}
            jobs={jobs}
            settings={settings}
            onOpenUpload={() => setIsUploadOpen(true)}
            onSelectTab={setCurrentTab}
            onViewPublicSite={() => setIsPublicSiteView(true)}
            onOpenReviewJob={(job) => setActiveReviewJob(job)}
            onToggleAutopilot={handleToggleAutopilot}
          />
        )}

        {currentTab === 'portfolio' && (
          <PortfolioManager
            items={portfolioItems}
            categories={categories}
            onOpenUpload={() => setIsUploadOpen(true)}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onReorder={handleReorder}
            gridStrategy={settings.gridStrategy}
            onUpdateGridStrategy={(strat) =>
              handleUpdateSettings({ ...settings, gridStrategy: strat })
            }
          />
        )}

        {currentTab === 'categories' && (
          <CategoryManager
            categories={categories}
            portfolioItems={portfolioItems}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {currentTab === 'activity' && (
          <AiActivityLog
            jobs={jobs}
            categories={categories}
            onOpenReviewJob={(job) => setActiveReviewJob(job)}
          />
        )}

        {currentTab === 'website' && (
          <WebsiteBuilder
            settings={settings}
            portfolioItems={portfolioItems}
            categories={categories}
            onUpdateSettings={handleUpdateSettings}
            onOpenPublicSite={() => setIsPublicSiteView(true)}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsManager
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </main>

      {/* Prominent Media Ingestion Modal */}
      <MediaIngestionModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        categories={categories}
        onStartProcessing={handleStartIngest}
      />

      {/* Asynchronous Processing Workflow Modal */}
      {activeProcessingJob && (
        <AiProcessingWorkflow
          job={activeProcessingJob}
          categories={categories}
          settings={settings}
          onJobUpdated={handleJobUpdated}
          onOpenReview={(job) => {
            setActiveProcessingJob(null);
            setActiveReviewJob(job);
          }}
          onClose={() => setActiveProcessingJob(null)}
        />
      )}

      {/* AI Review & Placement Drawer */}
      <AiReviewDrawer
        isOpen={Boolean(activeReviewJob)}
        job={activeReviewJob}
        categories={categories}
        onClose={() => setActiveReviewJob(null)}
        onApproveAndPublish={handleApproveAndPublish}
        onReject={handleRejectJob}
      />
    </div>
  );
}
