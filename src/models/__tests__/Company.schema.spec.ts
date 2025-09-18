import { describe, it, expect } from 'vitest';
import { CompanySchema } from '../Company.schema';

describe('CompanySchema', () => {
  it('should validate a correct company object', () => {
    const validCompany = {
      id: '1',
      name: 'Acme Corp',
      location: 'Paris',
      size: 100,
      industry: 'Tech',
    };
    const result = CompanySchema.safeParse(validCompany);
    expect(result.success).toBe(true);
  });

  it('should reject a company with missing fields', () => {
    const invalidCompany = {
      id: '1',
      name: 'Acme Corp',
      // location missing
      size: 100,
      industry: 'Tech',
    };
    const result = CompanySchema.safeParse(invalidCompany);
    expect(result.success).toBe(false);
  });

  it('should reject a company with empty fields', () => {
    const invalidCompany = {
      id: '',
      name: '',
      location: '',
      size: 0,
      industry: '',
    };
    const result = CompanySchema.safeParse(invalidCompany);
    expect(result.success).toBe(false);
  });

  it('should validate a company with some empty fields', () => {
    const invalidCompany = {
      id: '',
      name: 'Acme',
      location: '',
      size: 0,
      industry: '',
    };
    const result = CompanySchema.safeParse(invalidCompany);
    expect(result.success).toBe(true);
  });

  it('should reject a company with wrong types', () => {
    const invalidCompany = {
      id: '1',
      name: 'Acme Corp',
      location: 'Paris',
      size: 'big', // should be number
      industry: 'Tech',
    };
    const result = CompanySchema.safeParse(invalidCompany);
    expect(result.success).toBe(false);
  });

  it('should reject a company with negative size', () => {
    const invalidCompany = {
      id: '1',
      name: 'Acme Corp',
      location: 'Paris',
      size: -5,
      industry: 'Tech',
    };
    const result = CompanySchema.safeParse(invalidCompany);
    expect(result.success).toBe(false);
  });
});
