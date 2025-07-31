<script lang="ts">
	import { onMount } from 'svelte';
	import { categories } from '$lib/stores/category-store';
	import { columns } from './columns';
	import DataTable from '$lib/components/data-table.svelte';

	onMount(() => {	loadCategories(); })
	async function loadCategories() {	await categories.load(); }
	async function reloadCategories() {	await categories.load(true); }

</script>

<div class="pb-2">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Application Categories</h1>
			<p class="text-muted-foreground text-sm">Showing X of Y</p>
		</div>
		<div class="flex gap-2">

		</div>
	</div>
</div>

{#if $categories.error}
	<div class="rounded-md border p-8 text-center">
		<div class="text-red-500 mb-2">⚠️ Error loading courses</div>
		<div class="text-sm text-muted-foreground mb-4">{$categories.error}</div>
	</div>
{:else}
	<DataTable {columns}
						 data={$categories.data}
						 loading={$categories.loading}
						 loadTableData={reloadCategories}
	/>
{/if}