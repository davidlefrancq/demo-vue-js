import type { MockInstance } from 'vitest'
import type { CompanyType } from "@/models/Company.schema"

export type CompaniesServiceMock = {
  getById: MockInstance<(id: string) => Promise<CompanyType | null>>
  list: MockInstance<() => Promise<CompanyType[]>>
}
