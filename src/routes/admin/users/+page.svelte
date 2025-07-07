<script lang="ts">
	import { onMount } from 'svelte';
	import { users } from '$lib/stores/user-store';
	import { columns } from './columns';
	import { Button } from '$lib/components/ui/button';
	import DataTable from '$lib/components/data-table.svelte';
	import { RefreshCw, LoaderCircle } from 'lucide-svelte';

	onMount(() => {	loadUsers(); });
	async function loadUsers() { await users.load(); }
	async function reloadUsers() { await users.load(true); }

</script>

<div class="pb-2">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Application Users</h1>
			<p class="text-muted-foreground text-sm">Showing X of Y</p>
		</div>
		<div class="flex gap-2">

		</div>
	</div>
</div>

{#if $users.error}
	<div class="rounded-md border p-8 text-center">
		<div class="text-red-500 mb-2">⚠️ Error loading courses</div>
		<div class="text-sm text-muted-foreground mb-4">{$users.error}</div>
		<Button variant="outline" onclick={loadUsers} disabled={$users.loading}>
			{#if $users.loading}
				<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
				Retrying...
			{:else}
				<RefreshCw class="w-4 h-4 mr-2" />
				Try Again
			{/if}
		</Button>
	</div>
{:else}
	<DataTable columns={columns}
						 data={$users.data}
						 loading={$users.loading}
						 loadTableData={reloadUsers}

	/>
{/if}
