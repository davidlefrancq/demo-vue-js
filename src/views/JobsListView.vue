<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Liste des offres d'emploi</h1>
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <SearchBar v-model="search" placeholder="Rechercher un poste, une ville..." />
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
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        @click="goToJobDetail(job.id)"
        class="cursor-pointer hover:scale-[1.01] transition-transform"
      >
        <JobCard
          :job="job"
          :company="getCompany(job.companyId)"
          :companyLogo="undefined"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from '@/components/SearchBar.vue';
import FilterBar from '@/components/FilterBar.vue';
import JobCard from '@/components/JobCard.vue';
import type { JobType } from '@/models/Job.schema';
import type { CompanyType } from '@/models/Company.schema';
import { JobsService } from '@/services/JobsService';
import { CompaniesService } from '@/services/CompaniesService';

/** Job detail open function */
const router = useRouter();
function goToJobDetail(jobId: string) {
  router.push({ name: 'job-detail', params: { id: jobId } });
}

/** Job list functions */
// Repositories
const jobsService = JobsService.getInstance();
const companiesService = CompaniesService.getInstance()

// State
const jobs = ref<JobType[]>([]);
const companies = ref<CompanyType[]>([]);
const search = ref('');
const selectedFilters = ref<(string | number | null)[]>([null, null]);

// Prepare filter options (city, remote)
const filterOptions = computed(() => [
  // City
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

// Computed filtered jobs
const filteredJobs = computed(() => {
  let result = jobs.value;
  // Search filter
  if (search.value.trim()) {
    const s = search.value.trim().toLowerCase();
    result = result.filter(j =>
      j.title.toLowerCase().includes(s) ||
      j.city.toLowerCase().includes(s)
    );
  }
  // Filters
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

// Helper to get company by ID
function getCompany(companyId: string): CompanyType | null {
  return companies.value.find(c => c.id === companyId) || null;
}

// Handlers
function onFilterChange(val: (string | number | null)[]) {
  selectedFilters.value = val;
}

function onResetFilters() {
  selectedFilters.value = [null, null];
}

onMounted(async () => {
  jobs.value = await jobsService.list();
  companies.value = await companiesService.list();
});
</script>
