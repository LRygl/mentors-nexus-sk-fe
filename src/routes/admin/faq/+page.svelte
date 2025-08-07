<!-- src/routes/admin/faq/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { faqStore } from '$lib/stores/defaults/faqStore.svelte';
	import { getFAQStatusLabel, getFAQPriorityLabel, getFQAPriorityStyle, getFAQStatusStyle } from '$lib/types';
	import { formatDateTime } from '$lib/utils/dateTimeFormat';
	import {Eye, Plus, X, Clock, AlertCircle, Archive, Settings, Download	} from 'lucide-svelte';
	import ActionDropdown from '$lib/components/ui/ActionDropdown.svelte';
	import { goto } from '$app/navigation';
	import type { FAQ } from '$lib/types';
	import { getFAQActions } from './faqActions';

	// View State
	let selectedFAQs = $state<Set<string>>(new Set());

	// Dropdown state
	let openDropdownId = $state<string | null>(null);

	// Derived states
	const hasData = $derived(faqStore.data.length > 0);
	const isAllSelected = $derived(hasData && selectedFAQs.size === faqStore.data.length);
	const isPartiallySelected = $derived(selectedFAQs.size > 0 && selectedFAQs.size < faqStore.data.length);
	const selectedCount = $derived(selectedFAQs.size);
	const hasSelection = $derived(selectedCount > 0);

	// Load data
	onMount(async () => {
		await faqStore.loadFAQs();
	});

	// Dropdown //
	// Action handlers for the dropdown
	function handleFAQAction(event: { actionId: string; itemId: string }) {
		const { actionId, itemId } = event;
		const faq = faqStore.data.find(f => f.uuid === itemId);

		if (!faq) {
			console.error('FAQ not found:', itemId);
			return;
		}

		switch (actionId) {
			case 'view':
				goto(`/admin/faq/${faq.id}`);
				break;
			case 'edit':
				goto(`/admin/faq/${faq.id}/edit`);
				break;
			case 'duplicate':
				console.log('Duplicate FAQ:', faq.question);
				// TODO: Implement duplication
				break;
			case 'share':
				if (navigator.clipboard) {
					navigator.clipboard.writeText(`${window.location.origin}/faq/${faq.slug || faq.id}`);
					// TODO: Show success toast
				}
				break;
			case 'publish':
				console.log('Publish FAQ:', faq.question);
				break;
			case 'history':
				goto(`/admin/faq/${faq.id}/history`);
				break;
			case 'export':
				console.log('Export FAQ:', faq.question);
				// TODO: Implement export
				break;
			case 'archive':
				if (confirm(`Are you sure you want to archive "${faq.question}"?`)) {
					console.log('Archive FAQ:', faq.question);
					// TODO: Call API to archive
				}
				break;
			case 'delete':
				if (confirm(`Are you sure you want to permanently delete "${faq.question}"?`)) {
					console.log('Delete FAQ:', faq.question);
					// TODO: Call API to delete
				}
				break;
			default:
				console.warn('Unknown action:', actionId);
		}
	}

	// Handle dropdown open/close events (simplified)
	function handleDropdownOpen(event: { itemId: string }) {
		openDropdownId = event.itemId;
	}

	function handleDropdownClose(event: { itemId: string }) {
		console.log('Dropdown closed for:', event.itemId);
		if (openDropdownId === event.itemId) {
			openDropdownId = null;
		}
	}

	// Get actions configuration for each FAQ
	function getFAQActionsConfig(faq: FAQ) {
		// You can customize permissions based on FAQ properties
		const canEdit = faq.status !== 'ARCHIVED';
		const canDelete = faq.status === 'DRAFT';

		return getFAQActions(canEdit, canDelete);
	}

	// Close Dropdown
	function closeAllDropdowns() {
		openDropdownId = null;
	}

	function closeDropdown() {
		openDropdownId = null;
	}

	async function refreshData() {
		await faqStore.refresh();
	}

	// Selection handlers for checkbox handling
	function toggleSelectAll() {
		if (isAllSelected) {
			selectedFAQs = new Set();
		} else {
			selectedFAQs = new Set(faqStore.data.map(faq => faq.uuid));
		}
	}

	function toggleSelectFAQ(uuid: string) {
		const newSelection = new Set(selectedFAQs);
		if (newSelection.has(uuid)) {
			newSelection.delete(uuid);
		} else {
			newSelection.add(uuid);
		}

		selectedFAQs = newSelection;
	}

	// Action Menu Handling
	function handleRowClick(faqId: string) {
		console.log('Navigating to FAQ:', faqId); // Debug log
		goto(`/admin/faq/${faqId}`);
	}

</script>

<!-- Main Container -->
<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
	<div class="max-w-8xl mx-auto p-6">

		<!-- Dashboard Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between mb-6">
				<div>
					<h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						FAQ Command Center
					</h1>
					<p class="text-slate-600 mt-2">Manage, analyze, and optimize your knowledge base</p>
				</div>
				<div class="flex items-center gap-4">
					<!-- Unified Button Group - All Three Buttons -->
					<div class="inline-flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
						<button
							class="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors border-r border-slate-200 text-sm font-medium"
							onclick={() => console.log('Export data')}
						>
							<Download class="w-4 h-4" />
							Export
						</button>
						<button
							class="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors border-r border-slate-200 text-sm font-medium"
							onclick={() => console.log('Settings')}
						>
							<Settings class="w-4 h-4" />
							Settings
						</button>
						<button
							class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
							onclick={() => console.log('Create FAQ')}
						>
							<Plus class="w-4 h-4" />
							Create FAQ
						</button>
					</div>
				</div>
			</div>
		</div>


		<!-- Main Content Area -->
		<div class="grid grid-cols-1 gap-6">

			<!-- Main Content -->
			<div class="col-span-1">

				<!-- Content Area -->
				{#if faqStore.error}
					<div class="bg-red-50 border border-red-200 rounded-2xl p-8">
						<div class="text-center">
							<AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
							<h3 class="text-lg font-medium text-red-900 mb-2">Error Loading FAQs</h3>
							<p class="text-red-700">{faqStore.error}</p>
							<button onclick={refreshData} class="mt-4 btn-secondary">
								Try Again
							</button>
						</div>
					</div>

				{:else if faqStore.loading}

					<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
						<div class="text-center">
							<div
								class="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
							<p class="text-slate-600">Loading your FAQs...</p>
						</div>
					</div>

				{:else if faqStore.isEmpty}

					<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
						<div class="text-center max-w-md mx-auto">
							FAQs Are empty - Create one
						</div>
					</div>

				{:else}

					<!-- FAQ Content -->
					<div class="bg-white rounded-md shadow-sm border border-slate-200 overflow-visible">
						<!-- Results Header -->
						<div class="px-6 py-4 bg-slate-50 border-b border-slate-200">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<div class="flex items-center gap-3">
										<!-- Select All Checkbox -->
										<label class="flex items-center gap-2 cursor-pointer">
											<div class="relative">
												<input
													type="checkbox"
													checked={isAllSelected}
													indeterminate={isPartiallySelected}
													onchange={toggleSelectAll}
													class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2 transition-all duration-200"
												/>
												{#if isPartiallySelected}
													<!-- Custom indeterminate state indicator -->
													<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
														<div class="w-2 h-0.5 bg-indigo-600 rounded-full"></div>
													</div>
												{/if}
											</div>
											<span class="text-sm font-medium text-slate-700">

		</span>
										</label>

										<!-- Selection Actions (only show when FAQs are selected) -->
										{#if selectedFAQs.size > 0}
											<div class="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
												<button
													onclick={() => console.log('Bulk edit:', selectedFAQs)}
													class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
												>
													<Settings class="w-3 h-3" />
													Edit
												</button>
												<button
													onclick={() => console.log('Bulk archive:', selectedFAQs)}
													class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
												>
													<Archive class="w-3 h-3" />
													Archive
												</button>
												<button
													onclick={() => console.log('Bulk delete:', selectedFAQs)}
													class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
												>
													<X class="w-3 h-3" />
													Delete
												</button>
											</div>
										{/if}
									</div>

									<span class="text-sm text-slate-600">
										{faqStore.totalElements} FAQs found
									</span>
								</div>
								<div class="text-sm text-slate-500">
									Page {faqStore.currentPage + 1} of {faqStore.totalPages}
								</div>
							</div>
						</div>

						<!-- List View -->
						<div class="divide-y divide-slate-200 overflow-visible relative">
							<!-- Replace your existing FAQ list item with this enhanced version -->
							{#each faqStore.data as faq, index (faq.uuid)}
								<button
									type="button"
									class="w-full p-6 hover:bg-slate-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
									onclick={() => handleRowClick(faq.id)}
								>
									<div class="flex items-start gap-4">
										<!-- Checkbox -->
										<div
											class="flex items-center mt-1"
											onclick={(e) => e.stopPropagation()}
											role="none"
										>
											<input
												type="checkbox"
												checked={selectedFAQs.has(faq.uuid)}
												onchange={() => toggleSelectFAQ(faq.uuid)}
												onclick={(e) => e.stopPropagation()}
												class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
												aria-label={`Select FAQ: ${faq.question}`}
											/>
										</div>

										<div class="flex-1 min-w-0">
											<div class="flex items-start justify-between gap-4 mb-3">
												<div class="flex-1">
													<h3 class="text-lg font-medium text-slate-900 mb-1 hover:text-indigo-600 transition-colors">
														{faq.question}
													</h3>
													<p class="text-sm text-slate-600 line-clamp-2">
														{faq.answer}
													</p>
												</div>

												<!-- Reusable Action Dropdown Component -->
												<div onclick={(e) => e.stopPropagation()} role="none">
													<ActionDropdown
														itemId={faq.uuid}
														itemTitle={faq.question}
														actions={getFAQActionsConfig(faq)}
														buttonVariant="outline"
														buttonSize="sm"
														dropdownWidth="w-64"
														position="right"
														isOpen={openDropdownId === faq.uuid}
														onaction={handleFAQAction}
														onopen={handleDropdownOpen}
														onclose={handleDropdownClose}
													/>
												</div>
											</div>

											<!-- FAQ metadata (keep your existing code) -->
											<div class="flex items-center justify-between">
												<div class="flex items-center gap-4">
						<span
							class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-sm border {getFAQStatusStyle(faq.status)}">
							{getFAQStatusLabel(faq.status)}
						</span>
													<span
														class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-sm border {getFQAPriorityStyle(faq.priority)}">
							{getFAQPriorityLabel(faq.priority)}
						</span>
													{#if faq.category?.name}
							<span class="inline-flex items-center px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-sm">
								{faq.category.name}
							</span>
													{/if}
												</div>

												<div class="flex items-center gap-4 text-sm text-slate-500">
													<div class="flex items-center gap-1">
														<Eye class="w-4 h-4" />
														{faq.viewCount.toLocaleString()}
													</div>
													<div class="flex items-center gap-1">
														<Clock class="w-4 h-4" />
														<time>{formatDateTime(faq.createdAt)}</time>
													</div>
												</div>
											</div>
										</div>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>