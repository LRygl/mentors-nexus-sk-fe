<!-- src/routes/admin/faq/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { faqStore } from '$lib/stores/defaults/faqStore.svelte';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import { faqCategoryTableColumns, faqCategoryTableConfig } from '../faq-categories/fatCategoryTableConfig';
	import { getFAQCategoryActions } from '../faq-categories/faqCategoryActions';
	import UniversalDataTable from '$lib/components/UI/UniversalDataTable.svelte';
	import { FAQTableConfigs } from '../faq-categories/FAQTableConfigs';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import type { FAQ } from '$lib/types';
	import { goto } from '$app/navigation';

	let selectedItems = $state<Set<string>>(new Set());


	// Load data
	onMount(async () => {
		await faqStore.getAllFAQs(true);
		console.log(faqStore.data);
	});

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

			}
		},
	}


</script>

<!-- Main Container -->
<section class="h-dvh m-5">

	<!-- Header Section -->
	<AdminHeaderSection
		heading="FAQs"
		subHeading="Manage your frequently asked questions"
	/>

	<!-- FAQ Data Table -->
	<UniversalDataTable
		data={faqStore.data}
		loading={faqStore.loading}
		error={faqStore.error}
		config={FAQTableConfigs.FAQTableConfig()}
		columns={FAQTableConfigs.FAQTableColumnsConfig()}
		callbacks={tableActionCallbacks}
		bind:selectedItems={selectedItems}
		getActions={FAQTableConfigs.FAQTableActionsConfig}
		searchable={true}
		filterable={true}
		selectable={true}
		exportable={true}
		searchPlaceholder="Search categories..."
		emptyTitle="No FAQs yet"
		emptyDescription="Get started by creating your first FAQ category. Categories help organize your frequently asked questions for better user experience."
		emptyActionLabel="Create Your First Category"
	/>

</section>