export const TODAY = new Date().toISOString().slice(0, 10);

/**
 * Extracts the 11-character YouTube video ID from a watch or share URL.
 * Supports:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://youtu.be/VIDEO_ID?t=123
 * Returns null when the URL is not a valid YouTube link.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[5] : null;
}

/**
 * Builds a YouTube embed URL for the given source link.
 * Returns null when the URL is not a recognised YouTube address.
 * Pass `autoplay = true` to start playback immediately.
 */
export function youtubeEmbedUrl(url: string, autoplay = false): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
}

/**
 * Builds a YouTube thumbnail URL for the given 11-char video ID.
 * Defaults to hqdefault and falls back to mqdefault when high-res is unavailable.
 */
export function youtubeThumbnail(id: string, quality: 'hq' | 'mq' = 'hq'): string {
  const res = quality === 'hq' ? 'hqdefault' : 'mqdefault';
  return `https://img.youtube.com/vi/${id}/${res}.jpg`;
}
