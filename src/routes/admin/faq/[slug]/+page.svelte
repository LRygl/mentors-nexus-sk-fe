<script lang="ts">
	import { goto } from '$app/navigation';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import { faqStore } from '$lib/stores/defaults/faqStore.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { FAQFormPresets } from '$lib/components/Forms/Schemas/FAQ/FAQFormSchema';

	// Data comes from +page.ts load function
	let { data }: { data: PageData } = $props();

	// Destructure the loaded data
	const { faq, categories } = data;

	// Reactive page heading using $derived
	const pageHeading = $derived('Edit FAQ: ' + faq.question);

	// Prepare initial form data
	const initialFormData = {
		question: faq.question || '',
		answer: faq.answer || '',
		categoryId: faq.category?.id || '',
		isPublished: Boolean(faq.isPublished),
		isFeatured: Boolean(faq.isFeatured),
		status: faq.status || 'DRAFT',
		displayOrder: faq.displayOrder || 0,
		searchKeywords: faq.searchKeywords || '',
		metaDescription: faq.metaDescription || '',
		slug: faq.slug || '',
		priority: faq.priority || 'MEDIUM'
	};



	// Handle successful form submission
	async function handleValidFAQSubmit(data: any) {
		try {
			console.log('Submitting FAQ update:', data);

			// Prepare the update payload for your Spring Boot API
			const updatePayload = {
				question: data.question,
				answer: data.answer,
				categoryId: data.categoryId, // Backend expects categoryId
				status: data.status,
				isPublished: data.isPublished,
				isFeatured: data.isFeatured,
				displayOrder: data.displayOrder,
				searchKeywords: data.searchKeywords,
				metaDescription: data.metaDescription,
				slug: data.slug,
				priority: data.priority
			};

			console.log('API payload:', updatePayload);

			// Call your Spring Boot API
			const response = await fetch(`/api/faqs/${faqId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updatePayload)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to update FAQ');
			}

			const updatedFaq = await response.json();

			// Update local store with server response
			faqStore.updateItem(faqId!, updatedFaq);

			// Success feedback
			alert('FAQ updated successfully!');
			goto('/admin/faqs');

		} catch (error) {
			console.error('Error updating FAQ:', error);
			alert(`Failed to update FAQ: ${error.message}`);
		}
	}

	// Handle form field changes (for debugging and custom logic)
	function handleFieldChange(field: string, value: any) {
		console.log(`Field "${field}" changed to:`, value, `(${typeof value})`);

		// Example: Auto-generate slug from question
		if (field === 'question' && value) {
			const autoSlug = value
				.toLowerCase()
				.replace(/[^\w\s-]/g, '')
				.replace(/\s+/g, '-')
				.substring(0, 50);
			console.log('Auto-generated slug:', autoSlug);
			// You could programmatically update the slug field here if needed
		}

		// Example: Warn if unpublishing
		if (field === 'isPublished' && value === false) {
			console.log('⚠️ FAQ is being unpublished');
		}
	}

	// Form callbacks
	const editFormCallbacks = {
		onSubmit: handleValidFAQSubmit,
		onChange: handleFieldChange
	};

	// Handle cancel action
	function handleCancel() {
		goto('/admin/faqs');
	}
</script>

<!-- Main Container -->
<section class="min-h-dvh m-5">

	<!-- Header Section -->
	<AdminHeaderSection
		heading={pageHeading}
		subHeading="Edit FAQ Details"
	/>

	<!-- Form Section -->
	<div class="mt-6 max-w-4xl">
		{#if faq}

			<!-- Display metadata -->
			<!-- TODO Separate to reusable component -->
			<!-- Professional FAQ Metadata Card -->
			<div class="mb-6 overflow-hidden">
				<!-- Header with gradient -->
				<div class="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h3 class="text-base font-semibold text-white">FAQ Metadata</h3>
							<p class="text-xs text-slate-300">System information and analytics</p>
						</div>
					</div>

					{#if faq.isPopular}
						<div class="flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 border border-amber-400/30 rounded-full backdrop-blur-sm">
							<svg class="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<span class="text-sm font-medium text-amber-200">Popular</span>
						</div>
					{/if}
				</div>

				<!-- Content -->
				<div class="bg-white border-x border-b border-slate-200 rounded-b-xl">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200">
						<!-- ID Card -->
						<div class="bg-white px-6 py-4 group hover:bg-slate-50 transition-colors">
							<div class="flex items-start justify-between">
								<div class="flex-1 min-w-0">
									<dt class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
										ID
									</dt>
									<dd class="text-sm font-mono text-slate-900 truncate" title={faq.id}>
										{faq.id}
									</dd>
								</div>
								<button
									onclick={() => navigator.clipboard.writeText(faq.id)}
									class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-200 rounded"
									title="Copy ID"
								>
									<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
									</svg>
								</button>
							</div>
						</div>

						<!-- UUID Card -->
						<div class="bg-white px-6 py-4 group hover:bg-slate-50 transition-colors">
							<div class="flex items-start justify-between">
								<div class="flex-1 min-w-0">
									<dt class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
										UUID
									</dt>
									<dd class="text-sm font-mono text-slate-900 truncate" title={faq.uuid}>
										{faq.uuid}
									</dd>
								</div>
								<button
									onclick={() => navigator.clipboard.writeText(faq.uuid)}
									class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-200 rounded"
									title="Copy UUID"
								>
									<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
									</svg>
								</button>
							</div>
						</div>

						<!-- Views Card -->
						<div class="bg-white px-6 py-4 hover:bg-slate-50 transition-colors">
							<dt class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
								Total Views
							</dt>
							<dd class="flex items-baseline gap-2">
					<span class="text-2xl font-semibold text-slate-900">
						{faq.viewCount.toLocaleString()}
					</span>
								<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							</dd>
						</div>

						<!-- Helpfulness Card -->
						<div class="bg-white px-6 py-4 hover:bg-slate-50 transition-colors">
							<dt class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
								Helpfulness Rating
							</dt>
							<dd class="space-y-2">
								<div class="flex items-center gap-3">
									<div class="flex items-center gap-1.5">
										<svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
										</svg>
										<span class="text-sm font-semibold text-emerald-600">{faq.helpfulVotes}</span>
									</div>
									<div class="flex items-center gap-1.5">
										<svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
										</svg>
										<span class="text-sm font-semibold text-red-600">{faq.notHelpfulVotes}</span>
									</div>
								</div>
								<div class="flex items-center gap-2">
									<div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
										<div
											class="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
											style="width: {faq.helpfulnessRatio * 100}%"
										></div>
									</div>
									<span class="text-xs font-medium text-slate-600">
							{(faq.helpfulnessRatio * 100).toFixed(0)}%
						</span>
								</div>
							</dd>
						</div>

						<!-- Created Date Card -->
						<div class="bg-white px-6 py-4 hover:bg-slate-50 transition-colors">
							<dt class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
								Created
							</dt>
							<dd class="space-y-0.5">
								<div class="text-sm font-medium text-slate-900">
									{new Date(faq.createdAt).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</div>
								<div class="text-xs text-slate-500">
									{new Date(faq.createdAt).toLocaleTimeString('en-US', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</div>
							</dd>
						</div>

						<!-- Updated Date Card -->
						<div class="bg-white px-6 py-4 hover:bg-slate-50 transition-colors">
							<dt class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
								Last Updated
							</dt>
							<dd class="space-y-0.5">
								<div class="text-sm font-medium text-slate-900">
									{new Date(faq.updatedAt).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</div>
								<div class="text-xs text-slate-500">
									{new Date(faq.updatedAt).toLocaleTimeString('en-US', {
										hour: '2-digit',
										minute: '2-digit'
									})}
									{#if faq.updatedBy}
										<span class="text-slate-400">by</span>
										<span class="text-slate-600 font-medium">{faq.updatedBy}</span>
									{/if}
								</div>
							</dd>
						</div>
					</div>
				</div>
			</div>

			<!-- Edit Form -->
			<UniversalForm
				schema={FAQFormPresets.edit(categories)}
				initialData={initialFormData}
				callbacks={editFormCallbacks}
				submitButtonText="Update FAQ"
				showCancelButton={true}
				onCancel={handleCancel}
			/>

		{:else}
			<div class="p-4 bg-red-50 text-red-700 rounded-lg">
				FAQ not found. <a href="/admin/faqs" class="underline">Return to FAQ list</a>
			</div>
		{/if}
	</div>
</section>