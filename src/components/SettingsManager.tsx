import React, { useState } from 'react';
import { WebsiteSettings, GridStrategy } from '../types';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Layers,
  Image as ImageIcon,
  Save,
} from 'lucide-react';

interface SettingsManagerProps {
  settings: WebsiteSettings;
  onUpdateSettings: (newSettings: WebsiteSettings) => void;
  onResetDefaults: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
}) => {
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>({ ...settings });
  const [savedAlert, setSavedAlert] = useState(false);

  const handleToggle = (key: keyof WebsiteSettings) => {
    const updated = {
      ...localSettings,
      [key]: !localSettings[key],
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    flashSaved();
  };

  const handleStrategyChange = (strategy: GridStrategy) => {
    const updated = {
      ...localSettings,
      gridStrategy: strategy,
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    flashSaved();
  };

  const flashSaved = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-[#e8e3d8] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-mono-num">
            System Preferences
          </span>
          <h1 className="font-editorial text-4xl font-normal text-[#141416] mt-1">
            Studio Engine Settings
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Configure autonomous ingestion thresholds, publishing governance, and media pipeline compression.
          </p>
        </div>

        {savedAlert && (
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded flex items-center gap-1.5 self-start">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Saved to local state</span>
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Section 1: Autonomous Ingestion & AI Pipeline */}
        <div className="bg-white border border-[#e8e3d8] rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <Sparkles className="w-4 h-4 text-stone-800" />
            <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wide">
              Autonomous Ingestion & AI Intelligence
            </h2>
          </div>

          <div className="divide-y divide-stone-100">
            {/* Autopilot toggle */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-stone-900">Autopilot Background Pipeline</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Automatically extracts frames, calculates aspect ratio, and runs Gemini 3.8 Flash visual analysis upon upload.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={localSettings.autopilotEnabled}
                  onChange={() => handleToggle('autopilotEnabled')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900" />
              </label>
            </div>

            {/* AI Metadata toggle */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-stone-900">AI Metadata Generation</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Synthesizes curatorial titles, artistic statements, and aesthetic tags.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={localSettings.aiMetadataEnabled}
                  onChange={() => handleToggle('aiMetadataEnabled')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900" />
              </label>
            </div>

            {/* Automatic Categorization */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-stone-900">Automatic Taxonomy Matching</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Restricts classification strictly to user-defined categories in your studio taxonomy.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={localSettings.autoCategorizationEnabled}
                  onChange={() => handleToggle('autoCategorizationEnabled')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900" />
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Publishing Governance */}
        <div className="bg-white border border-[#e8e3d8] rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <ShieldCheck className="w-4 h-4 text-stone-800" />
            <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wide">
              Publishing Governance & Review
            </h2>
          </div>

          <div className="divide-y divide-stone-100">
            {/* Auto-publish vs Approval-required */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-stone-900">
                  {localSettings.autoPublishEnabled ? 'Auto-Publish Mode' : 'Approval-Required Mode (Curator-in-the-Loop)'}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {localSettings.autoPublishEnabled
                    ? 'Work is pushed immediately to the live public grid upon AI completion.'
                    : 'Work enters "Requires Review" state for photographer approval before going live.'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={localSettings.autoPublishEnabled}
                  onChange={() => handleToggle('autoPublishEnabled')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900" />
              </label>
            </div>

            {/* Grid Ordering Strategy */}
            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-stone-900">Grid Ordering Strategy</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Governs how the public website sorts and displays items.
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'FEATURED_FIRST' as const, label: 'Featured First' },
                  { id: 'NEWEST_FIRST' as const, label: 'Newest First' },
                  { id: 'MANUAL' as const, label: 'Manual Order' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleStrategyChange(s.id)}
                    className={`px-3 py-1.5 text-xs font-mono-num rounded border cursor-pointer ${
                      localSettings.gridStrategy === s.id
                        ? 'border-stone-900 bg-stone-900 text-white font-medium'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Media Optimization & Archiving */}
        <div className="bg-white border border-[#e8e3d8] rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <ImageIcon className="w-4 h-4 text-stone-800" />
            <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wide">
              Media Optimization & Storage
            </h2>
          </div>

          <div className="divide-y divide-stone-100">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-stone-900">Preserve Master Resolution (4K / Raw)</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Keeps uncompressed source files intact in archival storage.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={localSettings.preserveOriginalResolution}
                  onChange={() => handleToggle('preserveOriginalResolution')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900" />
              </label>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-stone-900">Smart WebP Compression</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Serves optimized responsive WebP frames to mobile visitors for sub-second load times.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={localSettings.smartWebpCompression}
                  onChange={() => handleToggle('smartWebpCompression')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900" />
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Maintenance */}
        <div className="p-6 bg-stone-100/60 border border-stone-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-stone-800">Reset Demo Data</div>
            <div className="text-xs text-stone-500 mt-0.5">
              Restores initial pre-seeded portfolio items, categories, and studio settings.
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm('Reset PortfolioPilot to default studio state?')) {
                onResetDefaults();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
