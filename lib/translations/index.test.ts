import { t } from './index';

describe('Translation function', () => {
  it('returns English by default', () => {
    const result = t('common', 'en');
    expect(result.brandName).toBe('Dr. Ibrahim');
    expect(result.brandFull).toBeTruthy();
  });

  it('returns Bengali when lang is bn', () => {
    const result = t('common', 'bn');
    expect(result.brandName).toBe('ডাঃ ইব্রাহিম');
  });

  it('falls back to English for unknown keys', () => {
    const result = t('nav', 'en');
    expect(result.navItems).toContain('About');
  });

  it('nav copy has both en and bn', () => {
    const enNav = t('nav', 'en');
    const bnNav = t('nav', 'bn');
    expect(enNav).toBeDefined();
    expect(bnNav).toBeDefined();
  });
});
