<script lang="ts">
import { courseStore } from '$lib/stores/defaults/CourseStore';
import { onMount } from 'svelte';
import type { Course } from '$lib/types/entities/Course';
import type { CourseSection } from '$lib/types/entities/CourseSection';
import CourseDetailsSection from '$lib/components/Admin/Course/CourseDetailsSection.svelte';
import CourseSectionManager from '$lib/components/Admin/Course/CourseSectionManager.svelte';
import CreateSectionModal from '$lib/components/Admin/Course/CreateSectionModal.svelte';
import LinkLessonModal from '$lib/components/Admin/Course/LinkLessonModal.svelte';
import { courseEditService } from '$lib/Services/CourseEditService';
import { lessonStore } from '$lib/stores/defaults/LessonStore';

let { courseId } = $props<{ courseId?: string }>();

// Derived state from stores
let course = $derived(courseStore.selectedItem);
let isLoading = $derived(courseStore.loadingItem);
let error = $derived(courseStore.itemError);
let allLessons = $derived(lessonStore.data);

// UI state
let isCreateSectionModalOpen = $state(false);
let isLinkLessonModalOpen = $state(false);
let selectedSectionForLinking = $state<string | null>(null);


let availableLessons = $derived.by(() => {
	if (!course) return []

	// TODO should be changed to filter out all lessons that are linked to any section
	const linkedLessonIds = new Set(
		course.sections?.flatMap(section =>
			section.lessons?.map(lesson => lesson.id) || []
		) || []
	);

	return allLessons.filter(lesson => !linkedLessonIds.has(lesson.id));
})


	onMount(async () => {
		await Promise.all([
			courseStore.fetchItem(courseId),
			allLessons.length === 0 ? lessonStore.fetchAll() : Promise.resolve()
		]);

	});


	async function loadLessons() {
		await lessonStore.fetchAll();
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

	async function handleSectionDelete(sectionId: string) {
	await courseStore.deleteSection(sectionId);
	}

	async function handleLinkLesson(sectionId: string, lessonId: string) {
		try {
			await courseStore.linkLesson(courseId, sectionId, lessonId);
			// Close modal on success
			isLinkLessonModalOpen = false;
			selectedSectionForLinking = null;
		} catch (error) {
			console.error('[CourseEdit] Error linking lesson:', error);
			// Error is handled by the store, modal will show it
		}
	}

	async function handleUnlinkLesson(sectionId: string, lessonId: string) {
		console.log('[CourseEdit] Unlinking lesson: ' + lessonId + ' from course section: ', sectionId);
		try {
			await courseStore.unlinkLesson(sectionId, lessonId);
		} catch (e) {
			console.error('[CourseEdit] Error unlinking lesson:', e);
		}
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
					onSectionDelete={handleSectionDelete}
					onLessonUnlink={handleUnlinkLesson}
				/>
			{/if}
		</div>
</div>

<CreateSectionModal
	isOpen={isCreateSectionModalOpen}
	onCreate={handleSectionCreate}
	onClose={() => isCreateSectionModalOpen = false}
/>

<LinkLessonModal
	isOpen={isLinkLessonModalOpen}
	availableLessons={availableLessons}
	sectionId={selectedSectionForLinking}
	onLink={handleLinkLesson}
	onClose={() => isLinkLessonModalOpen = false}
	/>