<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let lesson = $derived(data.lesson);
	let courseId = $derived(data.courseId);
</script>

<h1>{lesson.title}</h1>


<video>
	<source >
</video>