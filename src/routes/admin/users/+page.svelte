<script lang="ts">
	import { onMount } from 'svelte';
	import { users } from '$lib/stores/user-store';
	import { columns } from './columns';
	import { Button } from '$lib/components/ui/button';
	import DataTable from '$lib/components/data-table.svelte';
	import { RefreshCw, LoaderCircle, TriangleAlert } from 'lucide-svelte';
	import LanguageSwitcher from '$lib/components/language-switcher.svelte';
	import DataTableAsyncWrapper from '$lib/components/data-table-async-wrapper.svelte';

	onMount(() => {	loadUsers(); });
	async function loadUsers() { await users.load(); }
	async function reloadUsers() { await users.load(true); }

</script>
<!-- Language switcher in your header/nav -->

<div class="pb-2">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Application Users</h1>
			<p class="text-muted-foreground text-sm">Showing X of Y</p>
		</div>
		<div class="flex gap-2">
			<div class="flex justify-end p-4">
				<LanguageSwitcher />
			</div>

		</div>
	</div>
</div>

<!-- For users -->
<DataTableAsyncWrapper
	store={$users}
	errorKey="errors.loading_users"
	loadingKey="loading.users"
	onRetry={loadUsers}
>
	{#snippet children()}
		<DataTable
			columns={columns}
			data={$users.data}
			loading={$users.loading}
			loadTableData={reloadUsers}
		/>
	{/snippet}
</DataTableAsyncWrapper>

<!--

{#if $users.error}
	<div class="rounded-md border p-8 text-center flex flex-col items-center">
		<div class="flex flex-col items-center mb-2">
			<div><TriangleAlert color="red" size={48} /></div>
			<h1 class="text-2xl font-extrabold">Error loading courses</h1>
		</div>
		<div class="text-sm text-muted-foreground mb-4">{$users.error}</div>
		<Button variant="default" onclick={loadUsers} disabled={$users.loading}>
			{#if $users.loading}
				<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
				Retrying...
			{:else}
				<RefreshCw class="w-4 h-4 mr-2" />
				Try Again
			{/if}
		</Button>
	</div>
{:else if $users.loading}

	<div class="rounded-md border p-8 text-center">
		<LoaderCircle class="w-6 h-6 mx-auto mb-2 animate-spin" />
		<div class="text-sm text-muted-foreground">Loading users...</div>
	</div>
{:else}
	<DataTable columns={columns}
						 data={$users.data}
						 loading={$users.loading}
						 loadTableData={reloadUsers}
	/>
{/if}

-->