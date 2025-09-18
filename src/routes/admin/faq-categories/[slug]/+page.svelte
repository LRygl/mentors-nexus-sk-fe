<!-- src/routes/admin/faq-categories/[id]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte'
	import type { FAQCategory } from '$lib/types/entities/faqCategory';
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';

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
<div class="min-h-screen">
	<div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if category}
			<h1 class="text-3xl font-bold">{category.name}</h1>
			<DynamicIcon iconName={category.iconClass} />
		{:else if loading}
			<p>Loading category…</p>
		{:else}
			<p class="text-red-600">Category not found.</p>
		{/if}
	</div>
</div>