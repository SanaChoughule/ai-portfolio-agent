import React, { useState, useMemo } from 'react';
import { Category, PortfolioItem, GridStrategy } from '../types';
import {
  Search,
  Filter,
  Plus,
  Star,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
  Sparkles,
  ExternalLink,
  X,
  Check,
} from 'lucide-react';

interface PortfolioManagerProps {
  items: PortfolioItem[];
  categories: Category[];
  onOpenUpload: () => void;
  onUpdateItem: (id: string, updates: Partial<PortfolioItem>) => void;
  onDeleteItem: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  gridStrategy: GridStrategy;
  onUpdateGridStrategy: (strategy: GridStrategy) => void;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  items,
  categories,
  onOpenUpload,
  onUpdateItem,
  onDeleteItem,
  onReorder,
  gridStrategy,
  onUpdateGridStrategy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Edit item state
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Lightbox preview state
  const [activeLightboxItem, setActiveLightboxItem] = useState<PortfolioItem | null>(null);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((it) => it.categoryId === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          it.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort order strategy
    if (gridStrategy === 'FEATURED_FIRST') {
      result.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) {
          return a.isFeatured ? -1 : 1;
        }
        return a.sortOrder - b.sortOrder;
      });
    } else if (gridStrategy === 'NEWEST_FIRST') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      result.sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return result;
  }, [items, selectedCategory, searchQuery, gridStrategy]);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredItems.length) return;

    const newOrder = [...filteredItems];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    onReorder(newOrder.map((it) => it.id));
  };

  const handleSaveEdit = (updatedItem: PortfolioItem) => {
    onUpdateItem(updatedItem.id, updatedItem);
    setEditingItem(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e8e3d8]">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-mono-num">
            Curated Works
          </span>
          <h1 className="font-editorial text-4xl font-normal text-[#141416] mt-1">
            Portfolio Management
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Organize visual sequence, toggle public visibility, and refine curatorial metadata.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-[#141416] hover:bg-stone-800 rounded shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Work</span>
        </button>
      </div>

      {/* Control Bar: Categories, Search, Grid Strategy & View Mode */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Category Filters (Segmented Buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/60 rounded-lg max-w-full overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Works ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((it) => it.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Layout Toggles */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter title or tags..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#e8e3d8] rounded-md text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-800"
            />
          </div>

          {/* Grid Strategy Dropdown */}
          <select
            value={gridStrategy}
            onChange={(e) => onUpdateGridStrategy(e.target.value as GridStrategy)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#e8e3d8] rounded-md text-stone-700 focus:outline-none focus:border-stone-800 cursor-pointer"
          >
            <option value="FEATURED_FIRST">Sort: Featured First</option>
            <option value="NEWEST_FIRST">Sort: Newest First</option>
            <option value="MANUAL">Sort: Manual Sequence</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-[#e8e3d8] rounded-md overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 cursor-pointer ${
                viewMode === 'grid' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 cursor-pointer ${
                viewMode === 'table' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        filteredItems.length === 0 ? (
          <div className="p-16 text-center bg-white border border-[#e8e3d8] rounded-lg">
            <p className="text-sm text-stone-500">No portfolio works match the selected criteria.</p>
            <button
              onClick={onOpenUpload}
              className="mt-3 text-xs text-stone-900 underline font-medium cursor-pointer"
            >
              Upload media now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const category = categories.find((c) => c.id === item.categoryId);
              return (
                <div
                  key={item.id}
                  className="group bg-white border border-[#e8e3d8] rounded-lg overflow-hidden flex flex-col hover:border-stone-400 transition-all shadow-xs"
                >
                  {/* Thumbnail & Badges */}
                  <div
                    onClick={() => setActiveLightboxItem(item)}
                    className="relative bg-stone-950 overflow-hidden cursor-pointer"
                    style={{ aspectRatio: `${item.aspectRatio || 1.33}` }}
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      loading="lazy"
                    />

                    {/* Source label */}
                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono-num px-2 py-0.5 rounded">
                      {item.sourceType === 'INSTAGRAM' ? 'Instagram' : 'Direct Master'}
                    </div>

                    {/* Featured Star toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateItem(item.id, { isFeatured: !item.isFeatured });
                      }}
                      className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors cursor-pointer ${
                        item.isFeatured
                          ? 'bg-amber-500 text-stone-950 shadow-sm'
                          : 'bg-stone-900/60 text-white/80 hover:text-white'
                      }`}
                      title={item.isFeatured ? 'Featured in Hero Spotlight' : 'Click to feature in hero'}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.isFeatured ? 'fill-stone-950' : ''}`} />
                    </button>

                    {/* Click for lightbox prompt */}
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs bg-stone-900/80 px-2.5 py-1 rounded backdrop-blur-xs">
                        Inspect Media
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span className="uppercase tracking-wider font-mono-num">
                          {category?.name || 'Uncategorized'}
                        </span>
                        {item.aiConfidence && (
                          <span className="font-mono-num">
                            {Math.round(item.aiConfidence * 100)}% match
                          </span>
                        )}
                      </div>

                      <h3 className="font-editorial text-lg text-stone-900 mt-1 line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Tag list */}
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-stone-500 font-mono-num bg-stone-100 px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      {/* Publish State */}
                      <button
                        onClick={() => onUpdateItem(item.id, { isPublished: !item.isPublished })}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
                          item.isPublished
                            ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-stone-500 bg-stone-100 hover:bg-stone-200'
                        }`}
                        title="Toggle public visibility"
                      >
                        {item.isPublished ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-stone-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        {/* Move Up / Down */}
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-30 cursor-pointer"
                          title="Move earlier in grid sequence"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === filteredItems.length - 1}
                          className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-30 cursor-pointer"
                          title="Move later in grid sequence"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit metadata */}
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-stone-400 hover:text-stone-800 cursor-pointer ml-1"
                          title="Edit Curatorial Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${item.title}" from portfolio?`)) {
                              onDeleteItem(item.id);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                          title="Delete work"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Table / List View */
        <div className="bg-white border border-[#e8e3d8] rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e8e3d8] bg-stone-50 text-stone-500 font-mono-num uppercase tracking-wider">
                <th className="py-3 px-4 w-14">Order</th>
                <th className="py-3 px-4 w-16">Preview</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map((item, index) => {
                const category = categories.find((c) => c.id === item.categoryId);
                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono-num text-stone-400">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded bg-stone-900 cursor-pointer"
                        onClick={() => setActiveLightboxItem(item)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-editorial text-base text-stone-900 font-medium">
                        {item.title}
                      </div>
                      <div className="text-stone-500 truncate max-w-md mt-0.5">
                        {item.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-mono-num">
                      {category?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onUpdateItem(item.id, { isPublished: !item.isPublished })}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                          item.isPublished
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {item.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onUpdateItem(item.id, { isFeatured: !item.isFeatured })}
                          className={`p-1 cursor-pointer ${
                            item.isFeatured ? 'text-amber-500' : 'text-stone-300 hover:text-stone-500'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${item.isFeatured ? 'fill-amber-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-stone-400 hover:text-stone-800 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item.title}"?`)) onDeleteItem(item.id);
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          categories={categories}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Fullscreen Lightbox / Media Viewer */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div
            className="max-w-4xl w-full bg-[#141416] border border-stone-800 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[65vh] bg-stone-950 flex items-center justify-center">
              {activeLightboxItem.mediaType === 'video' && activeLightboxItem.mediaUrl.endsWith('.mp4') ? (
                <video src={activeLightboxItem.mediaUrl} controls autoPlay className="max-h-[65vh] w-auto" />
              ) : (
                <img
                  src={activeLightboxItem.mediaUrl}
                  alt={activeLightboxItem.title}
                  className="max-h-[65vh] w-auto object-contain"
                />
              )}
              <button
                onClick={() => setActiveLightboxItem(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 text-white hover:bg-black rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-stone-200 space-y-2">
              <div className="text-xs uppercase font-mono-num text-stone-400">
                {categories.find((c) => c.id === activeLightboxItem.categoryId)?.name || 'Editorial'}
              </div>
              <h2 className="font-editorial text-2xl text-white">
                {activeLightboxItem.title}
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed">
                {activeLightboxItem.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeLightboxItem.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono-num text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
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

// Sub-component: Edit Modal
interface EditItemModalProps {
  item: PortfolioItem;
  categories: Category[];
  onClose: () => void;
  onSave: (item: PortfolioItem) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ item, categories, onClose, onSave }) => {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [categoryId, setCategoryId] = useState(item.categoryId);
  const [tags, setTags] = useState<string[]>(item.tags);
  const [tagInput, setTagInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(item.isFeatured);
  const [isPublished, setIsPublished] = useState(item.isPublished);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(clean)) setTags([...tags, clean]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#fbf9f5] border border-[#e8e3d8] rounded-xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[#e8e3d8] flex items-center justify-between">
          <h2 className="font-editorial text-2xl text-stone-900">Edit Portfolio Work</h2>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">
              Curatorial Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-800 leading-relaxed focus:outline-none focus:border-stone-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-800 focus:outline-none focus:border-stone-800"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end space-y-2">
              <label className="flex items-center gap-2 text-xs text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-stone-900"
                />
                <span>Hero Featured Spotlight</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-stone-900"
                />
                <span>Publish to Public Grid</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">Tags</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-stone-100 border border-stone-200 text-stone-700 px-2 py-0.5 rounded flex items-center gap-1"
                >
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag..."
                className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:border-stone-800"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-stone-200 text-stone-800 rounded text-xs font-medium cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-stone-100 border-t border-[#e8e3d8] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({
                ...item,
                title,
                description,
                categoryId,
                tags,
                isFeatured,
                isPublished,
              });
            }}
            className="px-5 py-2 text-xs font-medium text-white bg-[#141416] hover:bg-stone-800 rounded cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
