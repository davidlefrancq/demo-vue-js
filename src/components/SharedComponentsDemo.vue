<template>
  <div class="space-y-8 p-8 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Démo des composants partagés</h1>

    <section>
      <h2 class="font-semibold mb-2">SearchBar</h2>
      <SearchBar v-model="search" placeholder="Rechercher un poste..." @search="onSearch" />
      <div class="text-xs text-gray-500 mt-1">Valeur : {{ search }}</div>
    </section>

    <section>
      <h2 class="font-semibold mb-2 mt-6">FilterBar</h2>
      <FilterBar v-model="filters" :filters="filterOptions" @reset="onResetFilters" />
      <div class="text-xs text-gray-500 mt-1">Valeur : {{ filters }}</div>
    </section>

    <section>
      <h2 class="font-semibold mb-2 mt-6">JobCard</h2>
      <JobCard
        title="Développeur Vue.js"
        company="TechCorp"
        companyLogo="https://placehold.co/48x48"
        location="Paris"
        description="Rejoignez une équipe dynamique pour développer des applications modernes avec Vue.js et Tailwind CSS."
      >
        <template #badges>
          <StatusBadge status="open" label="Ouvert" />
          <StatusBadge status="pending" label="En attente" />
        </template>
        <template #actions>
          <LikeButton v-model="liked" :count="12" />
          <DislikeButton v-model="disliked" :count="2" class="ml-2" />
        </template>
        <template #footer>
          <DefaultButton color="success" size="sm">Postuler</DefaultButton>
        </template>
      </JobCard>
    </section>

    <section>
      <h2 class="font-semibold mb-2 mt-6">StatusBadge</h2>
      <div class="flex gap-2">
        <StatusBadge status="open" label="Ouvert" />
        <StatusBadge status="closed" label="Fermé" />
        <StatusBadge status="pending" label="En attente" />
        <StatusBadge status="draft" label="Brouillon" />
        <StatusBadge label="Par défaut" />
      </div>
    </section>

    <section>
      <h2 class="font-semibold mb-2 mt-6">LikeButton & DislikeButton</h2>
      <div class="flex gap-4">
        <LikeButton v-model="liked" :count="12" />
        <DislikeButton v-model="disliked" :count="2" />
      </div>
    </section>

    <section>
      <h2 class="font-semibold mb-2 mt-6">DefaultButton</h2>
      <div class="flex gap-2 flex-wrap">
        <DefaultButton>Default</DefaultButton>
        <DefaultButton color="success">Success</DefaultButton>
        <DefaultButton color="error">Error</DefaultButton>
        <DefaultButton color="warning">Warning</DefaultButton>
        <DefaultButton :disabled="true">Disabled</DefaultButton>
        <DefaultButton :active="true">Active</DefaultButton>
        <DefaultButton size="sm">Small</DefaultButton>
        <DefaultButton size="lg">Large</DefaultButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SearchBar from './SearchBar.vue';
import FilterBar from './FilterBar.vue';
import JobCard from './JobCard.vue';
import StatusBadge from './StatusBadge.vue';
import LikeButton from './LikeButton.vue';
import DislikeButton from './DislikeButton.vue';
import DefaultButton from './DefaultButton.vue';

const search = ref('');
const liked = ref(false);
const disliked = ref(false);
const filters = ref([null, null]);
const filterOptions = [
  [
    { label: 'CDI', value: 'cdi' },
    { label: 'CDD', value: 'cdd' },
    { label: 'Stage', value: 'stage' }
  ],
  [
    { label: 'Remote', value: 'remote' },
    { label: 'Présentiel', value: 'onsite' }
  ]
];

function onSearch(val: string) {
  alert('Recherche : ' + val);
}

function onResetFilters() {
  filters.value = [null, null];
}
</script>
