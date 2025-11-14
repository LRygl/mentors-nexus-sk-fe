
<script lang="ts">
	import type { Lesson } from '$lib/types/entities/Lesson';
	import { lessonStore } from '$lib/stores/defaults/LessonStore';
	import { onMount } from 'svelte';
	import LessonDetailsSection from '$lib/components/Admin/Lesson/LessonDetailsSection.svelte';

	let { lessonId } = $props<{ lessonId?: string }>();

	let lesson = $derived(lessonStore.selectedItem);
	let isLoading = $derived(lessonStore.loadingItem);
	let error = $derived(lessonStore.itemError);

	onMount(async () => {
		await Promise.all([
			lessonStore.fetchItem(lessonId),
		]);
	});

	async function handleLessonUpdate(formData: Partial<Lesson>, imageFile?: File) {
		await lessonStore.update(lessonId, formData, imageFile);
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
					onclick={() => null}
					class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
				>
					Try again
				</button>
			</div>
		{:else if lesson}
			<LessonDetailsSection
				{lesson}
				onUpdate={handleLessonUpdate}
			/>
		{/if}
	</div>
</div>
