export interface Course {
	id: string;
	name: string;
	status: "pending" | "processing" | "success" | "failed";
	uuid: string;
	price: number;
}

// For paginated API responses
export interface CourseListResponse {
	data: Course[];
	total: number;
	page: number;
	pageSize: number;
}

// For API request parameters
export interface CourseListParams {
	page?: number;
	pageSize?: number;
	search?: string;
	status?: Course['status'];
	sortBy?: keyof Course;
	sortOrder?: 'asc' | 'desc';
}