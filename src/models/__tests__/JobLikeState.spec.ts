import { describe, it, expect } from 'vitest'
import { JobLikeState } from '../JobLikeState';

describe('JobLikeState enum', () => {
  it('should have correct values', () => {
    expect(JobLikeState.None).toBe('None');
    expect(JobLikeState.Liked).toBe('Liked');
    expect(JobLikeState.Disliked).toBe('Disliked');
  });
});
