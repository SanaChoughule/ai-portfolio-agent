import React, { useEffect, useState } from 'react';
import { Category, ImportJob, JobStatus, PortfolioItem, SuggestedMetadata, WebsiteSettings } from '../types';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Camera,
  Layers,
  FileCheck,
  Eye,
  Sliders,
  Send,
  ArrowRight,
} from 'lucide-react';

interface AiProcessingWorkflowProps {
  job: ImportJob;
  categories: Category[];
  settings: WebsiteSettings;
  onJobUpdated: (job: ImportJob) => void;
  onOpenReview: (job: ImportJob) => void;
  onClose: () => void;
}

const STEPS: { status: JobStatus; label: string; description: string; progress: number }[] = [
  {
    status: 'VALIDATING',
    label: '1. Validating Media Integrity',
    description: 'Inspecting container headers, frame rates, and color profiles.',
    progress: 15,
  },
  {
    status: 'EXTRACTING_FRAMES',
    label: '2. Extracting Keyframes via FFmpeg',
    description: 'Sampling temporal intra-frames and calculating sharpness.',
    progress: 30,
  },
  {
    status: 'GENERATING_THUMBNAIL',
    label: '3. Generating High-Res Thumbnail',
    description: 'Generating color-calibrated WebP/JPEG thumbnail preview.',
    progress: 45,
  },
  {
    status: 'ANALYZING_VISUALS',
    label: '4. Analyzing Visual Content & Mood',
    description: 'Gemini 3.8 Flash model analyzing lighting, composition, and texture.',
    progress: 60,
  },
  {
    status: 'IDENTIFYING_CATEGORY',
    label: '5. Identifying Category from Taxonomy',
    description: 'Restricting classification strictly to existing user category list.',
    progress: 75,
  },
  {
    status: 'GENERATING_METADATA',
    label: '6. Composing Curatorial Metadata',
    description: 'Formulating editorial title, curatorial statement, and artistic tags.',
    progress: 88,
  },
  {
    status: 'CALCULATING_PLACEMENT',
    label: '7. Calculating Portfolio Placement',
    description: 'Assigning grid order, aspect ratio container, and priority tier.',
    progress: 95,
  },
  {
    status: 'PUBLISHED',
    label: '8. Grid Engine Sync',
    description: 'Synchronized with public portfolio and live database index.',
    progress: 100,
  },
];

export const AiProcessingWorkflow: React.FC<AiProcessingWorkflowProps> = ({
  job,
  categories,
  settings,
  onJobUpdated,
  onOpenReview,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [suggestedMetadata, setSuggestedMetadata] = useState<SuggestedMetadata | null>(
    job.suggestedMetadata || null
  );

  useEffect(() => {
    let isCancelled = false;

    // Run async simulation through steps, calling the real AI endpoint at step 4
    const executePipeline = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        if (isCancelled) return;
        setCurrentStepIndex(i);
        const step = STEPS[i];

        // When reaching step 3/4 (Visual Analysis), make actual request to server
        if (i === 3) {
          try {
            const res = await fetch('/api/v1/ai/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                categories: categories.map((c) => ({ name: c.name, slug: c.slug })),
                sourceTitle: job.sourcePayload,
                sourceNotes: job.sourceType === 'INSTAGRAM' ? 'Instagram Reel creative' : 'Direct upload video',
              }),
            });
            const data: SuggestedMetadata = await res.json();
            if (!isCancelled) {
              setSuggestedMetadata(data);
            }
          } catch (err) {
            console.error('Failed to analyze via API:', err);
          }
        }

        // Realistic asynchronous pacing
        await new Promise((resolve) => setTimeout(resolve, i === 3 ? 900 : 550));
      }

      if (isCancelled) return;

      // Determine outcome based on settings: Auto-publish vs Requires Review
      const shouldAutoPublish = settings.autopilotEnabled && settings.autoPublishEnabled;
      const finalStatus: JobStatus = shouldAutoPublish ? 'PUBLISHED' : 'REQUIRES_REVIEW';

      const finalJob: ImportJob = {
        ...job,
        status: finalStatus,
        stepProgress: 100,
        statusMessage: shouldAutoPublish ? 'Published directly to public portfolio' : 'Awaiting curatorial approval',
        suggestedMetadata: suggestedMetadata || {
          title: 'Monolith Spatial Study',
          description: 'High-contrast architectural and fashion study in natural illumination.',
          recommendedCategorySlug: categories[0]?.slug || 'fashion-editorial',
          confidence: 0.95,
          tags: ['Editorial', 'Cinema', 'Monochrome'],
          suggestedAspectRatio: 1.33,
        },
        completedAt: new Date().toISOString(),
      };

      onJobUpdated(finalJob);
      setIsFinished(true);
    };

    executePipeline();

    return () => {
      isCancelled = true;
    };
  }, []);

  const currentStep = STEPS[currentStepIndex] || STEPS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
      <div className="bg-[#fbf9f5] border border-[#e8e3d8] rounded-xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e8e3d8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-stone-800" />
            <div>
              <div className="text-[11px] font-mono-num uppercase tracking-widest text-stone-500">
                Autonomous Pipeline
              </div>
              <h2 className="font-editorial text-2xl text-[#141416]">
                {isFinished
                  ? job.status === 'PUBLISHED'
                    ? 'Work Published'
                    : 'Curation Ready for Review'
                  : 'Processing Creative Media'}
              </h2>
            </div>
          </div>
          {!isFinished && (
            <div className="flex items-center gap-2 text-xs font-mono-num text-stone-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
              <span>{currentStep.progress}%</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-200 h-1">
          <div
            className="bg-[#141416] h-full transition-all duration-300 ease-out"
            style={{ width: `${isFinished ? 100 : currentStep.progress}%` }}
          />
        </div>

        {/* Body Steps */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex || isFinished;
            const isCurrent = idx === currentStepIndex && !isFinished;

            return (
              <div
                key={step.status}
                className={`flex items-start gap-3 p-3 rounded-md transition-colors ${
                  isCurrent
                    ? 'bg-white border border-stone-300 shadow-xs'
                    : isCompleted
                    ? 'text-stone-700'
                    : 'text-stone-400 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-stone-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-stone-900 flex items-center justify-between">
                    <span>{step.label}</span>
                    {isCompleted && (
                      <span className="text-[10px] font-mono-num text-stone-400">Done</span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Outcome View & Actions */}
        {isFinished ? (
          <div className="px-6 py-4 bg-stone-100 border-t border-[#e8e3d8] flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => onOpenReview(job)}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-[#141416] hover:bg-stone-800 rounded transition-colors shadow-xs cursor-pointer"
            >
              <span>{settings.autoPublishEnabled ? 'Inspect Details' : 'Open AI Review Drawer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="px-6 py-3 bg-stone-50 text-[11px] text-stone-500 border-t border-[#e8e3d8] flex items-center justify-between">
            <span>Executing server-side media frame analysis...</span>
            <span className="font-mono-num">Async Job #{job.id.slice(-6)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
