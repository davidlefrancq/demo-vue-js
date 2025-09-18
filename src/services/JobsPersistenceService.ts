import { JobLikeState } from '@/models/JobLikeState';
import { JobStatus } from '@/models/JobStatus';

const LIKES_KEY = 'jobs.likes';
const STATUSES_KEY = 'jobs.statuses';

export class JobsPersistenceService {
  static loadLikes(): Record<string, JobLikeState> {
    try {
      const raw = localStorage.getItem(LIKES_KEY);
      if (raw) return JSON.parse(raw) as Record<string, JobLikeState>;
      return {};
    } catch {
      return {};
    }
  }

  static saveLikes(likes: Record<string, JobLikeState>): void {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    } catch {
      // fail silently
    }
  }

  static loadStatuses(): Record<string, JobStatus> {
    try {
      const raw = localStorage.getItem(STATUSES_KEY);
      if (raw) return JSON.parse(raw) as Record<string, JobStatus>;
      return {};
    } catch {
      return {};
    }
  }

  static saveStatuses(statuses: Record<string, JobStatus>): void {
    try {
      localStorage.setItem(STATUSES_KEY, JSON.stringify(statuses));
    } catch {
      // fail silently
    }
  }
}
