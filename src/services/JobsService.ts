import { useJobsStore } from '@/stores/jobs.store';
import { JobsPersistenceService } from './JobsPersistenceService';
import { JobRepository } from '@/repositories/JobRepository';
import type { JobType } from '@/models/Job.schema';
import { JobLikeState } from '@/models/JobLikeState';
import { JobStatus } from '@/models/JobStatus';

export class JobsService {
  private store = useJobsStore();
  private repo = new JobRepository();

  // Hydrate store from persistence
  hydrate() {
    Object.assign(this.store.likes, JobsPersistenceService.loadLikes());
    Object.assign(this.store.statuses, JobsPersistenceService.loadStatuses());
  }

  // Persist likes and statuses
  persistLikes() {
    JobsPersistenceService.saveLikes({ ...this.store.likes });
  }
  persistStatuses() {
    JobsPersistenceService.saveStatuses({ ...this.store.statuses });
  }

  // Load jobs from repo and set in store
  async loadJobs() {
    const jobs = await this.repo.list();
    this.store.setItems(jobs);
  }

  // Search jobs by text query
  search(query: string): JobType[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.store.items;
    return this.store.items.filter((j: JobType) =>
      j.title.toLowerCase().includes(q) ||
      j.city.toLowerCase().includes(q)
    );
  }

  // Filter jobs by city and remote
  filter(city?: string, remote?: boolean): JobType[] {
    return this.store.items.filter((j: JobType) => {
      const cityMatch = city ? j.city === city : true;
      const remoteMatch = remote === undefined ? true : j.remote === remote;
      return cityMatch && remoteMatch;
    });
  }

  // Calculate interest score for a job
  interestScore(job: JobType): number {
    // Like/Dislike: priorité
    if (job.like === JobLikeState.Disliked) return 0;
    // Statuts fermés : score nul
    if (job.status === JobStatus.Rejected || job.status === JobStatus.Hired) return 0;

    let score = 0;

    // Remote
    if (job.remote) score += 8;

    // Ville
    if (job.city.toLowerCase().match(/lyon|saint-étienne/i)) score += 6;
    else score -= 5;

    // Salaire
    if (job.salary >= 45000) score += 12;
    else if (job.salary < 35000) score -= 8;

    // Statut avancé
    if (job.status === JobStatus.InterviewPlanned) score += 15;
    if (job.status === JobStatus.OfferMade) score += 20;

    // Like
    if (job.like === JobLikeState.Liked) score += 30;

    return score;
  }

  // Set like and persist
  setLike(jobId: string, like: JobLikeState) {
    this.store.setLike(jobId, like);
    this.persistLikes();
  }

  // Set status and persist
  setStatus(jobId: string, status: JobStatus) {
    this.store.setStatus(jobId, status);
    this.persistStatuses();
  }
}

// Facade composable
export function useJobsService() {
  return new JobsService();
}
