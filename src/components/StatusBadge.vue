<template>
  <span :class="badgeClass">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-800',
  closed: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  draft: 'bg-gray-100 text-gray-700',
  default: 'bg-blue-100 text-blue-800'
};

const props = defineProps({
  status: {
    type: String,
    default: 'default'
  },
  label: {
    type: String,
    default: ''
  }
});

const badgeClass = computed(() => {
  return [
    'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
    statusColors[props.status] || statusColors.default
  ].join(' ');
});
</script>
