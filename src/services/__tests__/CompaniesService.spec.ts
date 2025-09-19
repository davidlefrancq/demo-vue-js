import { describe, it, expect, beforeEach } from 'vitest'
import { CompaniesService } from '../CompaniesService'
import companiesSeed from '../../data/companies.seed.json'

describe('CompaniesService', () => {
  let service: CompaniesService

  beforeEach(() => {
    service = new CompaniesService()
  })

  it('list() retourne toutes les sociétés', async () => {
    const companies = await service.list()
    expect(companies).toHaveLength(companiesSeed.length)
    expect(companies[0]).toHaveProperty('id')
    expect(companies[0]).toHaveProperty('name')
  })

  it('getById() retourne la bonne société', async () => {
    const company = await service.getById('1')
    expect(company).not.toBeNull()
    expect(company?.name).toBe(companiesSeed[0].name)
  })

  it('getById() retourne null si id inconnu', async () => {
    const company = await service.getById('does-not-exist')
    expect(company).toBeNull()
  })
})
