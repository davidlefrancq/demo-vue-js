export enum JobStatus {
  None = 'None',
  // Application sent
  Applied = 'Applied',
  // Company response
  UnderReview = 'UnderReview',
  Shortlisted = 'Shortlisted',
  Rejected = 'Rejected',
  // Recruitment process
  InterviewPlanned = 'InterviewPlanned',
  InterviewDone = 'InterviewDone',
  InterviewCanceled = 'InterviewCanceled',
  OfferMade = 'OfferMade',
  Negotiation = 'Negotiation',
  OfferAccepted = 'OfferAccepted',
  OfferDeclined = 'OfferDeclined',
  // Closure
  Hired = 'Hired',
}
