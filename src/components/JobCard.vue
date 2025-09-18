<template>
  <div class="bg-white rounded-lg shadow p-5 flex flex-col gap-3 border border-gray-100 hover:shadow-lg transition-shadow">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img v-if="companyLogo" :src="companyLogo" alt="Logo" class="w-12 h-12 rounded object-contain bg-gray-50 border border-gray-200" />
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <p class="text-sm text-gray-500">{{ company }}</p>
        </div>
      </div>
      <slot name="actions"></slot>
    </div>
    <div class="flex flex-wrap gap-2 items-center">
      <slot name="badges"></slot>
      <span v-if="location" class="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 21a2 2 0 01-2.828 0l-4.243-4.343a8 8 0 1111.314 0z" />
          <circle cx="12" cy="11" r="3" />
        </svg>
        {{ location }}
      </span>
    </div>
    <div class="text-gray-700 text-sm line-clamp-3">
      <slot name="description">{{ description }}</slot>
    </div>
    <div class="flex items-center justify-between mt-2">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  location: { type: String, default: '' },
  description: { type: String, default: '' }
});
</script>
