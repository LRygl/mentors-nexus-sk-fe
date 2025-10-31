<script lang="ts">
import { page } from '$app/state';
import { courseStore } from '$lib/stores/defaults/CourseStore';
import { onMount } from 'svelte';
import type { Course } from '$lib/types/entities/Course';
import type { CourseSection } from '$lib/types/entities/CourseSection';
import CourseDetailsSection from '$lib/components/Admin/Course/CourseDetailsSection.svelte';
import CourseSectionManager from '$lib/components/Admin/Course/CourseSectionManager.svelte';
import CreateSectionModal from '$lib/components/Admin/Course/CreateSectionModal.svelte';
import LinkLessonModal from '$lib/components/Admin/Course/LinkLessonModal.svelte';
import { courseEditService } from '$lib/Services/CourseEditService';

let { courseId = page.params.id } = $props<{ courseId?: string }>();

// Derived state from stores
let course = $derived(courseStore.selectedItem);
let isLoading = $derived(courseStore.loadingItem);
let error = $derived(courseStore.itemError);

// UI state
let isCreateSectionModalOpen = $state(false);
let isLinkLessonModalOpen = $state(false);
let selectedSectionForLinking = $state<string | null>(null);

	onMount(async () => {
		await loadCourse();
	});

	async function loadCourse() {
		await courseStore.fetchItem(courseId);
	}

	// Event handlers that delegate to store
	async function handleCourseUpdate(formData: Partial<Course>, imageFile?: File) {
		await courseStore.update(courseId, formData, imageFile);
	}

		async function handleSectionCreate(section: CourseSection) {
			await courseStore.createSection(courseId, section);
			isCreateSectionModalOpen = false;
		}

		async function handleSectionReorder(sectionIds: number[]) {
			await courseStore.reorderSections(courseId, sectionIds);
		}

		function handleAddLesson(sectionId: string) {
			selectedSectionForLinking = sectionId;
			isLinkLessonModalOpen = true;
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
					onclick={() => courseEditService.loadCourseData(courseId)}
					class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
				>
					Try again
				</button>
			</div>
		{:else if course}
				<CourseDetailsSection
					{course}
					onUpdate={handleCourseUpdate}
				/>

				<CourseSectionManager
					sections={course.sections}
					onSectionReorder={handleSectionReorder}
					onAddSection={() => isCreateSectionModalOpen = true}
					onAddLesson={handleAddLesson}
				/>
			{/if}
		</div>
</div>

<CreateSectionModal
	isOpen={isCreateSectionModalOpen}
	onCreate={handleSectionCreate}
	onClose={() => isCreateSectionModalOpen = false}
/>