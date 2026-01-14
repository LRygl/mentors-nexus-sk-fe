<script lang="ts">
	import { page } from '$app/state';
	import CourseEditPage from '$lib/components/Admin/Course/CourseEditPage.svelte'

	// The page component is just a thin wrapper
	// It extracts route params and passes them down
	let courseId = $derived(page.params.id);
</script>

<CourseEditPage {courseId} />