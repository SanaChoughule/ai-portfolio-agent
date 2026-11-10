import { Category, PortfolioItem, WebsiteSettings, ImportJob } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-fashion',
    name: 'Fashion & Editorial',
    slug: 'fashion-editorial',
    description: 'High-concept haute couture, lookbooks, and sculptural garment photography.',
    colorHex: '#141416',
    itemCount: 2,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'cat-cinematography',
    name: 'Cinematography & Film',
    slug: 'cinematography-film',
    description: 'Director of photography showreels, narrative shorts, and anamorphic motion stills.',
    colorHex: '#b88648',
    itemCount: 2,
    createdAt: '2026-01-16T11:00:00.000Z',
  },
  {
    id: 'cat-architecture',
    name: 'Brutalist Architecture',
    slug: 'brutalist-architecture',
    description: 'Monolithic concrete pavilions, geometric spatial studies, and arid landscapes.',
    colorHex: '#847a6b',
    itemCount: 1,
    createdAt: '2026-01-18T14:30:00.000Z',
  },
  {
    id: 'cat-documentary',
    name: 'Documentary & Street',
    slug: 'documentary-street',
    description: 'Observational urban realism, atmospheric nightscapes, and human silhouettes.',
    colorHex: '#2a3b4c',
    itemCount: 1,
    createdAt: '2026-01-20T09:15:00.000Z',
  },
];

export const INITIAL_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'item-1',
    title: 'Monolith Silence: AW26 Haute Couture',
    slug: 'monolith-silence-aw26-haute-couture',
    description: 'A study in stark chiaroscuro and architectural wool drape against brutalist concrete structures in central London. Shot on Leica M11 Monochrom with 35mm Summilux.',
    categoryId: 'cat-fashion',
    tags: ['Editorial', 'HauteCouture', 'Monochrome', 'Architectural', 'Leica35mm'],
    mediaUrl: '/src/assets/images/fashion_monochrome_editorial_1794341700592.jpg',
    thumbnailUrl: '/src/assets/images/fashion_monochrome_editorial_1794341700592.jpg',
    aspectRatio: 1.33,
    isPublished: true,
    isFeatured: true,
    sortOrder: 1,
    aiConfidence: 0.96,
    aiSummary: 'Autonomous detection of heavy architectural silhouettes, high-contrast monochrome texture, and sculptural couture garments.',
    sourceType: 'DIRECT_UPLOAD',
    sourceReference: 'master_reel_monolith_couture_4k.mov',
    mediaType: 'photo',
    createdAt: '2026-03-01T14:22:00.000Z',
    updatedAt: '2026-03-01T14:22:00.000Z',
  },
  {
    id: 'item-2',
    title: 'Anamorphic Horizon at Golden Hour',
    slug: 'anamorphic-horizon-golden-hour',
    description: 'Cinematography study utilizing Cooke Anamorphic /i Prime 32.3mm lenses mounted on ARRI Alexa 35. Soft horizontal flare capture across brutalist amphitheater at sundown.',
    categoryId: 'cat-cinematography',
    tags: ['Cinematography', 'ARRI35', 'CookeAnamorphic', 'GoldenHour', 'FilmGrain'],
    mediaUrl: '/src/assets/images/cinema_director_lens_1794341700201.jpg',
    thumbnailUrl: '/src/assets/images/cinema_director_lens_1794341700201.jpg',
    aspectRatio: 1.77,
    isPublished: true,
    isFeatured: true,
    sortOrder: 2,
    aiConfidence: 0.94,
    aiSummary: 'Classified under Cinematography due to professional optical rig presence, warm cinematic color grading, and anamorphic perspective.',
    sourceType: 'INSTAGRAM',
    sourceReference: 'https://www.instagram.com/reel/C3zY91KpoLm/',
    mediaType: 'photo',
    createdAt: '2026-03-03T18:10:00.000Z',
    updatedAt: '2026-03-03T18:10:00.000Z',
  },
  {
    id: 'item-3',
    title: 'Desert Brutalism Pavilion IV',
    slug: 'desert-brutalism-pavilion-iv',
    description: 'Raw board-marked cast concrete sanctuary situated in the Mojave desert. Examining spatial tension between rectilinear geometry and natural desert erosion.',
    categoryId: 'cat-architecture',
    tags: ['Architecture', 'Concrete', 'Minimalism', 'Mojave', 'GoldenRatio'],
    mediaUrl: '/src/assets/images/architecture_desert_pavilion_1794341700670.jpg',
    thumbnailUrl: '/src/assets/images/architecture_desert_pavilion_1794341700670.jpg',
    aspectRatio: 1.33,
    isPublished: true,
    isFeatured: false,
    sortOrder: 3,
    aiConfidence: 0.98,
    aiSummary: 'AI identified distinct cantilevered concrete geometry, harsh desert sun shadows, and absence of human figures.',
    sourceType: 'DIRECT_UPLOAD',
    sourceReference: 'desert_brutalist_survey_04.tiff',
    mediaType: 'photo',
    createdAt: '2026-03-05T09:40:00.000Z',
    updatedAt: '2026-03-05T09:40:00.000Z',
  },
  {
    id: 'item-4',
    title: 'Shinjuku Neon Nocturne',
    slug: 'shinjuku-neon-nocturne',
    description: 'Candid nocturnal street study during steady autumn rain in Tokyo. Atmospheric specular reflections across tarmac and translucent umbrella silhouettes.',
    categoryId: 'cat-documentary',
    tags: ['Documentary', 'Tokyo', 'RainyNight', 'CinematicStreet', 'Reflections'],
    mediaUrl: '/src/assets/images/documentary_tokyo_night_1794341700879.jpg',
    thumbnailUrl: '/src/assets/images/documentary_tokyo_night_1794341700879.jpg',
    aspectRatio: 0.75,
    isPublished: true,
    isFeatured: false,
    sortOrder: 4,
    aiConfidence: 0.91,
    aiSummary: 'Classified under Documentary based on natural street movement, weather ambient light, and environmental narrative cues.',
    sourceType: 'INSTAGRAM',
    sourceReference: 'https://www.instagram.com/reel/C8P09xMv3r/',
    mediaType: 'photo',
    createdAt: '2026-03-07T21:15:00.000Z',
    updatedAt: '2026-03-07T21:15:00.000Z',
  },
  {
    id: 'item-5',
    title: 'The Silent Sequence: Narrative Showreel',
    slug: 'silent-sequence-narrative-showreel',
    description: 'A 60-second editorial motion teaser exploring stillness in high-fashion cinema. Commissioned by Studio Vance for Paris Fashion Week.',
    categoryId: 'cat-cinematography',
    tags: ['Motion', 'Directing', 'Showreel', 'FashionFilm', '4K60p'],
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/src/assets/images/cinema_director_lens_1794341700201.jpg',
    aspectRatio: 1.77,
    isPublished: true,
    isFeatured: true,
    sortOrder: 5,
    aiConfidence: 0.93,
    aiSummary: 'Direct video ingestion. Auto-transcoded preview stream with extracted thumbnail at 00:04.2 keyframe.',
    sourceType: 'DIRECT_UPLOAD',
    sourceReference: 'vance_director_showreel_2026_prores.mov',
    mediaType: 'video',
    durationSeconds: 15,
    createdAt: '2026-03-08T11:00:00.000Z',
    updatedAt: '2026-03-08T11:00:00.000Z',
  },
];

export const INITIAL_SETTINGS: WebsiteSettings = {
  subdomain: 'alex-vance',
  headline: 'Alex Vance — Director & Visual Architect',
  biography: 'Directing and photography focusing on brutalist architecture, high-concept fashion narratives, and high-contrast anamorphic cinema. Based in London & Tokyo.',
  location: 'London · Tokyo',
  templateName: 'editorial-minimal',
  accentColor: '#141416',
  gridLayout: 'masonry',
  desktopColumns: 3,
  mobileColumns: 1,
  autopilotEnabled: true,
  aiMetadataEnabled: true,
  autoCategorizationEnabled: true,
  autoPublishEnabled: false, // Default is Approval-required mode as requested in prompt!
  gridStrategy: 'FEATURED_FIRST',
  preserveOriginalResolution: true,
  smartWebpCompression: true,
  watermarkEnabled: false,
  updatedAt: '2026-03-10T08:00:00.000Z',
};

export const INITIAL_IMPORT_JOBS: ImportJob[] = [
  {
    id: 'job-init-1',
    sourceType: 'INSTAGRAM',
    sourcePayload: 'https://www.instagram.com/reel/C3zY91KpoLm/',
    status: 'PUBLISHED',
    stepProgress: 100,
    statusMessage: 'Live on public portfolio',
    portfolioItemId: 'item-2',
    previewThumbnail: '/src/assets/images/cinema_director_lens_1794341700201.jpg',
    createdAt: '2026-03-03T18:05:00.000Z',
    completedAt: '2026-03-03T18:10:00.000Z',
    suggestedMetadata: {
      title: 'Anamorphic Horizon at Golden Hour',
      description: 'Cinematography study with Cooke Anamorphic prime lenses on ARRI 35.',
      recommendedCategorySlug: 'cinematography-film',
      confidence: 0.94,
      tags: ['Cinematography', 'ARRI35', 'GoldenHour'],
      suggestedAspectRatio: 1.77,
      visualThemes: ['Anamorphic optics', 'Brutalist concrete', 'Sunset rim light'],
      lightingMood: 'High-warmth rim illumination',
    },
  },
  {
    id: 'job-init-2',
    sourceType: 'DIRECT_UPLOAD',
    sourcePayload: 'master_reel_monolith_couture_4k.mov',
    status: 'PUBLISHED',
    stepProgress: 100,
    statusMessage: 'Live on public portfolio',
    portfolioItemId: 'item-1',
    previewThumbnail: '/src/assets/images/fashion_monochrome_editorial_1794341700592.jpg',
    createdAt: '2026-03-01T14:15:00.000Z',
    completedAt: '2026-03-01T14:22:00.000Z',
    suggestedMetadata: {
      title: 'Monolith Silence: AW26 Haute Couture',
      description: 'A study in stark chiaroscuro and architectural wool drape.',
      recommendedCategorySlug: 'fashion-editorial',
      confidence: 0.96,
      tags: ['Editorial', 'HauteCouture', 'Monochrome'],
      suggestedAspectRatio: 1.33,
      visualThemes: ['Sculptural silhouette', 'Monochrome concrete', 'Chiaroscuro'],
      lightingMood: 'Directional skylight',
    },
  },
];

const STORAGE_KEYS = {
  CATEGORIES: 'portfoliopilot_categories_v1',
  PORTFOLIO: 'portfoliopilot_items_v1',
  SETTINGS: 'portfoliopilot_settings_v1',
  JOBS: 'portfoliopilot_jobs_v1',
};

export class PortfolioStore {
  private static load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return fallback;
  }

  private static save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  static getCategories(): Category[] {
    const categories = this.load<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const items = this.getPortfolioItems();
    return categories.map((cat) => ({
      ...cat,
      itemCount: items.filter((it) => it.categoryId === cat.id).length,
    }));
  }

  static saveCategories(categories: Category[]): void {
    this.save(STORAGE_KEYS.CATEGORIES, categories);
  }

  static addCategory(cat: Omit<Category, 'id' | 'createdAt'>): Category {
    const current = this.getCategories();
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      createdAt: new Date().toISOString(),
      itemCount: 0,
    };
    const updated = [...current, newCat];
    this.saveCategories(updated);
    return newCat;
  }

  static updateCategory(id: string, updates: Partial<Category>): void {
    const current = this.getCategories();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.saveCategories(updated);
  }

  static deleteCategory(id: string): boolean {
    const items = this.getPortfolioItems();
    const hasItems = items.some((it) => it.categoryId === id);
    if (hasItems) return false;
    const current = this.getCategories();
    this.saveCategories(current.filter((c) => c.id !== id));
    return true;
  }

  static getPortfolioItems(): PortfolioItem[] {
    return this.load<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO_ITEMS);
  }

  static savePortfolioItems(items: PortfolioItem[]): void {
    this.save(STORAGE_KEYS.PORTFOLIO, items);
  }

  static addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>): PortfolioItem {
    const current = this.getPortfolioItems();
    const highestOrder = current.reduce((max, it) => Math.max(max, it.sortOrder), 0);
    const newItem: PortfolioItem = {
      ...item,
      id: `item-${Date.now()}`,
      sortOrder: item.sortOrder ?? highestOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.savePortfolioItems([newItem, ...current]);
    return newItem;
  }

  static updatePortfolioItem(id: string, updates: Partial<PortfolioItem>): void {
    const current = this.getPortfolioItems();
    const updated = current.map((it) =>
      it.id === id ? { ...it, ...updates, updatedAt: new Date().toISOString() } : it
    );
    this.savePortfolioItems(updated);
  }

  static deletePortfolioItem(id: string): void {
    const current = this.getPortfolioItems();
    this.savePortfolioItems(current.filter((it) => it.id !== id));
  }

  static reorderPortfolio(orderedIds: string[]): void {
    const current = this.getPortfolioItems();
    const map = new Map(current.map((it) => [it.id, it]));
    const reordered: PortfolioItem[] = [];

    orderedIds.forEach((id, idx) => {
      const it = map.get(id);
      if (it) {
        reordered.push({ ...it, sortOrder: idx + 1 });
        map.delete(id);
      }
    });

    // Append any missing items
    map.forEach((it) => reordered.push(it));
    this.savePortfolioItems(reordered);
  }

  static getSettings(): WebsiteSettings {
    return this.load<WebsiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  static saveSettings(settings: WebsiteSettings): void {
    this.save(STORAGE_KEYS.SETTINGS, { ...settings, updatedAt: new Date().toISOString() });
  }

  static getJobs(): ImportJob[] {
    return this.load<ImportJob[]>(STORAGE_KEYS.JOBS, INITIAL_IMPORT_JOBS);
  }

  static saveJobs(jobs: ImportJob[]): void {
    this.save(STORAGE_KEYS.JOBS, jobs);
  }

  static addJob(job: Omit<ImportJob, 'id' | 'createdAt'>): ImportJob {
    const current = this.getJobs();
    const newJob: ImportJob = {
      ...job,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.saveJobs([newJob, ...current]);
    return newJob;
  }

  static updateJob(id: string, updates: Partial<ImportJob>): void {
    const current = this.getJobs();
    const updated = current.map((j) => (j.id === id ? { ...j, ...updates } : j));
    this.saveJobs(updated);
  }

  static resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.JOBS);
  }
}
