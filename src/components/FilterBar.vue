<template>
  <div class="flex flex-wrap gap-2 items-center w-full">
    <slot name="filters">
      <!-- Exemple de filtre par défaut -->
      <select
        v-for="(option, idx) in filters"
        :key="idx"
        v-model="selected[idx]"
        class="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="onFilterChange"
      >
        <option :value="null" disabled>Sélectionner</option>
        <option v-for="item in option" :key="item.value ?? item.label" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </slot>
    <button
      v-if="showReset"
      class="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      @click="resetFilters"
    >
      Réinitialiser
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface FilterOption {
  label: string;
  value: string | number | null;
}

const props = defineProps({
  filters: {
    type: Array as () => FilterOption[][],
    default: () => []
  },
  modelValue: {
    type: Array as () => (string | number | null)[],
    default: () => []
  },
  showReset: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'reset']);
const selected = ref<(string | number | null)[]>([...props.modelValue]);

watch(() => props.modelValue, (val) => {
  selected.value = [...val];
});

function onFilterChange() {
  emit('update:modelValue', [...selected.value]);
}

function resetFilters() {
  selected.value = props.filters.map(() => null);
  emit('update:modelValue', [...selected.value]);
  emit('reset');
}
</script>
