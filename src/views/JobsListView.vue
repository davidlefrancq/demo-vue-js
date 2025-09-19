<template>
  <div class="jobs-list-page">
    <h1 class="text-2xl font-bold mb-6">Liste des offres d'emploi</h1>
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <SearchBar v-model="search" placeholder="Rechercher un poste, une ville..." @search="onSearch" />
      <FilterBar
        v-model="selectedFilters"
        :filters="filterOptions"
        @update:modelValue="onFilterChange"
        @reset="onResetFilters"
      />
    </div>
    <div v-if="filteredJobs.length === 0" class="text-gray-500 text-center py-10">
      Aucune offre ne correspond à votre recherche.
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <JobCard
        v-for="job in filteredJobs"
        :key="job.id"
        :job="job"
        :company="getCompany(job.companyId)"
        :companyLogo="getCompanyLogo(job.companyId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import FilterBar from '@/components/FilterBar.vue';
import JobCard from '@/components/JobCard.vue';
import { JobRepository } from '@/repositories/JobRepository';
import { CompanyRepository } from '@/repositories/CompanyRepository';
import type { JobType } from '@/models/Job.schema';
import type { CompanyType } from '@/models/Company.schema';

const jobRepo = new JobRepository();
const companyRepo = new CompanyRepository();

const jobs = ref<JobType[]>([]);
const companies = ref<CompanyType[]>([]);
const search = ref('');
const selectedFilters = ref<(string | number | null)[]>([null, null]);

// Préparer les options de filtres (ville, remote)
const filterOptions = computed(() => [
  // Ville
  [
    { label: 'Toutes les villes', value: null },
    ...Array.from(new Set(jobs.value.map(j => j.city))).map(city => ({ label: city, value: city }))
  ],
  // Remote
  [
    { label: 'Tous les modes', value: null },
    { label: 'Remote', value: 'remote' },
    { label: 'Sur site', value: 'onsite' }
  ]
]);

const filteredJobs = computed(() => {
  let result = jobs.value;
  // Filtre recherche
  if (search.value.trim()) {
    const s = search.value.trim().toLowerCase();
    result = result.filter(j =>
      j.title.toLowerCase().includes(s) ||
      j.city.toLowerCase().includes(s)
    );
  }
  // Filtres
  const [city, remote] = selectedFilters.value;
  if (city) {
    result = result.filter(j => j.city === city);
  }
  if (remote === 'remote') {
    result = result.filter(j => j.remote === true);
  } else if (remote === 'onsite') {
    result = result.filter(j => j.remote === false);
  }
  return result;
});

function getCompany(companyId: string): CompanyType | null {
  return companies.value.find(c => c.id === companyId) || null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCompanyLogo(companyId: string): string | undefined {
  // Placeholder: on pourrait utiliser une vraie URL/logo si disponible
  return undefined;
}

function onSearch() {
  // Optionnel : logique supplémentaire lors de la recherche
}

function onFilterChange(val: (string | number | null)[]) {
  selectedFilters.value = val;
}

function onResetFilters() {
  selectedFilters.value = [null, null];
}

onMounted(async () => {
  jobs.value = await jobRepo.list();
  companies.value = await companyRepo.list();
});
</script>

<style scoped>
.jobs-list-page {
  padding: 2rem;
}
</style>
