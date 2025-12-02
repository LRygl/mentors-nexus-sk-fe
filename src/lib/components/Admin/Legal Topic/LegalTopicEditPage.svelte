<script lang="ts">
	import { onMount } from 'svelte';
	import type { LegalTopic } from '$lib/types/entities/LegalTopic';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore';
	import LegalTopicDetailsSection from '$lib/components/Admin/Legal Topic/LegalTopicDetailsSection.svelte';
	import LegalTopicSectionManager from '$lib/components/Admin/Legal Topic/LegalTopicSectionManager.svelte';
	import type { LegalSection } from '$lib/types/entities/LegalSection';
	import type { LegalItem } from '$lib/types/entities/LegalItem';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import { LegalSectionFormSchema } from '$lib/components/Forms/Schemas/Legal/LegalSectionFormSchema';
	import { LegalItemFormSchema } from '$lib/components/Forms/Schemas/Legal/LegalItemFormSchema';

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

	async function handleItemCreateSubmit(formData: Partial<LegalItem>) {
		if (!selectedSectionId) return;
		
		const section = topic?.sections?.find(s => s.id?.toString() === selectedSectionId);
		await legalTopicStore.createItem_InSection(selectedSectionId, {
			...formData,
			orderIndex: (section?.items?.length || 0) + 1
		});
		isItemModalOpen = false;
		selectedSectionId = null;
	}

	async function handleItemUpdate(itemId: string, data: Partial<LegalItem>) {
		await legalTopicStore.updateLegalItem(itemId, data);
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

	async function handleSubItemCreateSubmit(formData: Partial<LegalItem>) {
		if (!selectedParentItemId) return;
		
		await legalTopicStore.createSubItem(selectedParentItemId, {
			...formData,
			orderIndex: 1 // Will be calculated on backend
		});
		isSubItemModalOpen = false;
		selectedParentItemId = null;
	}

	async function handleSubItemDelete(parentItemId: string, subItemId: string) {
		await legalTopicStore.deleteSubItem(parentItemId, subItemId);
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
<UniversalCreateModal
	isOpen={isSectionModalOpen}
	title="Create Legal Section"
	formSchema={LegalSectionFormSchema}
	onSubmit={handleSectionCreateSubmit}
	onClose={() => isSectionModalOpen = false}
/>

<!-- Item Creation Modal -->
<UniversalCreateModal
	isOpen={isItemModalOpen}
	title="Create Legal Item"
	formSchema={LegalItemFormSchema}
	onSubmit={handleItemCreateSubmit}
	onClose={() => {
		isItemModalOpen = false;
		selectedSectionId = null;
	}}
/>

<!-- Sub-Item Creation Modal -->
<UniversalCreateModal
	isOpen={isSubItemModalOpen}
	title="Create Sub-Item"
	formSchema={LegalItemFormSchema}
	onSubmit={handleSubItemCreateSubmit}
	onClose={() => {
		isSubItemModalOpen = false;
		selectedParentItemId = null;
	}}
/>
