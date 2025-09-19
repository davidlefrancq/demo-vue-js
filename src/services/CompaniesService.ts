import { CompanyRepository } from '@/repositories/CompanyRepository'
import type { CompanyType } from '@/models/Company.schema'

export class CompaniesService {
  private repo = new CompanyRepository()

  // Retourne la liste de toutes les sociétés
  async list(): Promise<CompanyType[]> {
    return await this.repo.list()
  }

  // Retourne une société par son id
  async getById(id: string): Promise<CompanyType | null> {
    try {
      return await this.repo.getById(id)
    } catch {
      return null
    }
  }
}
