import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { JobsService } from '../JobsService';
import { JobLikeState } from '@/models/JobLikeState';
import { JobStatus } from '@/models/JobStatus';
import type { JobType } from '@/models/Job.schema';
import jobsSeed from '../../data/jobs.seed.json';

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(() => {
    setActivePinia(createPinia());
    service = new JobsService();
  });

  function makeJob(overrides: Partial<JobType> = {}): JobType {
    return {
      id: '1',
      title: 'Développeur',
      city: 'Lyon',
      remote: true,
      salary: 50000,
      status: JobStatus.None,
      like: JobLikeState.None,
      ...overrides,
    };
  }

  // --- interestScore ---
  it('score = 0 if disliked', () => {
    const job = makeJob({ like: JobLikeState.Disliked });
    expect(service.interestScore(job)).toBe(0);
  });

  it('score = 0 if status is rejected', () => {
    const job = makeJob({ status: JobStatus.Rejected });
    expect(service.interestScore(job)).toBe(0);
  });

  it('positive score if remote, target city, salary >= 45k, liked', () => {
    const job = makeJob({ like: JobLikeState.Liked });
    // remote +8, city +6, salary +12, liked +30
    expect(service.interestScore(job)).toBe(8 + 6 + 12 + 30);
  });

  it('negative score if non-target city and salary < 35k', () => {
    const job = makeJob({ city: 'Paris', salary: 30000 });
    // city -5, salary -8, remote +8
    expect(service.interestScore(job)).toBe(-5 - 8 + 8);
  });

  it('bonus for InterviewPlanned and OfferMade', () => {
    const job1 = makeJob({ status: JobStatus.InterviewPlanned });
    const job2 = makeJob({ status: JobStatus.OfferMade });
    expect(service.interestScore(job1)).toBe(8 + 6 + 12 + 15); // remote + city + salary + status
    expect(service.interestScore(job2)).toBe(8 + 6 + 12 + 20);
  });

  // --- search ---
  describe('search', () => {
    beforeEach(async () => {
      await service.loadJobs();
    });

    it('returns all jobs if query is empty', () => {
      expect(service.search('')).toHaveLength(jobsSeed.length);
    });

    it('filters by title', () => {
      const res = service.search('vue');
      expect(res).toHaveLength(1);
      expect(res[0].title).toMatch(/vue/i);
    });

    it('filters by city', () => {
      const res = service.search('saint-étienne');
      expect(res).toHaveLength(1);
      expect(res[0].city).toMatch(/saint-étienne/i);
    });

    it('is case and accent insensitive', () => {
      expect(service.search('lyon')).toHaveLength(1);
      expect(service.search('LYON')).toHaveLength(1);
      expect(service.search('développeur')).toHaveLength(1);
    });
  });
});
