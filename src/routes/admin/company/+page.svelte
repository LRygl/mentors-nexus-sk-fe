<script lang="ts">
	import { onMount } from 'svelte';
	import { companies } from '$lib/stores/company-store';
	import DataTable from '$lib/components/data-table.svelte';
	import { columns } from './columns';
	import DataTableAsyncWrapper from '$lib/components/data-table-async-wrapper.svelte';

	onMount(() => {	loadCompanies(); })
	async function loadCompanies() {	await companies.load(); }
	async function reloadCompanies() {	await companies.load(true); }

</script>

<div class="pb-2">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Application Companies</h1>
			<p class="text-muted-foreground text-sm">Showing X of Y</p>
		</div>
	</div>
</div>

<!-- Create Companies Data Table -->
<DataTableAsyncWrapper
	store={$companies}
	errorKey="errors.loading_companies"
	loadingKey="loading.companies"
	onRetry={loadCompanies}
>
	{#snippet children()}
	<DataTable
		columns={columns}
		data={$companies.data}
		loading={$companies.loading}
		loadTableData={reloadCompanies}
	/>
	{/snippet}
</DataTableAsyncWrapper>
