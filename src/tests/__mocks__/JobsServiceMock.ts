import type { MockInstance } from 'vitest'
import type { JobType } from "@/models/Job.schema"

export type JobsServiceMock = {
  getById: MockInstance<(id: string) => Promise<JobType | null>>
  list: MockInstance<() => Promise<JobType[]>>
}
