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

	let isCollapsed = $state(group.collapsed ?? false);
	let contentHeight = $state<number>(0);
	let contentElement = $state<HTMLDivElement>();

	$effect(() => {
		if (contentElement) {
			const _ = visibleFields.length;
			requestAnimationFrame(() => {
				if (contentElement) {
					contentHeight = contentElement.scrollHeight;
				}
			});
		}
	});

	const hasVisibleFields = $derived(() => {
		return group.fields.some(field => visibleFields.includes(field.name));
	});

	const gridClass = $derived(() => {
		switch (layout) {
			case 'two-column': return 'lg:grid-cols-2';
			case 'three-column': return 'lg:grid-cols-3';
			default: return '';
		}
	});

	const accentColor = $derived(() => {
		const colors: Record<string, string> = {
			'📝': 'blue',
			'🚀': 'purple',
			'🗂️': 'amber',
			'📂': 'emerald',
			'📖': 'indigo',
			'⚙️': 'slate',
			'🎨': 'pink',
			'💼': 'cyan',
			'🔒': 'red',
			'✨': 'violet'
		};
		return colors[group.icon || ''] || 'blue';
	});

	function toggleCollapse() {
		if (group.collapsible) {
			isCollapsed = !isCollapsed;
		}
	}

	const variant = $derived(group.variant || 'default');
</script>

{#if hasVisibleFields()}
	{#if variant === 'embedded'}
		<!-- EMBEDDED VARIANT: Clean style with just headings, no borders or backgrounds -->
		<div class="mb-8 {group.className || ''}">
			{#if group.title || group.description}
				<div class="mb-4">
					{#if group.title}
						<div class="flex items-center gap-2 mb-1">
							{#if group.icon}
								<span class="text-xl">{group.icon}</span>
							{/if}
							<h3 class="text-lg font-semibold text-slate-900">
								{group.title}
							</h3>
						</div>
					{/if}
					{#if group.description}
						<p class="text-sm text-slate-600 leading-relaxed">
							{group.description}
						</p>
					{/if}
				</div>
			{/if}

			<div class="grid grid-cols-1 {gridClass()} gap-6">
				{#each group.fields as field}
					{#if visibleFields.includes(field.name)}
						<div class="{field.colSpan === 2 ? 'lg:col-span-2' : field.colSpan === 3 ? 'lg:col-span-3' : ''}">
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

	{:else if variant === 'default'}
		<!-- DEFAULT VARIANT: Rounded background cards with separation between groups -->
		<div class="mb-6 {group.className || ''}">
			<div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
				{#if group.title || group.description}
					<button
						type="button"
						class="w-full text-left px-6 py-4 {group.collapsible ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'} transition-colors"
						onclick={toggleCollapse}
						disabled={!group.collapsible}
					>
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								{#if group.title}
									<div class="flex items-center gap-2 mb-1">
										{#if group.icon}
											<span class="text-lg">{group.icon}</span>
										{/if}
										<h3 class="text-lg font-semibold text-slate-900">
											{group.title}
										</h3>
									</div>
								{/if}
								{#if group.description}
									<p class="text-sm text-slate-600 leading-relaxed">
										{group.description}
									</p>
								{/if}
							</div>

							{#if group.collapsible}
								<div class="flex-shrink-0">
									<div class="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors">
										<ChevronDown class="w-4 h-4 text-slate-600 transition-transform duration-200 {isCollapsed ? '' : 'rotate-180'}" />
									</div>
								</div>
							{/if}
						</div>
					</button>
				{/if}

				<div
					class="overflow-hidden transition-all duration-300 ease-in-out"
					style="max-height: {isCollapsed ? '0' : `${contentHeight}px`}"
				>
					<div bind:this={contentElement}>
						<div class="px-6 pb-6 {group.title || group.description ? 'pt-2' : 'pt-6'}">
							<div class="grid grid-cols-1 {gridClass()} gap-6">
								{#each group.fields as field}
									{#if visibleFields.includes(field.name)}
										<div class="{field.colSpan === 2 ? 'lg:col-span-2' : field.colSpan === 3 ? 'lg:col-span-3' : ''}">
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
		</div>

	{:else if variant === 'card'}
		<!-- CARD VARIANT: Premium modern card with gradients, shadows, and accent colors -->
		<div class="mb-6 {group.className || ''}">
			<div class="h-1 bg-gradient-to-r from-{accentColor()}-500 to-{accentColor()}-600 rounded-t-lg shadow-sm"></div>

			<div class="bg-white border-x border-b border-slate-200 rounded-b-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
				{#if group.title || group.description}
					<button
						type="button"
						class="w-full text-left px-6 py-5 {group.collapsible ? 'cursor-pointer hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent' : 'cursor-default'} transition-all duration-200 border-b border-slate-100"
						onclick={toggleCollapse}
						disabled={!group.collapsible}
					>
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								{#if group.title}
									<div class="flex items-center gap-3 mb-2">
										{#if group.icon}
											<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-{accentColor()}-500 to-{accentColor()}-600 flex items-center justify-center shadow-sm">
												<span class="text-lg">{group.icon}</span>
											</div>
										{/if}
										<h3 class="text-lg font-semibold text-slate-900">
											{group.title}
										</h3>
									</div>
								{/if}
								{#if group.description}
									<p class="text-sm text-slate-600 leading-relaxed pl-11">
										{group.description}
									</p>
								{/if}
							</div>

							{#if group.collapsible}
								<div class="flex-shrink-0">
									<div class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 hover:shadow-sm transition-all duration-200">
										<ChevronDown class="w-4 h-4 text-slate-600 transition-transform duration-300 {isCollapsed ? '' : 'rotate-180'}" />
									</div>
								</div>
							{/if}
						</div>
					</button>
				{/if}

				<div
					class="overflow-hidden transition-all duration-300 ease-in-out"
					style="max-height: {isCollapsed ? '0' : `${contentHeight}px`}"
				>
					<div bind:this={contentElement}>
						<div class="p-6 bg-gradient-to-b from-white to-slate-50/30">
							<div class="grid grid-cols-1 {gridClass()} gap-6">
								{#each group.fields as field}
									{#if visibleFields.includes(field.name)}
										<div class="{field.colSpan === 2 ? 'lg:col-span-2' : field.colSpan === 3 ? 'lg:col-span-3' : ''}">
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
		</div>

	{:else if variant === 'minimal'}
		<!-- MINIMAL VARIANT: Clean, subtle card with minimal styling -->
		<div class="mb-6 {group.className || ''}">
			<div class="bg-white border border-slate-200 rounded-lg overflow-hidden">
				{#if group.title || group.description}
					<button
						type="button"
						class="w-full text-left px-5 py-4 {group.collapsible ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'} transition-colors"
						onclick={toggleCollapse}
						disabled={!group.collapsible}
					>
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								{#if group.title}
									<div class="flex items-center gap-2 mb-1">
										{#if group.icon}
											<span class="text-base text-slate-600">{group.icon}</span>
										{/if}
										<h3 class="text-base font-medium text-slate-900">
											{group.title}
										</h3>
									</div>
								{/if}
								{#if group.description}
									<p class="text-xs text-slate-500 leading-relaxed">
										{group.description}
									</p>
								{/if}
							</div>

							{#if group.collapsible}
								<div class="flex-shrink-0">
									<ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200 {isCollapsed ? '' : 'rotate-180'}" />
								</div>
							{/if}
						</div>
					</button>
				{/if}

				<div
					class="overflow-hidden transition-all duration-300 ease-in-out"
					style="max-height: {isCollapsed ? '0' : `${contentHeight}px`}"
				>
					<div bind:this={contentElement}>
						<div class="px-5 py-4 {group.title || group.description ? 'border-t border-slate-100' : ''}">
							<div class="grid grid-cols-1 {gridClass()} gap-4">
								{#each group.fields as field}
									{#if visibleFields.includes(field.name)}
										<div class="{field.colSpan === 2 ? 'lg:col-span-2' : field.colSpan === 3 ? 'lg:col-span-3' : ''}">
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
		</div>
	{/if}
{/if}