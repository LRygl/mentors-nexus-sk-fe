<script lang="ts">
	import { categoryStore } from '$lib/stores/categoryStore.svelte';
	import { createCategory, updateCategory } from '$lib/api/categoryAPI';

	async function handleSubmit(event: Event) {
		event.preventDefault();
		try {
			if(categoryStore.selectedCategory.id === 0) {
				await createCategory({ name: categoryStore.selectedCategory.name});
				console.log("Creating new category");
			} else {
				await updateCategory(categoryStore.selectedCategory.id, { name: categoryStore.selectedCategory.name })
				console.log("Updating existing category");
			}

			await categoryStore.reloadData();
		} catch (error) {
			console.error('Failed to save category: ', error);
		}
	}

</script>

<form onsubmit={handleSubmit}>
	<label for="id">ID</label>
	<input id="id" type="text" bind:value={categoryStore.selectedCategory.id} readonly />

	<label for="name">Name</label>
	<input id="name" type="text" bind:value={categoryStore.selectedCategory.name} required />

	<button type="submit">
		{categoryStore.selectedCategory.id === 0 ? 'Create' : 'Update'}
	</button>

	<button type="button" onclick={() => categoryStore.clearSelectedCategory()}>
		Clear
	</button>
</form>