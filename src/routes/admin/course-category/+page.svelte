<script lang="ts">
import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
import { onMount } from 'svelte';
import type { TableCallbacks } from '$lib/types/ui/table';
import { CourseCategoryTablePreset } from '$lib/components/Data Table/Configurations/CourseCategoryTableConfiguration';
import { courseCategoryStore } from '$lib/stores/defaults/CourseCategoryStore';

	let selectedItems = $state<Set<string>>(new Set);

	const tableConfig = CourseCategoryTablePreset.all();

	onMount(async () => {
		await courseCategoryStore.fetchAll();
	});

const tableCallbacks: TableCallbacks<CourseCategory> = {
	onRowClick: (courseCategory) => {
		console.log(`[PAGE] Data table user row ${courseCategory.id} clicked`);
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
		heading="Station Category"
		subHeading="Organize and manage your users with ease"
	/>

	<!-- Universal Data Table -->
	<UniversalDataTable
		data={courseCategoryStore.data}
		loading={courseCategoryStore.loading}
		error={courseCategoryStore.error}
		config={tableConfig.config}
		columns={tableConfig.columns}
		callbacks={tableCallbacks}
		bind:selectedItems={selectedItems}
		getActions={tableConfig.getActions}
		{...tableConfig.props}
	/>


</section>