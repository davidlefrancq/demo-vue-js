import jobsSeed from '../data/jobs.seed.json';
import { JobSchema } from '@/models/Job.schema';
import type { JobType } from '@/models/Job.schema';
import { JobSanitizer } from '@/models/JobSanitizer';
import { GetAllJobsError, GetJobByIdError, UpdateJobError } from './errors/JobRepositoryError';

export class JobRepository {
  private jobs: JobType[];

  constructor() {
    // Initialize the in-memory jobs array
    this.jobs = JobSchema.array().parse(
      (jobsSeed as unknown as JobType[]).map((j) => JobSanitizer.sanitize(j))
    );
  }

  /**
   * Returns the complete list of jobs
   * @throws {GetAllJobsError} If an unexpected error occurs
   */
  async list(): Promise<JobType[]> {
    try {
      return this.jobs.map((j) => JobSchema.parse(j));
    } catch {
      throw new GetAllJobsError();
    }
  }

  /**
   * Returns a job by its id
   * @param id Job id
   * @throws {GetJobByIdError} If id is missing, job not found, or validation fails
   */
  async getById(id: string): Promise<JobType> {
    if (!id) throw new GetJobByIdError();

    const job = this.jobs.find(j => j.id === id);
    if (!job) throw new GetJobByIdError();

    try {
      return JobSchema.parse(job);
    } catch {
      throw new GetJobByIdError();
    }
  }

  /**
   * Partially updates a job (shallow merge)
   * @param id Job id
   * @param update Partial job fields
   * @throws {UpdateJobError} If id or update is missing, job not found, or validation fails
   */
  async updatePartial(id: string, update: Partial<JobType>): Promise<JobType> {
    if (!id) throw new UpdateJobError();
    if (!update || Object.keys(update).length === 0) throw new UpdateJobError();

    const index = this.jobs.findIndex(j => j.id === id);
    if (index === -1) throw new UpdateJobError();

    try {
      const merged = { ...this.jobs[index], ...update };
      const sanitized = JobSanitizer.sanitize(merged);
      const validated = JobSchema.parse(sanitized);
      this.jobs[index] = validated;
      return validated;
    } catch {
      throw new UpdateJobError();
    }
  }
}
