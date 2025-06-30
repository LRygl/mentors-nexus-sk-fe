import { buildApiUrl } from '$lib/config/api';
import type { Category} from '$lib/types/category';


export async function getCategories(): Promise<Category[]> {
	const response = await fetch(buildApiUrl('/category'));

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}


export async function getCategory(id: number): Promise<Category> {
	const response = await fetch(buildApiUrl(`/category/${id}`));

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
	const response = await fetch(buildApiUrl(`/category`), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(category)
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export async function updateCategory(id: number, category: Partial<Category>): Promise<Category> {
	const response = await fetch(buildApiUrl(`/category/${id}`), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(category)
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export async function deleteCategory(id: number): Promise<void> {
	const response = await fetch(buildApiUrl(`/category/${id}`), {
		method: 'DELETE'
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}