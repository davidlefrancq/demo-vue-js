
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import JobsListView from '../JobsListView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

import { JobsService } from '@/services/JobsService'
import { CompaniesService } from '@/services/CompaniesService'

import type { JobType } from '@/models/Job.schema'
import type { CompanyType } from '@/models/Company.schema'
import { JobStatus } from '@/models/JobStatus'
import { JobLikeState } from '@/models/JobLikeState'
import type { JobsServiceMock } from '@/tests/__mocks__/JobsServiceMock'
import type { CompaniesServiceMock } from '@/tests/__mocks__/CompaniesServiceMock'

vi.mock('@/services/JobsService')
vi.mock('@/services/CompaniesService')

const mockJobs: JobType[] = [
  {
    id: '1',
    title: 'Développeur',
    city: 'Paris',
    companyId: 'c1',
    remote: true,
    salary: 50000,
    status: JobStatus.None,
    like: JobLikeState.None
  },
  {
    id: '2',
    title: 'Designer',
    city: 'Lyon',
    companyId: 'c2',
    remote: false,
    salary: 40000,
    status: JobStatus.None,
    like: JobLikeState.Liked
  }
]

const mockCompanies: CompanyType[] = [
  {
    id: 'c1',
    name: 'Test Company',
    location: 'Paris',
    size: 100,
    industry: 'Tech'
  },
  {
    id: 'c2',
    name: 'Design Corp',
    location: 'Lyon',
    size: 50,
    industry: 'Design'
  }
]

describe('JobsListView', () => {
  let router: Router
  let jobsServiceMock: JobsServiceMock
  let companiesServiceMock: CompaniesServiceMock

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/jobs', name: 'jobs-list', component: JobsListView }
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

  it('affiche la liste des offres', async () => {
    jobsServiceMock.list.mockResolvedValueOnce(mockJobs)
    companiesServiceMock.list.mockResolvedValueOnce(mockCompanies)
    const wrapper = mount(JobsListView, {
      global: { plugins: [router, createPinia()] }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Développeur')
    expect(wrapper.text()).toContain('Designer')
    expect(wrapper.text()).toContain('Test Company')
    expect(wrapper.text()).toContain('Design Corp')
  })

  it('affiche le message aucune offre si vide', async () => {
    jobsServiceMock.list.mockResolvedValueOnce([])
    companiesServiceMock.list.mockResolvedValueOnce(mockCompanies)
    const wrapper = mount(JobsListView, {
      global: { plugins: [router, createPinia()] }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Aucune offre ne correspond')
  })

  it('filtre par recherche', async () => {
    jobsServiceMock.list.mockResolvedValueOnce(mockJobs)
    companiesServiceMock.list.mockResolvedValueOnce(mockCompanies)
    const wrapper = mount(JobsListView, {
      global: { plugins: [router, createPinia()] }
    })
    await flushPromises()
    // Simule la recherche "Designer"
    await wrapper.find('input').setValue('Designer')
    await wrapper.find('input').trigger('input')
    await flushPromises()
    expect(wrapper.text()).toContain('Designer')
    expect(wrapper.text()).not.toContain('Développeur')
  })
})
