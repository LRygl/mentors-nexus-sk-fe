<script lang="ts">
	import { categoryStore } from '$lib/stores/category-store.js';
	import { deleteCategory } from '$lib/api/CourseCategoryAdminAPI'

	async function handleEdit(id: number) {
		await categoryStore.loadCategory(id);
	}

	async function handleDelete(id: number) {
		if (confirm('Are you sure you want to delete this category?')) {
			try {
				await deleteCategory(id);
				await categoryStore.reloadData();
			} catch (error) {
				console.error('Failed to delete category:', error);
			}
		}
	}
</script>

{#if categoryStore.loading}
	<p>Loading...</p>
{:else if categoryStore.error}
	<p class="error">{categoryStore.error}</p>
{:else}
	<ul>
		{#each categoryStore.categories as category (category.id)}
			<li>
				{category.name}
				<button onclick={() => handleEdit(category.id)}>Edit</button>
				<button onclick={() => handleDelete(category.id)}>Delete</button>
			</li>
		{/each}
	</ul>
{/if}
