<script lang="ts">
	import { onMount } from 'svelte';
	import { users } from '$lib/stores/user-store';
	import DataTable from '$lib/components/data-table.svelte';
	import DataTableAsyncWrapper from '$lib/components/data-table-async-wrapper.svelte';
	import { currentLanguage } from '$lib/stores/internalization-store';
	import { userColumns } from './user-columns';

	onMount(() => {
		loadUsers();
	});

	async function loadUsers() {
		await users.load();
	}

	async function reloadUsers() {
		await users.load(true);
	}

</script>

<!-- For users -->
<DataTableAsyncWrapper
	errorKey="errors.loading_users"
	loadingKey="loading.users"
	onRetry={loadUsers}
	store={$users}
>
	{#snippet children()}
		{#key $currentLanguage}
			<DataTable
				columns={$userColumns}
				data={$users.data}
				loading={$users.loading}
				loadTableData={reloadUsers}
			/>
		{/key}
	{/snippet}
</DataTableAsyncWrapper>