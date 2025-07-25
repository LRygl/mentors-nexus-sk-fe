<!-- lib/components/CourseFilters.svelte -->
<script lang="ts">
	import type { CourseFilters, Difficulty } from '$lib/types/course-filters';
	import { courseFilterStore } from '$lib/stores/course-filter-store';

	interface Props {
		filters: CourseFilters;
		showFilters: boolean;
	}

	let { filters, showFilters }: Props = $props();

	// Constants
	const categories = ['Web Development', 'Data Science', 'Design', 'Marketing', 'Business', 'Mobile Development', 'Cloud Computing'];
	const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
	const ratingOptions = [4.5, 4.0, 3.5, 3.0];

	function handlePriceChange(type: 'min' | 'max', event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseInt(target.value) || 0;
		courseFilterStore.updatePriceRange(type, value);
	}
</script>