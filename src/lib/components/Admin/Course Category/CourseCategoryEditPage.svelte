<script lang="ts">
	import { onMount } from 'svelte';
	import { courseCategoryStore } from '$lib/stores/defaults/CourseCategoryStore';
	import CourseCategoryDetailsSection from '$lib/components/Admin/Course Category/CourseCategoryDetailsSection.svelte';
	import type { CourseCategory } from '$lib/types/entities/CourseCategory';

	let {
	courseCategoryId
	} = $props<{
		courseCategoryId?: string
	}>();

	let courseCategory = $derived(courseCategoryStore.selectedItem);
	let isLoading = $derived(courseCategoryStore.loadingItem);
	let error = $derived(courseCategoryStore.itemError);



	onMount(async () => {
		await loadCourseCategory();
	});

	async function loadCourseCategory() {
		await courseCategoryStore.fetchItem(courseCategoryId);
	}

	async function handleCourseCategoryUpdate(formData: Partial<CourseCategory>) {
		await courseCategoryStore.update(courseCategoryId, formData);
	}

</script>

<div class="min-h-screen py-8 bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<p class="text-red-800">{error}</p>
				<button
					onclick={() => loadCourseCategory()}
					class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
				>
					Try again
				</button>
			</div>
		{:else if courseCategory}
			<CourseCategoryDetailsSection
				{courseCategory}
				onUpdate={handleCourseCategoryUpdate}
			/>

		{/if}
	</div>
</div>