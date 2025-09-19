<template>
  <button
    :aria-pressed="modelValue"
    :class="[
      'inline-flex items-center justify-center rounded-full p-2 transition-colors',
      modelValue ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400 hover:text-pink-500 hover:bg-pink-50',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
    ]"
    @click="toggleLike"
    :disabled="disabled"
    type="button"
  >
    <svg v-if="modelValue" class="w-5 h-5 fill-pink-500" viewBox="0 0 20 20">
      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
    <span v-if="count !== undefined" class="ml-1 text-xs font-medium">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">

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

const emit = defineEmits(['update:modelValue', 'like', 'unlike']);

function toggleLike() {
  if (props.disabled) return;
  const newValue = !props.modelValue;
  emit('update:modelValue', newValue);
  emit(newValue ? 'like' : 'unlike');
}
</script>
