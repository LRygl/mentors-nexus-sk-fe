<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		description?: string;
		icon?: string;
		variant?: 'default' | 'card' | 'minimal' | 'embedded';
		collapsible?: boolean;
		collapsed?: boolean;
		className?: string;
		children: Snippet;
	}

	let {
		title,
		description,
		icon,
		variant = 'default',
		collapsible = false,
		collapsed = false,
		className = '',
		children
	}: Props = $props();

	let isCollapsed = $state(collapsed);
	let contentHeight = $state<number>(0);
	let contentElement = $state<HTMLDivElement>();

	$effect(() => {
		if (contentElement && !isCollapsed) {
			requestAnimationFrame(() => {
				if (contentElement) {
					contentHeight = contentElement.scrollHeight;
				}
			});
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
			'✨': 'violet',
			'📊': 'sky',
			'👥': 'teal'
		};
		return colors[icon || ''] || 'blue';
	});

	function toggleCollapse() {
		if (collapsible) {
			isCollapsed = !isCollapsed;
		}
	}
</script>

{#if variant === 'embedded'}
	<!-- EMBEDDED VARIANT: No card styling -->
	<div class="mb-8 {className}">
		{#if title || description}
			<div class="mb-4">
				{#if title}
					<div class="flex items-center gap-2 mb-1">
						{#if icon}
							<span class="text-xl">{icon}</span>
						{/if}
						<h3 class="text-lg font-semibold text-slate-900">
							{title}
						</h3>
					</div>
				{/if}
				{#if description}
					<p class="text-sm text-slate-600 leading-relaxed">
						{description}
					</p>
				{/if}
			</div>
		{/if}

		<div>
			{@render children()}
		</div>
	</div>

{:else if variant === 'default'}
	<!-- DEFAULT VARIANT: Standard card -->
	<div class="mb-6 {className}">
		<div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
			{#if title || description}
				<button
					type="button"
					class="w-full text-left px-6 py-4 {collapsible ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'} transition-colors"
					onclick={toggleCollapse}
					disabled={!collapsible}
				>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							{#if title}
								<div class="flex items-center gap-2 mb-1">
									{#if icon}
										<span class="text-lg">{icon}</span>
									{/if}
									<h3 class="text-lg font-semibold text-slate-900">
										{title}
									</h3>
								</div>
							{/if}
							{#if description}
								<p class="text-sm text-slate-600 leading-relaxed">
									{description}
								</p>
							{/if}
						</div>

						{#if collapsible}
							<div class="shrink-0">
								<div class="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors">
									<ChevronDown class="w-4 h-4 text-slate-600 transition-transform duration-200 {isCollapsed ? '' : 'rotate-180'}" />
								</div>
							</div>
						{/if}
					</div>
				</button>
			{/if}

			<div
				class="transition-all duration-300 ease-in-out"
				style="max-height: {isCollapsed ? '0' : `${contentHeight}px`}; overflow: {isCollapsed ? 'hidden' : 'visible'};"
			>
				<div bind:this={contentElement}>
					<div class="px-6 pb-6 {title || description ? 'pt-2' : 'pt-6'}">
						{@render children()}
					</div>
				</div>
			</div>
		</div>
	</div>

{:else if variant === 'card'}
	<!-- CARD VARIANT: With accent bar -->
	<div class="mb-6 {className}">
		<div class="h-1 bg-linear-to-r from-{accentColor()}-500 to-{accentColor()}-600 rounded-t-lg shadow-sm"></div>

		<div class="bg-white border-x border-b border-slate-200 rounded-b-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
			{#if title || description}
				<button
					type="button"
					class="w-full text-left px-6 py-5 {collapsible ? 'cursor-pointer hover:bg-linear-to-r hover:from-slate-50 hover:to-transparent' : 'cursor-default'} transition-all duration-200 border-b border-slate-100"
					onclick={toggleCollapse}
					disabled={!collapsible}
				>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							{#if title}
								<div class="flex items-center gap-3 mb-2">
									{#if icon}
										<div class="w-8 h-8 rounded-lg bg-linear-to-br from-{accentColor()}-500 to-{accentColor()}-600 flex items-center justify-center shadow-sm">
											<span class="text-lg">{icon}</span>
										</div>
									{/if}
									<h3 class="text-lg font-semibold text-slate-900">
										{title}
									</h3>
								</div>
							{/if}
							{#if description}
								<p class="text-sm text-slate-600 leading-relaxed {icon ? 'pl-11' : ''}">
									{description}
								</p>
							{/if}
						</div>

						{#if collapsible}
							<div class="shrink-0">
								<div class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 hover:shadow-sm transition-all duration-200">
									<ChevronDown class="w-4 h-4 text-slate-600 transition-transform duration-300 {isCollapsed ? '' : 'rotate-180'}" />
								</div>
							</div>
						{/if}
					</div>
				</button>
			{/if}

			<div
				class="transition-all duration-300 ease-in-out"
				style="max-height: {isCollapsed ? '0' : `${contentHeight}px`}; overflow: {isCollapsed ? 'hidden' : 'visible'};"
			>
				<div bind:this={contentElement}>
					<div class="p-6 bg-linear-to-b from-white to-slate-50/30">
						{@render children()}
					</div>
				</div>
			</div>
		</div>
	</div>

{:else if variant === 'minimal'}
	<!-- MINIMAL VARIANT: Lightweight -->
	<div class="mb-6 {className}">
		<div class="bg-white border border-slate-200 rounded-lg overflow-hidden">
			{#if title || description}
				<button
					type="button"
					class="w-full text-left px-5 py-4 {collapsible ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'} transition-colors"
					onclick={toggleCollapse}
					disabled={!collapsible}
				>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							{#if title}
								<div class="flex items-center gap-2 mb-1">
									{#if icon}
										<span class="text-base text-slate-600">{icon}</span>
									{/if}
									<h3 class="text-base font-medium text-slate-900">
										{title}
									</h3>
								</div>
							{/if}
							{#if description}
								<p class="text-xs text-slate-500 leading-relaxed">
									{description}
								</p>
							{/if}
						</div>

						{#if collapsible}
							<div class="shrink-0">
								<ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200 {isCollapsed ? '' : 'rotate-180'}" />
							</div>
						{/if}
					</div>
				</button>
			{/if}

			<div
				class="transition-all duration-300 ease-in-out"
				style="max-height: {isCollapsed ? '0' : `${contentHeight}px`}; overflow: {isCollapsed ? 'hidden' : 'visible'};"
			>
				<div bind:this={contentElement}>
					<div class="px-5 py-4 {title || description ? 'border-t border-slate-100' : ''}">
						{@render children()}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}