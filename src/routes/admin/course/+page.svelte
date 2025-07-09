<script lang="ts">
import DataTable from '$lib/components/data-table.svelte'
import type { CourseResponse } from '$lib/types/course';
import { courses } from '$lib/stores/course-store';
import { columns } from './columns';
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
<!-- OLD Script for Create Dialog
<div class="pb-2">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">EMV Courses</h1>
			<p class="text-muted-foreground text-sm">Showing X of Y</p>
		</div>
		<div class="flex gap-2">
			<Button
				variant="outline"
				onclick={reloadCourses}
				disabled={$courses.loading}
			>
				{#if $courses.loading}
					<Loader2Icon class="w-4 h-4 animate-spin" />
				{:else}
					<RefreshCwIcon class="w-4 h-4" />
				{/if}
			</Button>
			<CourseDialog
				onSuccess={handleCourseSuccess}
				onCancel={handleCourseCancel}
			/>
		</div>
	</div>
</div>
 For users -->
<DataTableAsyncWrapper
	store={$courses}
	errorKey="errors.loading_users"
	loadingKey="loading.users"
	onRetry={loadCourses}
>
	{#snippet children()}
		<DataTable
			columns={columns}
			data={$courses.data}
			loading={$courses.loading}
			loadTableData={reloadCourses}
		/>
	{/snippet}
</DataTableAsyncWrapper>