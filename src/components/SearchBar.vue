<template>
  <div class="flex items-center w-full">
    <input
      :value="search"
      type="text"
      :placeholder="placeholder"
      class="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
      @input="onInput"
    />
    <button
      class="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
      @click="onSearch"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Rechercher...'
  }
});

const emit = defineEmits(['update:modelValue', 'search']);
const search = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  search.value = val;
});

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  search.value = value;
  emit('update:modelValue', value);
}

function onSearch() {
  emit('search', search.value);
}
</script>
