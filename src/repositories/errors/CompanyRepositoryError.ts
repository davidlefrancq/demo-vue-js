export class CompanyRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompanyRepositoryError';
  }
}

export class GetAllCompaniesError extends CompanyRepositoryError {
  constructor() {
    super('Failed to retrieve all companies.');
    this.name = 'GetAllCompaniesError';
  }
}

export class GetCompanyByIdError extends CompanyRepositoryError {
  constructor() {
    super('Failed to retrieve company by id.');
    this.name = 'GetCompanyByIdError';
  }
}

export class UpdateCompanyError extends CompanyRepositoryError {
  constructor() {
    super('Failed to update company.');
    this.name = 'UpdateCompanyError';
  }
}
