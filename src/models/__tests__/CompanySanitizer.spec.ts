import { describe, it, expect } from 'vitest';
import { CompanySanitizer } from '../CompanySanitizer';
import type { CompanyType } from '../Company.schema';

describe('CompanySanitizer', () => {
  it('should sanitize all string fields', () => {
    const dirty: CompanyType = {
      id: '1',
      name: '<b>Acme</b>',
      location: '<img src=x onerror=alert(1)>Paris',
      size: 42,
      industry: '<div>Tech</div>',
    };
    const clean = CompanySanitizer.sanitize(dirty);
    expect(clean.id).toBe('1');
    expect(clean.name).toBe('Acme');
    expect(clean.location).toBe('Paris');
    expect(clean.size).toBe(42);
    expect(clean.industry).toBe('Tech');
  });

  it('should sanitize id field', () => {
    const dirty: CompanyType = {
      id: '<script>1</script>',
      name: '<b>Acme</b>',
      location: '<img src=x onerror=alert(1)>Paris',
      size: 42,
      industry: '<div>Tech</div>',
    };
    const clean = CompanySanitizer.sanitize(dirty);
    expect(clean.id).toBe('');
    expect(clean.name).toBe('Acme');
    expect(clean.location).toBe('Paris');
    expect(clean.size).toBe(42);
    expect(clean.industry).toBe('Tech');
  });

  it('should handle missing fields in partialSanitize', () => {
    const partial = { name: '<b>Acme</b>' };
    const clean = CompanySanitizer.partialSanitize(partial);
    expect(clean.name).toBe('Acme');
    expect(clean.id).toBeUndefined();
    expect(clean.size).toBeUndefined();
  });

  it('should fallback to default values in sanitize', () => {
    const incomplete = { name: '<b>Acme</b>' } as CompanyType;
    const clean = CompanySanitizer.sanitize(incomplete);
    expect(clean.name).toBe('Acme');
    expect(clean.id).toBe('');
    expect(clean.size).toBe(0);
    expect(clean.location).toBe('');
    expect(clean.industry).toBe('');
  });
});
