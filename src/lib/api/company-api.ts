import type { CompanyListResponse } from '$lib/types/company';
import { buildApiUrl } from '$lib/config/api';

export async function getAllCompanies(): Promise<CompanyListResponse> {
	try {
		const response = await fetch(buildApiUrl(`/company/all`),{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch companies: ${response.status} ${response.statusText}`);
		}
		return await response.json();
	} catch (error) {
		console.error('CourseAPI.getCourses error:', error);
		throw new Error(
			error instanceof Error
				? error.message
				: 'An unexpected error occurred while fetching courses'
		);
	}
}