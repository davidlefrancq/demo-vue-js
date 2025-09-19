import { z } from 'zod';
import { JobStatus } from './JobStatus';
import { JobLikeState } from './JobLikeState';

export const JobSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  city: z.string().min(1),
  companyId: z.string(),
  remote: z.boolean(),
  salary: z.number().nonnegative(),
  status: z.enum(JobStatus),
  like: z.enum(JobLikeState),
});

export type JobType = z.infer<typeof JobSchema>;
