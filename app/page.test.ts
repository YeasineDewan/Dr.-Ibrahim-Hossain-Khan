import { describe, it, expect, vi } from 'vitest';

describe('app/page smoke tests', () => {
  it('page module exports a default component', async () => {
    if (typeof window !== 'undefined' && !window.matchMedia) {
      (window as any).matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    }
    const mod = await import('./page');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
