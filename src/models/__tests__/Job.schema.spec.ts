import { describe, it, expect } from 'vitest';
import { JobSchema, type JobType } from '../Job.schema';
import { JobStatus } from '../JobStatus';
import { JobLikeState } from '../JobLikeState';

const validJob: JobType = {
  id: 'job-1',
  title: 'Développeur',
  city: 'Paris',
  companyId: 'company-1',
  remote: true,
  salary: 45000,
  status: JobStatus.None,
  like: JobLikeState.None,
};

describe('JobSchema', () => {
  it('should validate a correct job object', () => {
    const result = JobSchema.safeParse(validJob);
    expect(result.success).toBe(true);
  });

  it('should validate a job with empty id', () => {
    const job = { ...validJob, id: '' };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with liked state', () => {
    const job = { ...validJob, like: JobLikeState.Liked };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with disliked state', () => {
    const job = { ...validJob, like: JobLikeState.Disliked };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status Applied', () => {
    const job = { ...validJob, status: JobStatus.Applied };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status UnderReview', () => {
    const job = { ...validJob, status: JobStatus.UnderReview };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status Shortlisted', () => {
    const job = { ...validJob, status: JobStatus.Shortlisted };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status Rejected', () => {
    const job = { ...validJob, status: JobStatus.Rejected };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status InterviewPlanned', () => {
    const job = { ...validJob, status: JobStatus.InterviewPlanned };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status InterviewDone', () => {
    const job = { ...validJob, status: JobStatus.InterviewDone };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status InterviewCanceled', () => {
    const job = { ...validJob, status: JobStatus.InterviewCanceled };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status OfferMade', () => {
    const job = { ...validJob, status: JobStatus.OfferMade };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status Negotiation', () => {
    const job = { ...validJob, status: JobStatus.Negotiation };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status OfferAccepted', () => {
    const job = { ...validJob, status: JobStatus.OfferAccepted };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status OfferDeclined', () => {
    const job = { ...validJob, status: JobStatus.OfferDeclined };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should validate a job with status Hired', () => {
    const job = { ...validJob, status: JobStatus.Hired };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(true);
  });

  it('should reject a job with empty title', () => {
    const job = { ...validJob, title: '' };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(false);
  });

  it('should reject a job with negative salary', () => {
    const job = { ...validJob, salary: -1000 };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(false);
  });

  it('should reject a job with invalid status', () => {
    const job = { ...validJob, status: 'Unknown' };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(false);
  });

  it('should reject a job with invalid like value', () => {
    const job = { ...validJob, like: 'SuperLiked' };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(false);
  });

  it('should reject a job with empty city', () => {
    const job = { ...validJob, city: '' };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(false);
  });

  it('should reject a job with wrong types', () => {
    const job = { ...validJob, salary: 'high' };
    const result = JobSchema.safeParse(job);
    expect(result.success).toBe(false);
  });
});
