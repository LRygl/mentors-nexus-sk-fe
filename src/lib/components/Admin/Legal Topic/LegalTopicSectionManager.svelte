<script lang="ts">
	import type { LegalSection } from '$lib/types/entities/LegalSection';
	import SectionManager, { type BaseSectionItem } from '$lib/components/SectionManager.svelte';
	import type { LegalItem } from '$lib/types/entities/LegalItem';

	interface Props {
		sections: LegalSection[];
		onSectionReorder: (sections: LegalSection[]) => Promise<void>;
		onSectionDelete: (sectionId: string) => Promise<void>;
		onAddSection: () => void;
		onAddLesson: (sectionId: string) => void;
		onItemUnlink: (sectionId: string, itemId: string) => Promise<void>;
		onItemReorder: (sectionId: string, itemId: number[]) => Promise<void>;
	}

	let {
		sections = [],
		onSectionReorder,
		onSectionDelete,
		onAddSection,
		onAddLesson,
		onItemUnlink,
		onItemReorder
	}: Props = $props();

	// Local UI state
	let isReordering = $state(false);

	let componentSections = $derived.by((): SectionWithItems[] => {
		return sections.map(section => ({
			id: section.id,
			uuid: section.uuid,
			title: section.name,
			orderIndex: section.orderIndex,
			items: section.items || []
		}));
	});

	// Type for the SectionManager component
	interface SectionWithItems extends BaseSectionItem {
		id?: string;
		uuid?: string;
		title: string;
		orderIndex: number;
		items: LegalItem[];
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
	async function handleItemReorder(sectionIndex: number, reorderItems: LegalItem[]) {
		const section = sections[sectionIndex];
		if (!section?.id) {
			console.error('[CourseSectionsManager] Section not found at index:', sectionIndex);
			return;
		}

		try {
			// Extract lesson IDs in new order
			const itemIds = reorderItems
				.map(item => item.id)
				.filter((id): id is number => id !== undefined && id !== null);

			await onItemReorder(section.id, itemIds);
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
	async function handleItemDelete(
		item: LegalItem,              // ← 1st parameter from SectionManager
		_itemIndex: number,         // ← 2nd parameter from SectionManager
		section: SectionWithItems, // ← 3rd parameter from SectionManager
		_sectionIndex: number       // ← 4th parameter from SectionManager
	) {
		console.log('[CourseSectionsManager] Section ID:', section.id || section.uuid,
			'Deleting Lesson ID:', item.id);


		const sectionId = section.id || section.uuid;
		const itemId = item.id;

		if (!sectionId || !itemId) {
			console.error('[CourseSectionsManager] Missing section or lesson ID');
			return;
		}

		try {
			await onItemUnlink(sectionId, itemId);
		} catch (error) {
			console.error('[CourseSectionsManager] Error unlinking lesson:', error);
		}
	}

	/**
	 * Handle adding a lesson to a section
	 */
	function handleAddItem(section: SectionWithItems, sectionIndex: number) {
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
		sectionTitle="Legal Topic Sections"
		itemTitle="Item"
		showSectionDescription={true}
		collapsible={true}
		defaultExpanded={false}
		onSectionsReorder={handleSectionsReorder}
		onItemsReorder={handleItemReorder}
		onAddSection={onAddSection}
		onDeleteSection={handleSectionDelete}
		onAddItem={handleAddItem}
		onDeleteItem={handleItemDelete}
	/>
</div>

<style>
    .course-sections-manager {
        /* Add any specific styling for the sections manager */
        margin-top: 2rem;
    }
</style>