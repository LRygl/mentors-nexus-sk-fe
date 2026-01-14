<script lang="ts">
	import SectionManager, { type BaseSectionItem } from '$lib/components/SectionManager.svelte';
	import type { CourseSection } from '$lib/types/entities/CourseSection';
	import type { Lesson } from '$lib/types/entities/Lesson';

	/**
	 * Presenter component for managing course sections
	 * Responsible for:
	 * - Displaying sections and lessons
	 * - Handling drag & drop UI
	 * - Emitting events to parent
	 * - No business logic or API calls
	 */

		// Props (data flows down from parent)
	interface Props {
		sections: CourseSection[];
		onSectionReorder: (sections: CourseSection[]) => Promise<void>;
		onSectionDelete: (sectionId: string) => Promise<void>;
		onAddSection: () => void;
		onAddLesson: (sectionId: string) => void;
		onLessonUnlink: (sectionId: string, lessonId: string) => Promise<void>;
		onLessonReorder: (sectionId: string, lessonIds: number[]) => Promise<void>;
	}

	let {
		sections = [],
		onSectionReorder,
		onSectionDelete,
		onAddSection,
		onAddLesson,
		onLessonUnlink,
		onLessonReorder
	}: Props = $props();

	// Local UI state
	let isReordering = $state(false);

	/**
	 * Transform CourseSection[] to the format expected by SectionManager
	 * This is a view model transformation - separating domain model from UI model
	 */
	let componentSections = $derived.by((): SectionWithItems[] => {
		return sections.map(section => ({
			id: section.id,
			uuid: section.uuid,
			title: section.title,
			description: section.description,
			orderIndex: section.orderIndex,
			items: section.lessons || []
		}));
	});

	// Type for the SectionManager component
	interface SectionWithItems extends BaseSectionItem {
		id?: string;
		uuid?: string;
		title: string;
		description: string;
		orderIndex: number;
		items: Lesson[];
	}

	/**
	 * Handle section reordering
	 * Transforms UI model back to domain model and delegates to parent
	 */
	async function handleSectionsReorder(reorderedSections: SectionWithItems[]) {
		if (isReordering) return;

		isReordering = true;
		try {
			// Create partial updates with only the fields we're changing
			const sectionsToUpdate = reorderedSections.map((section, index) => {
				const originalSection = sections.find(s =>
					(s.id && s.id === section.id) || (s.uuid && s.uuid === section.uuid)
				);

				if (!originalSection) {
					throw new Error(`Original section not found for id/uuid: ${section.id || section.uuid}`);
				}

				// Return the full original section with updated orderIndex
				return {
					...originalSection,
					orderIndex: index
				};
			});

			await onSectionReorder(sectionsToUpdate);
		} catch (error) {
			console.error('[CourseSectionsManager] Error reordering sections:', error);
		} finally {
			isReordering = false;
		}
	}

	/**
	 * Handle lesson reordering within a section
	 */
	async function handleLessonReorder(sectionIndex: number, reorderedLessons: Lesson[]) {
		const section = sections[sectionIndex];
		if (!section?.id) {
			console.error('[CourseSectionsManager] Section not found at index:', sectionIndex);
			return;
		}

		try {
			// Extract lesson IDs in new order
			const lessonIds = reorderedLessons
				.map(lesson => lesson.id)
				.filter((id): id is number => id !== undefined && id !== null);

			await onLessonReorder(section.id, lessonIds);
		} catch (error) {
			console.error('[CourseSectionsManager] Error reordering lessons:', error);
		}
	}

	/**
	 * Handle section deletion
	 */
	async function handleSectionDelete(section: SectionWithItems, index: number) {
		// Confirm deletion if section has lessons
		if (section.items && section.items.length > 0) {
			const confirmed = confirm(
				`This section contains ${section.items.length} lesson(s). Are you sure you want to delete it?`
			);
			if (!confirmed) return;
		}

		const sectionId = section.id || section.uuid;
		if (!sectionId) {
			console.error('[CourseSectionsManager] Section ID not found');
			return;
		}

		try {
			await onSectionDelete(sectionId);
		} catch (error) {
			console.error('[CourseSectionsManager] Error deleting section:', error);
		}
	}

	/**
	 * Handle lesson unlinking (deletion from section)
	 */
	async function handleLessonDelete(
		item: Lesson,              // ← 1st parameter from SectionManager
		_itemIndex: number,         // ← 2nd parameter from SectionManager
		section: SectionWithItems, // ← 3rd parameter from SectionManager
		_sectionIndex: number       // ← 4th parameter from SectionManager
	) {
		console.log('[CourseSectionsManager] Section ID:', section.id || section.uuid,
			'Deleting Lesson ID:', item.id);


		const sectionId = section.id || section.uuid;
		const lessonId = item.id;

		if (!sectionId || !lessonId) {
			console.error('[CourseSectionsManager] Missing section or lesson ID');
			return;
		}

		try {
			await onLessonUnlink(sectionId, lessonId);
		} catch (error) {
			console.error('[CourseSectionsManager] Error unlinking lesson:', error);
		}
	}

	/**
	 * Handle adding a lesson to a section
	 */
	function handleAddLesson(section: SectionWithItems, sectionIndex: number) {
		const sectionId = section.id || section.uuid;
		if (!sectionId) {
			console.error('[CourseSectionsManager] Section ID not found');
			return;
		}

		onAddLesson(sectionId);
	}
</script>

<div class="course-sections-manager">
	<SectionManager
		sections={componentSections}
		sectionTitle="Terminal Sections"
		itemTitle="Lesson"
		showSectionDescription={true}
		collapsible={true}
		defaultExpanded={false}
		onSectionsReorder={handleSectionsReorder}
		onItemsReorder={handleLessonReorder}
		onAddSection={onAddSection}
		onDeleteSection={handleSectionDelete}
		onAddItem={handleAddLesson}
		onDeleteItem={handleLessonDelete}
	/>
</div>

<style>
    .course-sections-manager {
        /* Add any specific styling for the sections manager */
        margin-top: 2rem;
    }
</style>