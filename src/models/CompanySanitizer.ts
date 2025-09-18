import sanitizeHtml from 'sanitize-html';
import type { CompanyType } from './Company.schema';

const SANITIZE_STRICT_CONFIG = { allowedTags: [], allowedAttributes: {} };

export class CompanySanitizer {

  static partialSanitize(data: Partial<CompanyType>): Partial<CompanyType> {
    const dataSanitized: Partial<CompanyType> = {
  id: data.id ? sanitizeHtml(data.id, SANITIZE_STRICT_CONFIG) : undefined,
  name: data.name ? sanitizeHtml(data.name, SANITIZE_STRICT_CONFIG) : undefined,
  location: data.location ? sanitizeHtml(data.location, SANITIZE_STRICT_CONFIG) : undefined,
  size: typeof data.size === 'number' ? data.size : undefined, // Ensure size is a number
  industry: data.industry ? sanitizeHtml(data.industry, SANITIZE_STRICT_CONFIG) : undefined,
    };
    return dataSanitized;
  }

  static sanitize(data: CompanyType): CompanyType {
    const dataSanitized = this.partialSanitize(data);
    return {
      id: dataSanitized.id || '',
      name: dataSanitized.name || '',
      location: dataSanitized.location || '',
      size: dataSanitized.size || 0,
      industry: dataSanitized.industry || '',
    };
  }
}
