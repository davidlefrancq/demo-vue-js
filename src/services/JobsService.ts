import { useJobsStore } from '@/stores/jobs.store';
import { JobsPersistenceService } from './JobsPersistenceService';
import { JobRepository } from '@/repositories/JobRepository';
import type { JobType } from '@/models/Job.schema';
import { JobLikeState } from '@/models/JobLikeState';
import { JobStatus } from '@/models/JobStatus';

const TARGET_CITIES = ['lyon', 'saint-étienne'];

export class JobsService {
  private static instance: JobsService | null = null;
  private repo = new JobRepository();

  public static getInstance(): JobsService {
    if (JobsService.instance === null) {
      JobsService.instance = new JobsService();
    }
    return JobsService.instance;
  }

  private get store() {
    return useJobsStore();
  }

  // Hydrate store from persistence
  public hydrate() {
    Object.assign(this.store.likes, JobsPersistenceService.loadLikes());
    Object.assign(this.store.statuses, JobsPersistenceService.loadStatuses());
  }

  // Persist likes and statuses
  private persistLikes() {
    JobsPersistenceService.saveLikes({ ...this.store.likes });
  }
  private persistStatuses() {
    JobsPersistenceService.saveStatuses({ ...this.store.statuses });
  }

  // Load jobs from repo and set in store
  public async loadJobs() {
    const jobs = await this.repo.list();
    this.store.setItems(jobs);
  }

  public async list(): Promise<JobType[]> {
    const jobs = this.store.items;
    const jobsStore = this.store;
    return jobs.map(job => ({
      ...job,
      like: jobsStore.likes[job.id] ?? job.like,
      status: jobsStore.statuses[job.id] ?? job.status,
    }));
  }

  // Retourne un job par son id (async, pour cohérence avec le repo)
  public async getById(id: string): Promise<JobType | null> {
    // On cherche d'abord dans le store (déjà chargé)
    const found = this.store.items.find((j: JobType) => j.id === id);
    if (found) {
      return {
        ...found,
        like: this.store.likes[found.id] ?? found.like,
        status: this.store.statuses[found.id] ?? found.status,
      };
    }
    // Sinon, fallback sur le repo (ex: si le store n'est pas hydraté)
    try {
      const job = await this.repo.getById(id);
      if (!job) return null;
      return {
        ...job,
        like: this.store.likes[job.id] ?? job.like,
        status: this.store.statuses[job.id] ?? job.status,
      };
    } catch {
      return null;
    }
  }

  // Search jobs by text query
  public search(query: string): JobType[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.store.items;
    return this.store.items.filter((j: JobType) =>
      j.title.toLowerCase().includes(q) ||
      j.city.toLowerCase().includes(q)
    );
  }

  // Filter jobs by city and remote
  public filter(city?: string, remote?: boolean): JobType[] {
    return this.store.items.filter((j: JobType) => {
      const cityMatch = city ? j.city === city : true;
      const remoteMatch = remote === undefined ? true : j.remote === remote;
      return cityMatch && remoteMatch;
    });
  }

  // Calculate interest score for a job
  public interestScore(job: JobType): number {
    // Like/Dislike: priority
    if (job.like === JobLikeState.Disliked) return 0;
    // Closed/negative status: score 0
    if (job.status === JobStatus.Rejected) return 0;

    let score = 0;

    // Remote
    if (job.remote) score += 8;

    // City
    if (TARGET_CITIES.includes(job.city.toLowerCase())) score += 6;
    else score -= 5;

    // Salary
    if (job.salary >= 45000) score += 12;
    else if (job.salary < 35000) score -= 8;

    // Advanced status
    if (job.status === JobStatus.InterviewPlanned) score += 15;
    if (job.status === JobStatus.OfferMade) score += 20;
    if (job.status === JobStatus.Hired) score += 30;

    // Like
    if (job.like === JobLikeState.Liked) score += 30;

    return score;
  }

  // Set like and persist
  public setLike(jobId: string, like: JobLikeState) {
    this.store.setLike(jobId, like);
    this.persistLikes();
  }

  // Set status and persist
  public setStatus(jobId: string, status: JobStatus) {
    this.store.setStatus(jobId, status);
    this.persistStatuses();
  }
}
