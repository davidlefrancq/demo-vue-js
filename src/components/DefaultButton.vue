<template>
  <button
    :class="[
      'inline-flex items-center justify-center px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      colorClass,
      sizeClass,
      { 'opacity-50 cursor-not-allowed': disabled, 'ring-2 ring-blue-300': active }
    ]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'default', // default, success, error, warning
    validator: (val: string) => ['default', 'success', 'error', 'warning'].includes(val)
  },
  size: {
    type: String,
    default: 'md', // md, sm, lg
    validator: (val: string) => ['sm', 'md', 'lg'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button',
    validator: (val: string) => ['button', 'submit', 'reset'].includes(val)
  }
});

defineEmits(['click']);

const colorClass = computed(() => {
  switch (props.color) {
    case 'success':
      return 'bg-green-600 text-white hover:bg-green-700';
    case 'error':
      return 'bg-red-600 text-white hover:bg-red-700';
    case 'warning':
      return 'bg-yellow-400 text-gray-900 hover:bg-yellow-500';
    default:
      return 'bg-blue-600 text-white hover:bg-blue-700';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs px-2 py-1';
    case 'lg':
      return 'text-lg px-6 py-3';
    default:
      return 'text-base';
  }
});
</script>

