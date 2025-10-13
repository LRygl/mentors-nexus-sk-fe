<script lang="ts">

	// Get category ID from URL params
	import { page } from '$app/state';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import { faqStore } from '$lib/stores/defaults/faqStore.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { createFAQFormSchema } from '$lib/components/Forms/Schemas/FAQFormSchema';
	import type { FAQ, FAQLinkData } from '$lib/types/entities/faq';


	const faqId = page.params.slug;

	let formRef: any;

	const linkFormSchema = $derived(createFAQFormSchema('edit'));
	const faq = faqStore.getItemById(faqId!);
	const pageHeading = 'FAQ ' + faq.question;

	async function handleValidFAQSubmit(data: FAQ) {
		console.log("Update FAQ In store and API");
	}


	// Form callbacks - validation is handled by UniversalForm
	const editFormCallbacks = {
		onSubmit: handleValidFAQSubmit,
		onChange: (field: string, value: any) => {
			if (field === 'isPublished' && !value) {
				// Clear category if needed
			}
		}
	};
</script>

<!-- Main Container -->
<section class="h-dvh m-5">

	<!-- Header Section -->
	<AdminHeaderSection
		heading={pageHeading}
		subHeading="FAQ Details"
	/>

	<UniversalForm
		bind:this={formRef}
		schema={linkFormSchema}
		callbacks={editFormCallbacks}
		initialData={faq}
		className="space-y-6"

	/>

</section>