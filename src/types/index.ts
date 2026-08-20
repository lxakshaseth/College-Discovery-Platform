import { College, Course, Placement, Review, User } from "@prisma/client";

export type CollegeWithRelations = College & {
  courses: Course[];
  placements: Placement[];
  reviews: (Review & { user: Pick<User, "id" | "name" | "image"> })[];
  _count?: {
    reviews: number;
    savedBy: number;
  };
};

export type CollegeListItem = College & {
  placements?: Placement[];
  _count: {
    reviews: number;
    courses: number;
  };
};

export type CompareCollege = College & {
  courses: Course[];
  placements: Placement[];
  _count: {
    reviews: number;
  };
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export type SavedCollegeWithCollege = {
  id: string;
  collegeId: string;
  createdAt: Date;
  college: College;
};

export type SavedComparisonWithColleges = {
  id: string;
  name: string;
  collegeIds: string[];
  createdAt: Date;
};
