import { describe, it, expect, beforeEach } from 'vitest';
import { JobRepository } from '../JobRepository';
import { GetAllJobsError, GetJobByIdError, UpdateJobError } from '../errors/JobRepositoryError';
import jobsSeed from '../../data/jobs.seed.json';

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
    // Simule une corruption interne
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    repo.jobs = null;
    await expect(repo.list()).rejects.toThrow(GetAllJobsError);
  });
});
