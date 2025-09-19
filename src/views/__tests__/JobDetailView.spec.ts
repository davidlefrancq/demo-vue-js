import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import JobDetailView from '../JobDetailView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

import { JobsService } from '@/services/JobsService'
import { CompaniesService } from '@/services/CompaniesService'
import { type CompaniesServiceMock } from '@/tests/__mocks__/CompaniesServiceMock'
import { type JobsServiceMock } from '@/tests/__mocks__/JobsServiceMock'

import type { JobType } from '@/models/Job.schema'
import type { CompanyType } from '@/models/Company.schema'
import { JobStatus } from '@/models/JobStatus'
import { JobLikeState } from '@/models/JobLikeState'

vi.mock('@/services/JobsService')
vi.mock('@/services/CompaniesService')

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
  let jobsServiceMock: JobsServiceMock
  let companiesServiceMock: CompaniesServiceMock

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/jobs/:id', name: 'job-detail', component: JobDetailView }
      ]
    })
    setActivePinia(createPinia())
    vi.clearAllMocks()
    jobsServiceMock = {
      getById: vi.fn(),
      list: vi.fn(),
    }
    companiesServiceMock = {
      getById: vi.fn(),
      list: vi.fn(),
    }
    vi.spyOn(JobsService, 'getInstance').mockReturnValue(jobsServiceMock as unknown as JobsService)
    vi.spyOn(CompaniesService, 'getInstance').mockReturnValue(companiesServiceMock as unknown as CompaniesService)
  })

  it('affiche le chargement', () => {
    jobsServiceMock.getById.mockResolvedValueOnce(null)
    const wrapper = mount(JobDetailView, {
      global: { plugins: [router, createPinia()] },
      mocks: {
        $route: { params: { id: '1' } }
      }
    })
    expect(wrapper.html()).toContain('Chargement')
  })

  it('affiche une offre trouvée', async () => {
    jobsServiceMock.getById.mockResolvedValueOnce(mockJob)
    companiesServiceMock.getById.mockResolvedValueOnce(mockCompany)
    const wrapper = mount(JobDetailView, {
      global: { plugins: [router, createPinia()] },
      mocks: {
        $route: { params: { id: '1' } }
      }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('ID du job :')
    expect(wrapper.text()).toContain('Test Company')
  })

  it('affiche le message aucune offre trouvée', async () => {
    jobsServiceMock.getById.mockResolvedValueOnce(null)
    const wrapper = mount(JobDetailView, {
      global: { plugins: [router, createPinia()] },
      mocks: {
        $route: { params: { id: '999' } }
      }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Aucune offre trouvée')
  })

  it('affiche une erreur si le service échoue', async () => {
    jobsServiceMock.getById.mockRejectedValueOnce(new Error('fail'))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(JobDetailView, {
      global: { plugins: [router, createPinia()] },
      mocks: {
        $route: { params: { id: '1' } }
      }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Aucune offre trouvée')
    errorSpy.mockRestore()
  })
})
