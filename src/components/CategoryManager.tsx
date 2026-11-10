import React, { useState } from 'react';
import { Category, PortfolioItem } from '../types';
import { Plus, Edit2, Trash2, Tag, Layers, Check, X, AlertCircle } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  portfolioItems: PortfolioItem[];
  onCreateCategory: (cat: Omit<Category, 'id' | 'createdAt'>) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => boolean;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  portfolioItems,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [colorHex, setColorHex] = useState('#141416');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setName('');
    setSlug('');
    setDescription('');
    setColorHex('#141416');
    setErrorMessage(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setColorHex(cat.colorHex || '#141416');
    setErrorMessage(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMessage('Category name is required.');
      return;
    }

    const cleanSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (isCreating) {
      // Check duplicate slug
      if (categories.some((c) => c.slug === cleanSlug)) {
        setErrorMessage('A category with this slug already exists.');
        return;
      }

      onCreateCategory({
        name: name.trim(),
        slug: cleanSlug,
        description: description.trim(),
        colorHex,
      });
      setIsCreating(false);
    } else if (editingCategory) {
      onUpdateCategory(editingCategory.id, {
        name: name.trim(),
        slug: cleanSlug,
        description: description.trim(),
        colorHex,
      });
      setEditingCategory(null);
    }
  };

  const handleDelete = (cat: Category) => {
    const assignedCount = portfolioItems.filter((i) => i.categoryId === cat.id).length;
    if (assignedCount > 0) {
      alert(
        `Cannot delete "${cat.name}". It currently has ${assignedCount} assigned portfolio work(s). Reassign them first.`
      );
      return;
    }

    if (confirm(`Are you sure you want to delete empty category "${cat.name}"?`)) {
      onDeleteCategory(cat.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#e8e3d8]">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-mono-num">
            Studio Taxonomies
          </span>
          <h1 className="font-editorial text-4xl font-normal text-[#141416] mt-1">
            Category Management
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-xl leading-relaxed">
            AI restricts visual classification strictly to your defined taxonomies. When creative work is ingested, it evaluates matching confidence against these categories.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-[#141416] hover:bg-stone-800 rounded shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const assignedItems = portfolioItems.filter((i) => i.categoryId === cat.id);
          const count = assignedItems.length;

          return (
            <div
              key={cat.id}
              className="bg-white border border-[#e8e3d8] rounded-lg p-6 flex flex-col justify-between hover:border-stone-400 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                      style={{ backgroundColor: cat.colorHex || '#141416' }}
                    />
                    <h3 className="font-editorial text-2xl text-stone-900 font-normal">
                      {cat.name}
                    </h3>
                  </div>

                  <span className="text-xs font-mono-num text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {count} item{count === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="mt-2 text-xs font-mono-num text-stone-500">
                  Slug: <span className="text-stone-700">/{cat.slug}</span>
                </div>

                <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>

                {/* Previews of assigned works */}
                {assignedItems.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 overflow-x-auto">
                    {assignedItems.slice(0, 4).map((it) => (
                      <img
                        key={it.id}
                        src={it.thumbnailUrl}
                        alt={it.title}
                        title={it.title}
                        className="w-10 h-10 object-cover rounded bg-stone-900 shrink-0"
                      />
                    ))}
                    {assignedItems.length > 4 && (
                      <span className="text-[11px] font-mono-num text-stone-400 pl-1">
                        +{assignedItems.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-mono-num">
                  AI Taxonomy Anchor
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded cursor-pointer"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    disabled={count > 0}
                    className="p-1.5 text-stone-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-stone-400 cursor-pointer"
                    title={count > 0 ? 'Cannot delete non-empty category' : 'Delete empty category'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Category Modal */}
      {(isCreating || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#fbf9f5] border border-[#e8e3d8] rounded-xl max-w-md w-full shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e3d8]">
              <h2 className="font-editorial text-2xl text-stone-900">
                {isCreating ? 'Create Category' : 'Edit Category'}
              </h2>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingCategory(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Architectural Spatial Studies"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">
                  Slug (URL key for AI matching)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. architectural-studies"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm text-stone-900 font-mono-num focus:outline-none focus:border-stone-800"
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
                  placeholder="Describe aesthetic focus so AI understands when to assign creative work..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-800 leading-relaxed focus:outline-none focus:border-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-num uppercase text-stone-600 mb-1">
                  Accent Color Indicator
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-28 px-2.5 py-1.5 bg-white border border-stone-300 rounded text-xs font-mono-num uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e8e3d8] flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingCategory(null);
                }}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-xs font-medium text-white bg-[#141416] hover:bg-stone-800 rounded cursor-pointer"
              >
                {isCreating ? 'Create Category' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
