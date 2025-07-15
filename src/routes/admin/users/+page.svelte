<script lang="ts">
	import { onMount } from 'svelte';
	import { users } from '$lib/stores/user-store';
	import DataTable from '$lib/components/data-table.svelte';
	import LanguageSwitcher from '$lib/components/language-switcher.svelte';
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