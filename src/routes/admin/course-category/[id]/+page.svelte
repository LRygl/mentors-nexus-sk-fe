<script lang="ts">
	import { page } from '$app/state';
	import CourseCategoryEditPage from '$lib/components/Admin/Course Category/CourseCategoryEditPage.svelte';

	let courseCategoryId = $derived(page.params.id);
</script>

<CourseCategoryEditPage courseCategoryId={courseCategoryId} />