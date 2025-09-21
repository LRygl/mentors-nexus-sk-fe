<!-- src/routes/admin/faq-categories/[id]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte'
	import type { FAQCategory } from '$lib/types/entities/faqCategory';
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';

	// Get category ID from URL params
	const categoryId = page.params.slug;

	let category = $state<FAQCategory | null>(null);
	let loading = $state<boolean>(false);

	// Set form state with safe defaults
	let editForm = $state({
		name: '',
		description: '',
		iconClass: '',
		colorCode: '',
		displayOrder: 0,
		isActive: false,
		isVisible: false,
		metaDescription: '',
		metaKeywords: ''
	});

	onMount(async () => {
		loading = true;
		console.log("Category page ID = ", categoryId);
		try {
			const storeCategory = faqCategoryStore.data.find(c => c.id === categoryId);
			if(storeCategory) {
				category = storeCategory;
				loading = false;
				// Optionally refresh data from the API in the background
				faqCategoryStore.fetchItem(categoryId!).catch(console.error);
				console.log("category data", category);
			} else {
				// Fetch from API
				await faqCategoryStore.fetchItem(categoryId!);
				category = faqCategoryStore.selectedItem;
				loading = false;
				console.log(category);

			}
		} catch (error) {
				error = 'Failed to load category data';
				loading = false;
		}
	})

	// Reactive update in case store data changes
	$effect(() => {
		if (category) {
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
		}
	});

</script>

<svelte:head>
	{#if category}
		<title>{category.name} - FAQ Category | Admin</title>
	{/if}
</svelte:head>

<!-- Main Container -->
<!-- Main Container -->
<div class="min-h-screen">
	<div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if category}
			<!-- Header Section -->
			<div class="mb-8">
				<AdminHeaderSection
					heading={category.name}
					subHeading="Organize and manage your FAQ categories with ease"
				/>
			</div>
			<h1 class="text-3xl font-bold">{category.name}</h1>
		{:else if loading}
			<div class="flex items-center justify-center min-h-96">
				<div class="text-center">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p class="text-gray-600">Loading category data...</p>
				</div>
			</div>
		{:else}
			<!-- Category Not Found Section -->
			<div class="flex items-center justify-center min-h-96">
				<div class="text-center max-w-md mx-auto">
					<!-- Error Image/Icon -->
					<div class="mb-8">
						<svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 9v2m0 4h.01" />
						</svg>
					</div>

					<!-- Error Heading -->
					<h1 class="text-3xl font-bold text-gray-900 mb-4">
						Category Not Found
					</h1>

					<!-- Error Description -->
					<div class="mb-8">
						<p class="text-lg text-gray-600 mb-2">
							Sorry, we couldn't find the category you're looking for.
						</p>
						<p class="text-sm text-gray-500">
							The category may have been moved, deleted, or the URL might be incorrect.
						</p>
					</div>

					<!-- Action Buttons -->
					<div class="flex flex-col sm:flex-row gap-3 justify-center">
						<!-- Go Back Button -->
						<button
							onclick={() => window.history.back()}
							class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
						>
							<svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							Go Back
						</button>

						<!-- Browse Categories Button -->
						<a
							href="/admin/categories"
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
						>
							<svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
							</svg>
							Browse All Categories
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>