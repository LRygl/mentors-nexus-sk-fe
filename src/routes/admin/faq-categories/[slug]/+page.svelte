<!-- src/routes/admin/faq-categories/[id]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		Edit3, Save, X, Plus, Search, Filter, MoreHorizontal,
		Eye, EyeOff, Hash, MessageSquare,	Settings, ExternalLink, BarChart3
	} from '@lucide/svelte';
	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte'
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';
	import IconSelector from '$lib/components/UI/IconSelector.svelte';
	import type { FAQCategory } from '$lib/types/entities/faqCategory';
	import MetadataDisplay from '$lib/components/UI/MetadataDisplay.svelte';
	import MetadataTag from '$lib/components/UI/MetadataTag.svelte';

	// Get category ID from URL params
	const categoryId = $page.params.id;

	let category = $state<FAQCategory | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Component state
	let isEditing = $state(false);
	let showDeleteModal = $state(false);
	let activeTab = $state('overview');

	onMount(async () => {
		try {
			const storeCategory = faqCategoryStore.data.find(c=>c.id === categoryId);
			if(storeCategory) {
				category = storeCategory;
				loading = false;
				faqCategoryStore.loadCategory(categoryId).catch(console.error);
			} else {
				await faqCategoryStore.loadCategory(categoryId);
				category = faqCategoryStore.selectedCategory;
				loading = false;
			}
		} catch (error) {
				error = 'Failed to load category data';
				loading = false;
		}
	})

	$effect(() => {
		const updated = faqCategoryStore.data.find(c=>c.id === categoryId);
		if (updated) {
			category = updated;
		}
	})

	// Edit form data
	let editForm = $state({
		name: category.name,
		description: category.description,
		iconClass: category.iconClass,
		colorCode: category.colorCode,
		displayOrder: category.displayOrder,
		isActive: category.isActive,
		isVisible: category.isVisible,
		metaDescription: category.metaDescription || '',
		metaKeywords: category.metaKeywords || ''
	});

	// Mock FAQ data for the category
	let categoryFAQs = $state([
		{
			id: 1,
			question: "How do I update my billing information?",
			isPublished: true,
			views: 245,
			lastUpdated: "2025-08-10"
		},
		{
			id: 2,
			question: "What payment methods do you accept?",
			isPublished: true,
			views: 189,
			lastUpdated: "2025-08-09"
		},
		{
			id: 3,
			question: "How can I cancel my subscription?",
			isPublished: false,
			views: 156,
			lastUpdated: "2025-08-08"
		},
		{
			id: 4,
			question: "How do I download my invoice?",
			isPublished: true,
			views: 98,
			lastUpdated: "2025-08-07"
		}
	]);

	// Tabs configuration
	const tabs = [
		{ id: 'overview', label: 'Overview', icon: Eye },
		{ id: 'faqs', label: 'FAQs', icon: MessageSquare },
		{ id: 'settings', label: 'Settings', icon: Settings },
		{ id: 'analytics', label: 'Analytics', icon: BarChart3 }
	];

	// Functions (placeholder for real implementation)
	function handleEdit() {
		isEditing = true;
	}

	function handleSave() {
		// Update category with editForm data
		Object.assign(category, editForm);
		isEditing = false;
	}

	function handleCancel() {
		// Reset form data
		editForm = {
			name: category.name,
			description: category.description,
			iconClass: category.iconClass,
			colorCode: category.colorCode,
			displayOrder: category.displayOrder,
			isActive: category.isActive,
			isVisible: category.isVisible,
			metaDescription: category.metaDescription || '',
			metaKeywords: category.metaKeywords || ''
		};
		isEditing = false;
	}

	function handleDelete() {
		showDeleteModal = true;
	}

	function confirmDelete() {
		// Delete category and redirect
		goto('/admin/faq-categories');
	}

	function handleDuplicate() {
		// Duplicate category logic
		console.log('Duplicate category');
	}

	onMount(() => {
		// In real implementation, load category data from store or API
		// faqCategoryStore.loadCategory(categoryId);
	});
</script>

<svelte:head>
	<title>{category.name} - FAQ Category | Admin</title>
</svelte:head>

<!-- Main Container -->
<div class="min-h-screen">
	<div class=" mx-auto px-4 sm:px-6 lg:px-8 py-8">

		<!-- Header Section -->
		<div class="mb-8">

			<!-- Category Header -->
			<div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
				<div class="p-6">
					<div class="flex items-start justify-between">
						<!-- Category Info -->
						<div class="flex items-center gap-4">
							<div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-white/50" style="background-color: {category.colorCode}">
								<DynamicIcon iconName={category.iconClass} class="text-white" size={32} />
							</div>
							<div>
								<div class="flex items-center gap-3 mb-2">
									<h1 class="text-3xl font-bold text-slate-900">{category.name}</h1>
									<div class="flex gap-2">
										<!-- TODO - Make Component -->
										{#if category.isActive}
											<MetadataTag
												data={[{hasIcon:false, value:'Active'}]}
											/>
										{/if}
										<!-- TODO - Make Component -->
										{#if category.isVisible}
											<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
												<Eye class="w-3 h-3 mr-1" />
												Visible
											</span>
										{/if}
									</div>
								</div>
								<p class="text-slate-600 max-w-2xl">{category.description}</p>
								<MetadataDisplay
									variant="row"
									metadata={
										[
											{icon:'Hash',description:'Order',value: category.displayOrder.toString() },
											{icon:'Calendar',description:'Created',value: category.createdAt.toString() } ,
										]
									}
								/>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="flex items-center gap-3">
							{#if !isEditing}
								<button
									onclick={handleEdit}
									class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-lg hover:shadow-xl"
								>
									<Edit3 class="w-4 h-4" />
									Edit Category
								</button>
								<div class="relative">
									<button class="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium">
										<MoreHorizontal class="w-4 h-4" />
									</button>
									<!-- Dropdown menu would go here -->
								</div>
							{:else}
								<button
									onclick={handleSave}
									class="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
								>
									<Save class="w-4 h-4" />
									Save Changes
								</button>
								<button
									onclick={handleCancel}
									class="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
								>
									<X class="w-4 h-4" />
									Cancel
								</button>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Tab Navigation -->
		<div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
			<div class="border-b border-slate-200">
				<nav class="flex space-x-8 px-6" aria-label="Tabs">
					{#each tabs as tab}
						<button
							onclick={() => activeTab = tab.id}
							class="flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}"
						>
							<svelte:component this={tab.icon} class="w-4 h-4" />
							{tab.label}
						</button>
					{/each}
				</nav>
			</div>

			<!-- Tab Content -->
			<div class="p-6">
				{#if activeTab === 'overview'}
					<!-- Overview Tab -->
					{#if isEditing}
						<!-- Edit Form -->
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<!-- Left Column -->
							<div class="space-y-6">
								<div>
									<label class="block text-sm font-medium text-slate-700 mb-2">Category Name</label>
									<input
										type="text"
										bind:value={editForm.name}
										class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
										placeholder="Enter category name"
									/>
								</div>

								<div>
									<label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
									<textarea
										bind:value={editForm.description}
										rows="4"
										class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
										placeholder="Enter category description"
									></textarea>
								</div>

								<div class="grid grid-cols-2 gap-4">
									<div>
										<label class="block text-sm font-medium text-slate-700 mb-2">Display Order</label>
										<input
											type="number"
											bind:value={editForm.displayOrder}
											min="1"
											class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-slate-700 mb-2">Color</label>
										<div class="flex gap-3">
											<input
												type="color"
												bind:value={editForm.colorCode}
												class="w-12 h-12 rounded-xl border border-slate-300 cursor-pointer"
											/>
											<input
												type="text"
												bind:value={editForm.colorCode}
												class="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
											/>
										</div>
									</div>
								</div>
							</div>

							<!-- Right Column -->
							<div class="space-y-6">
								<IconSelector
									selectedIcon={editForm.iconClass}
									onselect={(iconName) => editForm.iconClass = iconName}
									label="Category Icon"
									previewColor={editForm.colorCode}
								/>

								<div class="space-y-4">
									<label class="text-sm font-medium text-slate-700">Status</label>
									<div class="space-y-3">
										<label class="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
											<div class="flex items-center gap-3">
												<Eye class="w-5 h-5 text-slate-600" />
												<div>
													<span class="text-sm font-medium text-slate-800">Active</span>
													<p class="text-xs text-slate-500">Category is available for use</p>
												</div>
											</div>
											<input
												type="checkbox"
												bind:checked={editForm.isActive}
												class="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
											/>
										</label>

										<label class="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
											<div class="flex items-center gap-3">
												{#if editForm.isVisible}
													<Eye class="w-5 h-5 text-slate-600" />
												{:else}
													<EyeOff class="w-5 h-5 text-slate-400" />
												{/if}
												<div>
													<span class="text-sm font-medium text-slate-800">Visible</span>
													<p class="text-xs text-slate-500">Show in public category lists</p>
												</div>
											</div>
											<input
												type="checkbox"
												bind:checked={editForm.isVisible}
												class="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
											/>
										</label>
									</div>
								</div>

								<div>
									<label class="block text-sm font-medium text-slate-700 mb-2">Meta Description</label>
									<textarea
										bind:value={editForm.metaDescription}
										rows="3"
										class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
										placeholder="SEO meta description"
									></textarea>
								</div>

								<div>
									<label class="block text-sm font-medium text-slate-700 mb-2">Meta Keywords</label>
									<input
										type="text"
										bind:value={editForm.metaKeywords}
										class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
										placeholder="keyword1, keyword2, keyword3"
									/>
								</div>
							</div>
						</div>
					{:else}
						<!-- View Mode -->
						<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
							<!-- Stats Cards -->
							<div class="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
								<div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
									<div class="flex items-center justify-between">
										<div>
											<p class="text-sm font-medium text-blue-600">Total FAQs</p>
											<p class="text-3xl font-bold text-blue-900">{category.faqCount}</p>
										</div>
										<MessageSquare class="w-8 h-8 text-blue-600" />
									</div>
								</div>

								<div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
									<div class="flex items-center justify-between">
										<div>
											<p class="text-sm font-medium text-green-600">Published</p>
											<p class="text-3xl font-bold text-green-900">{category.publishedFaqCount}</p>
										</div>
										<Eye class="w-8 h-8 text-green-600" />
									</div>
								</div>

								<div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
									<div class="flex items-center justify-between">
										<div>
											<p class="text-sm font-medium text-purple-600">Order</p>
											<p class="text-3xl font-bold text-purple-900">#{category.displayOrder}</p>
										</div>
										<Hash class="w-8 h-8 text-purple-600" />
									</div>
								</div>

								<div class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
									<div class="flex items-center justify-between">
										<div>
											<p class="text-sm font-medium text-orange-600">Color</p>
											<p class="text-sm font-bold text-orange-900 font-mono">{category.colorCode}</p>
										</div>
										<div class="w-8 h-8 rounded-lg border-2 border-white shadow-md" style="background-color: {category.colorCode}"></div>
									</div>
								</div>
							</div>

							<!-- Category Details -->
							<div class="lg:col-span-2 space-y-6">
								<div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
									<h3 class="text-lg font-semibold text-slate-900 mb-4">Category Information</h3>
									<dl class="space-y-4">
										<div>
											<dt class="text-sm font-medium text-slate-500">Name</dt>
											<dd class="text-lg text-slate-900">{category.name}</dd>
										</div>
										<div>
											<dt class="text-sm font-medium text-slate-500">Description</dt>
											<dd class="text-slate-900">{category.description}</dd>
										</div>
										<div>
											<dt class="text-sm font-medium text-slate-500">Slug</dt>
											<dd class="text-slate-900 font-mono">{category.slug}</dd>
										</div>
										<div>
											<dt class="text-sm font-medium text-slate-500">Full URL</dt>
											<dd class="text-slate-900">
												<a href={category.fullUrl} class="text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
													{category.fullUrl}
													<ExternalLink class="w-4 h-4" />
												</a>
											</dd>
										</div>
									</dl>
								</div>

								<div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
									<h3 class="text-lg font-semibold text-slate-900 mb-4">SEO Information</h3>
									<dl class="space-y-4">
										<div>
											<dt class="text-sm font-medium text-slate-500">Meta Description</dt>
											<dd class="text-slate-900">{category.metaDescription || 'Not set'}</dd>
										</div>
										<div>
											<dt class="text-sm font-medium text-slate-500">Meta Keywords</dt>
											<dd class="text-slate-900">{category.metaKeywords || 'Not set'}</dd>
										</div>
									</dl>
								</div>
							</div>

							<!-- Metadata -->
							<div class="space-y-6">
								<div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
									<h3 class="text-lg font-semibold text-slate-900 mb-4">Metadata</h3>
									<MetadataDisplay
										variant="column"
										metadata={[
											{ icon:'Calendar',description:'Created', value: category.createdAt.toString() },
											{ icon:'User',description:'Created By', value: category.createdAt.toString() },
											{ icon:'User',description:'Updated', value: category.createdAt.toString() },
											{ icon:'User',description:'Updated By', value: category.createdAt.toString() }
										]}
									/>
								</div>

							</div>
						</div>
					{/if}

				{:else if activeTab === 'faqs'}
					<!-- FAQs Tab -->
					<div class="space-y-6">
						<!-- FAQs Header -->
						<div class="flex items-center justify-between">
							<div>
								<h3 class="text-xl font-semibold text-slate-900">Category FAQs</h3>
								<p class="text-slate-600 mt-1">Manage frequently asked questions for this category</p>
							</div>
							<button class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium">
								<Plus class="w-4 h-4" />
								Add FAQ
							</button>
						</div>

						<!-- Search and Filter -->
						<div class="flex gap-4">
							<div class="flex-1 relative">
								<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
								<input
									type="text"
									placeholder="Search FAQs..."
									class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
								/>
							</div>
							<button class="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium">
								<Filter class="w-4 h-4" />
								Filter
							</button>
						</div>

						<!-- FAQs List -->
						<div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
							<div class="overflow-x-auto">
								<table class="w-full">
									<thead class="bg-slate-50 border-b border-slate-200">
									<tr>
										<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Question</th>
										<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
										<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Views</th>
										<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Updated</th>
										<th class="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
									</tr>
									</thead>
									<tbody class="divide-y divide-slate-100">
									{#each categoryFAQs as faq}
										<tr class="hover:bg-slate-50 transition-colors">
											<td class="px-6 py-4">
												<div class="text-sm font-medium text-slate-900">{faq.question}</div>
											</td>
											<td class="px-6 py-4">
												{#if faq.isPublished}
														<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
															<div class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
															Published
														</span>
												{:else}
														<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
															<div class="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></div>
															Draft
														</span>
												{/if}
											</td>
											<td class="px-6 py-4">
												<div class="text-sm text-slate-900">{faq.views}</div>
											</td>
											<td class="px-6 py-4">
												<div class="text-sm text-slate-500">{faq.lastUpdated}</div>
											</td>
											<td class="px-6 py-4 text-right">
												<button class="text-slate-400 hover:text-slate-600 transition-colors">
													<MoreHorizontal class="w-5 h-5" />
												</button>
											</td>
										</tr>
									{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>

				{:else if activeTab === 'settings'}
					<!-- Settings Tab -->
					<div class="space-y-8">
						<div>
							<h3 class="text-xl font-semibold text-slate-900 mb-6">Category Settings</h3>

							<div class="space-y-6">
								<!-- URL Settings -->
								<div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
									<h4 class="text-lg font-medium text-slate-900 mb-4">URL & SEO Settings</h4>
									<div class="space-y-4">
										<div>
											<label class="block text-sm font-medium text-slate-700 mb-2">Category Slug</label>
											<input
												type="text"
												value={category.slug}
												class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
												readonly
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/if}
			</div>
		</div>
	</div>
</div>
