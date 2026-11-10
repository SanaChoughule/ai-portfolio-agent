export type GridStrategy = 'FEATURED_FIRST' | 'NEWEST_FIRST' | 'MANUAL';
export type TemplateName = 'editorial-minimal' | 'monochrome-brutalist' | 'warm-cinematic';
export type GridLayout = 'masonry' | 'balanced-grid' | 'editorial-asymmetric';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  colorHex?: string;
  itemCount?: number;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  tags: string[];
  mediaUrl: string;
  thumbnailUrl: string;
  aspectRatio: number; // e.g. 1.33 (4:3), 0.75 (3:4), 1.77 (16:9), 1.0 (1:1)
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  aiConfidence?: number;
  aiSummary?: string;
  sourceType: 'DIRECT_UPLOAD' | 'INSTAGRAM';
  sourceReference?: string;
  mediaType: 'photo' | 'video';
  durationSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus =
  | 'QUEUED'
  | 'VALIDATING'
  | 'EXTRACTING_FRAMES'
  | 'GENERATING_THUMBNAIL'
  | 'ANALYZING_VISUALS'
  | 'IDENTIFYING_CATEGORY'
  | 'GENERATING_METADATA'
  | 'CALCULATING_PLACEMENT'
  | 'REQUIRES_REVIEW'
  | 'PUBLISHED'
  | 'FAILED';

export interface SuggestedMetadata {
  title: string;
  description: string;
  recommendedCategorySlug: string;
  confidence: number;
  tags: string[];
  suggestedAspectRatio: number;
  visualThemes?: string[];
  lightingMood?: string;
  colorPalette?: string[];
}

export interface ImportJob {
  id: string;
  sourceType: 'DIRECT_UPLOAD' | 'INSTAGRAM';
  sourcePayload: string;
  status: JobStatus;
  stepProgress: number; // 0 to 100
  statusMessage: string;
  suggestedMetadata?: SuggestedMetadata;
  portfolioItemId?: string;
  previewThumbnail?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface WebsiteSettings {
  subdomain: string;
  headline: string;
  biography: string;
  location: string;
  templateName: TemplateName;
  accentColor: string;
  gridLayout: GridLayout;
  desktopColumns: number;
  mobileColumns: number;
  autopilotEnabled: boolean;
  aiMetadataEnabled: boolean;
  autoCategorizationEnabled: boolean;
  autoPublishEnabled: boolean;
  gridStrategy: GridStrategy;
  preserveOriginalResolution: boolean;
  smartWebpCompression: boolean;
  watermarkEnabled: boolean;
  updatedAt: string;
}

export type NavTab = 'overview' | 'portfolio' | 'categories' | 'activity' | 'website' | 'settings';
