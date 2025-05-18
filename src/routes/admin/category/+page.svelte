<script lang="ts">
	import type { CourseCategory} from '$lib/types/courseCategory';
	import type { PageProps } from '../../../../.svelte-kit/types/src/routes/admin/category/$types';
	import { invalidate, invalidateAll } from '$app/navigation';

	let { data }: PageProps = $props();

	let name = '';

	const handleSubmit = async () => {
		const response = await fetch('http://localhost:8080/api/v1/category', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name
			})
		});

		if (response.ok) {
			console.log('Category created');
			await invalidateAll();
			name = '';
		} else {
			console.error('Failed to create category');
		}
	};

</script>

<h1>Course Category</h1>

{#if data.category.length > 0}
	<ul>
		{#each data.category as category}
			<li>
				<strong>{category.name}</strong> <br />
				UUID: {category.uuid} <br />
				Created: {new Date(category.created).toLocaleString()} <br />
				Updated: {new Date(category.updated).toLocaleString()}
			</li>
		{/each}
	</ul>
{:else}
	<p>No categories found.</p>
{/if}


<form onsubmit={handleSubmit}>
	<div>
		<label for="name">Name:</label>
		<input id="name" bind:value={name} required />
	</div>
	<button type="submit">Add Category</button>
</form>
