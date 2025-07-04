<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { LoaderCircle, RefreshCw } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { companies } from '$lib/stores/company-store';
	import DataTable from '$lib/components/data-table.svelte';
	import { columns } from './columns';

	onMount(() => {	loadCategories(); })
	async function loadCategories() {	await companies.load(); }
	async function reloadCategories() {	await companies.load(true); }

</script>

<div class="pb-2">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Application Companies</h1>
			<p class="text-muted-foreground text-sm">Showing X of Y</p>
		</div>
		<div class="flex gap-2">
			<Button
				variant="outline"
				onclick={reloadCategories}
				disabled={$companies.loading}
			>
				{#if $companies.loading}
					<LoaderCircle class="w-4 h-4 animate-spin" />
				{:else}
					<RefreshCw class="w-4 h-4" />
				{/if}
			</Button>
		</div>
	</div>
</div>

{#if $companies.error}
	<div class="rounded-md border p-8 text-center">
		<div class="text-red-500 mb-2">⚠️ Error loading courses</div>
		<div class="text-sm text-muted-foreground mb-4">{$companies.error}</div>
		<Button variant="outline" onclick={loadCategories} disabled={$companies.loading}>
			{#if $companies.loading}
				<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
				Retrying...
			{:else}
				<RefreshCw class="w-4 h-4 mr-2" />
				Try Again
			{/if}
		</Button>
	</div>
{:else}
	<DataTable {columns} data={$companies.data} loading={$companies.loading} />
{/if}