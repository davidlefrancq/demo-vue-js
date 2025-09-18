export class JobRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JobRepositoryError';
  }
}

export class GetAllJobsError extends JobRepositoryError {
  constructor() {
    super('Failed to retrieve all jobs.');
    this.name = 'GetAllJobsError';
  }
}

export class GetJobByIdError extends JobRepositoryError {
  constructor() {
    super('Failed to retrieve job by id.');
    this.name = 'GetJobByIdError';
  }
}

export class UpdateJobError extends JobRepositoryError {
  constructor() {
    super('Failed to update job.');
    this.name = 'UpdateJobError';
  }
}
