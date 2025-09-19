import { CompanyRepository } from '@/repositories/CompanyRepository'
import type { CompanyType } from '@/models/Company.schema'

export class CompaniesService {
  private static instance: CompaniesService | null = null;
  private repo = new CompanyRepository()

  public static getInstance(): CompaniesService {
    if (CompaniesService.instance === null) {
      CompaniesService.instance = new CompaniesService();
    }
    return CompaniesService.instance;
  }

  // Retourne la liste de toutes les sociétés
  public async list(): Promise<CompanyType[]> {
    return await this.repo.list()
  }

  // Retourne une société par son id
  public async getById(id: string): Promise<CompanyType | null> {
    try {
      return await this.repo.getById(id)
    } catch {
      return null
    }
  }
}
