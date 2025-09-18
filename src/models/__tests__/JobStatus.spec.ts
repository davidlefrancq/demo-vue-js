import { describe, it, expect } from 'vitest'
import { JobStatus } from '../JobStatus';

describe('JobStatus enum', () => {
  it('should have correct values', () => {
    expect(JobStatus.None).toBe('None');
    expect(JobStatus.Applied).toBe('Applied');
    expect(JobStatus.UnderReview).toBe('UnderReview');
    expect(JobStatus.Shortlisted).toBe('Shortlisted');
    expect(JobStatus.Rejected).toBe('Rejected');
    expect(JobStatus.InterviewPlanned).toBe('InterviewPlanned');
    expect(JobStatus.InterviewDone).toBe('InterviewDone');
    expect(JobStatus.InterviewCanceled).toBe('InterviewCanceled');
    expect(JobStatus.OfferMade).toBe('OfferMade');
    expect(JobStatus.Negotiation).toBe('Negotiation');
    expect(JobStatus.OfferAccepted).toBe('OfferAccepted');
    expect(JobStatus.OfferDeclined).toBe('OfferDeclined');
    expect(JobStatus.Hired).toBe('Hired');
  });
});
