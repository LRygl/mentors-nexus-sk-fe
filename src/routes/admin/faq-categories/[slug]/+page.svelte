<!-- src/routes/admin/faq-categories/[id]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte'
	import type { FAQCategory } from '$lib/types/entities/faqCategory';
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import { type FAQ, FAQPriority, FAQStatus } from '$lib/types';

	// Get category ID from URL params
	const categoryId = page.params.slug;

	let category = $state<FAQCategory | null>(null);
	let faqs = $state<FAQ[] | null>(null);
	let loading = $state<boolean>(false);
	let editMode = $state<boolean>(false);
	let saving = $state<boolean>(false);
	let error = $state<string | null>(null);

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
				// Optionally refresh data from the API in the background
				faqCategoryStore.fetchItem(categoryId!).catch(console.error);
			} else {
				// Fetch from API
				category = await faqCategoryStore.fetchItem(categoryId!);
			}
		} catch (error) {
				error = 'Failed to load category data';
				loading = false;
		} finally {
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
		<meta name="description" content={category.metaDescription || `Manage ${category.name} FAQ category`} />
	{/if}
</svelte:head>

