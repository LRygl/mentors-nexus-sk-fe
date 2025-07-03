export interface Category {
	id: number;
	name: string;
}

export interface CategoryStoreState {
	data: Category[];
	loading: boolean;
	error: string | null;
	loaded: boolean;
}

export type CategoryListResponse = Category[];