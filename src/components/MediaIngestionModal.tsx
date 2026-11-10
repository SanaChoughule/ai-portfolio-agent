import React, { useState } from 'react';
import { Category } from '../types';
import {
  UploadCloud,
  Instagram,
  FileVideo,
  X,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Play,
  Film,
} from 'lucide-react';

interface MediaIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onStartProcessing: (ingestData: {
    sourceType: 'DIRECT_UPLOAD' | 'INSTAGRAM';
    payload: string;
    filePreviewUrl?: string;
    mediaType: 'photo' | 'video';
    sourceTitle?: string;
    keyframeBase64?: string;
  }) => void;
}

export const MediaIngestionModal: React.FC<MediaIngestionModalProps> = ({
  isOpen,
  onClose,
  categories,
  onStartProcessing,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'instagram'>('upload');

  // Direct upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileMediaType, setFileMediaType] = useState<'photo' | 'video'>('photo');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Instagram Reel state
  const [reelUrl, setReelUrl] = useState<string>('');
  const [reelValidationMsg, setReelValidationMsg] = useState<{
    valid: boolean;
    text: string;
  } | null>(null);
  const [isValidatingReel, setIsValidatingReel] = useState<boolean>(false);

  // Creative test presets for 1-click demonstration
  const PRESET_SAMPLES = [
    {
      title: 'Monolith Runway AW26 Lookbook (4K)',
      type: 'photo' as const,
      preview: '/src/assets/images/fashion_monochrome_editorial_1794341700592.jpg',
      categoryHint: 'Fashion & Editorial',
      description: 'Sculptural black wool coats against brutalist concrete backdrop.',
    },
    {
      title: 'Cooke Anamorphic Sunset Sequence (Alexa 35)',
      type: 'photo' as const,
      preview: '/src/assets/images/cinema_director_lens_1794341700201.jpg',
      categoryHint: 'Cinematography & Film',
      description: 'Anamorphic lens flare and dusk haze over monolithic architecture.',
    },
    {
      title: 'Desert Brutalist Sanctuary Monograph',
      type: 'photo' as const,
      preview: '/src/assets/images/architecture_desert_pavilion_1794341700670.jpg',
      categoryHint: 'Brutalist Architecture',
      description: 'Cast concrete spatial pavilions under Mojave golden light.',
    },
    {
      title: 'Tokyo Rain Reflection Street Series',
      type: 'photo' as const,
      preview: '/src/assets/images/documentary_tokyo_night_1794341700879.jpg',
      categoryHint: 'Documentary & Street',
      description: 'Candid nocturnal street silhouettes in Shinjuku rain.',
    },
  ];

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    // Validate format
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert('Please upload an image (JPG, PNG, WebP) or video (MP4, MOV).');
      return;
    }

    // Size limit 100MB
    if (file.size > 100 * 1024 * 1024) {
      alert('File size exceeds 100MB limit.');
      return;
    }

    setSelectedFile(file);
    setFileMediaType(isVideo ? 'video' : 'photo');
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleValidateReel = async (urlToTest: string) => {
    setReelUrl(urlToTest);
    if (!urlToTest.trim()) {
      setReelValidationMsg(null);
      return;
    }

    setIsValidatingReel(true);
    try {
      const res = await fetch('/api/v1/imports/validate-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToTest }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setReelValidationMsg({
          valid: true,
          text: `Verified Instagram Reel: ${data.canonicalUrl}. Note: If platform DRM restricts automated master stream download, you will be prompted for original file.`,
        });
      } else {
        setReelValidationMsg({
          valid: false,
          text: data.message || 'Invalid Instagram URL format. Expected: https://www.instagram.com/reel/CODE/',
        });
      }
    } catch {
      // Local fallback validation
      const match = urlToTest.match(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/);
      if (match) {
        setReelValidationMsg({
          valid: true,
          text: `Format recognized (${match[1]}). Server-side retrieval will be attempted.`,
        });
      } else {
        setReelValidationMsg({
          valid: false,
          text: 'Please paste a valid Instagram Reel link (e.g., https://www.instagram.com/reel/C3zY91KpoLm/)',
        });
      }
    } finally {
      setIsValidatingReel(false);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'upload') {
      if (!selectedFile && !previewUrl) return;

      setIsSimulatingUpload(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsSimulatingUpload(false);
          onStartProcessing({
            sourceType: 'DIRECT_UPLOAD',
            payload: selectedFile?.name || 'creative_master_file',
            filePreviewUrl: previewUrl || undefined,
            mediaType: fileMediaType,
            sourceTitle: selectedFile?.name?.replace(/\.[^/.]+$/, '') || 'Master Creative Clip',
          });
          onClose();
        }
      }, 150);
    } else {
      if (!reelUrl || !reelValidationMsg?.valid) return;
      onStartProcessing({
        sourceType: 'INSTAGRAM',
        payload: reelUrl,
        filePreviewUrl: '/src/assets/images/cinema_director_lens_1794341700201.jpg',
        mediaType: 'video',
        sourceTitle: 'Instagram Reel Import',
      });
      onClose();
    }
  };

  const handleSelectPreset = (sample: typeof PRESET_SAMPLES[0]) => {
    onStartProcessing({
      sourceType: 'DIRECT_UPLOAD',
      payload: sample.title,
      filePreviewUrl: sample.preview,
      mediaType: sample.type,
      sourceTitle: sample.title,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-[#fbf9f5] border border-[#e8e3d8] rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e8e3d8] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono-num uppercase tracking-widest text-stone-500">
              Media Ingestion
            </div>
            <h2 className="font-editorial text-2xl text-[#141416]">Add New Work</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-4 flex gap-6 border-b border-[#e8e3d8] text-sm">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 font-medium transition-colors cursor-pointer relative ${
              activeTab === 'upload' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Direct Video / Photo Upload
            {activeTab === 'upload' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('instagram')}
            className={`pb-3 font-medium transition-colors cursor-pointer relative ${
              activeTab === 'instagram' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Paste Instagram Reel URL
            {activeTab === 'instagram' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'upload' ? (
            <div className="space-y-5">
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive
                    ? 'border-stone-900 bg-stone-100/80'
                    : 'border-[#d6cfc2] bg-white hover:border-stone-400'
                }`}
              >
                {previewUrl ? (
                  <div className="space-y-3">
                    <div className="max-h-52 w-auto mx-auto rounded overflow-hidden bg-stone-900 inline-block shadow-sm">
                      {fileMediaType === 'video' ? (
                        <video src={previewUrl} controls className="max-h-52 w-auto" />
                      ) : (
                        <img src={previewUrl} alt="Preview" className="max-h-52 w-auto object-contain" />
                      )}
                    </div>
                    <div className="text-xs font-mono-num text-stone-600">
                      {selectedFile?.name} ({(selectedFile?.size ? (selectedFile.size / (1024 * 1024)).toFixed(1) : '1.2')} MB)
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove and choose another
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <UploadCloud className="w-10 h-10 mx-auto text-stone-400 stroke-1" />
                    <div>
                      <span className="text-sm font-medium text-stone-800">
                        Drag and drop master video or photography
                      </span>
                      <p className="text-xs text-stone-500 mt-1">
                        Supports MP4, MOV, ProRes, JPG, PNG up to 100MB
                      </p>
                    </div>

                    <label className="inline-block px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded cursor-pointer transition-colors">
                      Browse Files
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime,image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Progress bar if uploading */}
              {isSimulatingUpload && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-stone-600 font-mono-num">
                    <span>Transferring creative master...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-stone-900 h-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Quick Sample Presets */}
              <div className="pt-2 border-t border-[#e8e3d8]">
                <div className="text-xs font-medium text-stone-700 mb-2.5">
                  Or test with a pre-configured studio master:
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {PRESET_SAMPLES.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(sample)}
                      className="p-2.5 bg-white border border-[#e8e3d8] rounded hover:border-stone-400 text-left transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={sample.preview}
                        alt={sample.title}
                        className="w-10 h-10 object-cover rounded bg-stone-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-stone-900 truncate group-hover:text-stone-950">
                          {sample.title}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono-num truncate">
                          {sample.categoryHint}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Instagram Reel Tab */
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 font-mono-num mb-1.5">
                  Instagram Reel or Post URL
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Instagram className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    value={reelUrl}
                    onChange={(e) => handleValidateReel(e.target.value)}
                    placeholder="https://www.instagram.com/reel/C3zY91KpoLm/"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* Validation Status */}
              {reelValidationMsg && (
                <div
                  className={`p-3 rounded-md text-xs leading-relaxed flex items-start gap-2.5 ${
                    reelValidationMsg.valid
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  {reelValidationMsg.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>{reelValidationMsg.text}</div>
                </div>
              )}

              {/* Instagram Notice */}
              <div className="p-3.5 bg-stone-100 rounded-md text-xs text-stone-600 space-y-1">
                <div className="font-medium text-stone-800">Platform Retrieval Notice</div>
                <p className="leading-relaxed">
                  PortfolioPilot accesses public media stream protocols. If an Instagram creator profile or Reel is restricted, protected by privacy DRM, or rate-limited by Meta servers, please switch to <strong>Direct Video Upload</strong> to provide the master video file.
                </p>
              </div>

              {/* Quick sample Reel buttons */}
              <div>
                <div className="text-xs font-medium text-stone-700 mb-2">Test with sample Reel link:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleValidateReel('https://www.instagram.com/reel/C3zY91KpoLm/')}
                    className="text-xs px-2.5 py-1 bg-white border border-stone-300 hover:border-stone-500 rounded text-stone-700 cursor-pointer"
                  >
                    ARRI 35 Anamorphic Reel
                  </button>
                  <button
                    onClick={() => handleValidateReel('https://www.instagram.com/reel/C8P09xMv3r/')}
                    className="text-xs px-2.5 py-1 bg-white border border-stone-300 hover:border-stone-500 rounded text-stone-700 cursor-pointer"
                  >
                    Tokyo Nocturne Reel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-stone-100/70 border-t border-[#e8e3d8] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              isSimulatingUpload ||
              (activeTab === 'upload' && !selectedFile && !previewUrl) ||
              (activeTab === 'instagram' && (!reelUrl || !reelValidationMsg?.valid))
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-[#141416] hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed rounded shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Ingestion Pipeline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
