import { describe, it, expect, beforeEach } from 'vitest';
import { JobRepository } from '../JobRepository';
import { GetAllJobsError, GetJobByIdError, UpdateJobError } from '../errors/JobRepositoryError';
import jobsSeed from '../../data/jobs.seed.json';
import { JobStatus } from '@/models/JobStatus';
import { JobLikeState } from '@/models/JobLikeState';

const HACKER_INJECTION = '<script>alert("xss")</script>';
const getFirstJobId = () => (jobsSeed[0] as { id: string }).id;

describe('JobRepository', () => {
  let repo: JobRepository;

  beforeEach(() => {
    repo = new JobRepository();
  });

  it('list() returns all jobs', async () => {
    const jobs = await repo.list();
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.length).toBe(jobsSeed.length);
    expect(jobs[0]).toHaveProperty('id');
  });

  it('getById() returns a job by id', async () => {
    const id = getFirstJobId();
    const job = await repo.getById(id);
    expect(job).toBeDefined();
    expect(job.id).toBe(id);
  });

  it('getById() throws if id is missing', async () => {
    await expect(repo.getById('')).rejects.toThrow(GetJobByIdError);
  });

  it('getById() throws if job not found', async () => {
    await expect(repo.getById('unknown-id')).rejects.toThrow(GetJobByIdError);
  });

  it('updatePartial() updates a job field', async () => {
    const id = getFirstJobId();
    const newTitle = 'Updated Title';
    const updated = await repo.updatePartial(id, { title: newTitle });
    expect(updated.title).toBe(newTitle);
    // Should persist in repo
    const job = await repo.getById(id);
    expect(job.title).toBe(newTitle);
  });

  it('updatePartial() with injected code in title', async () => {
    const maliciousUpdate = { title: HACKER_INJECTION };
    await expect(repo.updatePartial(getFirstJobId(), maliciousUpdate)).rejects.toThrow(UpdateJobError);
  });

  it('updatePartial() with injected code in city', async () => {
    const maliciousUpdate = { city: HACKER_INJECTION };
    await expect(repo.updatePartial(getFirstJobId(), maliciousUpdate)).rejects.toThrow(UpdateJobError);
  });

  it('updatePartial() with injected code in remote', async () => {
    const maliciousUpdate = { remote: HACKER_INJECTION as unknown as boolean };
    const updated = await repo.updatePartial(getFirstJobId(), maliciousUpdate);
    expect(updated.remote).toBe(false);
    const fetched = await repo.getById(getFirstJobId());
    expect(fetched.remote).toBe(false);
  });

  it('updatePartial() with injected code in salary', async () => {
    const maliciousUpdate = { salary: HACKER_INJECTION as unknown as number };
    const updated = await repo.updatePartial(getFirstJobId(), maliciousUpdate);
    expect(updated.salary).toBe(0);
    const fetched = await repo.getById(getFirstJobId());
    expect(fetched.salary).toBe(0);
  });

  it('updatePartial() with injected code in status', async () => {
    const maliciousUpdate = { status: HACKER_INJECTION as unknown as JobStatus };
    const updated = await repo.updatePartial(getFirstJobId(), maliciousUpdate);
    expect(updated.status).toBe(JobStatus.None);
    const fetched = await repo.getById(getFirstJobId());
    expect(fetched.status).toBe(JobStatus.None);
  });

  it('updatePartial() with injected code in like', async () => {
    const maliciousUpdate = { like: HACKER_INJECTION as unknown as JobLikeState };
    const updated = await repo.updatePartial(getFirstJobId(), maliciousUpdate);
    expect(updated.like).toBe(JobLikeState.None);
    const fetched = await repo.getById(getFirstJobId());
    expect(fetched.like).toBe(JobLikeState.None);
  });

  it('updatePartial() throws if id is missing', async () => {
    await expect(repo.updatePartial('', { title: 'X' })).rejects.toThrow(UpdateJobError);
  });

  it('updatePartial() throws if update is empty', async () => {
    const id = getFirstJobId();
    await expect(repo.updatePartial(id, {})).rejects.toThrow(UpdateJobError);
  });

  it('updatePartial() throws if job not found', async () => {
    await expect(repo.updatePartial('unknown-id', { title: 'X' })).rejects.toThrow(UpdateJobError);
  });

  it('list() throws GetAllJobsError on internal error', async () => {
    // Simulate internal corruption
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    repo.jobs = null;
    await expect(repo.list()).rejects.toThrow(GetAllJobsError);
  });
});
