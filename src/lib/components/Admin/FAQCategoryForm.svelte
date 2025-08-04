<!-- src/lib/components/admin/FAQCategoryForm.svelte -->
<script lang="ts">
	import { faqCategoryAdminStore } from '$lib/stores/faqCategoryAdminStore';
	import type { FAQCategory } from '$lib/types/entities/faq';
	import type { CreateFAQCategoryRequest, UpdateFAQCategoryRequest } from '$lib/api/faqCategoryAdminAPI';
	import * as Icon from 'lucide-svelte';

	// Props
	let {
		category = null,
		mode = 'create',
		onSave = () => {},
		onCancel = () => {}
	}: {
		category?: FAQCategory | null;
		mode?: 'create' | 'edit';
		onSave?: () => void;
		onCancel?: () => void;
	} = $props();

	// Form state
	let formData = $state({
		name: '',
		description: '',
		slug: '',
		iconClass: '',
		colorCode: '#6B7280',
		displayOrder: 0,
		isActive: true,
		isVisible: true,
		metaDescription: '',
		metaKeywords: ''
	});

	// Validation state
	let fieldErrors = $state<Record<string, string>>({});
	let slugValidation = $state<{ isValid: boolean; isChecking: boolean; suggestion?: string }>({
		isValid: true,
		isChecking: false
	});

	// Initialize form data when category changes
	$effect(() => {
		if (category && mode === 'edit') {
			formData = {
				name: category.name,
				description: category.description || '',
				slug: category.slug,
				iconClass: category.iconClass || '',
				colorCode: category.colorCode || '#6B7280',
				displayOrder: category.displayOrder,
				isActive: category.isActive,
				isVisible: category.isVisible,
				metaDescription: category.metaDescription || '',
				metaKeywords: category.metaKeywords || ''
			};
		} else if (mode === 'create') {
			formData = {
				name: '',
				description: '',
				slug: '',
				iconClass: '',
				colorCode: '#6B7280',
				displayOrder: faqCategoryAdminStore.nextDisplayOrder,
				isActive: true,
				isVisible: true,
				metaDescription: '',
				metaKeywords: ''
			};
		}
	});

	// Auto-generate slug from name
	$effect(() => {
		if (mode === 'create' && formData.name && !formData.slug) {
			generateSlugFromName();
		}
	});

	/**
	 * Generate slug from name
	 */
	async function generateSlugFromName() {
		if (!formData.name.trim()) return;

		try {
			const slug = await faqCategoryAdminStore.generateSlug(formData.name);
			formData.slug = slug;
			await validateSlug();
		} catch (error) {
			console.error('Failed to generate slug:', error);
		}
	}

	/**
	 * Validate slug uniqueness
	 */
	async function validateSlug() {
		if (!formData.slug.trim()) {
			slugValidation = { isValid: false, isChecking: false };
			return;
		}

		slugValidation.isChecking = true;

		try {
			const excludeId = mode === 'edit' ? category?.id : undefined;
			const result = await faqCategoryAdminStore.validateSlug(formData.slug, excludeId);
			slugValidation = {
				isValid: result.isValid,
				isChecking: false,
				suggestion: result.suggestion
			};

			if (!result.isValid) {
				fieldErrors.slug = 'This slug is already in use';
			} else {
				delete fieldErrors.slug;
			}
		} catch (error) {
			slugValidation = { isValid: false, isChecking: false };
			console.error('Failed to validate slug:', error);
		}
	}

	/**
	 * Handle slug input changes
	 */
	function handleSlugChange() {
		// Clean the slug
		formData.slug = formData.slug
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');

		// Debounce validation
		clearTimeout(slugValidationTimeout);
		slugValidationTimeout = setTimeout(validateSlug, 500);
	}

	let slugValidationTimeout: ReturnType<typeof setTimeout>;

	function validateForm(): boolean {
		fieldErrors = {};
		let isValid = true;

		// Required fields
		if (!formData.name.trim()) {
			fieldErrors.name = 'Category name is required';
			isValid = false;
		}

		if (!formData.slug.trim()) {
			fieldErrors.slug = 'Slug is required';
			isValid = false;
		}

		if (formData.displayOrder < 0) {
			fieldErrors.displayOrder = 'Display order must be 0 or greater';
			isValid = false;
		}

		// Slug validation
		if (!slugValidation.isValid) {
			fieldErrors.slug = fieldErrors.slug || 'Slug is invalid';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validateForm()) {
			console.warn('Please fix the form errors before submitting');
			return;
		}

		try {
			const categoryData: CreateFAQCategoryRequest | UpdateFAQCategoryRequest = {
				name: formData.name.trim(),
				description: formData.description.trim() || undefined,
				slug: formData.slug.trim(),
				iconClass: formData.iconClass.trim() || undefined,
				colorCode: formData.colorCode,
				displayOrder: formData.displayOrder,
				isActive: formData.isActive,
				isVisible: formData.isVisible,
				metaDescription: formData.metaDescription.trim() || undefined,
				metaKeywords: formData.metaKeywords.trim() || undefined
			};

			if (mode === 'create') {
				await faqCategoryAdminStore.createCategory(categoryData);
				console.log('FAQ Category created successfully!');
			} else if (category) {
				await faqCategoryAdminStore.updateCategory(category.id, categoryData);
				console.log('FAQ Category updated successfully!');
			}

			onSave();
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			console.error(`Failed to save FAQ category: ${errorMessage}`);
			// You can add a toast notification here later
		}
	}

	/**
	 * Handle cancel
	 */
	function handleCancel() {
		onCancel();
	}

	/**
	 * Color palette for category colors
	 */
	const colorPalette = [
		'#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
		'#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
		'#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
		'#EC4899', '#F43F5E', '#6B7280', '#374151', '#111827'
	];

	/**
	 * Common icon classes for categories
	 */
	const iconOptions = [
		'Info',
		'lucide-help-circle',
		'lucide-info',
		'lucide-settings',
		'lucide-user',
		'lucide-credit-card',
		'lucide-shield',
		'lucide-book',
		'lucide-graduation-cap',
		'lucide-computer',
		'lucide-smartphone',
		'lucide-globe',
		'lucide-mail',
		'lucide-phone',
		'lucide-calendar',
		'lucide-clock',
		'lucide-star',
		'lucide-heart',
		'lucide-thumbs-up',
		'lucide-alert-triangle'
	];
</script>

<div class="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
	<!-- Header -->
	<div class="border-b border-gray-200 px-6 py-4">
		<h2 class="text-xl font-semibold text-gray-900">
			{mode === 'create' ? 'Create New FAQ Category' : 'Edit FAQ Category'}
		</h2>
		<p class="text-sm text-gray-600 mt-1">
			{mode === 'create'
				? 'Create a new category to organize your FAQs'
				: 'Update the category information and settings'
			}
		</p>
	</div>

	<!-- Form -->
	<form onsubmit={handleSubmit} class="p-6 space-y-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Left Column -->
			<div class="space-y-4">
				<!-- Category Name -->
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-1">
						Category Name <span class="text-red-500">*</span>
					</label>
					<input
						id="name"
						type="text"
						bind:value={formData.name}
						placeholder="Enter category name"
						class="w-full p-3 border border-gray-300 rounded-md focus:ring-nexus-primary focus:border-nexus-primary {fieldErrors.name ? 'border-red-500' : ''}"
						required
					/>
					{#if fieldErrors.name}
						<p class="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
					{/if}
				</div>

				<!-- Slug -->
				<div>
					<label for="slug" class="block text-sm font-medium text-gray-700 mb-1">
						URL Slug <span class="text-red-500">*</span>
					</label>
					<div class="relative">
						<input
							id="slug"
							type="text"
							bind:value={formData.slug}
							oninput={handleSlugChange}
							placeholder="category-url-slug"
							class="w-full p-3 border border-gray-300 rounded-md focus:ring-nexus-primary focus:border-nexus-primary {fieldErrors.slug ? 'border-red-500' : slugValidation.isValid ? 'border-green-500' : ''}"
							required
						/>
						{#if slugValidation.isChecking}
							<div class="absolute right-3 top-3">
								<div class="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
							</div>
						{/if}
					</div>
					{#if fieldErrors.slug}
						<p class="text-red-500 text-xs mt-1">{fieldErrors.slug}</p>
					{:else if slugValidation.suggestion}
						<p class="text-blue-600 text-xs mt-1">
							Suggestion: <button type="button" class="underline" onclick={() => { formData.slug = slugValidation.suggestion || ''; validateSlug(); }}>
							{slugValidation.suggestion}
						</button>
						</p>
					{:else if formData.slug && slugValidation.isValid}
						<p class="text-green-600 text-xs mt-1">✓ Slug is available</p>
					{/if}
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
						Description
					</label>
					<textarea
						id="description"
						bind:value={formData.description}
						placeholder="Brief description of this category"
						rows="3"
						class="w-full p-3 border border-gray-300 rounded-md focus:ring-nexus-primary focus:border-nexus-primary"
					></textarea>
				</div>

				<!-- Display Order -->
				<div>
					<label for="displayOrder" class="block text-sm font-medium text-gray-700 mb-1">
						Display Order <span class="text-red-500">*</span>
					</label>
					<input
						id="displayOrder"
						type="number"
						bind:value={formData.displayOrder}
						min="0"
						class="w-full p-3 border border-gray-300 rounded-md focus:ring-nexus-primary focus:border-nexus-primary {fieldErrors.displayOrder ? 'border-red-500' : ''}"
						required
					/>
					<p class="text-xs text-gray-500 mt-1">Lower numbers appear first (0 = highest priority)</p>
					{#if fieldErrors.displayOrder}
						<p class="text-red-500 text-xs mt-1">{fieldErrors.displayOrder}</p>
					{/if}
				</div>
			</div>

			<!-- Right Column -->
			<div class="space-y-4">
				<!-- Icon Selection -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Category Icon</label>
					<div class="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
						{#each iconOptions as iconClass}
							<button
								type="button"
								onclick={() => formData.iconClass = iconClass}
								class="p-2 rounded border-2 transition-colors {formData.iconClass === iconClass ? 'border-nexus-primary bg-nexus-primary/10' : 'border-gray-200 hover:border-gray-300'}"
							>
								<i class="{iconClass} w-4 h-4"></i>
							</button>
						{/each}
					</div>
					{#if formData.iconClass}
						<p class="text-xs text-gray-600 mt-1">Selected: {formData.iconClass}</p>
					{/if}
				</div>

				<!-- Color Selection -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Category Color</label>
					<div class="grid grid-cols-10 gap-2 border border-gray-300 rounded-md p-3">
						{#each colorPalette as color}
							<button
								type="button"
								onclick={() => formData.colorCode = color}
								class="w-6 h-6 rounded-full border-2 transition-all {formData.colorCode === color ? 'border-gray-800 scale-110' : 'border-gray-300'}"
								style="background-color: {color}"
								title={color}
							></button>
						{/each}
					</div>
					<div class="flex items-center gap-2 mt-2">
						<input
							type="color"
							bind:value={formData.colorCode}
							class="w-8 h-8 rounded border border-gray-300"
						/>
						<input
							type="text"
							bind:value={formData.colorCode}
							placeholder="#6B7280"
							class="text-sm border border-gray-300 rounded px-2 py-1 font-mono"
						/>
					</div>
				</div>

				<!-- Status Toggles -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<label class="flex items-center space-x-3">
							<input
								type="checkbox"
								bind:checked={formData.isActive}
								class="w-4 h-4 text-nexus-primary bg-gray-100 border-gray-300 rounded focus:ring-nexus-primary focus:ring-2"
							/>
							<span class="text-sm font-medium text-gray-700">Active</span>
						</label>
						<span class="text-xs text-gray-500">Category can be used</span>
					</div>

					<div class="flex items-center justify-between">
						<label class="flex items-center space-x-3">
							<input
								type="checkbox"
								bind:checked={formData.isVisible}
								class="w-4 h-4 text-nexus-primary bg-gray-100 border-gray-300 rounded focus:ring-nexus-primary focus:ring-2"
							/>
							<span class="text-sm font-medium text-gray-700">Visible to Users</span>
						</label>
						<span class="text-xs text-gray-500">Show in public FAQ</span>
					</div>
				</div>

				<!-- Preview -->
				<div class="border border-gray-200 rounded-md p-3">
					<h4 class="text-sm font-medium text-gray-700 mb-2">Preview</h4>
					<div class="flex items-center gap-3">
						<div
							class="w-10 h-10 rounded-lg flex items-center justify-center border"
							style="background-color: {formData.colorCode}20; border-color: {formData.colorCode}40;"
						>
							{#if formData.iconClass}
								<i class="{formData.iconClass} w-5 h-5" style="color: {formData.colorCode}"></i>
							{:else}
								<i class="lucide-folder w-5 h-5" style="color: {formData.colorCode}"></i>
							{/if}
						</div>
						<div>
							<div class="font-medium text-gray-900">{formData.name || 'Category Name'}</div>
							<div class="text-xs text-gray-500">/{formData.slug || 'category-slug'}</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- SEO Section -->
		<div class="border-t border-gray-200 pt-6">
			<h3 class="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Meta Description -->
				<div>
					<label for="metaDescription" class="block text-sm font-medium text-gray-700 mb-1">
						Meta Description
					</label>
					<textarea
						id="metaDescription"
						bind:value={formData.metaDescription}
						placeholder="Brief description for search engines (150-160 characters)"
						rows="3"
						maxlength="160"
						class="w-full p-3 border border-gray-300 rounded-md focus:ring-nexus-primary focus:border-nexus-primary"
					></textarea>
					<p class="text-xs text-gray-500 mt-1">
						{formData.metaDescription.length}/160 characters
					</p>
				</div>

				<!-- Meta Keywords -->
				<div>
					<label for="metaKeywords" class="block text-sm font-medium text-gray-700 mb-1">
						Meta Keywords
					</label>
					<textarea
						id="metaKeywords"
						bind:value={formData.metaKeywords}
						placeholder="keyword1, keyword2, keyword3"
						rows="3"
						class="w-full p-3 border border-gray-300 rounded-md focus:ring-nexus-primary focus:border-nexus-primary"
					></textarea>
					<p class="text-xs text-gray-500 mt-1">
						Separate keywords with commas
					</p>
				</div>
			</div>
		</div>

		<!-- Error Display -->
		{#if faqCategoryAdminStore.error}
			<div class="bg-red-50 border border-red-200 rounded-md p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<i class="lucide-alert-circle w-5 h-5 text-red-400"></i>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">Error</h3>
						<p class="text-sm text-red-700 mt-1">{faqCategoryAdminStore.error}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
			<button
				type="button"
				onclick={handleCancel}
				disabled={faqCategoryAdminStore.loading}
				class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				Cancel
			</button>

			<button
				type="submit"
				disabled={faqCategoryAdminStore.loading || slugValidation.isChecking || !slugValidation.isValid}
				class="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
			>
				{#if faqCategoryAdminStore.loading}
					<div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
					Saving...
				{:else}
					{mode === 'create' ? 'Create Category' : 'Update Category'}
				{/if}
			</button>
		</div>
	</form>
</div>