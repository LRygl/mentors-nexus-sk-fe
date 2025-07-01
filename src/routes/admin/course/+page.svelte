<script lang="ts">
import DataTable from '$lib/components/data-table.svelte'
import type { Course } from '$lib/types/course';
import { columns } from './columns';
import { Button } from '$lib/components/ui/button';
import { getCourses } from '$lib/api/course-api';
import { onMount } from 'svelte';
import CourseDialog from '$lib/components/course-dialog.svelte';
import Loader2Icon from "@lucide/svelte/icons/loader-2";
import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
// State
let courses = $state<Course[]>([]);
let totalCourses = $state(0);
let loading = $state(true);
let error = $state<string | null>(null);

// Load resource data from API
async function loadCourses() {
	loading = true;
	error = null;

	try {
		const response = await getCourses({size:20})
		courses = response.content || [];
		totalCourses = response.totalElements;
	} catch (error) {
		error = error instanceof Error ? error.message : 'Failed to load courses';
		courses = [];
		totalCourses = 0;
	} finally {
		loading = false;
	}
}

onMount(() => {
	loadCourses();
})

// Debug the courses data
$effect(() => {
	console.log('Courses data:', courses);
	console.log('Courses length:', courses?.length);
});
</script>

<div class="pb-2">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Courses</h1>
			<p class="text-muted-foreground text-sm">Showing X of {totalCourses}</p>
		</div>
		<div class="flex gap-2">
			<Button
				variant="outline"
				onclick={loadCourses}
				disabled={loading}
			>
				{#if loading}
					<Loader2Icon class="w-4 h-4 animate-spin" />
				{:else}
					<RefreshCwIcon class="w-4 h-4" />
				{/if}
			</Button>
			<CourseDialog />

		</div>
	</div>
</div>

{#if error}
	<div class="rounded-md border p-8 text-center">
		<div class="text-red-500 mb-2">⚠️ Error loading courses</div>
		<div class="text-sm text-muted-foreground mb-4">{error}</div>
		<Button variant="outline" onclick={loadCourses} disabled={loading}>
			{#if loading}
				<Loader2Icon class="w-4 h-4 mr-2 animate-spin" />
				Retrying...
			{:else}
				<RefreshCwIcon class="w-4 h-4 mr-2" />
				Try Again
			{/if}
		</Button>
	</div>
{:else}
	<DataTable {columns} data={courses} {loading} />
{/if}