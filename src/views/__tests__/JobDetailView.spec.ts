
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import JobDetailView from '../JobDetailView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'

import { JobsService } from '@/services/JobsService'
import { CompaniesService } from '@/services/CompaniesService'

vi.mock('@/services/JobsService')
vi.mock('@/services/CompaniesService')

import type { JobType } from '@/models/Job.schema'
import type { CompanyType } from '@/models/Company.schema'
import { JobStatus } from '@/models/JobStatus'
import { JobLikeState } from '@/models/JobLikeState'

const mockJob: JobType = {
  id: '1',
  title: 'Développeur',
  city: 'Paris',
  companyId: 'c1',
  remote: true,
  salary: 50000,
  status: JobStatus.None,
  like: JobLikeState.None
}

const mockCompany: CompanyType = {
  id: 'c1',
  name: 'Test Company',
  location: 'Paris',
  size: 100,
  industry: 'Tech'
}

describe('JobDetailView', () => {
  let router: Router

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/jobs/:id', name: 'job-detail', component: JobDetailView }
      ]
    })
    vi.clearAllMocks()
  })

  it('affiche le chargement', () => {
    const wrapper = mount(JobDetailView, {
      global: { plugins: [router] },
      mocks: {
        $route: { params: { id: '1' } }
      }
    })
    expect(wrapper.html()).toContain('Chargement')
  })

  it('affiche une offre trouvée', async () => {
    vi.spyOn(JobsService.prototype, 'getById').mockResolvedValueOnce(mockJob)
    vi.spyOn(CompaniesService.prototype, 'getById').mockResolvedValueOnce(mockCompany)
    const wrapper = mount(JobDetailView, {
      global: { plugins: [router] },
      mocks: {
        $route: { params: { id: '1' } }
      }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('ID du job :')
    expect(wrapper.text()).toContain('Test Company')
  })

  it('affiche le message aucune offre trouvée', async () => {
    vi.spyOn(JobsService.prototype, 'getById').mockResolvedValueOnce(null)
    const wrapper = mount(JobDetailView, {
      global: { plugins: [router] },
      mocks: {
        $route: { params: { id: '999' } }
      }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Aucune offre trouvée')
  })

  it('affiche une erreur si le service échoue', async () => {
    vi.spyOn(JobsService.prototype, 'getById').mockRejectedValueOnce(new Error('fail'))
    const wrapper = mount(JobDetailView, {
      global: { plugins: [router] },
      mocks: {
        $route: { params: { id: '1' } }
      }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Aucune offre trouvée')
  })
})
