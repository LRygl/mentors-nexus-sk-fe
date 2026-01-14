<script lang="ts">
	import type { LegalSection } from '$lib/types/entities/LegalSection';
	import type { LegalItem } from '$lib/types/entities/LegalItem';
	import { confirmationModal } from '$lib/components/Modals/ConfirmationModalService.svelte';
	import { messages } from '$lib/i18n/messages';

	interface Props {
		sections: LegalSection[];
		onSectionCreate: () => void;
		onSectionUpdate: (sectionId: string, data: Partial<LegalSection>) => Promise<void>;
		onSectionDelete: (sectionId: string) => Promise<void>;
		onSectionReorder: (sections: LegalSection[]) => Promise<void>;
		onItemCreate: (sectionId: string) => void;
		onItemUpdate: (itemId: string, data: Partial<LegalItem>) => Promise<void>;
		onItemDelete: (itemId: string) => Promise<void>;
		onItemReorder: (sectionId: string, itemIds: number[]) => Promise<void>;
		onSubItemCreate: (parentItemId: string) => void;
		onSubItemDelete: (parentItemId: string, subItemId: string) => Promise<void>;
		onSubItemReorder: (parentItemId: string, subItemIds: number[]) => Promise<void>;
	}

	let {
		sections = [],
		onSectionCreate,
		onSectionUpdate,
		onSectionDelete,
		onSectionReorder,
		onItemCreate,
		onItemUpdate,
		onItemDelete,
		onItemReorder,
		onSubItemCreate,
		onSubItemDelete,
		onSubItemReorder
	}: Props = $props();

	// Debounce state for section name updates
	let sectionNameDebounceTimers = $state<Map<string, number>>(new Map());
	let savingStates = $state<Map<string, 'idle' | 'saving' | 'saved'>>(new Map());

	let draggedSection = $state<number | null>(null);
	let draggedItem = $state<{ sectionIndex: number; itemIndex: number } | null>(null);
	let draggedSubItem = $state<{ sectionIndex: number; itemIndex: number; subItemIndex: number } | null>(null);
	let expandedSections = $state<Set<number>>(new Set());
	let expandedItems = $state<Set<string>>(new Set());
	let editingContent = $state<{ type: 'item' | 'subItem'; id: string; value: string } | null>(null);

	// Initialize expanded sections - only expand those that have items
	$effect(() => {
		if (sections) {
			const sectionsWithItems = sections
				.map((section, index) => ({ hasItems: section.items && section.items.length > 0, index }))
				.filter(item => item.hasItems)
				.map(item => item.index);

			expandedSections = new Set(sectionsWithItems);
		}
	});

	/**
	 * Debounced section name update handler
	 * Waits 1.5 seconds after the user stops typing before saving
	 */
	function handleSectionNameChange(sectionId: string, newName: string) {
		// Clear existing timer for this section
		const existingTimer = sectionNameDebounceTimers.get(sectionId);
		if (existingTimer) {
			clearTimeout(existingTimer);
		}

		// Update the section name immediately in the UI (optimistic update)
		const section = sections.find(s => s.id?.toString() === sectionId);
		if (section) {
			section.name = newName;
			sections = [...sections]; // Trigger reactivity
		}

		// Set saving state
		savingStates.set(sectionId, 'idle');
		savingStates = new Map(savingStates);

		// Set new timer to save after 1.5 seconds of no typing
		const timerId = setTimeout(async () => {
			savingStates.set(sectionId, 'saving');
			savingStates = new Map(savingStates);

			try {
				await onSectionUpdate(sectionId, { name: newName });

				savingStates.set(sectionId, 'saved');
				savingStates = new Map(savingStates);

				// Clear "saved" indicator after 2 seconds
				setTimeout(() => {
					savingStates.set(sectionId, 'idle');
					savingStates = new Map(savingStates);
				}, 2000);
			} catch (error) {
				console.error('Failed to save section name:', error);
				savingStates.set(sectionId, 'idle');
				savingStates = new Map(savingStates);
			}

			sectionNameDebounceTimers.delete(sectionId);
			sectionNameDebounceTimers = new Map(sectionNameDebounceTimers);
		}, 1500);

		sectionNameDebounceTimers.set(sectionId, timerId);
		sectionNameDebounceTimers = new Map(sectionNameDebounceTimers);
	}

	/**
	 * Get the save status icon for a section
	 */
	function getSaveStatusIcon(sectionId: string) {
		const state = savingStates.get(sectionId) || 'idle';

		switch (state) {
			case 'saving':
				return `
					<svg class="w-4 h-4 text-yellow-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
				`;
			case 'saved':
				return `
					<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				`;
			default:
				return '';
		}
	}

	function toggleSection(index: number) {
		if (expandedSections.has(index)) {
			expandedSections.delete(index);
		} else {
			expandedSections.add(index);
		}
		expandedSections = new Set(expandedSections);
	}

	function toggleItem(itemId: string) {
		if (expandedItems.has(itemId)) {
			expandedItems.delete(itemId);
		} else {
			expandedItems.add(itemId);
		}
		expandedItems = new Set(expandedItems);
	}

	// Section drag handlers
	function handleSectionDragStart(index: number) {
		draggedSection = index;
	}

	function handleSectionDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (draggedSection === null || draggedSection === index) return;

		const newSections = [...sections];
		const draggedItem = newSections[draggedSection];
		newSections.splice(draggedSection, 1);
		newSections.splice(index, 0, draggedItem);

		sections = newSections;
		draggedSection = index;
	}

	async function handleSectionDragEnd() {
		if (draggedSection !== null) {
			await onSectionReorder(sections);
		}
		draggedSection = null;
	}

	// Item drag handlers
	function handleItemDragStart(sectionIndex: number, itemIndex: number) {
		draggedItem = { sectionIndex, itemIndex };
	}

	function handleItemDragOver(e: DragEvent, sectionIndex: number, itemIndex: number) {
		e.preventDefault();
		if (!draggedItem || draggedItem.sectionIndex !== sectionIndex || draggedItem.itemIndex === itemIndex) return;

		const section = sections[sectionIndex];
		const newItems = [...section.items];
		const draggedElement = newItems[draggedItem.itemIndex];
		newItems.splice(draggedItem.itemIndex, 1);
		newItems.splice(itemIndex, 0, draggedElement);

		section.items = newItems;
		sections = [...sections];
		draggedItem.itemIndex = itemIndex;
	}

	async function handleItemDragEnd(sectionIndex: number) {
		if (draggedItem) {
			const section = sections[sectionIndex];
			const itemIds = section.items
				.map(item => item.id)
				.filter((id): id is number => id !== undefined);
			await onItemReorder(section.id!.toString(), itemIds);
		}
		draggedItem = null;
	}

	// SubItem drag handlers
	function handleSubItemDragStart(sectionIndex: number, itemIndex: number, subItemIndex: number) {
		draggedSubItem = { sectionIndex, itemIndex, subItemIndex };
	}

	function handleSubItemDragOver(e: DragEvent, sectionIndex: number, itemIndex: number, subItemIndex: number) {
		e.preventDefault();
		if (!draggedSubItem || draggedSubItem.sectionIndex !== sectionIndex ||
			draggedSubItem.itemIndex !== itemIndex || draggedSubItem.subItemIndex === subItemIndex) return;

		const item = sections[sectionIndex].items[itemIndex];
		if (!item.subItems) return;

		const newSubItems = [...item.subItems];
		const draggedElement = newSubItems[draggedSubItem.subItemIndex];
		newSubItems.splice(draggedSubItem.subItemIndex, 1);
		newSubItems.splice(subItemIndex, 0, draggedElement);

		item.subItems = newSubItems;
		sections = [...sections];
		draggedSubItem.subItemIndex = subItemIndex;
	}

	async function handleSubItemDragEnd(sectionIndex: number, itemIndex: number) {
		if (draggedSubItem) {
			const item = sections[sectionIndex].items[itemIndex];
			const subItemIds = (item.subItems || [])
				.map(si => si.id)
				.filter((id): id is number => id !== undefined);
			await onSubItemReorder(item.id!.toString(), subItemIds);
		}
		draggedSubItem = null;
	}

	async function handleDeleteSection(sectionId: string) {
		const confirmed = await confirmationModal.delete(
			messages.confirmation.deleteSection.title,
			messages.confirmation.deleteSection.description
		);
		if (confirmed) {
			await onSectionDelete(sectionId);
		}
	}

	async function handleDeleteItem(itemId: string) {
		const confirmed = await confirmationModal.warning(
			'Delete Item',
			'Are you sure you want to delete this item?'
		);
		if (confirmed) {
			await onItemDelete(itemId);
		}
	}

	async function handleDeleteSubItem(parentItemId: string, subItemId: string) {
		const confirmed = await confirmationModal.warning(
			'Delete Sub-Item',
			'Are you sure you want to delete this sub-item?'
		);
		if (confirmed) {
			await onSubItemDelete(parentItemId, subItemId);
		}
	}

	function startEditingContent(type: 'item' | 'subItem', id: string, value: string) {
		editingContent = { type, id, value };
	}

	async function saveContent() {
		if (!editingContent) return;

		await onItemUpdate(editingContent.id, { content: editingContent.value });
		editingContent = null;
	}

	function cancelEditing() {
		editingContent = null;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.stopPropagation();
			cancelEditing();
		}
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-xl font-bold text-slate-900">Legal Sections</h2>
		<button
			onclick={onSectionCreate}
			class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
			</svg>
			Add Section
		</button>
	</div>

	{#if sections.length === 0}
		<div class="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
			<svg class="w-12 h-12 mx-auto mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
			</svg>
			<p class="font-medium">No sections yet</p>
			<p class="text-sm mt-1">Click "Add Section" to create your first section</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each sections as section, sectionIndex (section.uuid || section.id || `section-${sectionIndex}`)}
				<div
					role="listitem"
					draggable="true"
					ondragstart={() => handleSectionDragStart(sectionIndex)}
					ondragover={(e) => handleSectionDragOver(e, sectionIndex)}
					ondragend={handleSectionDragEnd}
					class="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all {draggedSection === sectionIndex ? 'opacity-50 scale-95' : ''}"
				>
					<!-- Section Header -->
					<div class="bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-3">
						<div class="flex items-center gap-3">
							<button
								aria-label="Drag to reorder section"
								class="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded transition-colors"
							>
								<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
								</svg>
							</button>

							<div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg">
								<span class="text-sm font-bold text-white">{section.orderIndex}</span>
							</div>

							<div class="flex-1 relative">
								<input
									type="text"
									value={section.name}
									oninput={(e) => handleSectionNameChange(section.id.toString(), e.currentTarget.value)}
									placeholder="Section Name"
									class="w-full px-3 py-1.5 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:bg-white/20 focus:ring-2 focus:ring-white/30 transition-all"
								/>

								<!-- Save Status Indicator -->
								<div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center" aria-live="polite">
									{@html getSaveStatusIcon(section.id.toString())}
								</div>
							</div>

							<button
								onclick={() => toggleSection(sectionIndex)}
								aria-label={expandedSections.has(sectionIndex) ? "Collapse section" : "Expand section"}
								class="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
							>
								<svg class="w-5 h-5 text-white transition-transform {expandedSections.has(sectionIndex) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
								</svg>
							</button>

							<button
								onclick={() => handleDeleteSection(section.id.toString())}
								class="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
								aria-label="Delete section"
							>
								<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
								</svg>
							</button>
						</div>
					</div>

					{#if expandedSections.has(sectionIndex)}
						<div class="bg-slate-50 p-5">
							<!-- Items -->
							<div class="space-y-2">
								<div class="flex items-center justify-between mb-3">
									<h3 class="text-sm font-semibold text-slate-700 flex items-center gap-2">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
										</svg>
										Items ({section.items?.length || 0})
									</h3>

									<button
										onclick={() => onItemCreate(section.id.toString())}
										class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
									>
										<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
										</svg>
										Add Item
									</button>
								</div>

								{#if !section.items || section.items.length === 0}
									<div class="text-center py-8 bg-white rounded-lg border-2 border-dashed border-slate-300">
										<svg class="w-10 h-10 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
										</svg>
										<p class="text-sm text-slate-500">No items in this section</p>
									</div>
								{:else}
									{#each section.items as item, itemIndex (item.uuid || item.id || `item-${sectionIndex}-${itemIndex}`)}
										<div
											role="listitem"
											draggable="true"
											ondragstart={() => handleItemDragStart(sectionIndex, itemIndex)}
											ondragover={(e) => handleItemDragOver(e, sectionIndex, itemIndex)}
											ondragend={() => handleItemDragEnd(sectionIndex)}
											class="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all {draggedItem?.sectionIndex === sectionIndex && draggedItem?.itemIndex === itemIndex ? 'opacity-50 scale-95' : ''}"
										>
											<div class="flex items-start gap-3">
												<button
													aria-label="Drag to reorder item"
													class="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded transition-colors mt-1"
												>
													<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
													</svg>
												</button>

												<div class="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold mt-1">
													{item.orderIndex}
												</div>

												<div class="flex-1">
													{#if editingContent && editingContent.type === 'item' && editingContent.id === item.id?.toString()}
														<textarea
															bind:value={editingContent.value}
															class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
															rows="3"
															onkeydown={handleKeyDown}
														></textarea>
														<div class="flex gap-2 mt-2">
															<button
																onclick={saveContent}
																class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
															>
																Save
															</button>
															<button
																onclick={cancelEditing}
																class="px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
															>
																Cancel
															</button>
														</div>
													{:else}
														<p
															class="text-slate-900 cursor-pointer hover:bg-slate-50 p-2 rounded"
															onclick={() => startEditingContent('item', item.id.toString(), item.content || '')}
														>
															{item.content || 'Click to add content'}
														</p>
													{/if}

													<!-- Sub-items -->
													{#if item.subItems && item.subItems.length > 0}
														<div class="mt-3 ml-4 space-y-2">
															<button
																onclick={() => toggleItem(item.id!.toString())}
																class="text-xs font-semibold text-slate-600 flex items-center gap-1"
																aria-label={expandedItems.has(item.id!.toString()) ? "Collapse sub-items" : "Expand sub-items"}
															>
																<svg class="w-3 h-3 transition-transform {expandedItems.has(item.id.toString()) ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
																</svg>
																Sub-items ({item.subItems.length})
															</button>

															{#if expandedItems.has(item.id.toString())}
																{#each item.subItems as subItem, subItemIndex (subItem.uuid || subItem.id || `subitem-${itemIndex}-${subItemIndex}`)}
																	<div
																		role="listitem"
																		draggable="true"
																		ondragstart={() => handleSubItemDragStart(sectionIndex, itemIndex, subItemIndex)}
																		ondragover={(e) => handleSubItemDragOver(e, sectionIndex, itemIndex, subItemIndex)}
																		ondragend={() => handleSubItemDragEnd(sectionIndex, itemIndex)}
																		class="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-blue-300 transition-all {draggedSubItem?.subItemIndex === subItemIndex ? 'opacity-50' : ''}"
																	>
																		<div class="flex items-start gap-2">
																			<button
																				aria-label="Drag to reorder sub-item"
																				class="cursor-grab active:cursor-grabbing p-1"
																			>
																				<svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
																				</svg>
																			</button>

																			<div class="flex-1">
																				{#if editingContent && editingContent.type === 'subItem' && editingContent.id === subItem.id?.toString()}
																					<textarea
																						bind:value={editingContent.value}
																						class="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 resize-none"
																						rows="2"
																						onkeydown={handleKeyDown}
																					></textarea>
																					<div class="flex gap-2 mt-1">
																						<button
																							onclick={saveContent}
																							class="px-2 py-0.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
																						>
																							Save
																						</button>
																						<button
																							onclick={cancelEditing}
																							class="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
																						>
																							Cancel
																						</button>
																					</div>
																				{:else}
																					<p
																						class="text-sm text-slate-700 cursor-pointer hover:bg-white p-1 rounded"
																						onclick={() => startEditingContent('subItem', subItem.id.toString(), subItem.content || '')}
																					>
																						{subItem.content || 'Click to add content'}
																					</p>
																				{/if}
																			</div>

																			<button
																				onclick={() => handleDeleteSubItem(item.id.toString(), subItem.id.toString())}
																				class="flex-shrink-0 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
																				aria-label="Delete sub-item"
																			>
																				<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
																				</svg>
																			</button>
																		</div>
																	</div>
																{/each}
															{/if}
														</div>
													{/if}

													<button
														onclick={() => onSubItemCreate(item.id.toString())}
														class="mt-2 ml-4 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
													>
														<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
														</svg>
														Add Sub-item
													</button>
												</div>

												<div class="flex flex-col gap-2">
													<button
														onclick={() => onItemUpdate(item.id.toString(), { published: item.published ? null : new Date() })}
														class={`flex-shrink-0 p-2 ${item.published ? 'text-green-600 hover:bg-green-50' : 'text-gray-600 hover:bg-gray-50'} rounded-lg transition-colors mt-1`}
														aria-label={item.published ? "Unpublish item" : "Publish item"}
													>
														<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
														</svg>
													</button>

													<button
														onclick={() => handleDeleteItem(item.id.toString())}
														class="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
														aria-label="Delete item"
													>
														<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
														</svg>
													</button>
												</div>
											</div>
										</div>
									{/each}
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>