import companiesSeed from '../data/companies.seed.json';
import { CompanySchema } from '@/models/Company.schema';
import type { CompanyType } from '@/models/Company.schema';
import { GetAllCompaniesError, GetCompanyByIdError, UpdateCompanyError } from './errors/CompanyRepositoryError';
import { CompanySanitizer } from '@/models/CompanySanitizer';

export class CompanyRepository {
  private companies: CompanyType[];

  constructor() {
    // Initialize the in-memory companies array
    this.companies = CompanySchema.array().parse(
      (companiesSeed as unknown as CompanyType[]).map(c => CompanySanitizer.sanitize(c))
    );
  }

  /**
   * Returns the complete list of companies
   * @throws {GetAllCompaniesError} If an unexpected error occurs
   */
  async list(): Promise<CompanyType[]> {
    try {
      return this.companies.map((c) => CompanySchema.parse(c));
    } catch {
      throw new GetAllCompaniesError();
    }
  }

  /**
   * Returns a company by its id
   * @param id Id of the company
   * @throws {GetCompanyByIdError} If id is missing, not found, or validation fails
   */
  async getById(id: string): Promise<CompanyType> {
    if (!id) throw new GetCompanyByIdError();

    const company = this.companies.find(c => c.id === id);
    if (!company) throw new GetCompanyByIdError();

    try {
      return CompanySchema.parse(company);
    } catch {
      throw new GetCompanyByIdError();
    }
  }

  /**
   * Partially updates a company (shallow merge)
   * @param id Id of the company
   * @param update Partial fields to update
   * @throws {UpdateCompanyError} If id or update is missing, not found, or validation fails
   */
  async updatePartial(id: string, update: Partial<CompanyType>): Promise<CompanyType> {
    if (!id) throw new UpdateCompanyError();
    if (!update || Object.keys(update).length === 0) throw new UpdateCompanyError();

    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) throw new UpdateCompanyError();

    try {
      const merged = { ...this.companies[index], ...update };
      const sanitized = CompanySanitizer.sanitize(merged);
      const validated = CompanySchema.parse(sanitized);
      this.companies[index] = validated;
      return validated;
    } catch {
      throw new UpdateCompanyError();
    }
  }
}
