<script lang="ts">
	import type { PageProps } from '../../../../.svelte-kit/types/src/routes/admin/category/$types';
	import { invalidateAll } from '$app/navigation';
	import { formatDateTime} from '$lib/components/utils/dateTimeFormat';
	import AntDesignEditOutlined from '~icons/ant-design/edit-outlined';
	import AntDesignDeleteOutlined from '~icons/ant-design/delete-outlined';
	import AntDesignProfileOutlined from '~icons/ant-design/profile-outlined';
	import AntDesignHistoryOutlined from '~icons/ant-design/history-outlined';
	let { data }: PageProps = $props();

	let name = '';

	let selectedCategory = $state<{
		id: number;
		name: string
	}>({
		id: 0,
		name: ''
	});

	async function loadPageDataFrame() {
		try {
			const response = await fetch('http://localhost:8080/api/v1/category')
		}
	}

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

	async function  handleDetailsDialog(id: number) {
		console.log("Showing category Id" + id);
		try{
			const response = await fetch(`http://localhost:8080/api/v1/category/${id}`);
			if (!response.ok) {
				console.error('Failed to create category');
			}

			selectedCategory = await response.json();
			console.log('Category loaded', selectedCategory);
		} catch (error) {
			console.error('Failed to load category:', error);
			throw error;
		}
	}

	async function handleUpdate(event: Event){
		event.preventDefault();

		const response = await fetch(`http://localhost:8080/api/v1/category/${selectedCategory.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(selectedCategory)
		});

		if(response.ok) {
			console.log('Category updated sucessfully')
		} else {
			console.error('Failed to update category')
		}
	}

</script>

<h1 class="text-4xl font-bold accent-nexus-primary">Category</h1>


{#if data && data.category.length > 0}
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="w-full text-sm text-left rtl:text-right text-nexus-primary-800 border border-nexus-dark-100">
			<thead class="text-xs uppercase bg-nexus-primary text-nexus-primary-80">
			<tr class="">
				<th scope="col" class="px-6 py-3">Id</th>
				<th scope="col" class="px-6 py-3">Category Name</th>
				<th scope="col" class="px-6 py-3">Category Created</th>
				<th scope="col" class="px-6 py-3">Courses</th>
				<th scope="col" class="px-6 py-3">Action</th>
			</tr>
			</thead>
			<tbody>
			{#each data.category as category}
				<tr>
					<td class="px-6 py-3">{category.id}</td>
					<th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
						{category.name}
						<div class="ps-3">
							<div class="text-base font-semibold text-nexus-primary-600"></div>
							<div class="font-normal text-gray-500"></div>
						</div>
					</th>
					<td class="px-6 py-3">{formatDateTime(category.created)}</td>
					<td class="px-6 py-3">
					</td>
					<td class="px-6 py-3">
						<div class="inline-flex rounded-md shadow-sm" role="group">

							<button type="button" class="group inline-flex items-center px-3 py-2.25 text-sm border border-gray-300 rounded-s-lg cursor-pointer">
								<AntDesignEditOutlined class="group-hover:text-nexus-secondary"/>
							</button>
							<button type="button" onclick={() => handleDetailsDialog(category.id)} class="group inline-flex items-center px-3 py-2 text-sm border border-gray-300 cursor-pointer">
								<AntDesignProfileOutlined class="group-hover:text-nexus-secondary"/>
							</button>
							<button type="button" class="group inline-flex items-center px-3 py-2 text-sm border border-gray-300 cursor-pointer">
								<AntDesignHistoryOutlined class="group-hover:text-nexus-secondary"/>
							</button>
							<button type="button" class="group inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-e-lg cursor-pointer">
								<AntDesignDeleteOutlined class="group-hover:text-nexus-secondary"/>
							</button>

						</div>
					</td>
				</tr>
			{/each}
			</tbody>
		</table>

	</div>


{:else}
	<p>No users available.</p>
{/if}

Create Dialog
<form class="pt-5" onsubmit={handleSubmit}>
	<div>
		<label for="name">Name:</label>
		<input id="name" bind:value={name} required />
	</div>
	<button class="btn-primary mt-4" type="submit">Add Category</button>
</form>


edit dialog

<!-- Edit dialog -->
<form onsubmit={handleUpdate}>
	<label for="id">ID</label>
	<input id="id" type="text" bind:value={selectedCategory.id} readonly />

	<label for="name">Name</label>
	<input id="name" type="text" bind:value={selectedCategory.name} />

	<button class="btn-primary" type="submit">UPDATE</button>
</form>