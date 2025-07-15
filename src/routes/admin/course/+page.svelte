<script lang="ts">
import DataTable from '$lib/components/data-table.svelte'
import type { CourseResponse } from '$lib/types/course';
import { courses } from '$lib/stores/course-store';
import { courseColumns } from './course-columns';
import { onMount } from 'svelte';
import DataTableAsyncWrapper from '$lib/components/data-table-async-wrapper.svelte';
import { measurePerformanceAsync } from '$lib/performance/performance';


onMount(() => {
	measurePerformanceAsync('Data Table Component Mount', async () => {
		await loadCourses();
	})
});
async function loadCourses() {
	await measurePerformanceAsync('Courses Store Refresh', async () => {
		await courses.load();
	})
}
async function reloadCourses() {
	await measurePerformanceAsync('Courses Store Refresh (force)', async () => {
		await courses.load(true);
	})
}

// Handle successful course creation
function handleCourseSuccess(result: CourseResponse) {
	// Refresh the courses list if pagination is used skip to last page
	reloadCourses();
}

function handleCourseCancel() {
	// Handle cancel if needed
	console.log('Course creation cancelled');
}

</script>

<DataTableAsyncWrapper
	store={$courses}
	errorKey="errors.loading_users"
	loadingKey="loading.users"
	onRetry={loadCourses}
>
	{#snippet children()}
		<DataTable
			columns={courseColumns}
			data={$courses.data}
			loading={$courses.loading}
			loadTableData={reloadCourses}
		/>
	{/snippet}
</DataTableAsyncWrapper>