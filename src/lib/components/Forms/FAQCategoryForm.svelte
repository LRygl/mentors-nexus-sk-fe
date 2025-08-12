<!-- src/lib/components/forms/FAQCategoryForm.svelte -->
<script lang="ts">
	import {
		Type, FileText, AlertCircle, Hash, Eye, EyeOff, Check
	} from 'lucide-svelte';
	import IconSelector from '$lib/components/UI/IconSelector.svelte';
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';
	import type {
		FAQCategoryFormData,
		FAQCategoryFormErrors,
		CreateFAQCategoryRequest
	} from '$lib/types/entities/faqCategory';

	// Props
	interface Props {
		initialData?: Partial<FAQCategoryFormData & { iconClass: string }>;
		onvalidate?: (data: { isValid: boolean }) => void;
	}

	let {
		initialData = {},
		onvalidate
	}: Props = $props();

	// Form state with icon field
	let formData = $state<FAQCategoryFormData & { iconName: string }>({
		name: initialData.name || '',
		description: initialData.description || '',
		colorCode: initialData.colorCode || '#3B82F6',
		iconName: (initialData as any)?.iconClass || 'HelpCircle',
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

	// Predefined color options
	const quickColors: Array<{ name: string; value: string }> = [
		{ name: 'Blue', value: '#3B82F6' },
		{ name: 'Purple', value: '#8B5CF6' },
		{ name: 'Green', value: '#10B981' },
		{ name: 'Red', value: '#EF4444' },
		{ name: 'Orange', value: '#F59E0B' },
		{ name: 'Pink', value: '#EC4899' },
		{ name: 'Indigo', value: '#6366F1' },
		{ name: 'Teal', value: '#14B8A6' }
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
					formErrors.name = 'Name is required';
				} else if (nameValue.trim().length < 2) {
					formErrors.name = 'Name must be at least 2 characters';
				} else if (nameValue.trim().length > 50) {
					formErrors.name = 'Name must be less than 50 characters';
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
				} else if (descValue.trim().length > 200) {
					formErrors.description = 'Description must be less than 200 characters';
				} else {
					formErrors.description = '';
				}
				break;

			case 'colorCode':
				const colorValue = value as string;
				const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
				if (!hexColorRegex.test(colorValue)) {
					formErrors.colorCode = 'Invalid hex color';
				} else {
					formErrors.colorCode = '';
				}
				break;

			case 'displayOrder':
				const orderValue = value as number;
				if (orderValue < 1) {
					formErrors.displayOrder = 'Must be at least 1';
				} else if (orderValue > 999) {
					formErrors.displayOrder = 'Must be less than 999';
				} else {
					formErrors.displayOrder = '';
				}
				break;
		}
	}

	// Handle input changes
	function handleInputChange(field: keyof typeof formData, value: string | number | boolean) {
		(formData as any)[field] = value;
		if (typeof value === 'string' || typeof value === 'number') {
			validateField(field, value);
		}
	}

	// Event handlers
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

	function handleIconSelect(iconName: string) {
		formData.iconName = iconName;
	}

	function handleColorSelect(color: string) {
		handleInputChange('colorCode', color);
	}

	// Export functions
	export function getFormData(): CreateFAQCategoryRequest & { iconClass: string } {
		return {
			name: formData.name.trim(),
			description: formData.description.trim(),
			colorCode: formData.colorCode,
			iconClass: formData.iconName, // Map iconName to iconClass for backend
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

<div class="space-y-6">
	<!-- Form Fields Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Left Column -->
		<div class="space-y-4">
			<!-- Name -->
			<div>
				<label class="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
					<Type class="w-4 h-4" />
					Name <span class="text-red-500">*</span>
				</label>
				<div class="relative">
					<input
						type="text"
						bind:value={formData.name}
						oninput={(e) => handleTextInput('name', e)}
						placeholder="e.g., Account & Billing"
						class="w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {formErrors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
						maxlength="50"
					/>
					{#if formData.name && !formErrors.name}
						<Check class="absolute right-3 top-2.5 w-4 h-4 text-green-500" />
					{/if}
					{#if formErrors.name}
						<AlertCircle class="absolute right-3 top-2.5 w-4 h-4 text-red-500" />
					{/if}
				</div>
				{#if formErrors.name}
					<p class="text-xs text-red-600 mt-1">{formErrors.name}</p>
				{:else}
					<p class="text-xs text-slate-500 mt-1">{formData.name.length}/50</p>
				{/if}
			</div>

			<!-- Description -->
			<div>
				<label class="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
					<FileText class="w-4 h-4" />
					Description <span class="text-red-500">*</span>
				</label>
				<textarea
					bind:value={formData.description}
					oninput={(e) => handleTextInput('description', e)}
					placeholder="Brief description of what this category covers..."
					rows="3"
					maxlength="200"
					class="w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none {formErrors.description ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
				></textarea>
				{#if formErrors.description}
					<p class="text-xs text-red-600 mt-1">{formErrors.description}</p>
				{:else}
					<p class="text-xs text-slate-500 mt-1">{formData.description.length}/200</p>
				{/if}
			</div>

			<!-- Display Order -->
			<div>
				<label class="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
					<Hash class="w-4 h-4" />
					Display Order
				</label>
				<input
					type="number"
					min="1"
					max="999"
					bind:value={formData.displayOrder}
					oninput={(e) => handleNumberInput('displayOrder', e)}
					class="w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {formErrors.displayOrder ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
				/>
				{#if formErrors.displayOrder}
					<p class="text-xs text-red-600 mt-1">{formErrors.displayOrder}</p>
				{:else}
					<p class="text-xs text-slate-500 mt-1">Lower numbers appear first</p>
				{/if}
			</div>
		</div>

		<!-- Right Column -->
		<div class="space-y-4">
			<!-- Icon Selector -->
			<IconSelector
				selectedIcon={formData.iconName}
				onselect={handleIconSelect}
				label="Category Icon"
				placeholder="Choose an icon..."
				previewColor={formData.colorCode}
				required
			/>

			<!-- Color Selection -->
			<div>
				<label class="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
					<div class="w-4 h-4 rounded border border-slate-300" style="background-color: {formData.colorCode}"></div>
					Color
				</label>
				<div class="space-y-3">
					<!-- Quick Colors -->
					<div class="grid grid-cols-4 gap-2">
						{#each quickColors as color (color.value)}
							<button
								type="button"
								onclick={() => handleColorSelect(color.value)}
								class="group relative h-10 rounded-lg border-2 transition-all duration-200 hover:scale-105 {formData.colorCode === color.value ? 'border-slate-800 scale-105' : 'border-slate-300 hover:border-slate-400'}"
								style="background-color: {color.value}"
								title={color.name}
							>
								{#if formData.colorCode === color.value}
									<Check class="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" />
								{/if}
							</button>
						{/each}
					</div>

					<!-- Custom Color -->
					<div class="flex gap-2">
						<input
							type="color"
							bind:value={formData.colorCode}
							oninput={(e) => handleTextInput('colorCode', e)}
							class="w-10 h-10 rounded border border-slate-300 cursor-pointer"
						/>
						<input
							type="text"
							bind:value={formData.colorCode}
							oninput={(e) => handleTextInput('colorCode', e)}
							placeholder="#3B82F6"
							class="flex-1 px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {formErrors.colorCode ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
						/>
					</div>
					{#if formErrors.colorCode}
						<p class="text-xs text-red-600">{formErrors.colorCode}</p>
					{/if}
				</div>
			</div>

			<!-- Status Toggles -->
			<div class="space-y-3">
				<label class="text-sm font-medium text-slate-700">Status</label>
				<div class="space-y-2">
					<label class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
						<div class="flex items-center gap-3">
							<Eye class="w-4 h-4 text-slate-600" />
							<div>
								<span class="text-sm font-medium text-slate-800">Active</span>
								<p class="text-xs text-slate-500">Category is available for use</p>
							</div>
						</div>
						<input
							type="checkbox"
							bind:checked={formData.isActive}
							class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
						/>
					</label>

					<label class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
						<div class="flex items-center gap-3">
							{#if formData.isVisible}
								<Eye class="w-4 h-4 text-slate-600" />
							{:else}
								<EyeOff class="w-4 h-4 text-slate-400" />
							{/if}
							<div>
								<span class="text-sm font-medium text-slate-800">Visible</span>
								<p class="text-xs text-slate-500">Show in public category lists</p>
							</div>
						</div>
						<input
							type="checkbox"
							bind:checked={formData.isVisible}
							class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
						/>
					</label>
				</div>
			</div>
		</div>
	</div>
</div>