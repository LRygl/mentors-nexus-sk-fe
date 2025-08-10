<!-- src/lib/components/forms/FAQCategoryForm.svelte -->
<script lang="ts">
	import { Palette, Type, FileText, Eye, EyeOff, Hash, Check, AlertCircle } from 'lucide-svelte';
	import type {
		FAQCategoryFormData,
		FAQCategoryFormErrors,
		CreateFAQCategoryRequest
	} from '$lib/types/entities/faqCategory';

	// Props
	interface Props {
		initialData?: Partial<FAQCategoryFormData>;
		onvalidate?: (data: { isValid: boolean }) => void;
	}

	let {
		initialData = {},
		onvalidate
	}: Props = $props();

	// Form state
	let formData = $state<FAQCategoryFormData>({
		name: initialData.name || '',
		description: initialData.description || '',
		colorCode: initialData.colorCode || '#3B82F6',
		isActive: initialData.isActive ?? true,
		isVisible: initialData.isVisible ?? true,
		displayOrder: initialData.displayOrder || 1
	});

	// Form validation state
	let formErrors = $state<FAQCategoryFormErrors>({
		name: '',
		description: '',
		colorCode: '',
		displayOrder: ''
	});

	// Color palette options
	const colorOptions = [
		{ name: 'Blue', value: '#3B82F6' },
		{ name: 'Purple', value: '#8B5CF6' },
		{ name: 'Green', value: '#10B981' },
		{ name: 'Red', value: '#EF4444' },
		{ name: 'Orange', value: '#F59E0B' },
		{ name: 'Pink', value: '#EC4899' },
		{ name: 'Indigo', value: '#6366F1' },
		{ name: 'Teal', value: '#14B8A6' },
		{ name: 'Cyan', value: '#06B6D4' },
		{ name: 'Emerald', value: '#059669' },
		{ name: 'Amber', value: '#D97706' },
		{ name: 'Slate', value: '#64748B' }
	];

	// Computed properties
	const isFormValid = $derived(
		formData.name.trim().length > 0 &&
		formData.description.trim().length > 0 &&
		formData.displayOrder > 0 &&
		!Object.values(formErrors).some(error => error.length > 0)
	);

	// Form validation
	function validateField(field: keyof typeof formData, value: string | number) {
		switch (field) {
			case 'name':
				const nameValue = value as string;
				if (nameValue.trim().length === 0) {
					formErrors.name = 'Category name is required';
				} else if (nameValue.trim().length < 2) {
					formErrors.name = 'Category name must be at least 2 characters';
				} else if (nameValue.trim().length > 100) {
					formErrors.name = 'Category name must be less than 100 characters';
				} else {
					formErrors.name = '';
				}
				break;

			case 'description':
				const descValue = value as string;
				if (descValue.trim().length === 0) {
					formErrors.description = 'Description is required';
				} else if (descValue.trim().length < 10) {
					formErrors.description = 'Description must be at least 10 characters';
				} else if (descValue.trim().length > 500) {
					formErrors.description = 'Description must be less than 500 characters';
				} else {
					formErrors.description = '';
				}
				break;

			case 'colorCode':
				const colorValue = value as string;
				const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
				if (!hexColorRegex.test(colorValue)) {
					formErrors.colorCode = 'Please enter a valid hex color code';
				} else {
					formErrors.colorCode = '';
				}
				break;

			case 'displayOrder':
				const orderValue = value as number;
				if (orderValue < 1) {
					formErrors.displayOrder = 'Display order must be at least 1';
				} else if (orderValue > 1000) {
					formErrors.displayOrder = 'Display order must be less than 1000';
				} else {
					formErrors.displayOrder = '';
				}
				break;
		}
	}

	// Handle input changes with type safety
	function handleInputChange(field: keyof typeof formData, value: string | number | boolean) {
		// Type-safe assignment
		switch (field) {
			case 'name':
			case 'description':
			case 'colorCode':
				(formData as any)[field] = value as string;
				break;
			case 'displayOrder':
				(formData as any)[field] = value as number;
				break;
			case 'isActive':
			case 'isVisible':
				(formData as any)[field] = value as boolean;
				break;
		}

		if (typeof value === 'string' || typeof value === 'number') {
			validateField(field, value);
		}
	}

	function handleColorSelect(color: string) {
		handleInputChange('colorCode', color);
	}

	// Safe event handlers
	function handleTextInput(field: 'name' | 'description' | 'colorCode', event: Event) {
		const target = event.target as HTMLInputElement | HTMLTextAreaElement;
		if (target) {
			handleInputChange(field, target.value);
		}
	}

	function handleNumberInput(field: 'displayOrder', event: Event) {
		const target = event.target as HTMLInputElement;
		if (target) {
			const value = parseInt(target.value) || 1;
			handleInputChange(field, value);
		}
	}

	function handleCheckboxInput(field: 'isActive' | 'isVisible', event: Event) {
		const target = event.target as HTMLInputElement;
		if (target) {
			handleInputChange(field, target.checked);
		}
	}

	// Export form data for parent component
	export function getFormData(): CreateFAQCategoryRequest {
		return {
			name: formData.name.trim(),
			description: formData.description.trim(),
			colorCode: formData.colorCode,
			isActive: formData.isActive,
			isVisible: formData.isVisible,
			displayOrder: formData.displayOrder
		};
	}

	export function validateForm(): boolean {
		validateField('name', formData.name);
		validateField('description', formData.description);
		validateField('colorCode', formData.colorCode);
		validateField('displayOrder', formData.displayOrder);
		return isFormValid;
	}

	// Reactive validation notification
	$effect(() => {
		onvalidate?.({ isValid: isFormValid });
	});
</script>



<!-- Basic Information Section -->
<div class="flex items-center gap-3 mb-6">
	<div class="p-3 bg-blue-600 rounded-xl">
		<Type class="w-4 h-4 text-white" />
	</div>
	<div>
		<h3 class="text-xl font-semibold text-gray-900">Basic Information</h3>
		<p class="text-sm text-gray-600">Name and description for your category</p>
	</div>
</div>
<!-- Form Fields -->
<div class="space-y-6">
	<!-- Category Name -->
	<div class="space-y-2">
		<label for="category-name" class="flex items-center gap-2 text-sm font-medium text-gray-700">
			Category Name
			<span class="text-red-500">*</span>
		</label>
		<div class="relative">
			<input
				id="category-name"
				type="text"
				bind:value={formData.name}
				oninput={(e) => handleTextInput('name', e)}
				placeholder="Enter category name"
				class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white {formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}"
				required
			/>
			{#if formData.name && !formErrors.name}
				<Check class="absolute right-3 top-3 w-5 h-5 text-green-500" />
			{/if}
			{#if formErrors.name}
				<AlertCircle class="absolute right-3 top-3 w-5 h-5 text-red-500" />
			{/if}
		</div>
		{#if formErrors.name}
			<div class="flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
				<AlertCircle class="w-4 h-4" />
				{formErrors.name}
			</div>
		{/if}
	</div>

	<!-- Description -->
	<div class="space-y-2">
		<label for="category-description" class="flex items-center gap-2 text-sm font-medium text-gray-700">
			<FileText class="w-4 h-4" />
			Description
			<span class="text-red-500">*</span>
		</label>
		<textarea
			id="category-description"
			bind:value={formData.description}
			oninput={(e) => handleTextInput('description', e)}
			placeholder="Describe what this category is for..."
			rows="3"
			class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
			class:border-red-300={formErrors.description}
			class:ring-red-500={formErrors.description}
			required
		></textarea>
		{#if formErrors.description}
			<p class="text-sm text-red-600">{formErrors.description}</p>
		{/if}
		<p class="text-xs text-gray-500">{formData.description.length}/500 characters</p>
	</div>

	<!-- Color Selection -->
	<div class="space-y-2">
		<label class="flex items-center gap-2 text-sm font-medium text-gray-700">
			<Palette class="w-4 h-4" />
			Category Color
		</label>

		<!-- Color Palette -->
		<div class="grid grid-cols-6 gap-3">
			{#each colorOptions as colorOption}
				<button
					type="button"
					onclick={() => handleColorSelect(colorOption.value)}
					class="group relative w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105"
					class:border-gray-800={formData.colorCode === colorOption.value}
					class:border-gray-300={formData.colorCode !== colorOption.value}
					style="background-color: {colorOption.value}"
					title={colorOption.name}
				>
					{#if formData.colorCode === colorOption.value}
						<div class="absolute inset-0 flex items-center justify-center">
							<div class="w-3 h-3 bg-white rounded-full shadow-lg"></div>
						</div>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Custom Color Input -->
		<div class="flex items-center gap-2 mt-3">
			<input
				type="color"
				bind:value={formData.colorCode}
				oninput={(e) => handleTextInput('colorCode', e)}
				class="w-8 h-8 rounded border border-gray-300 cursor-pointer"
			/>
			<input
				type="text"
				bind:value={formData.colorCode}
				oninput={(e) => handleTextInput('colorCode', e)}
				placeholder="#3B82F6"
				class="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				class:border-red-300={formErrors.colorCode}
			/>
		</div>

		{#if formErrors.colorCode}
			<p class="text-sm text-red-600">{formErrors.colorCode}</p>
		{/if}
	</div>

	<!-- Display Order -->
	<div class="space-y-2">
		<label for="display-order" class="flex items-center gap-2 text-sm font-medium text-gray-700">
			<Hash class="w-4 h-4" />
			Display Order
		</label>
		<input
			id="display-order"
			type="number"
			min="1"
			max="1000"
			bind:value={formData.displayOrder}
			oninput={(e) => handleNumberInput('displayOrder', e)}
			class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
			class:border-red-300={formErrors.displayOrder}
		/>
		{#if formErrors.displayOrder}
			<p class="text-sm text-red-600">{formErrors.displayOrder}</p>
		{/if}
		<p class="text-xs text-gray-500">Lower numbers appear first in the list</p>
	</div>

	<!-- Toggle Options -->
	<div class="space-y-4 p-4 bg-gray-50 rounded-lg">
		<h4 class="text-sm font-medium text-gray-700">Category Settings</h4>

		<!-- Active Toggle -->
		<label class="flex items-center justify-between cursor-pointer">
			<div class="flex items-center gap-2">
				<Eye class="w-4 h-4 text-gray-500" />
				<span class="text-sm font-medium text-gray-700">Active</span>
				<span class="text-xs text-gray-500">Category can be used for FAQs</span>
			</div>
			<input
				type="checkbox"
				bind:checked={formData.isActive}
				onchange={(e) => handleCheckboxInput('isActive', e)}
				class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
			/>
		</label>

		<!-- Visible Toggle -->
		<label class="flex items-center justify-between cursor-pointer">
			<div class="flex items-center gap-2">
				{#if formData.isVisible}
					<Eye class="w-4 h-4 text-gray-500" />
				{:else}
					<EyeOff class="w-4 h-4 text-gray-500" />
				{/if}
				<span class="text-sm font-medium text-gray-700">Visible</span>
				<span class="text-xs text-gray-500">Show in public FAQ lists</span>
			</div>
			<input
				type="checkbox"
				bind:checked={formData.isVisible}
				onchange={(e) => handleCheckboxInput('isVisible', e)}
				class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
			/>
		</label>
	</div>
</div>