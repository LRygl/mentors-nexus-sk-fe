<script lang="ts">

	import { page } from '$app/state';
	import LessonEditPage from '$lib/components/Admin/Lesson/LessonEditPage.svelte';

	let lessonId = $derived(page.params.id);

</script>

<LessonEditPage {lessonId} />