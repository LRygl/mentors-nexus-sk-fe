import { getCategories, getCategory } from '$lib/api/categoryAPI';
import type { Category } from '$lib/types/category';

class CategoryStore {
	categories = $state<Category[]>([])
	selectedCategory = $state<Category>({
		id: 0,
		name: ''
	})
	loading = $state<boolean>(false);
	error = $state<string | null>(null);

	async loadCategories() {
		this.loading = true;
		this.error = null;

		try {
			this.categories = await getCategories();
		} catch (error) {
			this.error = error instanceof Error ? error.message : error;
		} finally {
			this.loading = false;
		}
	}

	async loadCategory(id: number) {
		this.loading = true;
		this.error = null;

		try {
			this.selectedCategory = await getCategory(id);
		} catch (error) {
			this.error = error instanceof Error ? error.message : error;
		} finally {
			this.loading = false;
		}
	}

	clearSelectedCategory(id: number) {
		this.selectedCategory = { id: 0, name: ''};
	}

	async reloadData() {
		this.clearSelectedCategory();
		await this.loadCategories();
	}

}

export const categoryStore = new CategoryStore();