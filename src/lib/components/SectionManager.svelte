<script lang="ts" generics="TSection extends BaseSectionItem, TItem extends BaseItem">

	// Base types that your data must extend
	export interface BaseItem {
		id?: number | string;
		orderIndex: number;
	}

	export interface BaseSectionItem extends BaseItem {
		title: string;
		description?: string;
	}

	export interface SectionManagerProps<TSection, TItem> {
		sections: (TSection & { items: TItem[] })[];
		sectionTitle?: string;
		itemTitle?: string;
		showSectionDescription?: boolean;
		showItemDescription?: boolean;
		collapsible?: boolean;
		defaultExpanded?: boolean;
		onSectionsReorder?: (sections: (TSection & { items: TItem[] })[]) => void;
		onItemsReorder?: (sectionIndex: number, items: TItem[]) => void;
		onAddSection?: () => void;
		onDeleteSection?: (section: TSection & { items: TItem[] }, index: number) => void;
		onAddItem?: (sectionIndex: number) => void;
		onDeleteItem?: (sectionIndex: number, item: TItem, itemIndex: number) => void;
		onSectionUpdate?: (sectionIndex: number, field: keyof TSection, value: any) => void;
		onItemUpdate?: (sectionIndex: number, itemIndex: number, field: keyof TItem, value: any) => void;
	}

	let {
		sections = $bindable(),
		sectionTitle = 'Section',
		itemTitle = 'Item',
		showSectionDescription = true,
		showItemDescription = true,
		collapsible = true,
		defaultExpanded = true,
		onSectionsReorder,
		onItemsReorder,
		onAddSection,
		onDeleteSection,
		onAddItem,
		onDeleteItem,
		onSectionUpdate,
		onItemUpdate
	}: SectionManagerProps<TSection, TItem> = $props();

	let draggedSection = $state<number | null>(null);
	let draggedItem = $state<{ sectionIndex: number; itemIndex: number } | null>(null);
	let expandedSections = $state<Set<number>>(new Set());

	// Initialize expanded sections
	$effect(() => {
		if (defaultExpanded && sections) {
			expandedSections = new Set(sections.map((_, i) => i));
		}
	});

	function toggleSection(index: number) {
		if (!collapsible) return;

		if (expandedSections.has(index)) {
			expandedSections.delete(index);
		} else {
			expandedSections.add(index);
		}
		expandedSections = new Set(expandedSections);
	}

	// Section drag and drop
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

		reorderSections();
	}

	function handleSectionDragEnd() {
		draggedSection = null;
	}

	// Item drag and drop
	function handleItemDragStart(sectionIndex: number, itemIndex: number) {
		draggedItem = { sectionIndex, itemIndex };
	}

	function handleItemDragOver(e: DragEvent, sectionIndex: number, itemIndex: number) {
		e.preventDefault();

		if (!draggedItem || draggedItem.sectionIndex !== sectionIndex) return;
		if (draggedItem.itemIndex === itemIndex) return;

		const section = sections[sectionIndex];
		const newItems = [...section.items];
		const draggedElement = newItems[draggedItem.itemIndex];

		newItems.splice(draggedItem.itemIndex, 1);
		newItems.splice(itemIndex, 0, draggedElement);

		section.items = newItems;
		sections = [...sections];
		draggedItem.itemIndex = itemIndex;

		reorderItems(sectionIndex);
	}

	function handleItemDragEnd() {
		draggedItem = null;
	}

	// Reordering functions
	function reorderSections() {
		sections = sections.map((section, index) => ({
			...section,
			orderIndex: index + 1
		}));

		onSectionsReorder?.(sections);
	}

	function reorderItems(sectionIndex: number) {
		const section = sections[sectionIndex];
		section.items = section.items.map((item, index) => ({
			...item,
			orderIndex: index + 1
		}));

		sections = [...sections];
		onItemsReorder?.(sectionIndex, section.items);
	}

	// Action handlers
	function handleAddSection() {
		onAddSection?.();
	}

	function handleDeleteSection(section: TSection & { items: TItem[] }, index: number) {
		if (confirm(`Are you sure you want to delete this ${sectionTitle.toLowerCase()}?`)) {
			onDeleteSection?.(section, index);
		}
	}

	function handleAddItem(sectionIndex: number) {
		onAddItem?.(sectionIndex);
	}

	function handleDeleteItem(sectionIndex: number, item: TItem, itemIndex: number) {
		if (confirm(`Are you sure you want to delete this ${itemTitle.toLowerCase()}?`)) {
			onDeleteItem?.(sectionIndex, item, itemIndex);
		}
	}

	function handleSectionFieldUpdate(sectionIndex: number, field: keyof TSection, value: any) {
		onSectionUpdate?.(sectionIndex, field, value);
	}

	function handleItemFieldUpdate(sectionIndex: number, itemIndex: number, field: keyof TItem, value: any) {
		onItemUpdate?.(sectionIndex, itemIndex, field, value);
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-xl font-bold text-slate-900">	{sectionTitle}
		</h2>


			{#if onAddSection}
				<button
					onclick={handleAddSection}
					class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
					</svg>
					Add {sectionTitle}
				</button>
			{/if}

	</div>

	{#if sections.length === 0}

			<div class="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
				<svg class="w-12 h-12 mx-auto mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
				</svg>
				<p class="font-medium">No {sectionTitle.toLowerCase()}s yet</p>
				<p class="text-sm mt-1">Click "Add {sectionTitle}" to create your first {sectionTitle.toLowerCase()}</p>
			</div>

	{:else}
		<div class="space-y-3">
			{#each sections as section, sectionIndex (section.id || sectionIndex)}
				<div
					draggable="true"
					ondragstart={() => handleSectionDragStart(sectionIndex)}
					ondragover={(e) => handleSectionDragOver(e, sectionIndex)}
					ondragend={handleSectionDragEnd}
					class="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all {draggedSection === sectionIndex ? 'opacity-50 scale-95' : ''}"
				>
					<!-- Section Header -->
					<div class="bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-3">
						<div class="flex items-center gap-3">
							<button class="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded transition-colors">
								<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
								</svg>
							</button>

							<div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg">
								<span class="text-sm font-bold text-white">{section.orderIndex}</span>
							</div>

							<slot name="section-header" {section} {sectionIndex}>
								<input
									type="text"
									value={section.title}
									oninput={(e) => handleSectionFieldUpdate(sectionIndex, 'title' as keyof TSection, e.currentTarget.value)}
									placeholder="{sectionTitle} Title"
									class="flex-1 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:bg-white/20 focus:ring-2 focus:ring-white/30 transition-all"
								/>
							</slot>

							{#if collapsible}
								<button
									onclick={() => toggleSection(sectionIndex)}
									class="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
								>
									<svg class="w-5 h-5 text-white transition-transform {expandedSections.has(sectionIndex) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
									</svg>
								</button>
							{/if}

							{#if onDeleteSection}
								<button
									onclick={() => handleDeleteSection(section, sectionIndex)}
									class="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
									title="Delete {sectionTitle.toLowerCase()}"
								>
									<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
									</svg>
								</button>
							{/if}
						</div>
					</div>

					{#if !collapsible || expandedSections.has(sectionIndex)}
						<!-- Section Content -->
						<div class="bg-slate-50 p-5">
							{#if showSectionDescription}
								<slot name="section-description" {section} {sectionIndex}>
                  <textarea
										value={section.description || ''}
										oninput={(e) => handleSectionFieldUpdate(sectionIndex, 'description' as keyof TSection, e.currentTarget.value)}
										placeholder="{sectionTitle} Description"
										rows="2"
										class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
									></textarea>
								</slot>
							{/if}

							<!-- Items -->
							<div class="space-y-2">
								<div class="flex items-center justify-between mb-3">
									<h3 class="text-sm font-semibold text-slate-700 flex items-center gap-2">
										<slot name="items-icon">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
											</svg>
										</slot>
										{itemTitle}s ({section.items.length})
									</h3>

									{#if onAddItem}
										<button
											onclick={() => handleAddItem(sectionIndex)}
											class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
										>
											<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
											</svg>
											Add {itemTitle}
										</button>
									{/if}
								</div>

								{#if section.items.length === 0}
									<slot name="items-empty-state" {section} {sectionIndex}>
										<div class="text-center py-8 bg-white rounded-lg border-2 border-dashed border-slate-300">
											<svg class="w-10 h-10 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
											</svg>
											<p class="text-sm text-slate-500">No {itemTitle.toLowerCase()}s in this {sectionTitle.toLowerCase()}</p>
										</div>
									</slot>
								{:else}
									{#each section.items as item, itemIndex (item.id || itemIndex)}
										<div
											draggable="true"
											ondragstart={() => handleItemDragStart(sectionIndex, itemIndex)}
											ondragover={(e) => handleItemDragOver(e, sectionIndex, itemIndex)}
											ondragend={handleItemDragEnd}
											class="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all {draggedItem?.sectionIndex === sectionIndex && draggedItem?.itemIndex === itemIndex ? 'opacity-50 scale-95' : ''}"
										>
											<slot name="item" {item} {itemIndex} {sectionIndex} {section}>
												<div class="flex items-start gap-3">
													<button class="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded transition-colors mt-1">
														<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
														</svg>
													</button>

													<div class="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold mt-1">
														{item.orderIndex}
													</div>

													<div class="flex-1">
														<p class="font-medium text-slate-900">{itemTitle} #{item.orderIndex}</p>
														<p class="text-sm text-slate-500">Customize this in the parent component</p>
													</div>

													{#if onDeleteItem}
														<button
															onclick={() => handleDeleteItem(sectionIndex, item, itemIndex)}
															class="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
															title="Delete {itemTitle.toLowerCase()}"
														>
															<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
															</svg>
														</button>
													{/if}
												</div>
											</slot>
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