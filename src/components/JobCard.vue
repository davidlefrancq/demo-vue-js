<template>
  <div class="bg-white rounded-lg shadow p-5 flex flex-col gap-3 border border-gray-100 hover:shadow-lg transition-shadow">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img v-if="companyLogo" :src="companyLogo" alt="Logo" class="w-12 h-12 rounded object-contain bg-gray-50 border border-gray-200" />
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
          <p class="text-sm text-gray-500">{{ company?.name }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <LikeButton :model-value="likeState === 'Liked'" @update:model-value="onLike" @click.stop />
        <DislikeButton :model-value="likeState === 'Disliked'" @update:model-value="onDislike" @click.stop />
      </div>
      <slot name="actions"></slot>
    </div>
    <div class="flex flex-wrap gap-2 items-center">
      <slot name="badges"></slot>
      <span v-if="job.city" class="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 21a2 2 0 01-2.828 0l-4.243-4.343a8 8 0 1111.314 0z" />
          <circle cx="12" cy="11" r="3" />
        </svg>
        {{ job.city }}
      </span>
      <span v-if="typeof job.remote === 'boolean'" class="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
        {{ job.remote ? 'Remote' : 'Sur site' }}
      </span>
      <span v-if="typeof job.salary === 'number'" class="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
        {{ job.salary.toLocaleString() }} €
      </span>
      <span v-if="job.status" class="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
        Statut : {{ job.status }}
      </span>
      <span v-if="likeState !== 'None'" class="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
        Like : {{ likeState }}
      </span>
    </div>
    <div class="text-gray-700 text-sm line-clamp-3">
      <slot name="description"></slot>
    </div>
    <div class="flex items-center justify-between mt-2">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import LikeButton from './LikeButton.vue';
import DislikeButton from './DislikeButton.vue';
import type { JobType } from '@/models/Job.schema';
import type { CompanyType } from '@/models/Company.schema';
import { JobLikeState } from '@/models/JobLikeState';
import { JobsService } from '@/services/JobsService';

const props = defineProps<{
  job: JobType;
  company?: CompanyType | null;
  companyLogo?: string;
}>();

const likeState = ref<JobLikeState>(props.job.like);
const jobsService = JobsService.getInstance();

watch(() => props.job.like, (val) => {
  likeState.value = val;
});

function onLike(val: boolean) {
  likeState.value = val ? JobLikeState.Liked : JobLikeState.None;
  jobsService.setLike(props.job.id, likeState.value);
}

function onDislike(val: boolean) {
  likeState.value = val ? JobLikeState.Disliked : JobLikeState.None;
  jobsService.setLike(props.job.id, likeState.value);
}
</script>
