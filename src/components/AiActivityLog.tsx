import React, { useState } from 'react';
import { ImportJob, Category } from '../types';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileCode,
  X,
  Instagram,
  UploadCloud,
  Layers,
} from 'lucide-react';

interface AiActivityLogProps {
  jobs: ImportJob[];
  categories: Category[];
  onOpenReviewJob: (job: ImportJob) => void;
}

export const AiActivityLog: React.FC<AiActivityLogProps> = ({
  jobs,
  categories,
  onOpenReviewJob,
}) => {
  const [activeJsonJob, setActiveJsonJob] = useState<ImportJob | null>(null);

  const totalJobs = jobs.length;
  const publishedJobs = jobs.filter((j) => j.status === 'PUBLISHED').length;
  const pendingReviewJobs = jobs.filter((j) => j.status === 'REQUIRES_REVIEW').length;
  const avgConfidence =
    jobs.reduce((acc, j) => acc + (j.suggestedMetadata?.confidence || 0.94), 0) /
    (totalJobs || 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#e8e3d8]">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-mono-num">
          Execution Auditing
        </span>
        <h1 className="font-editorial text-4xl font-normal text-[#141416] mt-1">
          AI Activity & Pipeline Logs
        </h1>
        <p className="text-stone-600 text-sm mt-1 max-w-xl">
          Complete audit trail of autonomous video frame extractions, visual theme classifications, and metadata synthesis.
        </p>
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#e8e3d8] rounded-lg">
          <div className="text-xs text-stone-500 font-medium">Total Ingestions</div>
          <div className="mt-1 text-2xl font-light font-editorial text-stone-900 font-mono-num">
            {totalJobs}
          </div>
        </div>

        <div className="p-4 bg-white border border-[#e8e3d8] rounded-lg">
          <div className="text-xs text-stone-500 font-medium">Directly Published</div>
          <div className="mt-1 text-2xl font-light font-editorial text-stone-900 font-mono-num">
            {publishedJobs}
          </div>
        </div>

        <div className="p-4 bg-white border border-[#e8e3d8] rounded-lg">
          <div className="text-xs text-stone-500 font-medium">Pending Review</div>
          <div className="mt-1 text-2xl font-light font-editorial text-stone-900 font-mono-num">
            {pendingReviewJobs}
          </div>
        </div>

        <div className="p-4 bg-white border border-[#e8e3d8] rounded-lg">
          <div className="text-xs text-stone-500 font-medium">Mean AI Confidence</div>
          <div className="mt-1 text-2xl font-light font-editorial text-stone-900 font-mono-num">
            {Math.round(avgConfidence * 100)}%
          </div>
        </div>
      </div>

      {/* Job list */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-stone-900">Job History</div>

        <div className="bg-white border border-[#e8e3d8] rounded-lg divide-y divide-stone-100 overflow-hidden">
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500">
              No recorded AI activity jobs yet.
            </div>
          ) : (
            jobs.map((job) => {
              const meta = job.suggestedMetadata;
              const cat = categories.find((c) => c.slug === meta?.recommendedCategorySlug);

              return (
                <div key={job.id} className="p-5 hover:bg-stone-50/70 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Thumbnail & Source */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-16 h-16 rounded overflow-hidden bg-stone-900 shrink-0">
                        {job.previewThumbnail ? (
                          <img
                            src={job.previewThumbnail}
                            alt="Frame"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-600">
                            <Layers className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] font-mono-num text-stone-500">
                          {job.sourceType === 'INSTAGRAM' ? (
                            <span className="flex items-center gap-1 text-rose-700">
                              <Instagram className="w-3 h-3" /> Reel Import
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-stone-700">
                              <UploadCloud className="w-3 h-3" /> Direct Master
                            </span>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>{new Date(job.createdAt).toLocaleString()}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-400">ID: #{job.id.slice(-6)}</span>
                        </div>

                        <h3 className="font-editorial text-lg text-stone-900 mt-0.5 truncate">
                          {meta?.title || job.sourcePayload}
                        </h3>

                        {meta && (
                          <div className="text-xs text-stone-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>
                              Classified as: <strong>{cat?.name || meta.recommendedCategorySlug}</strong>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>Confidence: {Math.round(meta.confidence * 100)}%</span>
                            {meta.lightingMood && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-stone-500">Light: {meta.lightingMood}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <span
                        className={`text-xs px-2.5 py-1 rounded font-medium ${
                          job.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : job.status === 'REQUIRES_REVIEW'
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {job.status === 'PUBLISHED'
                          ? 'Live on Site'
                          : job.status === 'REQUIRES_REVIEW'
                          ? 'Requires Review'
                          : job.status}
                      </span>

                      {job.status === 'REQUIRES_REVIEW' && (
                        <button
                          onClick={() => onOpenReviewJob(job)}
                          className="px-3 py-1 text-xs font-medium bg-stone-900 text-white rounded hover:bg-stone-800 cursor-pointer"
                        >
                          Review Now
                        </button>
                      )}

                      <button
                        onClick={() => setActiveJsonJob(job)}
                        className="p-1.5 text-stone-400 hover:text-stone-800 rounded cursor-pointer"
                        title="View Raw AI Audit JSON"
                      >
                        <FileCode className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Raw JSON Audit Modal */}
      {activeJsonJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#141416] border border-stone-800 text-stone-200 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-mono-num font-medium text-white">
                  Job Audit Manifest: {activeJsonJob.id}
                </h3>
              </div>
              <button
                onClick={() => setActiveJsonJob(null)}
                className="p-1 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 bg-black/60 rounded text-xs font-mono-num overflow-x-auto max-h-96 text-emerald-400 leading-relaxed border border-stone-900">
              {JSON.stringify(activeJsonJob, null, 2)}
            </pre>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveJsonJob(null)}
                className="px-4 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-white rounded cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
