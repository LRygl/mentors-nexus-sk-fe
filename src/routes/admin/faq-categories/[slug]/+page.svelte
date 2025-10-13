<!-- src/routes/Admin/faq-categories/[id]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte'
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import AdminSubHeadingSection from '$lib/components/Sections/Admin/AdminSubHeadingSection.svelte';
	import { goto } from '$app/navigation';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import type { FAQ } from '$lib/types';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import { faqStore } from '$lib/stores/defaults/faqStore.svelte';
	import { createFAQLinkFormSchema } from '$lib/components/Forms/Schemas/FAQLinkFormSchema';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import { FAQListTablePreset } from '$lib/components/Data Table/Configurations/FAQCategoryFAQsConfiguration';

	// Get category ID from URL params
	const categoryId = page.params.slug as string;

	// Application State
	let loading = $state<boolean>(false);
	let error = $state<string | null>(null);
	let selectedItems = $state<Set<string>>(new Set());

	// Modal and Link Form State
	let isLinkModalOpen = $state(false); // Renamed for clarity
	let formRef: any;

	// Derived FAQs from category - this automatically updates when category changes
	const category = $derived(faqCategoryStore.data.find(c => c.id === categoryId) || null);
	const faqs = $derived.by(() => {
		if (!category?.faqs) return [];

		return category.faqs.map(faq => ({
			...faq,
			category: {
				id: category.id,
				uuid: category.uuid,
				name: category.name,
				slug: category.slug
			}
		}));
	});

	console.log("RETURNED FAQ LIST", faqs)

	console.log("RETURNED FAQ LIST",faqs)

	const availableFAQs = $derived.by(() => {
		if (faqStore.data.length === 0) {
			return [];
		}

		const linkedUuids = new Set(faqs.map(f => f.uuid));
		const filtered = faqStore.data.filter(faq =>
			!faq.isPublished &&
			!faq.category &&
			!linkedUuids.has(faq.uuid)
		);

		console.log('📋 Available FAQs for linking:', filtered.length);
		return filtered;
	});

	// Form schema
	const linkFormSchema = $derived(createFAQLinkFormSchema(faqs));

	// Data table configuration
	const tableConfig = FAQListTablePreset.all();

	onMount(async () => {
		if (!categoryId) {
			error = 'No category ID provided';
			return
		}
		await Promise.allSettled([
			loadCategoryData(),
			loadAllFAQs()
		]);
	});


	async function loadCategoryData(): Promise<void> {
		loading = true
		error = null;

		try {
			const categoryExistsInStore = faqCategoryStore.data.find(c => c.id === categoryId);
			if(categoryExistsInStore) {
				// Background data refresh
				await faqCategoryStore.fetchItem(categoryId!).catch(console.error);
			} else {
				// Fetch from API
				await faqCategoryStore.fetchItem(categoryId!);
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load category data';
			console.error('Failed to load category:', e);
		} finally {
			loading = false;
		}
	}

	async function loadAllFAQs(): Promise<void> {
		try {
			await faqStore.fetchAll();
		} catch (e) {
			console.error('Failed to load FAQs:', e);
			error = e instanceof Error ? e.message : 'Failed to load FAQs';
		}
	}

	const tableActionCallbacks: TableCallbacks<FAQ> = {
			onRowClick: (faq) => {
				goto(`/admin/faq/${faq.id}`);
			},

			onAction: async (actionId, faq) => {
				switch (actionId) {
					case 'view':
						await goto(`/admin/faq/${faq.id}`);
						break;
					case 'edit':
						await goto(`/admin/faq/${faq.id}`);
						break;
					case 'unlink-faq':
						await handleUnlinkFAQFromCategory(faq.uuid)
				}
			},

			onCreate: openLinkModal,

	}

	async function handleUnlinkFAQFromCategory(faqUuid: string) {
		if (!category || loading) return;

		try {
			const unlinkedFaq = await faqCategoryStore.unlinkFAQFromFAQCategory(categoryId, faqUuid);

			// Update the FAQ in the main store to reflect it's now available to link again
			faqStore.updateItemInStore(faqUuid, unlinkedFaq);
			// Fetch the single category to refresh the store data
			await faqCategoryStore.fetchItem(categoryId);
			// Remove from local selection if selected
			if (selectedItems.has(faqUuid)) {
				selectedItems = new Set([...selectedItems].filter(id => id !== faqUuid));
			}

			toastService.success('Success', 'FAQ unlinked from category');
		} catch (error) {
			console.error('Failed to unlink FAQ:', error);
			toastService.error('Error', 'Failed to unlink FAQ');
		}
	}


	// Modal Handling

	async function openLinkModal() {
		isLinkModalOpen = true;
	}

	function closeLinkModal() {
		isLinkModalOpen = false;
		formRef?.reset();
	}

	async function handleValidLinkSubmit(data: { faqUuid: string }) {
		if (!data.faqUuid || !category) return;

		try {
			const linkedFaq = await faqCategoryStore.linkFAQToFAQCategory(data.faqUuid, category.uuid);

			if (linkedFaq && linkedFaq.id) {
				// Update the FAQ in the main store - optimistic update handled by BaseStore
				faqStore.updateItemInStore(data.faqUuid, linkedFaq);
				// Fetch the single category to refresh the store data
				await faqCategoryStore.fetchItem(categoryId);
				closeLinkModal();
				toastService.success('Success', `FAQ "${linkedFaq.question}" was linked successfully`);
			}
		} catch (error) {
			console.error('Error linking FAQ:', error);
			toastService.error('Error', 'Failed to link FAQ to category');
		}
	}

	// Form callbacks
	const formCallbacks = {
		onSubmit: handleValidLinkSubmit
	};

	// Modal submit handler
	function handleLinkSubmit(event: Event) {
		event.preventDefault();
		formRef?.submit();
	}

</script>

<svelte:head>
	{#if category}
		<title>{category.name} - FAQ Category | Admin</title>
		<meta name="description" content={category.metaDescription || `Manage ${category.name} FAQ category`} />
	{/if}
</svelte:head>



<section class="h-dvh m-5">
	<!-- Display category data if present -->
	{#if category}
		<AdminHeaderSection
			heading={category.name}
			subHeading={category.description}
		/>

		<form class="mb-8">
			<div class="space-y-12 bg-white p-5 rounded-md shadow-xs">
				<div class="border-b border-white/10 pb-12">
					<AdminSubHeadingSection heading="Item Details"/>
					<div class="mt-6 grid grid-cols-2 gap-x-6 gap-y-8">
						<div class="sm:col-span-1">
							<label for="username" class="block text-sm/6 font-medium text-primary">Category ID</label>
							<div class="mt-2">
								<div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-primary focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
									<input id="username" type="text" name="id" value={category.id} placeholder="User ID" class="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-primary placeholder:text-gray-500 focus:outline-none sm:text-sm/6" />
								</div>
							</div>
						</div>
						<div class="sm:col-span-1">

						</div>
						<div class="sm:col-span-1">
							<label for="username" class="block text-sm/6 font-medium text-primary">Category GUID</label>
							<div class="mt-2">
								<div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-primary focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
									<input id="username" type="text" name="id" value={category.uuid} placeholder="User ID" class="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-primary placeholder:text-gray-500 focus:outline-none sm:text-sm/6" />
								</div>
							</div>
						</div>
						<div class="sm:col-span-1"></div>
						<div class="sm:col-span-1">
							<label for="username" class="block text-sm/6 font-medium text-primary">Category Name</label>
							<div class="mt-2">
								<div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-primary focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
									<input id="username" type="text" name="id" value={category.name} placeholder="User ID" class="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-primary placeholder:text-gray-500 focus:outline-none sm:text-sm/6" />
								</div>
							</div>
						</div>
						<div class="sm:col-span-1">
							<label for="username" class="block text-sm/6 font-medium text-primary">User ID</label>
							<div class="mt-2">
								<div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-primary focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
									<input id="username" type="text" name="id" value={category.description} placeholder="User ID" class="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-primary placeholder:text-gray-500 focus:outline-none sm:text-sm/6" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>

		<div class="flex flex-row justify-start items-center">
			<AdminHeaderSection heading="Linked FAQs"/>
		</div>

		<!-- Universal Data Table -->
		<UniversalDataTable
			data={faqs}
			loading={loading}
			error={error}
			config={tableConfig.config}
			columns={tableConfig.columns}
			callbacks={tableActionCallbacks}
			bind:selectedItems={selectedItems}
			getActions={tableConfig.getActions}
			{...tableConfig.props}

		/>
	{/if}

</section>

<!-- Create Link FAQ Modal -->
<UniversalCreateModal
	isOpen={isLinkModalOpen}
	title="Link FAQ to Category"
	subtitle="Select an FAQ to add to this category"
	icon="Link2"
	iconBgColor="from-blue-500 to-indigo-600"
	loading={loading || faqStore.loading}
	error={faqCategoryStore.createError}
	submitLabel="Link FAQ"
	onclose={closeLinkModal}
	onsubmit={handleLinkSubmit}
>
	{#snippet children()}
		{#if faqStore.loading}
			<div class="text-center py-6 text-gray-500">
				<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
				<p>Loading FAQs...</p>
			</div>
		{:else if availableFAQs.length === 0}
			<div class="text-center py-6 text-gray-500">
				<p>No FAQs available to link.</p>
				<p class="text-sm mt-1">All FAQs may already be linked to this category.</p>
			</div>
		{:else}
			<UniversalForm
				bind:this={formRef}
				schema={linkFormSchema}
				callbacks={formCallbacks}
				className="space-y-6"
			/>
		{/if}
	{/snippet}
</UniversalCreateModal>