import React, { useState } from 'react';
import { Category, ImportJob, PortfolioItem } from '../types';
import {
  X,
  Check,
  Bookmark,
  Trash2,
  Sparkles,
  Star,
  ExternalLink,
  Tag,
  Plus,
} from 'lucide-react';

interface AiReviewDrawerProps {
  isOpen: boolean;
  job: ImportJob | null;
  categories: Category[];
  onClose: () => void;
  onApproveAndPublish: (approvedData: {
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
  }) => void;
  onReject: (jobId: string) => void;
}

export const AiReviewDrawer: React.FC<AiReviewDrawerProps> = ({
  isOpen,
  job,
  categories,
  onClose,
  onApproveAndPublish,
  onReject,
}) => {
  if (!isOpen || !job) return null;

  const metadata = job.suggestedMetadata || {
    title: 'Monolith Silhouette',
    description: 'High-contrast chiaroscuro visual monograph.',
    recommendedCategorySlug: categories[0]?.slug || 'fashion-editorial',
    confidence: 0.94,
    tags: ['Editorial', 'Cinema', 'Monochrome'],
    suggestedAspectRatio: 1.33,
  };

  const initialCat =
    categories.find((c) => c.slug === metadata.recommendedCategorySlug) ||
    categories[0] || { id: 'cat-1', name: 'General', slug: 'general' };

  const [title, setTitle] = useState<string>(metadata.title || '');
  const [description, setDescription] = useState<string>(metadata.description || '');
  const [categoryId, setCategoryId] = useState<string>(initialCat.id);
  const [tags, setTags] = useState<string[]>(metadata.tags || []);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<number>(metadata.suggestedAspectRatio || 1.33);

  const previewImage =
    job.previewThumbnail ||
    '/src/assets/images/fashion_monochrome_editorial_1794341700592.jpg';

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const clean = newTagInput.trim().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAction = (publishImmediate: boolean) => {
    onApproveAndPublish({
      title,
      description,
      categoryId,
      tags,
      isFeatured,
      publishImmediate,
      mediaUrl: previewImage,
      thumbnailUrl: previewImage,
      aspectRatio,
      sourceType: job.sourceType,
      sourceReference: job.sourcePayload,
      confidence: metadata.confidence,
      aiSummary: `Autonomous visual curation: Detected theme and matched category strictly against studio taxonomy.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="bg-[#fbf9f5] border-l border-[#e8e3d8] w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-7 py-5 border-b border-[#e8e3d8] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono-num uppercase tracking-widest text-stone-500">
              Curatorial Verification
            </div>
            <h2 className="font-editorial text-2xl text-[#141416]">AI Review & Placement</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono-num text-xs font-medium text-stone-700 bg-stone-200/80 px-2 py-0.5 rounded">
              {Math.round((metadata.confidence || 0.94) * 100)}% match
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-7 overflow-y-auto space-y-6 flex-1">
          {/* Media Keyframe Preview */}
          <div className="relative rounded-lg overflow-hidden bg-stone-950 aspect-[16/9] shadow-sm">
            <img
              src={previewImage}
              alt="Analyzed Frame"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono-num px-2.5 py-1 rounded">
              Extracted Keyframe @ 00:03.4
            </div>
            <div className="absolute bottom-3 right-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono-num px-2.5 py-1 rounded">
              Source: {job.sourceType === 'INSTAGRAM' ? 'Instagram Reel' : 'Direct Master'}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 font-mono-num mb-1">
              Curatorial Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded font-editorial text-xl text-stone-900 focus:outline-none focus:border-stone-800"
              placeholder="e.g. Monolith Silence: AW26 Lookbook"
            />
            <div className="text-[11px] text-stone-500 mt-1">
              AI formulated minimal editorial title. Editable by photographer.
            </div>
          </div>

          {/* Curatorial Statement / Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 font-mono-num mb-1">
              Curatorial Statement / Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded text-sm text-stone-800 leading-relaxed focus:outline-none focus:border-stone-800"
              placeholder="Artistic description detailing light, texture, and concept..."
            />
          </div>

          {/* Category & Placement Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 font-mono-num mb-1">
                Assigned Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-800 focus:outline-none focus:border-stone-800 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.slug})
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-stone-500 mt-1">
                Restricted to existing studio categories.
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 font-mono-num mb-1">
                Grid Framing Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-800 focus:outline-none focus:border-stone-800 cursor-pointer font-mono-num"
              >
                <option value={1.33}>4:3 Standard Editorial (1.33)</option>
                <option value={1.77}>16:9 Anamorphic Cinema (1.77)</option>
                <option value={0.75}>3:4 Vertical Fashion (0.75)</option>
                <option value={1.0}>1:1 Square Study (1.00)</option>
              </select>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="p-3.5 bg-white border border-[#e8e3d8] rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className={`w-4 h-4 ${isFeatured ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
              <div>
                <div className="text-xs font-medium text-stone-800">Pin as Featured Spotlight</div>
                <div className="text-[11px] text-stone-500">
                  Places item in hero prominence on the public website.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900" />
            </label>
          </div>

          {/* Tags Editor */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 font-mono-num mb-1.5">
              Metadata Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-stone-700 bg-stone-100 border border-stone-200 rounded"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-stone-400 hover:text-stone-700 ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add artistic tag (e.g. 35mm, Chiaroscuro)..."
                className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:border-stone-800"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-7 py-4 bg-stone-100 border-t border-[#e8e3d8] flex items-center justify-between">
          <button
            onClick={() => {
              onReject(job.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reject & Purge</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAction(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save as Draft</span>
            </button>

            <button
              onClick={() => handleAction(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#141416] hover:bg-stone-800 rounded transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve & Publish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
