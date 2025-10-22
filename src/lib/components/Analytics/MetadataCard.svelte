<script lang="ts">

	import MetadataItem from '$lib/components/Analytics/MetadataItem.svelte';

	export interface MetadataItemConfig {
		label: string;
		value: string | number;
		type?: 'text' | 'number' | 'date' | 'datetime';
		canCopy?: boolean;
		icon?: string;
		indicator?: {
			value: number;
			trend: 'up' | 'down' | 'neutral';
		};
		chart?: {
			type: 'line' | 'pie' | 'bar';
			data: any[];
		};
		subtitle?: string;
	}

	export interface MetadataCardProps {
		title: string;
		subtitle?: string;
		icon?: string;
		badge?: {
			text: string;
			icon?: string;
		};
		items: MetadataItemConfig[];
		collapsible?: boolean;
		collapsed?: boolean;
		background?: 'solid' | 'gradient' | 'none';
		gradientFrom?: string;
		gradientTo?: string;
		solidColor?: string;
		border?: boolean;
		columns?: 1 | 2 | 3 | 4 | 5 | 6;
	}

	let {
		title,
		subtitle,
		icon,
		badge,
		items = [],
		collapsible = false,
		collapsed = false,
		background = 'gradient',
		gradientFrom = 'slate-800',
		gradientTo = 'slate-700',
		solidColor = 'slate-800',
		border = true,
		columns = 4
	}: MetadataCardProps = $props();

	let isCollapsed = $state(collapsed);

	function toggleCollapse() {
		if (collapsible) {
			isCollapsed = !isCollapsed;
		}
	}

	function getHeaderBackground(): string {
		switch (background) {
			case 'gradient':
				return `bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`;
			case 'solid':
				return `bg-${solidColor}`;
			case 'none':
				return 'bg-transparent';
			default:
				return `bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`;
		}
	}

	function getGridColumns(): string {
		const colMap = {
			1: 'md:grid-cols-1',
			2: 'md:grid-cols-2',
			3: 'md:grid-cols-3',
			4: 'md:grid-cols-2 lg:grid-cols-4',
			5: 'md:grid-cols-3 lg:grid-cols-5',
			6: 'md:grid-cols-3 lg:grid-cols-6'
		};
		return colMap[columns] || colMap[4];
	}
</script>

<div class="overflow-hidden rounded-xl shadow-sm mb-5 {border ? 'ring-1 ring-slate-200' : ''}">
	<!-- Header -->
	<div class="{getHeaderBackground()} px-6 py-4">
		<div class="flex items-center justify-between">
			<button
				onclick={toggleCollapse}
				class="flex items-center gap-3 flex-1 {collapsible ? 'cursor-pointer hover:opacity-90' : 'cursor-default'} transition-opacity"
				disabled={!collapsible}
			>
				{#if icon}
					<div class="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
						{@html icon}
					</div>
				{/if}

				<div class="text-left">
					<h3 class="text-base font-semibold text-white">{title}</h3>
					{#if subtitle}
						<p class="text-xs text-white/80">{subtitle}</p>
					{/if}
				</div>

				{#if collapsible}
					<svg
						class="w-5 h-5 text-white ml-2 transition-transform {isCollapsed ? '' : 'rotate-180'}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
					</svg>
				{/if}
			</button>

			{#if badge}
				<div class="flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-full backdrop-blur-sm flex-shrink-0">
					{#if badge.icon}
						{@html badge.icon}
					{/if}
					<span class="text-sm font-medium text-white">{badge.text}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Content -->
	{#if !isCollapsed}
		<div class="bg-white {border ? 'border-x border-b border-slate-200' : ''}">
			<div class="grid grid-cols-1 {getGridColumns()} gap-px bg-slate-200">
				{#each items as item}
					<MetadataItem {...item} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
    /* Allow dynamic Tailwind classes */
    :global(.from-slate-800) { --tw-gradient-from: #1e293b; }
    :global(.to-slate-700) { --tw-gradient-to: #334155; }
    :global(.from-emerald-500) { --tw-gradient-from: #10b981; }
    :global(.to-emerald-600) { --tw-gradient-to: #059669; }
    :global(.from-amber-500) { --tw-gradient-from: #f59e0b; }
    :global(.to-amber-600) { --tw-gradient-to: #d97706; }
    :global(.from-blue-500) { --tw-gradient-from: #3b82f6; }
    :global(.to-blue-600) { --tw-gradient-to: #2563eb; }
    :global(.bg-slate-800) { background-color: #1e293b; }
</style>