import sanitizeHtml from 'sanitize-html';
import type { JobType } from './Job.schema';
import { JobLikeState } from './JobLikeState';
import { JobStatus } from './JobStatus';

const SANITIZE_STRICT_CONFIG = { allowedTags: [], allowedAttributes: {} };
export class JobSanitizer {
  static partialSanitize(data: Partial<JobType>): Partial<JobType> {
    const dataSanitized: Partial<JobType> = {
      id: data.id ? sanitizeHtml(data.id, SANITIZE_STRICT_CONFIG) : undefined,
      title: data.title ? sanitizeHtml(data.title, SANITIZE_STRICT_CONFIG) : undefined,
      city: data.city ? sanitizeHtml(data.city, SANITIZE_STRICT_CONFIG) : undefined,
      remote: typeof data.remote === 'boolean' ? data.remote : undefined,
      salary: typeof data.salary === 'number' ? data.salary : undefined,
      status: (data.status && Object.values(JobStatus).includes(data.status)) ? data.status : undefined,
      like: (data.like && Object.values(JobLikeState).includes(data.like)) ? data.like : undefined,
    };
    return dataSanitized;
  }

  static sanitize(data: JobType): JobType {
    const dataSanitized = this.partialSanitize(data);
    return {
      id: dataSanitized.id || '',
      title: dataSanitized.title || '',
      city: dataSanitized.city || '',
      remote: typeof dataSanitized.remote === 'boolean' ? dataSanitized.remote : false,
      salary: typeof dataSanitized.salary === 'number' ? dataSanitized.salary : 0,
      status: dataSanitized.status || JobStatus.None,
      like: dataSanitized.like || JobLikeState.None,
    };
  }
}
