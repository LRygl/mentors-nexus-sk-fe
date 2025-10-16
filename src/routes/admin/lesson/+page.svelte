<script lang="ts">
	import { userStore } from '$lib/stores/defaults/UserStore.js';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import { onMount } from 'svelte';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import { LessonTablePreset } from '$lib/components/Data Table/Configurations/LessonTableConfiguration';
	import { lessonStore } from '$lib/stores/defaults/LessonStore';

	let selectedItems = $state<Set<string>>(new Set());

	const tableConfig = LessonTablePreset.all();

	onMount(async () => {
		await lessonStore.fetchAll();
	});

	const tableCallbacks: TableCallbacks<Lesson> = {
		onRowClick: (lesson) => {
			console.log(`[PAGE] Data table user row ${lesson.id} clicked`);
		},

		onCreate: () => {
			return;
		}
	};

</script>





<!-- Main Container -->
<section class="h-dvh m-5">
	<!-- Header Section -->
	<AdminHeaderSection
		heading="Terminals"
		subHeading="Organize and manage your users with ease"
	/>

	<!-- Universal Data Table -->
	<UniversalDataTable
		data={lessonStore.data}
		loading={lessonStore.loading}
		error={lessonStore.error}
		config={tableConfig.config}
		columns={tableConfig.columns}
		callbacks={tableCallbacks}
		bind:selectedItems={selectedItems}
		getActions={tableConfig.getActions}
		{...tableConfig.props}
	/>


</section>