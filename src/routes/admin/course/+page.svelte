<script lang="ts">
	import { onMount } from 'svelte';
	import { CourseTablePreset } from '$lib/components/Data Table/Configurations/CourseTableConfiguration';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import { courseStore } from '$lib/stores/defaults/CourseStore';

	let selectedItems = $state<Set<string>>(new Set);

	const tableConfig = CourseTablePreset.all();

	onMount(async () => {
		await courseStore.fetchAll()
	})

	const tableCallbacks: TableCallbacks<Course> = {
		onRowClick: (course) => {
			console.log(`[PAGE] Data table user row ${course.id} clicked`);
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
		heading="Stations"
		subHeading="Organize and manage your users with ease"
	/>

	<!-- Universal Data Table -->
	<UniversalDataTable
		data={courseStore.data}
		loading={courseStore.loading}
		error={courseStore.error}
		config={tableConfig.config}
		columns={tableConfig.columns}
		callbacks={tableCallbacks}
		bind:selectedItems={selectedItems}
		getActions={tableConfig.getActions}
		{...tableConfig.props}
	/>


</section>