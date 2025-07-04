<script lang="ts">
import DataTable from '$lib/components/data-table.svelte'
import type { Course, CourseResponse } from '$lib/types/course';
import { courses } from '$lib/stores/course-store';
import { columns } from './columns';
import { Button } from '$lib/components/ui/button';
import { getCourses } from '$lib/api/course-api';
import { onMount } from 'svelte';
import CourseDialog from '$lib/components/course-dialog.svelte';
import Loader2Icon from "@lucide/svelte/icons/loader-2";
import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";


onMount(() => {	loadCourses(); })
async function loadCourses() {
	await courses.load()
}
async function reloadCourses() {
	await courses.load(true)
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

{#if $courses.error}
	<div class="rounded-md border p-8 text-center">
		<div class="text-red-500 mb-2">⚠️ Error loading courses</div>
		<div class="text-sm text-muted-foreground mb-4">{$courses.error}</div>
		<Button variant="outline" onclick={reloadCourses} disabled={$courses.loading}>
			{#if $courses.loading}
				<Loader2Icon class="w-4 h-4 mr-2 animate-spin" />
				Retrying...
			{:else}
				<RefreshCwIcon class="w-4 h-4 mr-2" />
				Try Again
			{/if}
		</Button>
	</div>
{:else}
	<DataTable {columns} data={$courses.data} loading={$courses.loading} />
{/if}
