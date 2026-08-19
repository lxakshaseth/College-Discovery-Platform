import { z } from "zod";

export const collegeSearchSchema = z.object({
  q: z.string().optional(),
  state: z.string().optional(),
  type: z.enum(["PUBLIC", "PRIVATE", "DEEMED"]).optional(),
  minFees: z.coerce.number().min(0).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sortBy: z.enum(["rating", "fees", "name", "ranking"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(2000),
});

export const saveCollegeSchema = z.object({
  collegeId: z.string().min(1),
});

export const saveComparisonSchema = z.object({
  name: z.string().min(1).max(100),
  collegeIds: z.array(z.string()).min(2).max(3),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type CollegeSearchParams = z.infer<typeof collegeSearchSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SaveCollegeInput = z.infer<typeof saveCollegeSchema>;
export type SaveComparisonInput = z.infer<typeof saveComparisonSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
