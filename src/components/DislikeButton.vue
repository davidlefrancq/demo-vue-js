<template>
  <button
    :aria-pressed="modelValue"
    :class="[
      'inline-flex items-center justify-center rounded-full p-2 transition-colors',
      modelValue ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 hover:text-blue-500 hover:bg-blue-50',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
    ]"
    @click="toggleDislike"
    :disabled="disabled"
    type="button"
  >
    <svg v-if="modelValue" class="w-5 h-5 fill-blue-500" viewBox="0 0 20 20">
      <path d="M16.828 14.828a4 4 0 01-5.656 0L10 13.657l-1.172 1.171a4 4 0 11-5.656-5.656L10 2.343l6.828 6.829a4 4 0 010 5.656z" />
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.682 17.682a4.5 4.5 0 01-6.364 0L12 16.364l-1.318 1.318a4.5 4.5 0 01-6.364-6.364L12 2.636l7.682 7.682a4.5 4.5 0 010 6.364z" />
    </svg>
    <span v-if="count !== undefined" class="ml-1 text-xs font-medium">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'dislike', 'undislike']);

function toggleDislike() {
  if (props.disabled) return;
  const newValue = !props.modelValue;
  emit('update:modelValue', newValue);
  emit(newValue ? 'dislike' : 'undislike');
}
</script>
