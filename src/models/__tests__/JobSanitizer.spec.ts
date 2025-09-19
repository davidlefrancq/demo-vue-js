import { describe, it, expect } from 'vitest';
import { JobSanitizer } from '../JobSanitizer';
import { JobStatus } from '../JobStatus';
import { JobLikeState } from '../JobLikeState';
import type { JobType } from '../Job.schema';

const dirtyJob: Partial<JobType> = {
  id: '<script>alert(1)</script><b>job-1</b><img src=x onerror=alert(1)/>',
  title: '<script>alert(1)</script><b>Developer</b><img src=x onerror=alert(1)/>',
  city: '<script>alert(1)</script><b>Paris</b><img src=x onerror=alert(1)/>',
  companyId: '<script>alert(1)</script><b>company-1</b><img src=x onerror=alert(1)/>',
  remote: true,
  salary: 50000,
  status: JobStatus.Applied,
  like: JobLikeState.Liked,
};

describe('JobSanitizer', () => {
  it('should sanitize all string fields', () => {
    const sanitized = JobSanitizer.sanitize(dirtyJob as JobType);
    expect(sanitized.id).toBe('job-1');
    expect(sanitized.title).toBe('Developer');
    expect(sanitized.city).toBe('Paris');
    expect(sanitized.companyId).toBe('company-1');
  });

  it('should keep valid boolean and number fields', () => {
    const sanitized = JobSanitizer.sanitize(dirtyJob as JobType);
    expect(sanitized.remote).toBe(true);
    expect(sanitized.salary).toBe(50000);
  });

  it('should keep valid enum values', () => {
    const sanitized = JobSanitizer.sanitize(dirtyJob as JobType);
    expect(sanitized.status).toBe(JobStatus.Applied);
    expect(sanitized.like).toBe(JobLikeState.Liked);
  });

  it('should fallback to defaults for missing or invalid fields', () => {
    const partial: Partial<JobType> = { };
    const sanitized = JobSanitizer.sanitize(partial as JobType);
    expect(sanitized.id).toBe('');
    expect(sanitized.title).toBe('');
    expect(sanitized.city).toBe('');
    expect(sanitized.remote).toBe(false);
    expect(sanitized.salary).toBe(0);
  });

  it('should reject invalid enum status value', () => {
    const partial: Partial<JobType> = {
      ...dirtyJob,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: '<script>alert(1)</script><b>NotAStatus</b><img src=x onerror=alert(1)/>' as any,
    };
    const sanitized = JobSanitizer.sanitize(partial as JobType);
    expect(Object.values(JobStatus)).toContain(sanitized.status);
  });

  it('should reject invalid enum like value', () => {
    const partial: Partial<JobType> = {
      ...dirtyJob,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      like: '<script>alert(1)</script><b>SuperLiked</b><img src=x onerror=alert(1)/>' as any,
    };
    const sanitized = JobSanitizer.sanitize(partial as JobType);
    expect(Object.values(JobLikeState)).toContain(sanitized.like);
  });
});
