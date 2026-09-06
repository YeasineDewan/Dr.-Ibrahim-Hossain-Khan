import { describe, it, expect } from 'vitest';
import { TODAY } from './utils';

describe('utils', () => {
  it('TODAY is a YYYY-MM-DD string', () => {
    expect(TODAY).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
