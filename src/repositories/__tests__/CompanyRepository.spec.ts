import { describe, it, expect, beforeEach } from 'vitest';
import { CompanyRepository } from '../CompanyRepository';
import { GetAllCompaniesError, GetCompanyByIdError, UpdateCompanyError } from '../errors/CompanyRepositoryError';
import companiesSeed from '../../data/companies.seed.json';

const validId = companiesSeed[0].id;
const invalidId = 'not-found-id';
const createRepo = () => new CompanyRepository();

describe('CompanyRepository', () => {
  let repo: CompanyRepository;
  beforeEach(() => {
    repo = createRepo();
  });

  it('list() returns all companies', async () => {
    const companies = await repo.list();
    expect(Array.isArray(companies)).toBe(true);
    expect(companies.length).toBe(companiesSeed.length);
    expect(companies[0]).toHaveProperty('id');
    expect(companies[0]).toHaveProperty('name');
  });

  it('getById() returns a company by id', async () => {
    const company = await repo.getById(validId);
    expect(company).toBeDefined();
    expect(company.id).toBe(validId);
  });

  it('getById() throws if id not found', async () => {
    await expect(repo.getById(invalidId)).rejects.toThrow(GetCompanyByIdError);
  });

  it('updatePartial() updates a company field', async () => {
    const newName = 'Updated Name';
    const updated = await repo.updatePartial(validId, { name: newName });
    expect(updated.name).toBe(newName);
    const fetched = await repo.getById(validId);
    expect(fetched.name).toBe(newName);
  });

  it('updatePartial() throws if id not found', async () => {
    await expect(repo.updatePartial(invalidId, { name: 'X' })).rejects.toThrow(UpdateCompanyError);
  });

  it('updatePartial() throws if update is empty', async () => {
    await expect(repo.updatePartial(validId, {})).rejects.toThrow(UpdateCompanyError);
  });

  it('list() throws GetAllCompaniesError on internal error', async () => {
    // Simulate internal corruption
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    repo.companies = null;
    await expect(repo.list()).rejects.toThrow(GetAllCompaniesError);
  });
});
