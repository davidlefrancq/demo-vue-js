import { z } from 'zod';

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string().nonempty(),
  location: z.string(),
  size: z.number().int().nonnegative(),
  industry: z.string(),
});

export type CompanyType = z.infer<typeof CompanySchema>;
