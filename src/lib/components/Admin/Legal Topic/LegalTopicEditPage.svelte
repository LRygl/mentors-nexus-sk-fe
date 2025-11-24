
<script lang="ts">
	import { onMount } from 'svelte';
	import type { LegalTopic } from '$lib/types/entities/LegalTopic';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore';
	import LegalTopicDetailsSection from '$lib/components/Admin/Legal Topic/LegalTopicDetailsSection.svelte';
	import LegalTopicSectionManager from '$lib/components/Admin/Legal Topic/LegalTopicSectionManager.svelte';
	import type { CourseSection } from '$lib/types/entities/CourseSection';
	import LinkTopicModal from '$lib/components/Admin/Legal Topic/LinkTopicModal.svelte';

	let { legalTopicId } = $props<{ legalTopicId?: string }>();

	let topic = $derived(legalTopicStore.selectedItem);
	let isLoading = $derived(legalTopicStore.loadingItem);
	let error = $derived(legalTopicStore.itemError);
	let isLinkItemModalOpen = $state(false);
	let selectedSectionForLinking = $state<string | null>(null);

	let availableItems = $derived.by(() => {
		if (!topic) return [];

		const linkedLegalItems = new Set(
			topic.sections?.flatMap(section => section.items?.map(item => item.id) || []
			) || []
		);
		return []
	})

	onMount(async ()	=> {
		await Promise.all([
			legalTopicStore.fetchItem(legalTopicId),
		]);
	});

	async function handleLegalTopicUpdate(formData: Partial<LegalTopic>) {
		await legalTopicStore.update(legalTopicId, formData);
	}

	async function handleSectionCreate(section: CourseSection) {
		await legalTopicStore.createSection(legalTopicId, section);
		isLinkItemModalOpen = false;
	}

	async function handleSectionReorder(sectionIds: number[]) {
		await legalTopicStore.reorderSections(legalTopicId, sectionIds);
	}

	function handleAddItem(sectionId: string) {
		selectedSectionForLinking = sectionId;
		isLinkItemModalOpen = true;
	}

	async function handleSectionDelete(sectionId: string) {
		await legalTopicStore.deleteSection(sectionId);
	}

	async function handleItemLink(sectionId: string, itemId: string) {
		try {
			await legalTopicStore.linkItem(legalTopicId, sectionId, itemId);
			// Close modal on success
			isLinkItemModalOpen = false;
			selectedSectionForLinking = null;
		} catch (error) {
			console.error('[CourseEdit] Error linking lesson:', error);
			// Error is handled by the store, modal will show it
		}
	}

	async function handleItemUnlink(sectionId: string, itemId: string) {
		console.log('[CourseEdit] Unlinking lesson: ' + itemId + ' from course section: ', sectionId);
		try {
			await legalTopicStore.unlinkItem(sectionId, itemId);
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
					onclick={() => null}
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
				sections={topic.sections}
				onSectionReorder={handleSectionReorder}
				onAddSection={() => isLinkItemModalOpen = true}
				onAddItem={handleAddItem}
				onSectionDelete={handleSectionDelete}
				onItemUnlink={handleItemUnlink}
			/>
		{/if}
	</div>
</div>

<LinkTopicModal
	isOpen={isLinkItemModalOpen}
	availableTopics={availableItems}
	sectionId={selectedSectionForLinking}
	onLink={handleItemLink}
	onClose={() => isLinkItemModalOpen = false}
/>
