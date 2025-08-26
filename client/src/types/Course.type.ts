export interface Course {
  _id: string;
  name: string;
  course_code: string;
  description: string;
  created_by: {
    _id: string;
    email: string;
    name: string;
  };
  createdAt: string; // nên để string, API trả ISO date
  updatedAt: string;
}

export interface CoursesResponse {
  success: boolean;
  count: number;
  data: Course[];
}