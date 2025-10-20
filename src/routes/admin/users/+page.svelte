<script lang="ts">
import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
import { UserTablePreset } from '$lib/components/Data Table/Configurations/UserTableConfiguration.js';
import { userStore } from '$lib/stores/defaults/UserStore.js';
import type { TableCallbacks } from '$lib/types/ui/table';
import { onMount } from 'svelte';
import type { User } from '$lib/types/entities/User';

let selectedItems = $state<Set<string>>(new Set());

// Data table configuration
const tableConfig = UserTablePreset.all();

onMount(async () => {
	await userStore.fetchAll();
});


// Table callbacks adapted for BaseStoreSvelte
const tableCallbacks: TableCallbacks<User> = {
	onRowClick: (user) => {
		console.log(`[PAGE] Data table user row ${user.id} clicked`);
	},

	onCreate: () => {
		return;
	}

}


</script>

<!-- Main Container -->
<section class="h-dvh m-5">
	<!-- Header Section -->
	<AdminHeaderSection
		heading="Users"
		subHeading="Organize and manage your users with ease"
	/>

	<!-- Universal Data Table -->
	<UniversalDataTable
		data={userStore.data}
		loading={userStore.loading}
		error={userStore.error}
		config={tableConfig.config}
		columns={tableConfig.columns}
		callbacks={tableCallbacks}
		bind:selectedItems={selectedItems}
		getActions={tableConfig.getActions}
		{...tableConfig.props}
	/>


</section>