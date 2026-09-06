'use client';
import { useState, useRef, useCallback, useEffect, type FormEvent, type ChangeEvent } from 'react';
import {
  Upload,
  Link2,
  Film,
  X,
  Check,
  AlertTriangle,
  ImagePlus,
  Globe,
  Lock,
  Eye,
  Subtitles,
  ShieldCheck,
  Play,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { Field, Input, Textarea, Select, Toggle, Pill } from '../admin-ui';

export type MediaUploadValues = {
  id: string;
  title: string;
  description: string;
  sourceType: 'file' | 'youtube';
  file: File | null;
  filePreviewUrl: string | null;
  youtubeUrl: string;
  youtubeId: string | null;
  thumbnailFile: File | null;
  thumbnailPreviewUrl: string | null;
  category: string;
  tags: string[];
  visibility: 'public' | 'private' | 'unlisted';
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt: string;
  language: 'en' | 'bn';
  captionsFile: File | null;
  captionsFileName: string | null;
  accessibilityNote: string;
  uploadProgress: number;
  isUploading: boolean;
};

const empty = (): MediaUploadValues => ({
  id: `MEDIA-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  title: '',
  description: '',
  sourceType: 'file',
  file: null,
  filePreviewUrl: null,
  youtubeUrl: '',
  youtubeId: null,
  thumbnailFile: null,
  thumbnailPreviewUrl: null,
  category: '',
  tags: [],
  visibility: 'public',
  status: 'draft',
  scheduledAt: '',
  language: 'en',
  captionsFile: null,
  captionsFileName: null,
  accessibilityNote: '',
  uploadProgress: 0,
  isUploading: false,
});

const CATEGORIES = [
  'Patient education',
  'Procedure showcase',
  'Testimonial',
  'Clinic tour',
  'Webinar',
  'Live consultation',
  'FAQ',
  'Promotional',
];

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const MAX_FILE_SIZE_MB = 500;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const YOUTUBE_URL_PATTERN = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S+)?$/;

function extractYouTubeId(url: string): string | null {
  const match = url.match(YOUTUBE_URL_PATTERN);
  return match ? match[4] : null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function MediaUploadForm({ onSaved }: { onSaved?: (v: MediaUploadValues) => void }) {
  const [values, setValues] = useState<MediaUploadValues>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof MediaUploadValues, string>>>({});
  const [tagInput, setTagInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [thumbDragOver, setThumbDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const captionsInputRef = useRef<HTMLInputElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const update = useCallback(<K extends keyof MediaUploadValues>(key: K, val: MediaUploadValues[K]) => {
    setValues(prev => ({ ...prev, [key]: val }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validate = useCallback(() => {
    const errs: Partial<Record<keyof MediaUploadValues, string>> = {};
    if (!values.title.trim()) errs.title = 'Title is required';
    else if (values.title.length > 100) errs.title = 'Title must be under 100 characters';
    if (!values.description.trim()) errs.description = 'Description is required';
    else if (values.description.length > 500) errs.description = 'Description must be under 500 characters';

    if (values.sourceType === 'file') {
      if (!values.file) errs.file = 'Please select a video file';
      else if (!ALLOWED_VIDEO_TYPES.includes(values.file.type)) errs.file = 'Unsupported video format';
      else if (values.file.size > MAX_FILE_SIZE_BYTES) errs.file = `File must be under ${MAX_FILE_SIZE_MB}MB`;
    } else {
      if (!values.youtubeUrl.trim()) errs.youtubeUrl = 'YouTube URL is required';
      else if (!extractYouTubeId(values.youtubeUrl)) errs.youtubeUrl = 'Please enter a valid YouTube URL';
    }

    if (values.status === 'scheduled' && !values.scheduledAt) {
      errs.scheduledAt = 'Schedule date is required when status is Scheduled';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [values]);

  const simulateUpload = useCallback(() => {
    setValues(prev => ({ ...prev, isUploading: true, uploadProgress: 0 }));
    let progress = 0;
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      progress += Math.random() * 18 + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval.current!);
        progressInterval.current = null;
        setValues(prev => ({ ...prev, uploadProgress: 100, isUploading: false }));
      } else {
        setValues(prev => ({ ...prev, uploadProgress: Math.min(progress, 99) }));
      }
    }, 280);
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        setErrors(prev => ({ ...prev, file: 'Unsupported video format' }));
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrors(prev => ({ ...prev, file: `File must be under ${MAX_FILE_SIZE_MB}MB` }));
        return;
      }
      const url = URL.createObjectURL(file);
      setValues(prev => ({ ...prev, file, filePreviewUrl: url }));
      simulateUpload();
    },
    [simulateUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleThumbDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setThumbDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setValues(prev => ({ ...prev, thumbnailFile: file, thumbnailPreviewUrl: url }));
      }
    },
    []
  );

  const handleYoutubeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      update('youtubeUrl', url);
      const id = extractYouTubeId(url);
      update('youtubeId', id);
      if (id && !values.thumbnailPreviewUrl) {
        update(
          'thumbnailPreviewUrl',
          `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
        );
      }
    },
    [update, values.thumbnailPreviewUrl]
  );

  const addTag = useCallback(() => {
    const t = tagInput.trim().toLowerCase();
    if (!t || values.tags.includes(t)) return;
    update('tags', [...values.tags, t]);
    setTagInput('');
  }, [tagInput, values.tags, update]);

  const removeTag = useCallback(
    (tag: string) => {
      update('tags', values.tags.filter(x => x !== tag));
    },
    [values.tags, update]
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (!validate()) return;
      onSaved?.({ ...values, uploadProgress: 100, isUploading: false });
    },
    [validate, values, onSaved]
  );

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (values.filePreviewUrl) URL.revokeObjectURL(values.filePreviewUrl);
      if (values.thumbnailPreviewUrl && !values.thumbnailPreviewUrl.startsWith('http')) {
        URL.revokeObjectURL(values.thumbnailPreviewUrl);
      }
    };
  }, [values.filePreviewUrl, values.thumbnailPreviewUrl]);

  const inputBase =
    'adm-input w-full rounded-xl border border-[var(--border)] bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15';
  const errorBase = 'border-red-400 focus:border-red-500 focus:ring-red-500/15';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <span className="pro-kicker">MEDIA LIBRARY</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Upload Media
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Add a new video to the clinic media library. Choose a direct file upload or a YouTube link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-[var(--border)] bg-white/80 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-8"
          noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title" required hint={`${values.title.length}/100`}>
              <Input
                value={values.title}
                onChange={e => update('title', e.target.value)}
                placeholder="e.g., PRP Therapy walkthrough"
                className={errors.title ? errorBase : inputBase}
                maxLength={120}
              />
              {submitted && errors.title && (
                <span className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle size={12} /> {errors.title}
                </span>
              )}
            </Field>
            <Field label="Category">
              <Select
                value={values.category}
                onChange={e => update('category', e.target.value)}
                className={inputBase}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Short description" required hint={`${values.description.length}/500`}>
            <Textarea
              value={values.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Brief summary shown on cards and search results."
              className={errors.description ? errorBase : `${inputBase} min-h-[88px] resize-y`}
              maxLength={600}
            />
            {submitted && errors.description && (
              <span className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertTriangle size={12} /> {errors.description}
              </span>
            )}
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Visibility">
              <div className="flex items-center gap-2">
                {[
                  { value: 'public', label: 'Public', icon: Globe },
                  { value: 'unlisted', label: 'Unlisted', icon: Eye },
                  { value: 'private', label: 'Private', icon: Lock },
                ].map(opt => {
                  const Icon = opt.icon;
                  const active = values.visibility === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('visibility', opt.value as MediaUploadValues['visibility'])}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        active
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                          : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]/40'
                      }`}>
                      <Icon size={14} /> {opt.label}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Status">
              <Select
                value={values.status}
                onChange={e =>
                  update('status', e.target.value as MediaUploadValues['status'])
                }
                className={inputBase}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </Select>
            </Field>
          </div>

          {values.status === 'scheduled' && (
            <Field label="Schedule publish date" required hint="ISO datetime">
              <Input
                type="datetime-local"
                value={values.scheduledAt}
                onChange={e => update('scheduledAt', e.target.value)}
                className={errors.scheduledAt ? errorBase : inputBase}
              />
              {submitted && errors.scheduledAt && (
                <span className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle size={12} /> {errors.scheduledAt}
                </span>
              )}
            </Field>
          )}

          <Field label="Video source">
            <div className="adm-segmented mb-4">
              <button
                type="button"
                className={values.sourceType === 'file' ? 'on' : ''}
                onClick={() => update('sourceType', 'file')}>
                <Upload size={14} /> File
              </button>
              <button
                type="button"
                className={values.sourceType === 'youtube' ? 'on' : ''}
                onClick={() => update('sourceType', 'youtube')}>
                <Link2 size={14} /> YouTube
              </button>
            </div>

            {values.sourceType === 'file' ? (
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
                  dragOver
                    ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                    : 'border-[var(--border)] hover:border-[var(--accent)]/60'
                }`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                />
                <Film className="mx-auto mb-3 text-[var(--muted-foreground)]" size={32} />
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Drag & drop a video here, or click to browse
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  MP4, WebM, OGG or QuickTime — up to {MAX_FILE_SIZE_MB}MB
                </p>
                {submitted && errors.file && (
                  <span className="mt-2 flex items-center justify-center gap-1 text-xs text-red-600">
                    <AlertTriangle size={12} /> {errors.file}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <Input
                  value={values.youtubeUrl}
                  onChange={handleYoutubeChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={errors.youtubeUrl ? errorBase : inputBase}
                />
                {submitted && errors.youtubeUrl && (
                  <span className="mt-1 flex items-center gap-1 text-xs text-red-600">
                    <AlertTriangle size={12} /> {errors.youtubeUrl}
                  </span>
                )}
                {values.youtubeId && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border)]">
                    <div
                      className="relative aspect-video w-full bg-black/5"
                      style={{
                        backgroundImage: `url(https://img.youtube.com/vi/${values.youtubeId}/hqdefault.jpg)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold shadow-lg">
                          <Play size={16} /> YouTube preview
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Field>

          {(values.filePreviewUrl || values.thumbnailPreviewUrl) && (
            <div className="grid gap-5 sm:grid-cols-2">
              {values.filePreviewUrl && (
                <div className="rounded-2xl border border-[var(--border)] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                      <Play size={14} /> Video preview
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (values.filePreviewUrl) URL.revokeObjectURL(values.filePreviewUrl);
                        setValues(prev => ({ ...prev, file: null, filePreviewUrl: null }));
                      }}
                      className="rounded-full p-1 text-[var(--muted-foreground)] hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <video
                    controls
                    className="h-44 w-full rounded-xl bg-black/5"
                    src={values.filePreviewUrl}
                  />
                  {values.isUploading && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                        <div
                          className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                          style={{ width: `${Math.round(values.uploadProgress)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-right text-[10px] text-[var(--muted-foreground)]">
                        {Math.round(values.uploadProgress)}%
                      </p>
                    </div>
                  )}
                  {!values.isUploading && values.uploadProgress === 100 && (
                    <Pill tone="teal">
                      <Check size={12} /> Ready
                    </Pill>
                  )}
                </div>
              )}

              <div className="rounded-2xl border border-[var(--border)] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                    <ImagePlus size={14} /> Thumbnail
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (values.thumbnailPreviewUrl && !values.thumbnailPreviewUrl.startsWith('http')) {
                        URL.revokeObjectURL(values.thumbnailPreviewUrl);
                      }
                      setValues(prev => ({ ...prev, thumbnailFile: null, thumbnailPreviewUrl: null }));
                    }}
                    className="rounded-full p-1 text-[var(--muted-foreground)] hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setThumbDragOver(true);
                  }}
                  onDragLeave={() => setThumbDragOver(false)}
                  onDrop={handleThumbDrop}
                  onClick={() => thumbInputRef.current?.click()}
                  className={`relative flex h-44 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition ${
                    thumbDragOver
                      ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                      : 'border-[var(--border)]'
                  }`}>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const url = URL.createObjectURL(f);
                        setValues(prev => ({ ...prev, thumbnailFile: f, thumbnailPreviewUrl: url }));
                      }
                    }}
                  />
                  {values.thumbnailPreviewUrl ? (
                    <img
                      src={values.thumbnailPreviewUrl}
                      alt="Thumbnail preview"
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="mx-auto mb-1 text-[var(--muted-foreground)]" size={22} />
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Drop an image or click
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Tags" hint="Press Enter to add">
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-white/90 px-3 py-2 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/15">
                {values.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-lg bg-[var(--secondary)] px-2 py-1 text-xs font-semibold">
                    <GripVertical size={12} className="text-[var(--muted-foreground)]" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-[var(--muted-foreground)] hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag"
                  className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </Field>
            <Field label="Language">
              <Select
                value={values.language}
                onChange={e => update('language', e.target.value as 'en' | 'bn')}
                className={inputBase}>
                <option value="en">English</option>
                <option value="bn">Bengali</option>
              </Select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Captions / Subtitles (VTT or SRT)">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => captionsInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)]/60">
                  <Subtitles size={14} />
                  {values.captionsFileName || 'Choose file'}
                </button>
                <input
                  ref={captionsInputRef}
                  type="file"
                  accept=".vtt,.srt"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setValues(prev => ({ ...prev, captionsFile: f, captionsFileName: f.name }));
                    }
                  }}
                />
                {values.captionsFile && (
                  <Pill tone="teal">
                    <Check size={12} /> {values.captionsFileName}
                  </Pill>
                )}
              </div>
            </Field>
            <Field label="Accessibility note" hint="For screen readers">
              <Input
                value={values.accessibilityNote}
                onChange={e => update('accessibilityNote', e.target.value)}
                placeholder="Describe key visual or audio cues"
                className={inputBase}
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-[var(--border)] pt-5 sm:flex-row">
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <ShieldCheck size={14} className="text-[var(--accent)]" />
              Data is validated client-side before submission.
            </div>
            <div className="flex w-full gap-3 sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setValues(empty);
                  setErrors({});
                  setSubmitted(false);
                }}
                className="flex-1 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--muted-foreground)] transition hover:bg-black/5 sm:flex-none">
                Reset
              </button>
              <button
                type="submit"
                disabled={values.isUploading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--accent)]/20 transition hover:brightness-110 disabled:opacity-60 sm:flex-none">
                {values.isUploading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Upload size={16} /> Save media
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-white/60 p-4 text-xs text-[var(--muted-foreground)]">
          <strong className="block text-[var(--foreground)]">Submission contract (database)</strong>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Unique ID, timestamps, and author are attached server-side.</li>
            <li>Video metadata (duration, codec, resolution) is extracted on upload.</li>
            <li>YouTube links are verified for embeddability and availability.</li>
            <li>Thumbnails are generated if not provided.</li>
            <li>Invalid or oversized payloads are rejected before persistence.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
