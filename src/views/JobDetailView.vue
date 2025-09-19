<template>
  <div>
    <div v-if="loading" class="text-center py-10 text-gray-500">Chargement...</div>
    <div v-else-if="error" class="text-center py-10 text-red-500">{{ error }}</div>
    <div v-else-if="job" class="max-w-2xl mx-auto mt-8">
      <JobCard
        :job="job"
        :company="company"
      >
        <template #description>
          <div class="text-gray-700 text-base">
            <p><strong>ID du job :</strong> {{ job.id }}</p>
          </div>
        </template>
      </JobCard>
    </div>
    <div v-else class="text-center py-10 text-gray-500">Aucune offre trouvée.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { JobsService } from '@/services/JobsService'
import type { JobType } from '@/models/Job.schema'
import JobCard from '@/components/JobCard.vue'
import type { CompanyType } from '@/models/Company.schema'
import { CompaniesService } from '@/services/CompaniesService'

const route = useRoute()
const jobId = route.params.id as string

const job = ref<JobType | null>(null)
const company = ref<CompanyType | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const jobsService = new JobsService()
    const companiesService = new CompaniesService()

    job.value = await jobsService.getById(jobId)
    if (job.value) {
      company.value = await companiesService.getById(job.value.companyId)
    } else {
      error.value = "Aucune offre trouvée."
    }
  } catch {
    error.value = "Aucune offre trouvée."
    job.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.max-w-2xl {
  max-width: 42rem;
}
</style>
