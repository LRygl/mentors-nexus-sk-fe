<script lang="ts">
	import type { FormFieldGroup, FormLayout, FormState } from '$lib/types/entities/forms';
	import FormFieldRenderer from '$lib/components/Forms/FormFieldRenderer.svelte';
	import { ChevronDown } from 'lucide-svelte';

	interface Props {
		group: FormFieldGroup;
		formState: FormState;
		layout?: FormLayout;
		disabled?: boolean;
		onChange: (fieldName: string, value: any) => void;
		visibleFields: string[];
		shouldShowError: (fieldName: string) => boolean;
	}

	let {
		group,
		formState,
		layout = 'single',
		disabled = false,
		onChange,
		visibleFields,
		shouldShowError
	}: Props = $props();

	// Collapsible state
	let isCollapsed = $state(group.collapsed ?? false);
	let contentHeight = $state<number>(0);
	let contentElement = $state<HTMLDivElement>();

	// Measure content height for smooth animation
	$effect(() => {
		if (contentElement) {
			contentHeight = contentElement.scrollHeight;
		}
	});

	$effect(() => {
		if (contentElement) {
			// Access visibleFields to track it as a dependency
			const _ = visibleFields.length;

			// Small delay to let DOM update before measuring
			requestAnimationFrame(() => {
				if (contentElement) {
					contentHeight = contentElement.scrollHeight;
					console.log('📏 Recalculated height:', contentHeight, 'for group:', group.id);
				}
			});
		}
	});

	$effect(() => {
		console.log(`📦 Group "${group.id}" rendering check:`, {
			totalFields: group.fields.length,
			fieldNames: group.fields.map(f => f.name),
			visibleFieldsSet: visibleFields,  // ✅ It's now an array, not a Set
			fieldsToRender: group.fields.filter(f => visibleFields.includes(f.name)).map(f => f.name)  // ✅ Use .includes()
		});
	});

	$effect(() => {
		if (group.id === 'publishing') {
			console.log('📦 Publishing group fields:', group.fields.map(f => f.name));
			console.log('👁️ Visible fields in group:',
				group.fields.filter(f => visibleFields.includes(f.name)).map(f => f.name)  // ✅ Use .includes()
			);
		}
	});

	const hasVisibleFields = $derived(() => {
		return group.fields.some(field => visibleFields.includes(field.name));
	});

	// Get grid class based on layout
	const gridClass = $derived(() => {
		switch (layout) {
			case 'two-column':
				return 'lg:grid-cols-2';
			case 'three-column':
				return 'lg:grid-cols-3';
			default:
				return '';
		}
	});

	// Get variant styles
	const variantStyles = $derived(() => {
		switch (group.variant) {
			case 'card':
				return 'bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3';
			case 'minimal':
				return 'pl-0 py-2';
			default:
				return 'bg-slate-50/50 rounded-lg p-5';
		}
	});

		// TODO Move to some central location and refactor to use something else than icons
	// Gradient color scheme based on icon
	const gradientColors = $derived(() => {
		const gradients = {
			'📝': 'from-blue-600 to-cyan-600',
			'🚀': 'from-purple-600 to-pink-600',
			'🗂️': 'from-amber-600 to-orange-600',
			'📖': 'from-indigo-600 to-purple-600',
			'🏷️': 'from-emerald-600 to-teal-600',
			'👁️': 'from-cyan-600 to-blue-600',
			'🔍': 'from-pink-600 to-rose-600',
			'⚙️': 'from-slate-600 to-gray-600',
		};
		return gradients[group.icon as keyof typeof gradients] || 'from-indigo-600 to-purple-600';
	});

	function toggleCollapse() {
		if (group.collapsible) {
			isCollapsed = !isCollapsed;
		}
	}
</script>

{#if hasVisibleFields()}
	<div class="space-y-8 {group.className || ''}">
		<div class={variantStyles()}>
			<!-- Group Header -->
			{#if group.title || group.description}
				<button
					type="button"
					class="mb-3 w-full text-left {group.collapsible ? 'cursor-pointer' : 'cursor-default'}"
					onclick={toggleCollapse}
					disabled={!group.collapsible}
					aria-expanded={group.collapsible ? !isCollapsed : undefined}
					aria-controls={group.collapsible ? `group-${group.id}-content` : undefined}
				>
					<div class="flex items-start justify-between gap-3">
						<div class="flex-1 min-w-0">
							<div class="relative pl-4">
								{#if group.title}
									<h3 class="text-base font-semibold bg-gradient-to-r {gradientColors()} bg-clip-text text-transparent mb-1">
										{group.title}
									</h3>
								{/if}
								{#if group.description}
									<p class="text-sm text-slate-600 leading-relaxed">
										{group.description}
									</p>
								{/if}
								<!-- Decorative gradient accent stripe -->
								<div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b {gradientColors()} rounded-full"></div>
							</div>
						</div>

						<!-- Collapse Toggle Icon -->
						{#if group.collapsible}
							<div
								class="flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
								aria-hidden="true"
							>
								<div class="transition-transform duration-200 {isCollapsed ? '' : 'rotate-180'}">
									<ChevronDown class="w-5 h-5" />
								</div>
							</div>
						{/if}
					</div>
				</button>
			{/if}

			<!-- Fields Grid with Smooth Collapse Animation -->
			<div
				id={group.collapsible ? `group-${group.id}-content` : undefined}
				class="overflow-hidden transition-all duration-300 ease-in-out"
				style="max-height: {isCollapsed ? '0' : `${contentHeight}px`}; opacity: {isCollapsed ? '0' : '1'}"
			>
				<div bind:this={contentElement}>
					<div
						class="grid grid-cols-1 {gridClass()} gap-x-6 gap-y-5"
					>
						{#each group.fields as field}
							{#if visibleFields.includes(field.name)}
							<div class="space-y-2 {field.colSpan === 2 ? 'lg:col-span-2' : field.colSpan === 3 ? 'lg:col-span-3' : ''} {field.className || ''}">
									<FormFieldRenderer
										{field}
										{formState}
										{disabled}
										{onChange}
										{shouldShowError}
									/>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
