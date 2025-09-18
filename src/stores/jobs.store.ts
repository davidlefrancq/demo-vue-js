import { reactive, toRefs } from 'vue';
import { defineStore } from 'pinia';
import type { JobType } from '@/models/Job.schema';
import { JobLikeState } from '@/models/JobLikeState';
import { JobStatus } from '@/models/JobStatus';

interface JobsState {
  items: JobType[];
  selectedId: string | null;
  likes: Record<string, JobLikeState>;
  statuses: Record<string, JobStatus>;
}

export const useJobsStore = defineStore('jobs', () => {
  // --- State ---
  const state = reactive<JobsState>({
    items: [],
    selectedId: null,
    likes: {},
    statuses: {},
  });

  // --- Actions ---
  function setItems(jobs: JobType[]) {
    state.items = jobs;
  }

  function setStatus(jobId: string, status: JobStatus) {
    state.statuses[jobId] = status;
  }

  function setLike(jobId: string, like: JobLikeState) {
    state.likes[jobId] = like;
  }

  return {
    ...toRefs(state),
    setItems,
    setStatus,
    setLike,
  };
});
