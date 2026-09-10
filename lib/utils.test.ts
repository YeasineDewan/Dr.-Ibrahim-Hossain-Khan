import { describe, it, expect } from 'vitest';
import { TODAY, extractYouTubeId, youtubeEmbedUrl, youtubeThumbnail } from './utils';

describe('utils', () => {
  it('TODAY is a YYYY-MM-DD string', () => {
    expect(TODAY).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('extractYouTubeId', () => {
  it('extracts the ID from a youtu.be short link', () => {
    expect(extractYouTubeId('https://youtu.be/dlKA6LTj3Zw')).toBe('dlKA6LTj3Zw');
  });

  it('extracts the ID from a youtube.com watch URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=5RXPd1XdVJc')).toBe('5RXPd1XdVJc');
    expect(extractYouTubeId('https://www.youtube.com/watch?v=5RXPd1XdVJc&t=12s')).toBe('5RXPd1XdVJc');
  });

  it('extracts the ID from an embed URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/embed/LUGH57vV38s')).toBe('LUGH57vV38s');
  });

  it('strips a leading www. and protocol', () => {
    expect(extractYouTubeId('youtu.be/LUGH57vV38s')).toBe('LUGH57vV38s');
  });

  it('returns null for non-YouTube or empty input', () => {
    expect(extractYouTubeId('https://example.com/video')).toBeNull();
    expect(extractYouTubeId('')).toBeNull();
    expect(extractYouTubeId('not a url')).toBeNull();
  });
});

describe('youtubeEmbedUrl', () => {
  it('builds an embed URL with autoplay disabled by default', () => {
    const url = youtubeEmbedUrl('https://youtu.be/dlKA6LTj3Zw');
    expect(url).toBe('https://www.youtube.com/embed/dlKA6LTj3Zw?autoplay=0&rel=0&modestbranding=1');
  });

  it('enables autoplay when requested', () => {
    const url = youtubeEmbedUrl('https://youtu.be/dlKA6LTj3Zw', true);
    expect(url).toContain('autoplay=1');
  });

  it('includes rel=0 and modestbranding', () => {
    const url = youtubeEmbedUrl('https://youtu.be/5RXPd1XdVJc');
    expect(url).toContain('rel=0');
    expect(url).toContain('modestbranding=1');
  });

  it('returns null for a non-YouTube input', () => {
    expect(youtubeEmbedUrl('https://example.com')).toBeNull();
  });
});

describe('youtubeThumbnail', () => {
  it('defaults to the hqdefault image', () => {
    expect(youtubeThumbnail('dlKA6LTj3Zw')).toBe(
      'https://img.youtube.com/vi/dlKA6LTj3Zw/hqdefault.jpg',
    );
  });

  it('uses mqdefault when quality is mq', () => {
    expect(youtubeThumbnail('5RXPd1XdVJc', 'mq')).toBe(
      'https://img.youtube.com/vi/5RXPd1XdVJc/mqdefault.jpg',
    );
  });
});
