<!-- ALTERNATIVE DESIGN - Ultra Modern with Accent Border -->
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
		const colors = {
			'📝': 'blue',
			'🚀': 'purple',
			'🗂️': 'amber',
			'📂': 'emerald',
			'📖': 'indigo',
		};
		return colors[group.icon as keyof typeof colors] || 'slate';
	});

	function toggleCollapse() {
		if (group.collapsible) {
			isCollapsed = !isCollapsed;
		}
	}
</script>

{#if hasVisibleFields()}
	<div class="mb-6 {group.className || ''}">
		<!-- Accent Border Top -->
		<div class="h-1 bg-gradient-to-r from-{accentColor()}-500 to-{accentColor()}-600 rounded-t-lg"></div>

		<div class="bg-white border-x border-b border-slate-200 rounded-b-lg overflow-hidden">
			<!-- Header -->
			{#if group.title || group.description}
				<button
					type="button"
					class="w-full text-left px-6 py-5 {group.collapsible ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'} transition-colors border-b border-slate-100"
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

			<!-- Fields -->
			<div
				class="overflow-hidden transition-all duration-300 ease-in-out"
				style="max-height: {isCollapsed ? '0' : `${contentHeight}px`}"
			>
				<div bind:this={contentElement}>
					<div class="p-6">
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
{/if}