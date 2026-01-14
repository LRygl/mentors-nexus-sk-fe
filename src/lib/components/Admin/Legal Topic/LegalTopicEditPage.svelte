<script lang="ts">
	import { onMount } from 'svelte';
	import type { LegalTopic } from '$lib/types/entities/LegalTopic';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore.svelte';
	import LegalTopicDetailsSection from '$lib/components/Admin/Legal Topic/LegalTopicDetailsSection.svelte';
	import LegalTopicSectionManager from '$lib/components/Admin/Legal Topic/LegalTopicSectionManager.svelte';
	import type { LegalSection } from '$lib/types/entities/LegalSection';
	import type { LegalItem } from '$lib/types/entities/LegalItem';
	import AddLegalSectionModal from '$lib/components/Admin/Legal Topic/AddLegalSectionModal.svelte';
	import AddLegalItemModal from '$lib/components/Admin/Legal Topic/AddLegalItemModal.svelte';

	let { legalTopicId } = $props<{ legalTopicId?: string }>();

	let topic = $derived(legalTopicStore.selectedItem);
	let isLoading = $derived(legalTopicStore.loadingItem);
	let error = $derived(legalTopicStore.itemError);

	// Modal states
	let isSectionModalOpen = $state(false);
	let isItemModalOpen = $state(false);
	let isSubItemModalOpen = $state(false);
	let selectedSectionId = $state<string | null>(null);
	let selectedParentItemId = $state<string | null>(null);

	onMount(async () => {
		await legalTopicStore.fetchItem(legalTopicId);
	});

	async function handleLegalTopicUpdate(formData: Partial<LegalTopic>) {
		await legalTopicStore.update(legalTopicId, formData);
	}

	// Section operations
	function handleSectionCreate() {
		isSectionModalOpen = true;
	}

	async function handleSectionCreateSubmit(formData: Partial<LegalSection>) {
		await legalTopicStore.createSection(legalTopicId, {
			...formData,
			orderIndex: (topic?.sections?.length || 0) + 1
		});
		isSectionModalOpen = false;
	}

	async function handleSectionUpdate(sectionId: string, data: Partial<LegalSection>) {
		await legalTopicStore.updateSection(sectionId, data);
	}

	async function handleSectionDelete(sectionId: string) {
		await legalTopicStore.deleteSection(sectionId);
	}

	async function handleSectionReorder(sections: LegalSection[]) {
		await legalTopicStore.reorderSections(legalTopicId, sections);
	}

	// Item operations
	function handleItemCreate(sectionId: string) {
		selectedSectionId = sectionId;
		isItemModalOpen = true;
	}

	async function handleItemUpdate(itemId: string, data: Partial<LegalItem>) {

		// await legalTopicStore.updateLegalItem(itemId, data);
	}

	async function handleItemDelete(itemId: string) {
		await legalTopicStore.deleteItem_FromSection(itemId);
	}

	async function handleItemReorder(sectionId: string, itemIds: number[]) {
		await legalTopicStore.reorderItems(sectionId, itemIds);
	}

	// Sub-item operations
	function handleSubItemCreate(parentItemId: string) {
		selectedParentItemId = parentItemId;
		isSubItemModalOpen = true;
	}

	async function handleSubItemDelete(subItemId: string) {
		await legalTopicStore.deleteSubItem( subItemId);
	}

	async function handleSubItemReorder(parentItemId: string, subItemIds: number[]) {
		await legalTopicStore.reorderSubItems(parentItemId, subItemIds);
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
					onclick={() => legalTopicStore.fetchItem(legalTopicId)}
					class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
				>
					Try again
				</button>
			</div>
		{:else if topic}
			<LegalTopicDetailsSection
				{topic}
				onUpdate={handleLegalTopicUpdate}
			/>

			<LegalTopicSectionManager
				sections={topic.sections || []}
				onSectionCreate={handleSectionCreate}
				onSectionUpdate={handleSectionUpdate}
				onSectionDelete={handleSectionDelete}
				onSectionReorder={handleSectionReorder}
				onItemCreate={handleItemCreate}
				onItemUpdate={handleItemUpdate}
				onItemDelete={handleItemDelete}
				onItemReorder={handleItemReorder}
				onSubItemCreate={handleSubItemCreate}
				onSubItemDelete={handleSubItemDelete}
				onSubItemReorder={handleSubItemReorder}
			/>
		{/if}
	</div>
</div>

<!-- Section Creation Modal -->
<AddLegalSectionModal
	isOpen={isSectionModalOpen}
	topicId={legalTopicId}
	onClose={
	() => isSectionModalOpen = false
	}
/>

<AddLegalItemModal
	isOpen={isItemModalOpen}
	sectionId={selectedSectionId}
	onClose={() => isItemModalOpen = false}
/>

<AddLegalItemModal
	isOpen={isSubItemModalOpen}
	parentItemId={selectedParentItemId}
	onClose={() => {
		isSubItemModalOpen = false;
		selectedParentItemId = null;
	}}
/>